import { useState, useMemo, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Calculator,
  Check,
  X,
  User,
  ClipboardList,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MaintenanceNavbar } from "../components/MaintenanceNavbar";
import type { ServiceRequestPipelineItem } from "../types/maintenance.types";
import {
  useGetFarmlandByIdQuery,
  useGetAllMaintenanceFarmlandsQuery,
  useMoveToWorkOrderMutation,
  useLazyGetMaintenanceFarmlandUnderReviewDetailsQuery,
} from "../api/maintenanceServiceRequestApi";
import {
  CUSTOMER_RESPONSE_TAB_QUERY_REQUEST_STATUS_IDS,
  CUSTOMER_RESPONSE_TAB_SERVICE_STATUS_IDS,
} from "../hooks/useMaintenanceMasterData";

// Backend service_id → service name (1 Farmhouse, 2 Fencing, 3 Borewell, 4 Organic)
const SERVICE_NAME_BY_ID: Record<number, string> = {
  1: "Farmhouse Construction",
  2: "Fencing",
  3: "Borewell",
  4: "Organic Farming",
  5: "Solar Setup",
  6: "Land Demarcation",
};

// Estimation fields shown as cost lines (labels as in the field officer / quotation forms)
const ESTIMATION_COMPONENT_LABELS: [string, string][] = [
  ["labour_charges", "Labour Charges"],
  ["inspection_charges", "Inspection Charges"],
  ["inspection_architecture_charges", "Inspection & Architecture"],
  ["casing_pipe_charges", "Casing Pipe Charges"],
  ["pump_charges", "Pump Charges"],
  ["electric_charges", "Electric Charges"],
  ["material_mesh_charges", "Material & Mesh Charges"],
  ["pole_erection_charges", "Pole Erection Charges"],
  ["gate_installation_charges", "Gate Installation Charges"],
  ["civil_foundation_charges", "Civil & Foundation Charges"],
  ["plumbing_electrical_charges", "Plumbing & Electrical"],
  ["finishing_painting_charges", "Finishing & Painting"],
  ["land_preparation_charges", "Soil Testing & Land Preparation"],
  ["fertilizer_charges", "Organic Manure & Bio-Fertilizers"],
  ["irrigation_charges", "Drip Irrigation Setup"],
  ["seed_charges", "Seed Charges"],
  ["planting_charges", "Planting Charges"],
  ["other_charges", "Bio-Pest Control & Mulching"],
  ["gst_amount", "Tax (GST)"],
  ["glc_fee", "GLC Fee"],
];

const toPositiveNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : undefined;
};

// First positive estimation id found on the given objects: estimation_id or any *_estimation_id
// key (e.g. farmhouse_estimation_id), also inside nested objects / arrays (a few levels deep)
const findEstimationId = (...sources: any[]): number | undefined => {
  const search = (source: any, depth: number): number | undefined => {
    if (!source || typeof source !== "object" || depth > 3) return undefined;
    if (Array.isArray(source)) {
      for (const entry of source) {
        const found = search(entry, depth + 1);
        if (found) return found;
      }
      return undefined;
    }
    const direct = toPositiveNumber(source.estimation_id);
    if (direct) return direct;
    const suffixKey = Object.keys(source).find((key) => /estimation_id$/i.test(key));
    const suffixed = suffixKey ? toPositiveNumber(source[suffixKey]) : undefined;
    if (suffixed) return suffixed;
    for (const value of Object.values(source)) {
      if (value && typeof value === "object") {
        const found = search(value, depth + 1);
        if (found) return found;
      }
    }
    return undefined;
  };
  for (const source of sources) {
    const found = search(source, 0);
    if (found) return found;
  }
  return undefined;
};

// Review record inside a getMaintenanceFarmlandUnderReviewDetails response (as on Quotation Details)
const getUnderReviewRecord = (response: any): any => {
  const data = response?.data;
  if (!data || typeof data !== "object" || response?.success === false) return undefined;
  const record = data.reviewDetails || data.details || data;
  return Array.isArray(record) ? record[0] : record;
};

