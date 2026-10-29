import { createApi, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "@/core/api/baseQueryWithReauth";
import { env } from "@/core/config/env";
import type { ServiceRequestPipelineItem } from "../types/maintenance.types";
import type { MasterDataResponse } from "@/features/super-admin/types/masterData.types";
import { formatLocation } from "@/features/super-admin/utils/locationUtils";

export interface GetAllMaintenanceFarmlandsPayload {
  offset?: number;
  searchString?: string;
  service_ids?: number[];
  // One status or several (e.g. Quotations = [3, 4]); always sent to the API as an array
  request_status_id?: number | number[];
  // Service item statuses (service_status_id) to filter by; empty / omitted = no filter
  service_status_id?: number | number[];
  startDate?: string;
  endDate?: string;
}

export interface MaintenanceFarmlandItem {
  id?: number | string;
  service_request_id?: number | string;
  farmland_id?: number | string;
  farmland_code?: string;
  land_id?: string;
  code?: string;
  customer_name?: string;
  first_name?: string;
  last_name?: string;
  customer_id?: number | string;
  service_category?: string;
  service_name?: string;
  service_ids?: number[];
  services?: Array<{
    id?: number;
    name?: string;
    icon?: string;
    description?: string;
    service_request_item_id?: number | string;
    service_item_id?: number | string;
    [key: string]: any;
  }>;
  location?: string;
  mandal?: string;
  village?: string;
  district?: string;
  address?: string;
  land_size?: string;
  acres?: number | string;
  description?: string;
  requirements?: string;
  remarks?: string;
  request_status_id?: number;
  status_id?: number;
  status_name?: string;
  status_text?: string;
  created_at?: string;
  created_date?: string;
  preferred_visit_date?: string;
  assigned_officer?: string;
  assigned_officer_id?: number | string;
  phone?: string;
  survey_number?: string;
  user_notes?: string;
  live_location_url?: string;
  estimated_cost?: string;
  [key: string]: any;
}

export interface GetAllMaintenanceFarmlandsResponse {
  success?: boolean;
  message?: string;
  data?: MaintenanceFarmlandItem[] | {
    rows?: MaintenanceFarmlandItem[];
    count?: number;
    farmlands?: MaintenanceFarmlandItem[];
    totalCount?: number;
  };
  totalCount?: number;
  total_count?: number;
  count?: number;
}

export interface GetFarmlandByIdPayload {
  farmland_id: number | string;
}

export interface GetFarmlandByIdResponse {
  success?: boolean;
  message?: string;
  data?: MaintenanceFarmlandItem | {
    farmland?: MaintenanceFarmlandItem;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface GetMaintenanceFarmlandUnderReviewDetailsPayload {
  farmland_id: number | string;
  service_request_id?: number | string;
  service_request_item_id?: number | string;
}

export interface MaintenanceUnderReviewComponentItem {
  id?: string | number;
  label?: string;
  name?: string;
  amount?: number | string;
  rate?: number | string;
  quantity?: number | string;
  description?: string;
  [key: string]: any;
}

export interface MaintenanceUnderReviewLocationDetails {
  country_id?: number;
  state_id?: number;
  mandal_id?: number;
  district_id?: number;
  [key: string]: any;
}

export interface MaintenanceEstimationDetails {
  estimation_id?: number;
  total_estimation_cost?: string | number;
  labour_charges?: string | number;
  inspection_architecture_charges?: string | number;
  civil_foundation_charges?: string | number;
  plumbing_electrical_charges?: string | number;
  finishing_painting_charges?: string | number;
  gst_amount?: string | number;
  glc_fee?: string | number;
  remarks?: string;
  created_on?: string;
  updated_on?: string;
  [key: string]: any;
}

export interface MaintenanceUnderReviewDetailsData {
  service_req_item_id?: number | string;
  service_request_item_id?: number | string;
  service_id?: number;
  service_code?: string;
  service_name?: string;
  acers?: string;
  acres?: string;
  land_size?: string;
  customer_name?: string;
  farmland_id?: number | string;
  farmland_code?: string;
  location_details?: MaintenanceUnderReviewLocationDetails;
  estimation_details?: MaintenanceEstimationDetails;

  service_category?: string;
  total_cost?: number | string;
  estimated_cost?: number | string;
  scope_notes?: string;
  remarks?: string;
  components?: MaintenanceUnderReviewComponentItem[];
  topInputs?: {
    label1?: string;
    value1?: string;
    label2?: string;
    value2?: string;
    label3?: string;
    value3?: string;
  };
  is_approved?: boolean;
  status?: string;
  [key: string]: any;
}

export interface GetMaintenanceFarmlandUnderReviewDetailsResponse {
  success?: boolean;
  message?: string;
  data?: MaintenanceUnderReviewDetailsData | {
    reviewDetails?: MaintenanceUnderReviewDetailsData;
    details?: MaintenanceUnderReviewDetailsData;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface FieldOfficerItem {
  id?: number | string;
  user_id?: number | string;
  officer_id?: number | string;
  name?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  officer_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  contact_no?: string;
  role?: string;
  designation?: string;
  profile_url?: string;
  avatar?: string;
  mandal?: string;
  district?: string;
  location?: string;
  assigned_count?: number;
  [key: string]: any;
}

export interface GetFieldOfficerByFarmlandIdPayload {
  farmland_id: number | string;
}

export interface GetFieldOfficerByFarmlandIdResponse {
  success?: boolean;
  message?: string;
  data?:
    | FieldOfficerItem
    | FieldOfficerItem[]
    | {
        officer?: FieldOfficerItem;
        officers?: FieldOfficerItem[];
        fieldOfficer?: FieldOfficerItem;
        rows?: FieldOfficerItem[];
        [key: string]: any;
      }
    | null;
  [key: string]: any;
}

export interface AssignFieldOfficerPayload {
  service_request_id: number | string;
  field_officer_id: number | string;
  remarks?: string;
}

export interface AssignFieldOfficerResponse {
  success?: boolean;
  message?: string;
  data?: any;
  [key: string]: any;
}

export interface UpdateBorewellEstimationPayload {
  service_request_item_id: number | string;
  estimated_feet: number;
  per_feet_rate: number;
  labour_charges: number;
  inspection_charges: number;
  casing_pipe_charges: number;
  pump_charges: number;
  electric_charges: number;
  gst_amount: number;
  glc_fee: number;
  estimated_amount: number;
  remarks: string;
}

export interface UpdateFencingEstimationPayload {
  service_request_item_id: number | string;
  wire_length: number;
  wire_rate: number;
  labour_charges: number;
  inspection_charges: number;
  material_mesh_charges: number;
  pole_erection_charges: number;
  gate_installation_charges: number;
  gst_amount: number;
  glc_fee: number;
  estimated_amount: number;
  remarks: string;
}

export interface UpdateFarmhouseEstimationPayload {
  service_request_item_id: number | string;
  labour_charges: number;
  inspection_architecture_charges: number;
  civil_foundation_charges: number;
  plumbing_electrical_charges: number;
  finishing_painting_charges: number;
  gst_amount: number;
  glc_fee: number;
  estimated_amount: number;
  remarks: string;
}

export interface UpdateOrganicFarmingEstimationPayload {
  service_request_item_id: number | string;
  crop_id: number;
  land_preparation_charges: number;
  fertilizer_charges: number;
  seed_charges: number;
  planting_charges: number;
  labour_charges: number;
  irrigation_charges: number;
  other_charges: number;
  gst_amount: number;
  glc_fee: number;
  estimated_amount: number;
  remarks: string;
}

export interface UpdateMaintenanceApprovalPayload {
  service_request_item_id: number | string;
  service_status_id: number;
  is_maintenance_approved: number;
  remarks: string;
}

export interface UpdateServiceRequestItemStatusPayload {
  service_request_item_id: number | string;
  service_status_id: number;
  remarks: string;
}

export interface UpdateServiceRequestStatusPayload {
  service_request_id: number | string;
  request_status_id: number;
  remarks?: string;
}

export interface MoveToWorkOrderPayload {
  service_request_id: number | string;
  // Every service request item moved in this call (always sent as an array)
  service_request_item_id: number | number[];
  remarks?: string;
}

export interface GetWorkOrderFarmlandsPayload {
  // Optional: without it the backend returns the work order farmlands of every field officer
  field_officer_id?: number | string;
  offset?: number;
}

export interface GetServiceStagesByServiceIdPayload {
  service_id: number | string;
}

export interface GetWorkOrderStagesPayload {
  work_order_id: number | string;
  // Sent only when known
  stage_id?: number | string;
}

export interface MaintenanceActionApiResponse {
  success?: boolean;
  message?: string;
  data?: any;
  [key: string]: any;
}

// Fallback service_request_item_id for getMaintenanceFarmlandUnderReviewDetails when the
// caller cannot resolve the farmland's own item
const DEFAULT_UNDER_REVIEW_SERVICE_REQUEST_ITEM_ID = 7;

// Backend service_id → service name (1 Farmhouse, 2 Fencing, 3 Borewell, 4 Organic)
const SERVICE_NAME_BY_ID: Record<number, string> = {
  1: "Farmhouse",
  2: "Fencing",
  3: "Borewell",
  4: "Organic Management",
  5: "Solar Setup",
  6: "Land Demarcation",
};

// Maintenance master data (/master/get_all_master_data). Lists are keyed like the
// super-admin master data (e.g. milestoneStageStatusResult); unknown keys are kept as-is.
export type MaintenanceMasterData = Partial<MasterDataResponse> & Record<string, any>;

export const mapApiFarmlandToServiceRequest = (
  raw: MaintenanceFarmlandItem,
  index: number = 0,
  defaultStage?: "New Requests" | "Quotations" | "Customer Response",
  quotationStatusId: number = 2,
  geoData?: any
): ServiceRequestPipelineItem => {
  // Identify if raw.farmland_id is a string code (e.g. "FL26100001") rather than numeric primary key
  const isFarmlandIdCode =
    typeof raw.farmland_id === "string" &&
    (raw.farmland_id.toUpperCase().startsWith("FL") || isNaN(Number(raw.farmland_id)));

  const code =
    raw.farm_code ||
    raw.farmland_code ||
    raw.code ||
    raw.land_id ||
    (isFarmlandIdCode
      ? (raw.farmland_id as string)
      : `FL-${raw.farmland_id || raw.id || (3040 + index)}`);

  const landId =
    raw.farm_code ||
    raw.farmland_code ||
    raw.land_id ||
    raw.code ||
    (isFarmlandIdCode
      ? (raw.farmland_id as string)
      : `GLCSOS00${(index % 9) + 1}`);

  // Resolve true numeric/primary key farmland ID (must NOT be "FL26100001")
  let resolvedFarmlandId: number | string;
  if (
    !isFarmlandIdCode &&
    raw.farmland_id !== undefined &&
    raw.farmland_id !== null &&
    String(raw.farmland_id).trim() !== ""
  ) {
    resolvedFarmlandId = !isNaN(Number(raw.farmland_id)) ? Number(raw.farmland_id) : raw.farmland_id;
  } else if (raw.farm_id !== undefined && raw.farm_id !== null && !isNaN(Number(raw.farm_id))) {
    resolvedFarmlandId = Number(raw.farm_id);
  } else if (raw.farmland_table_id !== undefined && raw.farmland_table_id !== null && !isNaN(Number(raw.farmland_table_id))) {
    resolvedFarmlandId = Number(raw.farmland_table_id);
  } else if (raw.id !== undefined && raw.id !== null && !isNaN(Number(raw.id))) {
    resolvedFarmlandId = Number(raw.id);
  } else if (raw.service_request_id !== undefined && raw.service_request_id !== null && !isNaN(Number(raw.service_request_id))) {
    resolvedFarmlandId = Number(raw.service_request_id);
  } else {
    const digits = String(raw.farmland_id || raw.id || code).replace(/\D/g, "");
    resolvedFarmlandId = digits ? Number(digits) : index + 1;
  }

  const farmlandId = resolvedFarmlandId;
  const serviceRequestId = raw.service_request_id || raw.id;
  const id = String(raw.service_request_id || raw.id || resolvedFarmlandId || `sr-api-${index}`);

  const toFullName = (person: any): string =>
    person && typeof person === "object"
      ? person.full_name ||
        person.name ||
        (person.first_name ? `${person.first_name} ${person.last_name || ""}`.trim() : "")
      : "";

  const customerName =
    raw.customer_name ||
    toFullName(raw.customer_details) ||
    (raw.first_name ? `${raw.first_name} ${raw.last_name || ""}`.trim() : "") ||
    raw.user_name ||
    raw.name ||
    raw.owner_name ||
    "—";

  const rawService =
    raw.service_name ||
    raw.service_category ||
    raw.service ||
    (raw.services && raw.services[0]?.name) ||
    SERVICE_NAME_BY_ID[Number(raw.service_id)] ||
    SERVICE_NAME_BY_ID[Number((raw as any).service_request_item?.[0]?.service_id)] ||
    "Borewell";

  let serviceCategory: "Borewell" | "Fencing" | "Farmhouse" | "Organic Management" = "Borewell";
  let iconType: "borewell" | "fencing" | "farmhouse" | "organic" = "borewell";

  const lowerSvc = String(rawService).toLowerCase();
  if (lowerSvc.includes("fence") || lowerSvc.includes("fencing")) {
    serviceCategory = "Fencing";
    iconType = "fencing";
  } else if (
    lowerSvc.includes("farmhouse") ||
    lowerSvc.includes("house") ||
    lowerSvc.includes("villa")
  ) {
    serviceCategory = "Farmhouse";
    iconType = "farmhouse";
  } else if (
    lowerSvc.includes("organic") ||
    lowerSvc.includes("soil") ||
    lowerSvc.includes("manage")
  ) {
    serviceCategory = "Organic Management";
    iconType = "organic";
  } else {
    serviceCategory = "Borewell";
    iconType = "borewell";
  }

  const extraCount =
    raw.services && raw.services.length > 1 ? `+${raw.services.length - 1}` : undefined;

  // Resolve readable location string (Village, Mandal, District) from raw/location_details and geoMasterData
  const location = formatLocation(raw, geoData);

  const description =
    raw.description ||
    raw.requirements ||
    raw.remarks ||
    raw.user_notes ||
    "Service request details submitted.";

  const landSize = raw.land_size || (raw.acres || raw.total_acres ? `${raw.acres || raw.total_acres} Acres` : "—");
  const address = raw.address || (location !== "—" ? location : "—");
  const preferredVisitDate = raw.preferred_visit_date || raw.visit_date || "—";
  const rawCreatedDate = raw.created_at || raw.created_date || raw.created_on;
  const createdDate =
    rawCreatedDate
      ? new Date(rawCreatedDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const rawItemList =
    (Array.isArray((raw as any).service_request_item) && (raw as any).service_request_item) ||
    (Array.isArray((raw as any).service_request_items) && (raw as any).service_request_items) ||
    (Array.isArray(raw.services) && raw.services) ||
    [];

  const servicesList =
    rawItemList.length > 0
      ? rawItemList.map((s: any) => {
          let sName = s.name || s.service_name;
          if (!sName) {
            sName = SERVICE_NAME_BY_ID[Number(s.service_id)] || rawService;
          }
          let sIcon: "borewell" | "fencing" | "farmhouse" | "organic" = "borewell";
          const sLower = String(sName).toLowerCase();
          if (sLower.includes("fence")) sIcon = "fencing";
          else if (sLower.includes("farmhouse") || sLower.includes("house") || sLower.includes("villa")) sIcon = "farmhouse";
          else if (sLower.includes("organic") || sLower.includes("agri")) sIcon = "organic";

          return {
            name: sName,
            icon: sIcon,
            subtitle: s.description || "Required on priority",
            service_request_item_id: s.service_request_item_id || s.service_req_item_id,
            service_id: s.service_id,
          };
        })
      : [
          {
            name: rawService,
            icon: iconType,
            subtitle: description,
          },
        ];

  let stage: "New Requests" | "Quotations" | "Customer Response" = defaultStage || "New Requests";
  if (defaultStage) {
    // Rows are fetched per stage tab (request_status_id), so the requested stage is authoritative.
    // Status codes can overlap between tabs (e.g. Quotations uses 3 "Quotation Given").
    stage = defaultStage;
  } else if (
    raw.request_status_id === quotationStatusId ||
    raw.status_id === quotationStatusId ||
    raw.request_status_id === 2 ||
    raw.status_id === 2 ||
    raw.stage === "Quotations" ||
    defaultStage === "Quotations"
  ) {
    stage = "Quotations";
  } else if (
    raw.request_status_id === 3 ||
    raw.status_id === 3 ||
    raw.stage === "Customer Response" ||
    defaultStage === "Customer Response"
  ) {
    stage = "Customer Response";
  }

  const primaryItemId =
    (rawItemList.length > 0 &&
      (rawItemList[0]?.service_request_item_id ||
        rawItemList[0]?.service_req_item_id ||
        rawItemList[0]?.id)) ||
    raw.service_req_item_id ||
    raw.service_request_item_id ||
    raw.service_item_id ||
    raw.request_item_id ||
    undefined;

  return {
    id,
    code,
    landId,
    farmlandId,
    serviceRequestId,
    service_request_id: raw.service_request_id || raw.serviceRequestId || serviceRequestId,
    customerName,
    serviceCategory,
    serviceCategoryExtra: extraCount,
    location,
    location_details: raw.location_details || (typeof raw.location === "object" ? raw.location : undefined),
    description,
    iconType,
    stage,
    cardAction: "verify-now",
    landSize,
    address,
    preferredVisitDate,
    servicesList,
    requirementsText: description,
    assignedOfficer:
      raw.assigned_officer ||
      raw.officer_name ||
      toFullName(raw.field_officer_details) ||
      toFullName(raw.field_officer) ||
      toFullName(rawItemList[0]?.field_officer_details) ||
      toFullName(rawItemList[0]?.field_officer) ||
      undefined,
    phone: raw.phone || raw.contact_no || raw.mobile || "—",
    surveyNumber: raw.survey_number || raw.survey_no || "—",
    userNotes: raw.user_notes || description,
    liveLocationUrl: raw.live_location_url || raw.map_url || "https://maps.google.com/?q=17.385044,78.486671",
    estimatedCost: raw.estimated_cost || raw.amount || "—",
    estimatedDuration: raw.estimated_duration || "—",
    statusText: raw.status_text || raw.status_name || (stage === "Quotations" ? "Under Verification" : "New Request"),
    createdDate,
    service_request_item_id: primaryItemId,
    serviceRequestItemId: primaryItemId,
    raw,
  };
};

// Refetch farmland/service-request queries only when a mutation actually succeeds;
// a failed call (HTTP error or `success: false`) leaves the cached data untouched.
const invalidateOnSuccess = (
  result: { success?: boolean } | undefined,
  error: unknown
): ("MaintenanceFarmlands" | "ServiceRequests")[] =>
  error || result?.success === false ? [] : ["MaintenanceFarmlands", "ServiceRequests"];

export const maintenanceService = createApi({
  reducerPath: "maintenanceService",
  baseQuery: createBaseQueryWithReauth(env.MAINTENANCE_API_BASE_URL),
  tagTypes: ["MaintenanceFarmlands", "ServiceRequests", "MaintenanceMasterData"],
  endpoints: (builder) => ({
    getMaintenanceMasterData: builder.query<MaintenanceMasterData, void>({
      query: () => ({
        url: "/master/get_all_master_data",
        method: "POST",
        body: "", // empty body as specified in curl
      }),
      providesTags: ["MaintenanceMasterData"],
      transformResponse: (response: any): MaintenanceMasterData =>
        (response?.data && typeof response.data === "object" ? response.data : response) || {},
    }),

    // Stages of one service, in order (Work Order details timeline)
    getServiceStagesByServiceId: builder.query<MaintenanceActionApiResponse, GetServiceStagesByServiceIdPayload>({
      query: (body) => ({
        url: "/master/getServiceStagesByServiceId",
        method: "POST",
        body: { service_id: Number(body.service_id) || body.service_id },
      }),
      transformErrorResponse: (response: FetchBaseQueryError) => {
        console.warn(
          "getServiceStagesByServiceId API response status:",
          response?.status,
          "data" in response ? response.data : undefined
        );
        return response;
      },
      providesTags: (_result, _error, arg) => [
        { type: "MaintenanceMasterData", id: `service-stages-${arg.service_id}` },
      ],
    }),

    getAllMaintenanceFarmlands: builder.query<
      GetAllMaintenanceFarmlandsResponse,
      GetAllMaintenanceFarmlandsPayload | void
    >({
      query: (arg) => {
        const payload = (arg || {}) as GetAllMaintenanceFarmlandsPayload;
        const body: Record<string, any> = {
          offset: typeof payload.offset === "number" ? payload.offset : 0,
          searchString: payload.searchString || "",
          service_ids: Array.isArray(payload.service_ids) ? payload.service_ids : [],
          // The API takes request_status_id as an array of status IDs. An explicit empty array is
          // sent as [] (no request status filter, e.g. Customer Response filters by service status);
          // a missing value still defaults to [1].
          request_status_id: (() => {
            if (Array.isArray(payload.request_status_id) && payload.request_status_id.length === 0) {
              return [];
            }
            const ids = (
              Array.isArray(payload.request_status_id)
                ? payload.request_status_id
                : payload.request_status_id !== undefined && payload.request_status_id !== null
                ? [payload.request_status_id]
                : [1]
            )
              .map(Number)
              .filter((statusId) => Number.isFinite(statusId) && statusId > 0);
            return ids.length > 0 ? ids : [1];
          })(),
          // Always sent as an array of service status IDs ([] when no service status filter)
          service_status_id: (Array.isArray(payload.service_status_id)
            ? payload.service_status_id
            : payload.service_status_id !== undefined && payload.service_status_id !== null
            ? [payload.service_status_id]
            : []
          )
            .map(Number)
            .filter((statusId) => Number.isFinite(statusId) && statusId > 0),
          startDate: payload.startDate || "",
          endDate: payload.endDate || "",
        };

        return {
          url: "/serviceRequests/getAllMaintenanceFarmlands",
          method: "POST",
          body,
        };
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        console.warn(
          "getAllMaintenanceFarmlands API response status:",
          response?.status,
          "data" in response ? response.data : undefined
        );
        return response;
      },
      providesTags: ["MaintenanceFarmlands", "ServiceRequests"],
    }),

    getFarmlandById: builder.query<
      GetFarmlandByIdResponse,
      GetFarmlandByIdPayload
    >({
      query: (body) => {
        let cleanFarmlandId: number | string = body.farmland_id;
        if (
          typeof cleanFarmlandId === "string" &&
          (cleanFarmlandId.toUpperCase().startsWith("FL") || isNaN(Number(cleanFarmlandId)))
        ) {
          const digits = cleanFarmlandId.replace(/\D/g, "");
          cleanFarmlandId = digits ? Number(digits) : cleanFarmlandId;
        } else if (typeof cleanFarmlandId !== "number") {
          const num = Number(cleanFarmlandId);
          if (!isNaN(num)) cleanFarmlandId = num;
        }

        return {
          url: "/serviceRequests/getFarmlandById",
          method: "POST",
          body: {
            farmland_id: cleanFarmlandId,
          },
        };
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        console.warn(
          "getFarmlandById API response status:",
          response?.status,
          "data" in response ? response.data : undefined
        );
        return response;
      },
      providesTags: (_result, _error, arg) => [
        { type: "MaintenanceFarmlands", id: String(arg.farmland_id) },
      ],
    }),

    getMaintenanceFarmlandUnderReviewDetails: builder.query<
      GetMaintenanceFarmlandUnderReviewDetailsResponse,
      GetMaintenanceFarmlandUnderReviewDetailsPayload
    >({
      query: (body) => {
        let cleanFarmlandId: number | string = body.farmland_id;
        if (
          typeof cleanFarmlandId === "string" &&
          (cleanFarmlandId.toUpperCase().startsWith("FL") || isNaN(Number(cleanFarmlandId)))
        ) {
          const digits = cleanFarmlandId.replace(/\D/g, "");
          cleanFarmlandId = digits ? Number(digits) : cleanFarmlandId;
        } else if (typeof cleanFarmlandId !== "number") {
          const num = Number(cleanFarmlandId);
          if (!isNaN(num)) cleanFarmlandId = num;
        }

        // The item must belong to this farmland; the default is used only when none is passed
        const passedItemId = Number(body.service_request_item_id);
        const cleanServiceRequestItemId =
          Number.isFinite(passedItemId) && passedItemId > 0
            ? passedItemId
            : DEFAULT_UNDER_REVIEW_SERVICE_REQUEST_ITEM_ID;

        // Request body matches the Swagger contract: farmland_id + service_request_item_id only
        const requestBody = {
          farmland_id: cleanFarmlandId,
          service_request_item_id: cleanServiceRequestItemId,
        };

        return {
          url: "/serviceRequests/getMaintenanceFarmlandUnderReviewDetails",
          method: "POST",
          body: requestBody,
        };
      },
      transformResponse: (response: GetMaintenanceFarmlandUnderReviewDetailsResponse) => {
        if (response && response.success === false) {
          console.warn(
            "getMaintenanceFarmlandUnderReviewDetails API response message:",
            response.message
          );
        }
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        console.warn(
          "getMaintenanceFarmlandUnderReviewDetails API response status:",
          response?.status,
          "data" in response ? response.data : undefined
        );
        return response;
      },
      providesTags: (_result, _error, arg) => [
        {
          type: "MaintenanceFarmlands",
          id: `review-${arg.farmland_id}-${arg.service_request_item_id ?? "default"}`,
        },
      ],
    }),

    getFieldOfficerByFarmlandId: builder.query<
      GetFieldOfficerByFarmlandIdResponse,
      GetFieldOfficerByFarmlandIdPayload
    >({
      query: (body) => ({
        url: "/serviceRequests/getFieldOfficerByFarmlandId",
        method: "POST",
        body: {
          farmland_id:
            typeof body.farmland_id === "number"
              ? body.farmland_id
              : Number(body.farmland_id) || body.farmland_id,
        },
      }),
      transformErrorResponse: (response: FetchBaseQueryError) => {
        console.warn(
          "getFieldOfficerByFarmlandId API response status:",
          response?.status,
          "data" in response ? response.data : undefined
        );
        return response;
      },
      providesTags: (_result, _error, arg) => [
        { type: "MaintenanceFarmlands", id: `officer-${arg.farmland_id}` },
      ],
    }),

    assignFieldOfficer: builder.mutation<
      AssignFieldOfficerResponse,
      AssignFieldOfficerPayload
    >({
      query: (body) => ({
        url: "/serviceRequests/assignFieldOfficer",
        method: "POST",
        body: {
          service_request_id:
            typeof body.service_request_id === "number"
              ? body.service_request_id
              : Number(body.service_request_id) || body.service_request_id,
          field_officer_id:
            typeof body.field_officer_id === "number"
              ? body.field_officer_id
              : Number(body.field_officer_id) || body.field_officer_id,
          remarks: body.remarks || "Assigned for soil sampling and field verification",
        },
      }),
      transformErrorResponse: (response: FetchBaseQueryError) => {
        console.warn(
          "assignFieldOfficer API response status:",
          response?.status,
          "data" in response ? response.data : undefined
        );
        return response;
      },
      invalidatesTags: invalidateOnSuccess,
    }),

    updateBorewellEstimation: builder.mutation<
      MaintenanceActionApiResponse,
      UpdateBorewellEstimationPayload
    >({
      query: (body) => ({
        url: "/serviceRequests/updateBorewellEstimation",
        method: "POST",
        body,
      }),
      invalidatesTags: invalidateOnSuccess,
    }),

    updateFencingEstimation: builder.mutation<
      MaintenanceActionApiResponse,
      UpdateFencingEstimationPayload
    >({
      query: (body) => ({
        url: "/serviceRequests/updateFencingEstimation",
        method: "POST",
        body,
      }),
      invalidatesTags: invalidateOnSuccess,
    }),

    updateFarmhouseEstimation: builder.mutation<
      MaintenanceActionApiResponse,
      UpdateFarmhouseEstimationPayload
    >({
      query: (body) => ({
        url: "/serviceRequests/updateFarmhouseEstimation",
        method: "POST",
        body,
      }),
      invalidatesTags: invalidateOnSuccess,
    }),

    updateOrganicFarmingEstimation: builder.mutation<
      MaintenanceActionApiResponse,
      UpdateOrganicFarmingEstimationPayload
    >({
      query: (body) => ({
        url: "/serviceRequests/updateOrganicFarmingEstimation",
        method: "POST",
        body,
      }),
      invalidatesTags: invalidateOnSuccess,
    }),

    updateMaintenanceApproval: builder.mutation<
      MaintenanceActionApiResponse,
      UpdateMaintenanceApprovalPayload
    >({
      query: (body) => ({
        url: "/serviceRequests/updateMaintenanceApproval",
        method: "POST",
        body,
      }),
      // No cache invalidation here: the approval flow updates its own UI and refreshes the
      // Service Requests list once after both approval calls succeed.
    }),

    updateServiceRequestItemStatus: builder.mutation<
      MaintenanceActionApiResponse,
      UpdateServiceRequestItemStatusPayload
    >({
      query: (body) => ({
        url: "/serviceRequests/updateServiceRequestItemStatus",
        method: "POST",
        body,
      }),
      // See updateMaintenanceApproval: the caller refreshes the list once after approval
    }),

    // Moves the whole service request (farmland) to a new request status
    updateServiceRequestStatus: builder.mutation<
      MaintenanceActionApiResponse,
      UpdateServiceRequestStatusPayload
    >({
      query: (body) => ({
        url: "/serviceRequests/updateServiceRequestStatus",
        method: "POST",
        body: {
          service_request_id: Number(body.service_request_id) || body.service_request_id,
          request_status_id: body.request_status_id,
          ...(body.remarks ? { remarks: body.remarks } : {}),
        },
      }),
      // Only the Service Requests list needs fresh data (the caller leaves the details page)
      invalidatesTags: (result, error) =>
        error || result?.success === false ? [] : ["ServiceRequests"],
    }),

    // Moves one customer-approved service item (with its estimation) into a work order
    moveToWorkOrder: builder.mutation<MaintenanceActionApiResponse, MoveToWorkOrderPayload>({
      query: (body) => ({
        url: "/serviceRequests/moveToWorkOrder",
        method: "POST",
        body: {
          service_request_item_id: (Array.isArray(body.service_request_item_id)
            ? body.service_request_item_id
            : [body.service_request_item_id]
          )
            .map(Number)
            .filter((itemId) => Number.isFinite(itemId) && itemId > 0),
          service_request_id: Number(body.service_request_id) || body.service_request_id,
          remarks: body.remarks || "Moved to work order",
        },
      }),
      transformErrorResponse: (response: FetchBaseQueryError) => {
        console.warn(
          "moveToWorkOrder API response status:",
          response?.status,
          "data" in response ? response.data : undefined
        );
        return response;
      },
      // The caller may move several items; it leaves the page once all calls succeed
      invalidatesTags: (result, error) =>
        error || result?.success === false ? [] : ["ServiceRequests", "MaintenanceFarmlands"],
    }),

    // Work order farmlands (Work Orders list); all field officers unless one is given
    getWorkOrderFarmlands: builder.query<MaintenanceActionApiResponse, GetWorkOrderFarmlandsPayload | void>({
      query: (arg) => {
        const body = (arg || {}) as GetWorkOrderFarmlandsPayload;
        return {
          url: "/serviceRequests/getWorkOrderFarmlands",
          method: "POST",
          body: {
            ...(body.field_officer_id !== undefined && body.field_officer_id !== ""
              ? { field_officer_id: Number(body.field_officer_id) || body.field_officer_id }
              : {}),
            offset: typeof body.offset === "number" ? body.offset : 0,
          },
        };
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        console.warn(
          "getWorkOrderFarmlands API response status:",
          response?.status,
          "data" in response ? response.data : undefined
        );
        return response;
      },
      // Refreshed when a service is moved to work order
      providesTags: ["ServiceRequests", "MaintenanceFarmlands"],
    }),

    // Stages (phases) of one work order (Work Order details)
    getWorkOrderStages: builder.query<MaintenanceActionApiResponse, GetWorkOrderStagesPayload>({
      query: (body) => ({
        url: "/serviceRequests/getWorkOrderStages",
        method: "POST",
        body: {
          work_order_id: Number(body.work_order_id) || body.work_order_id,
          ...(body.stage_id !== undefined && body.stage_id !== ""
            ? { stage_id: Number(body.stage_id) || body.stage_id }
            : {}),
        },
      }),
      transformErrorResponse: (response: FetchBaseQueryError) => {
        console.warn(
          "getWorkOrderStages API response status:",
          response?.status,
          "data" in response ? response.data : undefined
        );
        return response;
      },
      providesTags: (_result, _error, arg) => [
        { type: "MaintenanceFarmlands", id: `work-order-stages-${arg.work_order_id}` },
      ],
    }),
  }),
});

export const {
  useGetMaintenanceMasterDataQuery,
  useLazyGetMaintenanceMasterDataQuery,
  useGetAllMaintenanceFarmlandsQuery,
  useLazyGetAllMaintenanceFarmlandsQuery,
  useGetFarmlandByIdQuery,
  useLazyGetFarmlandByIdQuery,
  useGetMaintenanceFarmlandUnderReviewDetailsQuery,
  useLazyGetMaintenanceFarmlandUnderReviewDetailsQuery,
  useGetFieldOfficerByFarmlandIdQuery,
  useLazyGetFieldOfficerByFarmlandIdQuery,
  useAssignFieldOfficerMutation,
  useUpdateBorewellEstimationMutation,
  useUpdateFencingEstimationMutation,
  useUpdateFarmhouseEstimationMutation,
  useUpdateOrganicFarmingEstimationMutation,
  useUpdateMaintenanceApprovalMutation,
  useUpdateServiceRequestItemStatusMutation,
  useUpdateServiceRequestStatusMutation,
  useMoveToWorkOrderMutation,
  useGetWorkOrderFarmlandsQuery,
  useLazyGetWorkOrderFarmlandsQuery,
  useGetWorkOrderStagesQuery,
  useGetServiceStagesByServiceIdQuery,
} = maintenanceService;
