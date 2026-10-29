import { useState, useMemo, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Calculator,
  Check,
  FileText,
  X,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MaintenanceNavbar } from "../components/MaintenanceNavbar";
import type { ServiceRequestPipelineItem } from "../types/maintenance.types";
import {
  useMaintenanceMasterData,
  findMaintenanceApprovedStatus,
  getServiceStatusList,
  isServiceItemApproved,
  QUOTATION_GIVEN_STATUS_ID,
  QUOTATIONS_TAB_REQUEST_STATUS_IDS,
  MAINTENANCE_APPROVED_REQUEST_STATUS_ID,
  type MasterStatusEntry,
} from "../hooks/useMaintenanceMasterData";
import {
  useGetAllMaintenanceFarmlandsQuery,
  useGetFarmlandByIdQuery,
  useGetMaintenanceFarmlandUnderReviewDetailsQuery,
  useUpdateBorewellEstimationMutation,
  useUpdateFencingEstimationMutation,
  useUpdateFarmhouseEstimationMutation,
  useUpdateOrganicFarmingEstimationMutation,
  useUpdateMaintenanceApprovalMutation,
  useUpdateServiceRequestItemStatusMutation,
  useUpdateServiceRequestStatusMutation,
  mapApiFarmlandToServiceRequest,
  maintenanceService,
  type MaintenanceFarmlandItem,
  type MaintenanceActionApiResponse,
} from "../api/maintenanceServiceRequestApi";
import { useGetAllGeoMasterDataQuery } from "@/features/super-admin/api/masterData.api";
import { formatLocation } from "@/features/super-admin/utils/locationUtils";

interface ServiceComponentConfig {
  id: string;
  label: string;
  amount: number;
  // estimation_details / update-API field of this amount. Absent for the quantity × rate cost
  // line, which (as in the field officer app) is only part of estimated_amount.
  field?: string;
  // "crop" renders the Organic Farming crop dropdown instead of an amount input
  kind?: "crop";
}

interface ServiceItemConfig {
  id: string;
  name: string;
  isApproved: boolean;
  // Organic Farming only asks for the land size (same as the field officer app)
  hideFeetAndRate?: boolean;
  topInputs: {
    label1: string;
    value1: string;
    label2: string;
    value2: string;
    label3: string;
    value3: string;
  };
  // Backend fields of the quantity (value2) and rate (value3) inputs, when the API stores them
  quantityField?: string;
  rateField?: string;
  components: ServiceComponentConfig[];
  cropId?: number;
  scopeNotes: string;
  // Service without its own estimation form / update API (e.g. Solar Setup): its cost lines come
  // from the backend estimation and are view-only (approval still works)
  isGeneric?: boolean;
}

// Same inputs, labels and order as the field officer estimation form
// (glc-field-officer AssignedServiceGenerateEstimationPage), mapped to the estimation API fields
const DEFAULT_SERVICES_CONFIG: Record<string, ServiceItemConfig> = {
  borewell: {
    id: "borewell",
    name: "Borewell",
    isApproved: false,
    topInputs: {
      label1: "Enter Land Size (Acres)",
      value1: "",
      label2: "Estimated Feet(s) (Ft)",
      value2: "",
      label3: "Per Feet Rate",
      value3: "",
    },
    quantityField: "estimated_feet",
    rateField: "per_feet_rate",
    components: [
      { id: "labour", label: "Labour Charges", amount: 0, field: "labour_charges" },
      { id: "inspection", label: "Inspection Charges", amount: 0, field: "inspection_charges" },
      { id: "estimated_feets", label: "Estimated Feets Drilling", amount: 0 },
      { id: "casing", label: "Casing Pipe Charges", amount: 0, field: "casing_pipe_charges" },
      { id: "pump", label: "Pump Charges", amount: 0, field: "pump_charges" },
      { id: "electric", label: "Electric Charges", amount: 0, field: "electric_charges" },
      { id: "tax", label: "Tax (GST)", amount: 0, field: "gst_amount" },
      { id: "glc_fee", label: "GLC Fee", amount: 0, field: "glc_fee" },
    ],
    scopeNotes: "",
  },
  fencing: {
    id: "fencing",
    name: "Fencing",
    isApproved: false,
    topInputs: {
      label1: "Enter Land Size (Acres)",
      value1: "",
      label2: "Estimated Feet(s) (Ft)",
      value2: "",
      label3: "Per Feet Rate",
      value3: "",
    },
    quantityField: "wire_length",
    rateField: "wire_rate",
    components: [
      { id: "labour", label: "Labour Charges", amount: 0, field: "labour_charges" },
      { id: "inspection", label: "Inspection Charges", amount: 0, field: "inspection_charges" },
      { id: "wire_length", label: "Wire Length Charges", amount: 0 },
      { id: "material_mesh", label: "Material & Mesh Charges", amount: 0, field: "material_mesh_charges" },
      { id: "pole_erection", label: "Pole Erection Charges", amount: 0, field: "pole_erection_charges" },
      { id: "gate_installation", label: "Gate Installation Charges", amount: 0, field: "gate_installation_charges" },
      { id: "tax", label: "Tax (GST)", amount: 0, field: "gst_amount" },
      { id: "glc_fee", label: "GLC Fee", amount: 0, field: "glc_fee" },
    ],
    scopeNotes: "",
  },
  farmhouse: {
    id: "farmhouse",
    name: "Farmhouse Construction",
    isApproved: false,
    topInputs: {
      label1: "Enter Land Size (Acres)",
      value1: "",
      label2: "Estimated Built-up (Sq Ft)",
      value2: "",
      label3: "Per Sq Ft Rate",
      value3: "",
    },
    components: [
      { id: "labour", label: "Labour Charges", amount: 0, field: "labour_charges" },
      { id: "inspection", label: "Inspection & Architecture", amount: 0, field: "inspection_architecture_charges" },
      { id: "civil_foundation", label: "Civil & Foundation Charges", amount: 0, field: "civil_foundation_charges" },
      { id: "plumbing_electrical", label: "Plumbing & Electrical", amount: 0, field: "plumbing_electrical_charges" },
      { id: "finishing_painting", label: "Finishing & Painting", amount: 0, field: "finishing_painting_charges" },
      { id: "tax", label: "Tax (GST)", amount: 0, field: "gst_amount" },
      { id: "glc_fee", label: "GLC Fee", amount: 0, field: "glc_fee" },
    ],
    scopeNotes: "",
  },
  organic: {
    id: "organic",
    name: "Organic Farming",
    isApproved: false,
    hideFeetAndRate: true,
    topInputs: {
      label1: "Enter Land Size (Acres)",
      value1: "",
      label2: "",
      value2: "",
      label3: "",
      value3: "",
    },
    components: [
      { id: "soil_prep", label: "Soil Testing & Land Preparation", amount: 0, field: "land_preparation_charges" },
      { id: "organic_manure", label: "Organic Manure & Bio-Fertilizers", amount: 0, field: "fertilizer_charges" },
      { id: "farmer_fees", label: "Farmer Fees", amount: 0, field: "labour_charges" },
      { id: "drip_irrigation", label: "Drip Irrigation Setup", amount: 0, field: "irrigation_charges" },
      { id: "yielding_crops", label: "Select Yielding Crops", amount: 0, kind: "crop" },
      { id: "seed", label: "Seed Charges", amount: 0, field: "seed_charges" },
      { id: "planting", label: "Planting Charges", amount: 0, field: "planting_charges" },
      { id: "bio_pest", label: "Bio-Pest Control & Mulching", amount: 0, field: "other_charges" },
      { id: "tax", label: "Tax (GST)", amount: 0, field: "gst_amount" },
      { id: "glc_fee", label: "GLC Fee", amount: 0, field: "glc_fee" },
    ],
    scopeNotes: "",
  },
};

// Total of a service's cost lines (the crop dropdown carries no amount)
const getServiceTotal = (config: ServiceItemConfig): number =>
  config.components.reduce((acc, comp) => acc + (comp.kind ? 0 : Number(comp.amount) || 0), 0);

// Amount of the cost line mapped to an estimation API field
const getFieldAmount = (config: ServiceItemConfig, field: string): number =>
  Number(config.components.find((comp) => comp.field === field)?.amount) || 0;

