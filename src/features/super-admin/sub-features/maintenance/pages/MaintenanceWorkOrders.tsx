import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MaintenanceNavbar } from "../components/MaintenanceNavbar";
import { WorkOrderInProgressDetail } from "../components/WorkOrderInProgressDetail";
import { ServiceRequestFilterModal } from "../components/ServiceRequestFilterModal";
import type { WorkOrderPipelineItem } from "../types/maintenance.types";
import {
  useGetFarmlandByIdQuery,
  useGetWorkOrderFarmlandsQuery,
} from "../api/maintenanceServiceRequestApi";
import { useMaintenanceMasterData } from "../hooks/useMaintenanceMasterData";
import {
  getFarmlandRecord,
  getResponseList,
  mapFarmlandToWorkOrder,
  mergeWorkOrderRows,
  mergeWorkOrderServices,
} from "../utils/workOrderMapping";
import { useGetAllGeoMasterDataQuery } from "@/features/super-admin/api/masterData.api";
import { formatLocation } from "@/features/super-admin/utils/locationUtils";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export default function MaintenanceWorkOrders() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  // Maintenance master data (/master/get_all_master_data): work order / stage status names
  const { masterData } = useMaintenanceMasterData();
  const { data: geoData } = useGetAllGeoMasterDataQuery();

  // Work order farmlands of all field officers (getWorkOrderFarmlands); refetched when a service
  // is moved to work order. Rows of the same farmland are merged.
  const {
    data: workOrderFarmlandsResponse,
    isLoading: isWorkOrdersLoading,
    isError: isWorkOrdersError,
  } = useGetWorkOrderFarmlandsQuery({ offset: 0 });

  // Work orders shown in both tabs
  const allWorkOrders = useMemo<WorkOrderPipelineItem[]>(() => {
    if (workOrderFarmlandsResponse?.success === false) return [];
    const sourceRows = getResponseList(workOrderFarmlandsResponse, "farmlands", "workOrders", "work_orders");
    return mergeWorkOrderRows(sourceRows.map((row, idx) => mapFarmlandToWorkOrder(row, idx, masterData, geoData)));
  }, [workOrderFarmlandsResponse, masterData, geoData]);
  const isWorkOrdersLoadFailed = isWorkOrdersError || workOrderFarmlandsResponse?.success === false;

  // Initialize active tab with sessionStorage persistence
  const getInitialTab = (): "In - Progress" | "Completed" => {
    try {
      const savedTab = sessionStorage.getItem("glc_active_work_order_tab");
      if (savedTab === "In - Progress" || savedTab === "Completed") {
        return savedTab;
      }
    } catch {}
    return "In - Progress";
  };

  const [activeTab, setActiveTab] = useState<"In - Progress" | "Completed">(getInitialTab);
  const [search, setSearch] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Active detail item; restored from the URL / storage once the backend list has loaded (below)
  const [activeDetailItem, setActiveDetailItem] = useState<WorkOrderPipelineItem | null>(null);

  // Check URL params or storage on load / change
  useEffect(() => {
    const queryId = searchParams.get("id");
    const savedId = sessionStorage.getItem("glc_active_work_order_id");
    const targetId = params.id || queryId || savedId;
    if (targetId) {
      const found = allWorkOrders.find(
        (w) =>
          w.id === targetId ||
          w.farmlandId === targetId ||
          w.code.replace("#", "") === targetId.replace("#", "")
      );
      if (found) {
        setActiveDetailItem(found);
      }
    }
  }, [params.id, searchParams, allWorkOrders]);

  // Coming from Move to Work Order: open the In-Progress tab (the list reloads from the backend)
  useEffect(() => {
    if (location.state?.newWorkOrder) {
      setActiveTab("In - Progress");
    } else if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleTabChange = (tab: "In - Progress" | "Completed") => {
    setActiveTab(tab);
    setCurrentPage(1);
    try {
      sessionStorage.setItem("glc_active_work_order_tab", tab);
    } catch {}
  };

  const handleSelectDetail = (item: WorkOrderPipelineItem) => {
    setActiveDetailItem(item);
    try {
      sessionStorage.setItem("glc_active_work_order_id", item.id);
      sessionStorage.setItem("glc_active_work_order_tab", activeTab);
    } catch {}

    const isPreview = location.pathname.includes("/preview");
    const isSuperAdmin = location.pathname.includes("/super-admin/maintenance");
    const basePath = isPreview
      ? "/maintenance/preview/work-orders"
      : isSuperAdmin
      ? "/super-admin/maintenance/work-orders"
      : "/maintenance/work-orders";

    navigate(`${basePath}?id=${encodeURIComponent(item.id)}`, { replace: true });
  };

  const handleBackToList = () => {
    setActiveDetailItem(null);
    try {
      sessionStorage.removeItem("glc_active_work_order_id");
    } catch {}

    const isPreview = location.pathname.includes("/preview");
    const isSuperAdmin = location.pathname.includes("/super-admin/maintenance");
    const basePath = isPreview
      ? "/maintenance/preview/work-orders"
      : isSuperAdmin
      ? "/super-admin/maintenance/work-orders"
      : "/maintenance/work-orders";

    navigate(basePath, { replace: true });
  };

  // View Details: the backend farmland (getFarmlandById) refreshes the work order's details
  const detailFarmlandId = activeDetailItem?.backendFarmlandId;
  const {
    data: detailFarmlandResponse,
    isFetching: isDetailFarmlandFetching,
    isSuccess: isDetailFarmlandSuccess,
    isError: isDetailFarmlandError,
  } = useGetFarmlandByIdQuery({ farmland_id: detailFarmlandId ?? 0 }, { skip: !detailFarmlandId });
  // getWorkOrderStages is called only after getFarmlandById has responded (success or error) for
  // this farmland; not before the request has started. Nothing to wait for without a farmland id.
  const isDetailFarmlandSettled =
    !detailFarmlandId ||
    (!isDetailFarmlandFetching && (isDetailFarmlandSuccess || isDetailFarmlandError));
  const detailItem = useMemo(() => {
    if (!activeDetailItem) return null;
    const record = detailFarmlandId ? getFarmlandRecord(detailFarmlandResponse) : undefined;
    if (!record) return activeDetailItem;
    const fromBackend = mapFarmlandToWorkOrder(record, 0, masterData, geoData);
    return {
      ...activeDetailItem,
      // Work orders from the list; getFarmlandById adds the farmland's other moved services
      workOrderServices: mergeWorkOrderServices(
        activeDetailItem.workOrderServices,
        fromBackend.workOrderServices
      ),
      farmlandId: fromBackend.farmlandId || activeDetailItem.farmlandId,
      customerName:
        fromBackend.customerName !== "—" ? fromBackend.customerName : activeDetailItem.customerName,
      location: fromBackend.location !== "—" ? fromBackend.location : activeDetailItem.location,
      assignedFO:
        fromBackend.assignedFO !== "Not assigned" ? fromBackend.assignedFO : activeDetailItem.assignedFO,
      surveyNumber: fromBackend.surveyNumber || activeDetailItem.surveyNumber,
    };
  }, [activeDetailItem, detailFarmlandId, detailFarmlandResponse, masterData, geoData]);

  const filteredOrders = allWorkOrders.filter((item) => {
    const statusMatch =
      activeTab === "In - Progress" ? item.status === "In Progress" : item.status === "Completed";

    const searchMatch =
      search.trim() === "" ||
      (item.farmlandId && item.farmlandId.toLowerCase().includes(search.toLowerCase())) ||
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.assignedFO.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase());

    const serviceMatch =
      selectedServices.length === 0 ||
      selectedServices.some(
        (s) =>
          item.category.toLowerCase().includes(s.toLowerCase()) ||
          (s === "Borewell" && item.category === "BOREWELL") ||
          (s === "Fencing" && item.category === "FENCING") ||
          (s === "Farmhouse" && item.category === "FARMHOUSE") ||
          (s === "Organic Management" && (item.category === "ORGANIC" || item.category === "ORGANIC FARMING"))
      );

    return statusMatch && searchMatch && serviceMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const renderServiceBadge = (category: string, extraCount?: number) => {
    const cat = category.toUpperCase();
    let badgeClass = "bg-[#E0F2FE] text-[#0284C7]";
    let label = category;

    if (cat.includes("BOREWELL")) {
      badgeClass = "bg-[#E0F2FE] text-[#0284C7]";
      label = "BOREWELL";
    } else if (cat.includes("FENCING")) {
      badgeClass = "bg-[#FFEDD5] text-[#C2410C]";
      label = "FENCING";
    } else if (cat.includes("FARMHOUSE")) {
      badgeClass = "bg-[#F3E8FF] text-[#9333EA]";
      label = "FARMHOUSE";
    } else if (cat.includes("ORGANIC")) {
      badgeClass = "bg-[#DCFCE7] text-[#16A34A]";
      label = "ORGANIC FARMING";
    }

    return (
      <div className="flex items-center gap-1.5">
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${badgeClass}`}>
          {label}
        </span>
        {extraCount && extraCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#64748B]">
            +{extraCount}
          </span>
        )}
      </div>
    );
  };

  // If a work order detail is selected, render the detail view with refresh persistence
  if (detailItem) {
    return (
      <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-['Plus_Jakarta_Sans']">
        <MaintenanceNavbar activeTab="work-orders" />
        <main className="flex-1 w-full px-6 sm:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 flex flex-col">
          <WorkOrderInProgressDetail
            item={detailItem}
            isFarmlandDetailsLoaded={isDetailFarmlandSettled}
            onBack={handleBackToList}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-['Plus_Jakarta_Sans']">
      <MaintenanceNavbar activeTab="work-orders" />

      <main className="flex-1 w-full px-6 sm:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 flex flex-col">
        {/* ── Top Header & Search Bar matching Figma Images 1 & 3 ─────────────── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[24px] sm:text-[28px] text-[#1A1C1D] m-0 tracking-tight">
              Work Order Pipeline
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#7A8699] font-normal mt-1 m-0">
              Manage and track work orders across all mandals.
            </p>
          </div>

          {/* Search Bar matching Figma */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads, Services..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F4F5F7] border-none rounded-full text-xs text-gray-900 outline-hidden focus:ring-2 focus:ring-[#1E75BB]/20 placeholder:text-gray-400 font-normal"
            />
          </div>
        </div>

        {/* ── Filters & Stage Selector Row ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Left: Filter Modal Trigger Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-[#E2E8F0] rounded-full font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#1E75BB] cursor-pointer shadow-2xs transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>

          {/* Right: Stage Navigation Tabs (In - Progress / Completed) */}
          <div className="flex items-center bg-[#F1F4F8] p-1 rounded-full self-start sm:self-auto">
            {(["In - Progress", "Completed"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`px-5 py-2 rounded-full font-['Plus_Jakarta_Sans'] text-xs font-bold transition-all border-none cursor-pointer ${
                  activeTab === tab
                    ? "bg-white text-[#1A1C1D] shadow-xs"
                    : "bg-transparent text-[#64748B] hover:text-[#1A1C1D]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table Container matching Figma Images 1 & 3 ─────────────────────── */}
        <div className="bg-white rounded-[24px] border border-[#ECEFF2] overflow-hidden shadow-2xs flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[#EEF2F6]">
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7A8699] uppercase tracking-wider">
                    FARMLAND ID
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7A8699] uppercase tracking-wider">
                    LOCATION
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7A8699] uppercase tracking-wider">
                    SERVICES
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7A8699] uppercase tracking-wider">
                    ASSIGNED FO
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7A8699] uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7A8699] uppercase tracking-wider text-right">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xs text-gray-400 font-medium">
                      {isWorkOrdersLoading
                        ? "Loading work orders..."
                        : isWorkOrdersLoadFailed
                        ? "Unable to load work orders. Please try again."
                        : "No data available"}
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((item) => {
                    const farmlandId = item.farmlandId || item.code.replace("#", "");
                    const isPending = item.uploadTag === "PENDING UPLOAD" || (activeTab === "In - Progress" && item.updatePending);
                    const isRecent = item.uploadTag === "RECENTLY ADDED";

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                        {/* 1. Farmland ID + Upload Badge */}
                        <td className="px-6 py-4 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <span className="bg-[#F1F3F5] text-[#334155] font-bold text-xs px-2.5 py-1 rounded-md tracking-tight">
                              {farmlandId}
                            </span>
                            {isPending && (
                              <span className="inline-flex items-center gap-1.5 bg-[#FEECEC] text-[#EF4444] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                                PENDING UPLOAD
                              </span>
                            )}
                            {isRecent && (
                              <span className="inline-flex items-center gap-1.5 bg-[#DCFCE7] text-[#16A34A] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                                RECENTLY ADDED
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 2. Location */}
                        <td className="px-6 py-4 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-[#334155] font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                            <span>
                              {item.location && item.location !== "—"
                                ? item.location
                                : formatLocation((item as any).raw, geoData)}
                            </span>
                          </div>
                        </td>

                        {/* 3. Services */}
                        <td className="px-6 py-4 align-middle whitespace-nowrap">
                          {renderServiceBadge(item.category, item.servicesExtraCount)}
                        </td>

                        {/* 4. Assigned FO */}
                        <td className="px-6 py-4 align-middle whitespace-nowrap">
                          <span className="text-xs font-bold text-[#111827]">
                            {item.assignedFO}
                          </span>
                        </td>

                        {/* 5. Status */}
                        <td className="px-6 py-4 align-middle whitespace-nowrap">
                          {activeTab === "In - Progress" ? (
                            <span className="inline-flex items-center gap-1.5 bg-[#F1F3F5] text-[#1E293B] font-semibold text-xs px-3.5 py-1 rounded-full">
                              <span className="w-2 h-2 rounded-full bg-[#1E293B]" />
                              Work In Progress
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[#16A34A] font-semibold text-xs">
                              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                              Completed
                            </span>
                          )}
                        </td>

                        {/* 6. Action */}
                        <td className="px-6 py-4 align-middle whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => handleSelectDetail(item)}
                            className="px-4.5 py-1.5 rounded-full bg-[#1E75BB] hover:bg-[#1864A0] text-white font-semibold text-xs border-none cursor-pointer transition-colors shadow-2xs"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Bottom Pagination Row matching Figma Images 1 & 3 ──────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#EEF2F6] text-xs text-[#64748B] font-medium bg-white">
            <div className="flex items-center gap-4">
              <span>
                Showing <strong className="text-[#111827]">{(currentPage - 1) * rowsPerPage + (filteredOrders.length > 0 ? 1 : 0)} - {Math.min(currentPage * rowsPerPage, filteredOrders.length)}</strong> of <strong className="text-[#111827]">{filteredOrders.length}</strong> work orders
              </span>

              {/* Rows per page selector */}
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span>Rows:</span>
                <div className="relative">
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-transparent border border-gray-200 rounded-lg pl-2 pr-6 py-1 text-xs font-semibold text-gray-700 appearance-none cursor-pointer outline-hidden focus:border-[#1E75BB]"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-2.5 py-1 rounded-md text-xs font-semibold text-[#64748B] hover:text-[#111827] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 bg-transparent border-none cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-md font-bold text-xs transition-all border-none cursor-pointer ${
                    currentPage === page
                      ? "bg-[#1E75BB] text-white shadow-xs"
                      : "bg-transparent text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-2.5 py-1 rounded-md text-xs font-semibold text-[#64748B] hover:text-[#111827] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 bg-transparent border-none cursor-pointer transition-colors"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Filter Modal ────────────────────────────────────────────────────── */}
      <ServiceRequestFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        selectedServices={selectedServices}
        selectedDateRange={null}
        onApply={(services) => {
          setSelectedServices(services);
          setCurrentPage(1);
        }}
        onClear={() => {
          setSelectedServices([]);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
