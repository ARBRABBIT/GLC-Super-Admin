import { useState, useEffect, useMemo } from "react";
import { MaintenanceNavbar } from "../components/MaintenanceNavbar";
import { ServiceRequestFilterModal } from "../components/ServiceRequestFilterModal";
import { GeneratedEstimationModal } from "../components/GeneratedEstimationModal";
import { EstimationSuccessModal } from "../components/EstimationSuccessModal";
import { QuotationStatusDetailsModal } from "../components/QuotationStatusDetailsModal";
import { UnderVerificationDetailsModal } from "../components/UnderVerificationDetailsModal";
import { AssignFieldOfficerModal } from "../components/AssignFieldOfficerModal";
import MaintenanceVerifyRequest from "./MaintenanceVerifyRequest";
import { createWorkOrderFromServiceRequest, INITIAL_SERVICE_REQUESTS } from "../data/maintenanceData";
import type { ServiceRequestPipelineItem, WorkOrderPipelineItem } from "../types/maintenance.types";
import { Search, SlidersHorizontal, X, Loader2, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  useGetAllMaintenanceFarmlandsQuery,
  useLazyGetFarmlandByIdQuery,
  mapApiFarmlandToServiceRequest,
  type MaintenanceFarmlandItem,
  type GetAllMaintenanceFarmlandsPayload,
} from "../api/maintenanceServiceRequestApi";
import { useGetAllGeoMasterDataQuery } from "@/features/super-admin/api/masterData.api";
import { formatLocation } from "@/features/super-admin/utils/locationUtils";
import {
  useMaintenanceMasterData,
  getQuotationApprovalStatusText,
  QUOTATION_GIVEN_STATUS_ID,
  QUOTATIONS_TAB_REQUEST_STATUS_IDS,
  MAINTENANCE_APPROVED_REQUEST_STATUS_ID,
  CUSTOMER_RESPONSE_TAB_QUERY_REQUEST_STATUS_IDS,
  CUSTOMER_RESPONSE_TAB_SERVICE_STATUS_IDS,
  USER_APPROVED_SERVICE_STATUS_ID,
  USER_REJECTED_SERVICE_STATUS_ID,
  USER_REJECTED_REQUEST_STATUS_ID,
  MAINTENANCE_APPROVED_LABEL,
  PARTIALLY_APPROVED_LABEL,
} from "../hooks/useMaintenanceMasterData";

type ActiveTabType = "New Requests" | "Quotations" | "Customer Response";

// Backend service_id used by getAllMaintenanceFarmlands `service_ids`
// (1 Farmhouse, 2 Fencing, 3 Borewell, 4 Organic — same as the field officer app and estimation APIs)
const SERVICE_NAME_TO_ID_MAP: Record<string, number> = {
  "Farmhouse": 1,
  "Farmhouse Construction": 1,
  "Fencing": 2,
  "Bore Well": 3,
  "Borewell": 3,
  "Organic Management": 4,
  "Organic Farming": 4,
  "Solar Setup": 5,
  "Land Demarcation": 6,
};

const getServiceIdByName = (name: string): number | undefined => {
  if (SERVICE_NAME_TO_ID_MAP[name]) {
    return SERVICE_NAME_TO_ID_MAP[name];
  }
  const normalized = name.trim().toLowerCase();
  // "organic" is checked before "farm" so "Organic Farming" is not read as Farmhouse
  if (normalized.includes("organic") || normalized.includes("agri")) return 4;
  if (normalized.includes("fence") || normalized.includes("fencing")) return 2;
  if (normalized.includes("bore")) return 3;
  if (normalized.includes("farm") || normalized.includes("house") || normalized.includes("villa")) return 1;
  if (normalized.includes("solar")) return 5;
  if (normalized.includes("demarcation") || normalized.includes("land")) return 6;
  return undefined;
};

// service_request_item list of a farmland record (list row or getFarmlandById payload)
const getRowServiceItems = (raw: any): any[] =>
  (Array.isArray(raw?.service_request_item) && raw.service_request_item) ||
  (Array.isArray(raw?.service_request_items) && raw.service_request_items) ||
  [];

// Fields the backend may use to say a service item has a field-officer estimation (quotation)
const ESTIMATION_INFO_FIELDS = ["estimation", "estimation_id", "has_estimation", "is_estimation_submitted"];

const isTruthyFlag = (value: unknown): boolean =>
  value !== null && value !== undefined && value !== false && value !== 0 && value !== "0" && value !== "";

// A farmland belongs in Quotations only once the field officer has given at least one quotation
// (estimation). Uses the row-level flag or the service items; returns undefined when the list data
// carries no estimation information, so the row stays visible.
const hasSubmittedEstimation = (raw: any): boolean | undefined => {
  if (raw && typeof raw === "object") {
    const rowField = ["has_estimation", "is_estimation_submitted"].find((field) => field in raw);
    if (rowField) return isTruthyFlag(raw[rowField]);
  }
  const items = getRowServiceItems(raw);
  const withInfo = items.filter(
    (it) => it && typeof it === "object" && ESTIMATION_INFO_FIELDS.some((field) => field in it)
  );
  if (withInfo.length === 0) return undefined;
  return withInfo.some((it) =>
    ESTIMATION_INFO_FIELDS.some((field) =>
      field === "estimation" && it.estimation && typeof it.estimation === "object"
        ? Number(it.estimation.is_submitted ?? 1) !== 0 // estimation object: must be submitted
        : isTruthyFlag(it[field])
    )
  );
};

const STORAGE_KEY = "glc_maintenance_sr_filters";

interface StoredFilters {
  tab?: ActiveTabType;
  search?: string;
  services?: string[];
  dateRange?: { start: string; end: string } | null;
  quotePills?: string[];
  respPills?: string[];
}

const getStoredFilters = (): StoredFilters => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
};