// Estimation id of an under-review record: estimation_id anywhere, else the estimation's own id
const getUnderReviewEstimationId = (review: any): number | undefined =>
  findEstimationId(review?.estimation_details, review?.estimation, review) ??
  toPositiveNumber(review?.estimation_details?.id ?? review?.estimation?.id);

// Shown wherever the backend sends no value
const NO_DATA_TEXT = "No data available";

const formatRupees =(value: unknown): string => `₹${(Number(value) || 0).toLocaleString("en-IN")}`;

// Farmland record inside a getFarmlandById response ({ data }, { data: { farmland } } or an array)
const getFarmlandRecord = (response: any): any => {
  const data = response?.data ?? response;
  const detail = data && !Array.isArray(data) ? data.farmland || data.data || data : data;
  const record = Array.isArray(detail) ? detail[0] : detail;
  return record && typeof record === "object" ? record : undefined;
};

interface CustomerServiceDecision {
  id: string;
  name: string;
  decisionStatus: "Accepted" | "Rejected" | "Pending";
  // Empty values (undefined / "" / []) mean the backend sent no data
  quotedAmount?: number;
  landArea: string;
  customerRemarks: string;
  scopeOfWork: string;
  // Backend ids for moveToWorkOrder (absent on sample/demo data)
  serviceRequestItemId?: number;
  estimationId?: number;
  components: {
    label: string;
    amount: string;
  }[];
}

interface FarmlandCustomerResponseData {
  farmlandId: string;
  customerName: string;
  region: string;
  date: string;
  overallStatus: "Accepted" | "Pending Review" | "Rejected";
  officer: {
    name: string;
    initials: string;
    region: string;
    phone: string;
    email: string;
  };
  services: CustomerServiceDecision[];
}

interface MaintenanceCustomerResponseDetailsProps {
  item?: ServiceRequestPipelineItem;
  onBack?: () => void;
}

