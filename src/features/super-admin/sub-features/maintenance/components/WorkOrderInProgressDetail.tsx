import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Check,
  MoreHorizontal,
  Lock,
  MapPin,
  ClipboardList,
} from "lucide-react";
import { S3Image } from "@/components/common/S3Image";
import type { WorkOrderPipelineItem } from "../types/maintenance.types";
import {
  useGetServiceStagesByServiceIdQuery,
  useGetWorkOrderStagesQuery,
} from "../api/maintenanceServiceRequestApi";
import { useMaintenanceMasterData } from "../hooks/useMaintenanceMasterData";
import { getMasterServiceStages, mapServiceStages, mapWorkOrderStages } from "../utils/workOrderMapping";

interface WorkOrderInProgressDetailProps {
  item: WorkOrderPipelineItem;
  // getFarmlandById has finished; the work order stages are loaded after it (defaults to true)
  isFarmlandDetailsLoaded?: boolean;
  onBack: () => void;
}

// Shown wherever the backend sends no value
const NO_DATA_TEXT = "No data available";

// getWorkOrderStages `stage_id` when neither the work order nor master data gives one
const DEFAULT_WORK_ORDER_STAGE_ID = 1;

const parseDisplayDateToISO = (displayDateStr: string): string => {
  try {
    const d = new Date(displayDateStr);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  } catch {}
  return "";
};