const ACTIVE_STAGE_STORAGE_KEY = "glc_service_requests_active_stage";
const VALID_STAGES: ActiveTabType[] = ["New Requests", "Quotations", "Customer Response"];

// Stage tab last selected in this browser session (saved by setActiveStage / the filters effect)
const getStoredActiveStage = (): ActiveTabType | undefined => {
  try {
    const stored =
      sessionStorage.getItem(ACTIVE_STAGE_STORAGE_KEY) || getStoredFilters().tab || undefined;
    return VALID_STAGES.includes(stored as ActiveTabType) ? (stored as ActiveTabType) : undefined;
  } catch {
    return undefined;
  }
};

export default function MaintenanceServiceRequests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const storedFilters = useMemo(() => getStoredFilters(), []);

  const getInitialStage = (): ActiveTabType => {
    const path = location.pathname.toLowerCase();
    if (path.includes("/new-request") || path.includes("/new_request")) return "New Requests";
    if (path.includes("/quotation")) return "Quotations";
    if (path.includes("/customer-response") || path.includes("/customer_response")) return "Customer Response";

    const urlTab = searchParams.get("tab") || searchParams.get("stage");
    if (urlTab) {
      if (urlTab.toLowerCase().includes("customer") || urlTab.toLowerCase().includes("response"))
        return "Customer Response";
      if (urlTab.toLowerCase().includes("quote") || urlTab.toLowerCase().includes("quotation"))
        return "Quotations";
      if (urlTab.toLowerCase().includes("new")) return "New Requests";
    }

    // No stage in the URL (e.g. after a page refresh): restore the tab last selected in this session
    const storedStage = getStoredActiveStage();
    if (storedStage) return storedStage;

    return "New Requests";
  };

  const getInitialSearch = (): string => {
    return searchParams.get("search") || searchParams.get("q") || storedFilters.search || "";
  };

  const getInitialServices = (): string[] => {
    const urlServices = searchParams.get("services");
    if (urlServices) {
      return urlServices.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return Array.isArray(storedFilters.services) ? storedFilters.services : [];
  };

  const getInitialDateRange = (): { start: string; end: string } | null => {
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");
    if (start && end) {
      return { start, end };
    }
    return storedFilters.dateRange || null;
  };

  const getInitialQuotePills = (): string[] => {
    const urlPills = searchParams.get("quotePills");
    if (urlPills) {
      return urlPills.split(",").map((p) => p.trim()).filter(Boolean);
    }
    return Array.isArray(storedFilters.quotePills) && storedFilters.quotePills.length > 0
      ? storedFilters.quotePills
      : ["Quoted", "Under Verification"];
  };

  const getInitialRespPills = (): string[] => {
    const urlPills = searchParams.get("respPills");
    if (urlPills) {
      return urlPills.split(",").map((p) => p.trim()).filter(Boolean);
    }
    return Array.isArray(storedFilters.respPills) && storedFilters.respPills.length > 0
      ? storedFilters.respPills
      : ["Accepted", "Awaiting", "Rejected"];
  };

  const [requests, setRequests] = useState<ServiceRequestPipelineItem[]>(INITIAL_SERVICE_REQUESTS);
  const [search, setSearch] = useState<string>(getInitialSearch);
  const [activeStage, setActiveStageState] = useState<ActiveTabType>(getInitialStage);

  useEffect(() => {
    const stageFromRoute = getInitialStage();
    setActiveStageState((prev) => (prev !== stageFromRoute ? stageFromRoute : prev));
  }, [location.pathname, searchParams]);

  const setActiveStage = (stg: ActiveTabType) => {
    setActiveStageState(stg);
    try {
      sessionStorage.setItem(ACTIVE_STAGE_STORAGE_KEY, stg);
    } catch {
      // ignore
    }
  };

  // Quotations filter pills: "Quoted" and "Under Verification"
  const [quotationFilterPills, setQuotationFilterPills] = useState<string[]>(getInitialQuotePills);

  // Customer Response filter pills: "Accepted", "Awaiting", "Rejected"
  const [customerResponseFilterPills, setCustomerResponseFilterPills] = useState<string[]>(getInitialRespPills);

  // Service filter selection
  const [selectedServices, setSelectedServices] = useState<string[]>(getInitialServices);
  const [activeMonthFilter, setActiveMonthFilter] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: string; end: string } | null>(getInitialDateRange);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeVerifyItem, setActiveVerifyItem] = useState<ServiceRequestPipelineItem | null>(null);
  const [assignOfficerItem, setAssignOfficerItem] = useState<ServiceRequestPipelineItem | null>(null);
  const [verifyingFarmlandId, setVerifyingFarmlandId] = useState<string | number | null>(null);
  const [getFarmlandByIdTrigger] = useLazyGetFarmlandByIdQuery();

  // Quotations: whether each farmland has a field-officer estimation (farmlandId → true/false).
  // Farmlands without one are not shown in the Quotations table.
  const [estimationSubmittedByFarmland, setEstimationSubmittedByFarmland] = useState<
    Record<string, boolean>
  >({});

  // Modal states
  const [estimationItem, setEstimationItem] = useState<ServiceRequestPipelineItem | null>(null);
  const [successItemCode, setSuccessItemCode] = useState<string | null>(null);
  const [quotationDetailsItem, setQuotationDetailsItem] =
    useState<ServiceRequestPipelineItem | null>(null);
  const [underVerificationItem, setUnderVerificationItem] =
    useState<ServiceRequestPipelineItem | null>(null);

  // Synchronize state changes to Session Storage without polluting URL searchParams with filter values
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          tab: activeStage,
          search,
          services: selectedServices,
          dateRange: selectedDateRange,
          quotePills: quotationFilterPills,
          respPills: customerResponseFilterPills,
        })
      );
    } catch {
      // ignore
    }

    // Keep route clean: remove any filter query params (services, dates, pills, search) from the URL
    const currentTabParam = searchParams.get("tab");
    const hasUnwantedParams =
      searchParams.has("services") ||
      searchParams.has("startDate") ||
      searchParams.has("endDate") ||
      searchParams.has("quotePills") ||
      searchParams.has("respPills") ||
      searchParams.has("search") ||
      searchParams.has("q");

    if (hasUnwantedParams || (currentTabParam && currentTabParam !== activeStage)) {
      const cleanParams = new URLSearchParams();
      if (currentTabParam) {
        cleanParams.set("tab", activeStage);
      }
      setSearchParams(cleanParams, { replace: true });
    }
  }, [
    activeStage,
    search,
    selectedServices,
    selectedDateRange,
    quotationFilterPills,
    customerResponseFilterPills,
    searchParams,
    setSearchParams,
  ]);

  // Compute selected service IDs
  const serviceIds = useMemo(() => {
    return selectedServices
      .map((s) => {
        if (typeof s === "number") return s;
        if (!isNaN(Number(s)) && String(s).trim() !== "") return Number(s);
        return getServiceIdByName(s);
      })
      .filter((id): id is number => typeof id === "number" && !isNaN(id));
  }, [selectedServices]);

  // Query Master Data for system-configured status IDs
  const { masterData } = useMaintenanceMasterData();
  // Query Geo Master Data to resolve location IDs (country, state, district, mandal)
  const { data: geoData } = useGetAllGeoMasterDataQuery();

  // Quotations tab request_status_id: 3 ("Quotation Given")
  const quotationStatusId = QUOTATION_GIVEN_STATUS_ID;

  // Dynamically resolve request_status_id for New Requests from master data
  const newRequestsStatusId = useMemo<number>(() => {
    if (!masterData) return 1;
    const milestoneStatuses = masterData.milestoneStageStatusResult || [];
    const matched = milestoneStatuses.find(
      (s: any) =>
        s.code === "PENDNG" ||
        s.code === "NEW" ||
        s.description?.toLowerCase().includes("pending") ||
        s.description?.toLowerCase().includes("new request")
    );
    return matched?.id ? Number(matched.id) : 1;
  }, [masterData]);

  // Dynamically resolve request_status_id for Customer Response from master data
  const customerResponseStatusId = useMemo<number>(() => {
    if (!masterData) return 3;
    const milestoneStatuses = masterData.milestoneStageStatusResult || [];
    const matched = milestoneStatuses.find(
      (s: any) =>
        s.code === "APPRVD" ||
        s.code === "CUSTOMER_RESPONSE" ||
        s.description?.toLowerCase().includes("approved") ||
        s.description?.toLowerCase().includes("customer response")
    );
    return matched?.id ? Number(matched.id) : 3;
  }, [masterData]);

  // Map active stage tab to request_status_id(s) from master data.
  // Quotations also lists maintenance-approved requests (shown as "Maintenance Approved").
  const getStageStatusId = (stage: ActiveTabType): number | number[] => {
    switch (stage) {
      case "New Requests":
        return newRequestsStatusId;
      case "Quotations":
        return QUOTATIONS_TAB_REQUEST_STATUS_IDS;
      case "Customer Response":
        // No request status filter: rows are filtered by service_status_id (user approved 5 /
        // rejected 8) instead
        return CUSTOMER_RESPONSE_TAB_QUERY_REQUEST_STATUS_IDS;
      default:
        return newRequestsStatusId;
    }
  };

  // ─── API Integration for Maintenance Farmlands / Service Requests ────────────
  const queryPayload = useMemo<GetAllMaintenanceFarmlandsPayload>(() => {
    return {
      offset: 0,
      searchString: search.trim(),
      service_ids: serviceIds,
      request_status_id: getStageStatusId(activeStage),
      // Customer Response also filters service items by status: user approved (5) / rejected (9)
      service_status_id:
        activeStage === "Customer Response" ? CUSTOMER_RESPONSE_TAB_SERVICE_STATUS_IDS : [],
      startDate: selectedDateRange?.start ? selectedDateRange.start.trim() : "",
      endDate: selectedDateRange?.end ? selectedDateRange.end.trim() : "",
    };
  }, [
    search,
    serviceIds,
    activeStage,
    newRequestsStatusId,
    quotationStatusId,
    customerResponseStatusId,
    selectedDateRange,
  ]);

  const {
    data: apiResponse,
    isLoading: isApiLoading,
    isFetching: isApiFetching,
    isError,
  } = useGetAllMaintenanceFarmlandsQuery(queryPayload);

  // List rows carry no request status, so the requests in one specific status are fetched with the
  // same filters to label those rows: Quotations → maintenance approved (4), Customer Response →
  // rejected by the user (9)
  const labelStatusId =
    activeStage === "Quotations"
      ? MAINTENANCE_APPROVED_REQUEST_STATUS_ID
      : activeStage === "Customer Response"
      ? USER_REJECTED_REQUEST_STATUS_ID
      : undefined;
  const { data: labelStatusResponse } = useGetAllMaintenanceFarmlandsQuery(
    { ...queryPayload, request_status_id: [labelStatusId ?? MAINTENANCE_APPROVED_REQUEST_STATUS_ID] },
    { skip: labelStatusId === undefined }
  );
  const labelStatusRequestIds = useMemo(() => {
    const data: any = labelStatusResponse?.data;
    const rows: any[] = Array.isArray(data) ? data : data?.rows || data?.farmlands || [];
    return new Set(
      rows
        .map((row) => String(row?.service_request_id ?? ""))
        .filter((requestId) => requestId !== "")
    );
  }, [labelStatusResponse]);

  useEffect(() => {
    if (apiResponse) {
      let rawList: MaintenanceFarmlandItem[] = [];
      if (Array.isArray(apiResponse.data)) {
        rawList = apiResponse.data;
      } else if (apiResponse.data && typeof apiResponse.data === "object") {
        if (Array.isArray((apiResponse.data as any).rows)) {
          rawList = (apiResponse.data as any).rows;
        } else if (Array.isArray((apiResponse.data as any).farmlands)) {
          rawList = (apiResponse.data as any).farmlands;
        }
      } else if (Array.isArray(apiResponse as any)) {
        rawList = apiResponse as any;
      }

      if (rawList.length > 0) {
        const mapped = rawList.map((item, idx) => {
          const mappedItem = mapApiFarmlandToServiceRequest(item, idx, activeStage, quotationStatusId, geoData);
          if (activeStage === "Customer Response") {
            // Item statuses decide first: any service approved by the user (5) → Accepted, only
            // rejected ones (8) → Rejected. Otherwise request status 9 = rejected, else approved.
            const itemStatusIds = getRowServiceItems(item).map((it) => Number(it?.service_status_id));
            const requestStatusId = Number((item as any).request_status_id ?? (item as any).status_id);
            const isRejected = itemStatusIds.includes(USER_APPROVED_SERVICE_STATUS_ID)
              ? false
              : itemStatusIds.includes(USER_REJECTED_SERVICE_STATUS_ID) ||
                requestStatusId === USER_REJECTED_REQUEST_STATUS_ID ||
                labelStatusRequestIds.has(String((item as any).service_request_id ?? ""));
            const customerResponseStatus: "Accepted" | "Rejected" = isRejected ? "Rejected" : "Accepted";
            return { ...mappedItem, customerResponseStatus, statusText: customerResponseStatus };
          }
          if (activeStage !== "Quotations") return mappedItem;
          // Status from the backend item statuses: all approved → "Maintenance Approved",
          // some → "Partially Approved", none → unchanged ("Under Verification" / "Quotation Created")
          const isMaintenanceApprovedRequest =
            Number((item as any).request_status_id ?? (item as any).status_id) ===
              MAINTENANCE_APPROVED_REQUEST_STATUS_ID ||
            labelStatusRequestIds.has(String((item as any).service_request_id ?? ""));
          const approvalStatusText = isMaintenanceApprovedRequest
            ? MAINTENANCE_APPROVED_LABEL
            : getQuotationApprovalStatusText(
                (item as any).service_request_item || (item as any).service_request_items || [],
                masterData
              );
          return approvalStatusText ? { ...mappedItem, statusText: approvalStatusText } : mappedItem;
        });
        setRequests(mapped);
      } else {
        setRequests(INITIAL_SERVICE_REQUESTS);
      }
    } else if (isError) {
      setRequests(INITIAL_SERVICE_REQUESTS);
    }
  }, [apiResponse, isError, activeStage, quotationStatusId, masterData, labelStatusRequestIds, geoData]);

  // Check each Quotations row for a submitted estimation using only the list data (no per-row
  // getFarmlandById calls). Rows whose items carry `estimation` are hidden when none is submitted;
  // rows without that information stay visible.
  useEffect(() => {
    if (activeStage !== "Quotations") return;
    const updates: Record<string, boolean> = {};
    requests.forEach((item) => {
      const farmlandKey = String(item.farmlandId ?? "");
      if (!farmlandKey || farmlandKey in estimationSubmittedByFarmland) return;
      // Maintenance-approved quotations always have an estimation
      if (item.statusText === MAINTENANCE_APPROVED_LABEL || item.statusText === PARTIALLY_APPROVED_LABEL) {
        updates[farmlandKey] = true;
        return;
      }
      const fromList = hasSubmittedEstimation((item as any).raw);
      if (fromList !== undefined) updates[farmlandKey] = fromList;
    });
    if (Object.keys(updates).length > 0) {
      setEstimationSubmittedByFarmland((prev) => ({ ...prev, ...updates }));
    }
  }, [activeStage, requests, estimationSubmittedByFarmland]);

  // Re-check after the list reloads (e.g. a field officer submitted an estimation meanwhile)
  useEffect(() => {
    setEstimationSubmittedByFarmland({});
  }, [apiResponse]);

  const handleToggleQuotationPill = (pill: string) => {
    if (quotationFilterPills.includes(pill)) {
      if (quotationFilterPills.length > 1) {
        setQuotationFilterPills(quotationFilterPills.filter((p) => p !== pill));
      } else {
        setQuotationFilterPills(["Quoted", "Under Verification"]);
      }
    } else {
      setQuotationFilterPills([...quotationFilterPills, pill]);
    }
  };

  // Filter requests based on stage, search, and active tags
  const filteredRequests = requests.filter((item) => {
    // Stage matching
    let matchesStage = false;
    if (activeStage === "New Requests") {
      matchesStage = item.stage === "New Requests" || !item.stage;
    } else if (activeStage === "Quotations") {
      matchesStage =
        (item.stage === "Quotations" || item.stage === "Under Verification") &&
        // Hide farmlands whose field officer estimation has not been submitted yet
        estimationSubmittedByFarmland[String(item.farmlandId ?? "")] !== false;
    } else if (activeStage === "Customer Response") {
      matchesStage = item.stage === "Customer Response" || item.customerResponseStatus !== undefined;
    }

    const itemLoc =
      item.location && item.location !== "—" ? item.location : formatLocation(item.raw, geoData);

    const matchesSearch =
      search.trim() === "" ||
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (item.assignedOfficer && item.assignedOfficer.toLowerCase().includes(search.toLowerCase())) ||
      item.serviceCategory.toLowerCase().includes(search.toLowerCase()) ||
      itemLoc.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      (item.landId && item.landId.toLowerCase().includes(search.toLowerCase()));

    if (!matchesStage || !matchesSearch) return false;

    if (activeStage === "Quotations") {
      if (quotationFilterPills.length === 1) {
        // "Quoted" = quotation ready (created / fully maintenance approved);
        // "Under Verification" = still being verified (incl. partially approved)
        const isQuotedStatus =
          item.statusText === "Quotation Created" || item.statusText === MAINTENANCE_APPROVED_LABEL;
        if (quotationFilterPills.includes("Quoted") && !isQuotedStatus) return false;
        if (quotationFilterPills.includes("Under Verification") && isQuotedStatus) return false;
      }
      return true;
    }

    if (activeStage === "Customer Response") {
      if (customerResponseFilterPills.length < 3) {
        const itemRespStatus = item.customerResponseStatus || "Accepted";
        if (!customerResponseFilterPills.includes(itemRespStatus)) return false;
      }
      return true;
    }

    return true;
  });

  const handleRemoveFilter = (filterName: string) => {
    if (filterName === "May" || filterName === activeMonthFilter) {
      setActiveMonthFilter(null);
      setSelectedDateRange(null);
    } else {
      setSelectedServices(selectedServices.filter((s) => s !== filterName));
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  // Reset page when stage, search, or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeStage, search, quotationFilterPills, customerResponseFilterPills, selectedServices, selectedDateRange]);

  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRequests.slice(start, start + rowsPerPage);
  }, [filteredRequests, currentPage, rowsPerPage]);

  const renderCustomerResponseServices = (item: ServiceRequestPipelineItem) => {
    const cat = (item.serviceCategory || "").toLowerCase();
    if (cat.includes("bore")) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E0F2FE] text-[#0284C7] uppercase">
          BOREWELL
        </span>
      );
    }
    if (cat.includes("fenc")) {
      return (
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFEDD5] text-[#C2410C] uppercase">
            FENCING
          </span>
          {item.serviceCategoryExtra && (
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white text-gray-500 border border-gray-200">
              {item.serviceCategoryExtra}
            </span>
          )}
        </span>
      );
    }
    if (cat.includes("farm") || cat.includes("house")) {
      return (
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F3E8FF] text-[#7E22CE] uppercase">
            FARMHOUSE
          </span>
          {item.serviceCategoryExtra && (
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white text-gray-500 border border-gray-200">
              {item.serviceCategoryExtra}
            </span>
          )}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D] uppercase">
        {item.serviceCategory}
      </span>
    );
  };

  const handleCardAction = async (
    item: ServiceRequestPipelineItem,
    actionType?: "approve" | "view-details" | "verify-now"
  ) => {
    if (activeStage === "Customer Response") {
      // Numeric farmland id in the URL so the details page can call getFarmlandById (also after a
      // refresh); falls back to the farmland code when no numeric id is known
      const numericFarmlandId = Number((item as any).raw?.farmland_id ?? item.farmlandId);
      const farmlandId =
        Number.isFinite(numericFarmlandId) && numericFarmlandId > 0
          ? String(numericFarmlandId)
          : item.landId || item.code || item.id || "GLCSOS1";
      const isPreview = location.pathname.includes("/preview/");
      const isSuperAdmin = location.pathname.includes("/super-admin/");
      const prefix = isPreview
        ? "/maintenance/preview"
        : isSuperAdmin
        ? "/super-admin/maintenance"
        : "/maintenance";
      navigate(`${prefix}/service-requests/customer-response/${encodeURIComponent(farmlandId)}`, {
        state: { item },
      });
      return;
    }

    if (activeStage === "Quotations") {
      // The quotation page loads getFarmlandById and the under-review details itself,
      // so only the numeric farmland id is resolved here (no duplicate API calls).
      const toPositive = (value: unknown): number | undefined => {
        const num = Number(value);
        return value !== undefined && value !== null && value !== "" && Number.isFinite(num) && num > 0
          ? num
          : undefined;
      };
      const routeFarmlandId =
        toPositive((item as any).raw?.farmland_id) ??
        toPositive(item.farmlandId) ??
        item.landId ??
        item.code ??
        item.id;

      const isPreview = location.pathname.includes("/preview/");
      const isSuperAdmin = location.pathname.includes("/super-admin/");
      const prefix = isPreview
        ? "/maintenance/preview"
        : isSuperAdmin
        ? "/super-admin/maintenance"
        : "/maintenance";
      navigate(`${prefix}/service-requests/quotation/${encodeURIComponent(String(routeFarmlandId))}`, {
        state: { item },
      });
      return;
    }

    if (actionType === "approve") {
      setEstimationItem(item);
    } else if (actionType === "view-details") {
      if (item.stage === "Customer Response") {
        setQuotationDetailsItem(item);
      } else {
        setUnderVerificationItem(item);
      }
    } else {
      // "Verify Now" (New Requests) -> Fetch full farmland details dynamically from backend
      const candidateId =
        (typeof item.farmlandId === "number" && item.farmlandId > 0 ? item.farmlandId : null) ??
        (typeof item.serviceRequestId === "number" && item.serviceRequestId > 0 ? item.serviceRequestId : null) ??
        (typeof item.id === "number" && item.id > 0 ? item.id : null) ??
        (!isNaN(Number(item.farmlandId)) && Number(item.farmlandId) > 0 ? Number(item.farmlandId) : null) ??
        (!isNaN(Number(item.serviceRequestId)) && Number(item.serviceRequestId) > 0 ? Number(item.serviceRequestId) : null) ??
        (!isNaN(Number(item.id)) && Number(item.id) > 0 ? Number(item.id) : null);

      const numId =
        candidateId !== null
          ? candidateId
          : Number(String(item.farmlandId || item.id || "").replace(/\D/g, "")) || 0;

      if (!isNaN(numId) && numId > 0) {
        setVerifyingFarmlandId(item.id);
        try {
          const res = await getFarmlandByIdTrigger({ farmland_id: numId }).unwrap();
          const rawDetail =
            (res?.data && typeof res.data === "object"
              ? (res.data as any).farmland || (res.data as any).data || res.data
              : res?.data) || res;

          if (rawDetail && typeof rawDetail === "object") {
            const mappedDetail = mapApiFarmlandToServiceRequest(
              rawDetail as MaintenanceFarmlandItem,
              0,
              undefined,
              undefined,
              geoData
            );
            setAssignOfficerItem({
              ...item,
              ...mappedDetail,
              id: item.id || mappedDetail.id,
              code: item.code || mappedDetail.code,
              landId: item.landId || mappedDetail.landId,
            });
            return;
          }
        } catch (err) {
          console.warn("getFarmlandById API request error, falling back to item row data:", err);
        } finally {
          setVerifyingFarmlandId(null);
        }
      }

      // "Verify Now" opens Assign Field Officer dialog (Figma Image 1 & 3)
      setAssignOfficerItem(item);
    }
  };