export default function MaintenanceCustomerResponseDetails({
  item: propItem,
  onBack: propOnBack,
}: MaintenanceCustomerResponseDetailsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const stateItem = (location.state as any)?.item as ServiceRequestPipelineItem | undefined;

  // Numeric farmland id for getFarmlandById: from the row passed in, else a numeric route id
  const knownFarmlandId =
    toPositiveNumber((propItem as any)?.raw?.farmland_id ?? (stateItem as any)?.raw?.farmland_id) ??
    toPositiveNumber(propItem?.farmlandId ?? stateItem?.farmlandId) ??
    toPositiveNumber(id);

  // Old links / refreshes may carry the farmland code (e.g. FL26100008) instead of the id:
  // look the code up in the Customer Response list to get its farmland_id
  const routeFarmlandCode = !knownFarmlandId && id && isNaN(Number(id)) ? id : undefined;
  const { data: codeLookupResponse } = useGetAllMaintenanceFarmlandsQuery(
    {
      offset: 0,
      searchString: routeFarmlandCode || "",
      request_status_id: CUSTOMER_RESPONSE_TAB_QUERY_REQUEST_STATUS_IDS,
      service_status_id: CUSTOMER_RESPONSE_TAB_SERVICE_STATUS_IDS,
    },
    { skip: !routeFarmlandCode }
  );
  const lookedUpFarmlandId = useMemo(() => {
    if (!routeFarmlandCode) return undefined;
    const data: any = codeLookupResponse?.data;
    const rows: any[] = Array.isArray(data) ? data : data?.rows || data?.farmlands || [];
    const match = rows.find(
      (row) => String(row?.farmland_code || "").toLowerCase() === routeFarmlandCode.toLowerCase()
    );
    return toPositiveNumber(match?.farmland_id);
  }, [codeLookupResponse, routeFarmlandCode]);

  const resolvedFarmlandId = knownFarmlandId ?? lookedUpFarmlandId;

  // Keep the farmland id (not the code) in the URL, e.g. /customer-response/575
  useEffect(() => {
    if (!resolvedFarmlandId || propItem || String(id) === String(resolvedFarmlandId)) return;
    const basePath = location.pathname.replace(/\/[^/]*$/, "");
    navigate(`${basePath}/${resolvedFarmlandId}`, { replace: true, state: location.state });
  }, [resolvedFarmlandId, id, propItem, location.pathname, location.state, navigate]);

  const { data: farmlandResponse, isFetching: isFarmlandFetching } = useGetFarmlandByIdQuery(
    { farmland_id: resolvedFarmlandId ?? 0 },
    { skip: !resolvedFarmlandId }
  );
  const farmlandRecord = useMemo(() => getFarmlandRecord(farmlandResponse), [farmlandResponse]);

  // getFarmlandById carries the customer's decision per service but may omit the estimation
  // (amounts / estimation_id): those come from the under-review details of each service item,
  // the same API Quotation Details uses
  const [fetchUnderReviewDetails] = useLazyGetMaintenanceFarmlandUnderReviewDetailsQuery();
  const [underReviewByItemId, setUnderReviewByItemId] = useState<Record<string, any>>({});
  const backendItemIds = useMemo(() => {
    const items: any[] = Array.isArray(farmlandRecord?.service_request_item)
      ? farmlandRecord.service_request_item
      : Array.isArray(farmlandRecord?.service_request_items)
      ? farmlandRecord.service_request_items
      : [];
    return items
      .map((svc) => toPositiveNumber(svc?.service_request_item_id ?? svc?.service_req_item_id ?? svc?.id))
      .filter((itemId): itemId is number => itemId !== undefined);
  }, [farmlandRecord]);

  useEffect(() => {
    if (!resolvedFarmlandId || backendItemIds.length === 0) return;
    let cancelled = false;
    backendItemIds.forEach((itemId) => {
      fetchUnderReviewDetails(
        { farmland_id: resolvedFarmlandId, service_request_item_id: itemId },
        true
      )
        .unwrap()
        .then((response) => {
          const review = getUnderReviewRecord(response);
          if (!cancelled && review && typeof review === "object") {
            setUnderReviewByItemId((prev) => ({ ...prev, [String(itemId)]: review }));
          }
        })
        .catch((error) => console.warn("Failed to load under review details", itemId, error));
    });
    return () => {
      cancelled = true;
    };
  }, [resolvedFarmlandId, backendItemIds, fetchUnderReviewDetails]);

  // Row passed in from the list; without one (e.g. a refresh) every value comes from the backend
  const item: ServiceRequestPipelineItem =
    propItem ||
    stateItem ||
    ({
      id: String(id ?? ""),
      code: "",
      customerName: "",
      serviceCategory: "",
      location: "",
      description: "",
      stage: "Customer Response",
    } as unknown as ServiceRequestPipelineItem);

  const onBack =
    propOnBack ||
    (() => {
      const isPreview = location.pathname.includes("/preview/");
      const isSuperAdmin = location.pathname.includes("/super-admin/");
      const prefix = isPreview
        ? "/maintenance/preview"
        : isSuperAdmin
        ? "/super-admin/maintenance"
        : "/maintenance";
      navigate(`${prefix}/service-requests?tab=Customer+Response`);
    });

  // Page data comes only from the backend (getFarmlandById + under-review details)
  const responseData: FarmlandCustomerResponseData = useMemo(() => {
    const isAcceptedStatus = (item.customerResponseStatus || item.statusText) === "Accepted";
    const isRejectedStatus = (item.customerResponseStatus || item.statusText) === "Rejected";

    // Backend data (getFarmlandById) takes priority over the sample templates below
    const backendItems: any[] = Array.isArray(farmlandRecord?.service_request_item)
      ? farmlandRecord.service_request_item
      : Array.isArray(farmlandRecord?.service_request_items)
      ? farmlandRecord.service_request_items
      : [];
    if (farmlandRecord && backendItems.length > 0) {
      const customer = farmlandRecord.customer_details;
      const customerName =
        (customer?.first_name ? `${customer.first_name} ${customer.last_name || ""}`.trim() : "") ||
        farmlandRecord.customer_name ||
        item.customerName ||
        "—";
      const createdOn = farmlandRecord.created_on || farmlandRecord.created_at;
      // Row-level status (5 accepted / 9 rejected) is only the fallback for a service's decision
      const rowDecision: CustomerServiceDecision["decisionStatus"] = isAcceptedStatus
        ? "Accepted"
        : isRejectedStatus
        ? "Rejected"
        : "Pending";
      // Customer decision per service from its estimation flags
      const getServiceDecision = (est: any): CustomerServiceDecision["decisionStatus"] => {
        if (Number(est?.is_user_approved) === 1) return "Accepted";
        if (Number(est?.is_user_rejected) === 1) return "Rejected";
        if (est && ("is_user_approved" in est || "is_user_rejected" in est)) return "Pending";
        return rowDecision;
      };

      const services: CustomerServiceDecision[] = backendItems.map((svc: any, idx: number) => {
        const est = svc.estimation || svc.estimation_details || {};
        // Charges live in estimation.details (older payloads had them on the estimation itself)
        const charges = est.details && typeof est.details === "object" ? est.details : est;
        const serviceRequestItemId = toPositiveNumber(
          svc.service_request_item_id ?? svc.service_req_item_id ?? svc.id
        );
        // Under-review estimation fills whatever getFarmlandById leaves out
        const review = serviceRequestItemId ? underReviewByItemId[String(serviceRequestItemId)] : undefined;
        const reviewEst =
          review?.estimation_details && typeof review.estimation_details === "object"
            ? review.estimation_details
            : {};
        const getComponents = (source: any) =>
          ESTIMATION_COMPONENT_LABELS.filter(
            ([field]) => source[field] !== undefined && source[field] !== null && source[field] !== ""
          ).map(([field, label]) => ({ label, amount: formatRupees(source[field]) }));
        const ownComponents = getComponents(charges);
        return {
          id: String(svc.service_request_item_id ?? `service-${idx}`),
          name: SERVICE_NAME_BY_ID[Number(svc.service_id)] || svc.service_name || `Service ${idx + 1}`,
          decisionStatus: getServiceDecision(svc.estimation),
          // Undefined (shown as "No data available") when the backend has no amount
          quotedAmount: toPositiveNumber(
            est.estimation_amount ??
              est.total_estimation_cost ??
              est.estimated_amount ??
              charges.total_estimation_cost ??
              charges.estimated_amount ??
              reviewEst.total_estimation_cost ??
              reviewEst.estimated_amount ??
              reviewEst.estimation_amount
          ),
          landArea: String(farmlandRecord.acres ?? item.landSize ?? "").replace(/[^0-9.]/g, ""),
          customerRemarks: est.user_remarks || est.customer_remarks || svc.remarks || "",
          scopeOfWork: est.remarks || charges.remarks || reviewEst.remarks || "",
          serviceRequestItemId,
          estimationId:
            findEstimationId(est, charges, svc) ??
            (est !== svc ? toPositiveNumber(est.id) : undefined) ??
            getUnderReviewEstimationId(review),
          components: ownComponents.length > 0 ? ownComponents : getComponents(reviewEst),
        };
      });

      // Overall: accepted if the customer approved any service, rejected if every decided one was
      // rejected, otherwise the row status
      const overallStatus: FarmlandCustomerResponseData["overallStatus"] = services.some(
        (svc) => svc.decisionStatus === "Accepted"
      )
        ? "Accepted"
        : services.length > 0 && services.every((svc) => svc.decisionStatus === "Rejected")
        ? "Rejected"
        : isAcceptedStatus
        ? "Accepted"
        : isRejectedStatus
        ? "Rejected"
        : "Pending Review";

      return {
        farmlandId: farmlandRecord.farmland_code || item.landId || item.code || "—",
        customerName,
        region: item.location || "—",
        date: createdOn
          ? new Date(createdOn).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
          : item.createdDate || "—",
        overallStatus,
        officer: {
          name: item.assignedOfficer || item.assignedOfficerDetails?.name || "Not assigned",
          initials: (item.assignedOfficer || item.assignedOfficerDetails?.name || "NA")
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          region: item.location || "—",
          phone: item.assignedOfficerDetails?.phone || "—",
          email: item.assignedOfficerDetails?.email || "—",
        },
        services,
      };
    }

    // No backend services (yet): header from the list row only, no services
    const isAccepted = (item.customerResponseStatus || item.statusText) === "Accepted";
    const isRejected = (item.customerResponseStatus || item.statusText) === "Rejected";
    const officerName = item.assignedOfficer || item.assignedOfficerDetails?.name || "Not assigned";

    return {
      farmlandId: farmlandRecord?.farmland_code || item.landId || item.code || "—",
      customerName: item.customerName || "—",
      region: item.location || "—",
      date: item.createdDate || "—",
      overallStatus: isAccepted ? "Accepted" : isRejected ? "Rejected" : "Pending Review",
      officer: {
        name: officerName,
        initials: officerName
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        region: item.location || "—",
        phone: item.assignedOfficerDetails?.phone || "—",
        email: item.assignedOfficerDetails?.email || "—",
      },
      services: [],
    };
  }, [item, farmlandRecord, underReviewByItemId]);

  const [activeServiceId, setActiveServiceId] = useState<string>(
    responseData.services[0]?.id || ""
  );

  const activeService =
    responseData.services.find((s) => s.id === activeServiceId) || responseData.services[0];

  const hasApprovedServices = responseData.services.some((s) => s.decisionStatus === "Accepted");
  // The button moves every customer-approved service in one call; it is disabled while a
  // rejected / pending service is open
  const isActiveServiceRejected = activeService?.decisionStatus !== "Accepted";

  const [moveToWorkOrder] = useMoveToWorkOrderMutation();
  const [isMovingToWorkOrder, setIsMovingToWorkOrder] = useState(false);
  // Synchronous guard so a fast double click cannot send moveToWorkOrder twice
  const isMovingRef = useRef(false);

  // Move to Work Order Handler
  const handleMoveToWorkOrder = async () => {
    if (isMovingRef.current) return;
    isMovingRef.current = true;
    setIsMovingToWorkOrder(true);
    try {
      await moveApprovedServicesToWorkOrder();
    } finally {
      isMovingRef.current = false;
      setIsMovingToWorkOrder(false);
    }
  };

  // One moveToWorkOrder call with the service_request_item_id of every customer-approved service
  // (rejected / pending services are never sent)
  const moveApprovedServicesToWorkOrder = async () => {
    const approvedServices = responseData.services.filter(
      (svc) => svc.decisionStatus === "Accepted" && svc.serviceRequestItemId
    );
    if (!resolvedFarmlandId || approvedServices.length === 0) {
      toast.error("Only services approved by the customer can be moved to work order.");
      return;
    }
    // service_request_id of the farmland (getFarmlandById), else from the list row passed in
    const serviceRequestId =
      toPositiveNumber(farmlandRecord?.service_request_id) ??
      toPositiveNumber((item as any)?.service_request_id) ??
      toPositiveNumber(item.serviceRequestId) ??
      toPositiveNumber((item as any)?.raw?.service_request_id);
    if (!serviceRequestId) {
      toast.error("Unable to move to work order: service request not found for this farmland.");
      return;
    }

    try {
      const result = await moveToWorkOrder({
        service_request_item_id: approvedServices.map((svc) => svc.serviceRequestItemId!),
        service_request_id: serviceRequestId,
        remarks: "Moved to work order",
      }).unwrap();
      if (result?.success === false) {
        toast.error(result.message || "Failed to move to work order.");
        return;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to move to work order.");
      return;
    }

    toast.success(
      `${approvedServices.map((svc) => svc.name).join(", ")} moved to Work Order for ${responseData.customerName}!`
    );

    // The Work Orders list loads the moved farmland from getWorkOrderFarmlands
    const isPreview = location.pathname.includes("/preview/");
    const isSuperAdmin = location.pathname.includes("/super-admin/");
    const targetPath = isPreview
      ? "/maintenance/preview/work-orders"
      : isSuperAdmin
      ? "/super-admin/maintenance/work-orders"
      : "/maintenance/work-orders";

    navigate(targetPath, {
      state: {
        highlightCustomer: responseData.customerName,
        activeTab: "In - Progress",
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-['Plus_Jakarta_Sans']">
      <MaintenanceNavbar activeTab="service-requests" />

      <main className="flex-1 w-full px-6 sm:px-8 lg:px-12 py-6 sm:py-8 flex flex-col gap-6">
        {/* ── Breadcrumbs ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-[#1877F2] transition-colors border-none bg-transparent cursor-pointer p-0 text-[#64748B]"
          >
            Customer Response
          </button>
          <span>&gt;</span>
          <span className="text-[#1E293B] font-bold">
            {responseData.farmlandId} – {responseData.customerName}
          </span>
        </div>

        {/* ── Header Row ────────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#111827] tracking-tight m-0">
              Customer Response Details
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-normal mt-1 m-0 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span>
                Farmland ID:{" "}
                <span className="font-semibold text-[#1E293B]">{responseData.farmlandId}</span>
              </span>
              <span>•</span>
              <span>
                Customer:{" "}
                <span className="font-semibold text-[#1E293B]">{responseData.customerName}</span>
              </span>
              <span>•</span>
              <span>
                Region:{" "}
                <span className="font-semibold text-[#1E293B]">{responseData.region}</span>
              </span>
              <span>•</span>
              <span>
                Date: <span className="font-semibold text-[#1E293B]">{responseData.date}</span>
              </span>
            </p>
          </div>

          {/* Right Status Badge & Move to Work Order Button */}
          <div className="flex flex-wrap items-center gap-3">
            {responseData.overallStatus === "Accepted" ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]/60 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                Overall: Accepted
              </span>
            ) : responseData.overallStatus === "Rejected" ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]/60 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                Overall: Rejected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FEF9C3] text-[#854D0E] border border-[#FDE047]/60 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
                Overall: Pending Review
              </span>
            )}

            {hasApprovedServices && !isActiveServiceRejected ? (
              <button
                type="button"
                onClick={handleMoveToWorkOrder}
                disabled={isMovingToWorkOrder}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold cursor-pointer transition-all shadow-sm active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <ClipboardList className="w-4 h-4" />
                {isMovingToWorkOrder ? "Moving to Work Order..." : "Move to Work Order →"}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#94A3B8] text-white text-xs font-bold cursor-not-allowed opacity-85 shadow-2xs"
              >
                <ClipboardList className="w-4 h-4" />
                {!hasApprovedServices
                  ? "Move to Work Order (No Approved Services)"
                  : activeService?.decisionStatus === "Rejected"
                  ? "Move to Work Order (Service Rejected)"
                  : "Move to Work Order (Awaiting Customer)"}
              </button>
            )}
          </div>
        </div>

        {/* ── Assigned Field Officer Box (Light Blue Outlined Banner) ───────── */}
        <div className="bg-white rounded-[20px] p-4 sm:p-5 border border-[#93C5FD] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center font-bold text-sm shrink-0">
              {responseData.officer.initials}
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">
                ASSIGNED FIELD OFFICER FOR {responseData.officer.region.toUpperCase()} REGION
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-[#111827]">
                  {responseData.officer.name}
                </span>
                <span className="text-[11px] font-semibold text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded-full">
                  Regional Field Officer · {responseData.officer.region}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 sm:gap-8 text-xs text-[#64748B] font-medium border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
            <span>
              Phone:{" "}
              <span className="font-bold text-[#334155]">{responseData.officer.phone}</span>
            </span>
            <span>
              Email:{" "}
              <span className="font-bold text-[#334155]">{responseData.officer.email}</span>
            </span>
          </div>
        </div>

        {/* ── Service Pill Tabs Switcher ────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          {responseData.services.map((svc) => {
            const isActive = svc.id === activeServiceId;
            const isAccepted = svc.decisionStatus === "Accepted";
            const isRejected = svc.decisionStatus === "Rejected";

            if (isActive) {
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setActiveServiceId(svc.id)}
                  className="flex items-center gap-2 px-4.5 py-2 rounded-full bg-[#0A2540] text-white text-xs font-bold shadow-xs cursor-pointer border-none transition-all"
                >
                  {isAccepted ? (
                    <span className="w-4 h-4 rounded-full bg-[#15803D] flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : isRejected ? (
                    <span className="w-4 h-4 rounded-full bg-[#EF4444] flex items-center justify-center text-white">
                      <X className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                  )}
                  <span>{svc.name}</span>
                </button>
              );
            }

            if (isAccepted) {
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setActiveServiceId(svc.id)}
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] border border-[#86EFAC]/60 text-xs font-bold cursor-pointer transition-all shadow-2xs"
                >
                  <span className="w-4 h-4 rounded-full bg-[#15803D] flex items-center justify-center text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>{svc.name}</span>
                </button>
              );
            }

            if (isRejected) {
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setActiveServiceId(svc.id)}
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] border border-[#FCA5A5]/60 text-xs font-bold cursor-pointer transition-all shadow-2xs"
                >
                  <span className="w-4 h-4 rounded-full bg-[#EF4444] flex items-center justify-center text-white">
                    <X className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>{svc.name}</span>
                </button>
              );
            }

            // Pending Review
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => setActiveServiceId(svc.id)}
                className="flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-[#F1F5F9] hover:bg-gray-200 text-[#64748B] border border-gray-200 text-xs font-semibold cursor-pointer transition-all shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                <span>{svc.name}</span>
              </button>
            );
          })}
        </div>

        {/* ── Main Decision Breakdown Card Container ────────────────────────── */}
        {!activeService ? (
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm p-6 sm:p-8 flex flex-col gap-6">
            <div className="py-10 text-center text-sm font-semibold text-[#64748B]">
              {isFarmlandFetching ? "Loading services..." : NO_DATA_TEXT}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 border border-[#CBD5E1] rounded-full text-xs font-bold text-[#334155] cursor-pointer transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Customer Response
              </button>
            </div>
          </div>
        ) : (
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm p-6 sm:p-8 flex flex-col gap-6">
          {/* Header Status Decision Banner */}
          <div
            className={`rounded-[20px] p-5 sm:p-6 border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              activeService.decisionStatus === "Accepted"
                ? "bg-[#F0FDF4] border-[#BBF7D0]"
                : activeService.decisionStatus === "Rejected"
                ? "bg-[#FEF2F2] border-[#FECACA]"
                : "bg-[#FFF7ED] border-[#FED7AA]"
            }`}
          >
            <div className="flex flex-col gap-2">
              <div>
                {activeService.decisionStatus === "Accepted" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#15803D] border border-[#86EFAC] shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Approved by Customer
                  </span>
                ) : activeService.decisionStatus === "Rejected" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#DC2626] border border-[#FCA5A5] shadow-2xs">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                    Rejected by Customer
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#EA580C] border border-[#FDBA74] shadow-2xs">
                    Pending Review
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F172A] m-0">
                  {activeService.name} — Decision Breakdown
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] font-normal mt-0.5 m-0">
                  Field Officer:{" "}
                  <span className="font-semibold text-[#1E293B]">
                    {responseData.officer.name}
                  </span>{" "}
                  • Farmland Area:{" "}
                  <span className="font-semibold text-[#1E293B]">
                    {activeService.landArea ? `${activeService.landArea} Acres` : NO_DATA_TEXT}
                  </span>
                </p>
              </div>
            </div>

            {/* Quoted Amount Box */}
            <div className="bg-white rounded-[16px] px-5 py-3 border border-[#E2E8F0] shadow-2xs flex items-center gap-3.5 self-start md:self-auto shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] flex items-center justify-center text-[#1877F2]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  QUOTED AMOUNT
                </span>
                {activeService.quotedAmount !== undefined ? (
                  <span className="block text-xl sm:text-2xl font-extrabold text-[#0A2540]">
                    ₹{activeService.quotedAmount.toLocaleString("en-IN")}
                  </span>
                ) : (
                  <span className="block text-sm font-semibold text-[#64748B]">{NO_DATA_TEXT}</span>
                )}
              </div>
            </div>
          </div>

          {/* Customer Response Remarks Box */}
          <div className="bg-[#F8FAFC] rounded-[16px] p-4.5 border border-[#E2E8F0] shadow-2xs flex flex-col gap-1.5">
            <span className="text-[10.5px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#64748B]" />
              CUSTOMER RESPONSE REMARKS:
            </span>
            {activeService.customerRemarks ? (
              <p className="text-xs sm:text-sm font-medium text-[#334155] italic leading-relaxed m-0">
                “{activeService.customerRemarks}”
              </p>
            ) : (
              <p className="text-xs sm:text-sm font-medium text-[#64748B] leading-relaxed m-0">
                {NO_DATA_TEXT}
              </p>
            )}
          </div>

          {/* Quotation Line Items Grid */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                Quotation Line Items
              </span>
              <span className="text-[11px] font-semibold text-[#94A3B8]">
                Scope &amp; Component Breakdown
              </span>
            </div>

            {activeService.components.length === 0 && (
              <div className="bg-[#F8FAFC] rounded-[14px] p-4 border border-[#E2E8F0] text-xs font-semibold text-[#64748B] text-center">
                {NO_DATA_TEXT}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {activeService.components.map((comp, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] rounded-[14px] p-3.5 border border-[#E2E8F0] flex items-center justify-between"
                >
                  <span className="text-xs font-medium text-[#475569] truncate pr-2">
                    {comp.label}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#0F172A] shrink-0">
                    {comp.amount}
                  </span>
                </div>
              ))}
            </div>

            {/* Scope of Work Box */}
            <div className="bg-[#F8FAFC] rounded-[14px] p-4 border border-[#E2E8F0] text-xs text-[#475569] leading-relaxed">
              <strong className="text-[#0F172A]">Scope of Work:</strong>{" "}
              {activeService.scopeOfWork || NO_DATA_TEXT}
            </div>
          </div>

          {/* Outcome Status Banner */}
          {activeService.decisionStatus === "Accepted" ? (
            <div className="bg-[#DCFCE7] text-[#15803D] rounded-[14px] p-4 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-[#86EFAC]/60">
              <Check className="w-4 h-4 stroke-[3] shrink-0" />
              <span>
                Eligible for Work Order dispatch — Will be assigned to regional officer{" "}
                <strong>{responseData.officer.name}</strong> for field execution.
              </span>
            </div>
          ) : activeService.decisionStatus === "Rejected" ? (
            <div className="bg-[#FEE2E2] text-[#B91C1C] rounded-[14px] p-4 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-[#FCA5A5]/60">
              <X className="w-4 h-4 stroke-[3] shrink-0" />
              <span>Excluded from Work Order — Customer rejected this service quotation.</span>
            </div>
          ) : (
            <div className="bg-[#FEF3C7] text-[#92400E] rounded-[14px] p-4 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-[#FCD34D]/60">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Decision pending customer confirmation.</span>
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 border border-[#CBD5E1] rounded-full text-xs font-bold text-[#334155] cursor-pointer transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Customer Response
            </button>
          </div>
        </div>
        )}
      </main>
    </div>
  );
}