// Backend service_id of each quotation tab (1 Farmhouse, 2 Fencing, 3 Borewell, 4 Organic)
const SERVICE_ID_BY_TAB: Record<string, number> = {
  farmhouse: 1,
  fencing: 2,
  borewell: 3,
  organic: 4,
};

// Name hints used only when a service entry has no service_id
const SERVICE_NAME_HINTS: Record<string, string[]> = {
  farmhouse: ["farmhouse", "house", "villa"],
  fencing: ["fenc"],
  borewell: ["bore"],
  organic: ["organic", "agri"],
};

const toPositiveNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : undefined;
};

// Services without a dedicated tab above (service_id 5 Solar Setup, 6 Land Demarcation, or any new
// one) get a generic tab keyed "service_<id>"
const OTHER_SERVICE_KEY_PREFIX = "service_";
const OTHER_SERVICE_NAMES: Record<number, string> = {
  5: "Solar Setup",
  6: "Land Demarcation",
};
const KNOWN_TAB_SERVICE_IDS = Object.values(SERVICE_ID_BY_TAB);

const getTabServiceId = (tabKey: string): number | undefined =>
  SERVICE_ID_BY_TAB[tabKey] ??
  (tabKey.startsWith(OTHER_SERVICE_KEY_PREFIX)
    ? toPositiveNumber(tabKey.slice(OTHER_SERVICE_KEY_PREFIX.length))
    : undefined);

// Service name from master data (a "…ServicesResult" list of { id, description / name }), else the
// known names
const getOtherServiceName = (serviceId: number, masterData: any, serviceItem?: any): string => {
  const fromItem = String(serviceItem?.service_name || serviceItem?.name || "").trim();
  if (fromItem) return fromItem;
  const listKey = Object.keys(masterData || {}).find(
    (key) => /servicesresult$/i.test(key) && Array.isArray(masterData[key])
  );
  const entry = listKey ? (masterData[listKey] as any[]).find((s) => Number(s?.id) === serviceId) : undefined;
  return (
    String(entry?.description || entry?.name || entry?.service_name || "").trim() ||
    OTHER_SERVICE_NAMES[serviceId] ||
    `Service ${serviceId}`
  );
};

const buildGenericServiceConfig = (key: string, name: string, landSize: string): ServiceItemConfig => ({
  id: key,
  name,
  isApproved: false,
  hideFeetAndRate: true,
  isGeneric: true,
  topInputs: {
    label1: "Enter Land Size (Acres)",
    value1: landSize,
    label2: "",
    value2: "",
    label3: "",
    value3: "",
  },
  components: [],
  scopeNotes: "",
});

// "pole_erection_charges" → "Pole Erection Charges"
const humanizeField = (field: string): string =>
  field
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

// Cost lines of a generic service from its estimation fields (*_charges, GST, GLC fee)
const buildGenericComponents = (est: any): ServiceComponentConfig[] => {
  const lines: ServiceComponentConfig[] = Object.keys(est || {})
    .filter(
      (field) =>
        (/_charges$/i.test(field) || field === "gst_amount" || field === "glc_fee") &&
        est[field] !== undefined &&
        est[field] !== null &&
        est[field] !== ""
    )
    .map((field) => ({
      id: field,
      label: field === "gst_amount" ? "Tax (GST)" : field === "glc_fee" ? "GLC Fee" : humanizeField(field),
      amount: Number(est[field]) || 0,
      field,
    }));
  if (lines.length > 0) return lines;
  const total = Number(est?.total_estimation_cost ?? est?.estimated_amount ?? est?.estimation_amount);
  return Number.isFinite(total) && total > 0
    ? [{ id: "estimated_amount", label: "Estimated Amount", amount: total, field: "estimated_amount" }]
    : [];
};

// "1300.00" → "1,300", "200.50" → "200.5" (falls back to the raw value when not numeric)
const formatEstimateNumber = (value: unknown): string => {
  const num = Number(value);
  return Number.isFinite(num)
    ? num.toLocaleString("en-IN", { maximumFractionDigits: 2 })
    : String(value);
};

// Numeric value of a formatted input such as "1,300 Feet" or "₹200.50 / Foot"
const parseInputNumber = (value: string): number => {
  const match = String(value || "").replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

// updateServiceRequestStatus body sent by the final "Confirm" (all services approved):
// request_status_id 4 = "Maintenance Approved"
const REVIEWED_REQUEST_STATUS_ID = MAINTENANCE_APPROVED_REQUEST_STATUS_ID;
const REVIEWED_REQUEST_REMARKS = "Maintenance approved";

const getServiceRequestItems = (raw: any): any[] =>
  (Array.isArray(raw?.service_request_item) && raw.service_request_item) ||
  (Array.isArray(raw?.service_request_items) && raw.service_request_items) ||
  (Array.isArray(raw?.services) && raw.services) ||
  [];

const getServiceRequestItemId = (s: any): number | undefined =>
  toPositiveNumber(s?.service_request_item_id) ??
  toPositiveNumber(s?.service_req_item_id) ??
  toPositiveNumber(s?.service_item_id) ??
  toPositiveNumber(s?.request_item_id);

const matchesServiceTab = (s: any, tabKey: string): boolean => {
  if (!s) return false;
  const serviceId = toPositiveNumber(s.service_id ?? s.serviceId);
  if (serviceId !== undefined) return serviceId === getTabServiceId(tabKey);
  const name = String(s.name || s.service_name || s.service_code || "").toLowerCase();
  return (SERVICE_NAME_HINTS[tabKey] || [tabKey]).some((hint) => name.includes(hint));
};

const extractFarmlandList = (response: any): MaintenanceFarmlandItem[] => {
  const data = response?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.rows)) return data.rows;
  if (Array.isArray(data?.farmlands)) return data.farmlands;
  return [];
};

interface MaintenanceQuotationDetailsProps {
  item?: ServiceRequestPipelineItem;
  onBack?: () => void;
  onApproveSuccess?: (item: ServiceRequestPipelineItem, approvedService: string, totalAmount: number) => void;
}