const handleAssignOfficerSuccess = (item: ServiceRequestPipelineItem, officerName: string) => {
  setRequests((prev) =>
    prev.map((r) =>
      r.id === item.id
        ? {
          ...r,
          stage: "Quotations",
          assignedOfficer: officerName,
          statusText: "Under Verification",
          assignedOfficerDetails: {
            name: officerName,
            phone: "+91 98550 05566",
            email: "rajeshkumar@gmail.com",
            assignedDate: new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          },
        }
        : r
    )
  );
};

const handleApproveEstimation = (
  item: ServiceRequestPipelineItem,
  estimationData: { landSize: string; estimatedCost: string; description: string }
) => {
  setRequests((prev) =>
    prev.map((r) =>
      r.id === item.id
        ? {
          ...r,
          landSize: estimationData.landSize,
          estimatedCost: estimationData.estimatedCost,
          serviceDescription: estimationData.description,
          stage: "Quotations",
          customerResponseStatus: "Awaiting",
          statusText: "Quotation Created",
        }
        : r
    )
  );

  const code = item.landId || item.code || "ID 3042";
  setEstimationItem(null);
  setUnderVerificationItem(null);
  setSuccessItemCode(code);
};

const handleMoveToWorkOrder = (item: ServiceRequestPipelineItem) => {
  const newWorkOrder = createWorkOrderFromServiceRequest(item);

  // Save to sessionStorage for persistence
  try {
    const existing = JSON.parse(sessionStorage.getItem("glc_dynamic_work_orders") || "[]");
    const updated = [
      newWorkOrder,
      ...existing.filter((w: WorkOrderPipelineItem) => w.code !== newWorkOrder.code),
    ];
    sessionStorage.setItem("glc_dynamic_work_orders", JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to store work order", e);
  }

  setQuotationDetailsItem(null);

  // Navigate to work orders page with state so the user immediately appears
  const targetPath = location.pathname.includes("/preview/")
    ? "/maintenance/preview/work-orders"
    : "/maintenance/work-orders";

  navigate(targetPath, {
    state: {
      newWorkOrder,
      highlightCustomer: item.customerName,
      activeTab: "In - Progress",
    },
  });
};

// Dynamic Header content
const getHeaderContent = () => {
  switch (activeStage) {
    case "Quotations":
      return {
        title: "Dispatch Pending",
        subtitle: "Ensure all technical requirements and costs are accurately reflected.",
      };
    case "Customer Response":
      return {
        title: "Customer Response",
        subtitle: "Track customer approvals, decisions, and quotation acceptance.",
      };
    case "New Requests":
    default:
      return {
        title: "Service Request Pipeline",
        subtitle: "Manage and track work orders across all mandals.",
      };
  }
};

const { title, subtitle } = getHeaderContent();

// If a request is active for "Verify Now", show the full verification page
if (activeVerifyItem) {
  return (
    <MaintenanceVerifyRequest
      requestItem={activeVerifyItem}
      onBack={() => setActiveVerifyItem(null)}
    />
  );
}

return (
  <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-['Plus_Jakarta_Sans']">
    <MaintenanceNavbar activeTab="service-requests" />

    <main className="flex-1 w-full px-6 sm:px-8 lg:px-12 py-6 sm:py-8 flex flex-col">
      {/* ── Top Header & Search Bar ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[24px] sm:text-[28px] text-[#1A1C1D] m-0 tracking-tight">
              {title}
            </h1>
            {isApiFetching && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                Updating...
              </span>
            )}
          </div>
          <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#7A8699] font-normal mt-1 m-0">
            {subtitle}
          </p>
        </div>

        {/* Search Bar matching Figma */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads, Services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FB] border border-[#E2E8F0] rounded-full text-xs text-gray-900 outline-hidden focus:border-[#1877F2] focus:bg-white shadow-2xs placeholder:text-gray-400 font-normal transition-all"
          />
        </div>
      </div>

      {/* ── Filters & Stage Selector Row ──────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Left: Filter Trigger Button + Active Pill Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Modal Trigger */}
          <button
            type="button"
            onClick={() => setFilterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-[#E2E8F0] rounded-full font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#1877F2] cursor-pointer shadow-2xs transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {(selectedServices.length > 0 || (selectedDateRange && selectedDateRange.start)) && (
              <span className="w-2 h-2 rounded-full bg-[#1877F2]"></span>
            )}
          </button>

          {/* Active Date Range Tag (Visible across all tabs) */}
          {selectedDateRange && selectedDateRange.start && (
            <div className="flex items-center gap-1.5 px-4 py-2 bg-[#F3F4F6] rounded-full text-xs font-semibold text-[#374151]">
              <span>
                {selectedDateRange.start === selectedDateRange.end
                  ? selectedDateRange.start
                  : `${selectedDateRange.start} – ${selectedDateRange.end}`}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDateRange(null)}
                className="w-3.5 h-3.5 flex items-center justify-center text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer p-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Active Selected Services Tags (Visible across all tabs) */}
          {selectedServices.map((svc) => (
            <div
              key={svc}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#F3F4F6] rounded-full text-xs font-semibold text-[#374151]"
            >
              <span>{svc}</span>
              <button
                type="button"
                onClick={() => handleRemoveFilter(svc)}
                className="w-3.5 h-3.5 flex items-center justify-center text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer p-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Stage-specific filter pills */}
          {activeStage === "Quotations" && (
            <>
              <button
                type="button"
                onClick={() => handleToggleQuotationPill("Quoted")}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  quotationFilterPills.includes("Quoted")
                    ? "bg-white border-gray-300 text-gray-900 shadow-2xs"
                    : "bg-[#F3F4F6] border-transparent text-gray-400"
                }`}
              >
                Quoted
              </button>
              <button
                type="button"
                onClick={() => handleToggleQuotationPill("Under Verification")}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  quotationFilterPills.includes("Under Verification")
                    ? "bg-white border-gray-300 text-gray-900 shadow-2xs"
                    : "bg-[#F3F4F6] border-transparent text-gray-400"
                }`}
              >
                Under Verification
              </button>
            </>
          )}
        </div>

        {/* Right: Stage Navigation Tabs (New Requests / Quotations / Customer Response) */}
        <div className="flex items-center bg-[#F1F4F7] p-1 rounded-full self-start lg:self-auto">
          {(["New Requests", "Quotations", "Customer Response"] as const).map((stg) => (
            <button
              key={stg}
              type="button"
              onClick={() => setActiveStage(stg)}
              className={`px-5 py-2 rounded-full font-['Plus_Jakarta_Sans'] text-xs font-semibold transition-all border-none cursor-pointer ${
                activeStage === stg
                  ? "bg-white text-[#1A1C1D] shadow-xs font-bold"
                  : "bg-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {stg}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table Layout matching Figma Design ──────────────────────────────── */}
      {(isApiLoading || isApiFetching) && filteredRequests.length === 0 ? (
        <div className="w-full bg-white rounded-[24px] border border-gray-100 p-12 text-center flex flex-col items-center justify-center shadow-2xs">
          <Loader2 className="w-8 h-8 text-[#1877F2] animate-spin mb-3" />
          <p className="font-bold text-gray-800 text-sm m-0">Loading {activeStage}...</p>
          <p className="text-xs text-gray-400 mt-1 m-0">Fetching latest farmlands data.</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-[#ECEFF2] p-12 text-center flex flex-col items-center justify-center my-auto shadow-2xs">
          <p className="font-bold text-gray-800 text-sm m-0">No data is available</p>
          <p className="text-xs text-gray-400 mt-1 m-0">
            There is no data available from the backend.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setQuotationFilterPills(["Quoted", "Under Verification"]);
              setCustomerResponseFilterPills(["Accepted", "Awaiting", "Rejected"]);
              setSelectedServices([]);
              setSelectedDateRange(null);
              setActiveMonthFilter(null);
            }}
            className="mt-4 px-5 py-2 bg-[#1877F2] text-white rounded-full text-xs font-bold border-none cursor-pointer shadow-2xs hover:bg-[#166FE5]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="w-full bg-white rounded-[24px] border border-gray-100/90 shadow-2xs overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-[#F4F6F8] text-[12px] font-bold text-[#64748B] tracking-wider uppercase border-b border-gray-100">
                  <th className="py-4.5 px-8 font-bold text-[#64748B] w-[14%] whitespace-nowrap">
                    FARMLAND ID
                  </th>
                  <th className="py-4.5 px-6 font-bold text-[#64748B] w-[18%] whitespace-nowrap">
                    {activeStage === "Quotations" ? "FIELD OFFICER" : "CUSTOMER"}
                  </th>
                  <th className="py-4.5 px-6 font-bold text-[#64748B] w-[16%]">
                    SERVICES
                  </th>
                  <th className="py-4.5 px-6 font-bold text-[#64748B] w-[15%]">
                    LOCATION
                  </th>
                  {activeStage === "Customer Response" ? (
                    <th className="py-4.5 px-6 font-bold text-[#64748B] w-[13%] whitespace-nowrap">
                      RESPONSE DATE
                    </th>
                  ) : activeStage === "Quotations" ? (
                    <th className="py-4.5 px-6 font-bold text-[#64748B] w-[13%] whitespace-nowrap">
                      CREATED DATE
                    </th>
                  ) : (
                    <th className="py-4.5 px-6 font-bold text-[#64748B] w-[24%]">
                      REQUEST DETAILS
                    </th>
                  )}
                  {(activeStage === "Quotations" || activeStage === "Customer Response") && (
                    <th className="py-4.5 px-6 font-bold text-[#64748B] w-[11%] whitespace-nowrap">
                      STATUS
                    </th>
                  )}
                  <th className="py-4.5 px-6 font-bold text-[#64748B] text-center w-[9%] whitespace-nowrap">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80 font-['Plus_Jakarta_Sans']">
                {paginatedRequests.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Farmland ID */}
                    <td className="py-4.5 px-8 align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                          activeStage === "Customer Response"
                            ? "bg-[#F1F5F9] text-[#475569]"
                            : "text-[#1877F2] bg-[#E8F1FD] font-bold"
                        }`}
                      >
                        {item.landId || item.code}
                      </span>
                    </td>

                    {/* Field Officer / Customer */}
                    <td className="py-4.5 px-6 align-middle">
                      <span className="font-bold text-[#1A1C1D] text-sm block">
                        {activeStage === "Quotations"
                          ? item.assignedOfficer ||
                            item.assignedOfficerDetails?.name ||
                            item.customerName
                          : item.customerName}
                      </span>
                    </td>

                    {/* Services Column */}
                    <td className="py-4.5 px-6 align-middle">
                      {renderCustomerResponseServices(item)}
                    </td>

                    {/* Location Column */}
                    <td className="py-4.5 px-6 align-middle">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#475569] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>
                          {item.location && item.location !== "—"
                            ? item.location
                            : formatLocation(item.raw, geoData)}
                        </span>
                      </div>
                    </td>

                    {/* Response Date / Created Date / Request Details */}
                    {activeStage === "Customer Response" ? (
                      <td className="py-4.5 px-6 align-middle whitespace-nowrap">
                        <span className="text-xs sm:text-sm text-[#475569] font-normal">
                          {item.createdDate || item.acceptanceDate || item.dateSent || "13 May 2025"}
                        </span>
                      </td>
                    ) : activeStage === "Quotations" ? (
                      <td className="py-4.5 px-6 align-middle whitespace-nowrap">
                        <span className="text-xs sm:text-sm text-[#4B5563] font-normal">
                          {item.createdDate || "12 May 2025"}
                        </span>
                      </td>
                    ) : (
                      <td className="py-4.5 px-6 align-middle">
                        <p className="text-sm text-[#64748B] font-normal truncate max-w-xs md:max-w-sm m-0">
                          {item.description}
                        </p>
                      </td>
                    )}

                    {/* Status Column */}
                    {activeStage === "Quotations" && (
                      <td className="py-4.5 px-6 align-middle whitespace-nowrap">
                        {item.statusText === MAINTENANCE_APPROVED_LABEL ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DBEAFE] text-[#1D4ED8] shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
                            {MAINTENANCE_APPROVED_LABEL}
                          </span>
                        ) : item.statusText === PARTIALLY_APPROVED_LABEL ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFEDD5] text-[#C2410C] shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
                            {PARTIALLY_APPROVED_LABEL}
                          </span>
                        ) : item.statusText === "Quotation Created" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF08A] text-[#854D0E] shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-[#854D0E]" />
                            Quotation Created
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                            Under Verification
                          </span>
                        )}
                      </td>
                    )}

                    {activeStage === "Customer Response" && (
                      <td className="py-4.5 px-6 align-middle whitespace-nowrap">
                        {(item.customerResponseStatus || "Accepted") === "Accepted" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                            Accepted
                          </span>
                        ) : item.customerResponseStatus === "Rejected" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#DC2626] shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7]/80 text-[#15803D] shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                            {item.customerResponseStatus === "Awaiting" ? "Pending" : item.customerResponseStatus || "Pending Review"}
                          </span>
                        )}
                      </td>
                    )}

                    {/* Action Button */}
                    <td className="py-4.5 px-6 align-middle text-center whitespace-nowrap">
                      <button
                        type="button"
                        disabled={verifyingFarmlandId === item.id}
                        onClick={() => handleCardAction(item)}
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-75 text-white text-xs sm:text-sm font-semibold cursor-pointer border-none transition-all shadow-2xs hover:shadow-xs active:scale-98 whitespace-nowrap shrink-0"
                      >
                        {verifyingFarmlandId === item.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Loading...</span>
                          </>
                        ) : activeStage === "New Requests" ? (
                          "Verify Now"
                        ) : (
                          "View Details"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination Footer matching Figma ───────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 text-xs text-[#64748B] font-medium bg-white">
            <div className="flex items-center gap-4">
              <span>
                Showing{" "}
                <strong className="text-gray-900">
                  {filteredRequests.length === 0
                    ? "0"
                    : `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                        currentPage * rowsPerPage,
                        filteredRequests.length
                      )}`}
                </strong>{" "}
                of <strong className="text-gray-900">{filteredRequests.length}</strong>{" "}
                {activeStage === "Quotations" || activeStage === "Customer Response"
                  ? "quotations"
                  : "requests"}
              </span>
              <div className="flex items-center gap-1.5">
                <span>Rows:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-[#F8F9FA] border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 outline-none cursor-pointer"
                >
                  <option value={7}>7</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-[#1877F2] text-white shadow-2xs"
                      : "text-gray-600 hover:bg-gray-100 bg-transparent"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>

    {/* ── Filter Modal ────────────────────────────────────────────────────── */}
    <ServiceRequestFilterModal
      isOpen={filterModalOpen}
      onClose={() => setFilterModalOpen(false)}
      selectedServices={selectedServices}
      selectedDateRange={selectedDateRange}
      onApply={(services, dateRange) => {
        setSelectedServices(services);
        setSelectedDateRange(dateRange);
      }}
      onClear={() => {
        setSelectedServices([]);
        setSelectedDateRange(null);
        setActiveMonthFilter(null);
      }}
    />

    {/* ── Quotation Status Details Modal (Accepted / Rejected / Awaiting) ── */}
    <QuotationStatusDetailsModal
      isOpen={!!quotationDetailsItem}
      item={quotationDetailsItem}
      onClose={() => setQuotationDetailsItem(null)}
      onMoveToWorkOrder={handleMoveToWorkOrder}
    />

    {/* ── Under Verification Details Modal (Figma Image 4) ──────────────────── */}
    <UnderVerificationDetailsModal
      isOpen={!!underVerificationItem}
      item={underVerificationItem}
      onClose={() => setUnderVerificationItem(null)}
    />

    {/* ── Generated Official Estimation Modal (Figma Image 2) ───────────────── */}
    <GeneratedEstimationModal
      isOpen={!!estimationItem}
      item={estimationItem}
      onClose={() => setEstimationItem(null)}
      onApprove={handleApproveEstimation}
    />

    {/* ── Estimation Sent Successfully Modal (Figma Image 3) ────────────────── */}
    <EstimationSuccessModal
      isOpen={!!successItemCode}
      itemCode={successItemCode || "ID 3042"}
      onReturn={() => setSuccessItemCode(null)}
    />

    {/* ── Assign Field Officer Modal (Figma Images 1, 2, 3, 4) ─────────────── */}
    <AssignFieldOfficerModal
      isOpen={!!assignOfficerItem}
      item={assignOfficerItem}
      onClose={() => setAssignOfficerItem(null)}
      onAssignSuccess={handleAssignOfficerSuccess}
    />
  </div>
);
}
