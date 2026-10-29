import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Check,
  Tractor,
  Droplet,
  Sprout,
  Grid3X3,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react";
import type { ServiceRequestPipelineItem } from "../types/maintenance.types";
import {
  useGetFieldOfficerByFarmlandIdQuery,
  useAssignFieldOfficerMutation,
  type FieldOfficerItem,
} from "../api/maintenanceServiceRequestApi";
import { toast } from "sonner";

interface AssignFieldOfficerModalProps {
  isOpen: boolean;
  item: ServiceRequestPipelineItem | null;
  onClose: () => void;
  onAssignSuccess: (item: ServiceRequestPipelineItem, officerName: string) => void;
}

const getOfficerName = (fo: FieldOfficerItem): string => {
  return (
    fo.name ||
    (fo.first_name ? `${fo.first_name} ${fo.last_name || ""}`.trim() : "") ||
    fo.full_name ||
    fo.officer_name ||
    "Field Officer"
  );
};

const getOfficerInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (name.slice(0, 2) || "FO").toUpperCase();
};

export const AssignFieldOfficerModal: React.FC<AssignFieldOfficerModalProps> = ({
  isOpen,
  item,
  onClose,
  onAssignSuccess,
}) => {
  const farmlandIdNum = useMemo(() => {
    if (!item) return 0;
    if (typeof item.farmlandId === "number" && item.farmlandId > 0) return item.farmlandId;
    if (typeof item.serviceRequestId === "number" && item.serviceRequestId > 0) return item.serviceRequestId;
    if (typeof item.id === "number" && item.id > 0) return item.id;
    const fNum = Number(item.farmlandId);
    if (!isNaN(fNum) && fNum > 0) return fNum;
    const sNum = Number(item.serviceRequestId);
    if (!isNaN(sNum) && sNum > 0) return sNum;
    const idNum = Number(item.id);
    if (!isNaN(idNum) && idNum > 0) return idNum;
    const digits = String(item.farmlandId || item.id || "").replace(/\D/g, "");
    return Number(digits) || 0;
  }, [item]);

  const {
    data: officerApiResponse,
    isLoading: isOfficerLoading,
    isFetching: isOfficerFetching,
    error: officerApiError,
  } = useGetFieldOfficerByFarmlandIdQuery(
    { farmland_id: farmlandIdNum },
    { skip: !isOpen || !item || isNaN(farmlandIdNum) || farmlandIdNum <= 0 }
  );

  const backendErrorMessage = useMemo<string>(() => {
    if (officerApiError && typeof officerApiError === "object" && "data" in officerApiError) {
      const errData = (officerApiError as any).data;
      if (typeof errData === "string") return errData;
      if (errData && typeof errData === "object") {
        return errData.message || errData.error || "";
      }
    }
    // The API can also answer 200 with { success: false, message }
    if (!officerApiError && (officerApiResponse as any)?.success === false) {
      return (officerApiResponse as any)?.message || "";
    }
    return "";
  }, [officerApiError, officerApiResponse]);

  // The farmland has no region / area yet: no field officer can be looked up or assigned until
  // they are set, so the Role Manager is asked to assign them (not to create a field officer)
  const isRegionAreaMissing = /region|area/i.test(backendErrorMessage) && /not\s+assigned/i.test(backendErrorMessage);

  const fieldOfficersList = useMemo<FieldOfficerItem[]>(() => {
    if (!officerApiResponse?.data) return [];
    const raw = officerApiResponse.data;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "object") {
      if (Array.isArray((raw as any).officers)) return (raw as any).officers;
      if (Array.isArray((raw as any).rows)) return (raw as any).rows;
      if (Array.isArray((raw as any).fieldOfficers)) return (raw as any).fieldOfficers;
      if ((raw as any).officer && typeof (raw as any).officer === "object") return [(raw as any).officer];
      if ((raw as any).fieldOfficer && typeof (raw as any).fieldOfficer === "object") return [(raw as any).fieldOfficer];
      if ((raw as any).name || (raw as any).first_name || (raw as any).id) return [raw as FieldOfficerItem];
    }
    return [];
  }, [officerApiResponse]);

  const [selectedOfficer, setSelectedOfficer] = useState<string>("Rajesh Kumar");
  const [selectedOfficerId, setSelectedOfficerId] = useState<string | number | null>(null);
  const [isNotifiedRoleManager, setIsNotifiedRoleManager] = useState<boolean>(false);
  const [showAssignedSuccess, setShowAssignedSuccess] = useState<boolean>(false);
  const [showNotificationSentModal, setShowNotificationSentModal] = useState<boolean>(false);

  const [assignFieldOfficer, { isLoading: isAssigning }] = useAssignFieldOfficerMutation();

  useEffect(() => {
    if (fieldOfficersList.length > 0) {
      const first = fieldOfficersList[0];
      const name = getOfficerName(first);
      setSelectedOfficer(name);
      setSelectedOfficerId(first.id || first.officer_id || first.user_id || null);
    }
  }, [fieldOfficersList]);

  const primaryServiceName =
    item?.servicesList && item.servicesList.length > 0
      ? item.servicesList[0].name
      : item?.serviceCategory === "Borewell"
      ? "Borewell"
      : item?.serviceCategory || "Borewell";

  const servicesList = useMemo(() => {
    if (!item) return [];
    if (item.servicesList && item.servicesList.length > 0) {
      const seen = new Set<string>();
      return item.servicesList.filter((s) => {
        const key = (s.name || "").trim().toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    return [
      {
        name: primaryServiceName,
        icon: item?.iconType || ("borewell" as const),
        subtitle: item?.description || "Required on priority",
      },
    ];
  }, [item, primaryServiceName]);

  const formattedLandSize = useMemo(() => {
    if (!item?.landSize) return "5.00 Acres";
    const str = String(item.landSize).trim();
    if (str.toLowerCase().includes("acre")) return str;
    return `${str} Acres`;
  }, [item?.landSize]);

  if (!isOpen || !item) return null;

  const hasFieldOfficer = fieldOfficersList.length > 0;

  const assignedOfficerName = selectedOfficer || (fieldOfficersList[0] ? getOfficerName(fieldOfficersList[0]) : "Field Officer");

  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "farmhouse":
        return <Tractor className="w-4 h-4 text-[#10B981] stroke-[2.2]" />;
      case "borewell":
        return <Droplet className="w-4 h-4 text-[#10B981] stroke-[2.2]" />;
      case "organic":
        return <Sprout className="w-4 h-4 text-[#10B981] stroke-[2.2]" />;
      case "fencing":
      default:
        return <Grid3X3 className="w-4 h-4 text-[#10B981] stroke-[2.2]" />;
    }
  };

  const handleConfirmAssign = async () => {
    const rawSrId = item.serviceRequestId || item.id;
    const serviceRequestId = Number(rawSrId);

    let officerId = Number(selectedOfficerId);
    if (!officerId || isNaN(officerId)) {
      const found = fieldOfficersList.find((fo) => getOfficerName(fo) === selectedOfficer);
      officerId = Number(
        found?.id ||
        found?.officer_id ||
        found?.user_id ||
        fieldOfficersList[0]?.id ||
        fieldOfficersList[0]?.officer_id ||
        fieldOfficersList[0]?.user_id ||
        0
      );
    }

    if (!serviceRequestId || isNaN(serviceRequestId)) {
      toast.error("Invalid service request ID");
      return;
    }

    if (!officerId || isNaN(officerId)) {
      toast.error("Please select a valid field officer");
      return;
    }

    try {
      const res = await assignFieldOfficer({
        service_request_id: serviceRequestId,
        field_officer_id: officerId,
        remarks:
          item.requirementsText ||
          item.userNotes ||
          item.description ||
          "Assigned for soil sampling and field verification",
      }).unwrap();

      if (res?.message) {
        toast.success(res.message);
      } else {
        toast.success("Field officer assigned successfully!");
      }

      setShowAssignedSuccess(true);
    } catch (err: any) {
      console.error("Failed to assign field officer:", err);
      const errorMsg =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        "Failed to assign field officer. Please try again.";
      toast.error(errorMsg);
    }
  };

  const handleDoneAssigned = () => {
    setShowAssignedSuccess(false);
    onAssignSuccess(item, assignedOfficerName);
    onClose();
  };

  const handleRequestRoleManager = () => {
    setIsNotifiedRoleManager(true);
    setShowNotificationSentModal(true);
  };

  const handleCloseNotificationSent = () => {
    setShowNotificationSentModal(false);
  };

  return (
    <>
      {/* ── Main Assign Field Officer Dialog (Images 1 & 3) ────────────────── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-[24px] sm:rounded-[28px] max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100 max-h-[92vh] overflow-y-auto">
          {/* Top Header */}
          <div className="flex items-start justify-between pb-5 border-b border-gray-100">
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                ID: {item.landId || item.code}
              </span>
              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[20px] sm:text-[22px] text-[#1A1C1D] m-0 leading-tight">
                Assign Field Officer – {primaryServiceName}
              </h2>
              <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-gray-500 font-normal mt-1 m-0">
                Select a ground officer specialist and dispatch for land verification.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer transition-colors shrink-0"
              title="Close"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {/* 2-Column Split Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            {/* ── Left Column: Request Overview ──────────────────────────────── */}
            <div className="lg:col-span-6 flex flex-col gap-4.5 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                  REQUEST OVERVIEW
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-[#10B981] bg-[#E8F8F3]">
                  Active Request
                </span>
              </div>

              {/* Data Rows */}
              <div className="flex flex-col gap-3.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-normal">Land ID</span>
                  <span className="font-bold text-[#1A1C1D]">{item.landId || item.code}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-normal">Customer Name</span>
                  <span className="font-bold text-[#1A1C1D]">{item.customerName}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-normal">Land Size</span>
                  <span className="font-bold text-[#1A1C1D]">{formattedLandSize}</span>
                </div>

                <div className="flex items-start justify-between py-1 border-b border-gray-50 gap-4">
                  <span className="text-gray-500 font-normal shrink-0">Address</span>
                  <span className="text-right text-gray-700 font-medium text-xs leading-relaxed max-w-[260px]">
                    {item.address || "Plot 42, Green Valley, Shamshabad Mandal, Hyderabad."}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-500 font-normal">Preferred Visit</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-[#FEF7EC] text-[#D97706] border border-[#FDE68A]">
                    {item.preferredVisitDate || "Oct 24, 2026"}
                  </span>
                </div>
              </div>

              {/* Requested Services */}
              <div className="mt-1 flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Requested Services
                </span>
                <div className="flex flex-col gap-2 pl-1">
                  {servicesList.map((svc, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-800">
                      {renderServiceIcon(svc.icon)}
                      <span className="font-semibold text-[#1A1C1D]">{svc.name}</span>
                      {svc.subtitle && (
                        <span className="text-gray-500 font-normal text-[11px]">
                          {svc.subtitle}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Notes */}
              <div className="mt-1 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Customer Notes
                </span>
                <div className="bg-[#F9FAFB] rounded-xl p-3.5 border border-gray-100 text-xs text-gray-700 italic leading-relaxed">
                  "{item.requirementsText || item.userNotes || item.description || "Need a 2-BHK farmhouse with a wide porch and deep borewell near the north gate."}"
                </div>
              </div>
            </div>

            {/* ── Right Column: Select Field Officer ─────────────────────────── */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#1A1C1D] m-0">
                    Select Field Officer
                  </h3>
                </div>
                <p className="text-xs text-gray-400 font-normal mt-0.5 mb-5 m-0">
                  {hasFieldOfficer
                    ? "Choose one specialist for assignment & verification dispatch."
                    : isRegionAreaMissing
                    ? "Field officers are assigned by region and area, which this farmland does not have yet."
                    : "No field officer currently assigned for this region."}
                </p>

                {isOfficerLoading || isOfficerFetching ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="w-7 h-7 text-[#1877F2] animate-spin mb-2" />
                    <p className="text-xs text-gray-500 font-medium m-0">
                      Fetching field officers for this region...
                    </p>
                  </div>
                ) : hasFieldOfficer ? (
                  /* Case A: Field Officer Available for Region (Image 1) */
                  <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
                    {fieldOfficersList.map((fo, idx) => {
                      const offName = getOfficerName(fo);
                      const offId = fo.id || fo.officer_id || fo.user_id || idx;
                      const isSelected = selectedOfficer === offName || selectedOfficerId === offId;
                      const initials = getOfficerInitials(offName);
                      const roleSubtitle =
                        fo.role ||
                        fo.designation ||
                        [fo.mandal, fo.district, fo.location].filter(Boolean).join(", ") ||
                        "Field Verification Officer";

                      return (
                        <div
                          key={offId}
                          onClick={() => {
                            setSelectedOfficer(offName);
                            setSelectedOfficerId(offId);
                          }}
                          className={`border-2 rounded-2xl p-4 flex items-center justify-between bg-white shadow-xs cursor-pointer transition-all ${
                            isSelected
                              ? "border-[#1877F2] bg-[#F8FAFC]"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Radio dot */}
                            <div className="w-5 h-5 rounded-full border-2 border-[#1877F2] flex items-center justify-center p-0.5 bg-white shrink-0">
                              {isSelected && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
                              )}
                            </div>

                            {/* Initials Avatar */}
                            <div className="w-10 h-10 rounded-full bg-[#EBF5FA] text-[#1877F2] font-bold text-xs flex items-center justify-center tracking-wide overflow-hidden shrink-0">
                              {fo.profile_url || fo.avatar ? (
                                <img
                                  src={fo.profile_url || fo.avatar}
                                  alt={offName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                initials
                              )}
                            </div>

                            {/* Name & Role */}
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-[#1A1C1D]">
                                {offName}
                              </span>
                              <span className="text-[11px] text-gray-500 font-normal mt-0.5">
                                {roleSubtitle}
                              </span>
                            </div>
                          </div>

                          {(fo.phone || fo.mobile || fo.contact_no) && (
                            <span className="text-xs text-gray-400 font-medium hidden sm:inline-block">
                              {fo.phone || fo.mobile || fo.contact_no}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Case B: No Field Officer for this region (Image 3 & 4) */
                  <div className="flex flex-col items-center">
                    <p className="text-xs text-[#DC2626] bg-[#FEF2F2] border border-[#FEE2E2] px-3.5 py-2.5 rounded-xl text-center mb-4 m-0 font-medium w-full">
                      {backendErrorMessage || "Region and area are not assigned for this farmland."}
                    </p>

                    {isNotifiedRoleManager ? (
                      /* After Notification Sent */
                      <div className="w-full border-2 border-[#10B981]/30 bg-[#F0FDF4] rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-2xs">
                            <FileText className="w-4 h-4 text-[#10B981]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs sm:text-sm text-[#1A1C1D]">
                              Inform Role Manager
                            </span>
                            <span className="text-[11px] text-gray-500 mt-0.5">
                              The role manager has been notified
                            </span>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-[#10B981] bg-[#DCFCE7] shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Notification Sent
                        </span>
                      </div>
                    ) : (
                      /* Initial Request Role Manager Card (Image 3) */
                      <div className="w-full border border-gray-200 rounded-2xl p-4 flex items-center justify-between bg-white shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shadow-2xs">
                            <FileText className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs sm:text-sm text-[#1A1C1D]">
                              Inform Role Manager
                            </span>
                            <span className="text-[11px] text-gray-500 mt-0.5 max-w-[190px]">
                              {isRegionAreaMissing
                                ? "Send a notification to role manager to assign a region and area for this farmland"
                                : "Send a notification to role manager to create field officer for this region"}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRequestRoleManager}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#F1F5F9] hover:bg-gray-200 text-[#334155] rounded-full text-xs font-semibold cursor-pointer border-none transition-colors shrink-0"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          Request Role Manager
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-8 mt-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-full border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 bg-white cursor-pointer transition-colors"
                >
                  {hasFieldOfficer ? "Cancel" : "Dismiss"}
                </button>

                {hasFieldOfficer && (
                  <button
                    type="button"
                    disabled={isAssigning}
                    onClick={handleConfirmAssign}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-75 disabled:cursor-not-allowed text-white font-semibold text-xs cursor-pointer border-none shadow-2xs hover:shadow-xs active:scale-98 transition-all"
                  >
                    {isAssigning ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Assigning...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Confirm & Assign Officer to Dispatch</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Field Officer Assigned! Modal (Image 2) ────────────────────────── */}
      {showAssignedSuccess && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] max-w-[380px] w-full p-6 sm:p-7 shadow-2xl relative flex flex-col items-center text-center animate-in zoom-in-95 duration-200 border border-gray-100">
            <button
              type="button"
              onClick={handleDoneAssigned}
              className="absolute top-4 right-4 w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer transition-colors"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Solid Green Circle with Checkmark */}
            <div className="w-14 h-14 rounded-full bg-[#10B981] text-white flex items-center justify-center mb-3.5 mt-1 shadow-xs">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#111827] m-0 mb-1 leading-snug">
              Field Officer Assigned!
            </h3>

            <p className="font-['Plus_Jakarta_Sans'] text-xs text-gray-500 m-0 mb-5 leading-relaxed font-normal px-2">
              <span className="font-semibold text-gray-800">{assignedOfficerName}</span> has been assigned to this request and dispatched for site verification.
            </p>

            <button
              type="button"
              onClick={handleDoneAssigned}
              className="w-full py-2.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold text-xs border-none cursor-pointer shadow-2xs hover:shadow-xs transition-all active:scale-98"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── Notification sent Modal (Image 4) ────────────────────────────────── */}
      {showNotificationSentModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] max-w-[380px] w-full p-6 sm:p-7 shadow-2xl relative flex flex-col items-center text-center animate-in zoom-in-95 duration-200 border border-gray-100">
            {/* Green Outline Circle with Checkmark */}
            <div className="w-14 h-14 rounded-full border-2 border-[#10B981] text-[#10B981] flex items-center justify-center mb-3.5 mt-1">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#111827] m-0 mb-1 leading-snug">
              Notification sent
            </h3>

            <p className="font-['Plus_Jakarta_Sans'] text-xs text-gray-500 m-0 mb-5 leading-relaxed font-normal px-2">
              {isRegionAreaMissing
                ? "The role manager has been notified to assign a region and area for this farmland."
                : "The role manager has been notified to create a field officer for this region."}
            </p>

            <button
              type="button"
              onClick={handleCloseNotificationSent}
              className="w-full py-2.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold text-xs border-none cursor-pointer shadow-2xs hover:shadow-xs transition-all active:scale-98"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