const formatISOToShortTag = (isoStr: string): string => {
  try {
    const [year, month, day] = isoStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {}
  return "";
};

export const WorkOrderInProgressDetail: React.FC<WorkOrderInProgressDetailProps> = ({
  item,
  isFarmlandDetailsLoaded = true,
  onBack,
}) => {
  const isCompleted = item.status === "Completed";
  const { masterData, isLoading: isMasterDataLoading } = useMaintenanceMasterData();

  // Work orders (one per service) of this farmland from getWorkOrderFarmlands
  const workOrderServices = item.workOrderServices || [];

  // Selected service, remembered per farmland (sessionStorage)
  const getDefaultServiceKey = (): string | undefined => {
    try {
      const saved = sessionStorage.getItem(`glc_wo_service_${item.id}`);
      if (saved && workOrderServices.some((ref) => ref.key === saved)) return saved;
    } catch {}
    return workOrderServices[0]?.key;
  };

  const [selectedServiceKey, setSelectedServiceKey] = useState<string | undefined>(getDefaultServiceKey);
  // The services can load after the page (refresh / getFarmlandById): pick one once they arrive
  useEffect(() => {
    if (!workOrderServices.some((ref) => ref.key === selectedServiceKey)) {
      setSelectedServiceKey(getDefaultServiceKey());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workOrderServices]);

  const selectedWorkOrder = workOrderServices.find((ref) => ref.key === selectedServiceKey);
  const selectedWorkOrderId = selectedWorkOrder?.workOrderId;

  // Stages of the selected service for the timeline (getServiceStagesByServiceId)
  const selectedServiceId = selectedWorkOrder?.serviceId;
  const { data: serviceStagesResponse, isFetching: isServiceStagesFetching } =
    useGetServiceStagesByServiceIdQuery({ service_id: selectedServiceId ?? 0 }, { skip: !selectedServiceId });
  const serviceStages = useMemo(
    () => (selectedServiceId ? mapServiceStages(serviceStagesResponse) : []),
    [serviceStagesResponse, selectedServiceId]
  );

  // stage_id of getWorkOrderStages (required by the backend): the work order's current stage
  // (list / getFarmlandById), else the service's first stage (service stages API, then master data),
  // else the first stage
  const selectedStageId =
    selectedWorkOrder?.stageId ??
    serviceStages[0]?.id ??
    getMasterServiceStages(masterData, selectedServiceId)[0]?.id ??
    DEFAULT_WORK_ORDER_STAGE_ID;

  // Stages, progress, photos and the FO note of the selected work order (getWorkOrderStages),
  // called once getFarmlandById has finished; the service's stages from master data until the
  // backend has a work order for it
  // Without the work order's own stage id, the service stages and master data are awaited too so
  // stage_id is sent only once
  const isStagesQueryReady =
    isFarmlandDetailsLoaded &&
    (!!selectedWorkOrder?.stageId || (!isMasterDataLoading && !isServiceStagesFetching));
  const { data: stagesResponse, isFetching: isStagesQueryFetching } = useGetWorkOrderStagesQuery(
    { work_order_id: selectedWorkOrderId ?? 0, stage_id: selectedStageId },
    { skip: !selectedWorkOrderId || !isStagesQueryReady }
  );
  const isStagesFetching = isStagesQueryFetching || (!!selectedWorkOrderId && !isStagesQueryReady);
  useEffect(() => {
    if (isFarmlandDetailsLoaded && !selectedWorkOrderId) {
      console.warn(
        "getWorkOrderStages not called: no work_order_id in getWorkOrderFarmlands / getFarmlandById for",
        item.farmlandId || item.id
      );
    }
  }, [isFarmlandDetailsLoaded, selectedWorkOrderId, item.farmlandId, item.id]);
  const stagesView = useMemo(
    () =>
      mapWorkOrderStages(
        selectedWorkOrderId ? stagesResponse : undefined,
        masterData,
        selectedServiceId,
        serviceStages
      ),
    [stagesResponse, masterData, selectedWorkOrderId, selectedServiceId, serviceStages]
  );

  // Latest backend stage update (photo date tags)
  const isoDate = stagesView.latestUpdate ? parseDisplayDateToISO(stagesView.latestUpdate) : "";

  const handleServiceChange = (serviceKey: string) => {
    setSelectedServiceKey(serviceKey);
    try {
      sessionStorage.setItem(`glc_wo_service_${item.id}`, serviceKey);
    } catch {}
  };

  const shortDateTag = isoDate ? formatISOToShortTag(isoDate) : "";

  const farmlandId = item.farmlandId || item.code || "—";
  const customerName = item.customerName || "—";
  const rawLoc = item.location && item.location !== "—" ? item.location : "—";
  const location =
    rawLoc === "—"
      ? "—"
      : rawLoc.includes("Mandal") || rawLoc.includes("District") || rawLoc.includes(",")
      ? rawLoc
      : `${rawLoc} Mandal`;
  const assignedFO = item.assignedFO || "Not assigned";
  const serviceTitle = selectedWorkOrder?.serviceName || NO_DATA_TEXT;

  // Completed work orders show every stage done at 100%
  const effectiveProgress = isCompleted ? 100 : stagesView.progress;
  const effectivePhases = isCompleted
    ? stagesView.stages.map((p) => ({ ...p, status: "DONE" as const }))
    : stagesView.stages;
  const sitePhotos = stagesView.photos;
  const effectiveNote = stagesView.latestNote;

  const selectedWorkOrderLabel = selectedWorkOrder?.workOrderCode || selectedWorkOrderId;
  const cleanCode = selectedWorkOrderLabel ? `ID – ${selectedWorkOrderLabel}` : "—";


  return (
    <div className="w-full flex flex-col font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200">
      {/* ── Breadcrumbs ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-xs text-[#7A8699] mb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-[#7A8699] hover:text-[#1E75BB] font-medium bg-transparent border-none cursor-pointer p-0 transition-colors"
        >
          Work Orders
        </button>
        <span className="text-[#CBD5E1]">&gt;</span>
        <span className="font-semibold text-[#1A1C1D]">
          {farmlandId} – {serviceTitle}
        </span>
      </div>

      {/* ── Top Header & Controls ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-[#E2E8F0] flex items-center justify-center cursor-pointer transition-colors text-[#1A1C1D] shadow-2xs shrink-0"
            title="Back to Work Order Pipeline table"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[24px] sm:text-[28px] text-[#1A1C1D] m-0 tracking-tight">
              Work Order Pipeline
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#7A8699] font-normal mt-1 m-0">
              Manage and track work orders across all mandals.
            </p>
          </div>
        </div>

        {/* Right Controls: Service Dropdown & Interactive Update Date Picker */}
        <div className="flex flex-wrap items-center gap-4 self-start md:self-auto">
          {/* Service Selector */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-[#7A8699]">Service</span>
            <div className="relative">
              <select
                value={selectedServiceKey ?? ""}
                onChange={(e) => handleServiceChange(e.target.value)}
                disabled={workOrderServices.length === 0}
                className="h-[42px] bg-[#F4F5F7] text-xs font-semibold text-[#111827] pl-4 pr-9 rounded-xl border border-transparent outline-hidden cursor-pointer appearance-none min-w-[200px] disabled:cursor-not-allowed"
              >
                {workOrderServices.length === 0 ? (
                  <option value="">{NO_DATA_TEXT}</option>
                ) : (
                  workOrderServices.map((ref) => (
                    <option key={ref.key} value={ref.key}>
                      {ref.serviceName}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-Column Main Content Grid matching Figma Images ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Card: Progress & Milestones (Span 6) ───────────────────────── */}
        <div className="lg:col-span-6 bg-white rounded-[24px] border border-[#ECEFF2] p-6 sm:p-7 shadow-2xs flex flex-col gap-5">
          {/* Work in progress or Completed badge + Title */}
          <div>
            {isCompleted ? (
              <span className="inline-block bg-[#DCFCE7] text-[#15803D] font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                COMPLETED
              </span>
            ) : (
              <span className="inline-block bg-[#DCFCE7] text-[#15803D] font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                WORK IN PROGRESS
              </span>
            )}
            <h2 className="text-[20px] sm:text-[22px] font-bold text-[#111827] m-0 tracking-tight">
              {serviceTitle}: {cleanCode}
            </h2>
          </div>

          {/* Customer & Farmland Info Strip */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shadow-2xs shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[14px] text-[#111827]">
                  {farmlandId}
                </span>
                <span className="text-xs text-[#7A8699] flex items-center gap-1 font-normal mt-0.5">
                  <MapPin className="w-3 h-3 text-[#7A8699]" /> {location}
                </span>
              </div>
            </div>

            <div className="flex flex-col text-right">
              <span className="text-[11px] font-normal text-[#7A8699]">
                {isCompleted ? "Assigned FO" : "User name"}
              </span>
              <span className="font-bold text-[14px] text-[#111827] mt-0.5">
                {isCompleted ? assignedFO : customerName}
              </span>
            </div>
          </div>

          {/* Overall Progress Block */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-bold text-[#111827]">
              Overall Progress: {effectiveProgress}%
            </span>
            <div className="w-full h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted ? "bg-[#22C55E]" : "bg-[#86EFAC]"
                }`}
                style={{ width: `${effectiveProgress}%` }}
              />
            </div>
          </div>

          {/* Construction Phase Checklist */}
          <div className="flex flex-col gap-2.5 pt-1">
            <span className="text-xs font-bold text-[#111827]">
              Construction Phase
            </span>

            <div className="flex flex-col gap-2">
              {effectivePhases.length === 0 && (
                <div className="p-3 rounded-xl bg-[#F8FAFC] text-xs font-semibold text-[#64748B] text-center">
                  {isStagesFetching ? "Loading stages..." : NO_DATA_TEXT}
                </div>
              )}
              {effectivePhases.map((phase, idx) => {
                if (phase.status === "DONE") {
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4.5 h-4.5 rounded-full bg-[#15803D] flex items-center justify-center text-white shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-xs font-medium text-[#111827]">
                          {phase.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#374151]">
                        DONE
                      </span>
                    </div>
                  );
                }

                if (phase.status === "IN PROGRESS") {
                  return (
                    <div
                      key={idx}
                      className="bg-[#F2FBF4] rounded-xl p-3 flex items-center justify-between border border-[#DCFCE7]/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4.5 h-4.5 rounded-full border-1.5 border-[#15803D] flex items-center justify-center text-[#15803D] shrink-0">
                          <MoreHorizontal className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-bold text-[#111827]">
                          {phase.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#15803D]">
                        IN PROGRESS
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl text-[#9CA3AF]"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                      <span className="text-xs font-normal text-[#9CA3AF]">
                        {phase.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#9CA3AF]">
                      PENDING
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right Card: Latest FO Site Updates & 4 Photos (Span 6) ───────────── */}
        <div className="lg:col-span-6 bg-white rounded-[24px] border border-[#ECEFF2] p-6 sm:p-7 shadow-2xs flex flex-col gap-5">
          <div>
            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#111827] m-0 tracking-tight">
              Latest FO Site Updates
            </h3>
            <p className="text-xs text-[#7A8699] font-normal mt-1 m-0">
              Field Officer reports from {farmlandId}
            </p>
          </div>

          {/* Site Photos (from the work order stages) with GPS overlays */}
          {sitePhotos.length === 0 && (
            <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] py-10 text-center text-xs font-semibold text-[#64748B]">
              {isStagesFetching ? "Loading site updates..." : NO_DATA_TEXT}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3.5">
            {sitePhotos.map((photo, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden h-[150px] sm:h-[180px] shadow-2xs group bg-gray-100"
              >
                <S3Image
                  src={photo.url}
                  alt={`Site update ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {(() => {
                  const photoIso = photo.date ? parseDisplayDateToISO(photo.date) : "";
                  const dateTag = (photoIso && formatISOToShortTag(photoIso)) || shortDateTag;
                  const overlay = [dateTag, photo.tag].filter(Boolean).join(", ");
                  return overlay ? (
                    <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-medium px-2 py-0.5 rounded-md shadow-xs">
                      {overlay}
                    </div>
                  ) : null;
                })()}
              </div>
            ))}
          </div>

          {/* Field Officer's Note Box */}
          <div className="bg-[#F4FBF7] rounded-2xl p-4 border border-[#DCFCE7]/60 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] flex items-center justify-center shrink-0 text-[#15803D] mt-0.5">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-[#111827]">
                Field Officer&apos;s Note
              </span>
              <p className="text-xs text-[#4B5563] m-0 mt-1 leading-relaxed">
                {effectiveNote ? `“${effectiveNote}”` : NO_DATA_TEXT}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