export default function MaintenanceQuotationDetails({
  item: propItem,
  onBack: propOnBack,
  onApproveSuccess,
}: MaintenanceQuotationDetailsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const [activeTabKey, setActiveTabKey] = useState<string>("borewell");
  const [servicesData, setServicesData] = useState<Record<string, ServiceItemConfig>>(DEFAULT_SERVICES_CONFIG);
  const [successModalServiceKey, setSuccessModalServiceKey] = useState<string | null>(null);
  // Final confirmation dialog listing every approved service (shown after the last approval)
  const [showAllApprovedDialog, setShowAllApprovedDialog] = useState(false);

  const stateItem = (location.state as any)?.item as ServiceRequestPipelineItem | undefined;

  // Quotations tab request_status_id: 3 ("Quotation Given")
  const quotationStatusId = QUOTATION_GIVEN_STATUS_ID;

  // Master data (get_all_master_data): service statuses used by the approval flow
  const { masterData, isLoading: isMasterDataLoading } = useMaintenanceMasterData();
  const serviceStatuses = useMemo(() => getServiceStatusList(masterData), [masterData]);
  const maintenanceApprovedStatus = useMemo(
    () => findMaintenanceApprovedStatus(masterData),
    [masterData]
  );
  const { data: geoData } = useGetAllGeoMasterDataQuery();

  // Query farmlands with the dynamic quotation request_status_id from master data.
  // Skipped when the route already has a numeric farmland id and the item was passed in
  // (navigation state / prop), since the list is then only a fallback that is never used.
  const isNumericRouteId = !!id && !isNaN(Number(id)) && Number(id) > 0;
  const { data: farmlandsResponse } = useGetAllMaintenanceFarmlandsQuery(
    { request_status_id: QUOTATIONS_TAB_REQUEST_STATUS_IDS },
    { skip: isNumericRouteId && Boolean(propItem || stateItem) }
  );

  // Estimation update mutations for each service
  const [updateBorewellEstimation, { isLoading: isUpdatingBorewell }] =
    useUpdateBorewellEstimationMutation();
  const [updateFencingEstimation, { isLoading: isUpdatingFencing }] =
    useUpdateFencingEstimationMutation();
  const [updateFarmhouseEstimation, { isLoading: isUpdatingFarmhouse }] =
    useUpdateFarmhouseEstimationMutation();
  const [updateOrganicFarmingEstimation, { isLoading: isUpdatingOrganic }] =
    useUpdateOrganicFarmingEstimationMutation();

  // Approval mutations
  const [updateMaintenanceApproval, { isLoading: isUpdatingApproval }] =
    useUpdateMaintenanceApprovalMutation();
  const [updateServiceRequestItemStatus, { isLoading: isUpdatingStatus }] =
    useUpdateServiceRequestItemStatusMutation();

  const isSaving =
    isUpdatingBorewell ||
    isUpdatingFencing ||
    isUpdatingFarmhouse ||
    isUpdatingOrganic;
  const isApproving = isUpdatingApproval || isUpdatingStatus;
  const [updateServiceRequestStatus, { isLoading: isConfirmingReview }] =
    useUpdateServiceRequestStatusMutation();

  const itemSource = propItem || stateItem;
  // Raw backend record of the row passed in from the list page (navigation state / prop)
  const sourceRaw = (itemSource as any)?.raw as MaintenanceFarmlandItem | undefined;

  // Row from getAllMaintenanceFarmlands matching the route id (numeric id or farmland code)
  const listRaw = useMemo<MaintenanceFarmlandItem | undefined>(() => {
    if (!id) return undefined;
    const lowerId = id.toLowerCase();
    return extractFarmlandList(farmlandsResponse).find((r) =>
      [r.farmland_id, r.id, r.farmland_code, r.farm_code, r.code, r.land_id, r.service_request_id].some(
        (v) => v !== undefined && v !== null && String(v).toLowerCase() === lowerId
      )
    );
  }, [farmlandsResponse, id]);

  // Numeric farmland primary key (never the "FL..." code)
  const resolvedFarmlandId = useMemo<number | undefined>(() => {
    if (isNumericRouteId) return Number(id);
    return (
      toPositiveNumber(sourceRaw?.farmland_id) ??
      toPositiveNumber(itemSource?.farmlandId) ??
      toPositiveNumber(listRaw?.farmland_id)
    );
  }, [id, isNumericRouteId, sourceRaw, itemSource, listRaw]);

  // Single farmland query by ID using getFarmlandById
  const { data: singleFarmlandResponse, isLoading: isFarmlandLoading } = useGetFarmlandByIdQuery(
    { farmland_id: resolvedFarmlandId ?? 0 },
    { skip: !resolvedFarmlandId }
  );

  // Farmland record from getFarmlandById (handles { data }, { data: { farmland } } and array payloads)
  const farmlandDetailRaw = useMemo<MaintenanceFarmlandItem | undefined>(() => {
    const data: any = singleFarmlandResponse?.data ?? singleFarmlandResponse;
    const detail = data && !Array.isArray(data) ? data.farmland || data.data || data : data;
    const record = Array.isArray(detail) ? detail[0] : detail;
    return record && typeof record === "object" ? record : undefined;
  }, [singleFarmlandResponse]);

  const resolvedServiceRequestId = useMemo<number | undefined>(
    () =>
      toPositiveNumber(farmlandDetailRaw?.service_request_id) ??
      toPositiveNumber(sourceRaw?.service_request_id) ??
      toPositiveNumber((itemSource as any)?.service_request_id) ??
      toPositiveNumber(itemSource?.serviceRequestId) ??
      toPositiveNumber(listRaw?.service_request_id),
    [farmlandDetailRaw, sourceRaw, itemSource, listRaw]
  );

  // Backend service_request_item list of this farmland
  const farmlandServiceItems = useMemo<any[]>(
    () =>
      [farmlandDetailRaw, sourceRaw, listRaw]
        .map(getServiceRequestItems)
        .find((list) => list.length > 0) ||
      (Array.isArray(itemSource?.servicesList) ? itemSource.servicesList : []),
    [farmlandDetailRaw, sourceRaw, listRaw, itemSource]
  );

  // Generic tabs for the farmland's services without a dedicated tab (e.g. Solar Setup)
  const otherServiceKeys = useMemo(
    () => [
      ...new Set(
        farmlandServiceItems
          .map((s: any) => toPositiveNumber(s?.service_id ?? s?.serviceId))
          .filter(
            (serviceId): serviceId is number =>
              serviceId !== undefined && !KNOWN_TAB_SERVICE_IDS.includes(serviceId)
          )
          .map((serviceId) => `${OTHER_SERVICE_KEY_PREFIX}${serviceId}`)
      ),
    ],
    [farmlandServiceItems]
  );
  const allServiceTabKeys = useMemo(
    () => [...Object.keys(SERVICE_ID_BY_TAB), ...otherServiceKeys],
    [otherServiceKeys]
  );

  // service_request_item_id of each service tab, taken from the backend service_request_item list
  const serviceItemIdByTab = useMemo<Record<string, number | undefined>>(
    () =>
      allServiceTabKeys.reduce<Record<string, number | undefined>>((acc, key) => {
        const matched = farmlandServiceItems.find((s: any) => matchesServiceTab(s, key));
        acc[key] = matched ? getServiceRequestItemId(matched) : undefined;
        return acc;
      }, {}),
    [farmlandServiceItems, allServiceTabKeys]
  );

  // Services that are part of this service request (all tabs until the backend items are known)
  const requestServiceKeys = useMemo(() => {
    const keys = allServiceTabKeys.filter((key) => serviceItemIdByTab[key] !== undefined);
    return keys.length > 0 ? keys : Object.keys(DEFAULT_SERVICES_CONFIG);
  }, [serviceItemIdByTab, allServiceTabKeys]);

  const resolvedServiceRequestItemId = serviceItemIdByTab[activeTabKey];

  // Once the farmland's services are known, never stay on a service it did not request
  // (e.g. a Borewell-only farmland must not open on, or keep, an Organic Farming tab)
  useEffect(() => {
    if (farmlandServiceItems.length === 0) return;
    if (!requestServiceKeys.includes(activeTabKey) && requestServiceKeys.length > 0) {
      setActiveTabKey(requestServiceKeys[0]);
    }
  }, [farmlandServiceItems, requestServiceKeys, activeTabKey]);

  // Services the backend already shows as approved (survives a page refresh)
  const approvedTabKeys = useMemo(
    () =>
      allServiceTabKeys.filter((key) => {
        const matched = farmlandServiceItems.find((s: any) => matchesServiceTab(s, key));
        return matched ? isServiceItemApproved(matched, maintenanceApprovedStatus, serviceStatuses) : false;
      }),
    [farmlandServiceItems, maintenanceApprovedStatus, serviceStatuses, allServiceTabKeys]
  );

  // Mark backend-approved services as approved; approvals made on this page are never undone here
  useEffect(() => {
    if (approvedTabKeys.length === 0) return;
    setServicesData((prev) => {
      const pending = approvedTabKeys.filter((key) => prev[key] && !prev[key].isApproved);
      if (pending.length === 0) return prev;
      const next = { ...prev };
      pending.forEach((key) => {
        next[key] = { ...next[key], isApproved: true };
      });
      return next;
    });
  }, [approvedTabKeys]);

  // Item sent to the under-review API: the active tab's item of this farmland, else the
  // farmland's first item (an item ID from another farmland returns "item not found")
  const underReviewItemId =
    resolvedServiceRequestItemId ??
    farmlandServiceItems.map(getServiceRequestItemId).find((itemId) => itemId !== undefined);

  // Land size from the backend farmland record, applied to every tab that has no value yet
  const backendAcres =
    farmlandDetailRaw?.acres ?? sourceRaw?.acres ?? listRaw?.acres ?? farmlandDetailRaw?.land_size;
  useEffect(() => {
    if (backendAcres === undefined || backendAcres === null || backendAcres === "") return;
    const landSize = String(backendAcres).toLowerCase().includes("acre")
      ? String(backendAcres)
      : `${backendAcres} Acres`;
    setServicesData((prev) => {
      let changed = false;
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (!next[key].topInputs.value1) {
          next[key] = { ...next[key], topInputs: { ...next[key].topInputs, value1: landSize } };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [backendAcres]);

  // Add a generic config for each service without a dedicated tab (named from master data)
  useEffect(() => {
    if (otherServiceKeys.length === 0) return;
    const landSize =
      backendAcres === undefined || backendAcres === null || backendAcres === ""
        ? ""
        : String(backendAcres).toLowerCase().includes("acre")
        ? String(backendAcres)
        : `${backendAcres} Acres`;
    setServicesData((prev) => {
      const missing = otherServiceKeys.filter((key) => !prev[key]);
      if (missing.length === 0) return prev;
      const next = { ...prev };
      missing.forEach((key) => {
        const serviceId = getTabServiceId(key)!;
        const serviceItem = farmlandServiceItems.find((s: any) => matchesServiceTab(s, key));
        next[key] = buildGenericServiceConfig(key, getOtherServiceName(serviceId, masterData, serviceItem), landSize);
      });
      return next;
    });
  }, [otherServiceKeys, farmlandServiceItems, masterData, backendAcres]);

  // Under review details for this farmland's item (body: farmland_id + service_request_item_id).
  // Waits for getFarmlandById so it is requested once with the real item ID.
  // `currentData` is used so a previous tab's response is never applied to a newly opened tab.
  const { currentData: underReviewResponse, isFetching: isUnderReviewFetching } =
    useGetMaintenanceFarmlandUnderReviewDetailsQuery(
    {
      farmland_id: resolvedFarmlandId ?? 0,
      service_request_item_id: underReviewItemId,
    },
    {
      skip: !resolvedFarmlandId || isFarmlandLoading,
    }
  );

  const hasActiveTabConfig = !!servicesData[activeTabKey];

  // Synchronize backend under review details to service config when available
  useEffect(() => {
    if (!underReviewResponse?.data || underReviewResponse.success === false) return;
    const reviewData: any =
      (typeof underReviewResponse.data === "object" && (underReviewResponse.data as any).reviewDetails) ||
      (typeof underReviewResponse.data === "object" && (underReviewResponse.data as any).details) ||
      underReviewResponse.data;

    if (!reviewData || typeof reviewData !== "object") return;

    setServicesData((prev) => {
      const currentConfig = prev[activeTabKey];
      if (!currentConfig) return prev;

      let updatedComponents = currentConfig.components;
      let updatedTopInputs = currentConfig.topInputs;
      let updatedCropId = currentConfig.cropId;

      if (reviewData.estimation_details && typeof reviewData.estimation_details === "object") {
        const est = reviewData.estimation_details;
        const hasValue = (field?: string) =>
          !!field && est[field] !== undefined && est[field] !== null && est[field] !== "";

        // Itemized lines come straight from their estimation fields
        const itemizedTotal = currentConfig.components.reduce(
          (acc, comp) => acc + (hasValue(comp.field) ? Number(est[comp.field!]) || 0 : 0),
          0
        );
        const backendTotal = Number(est.total_estimation_cost ?? est.estimated_amount);

        updatedComponents = currentConfig.isGeneric
          ? buildGenericComponents(est)
          : currentConfig.components.map((comp) => {
          if (comp.kind) return comp;
          if (comp.field) {
            return hasValue(comp.field) ? { ...comp, amount: Number(est[comp.field]) || 0 } : comp;
          }
          // Quantity × rate line (e.g. Estimated Feets Drilling) is not stored separately:
          // it is the part of the estimated total not covered by the itemized fields
          return Number.isFinite(backendTotal)
            ? { ...comp, amount: Math.max(0, Math.round((backendTotal - itemizedTotal) * 100) / 100) }
            : comp;
        });

        updatedTopInputs = {
          ...updatedTopInputs,
          ...(hasValue(currentConfig.quantityField)
            ? { value2: formatEstimateNumber(est[currentConfig.quantityField!]) }
            : {}),
          ...(hasValue(currentConfig.rateField)
            ? { value3: `₹${formatEstimateNumber(est[currentConfig.rateField!])}` }
            : {}),
        };

        updatedCropId = toPositiveNumber(est.crop_id) ?? updatedCropId;
      } else {
        const rawComponents =
          reviewData.components ||
          reviewData.cost_breakdown ||
          reviewData.charges ||
          reviewData.items;

        if (Array.isArray(rawComponents) && rawComponents.length > 0) {
          updatedComponents = rawComponents.map((c: any, idx: number) => ({
            id: String(c.id || `comp-${idx}`),
            label: c.label || c.name || c.description || `Charge #${idx + 1}`,
            amount: Number(c.amount || c.cost || c.price || 0),
          }));
        }
      }
      // Build on updatedTopInputs so the estimation values set above are kept
      if (reviewData.topInputs && typeof reviewData.topInputs === "object") {
        updatedTopInputs = {
          ...updatedTopInputs,
          ...reviewData.topInputs,
        };
      } else if (reviewData.acers || reviewData.acres || reviewData.land_size) {
        const acresVal = reviewData.acers || reviewData.acres || reviewData.land_size;
        updatedTopInputs = {
          ...updatedTopInputs,
          value1: String(acresVal).toLowerCase().includes("acre") ? String(acresVal) : `${acresVal} Acres`,
        };
      }

      const updatedScopeNotes =
        reviewData.estimation_details?.remarks ||
        reviewData.scope_notes ||
        reviewData.scope ||
        reviewData.remarks ||
        reviewData.notes ||
        currentConfig.scopeNotes;

      const isApproved =
        reviewData.is_approved !== undefined
          ? Boolean(reviewData.is_approved)
          : reviewData.is_maintenance_approved !== undefined
          ? Boolean(reviewData.is_maintenance_approved)
          : reviewData.estimation_details?.is_maintenance_approved !== undefined
          ? Boolean(reviewData.estimation_details.is_maintenance_approved)
          : currentConfig.isApproved;

      return {
        ...prev,
        [activeTabKey]: {
          ...currentConfig,
          components: updatedComponents,
          topInputs: updatedTopInputs,
          cropId: updatedCropId,
          scopeNotes: updatedScopeNotes,
          isApproved,
        },
      };
    });
    // hasActiveTabConfig: a generic tab's config can be added after its estimation has loaded
  }, [underReviewResponse, activeTabKey, hasActiveTabConfig]);

  // When an already-approved farmland is opened, move from an approved service to the first one
  // still awaiting approval (e.g. Borewell approved → Fencing). Decided once, after the farmland,
  // master data and the open tab's estimation have loaded, so manual tab switches are kept.
  const hasPickedInitialTabRef = useRef(false);
  useEffect(() => {
    if (hasPickedInitialTabRef.current) return;
    if (isFarmlandLoading || isMasterDataLoading || isUnderReviewFetching) return;
    if (farmlandServiceItems.length === 0) return;
    hasPickedInitialTabRef.current = true;

    const reviewData: any =
      (underReviewResponse?.data as any)?.reviewDetails ||
      (underReviewResponse?.data as any)?.details ||
      underReviewResponse?.data;
    const isActiveApprovedByReview =
      underReviewResponse?.success !== false &&
      (Number(reviewData?.estimation_details?.is_maintenance_approved) === 1 ||
        Number(reviewData?.is_maintenance_approved) === 1 ||
        reviewData?.is_approved === true);
    const isTabApproved = (key: string) =>
      approvedTabKeys.includes(key) ||
      !!servicesData[key]?.isApproved ||
      (key === activeTabKey && isActiveApprovedByReview);

    if (!isTabApproved(activeTabKey)) return;
    const firstPendingKey = requestServiceKeys.find((key) => !isTabApproved(key));
    if (firstPendingKey) setActiveTabKey(firstPendingKey);
  }, [
    isFarmlandLoading,
    isMasterDataLoading,
    isUnderReviewFetching,
    farmlandServiceItems,
    underReviewResponse,
    approvedTabKeys,
    servicesData,
    activeTabKey,
    requestServiceKeys,
  ]);

  const singleDetailItem = useMemo(
    () =>
      farmlandDetailRaw
        ? mapApiFarmlandToServiceRequest(farmlandDetailRaw, 0, "Quotations", quotationStatusId, geoData)
        : null,
    [farmlandDetailRaw, quotationStatusId, geoData]
  );

  const apiItem = useMemo(
    () =>
      listRaw
        ? mapApiFarmlandToServiceRequest(listRaw, 0, "Quotations", quotationStatusId, geoData)
        : null,
    [listRaw, quotationStatusId, geoData]
  );

  // Placeholder built from the route id until backend data arrives (no dummy records)
  const emptyItem = useMemo(
    () =>
      mapApiFarmlandToServiceRequest(
        { farmland_id: resolvedFarmlandId ?? id, customer_name: "—" },
        0,
        "Quotations",
        quotationStatusId,
        geoData
      ),
    [resolvedFarmlandId, id, quotationStatusId, geoData]
  );

  const baseItem = propItem || stateItem || singleDetailItem || apiItem || emptyItem;

  const item = useMemo<ServiceRequestPipelineItem>(() => {
    if (!underReviewResponse?.data || underReviewResponse.success === false) return baseItem;
    const reviewData: any =
      (typeof underReviewResponse.data === "object" && (underReviewResponse.data as any).reviewDetails) ||
      (typeof underReviewResponse.data === "object" && (underReviewResponse.data as any).details) ||
      underReviewResponse.data;
    if (!reviewData || typeof reviewData !== "object") return baseItem;

    const formattedCost = reviewData.estimation_details?.total_estimation_cost
      ? `₹${Number(reviewData.estimation_details.total_estimation_cost).toLocaleString("en-IN")}`
      : baseItem.estimatedCost;

    return {
      ...baseItem,
      customerName: reviewData.customer_name || baseItem.customerName,
      code: reviewData.farmland_code || baseItem.code,
      landId: reviewData.farmland_code || baseItem.landId,
      landSize: reviewData.acers
        ? (String(reviewData.acers).toLowerCase().includes("acre") ? String(reviewData.acers) : `${reviewData.acers} Acres`)
        : reviewData.acres
        ? (String(reviewData.acres).toLowerCase().includes("acre") ? String(reviewData.acres) : `${reviewData.acres} Acres`)
        : baseItem.landSize,
      farmlandId: resolvedFarmlandId || reviewData.farmland_id || baseItem.farmlandId,
      serviceRequestId:
        resolvedServiceRequestId ||
        reviewData.service_req_item_id ||
        reviewData.service_request_item_id ||
        baseItem.serviceRequestId,
      service_request_id:
        resolvedServiceRequestId ||
        (baseItem as any).service_request_id,
      service_request_item_id:
        resolvedServiceRequestItemId ||
        reviewData.service_req_item_id ||
        reviewData.service_request_item_id ||
        baseItem.service_request_item_id,
      estimatedCost: formattedCost,
      description:
        reviewData.estimation_details?.remarks ||
        reviewData.service_name ||
        baseItem.description,
      requirementsText:
        reviewData.estimation_details?.remarks ||
        baseItem.requirementsText,
    };
  }, [baseItem, underReviewResponse, resolvedFarmlandId, resolvedServiceRequestId, resolvedServiceRequestItemId]);

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
      navigate(`${prefix}/service-requests?tab=Quotations`);
    });

  const activeService = servicesData[activeTabKey] || servicesData.borewell;
  // Approved services are view-only (Approve can still re-submit them)
  const isActiveServiceLocked = activeService.isApproved;
  // Generic services (no estimation update API) are always view-only but can still be approved
  const isActiveServiceReadOnly = isActiveServiceLocked || !!activeService.isGeneric;

  // Whether the backend reports that the field officer has not submitted this service's estimation
  // yet (getFarmlandById item `estimation: null`, or under-review `estimation_details: null`)
  const activeReviewData: any =
    underReviewResponse?.success === false
      ? undefined
      : (underReviewResponse?.data as any)?.reviewDetails ||
        (underReviewResponse?.data as any)?.details ||
        underReviewResponse?.data;
  const activeServiceItem = farmlandServiceItems.find((s: any) => matchesServiceTab(s, activeTabKey));
  const isActiveEstimationMissing =
    !activeReviewData?.estimation_details &&
    ((!!activeServiceItem && "estimation" in activeServiceItem && !activeServiceItem.estimation) ||
      (!!activeReviewData && "estimation_details" in activeReviewData && !activeReviewData.estimation_details));

  // A service without an estimation cannot be approved: clear a stale/incorrect approved flag
  useEffect(() => {
    if (!isActiveEstimationMissing || isUnderReviewFetching) return;
    setServicesData((prev) =>
      prev[activeTabKey]?.isApproved
        ? { ...prev, [activeTabKey]: { ...prev[activeTabKey], isApproved: false } }
        : prev
    );
  }, [isActiveEstimationMissing, isUnderReviewFetching, activeTabKey]);

  // Calculate total cost dynamically in real time
  const totalCalculatedCost = useMemo(() => {
    return activeService.components.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [activeService.components]);

  // Handle individual component cost changes
  const handleComponentAmountChange = (componentId: string, rawVal: string) => {
    const cleanNum = Number(rawVal.replace(/[^0-9]/g, "")) || 0;
    setServicesData((prev) => {
      const currentConfig = prev[activeTabKey];
      if (!currentConfig) return prev;
      return {
        ...prev,
        [activeTabKey]: {
          ...currentConfig,
          components: currentConfig.components.map((comp) =>
            comp.id === componentId ? { ...comp, amount: cleanNum } : comp
          ),
        },
      };
    });
  };

  // Handle top config inputs
  const handleTopInputChange = (field: "value1" | "value2" | "value3", val: string) => {
    setServicesData((prev) => {
      const currentConfig = prev[activeTabKey];
      if (!currentConfig) return prev;
      return {
        ...prev,
        [activeTabKey]: {
          ...currentConfig,
          topInputs: {
            ...currentConfig.topInputs,
            [field]: val,
          },
        },
      };
    });
  };

  // Crops for the Organic Farming "Select Yielding Crops" dropdown (get_all_master_data)
  const cropOptions = useMemo<MasterStatusEntry[]>(
    () => (Array.isArray(masterData?.cropsResult) ? (masterData!.cropsResult as MasterStatusEntry[]) : []),
    [masterData]
  );

  const handleCropChange = (cropId: number | undefined) => {
    setServicesData((prev) => {
      const currentConfig = prev[activeTabKey];
      if (!currentConfig) return prev;
      return { ...prev, [activeTabKey]: { ...currentConfig, cropId } };
    });
  };

  // Handle scope & notes changes
  const handleScopeNotesChange = (val: string) => {
    setServicesData((prev) => {
      const currentConfig = prev[activeTabKey];
      if (!currentConfig) return prev;
      return {
        ...prev,
        [activeTabKey]: {
          ...currentConfig,
          scopeNotes: val,
        },
      };
    });
  };

  // Resolve the backend service_request_item_id for estimation & approval APIs
  const getTargetItemIdForService = (serviceKey: string): number | undefined =>
    serviceItemIdByTab[serviceKey];

  const getTargetApprovalItemId = (): number | undefined => {
    return getTargetItemIdForService(activeTabKey);
  };

  // Error text for a failed estimation/approval call
  const getActionErrorMessage = (err: any, fallback: string, itemId: number): string => {
    const errMsg = String(err?.data?.error || err?.data?.message || err?.message || fallback);
    // Estimations are created by the field officer; the update API cannot create one
    if (errMsg.toLowerCase().includes("estimation not found")) {
      return `No ${activeService.name} estimation exists yet for service request item #${itemId}. The field officer must submit the estimation before it can be edited.`;
    }
    return errMsg;
  };

  const notifyMissingServiceItem = () => {
    toast.error(`${activeService.name} is not part of this service request.`);
  };

  // Helper to call estimation update API for any service item.
  // Every amount comes from the form line mapped to that API field (see DEFAULT_SERVICES_CONFIG).
  const executeServiceEstimationUpdate = async (
    itemId: number,
    targetServiceKey: string = activeTabKey
  ): Promise<MaintenanceActionApiResponse | undefined> => {
    const serviceConfig = servicesData[targetServiceKey] || activeService;
    const amount = (field: string) => getFieldAmount(serviceConfig, field);
    const estimatedAmount = getServiceTotal(serviceConfig);
    const quantity = parseInputNumber(serviceConfig.topInputs.value2);
    const rate = parseInputNumber(serviceConfig.topInputs.value3);

    if (targetServiceKey === "borewell") {
      return await updateBorewellEstimation({
        service_request_item_id: itemId,
        estimated_feet: quantity,
        per_feet_rate: rate,
        labour_charges: amount("labour_charges"),
        inspection_charges: amount("inspection_charges"),
        casing_pipe_charges: amount("casing_pipe_charges"),
        pump_charges: amount("pump_charges"),
        electric_charges: amount("electric_charges"),
        gst_amount: amount("gst_amount"),
        glc_fee: amount("glc_fee"),
        estimated_amount: estimatedAmount,
        remarks: serviceConfig.scopeNotes?.trim() || "Borewell estimation ready",
      }).unwrap();
    } else if (targetServiceKey === "fencing") {
      return await updateFencingEstimation({
        service_request_item_id: itemId,
        wire_length: quantity,
        wire_rate: rate,
        labour_charges: amount("labour_charges"),
        inspection_charges: amount("inspection_charges"),
        material_mesh_charges: amount("material_mesh_charges"),
        pole_erection_charges: amount("pole_erection_charges"),
        gate_installation_charges: amount("gate_installation_charges"),
        gst_amount: amount("gst_amount"),
        glc_fee: amount("glc_fee"),
        estimated_amount: estimatedAmount,
        remarks: serviceConfig.scopeNotes?.trim() || "Fencing estimation details",
      }).unwrap();
    } else if (targetServiceKey === "farmhouse") {
      return await updateFarmhouseEstimation({
        service_request_item_id: itemId,
        labour_charges: amount("labour_charges"),
        inspection_architecture_charges: amount("inspection_architecture_charges"),
        civil_foundation_charges: amount("civil_foundation_charges"),
        plumbing_electrical_charges: amount("plumbing_electrical_charges"),
        finishing_painting_charges: amount("finishing_painting_charges"),
        gst_amount: amount("gst_amount"),
        glc_fee: amount("glc_fee"),
        estimated_amount: estimatedAmount,
        remarks: serviceConfig.scopeNotes?.trim() || "Farmhouse estimation complete",
      }).unwrap();
    } else if (targetServiceKey === "organic") {
      if (!serviceConfig.cropId) {
        // Same rule as the field officer form: a crop is required for Organic Farming
        throw new Error("Please select a crop for Organic Farming before saving.");
      }
      return await updateOrganicFarmingEstimation({
        service_request_item_id: itemId,
        crop_id: serviceConfig.cropId,
        land_preparation_charges: amount("land_preparation_charges"),
        fertilizer_charges: amount("fertilizer_charges"),
        seed_charges: amount("seed_charges"),
        planting_charges: amount("planting_charges"),
        labour_charges: amount("labour_charges"),
        irrigation_charges: amount("irrigation_charges"),
        other_charges: amount("other_charges"),
        gst_amount: amount("gst_amount"),
        glc_fee: amount("glc_fee"),
        estimated_amount: estimatedAmount,
        remarks: serviceConfig.scopeNotes?.trim() || "Organic farming plan",
      }).unwrap();
    }
  };

  // Save changes handler: dynamically calls the respective estimation update API
  const handleSaveChanges = async () => {
    const targetItemId = getTargetItemIdForService(activeTabKey);
    if (!targetItemId) {
      notifyMissingServiceItem();
      return;
    }

    try {
      const response: MaintenanceActionApiResponse | undefined =
        await executeServiceEstimationUpdate(targetItemId, activeTabKey);
      toast.success(
        response?.message || `Changes for ${activeService.name} saved successfully!`
      );
    } catch (err: any) {
      console.error(`Failed to save changes for ${activeService.name}:`, err);
      toast.error(
        getActionErrorMessage(err, `Failed to save changes for ${activeService.name}`, targetItemId)
      );
    }
  };

  // Approve handler: sequentially invokes updateMaintenanceApproval and updateServiceRequestItemStatus
  const handleApproveService = async () => {
    const targetApprovalId = getTargetApprovalItemId();
    if (!targetApprovalId) {
      notifyMissingServiceItem();
      return;
    }

    // service_status_id "Maintenance Approved" from get_all_master_data (never "Under Verification")
    const approvedStatusId = toPositiveNumber(maintenanceApprovedStatus?.id);
    if (!approvedStatusId) {
      toast.error(
        "Maintenance Approved status is not available yet (get_all_master_data). Please try again in a moment."
      );
      return;
    }

    if (isActiveEstimationMissing) {
      toast.error(
        `The field officer has not submitted the ${activeService.name} estimation yet, so it cannot be approved.`
      );
      return;
    }

    const callApprovalApis = async (itemId: number) => {
      // 1. Call updateMaintenanceApproval
      await updateMaintenanceApproval({
        service_request_item_id: itemId,
        service_status_id: approvedStatusId,
        is_maintenance_approved: 1,
        remarks: "Estimation verified",
      }).unwrap();

      // 2. Call updateServiceRequestItemStatus
      await updateServiceRequestItemStatus({
        service_request_item_id: itemId,
        service_status_id: approvedStatusId,
        remarks: "Work started on site",
      }).unwrap();
    };

    try {
      // No save-and-retry on "Estimation not found": the update APIs cannot create an estimation
      // (only the field officer can), so the friendly error from getActionErrorMessage is shown
      await callApprovalApis(targetApprovalId);

      setServicesData((prev) => ({
        ...prev,
        [activeTabKey]: {
          ...prev[activeTabKey],
          isApproved: true,
        },
      }));
      // Refresh only the Service Requests list (once) so it reflects the approval when revisited
      dispatch(maintenanceService.util.invalidateTags(["ServiceRequests"]));
      // Step order = tab order of this request's services. The all-approved dialog is only shown
      // when the final step is approved and nothing else is pending; otherwise go to the next step.
      const currentIndex = requestServiceKeys.indexOf(activeTabKey);
      const isFinalStep = currentIndex === -1 || currentIndex === requestServiceKeys.length - 1;
      const otherPendingKeys = requestServiceKeys.filter(
        (key) => key !== activeTabKey && !servicesData[key]?.isApproved
      );
      if (isFinalStep && otherPendingKeys.length === 0) {
        setShowAllApprovedDialog(true);
      } else {
        setSuccessModalServiceKey(activeTabKey);
        const nextStepKey = isFinalStep
          ? otherPendingKeys[0]
          : requestServiceKeys
              .slice(currentIndex + 1)
              .find((key) => !servicesData[key]?.isApproved) ?? requestServiceKeys[currentIndex + 1];
        if (nextStepKey) setActiveTabKey(nextStepKey);
      }
      toast.success(`${activeService.name} Quotation Approved!`);
      if (onApproveSuccess) {
        onApproveSuccess(item, activeService.name, totalCalculatedCost);
      }
    } catch (err: any) {
      console.error("Failed to approve quotation:", err);
      toast.error(
        getActionErrorMessage(err, `Failed to approve ${activeService.name} quotation`, targetApprovalId)
      );
    }
  };

  // Amount shown in the all-approved dialog: the loaded form total, else the backend estimation
  // total of that service item, else unknown (service not opened in this visit)
  const getServiceDisplayTotal = (key: string): number | undefined => {
    const config = servicesData[key];
    const formTotal = config ? getServiceTotal(config) : 0;
    if (formTotal > 0) return formTotal;
    const matched = farmlandServiceItems.find((s: any) => matchesServiceTab(s, key));
    const est = matched?.estimation || matched?.estimation_details;
    const backendTotal = Number(est?.estimation_amount ?? est?.total_estimation_cost ?? est?.estimated_amount);
    return Number.isFinite(backendTotal) && backendTotal > 0 ? backendTotal : undefined;
  };

  // Final "Confirm": mark the whole service request as reviewed, then return to Quotations
  const handleConfirmAllApproved = async () => {
    if (!resolvedServiceRequestId) {
      toast.error("Service request not found for this farmland. Please reload and try again.");
      return;
    }
    try {
      const response = await updateServiceRequestStatus({
        service_request_id: resolvedServiceRequestId,
        request_status_id: REVIEWED_REQUEST_STATUS_ID,
        remarks: REVIEWED_REQUEST_REMARKS,
      }).unwrap();
      if (response?.success === false) {
        throw { data: response };
      }
      toast.success(response?.message || "Service request status updated successfully");
      setShowAllApprovedDialog(false);
      onBack();
    } catch (err: any) {
      console.error("Failed to update service request status:", err);
      toast.error(
        String(err?.data?.error || err?.data?.message || err?.message || "Failed to update service request status")
      );
    }
  };

  // Next service helper for success modal (only services of this request)
  const serviceKeysList = requestServiceKeys;
  const nextUnapprovedServiceKey = useMemo(() => {
    const currentIndex = serviceKeysList.indexOf(activeTabKey);
    for (let i = currentIndex + 1; i < serviceKeysList.length; i++) {
      const key = serviceKeysList[i];
      if (servicesData[key] && !servicesData[key].isApproved) return key;
    }
    for (let i = 0; i < currentIndex; i++) {
      const key = serviceKeysList[i];
      if (servicesData[key] && !servicesData[key].isApproved) return key;
    }
    return null;
  }, [activeTabKey, servicesData, serviceKeysList]);

  const approvedModalConfig = successModalServiceKey ? servicesData[successModalServiceKey] : null;
  const approvedModalTotal = approvedModalConfig
    ? approvedModalConfig.components.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
    : 0;

  const farmlandIdDisplay = item.landId || item.code || String(item.farmlandId || id || "—");
  const officerNameDisplay =
    item.assignedOfficer || item.assignedOfficerDetails?.name || "Not assigned";
  const locationDisplay =
    (item.location && item.location !== "—" ? item.location : "") ||
    formatLocation(item.raw, geoData) ||
    "—";
  const dateDisplay = item.createdDate || "—";

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
            Quotations
          </button>
          <span>&gt;</span>
          <span className="text-[#1E293B] font-bold">
            {farmlandIdDisplay} – {activeService.name}
          </span>
        </div>

        {/* ── Header Row ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#111827] tracking-tight m-0">
              Quotation Details
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-normal mt-1 m-0 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span>
                Farmland ID:{" "}
                <span className="font-semibold text-[#1E293B]">{farmlandIdDisplay}</span>
              </span>
              <span>•</span>
              <span>
                Officer:{" "}
                <span className="font-semibold text-[#1E293B]">{officerNameDisplay}</span>
              </span>
              <span>•</span>
              <span>
                Location:{" "}
                <span className="font-semibold text-[#1E293B]">{locationDisplay}</span>
              </span>
              <span>•</span>
              <span>
                Date: <span className="font-semibold text-[#1E293B]">{dateDisplay}</span>
              </span>
            </p>
          </div>

          {/* Quotation Status Pill */}
          <div className="self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]/50 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
              Quotation Created
            </span>
          </div>
        </div>

        {/* ── Service Pill Tabs Row ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Only the services that are part of this service request */}
          {requestServiceKeys.map((key) => servicesData[key]).filter(Boolean).map((svc) => {
            const isActive = svc.id === activeTabKey;
            const isApproved = svc.isApproved;

            if (isActive) {
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setActiveTabKey(svc.id)}
                  className="flex items-center gap-2 px-4.5 py-2 rounded-full bg-[#0A2540] text-white text-xs font-bold shadow-xs cursor-pointer border-none transition-all"
                >
                  {isApproved ? (
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                  )}
                  <span>{svc.name}</span>
                </button>
              );
            }

            if (isApproved) {
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setActiveTabKey(svc.id)}
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] border border-[#86EFAC]/60 text-xs font-bold cursor-pointer transition-all shadow-2xs"
                >
                  <span className="w-4 h-4 rounded-full bg-[#15803D] flex items-center justify-center text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>{svc.name}</span>
                </button>
              );
            }

            // Inactive & Pending Approval
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => setActiveTabKey(svc.id)}
                className="flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] border border-[#FCA5A5]/50 text-xs font-semibold cursor-pointer transition-all shadow-2xs"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[10px] font-black leading-none">
                  !
                </span>
                <span>{svc.name}</span>
              </button>
            );
          })}
        </div>

        {/* ── Main Cost Breakdown Card Container ────────────────────────────── */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm p-6 sm:p-8 flex flex-col gap-6">
          {/* Header Light Blue Banner Box */}
          <div className="bg-[#F0F7FF] rounded-[20px] p-5 sm:p-6 border border-[#D0E4FA] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] m-0">
                Itemized Cost Breakdown for {activeService.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] font-normal mt-1 m-0">
                {isActiveServiceLocked
                  ? "This quotation is approved. Details are view-only."
                  : isActiveEstimationMissing
                  ? "The field officer has not submitted this estimation yet. It can be approved once submitted."
                  : activeService.isGeneric
                  ? "Estimation submitted by the field officer. Details are view-only."
                  : "Enter component charges below. Total cost calculates automatically in real-time."}
              </p>
            </div>

            {/* Total Estimated Cost Box */}
            <div className="bg-white rounded-[16px] px-5 py-3 border border-[#E2E8F0] shadow-2xs flex items-center gap-3.5 self-start md:self-auto shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] flex items-center justify-center text-[#1877F2]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  TOTAL ESTIMATED COST
                </span>
                <span className="block text-xl sm:text-2xl font-extrabold text-[#0A2540]">
                  ₹{totalCalculatedCost.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Top 3 Config Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                {activeService.topInputs.label1}
              </label>
              <input
                type="text"
                value={activeService.topInputs.value1}
                readOnly={isActiveServiceReadOnly}
                onChange={(e) => handleTopInputChange("value1", e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-[12px] text-xs sm:text-sm font-semibold text-[#0F172A] outline-none focus:border-[#1877F2] transition-colors shadow-2xs read-only:bg-[#F1F5F9] read-only:text-[#475569] read-only:cursor-not-allowed"
              />
            </div>

            {!activeService.hideFeetAndRate && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1.5">
                    {activeService.topInputs.label2}
                  </label>
                  <input
                    type="text"
                    value={activeService.topInputs.value2}
                    readOnly={isActiveServiceReadOnly}
                    onChange={(e) => handleTopInputChange("value2", e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-[12px] text-xs sm:text-sm font-semibold text-[#0F172A] outline-none focus:border-[#1877F2] transition-colors shadow-2xs read-only:bg-[#F1F5F9] read-only:text-[#475569] read-only:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1.5">
                    {activeService.topInputs.label3}
                  </label>
                  <input
                    type="text"
                    value={activeService.topInputs.value3}
                    readOnly={isActiveServiceReadOnly}
                    onChange={(e) => handleTopInputChange("value3", e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-[12px] text-xs sm:text-sm font-semibold text-[#0F172A] outline-none focus:border-[#1877F2] transition-colors shadow-2xs read-only:bg-[#F1F5F9] read-only:text-[#475569] read-only:cursor-not-allowed"
                  />
                </div>
              </>
            )}
          </div>

          {/* Cost Breakdown Items Grid */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              COST BREAKDOWN ITEMS ({activeService.components.length} COMPONENTS)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeService.components.map((comp) =>
                comp.kind === "crop" ? (
                  <div
                    key={comp.id}
                    className="bg-[#F8FAFC] rounded-[16px] p-4 border border-[#E2E8F0] flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#334155] truncate pr-2">{comp.label}</span>
                      <span className="text-[10px] font-semibold text-[#1C5F9D] bg-[#EBF5FF] px-2 py-0.5 rounded-full border border-[#BFDBFE] uppercase tracking-wider">
                        Crop Variety
                      </span>
                    </div>
                    <select
                      value={activeService.cropId || ""}
                      disabled={isActiveServiceReadOnly}
                      onChange={(e) => handleCropChange(Number(e.target.value) || undefined)}
                      className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-[10px] text-xs sm:text-sm font-bold text-[#0F172A] outline-none focus:border-[#1877F2] transition-colors shadow-2xs cursor-pointer disabled:bg-[#F1F5F9] disabled:text-[#475569] disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>
                        Select a crop
                      </option>
                      {cropOptions.map((crop) => (
                        <option key={crop.id} value={crop.id}>
                          {crop.description || crop.code}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                <div
                  key={comp.id}
                  className="bg-[#F8FAFC] rounded-[16px] p-4 border border-[#E2E8F0] flex flex-col justify-between gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#334155] truncate pr-2">
                      {comp.label}
                    </span>
                    <span className="text-[11px] font-semibold text-[#94A3B8]">INR</span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={`₹ ${comp.amount.toLocaleString("en-IN")}`}
                      readOnly={isActiveServiceReadOnly}
                      onChange={(e) => handleComponentAmountChange(comp.id, e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-[10px] text-xs sm:text-sm font-bold text-[#0F172A] outline-none focus:border-[#1877F2] transition-colors shadow-2xs read-only:bg-[#F1F5F9] read-only:text-[#475569] read-only:cursor-not-allowed"
                    />
                  </div>
                </div>
                )
              )}
            </div>
          </div>

          {/* Enter Service Scope & Notes Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-bold text-[#334155]">
              Enter Service Scope &amp; Notes
            </label>
            <textarea
              rows={3}
              value={activeService.scopeNotes}
              readOnly={isActiveServiceReadOnly}
              onChange={(e) => handleScopeNotesChange(e.target.value)}
              className="w-full p-4 bg-white border border-[#CBD5E1] rounded-[16px] text-xs sm:text-sm text-[#334155] font-normal leading-relaxed outline-none focus:border-[#1877F2] transition-colors shadow-2xs resize-y read-only:bg-[#F1F5F9] read-only:text-[#475569] read-only:cursor-not-allowed"
              placeholder="Enter service scope and inspection notes..."
            />
          </div>

          {/* Bottom Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-[#F1F5F9]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 border border-[#CBD5E1] rounded-full text-xs font-bold text-[#334155] cursor-pointer transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Quotations
              </button>

              <button
                type="button"
                disabled={isSaving || isApproving || isActiveServiceReadOnly}
                title={
                  isActiveServiceLocked
                    ? `${activeService.name} is approved and can no longer be edited`
                    : activeService.isGeneric
                    ? `${activeService.name} estimation can only be viewed here`
                    : undefined
                }
                onClick={handleSaveChanges}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 border border-[#CBD5E1] rounded-full text-xs font-bold text-[#334155] cursor-pointer transition-colors shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FileText className="w-3.5 h-3.5 text-[#64748B]" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <button
              type="button"
              // An approved service can be submitted again; only blocked while a request is running
              disabled={isSaving || isApproving}
              onClick={handleApproveService}
              title={activeService.isApproved ? `Submit ${activeService.name} approval again` : undefined}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeService.isApproved
                  ? "bg-[#15803D] hover:bg-[#166534] text-white cursor-pointer active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
                  : "bg-[#0A2540] hover:bg-[#07192C] text-white cursor-pointer active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              {isApproving
                ? "Approving..."
                : activeService.isApproved
                ? `${activeService.name} Approved`
                : `Approve ${activeService.name}`}
            </button>
          </div>
        </div>
      </main>

      {/* ── Quotation Approved Success Modal (Matches Image 3) ────────────────── */}
      {successModalServiceKey && approvedModalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setSuccessModalServiceKey(null)}
          />
          <div className="relative bg-white rounded-[28px] max-w-[480px] w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#E2E8F0] flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSuccessModalServiceKey(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors border-none bg-transparent cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Mint Circle Checkmark Icon */}
            <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#15803D] mb-4">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-xl sm:text-[22px] font-bold text-[#0F172A] m-0 mb-1.5">
              Quotation Approved!
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] font-normal leading-relaxed m-0 mb-5 max-w-sm">
              The itemized quotation for{" "}
              <span className="font-bold text-[#1E293B]">
                {approvedModalConfig.name}
              </span>{" "}
              has been approved. The customer and field dispatch team have been notified.
            </p>

            {/* Summary Details Card */}
            <div className="w-full bg-[#F8FAFC] rounded-[18px] p-4.5 border border-[#E2E8F0] mb-6 text-left flex flex-col gap-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Farmland ID</span>
                <span className="font-bold text-[#0F172A]">{farmlandIdDisplay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Service</span>
                <span className="font-bold text-[#0F172A]">{approvedModalConfig.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Total Approved Amount</span>
                <span className="font-extrabold text-[#1877F2]">
                  ₹{approvedModalTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Field Officer</span>
                <span className="font-bold text-[#0F172A]">{officerNameDisplay}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setSuccessModalServiceKey(null)}
                className="w-full sm:w-1/2 py-2.5 bg-white hover:bg-gray-50 border border-[#CBD5E1] rounded-full text-xs font-bold text-[#334155] cursor-pointer transition-colors shadow-2xs"
              >
                Keep Reviewing
              </button>

              <button
                type="button"
                onClick={() => {
                  const hasMovedToNextService = successModalServiceKey !== activeTabKey;
                  setSuccessModalServiceKey(null);
                  // Already switched to the next service after approval: just continue there
                  if (hasMovedToNextService) return;
                  if (nextUnapprovedServiceKey) {
                    setActiveTabKey(nextUnapprovedServiceKey);
                    return;
                  }
                  // Finish Review: every service is approved, return to the Quotations table
                  onBack();
                }}
                className="w-full sm:w-1/2 py-2.5 bg-[#0A2540] hover:bg-[#07192C] text-white rounded-full text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>
                  {successModalServiceKey !== activeTabKey
                    ? `Continue: ${activeService.name}`
                    : nextUnapprovedServiceKey
                    ? `Next: ${servicesData[nextUnapprovedServiceKey]?.name}`
                    : "Finish Review"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Return to list link */}
            <button
              type="button"
              onClick={onBack}
              className="mt-3 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] underline cursor-pointer border-none bg-transparent"
            >
              Return to Quotations List
            </button>
          </div>
        </div>
      )}

      {/* ── All Services Approved: final confirmation dialog ───────────────────── */}
      {showAllApprovedDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setShowAllApprovedDialog(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="all-approved-title"
            className="relative bg-white rounded-[28px] max-w-[520px] w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl z-10 border border-[#E2E8F0] flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
          >
            <button
              type="button"
              onClick={() => setShowAllApprovedDialog(false)}
              aria-label="Close"
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors border-none bg-transparent cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#15803D] mb-4">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h2 id="all-approved-title" className="text-xl sm:text-[22px] font-bold text-[#0F172A] m-0 mb-1.5">
              All Quotations Approved
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] font-normal leading-relaxed m-0 mb-5 max-w-sm">
              Every service quotation for{" "}
              <span className="font-bold text-[#1E293B]">{farmlandIdDisplay}</span> has been approved.
              Review the summary below and confirm.
            </p>

            {/* Approved services summary */}
            <div className="w-full bg-[#F8FAFC] rounded-[18px] p-4.5 border border-[#E2E8F0] mb-6 text-left flex flex-col gap-2.5 text-xs sm:text-sm">
              {requestServiceKeys.map((key) => {
                const svc = servicesData[key];
                if (!svc) return null;
                return (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 font-semibold text-[#0F172A] min-w-0">
                      <span className="w-4 h-4 shrink-0 rounded-full bg-[#15803D] flex items-center justify-center text-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="truncate">{svc.name}</span>
                    </span>
                    <span className="font-bold text-[#0F172A] shrink-0">
                      {getServiceDisplayTotal(key) !== undefined
                        ? `₹${getServiceDisplayTotal(key)!.toLocaleString("en-IN")}`
                        : "—"}
                    </span>
                  </div>
                );
              })}
              <div className="border-t border-[#E2E8F0] pt-2.5 mt-1 flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Total Approved Amount</span>
                <span className="font-extrabold text-[#1877F2]">
                  ₹
                  {requestServiceKeys
                    .reduce((acc, key) => acc + (getServiceDisplayTotal(key) ?? 0), 0)
                    .toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Field Officer</span>
                <span className="font-bold text-[#0F172A]">{officerNameDisplay}</span>
              </div>
            </div>

            <div className="w-full flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAllApprovedDialog(false)}
                className="w-full sm:w-1/2 py-2.5 bg-white hover:bg-gray-50 border border-[#CBD5E1] rounded-full text-xs font-bold text-[#334155] cursor-pointer transition-colors shadow-2xs"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                disabled={isConfirmingReview}
                onClick={handleConfirmAllApproved}
                className="w-full sm:w-1/2 py-2.5 bg-[#0A2540] hover:bg-[#07192C] text-white rounded-full text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                {isConfirmingReview ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
