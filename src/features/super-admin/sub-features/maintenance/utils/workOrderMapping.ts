import type {
  WorkOrderPipelineItem,
  WorkOrderServiceRef,
} from "../types/maintenance.types";
import {
  mapApiFarmlandToServiceRequest,
  type MaintenanceFarmlandItem,
  type MaintenanceMasterData,
} from "../api/maintenanceServiceRequestApi";
import { formatLocation } from "@/features/super-admin/utils/locationUtils";

// Backend service_id → service name (1 Farmhouse, 2 Fencing, 3 Borewell, 4 Organic)
const SERVICE_NAME_BY_ID: Record<number, string> = {
  1: "Farmhouse Construction",
  2: "Fencing",
  3: "Borewell",
  4: "Organic Farming",
  5: "Solar Setup",
  6: "Land Demarcation",
};

const CATEGORY_BY_ICON: Record<string, WorkOrderPipelineItem["category"]> = {
  borewell: "BOREWELL",
  fencing: "FENCING",
  farmhouse: "FARMHOUSE",
  organic: "ORGANIC",
};

export const toPositiveNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : undefined;
};

const toText = (value: unknown): string =>
  typeof value === "string" || typeof value === "number" ? String(value).trim() : "";

// Rows of a list response: { data: [] }, { data: { rows | farmlands | workOrders | stages } }
export const getResponseList = (response: any, ...keys: string[]): any[] => {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    for (const key of [...keys, "rows", "data", "list", "items"]) {
      if (Array.isArray(data[key])) return data[key];
    }
  }
  return [];
};

// Farmland record inside a getFarmlandById response ({ data }, { data: { farmland } } or an array)
export const getFarmlandRecord = (response: any): MaintenanceFarmlandItem | undefined => {
  const data = response?.data ?? response;
  const detail = data && !Array.isArray(data) ? data.farmland || data.data || data : data;
  const record = Array.isArray(detail) ? detail[0] : detail;
  if (!record || typeof record !== "object") return undefined;
  // { data: { farmland, work_orders, ... } }: keep the farmland's sibling lists (e.g. its work
  // orders) on the record; the farmland's own fields win
  if (data && !Array.isArray(data) && record !== data && (data.farmland || data.data) === detail) {
    return { ...data, ...record };
  }
  return record;
};

// Keys that hold a work order id (work_order_id, workOrderId, farmland_work_order_id, ...)
const WORK_ORDER_ID_KEY = /work_?order_?id$/i;
const hasWorkOrderIdKey = (value: any): boolean =>
  !!value && typeof value === "object" && Object.keys(value).some((key) => WORK_ORDER_ID_KEY.test(key));

const getServiceItems = (raw: any): any[] => {
  const known =
    (Array.isArray(raw?.service_request_item) && raw.service_request_item) ||
    (Array.isArray(raw?.service_request_items) && raw.service_request_items) ||
    (Array.isArray(raw?.work_orders) && raw.work_orders) ||
    (Array.isArray(raw?.workOrders) && raw.workOrders) ||
    (Array.isArray(raw?.work_order) && raw.work_order) ||
    (Array.isArray(raw?.work_order_details) && raw.work_order_details) ||
    (Array.isArray(raw?.workOrderDetails) && raw.workOrderDetails) ||
    (Array.isArray(raw?.farmland_work_orders) && raw.farmland_work_orders);
  if (known) return known;
  // Any other list of the row whose entries carry a work order id
  if (!raw || typeof raw !== "object") return [];
  const other = Object.values(raw).find(
    (value): value is any[] => Array.isArray(value) && value.some(hasWorkOrderIdKey)
  );
  return other || [];
};

// ─── Master data status lookup ────────────────────────────────────────────────

// Description of a status id from a master-data list whose key matches `keyPattern`
// (e.g. farmlandWorkOrderStatusResult, farmlandServiceStageStatusResult)
export const getMasterStatusText = (
  masterData: MaintenanceMasterData | undefined,
  keyPattern: RegExp,
  statusId: unknown
): string => {
  const id = toPositiveNumber(statusId);
  if (!masterData || id === undefined) return "";
  for (const key of Object.keys(masterData)) {
    if (!keyPattern.test(key) || !Array.isArray(masterData[key])) continue;
    const match = (masterData[key] as any[]).find((s) => Number(s?.id) === id);
    if (match) return toText(match.description) || toText(match.code);
  }
  return "";
};

// Work order stage status (stage_status_id) from master data: a service / work order stage status
// list first (e.g. farmlandServiceStageStatusResult); milestoneStageStatusResult (farmland
// verification milestones) only when no such list exists
const getStageStatusText = (masterData: MaintenanceMasterData | undefined, statusId: unknown): string =>
  getMasterStatusText(masterData, /(service|workorder|work_order).*stage_?status/i, statusId) ||
  getMasterStatusText(masterData, /^(?!milestone).*stage_?status/i, statusId) ||
  getMasterStatusText(masterData, /stage_?status/i, statusId);

const isCompletedText = (text: string) => /complet|done|finish|closed|handover/i.test(text);
const isInProgressText = (text: string) => /progress|start|ongoing|active|running/i.test(text);

// ─── Officer ids of moved farmlands ───────────────────────────────────────────

// Field officer ids assigned to a farmland row (row level or on its service items)
export const getFieldOfficerIds = (raw: any): number[] => {
  const ids = new Set<number>();
  const add = (value: unknown) => {
    const id = toPositiveNumber(value);
    if (id !== undefined) ids.add(id);
  };
  const addFrom = (source: any) => {
    if (!source || typeof source !== "object") return;
    // Any *officer id key: field_officer_id, assigned_officer_id, assigned_field_officer_id, fo_id …
    Object.keys(source)
      .filter((key) => /(officer|^fo)_?(user_)?id$/i.test(key))
      .forEach((key) => add(source[key]));
    const officer =
      source.field_officer_details || source.field_officer || source.assigned_officer_details ||
      source.officer_details || source.fo_details;
    if (officer && typeof officer === "object") {
      add(officer.field_officer_id ?? officer.user_id ?? officer.id);
    }
  };
  addFrom(raw);
  getServiceItems(raw).forEach(addFrom);
  return [...ids];
};

// ─── Work order list rows ─────────────────────────────────────────────────────

const getServiceName = (source: any): string =>
  toText(source?.service_name) ||
  toText(source?.service?.name) ||
  SERVICE_NAME_BY_ID[Number(source?.service_id)] ||
  "";

// Work order code (e.g. "WO26100009"): the backend sends it as `work_order_id`
const getWorkOrderCode = (source: any): string | undefined => {
  const code = [source?.work_order_code, source?.work_order_no, source?.work_order_id, source?.work_order?.work_order_id]
    .map(toText)
    .find((value) => value && toPositiveNumber(value) === undefined);
  return code || undefined;
};

// Numeric work order id (sent to getWorkOrderStages). A work order record carries it as `id` next
// to its code (getWorkOrderFarmlands work_orders: { id: 11, work_order_id: "WO26100009" })
const getWorkOrderId = (source: any): number | undefined => {
  const nested =
    source?.work_order && !Array.isArray(source.work_order) ? source.work_order : source?.work_order_details;
  const known = toPositiveNumber(
    source?.work_order_id ??
      source?.workOrderId ??
      source?.farmland_work_order_id ??
      (nested && !Array.isArray(nested) ? nested.work_order_id ?? nested.id : undefined)
  );
  if (known || !source || typeof source !== "object") return known;
  const recordId = toPositiveNumber(source.id);
  if (recordId && toText(source.work_order_id) && !source.service_request_item_id) return recordId;
  // Any other *work_order_id key of the record
  const key = Object.keys(source).find((k) => WORK_ORDER_ID_KEY.test(k));
  return key ? toPositiveNumber(source[key]) : undefined;
};

const getWorkOrderStatusText = (source: any, masterData?: MaintenanceMasterData): string =>
  toText(source?.work_order_status_name) ||
  toText(source?.work_order_status) ||
  toText(source?.work_order?.status_name) ||
  toText(source?.status_name) ||
  getMasterStatusText(masterData, /workorderstatus/i, source?.work_order_status_id ?? source?.work_order?.work_order_status_id);

// Current stage id of a work order (row, service item or nested work order)
const getWorkOrderStageId = (source: any): number | undefined =>
  toPositiveNumber(
    source?.stage_id ??
      source?.current_stage_id ??
      source?.work_order_stage_id ??
      source?.service_stage_id ??
      source?.work_order?.stage_id ??
      source?.work_order?.current_stage_id
  );

// service_status_id set by moveToWorkOrder
const MOVED_TO_WORK_ORDER_SERVICE_STATUS_ID = 4;

// Work orders (one per service) of a farmland row: items / the row carrying a work_order_id, plus
// items moved to work order (service_status_id 4) whose work order id is not returned
export const getRowWorkOrders = (raw: any, masterData?: MaintenanceMasterData): WorkOrderServiceRef[] => {
  const refs: WorkOrderServiceRef[] = [];
  const add = (source: any, requireWorkOrder: boolean) => {
    const workOrderId = getWorkOrderId(source);
    const workOrderCode = getWorkOrderCode(source);
    const serviceRequestItemId = toPositiveNumber(source?.service_request_item_id ?? source?.service_req_item_id);
    const serviceId = toPositiveNumber(source?.service_id ?? raw?.service_id);
    const isMoved = Number(source?.service_status_id) === MOVED_TO_WORK_ORDER_SERVICE_STATUS_ID;
    if (!workOrderId && !workOrderCode && (requireWorkOrder || !isMoved)) return;
    // Keyed by work order code when known, so the list's work order and getFarmlandById's item match
    const key = workOrderCode
      ? `wo-${workOrderCode}`
      : workOrderId
      ? `wo-${workOrderId}`
      : serviceRequestItemId
      ? `item-${serviceRequestItemId}`
      : `service-${serviceId ?? refs.length}`;
    if (
      refs.some(
        (ref) =>
          ref.key === key ||
          (serviceRequestItemId !== undefined && ref.serviceRequestItemId === serviceRequestItemId)
      )
    ) {
      return;
    }
    refs.push({
      key,
      workOrderId,
      workOrderCode,
      serviceId,
      serviceName:
        getServiceName(source) ||
        getServiceName(raw) ||
        workOrderCode ||
        (workOrderId ? `Work Order ${workOrderId}` : "Service"),
      serviceRequestItemId,
      statusText: getWorkOrderStatusText(source, masterData) || getWorkOrderStatusText(raw, masterData),
      stageId: getWorkOrderStageId(source) ?? (source === raw ? undefined : getWorkOrderStageId(raw)),
    });
  };
  getServiceItems(raw).forEach((item) => add(item, false));
  add(raw, true);
  // No work order id at the known places: any nested record of the row carrying one
  if (!refs.some((ref) => ref.workOrderId || ref.workOrderCode)) {
    findNestedWorkOrders(raw).forEach((source) => add(source, true));
  }
  return refs;
};

// Nested objects (up to 4 levels) of a row that carry a work order id
const findNestedWorkOrders = (raw: any): any[] => {
  const found: any[] = [];
  const visit = (value: any, depth: number) => {
    if (!value || typeof value !== "object" || depth > 4) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => visit(entry, depth + 1));
      return;
    }
    if (depth > 0 && (getWorkOrderId(value) || getWorkOrderCode(value))) found.push(value);
    Object.values(value).forEach((child) => visit(child, depth + 1));
  };
  visit(raw, 0);
  return found;
};

// Stage definitions of a service from master data (farmlandServiceStagesResult: { id, service_id,
// code, description, sort_order / stage_sequence }), in order
export const getMasterServiceStages = (
  masterData: MaintenanceMasterData | undefined,
  serviceId: number | undefined
): { id: number; name: string }[] => {
  if (!masterData || !serviceId) return [];
  const isStageList = (k: string) => !/status/i.test(k) && Array.isArray(masterData[k]);
  const key =
    Object.keys(masterData).find((k) => /servicestages?result$/i.test(k) && isStageList(k)) ||
    Object.keys(masterData).find((k) => /(service|workorder|work_order).*stages?(result)?$/i.test(k) && isStageList(k));
  if (!key) return [];
  const list = masterData[key] as any[];
  // Lists without a service_id per stage apply to every service
  const hasServiceIds = list.some((stage) => stage?.service_id !== undefined && stage?.service_id !== null);
  return toOrderedStages(list.filter((stage) => !hasServiceIds || Number(stage?.service_id) === serviceId));
};

// Stage records → { id, name } in stage order
const toOrderedStages = (list: any[]): { id: number; name: string }[] =>
  [...list]
    .sort(
      (a, b) =>
        (Number(a?.sort_order ?? a?.stage_sequence ?? a?.sequence ?? a?.stage_order ?? a?.id) || 0) -
        (Number(b?.sort_order ?? b?.stage_sequence ?? b?.sequence ?? b?.stage_order ?? b?.id) || 0)
    )
    .map((stage) => ({
      id: Number(stage?.id ?? stage?.stage_id ?? stage?.service_stage_id),
      name:
        toText(stage?.description) ||
        toText(stage?.name) ||
        toText(stage?.stage_name) ||
        toText(stage?.stage_description) ||
        toText(stage?.code),
    }))
    .filter((stage) => stage.id > 0);

// getServiceStagesByServiceId response → the service's stages in order
export const mapServiceStages = (response: any): { id: number; name: string }[] =>
  response?.success === false
    ? []
    : toOrderedStages(getResponseList(response, "stages", "serviceStages", "service_stages"));

// Work order list row from a backend farmland (getWorkOrderFarmlands or getAllMaintenanceFarmlands)
export const mapFarmlandToWorkOrder = (
  raw: MaintenanceFarmlandItem,
  index: number,
  masterData?: MaintenanceMasterData,
  geoData?: any
): WorkOrderPipelineItem => {
  const mapped = mapApiFarmlandToServiceRequest(raw, index, undefined, undefined, geoData);
  const workOrderServices = getRowWorkOrders(raw, masterData);
  // Only work orders whose service is known name the services (the list's work orders carry
  // just { id, code })
  const namedWorkOrders = workOrderServices.filter((ref) => ref.serviceId || !ref.workOrderCode);
  const serviceNames =
    namedWorkOrders.length > 0
      ? namedWorkOrders.map((ref) => ref.serviceName)
      : (mapped.servicesList || []).map((svc: any) => svc.name).filter(Boolean);
  const primaryIcon = (() => {
    const lower = String(serviceNames[0] || "").toLowerCase();
    if (lower.includes("fenc")) return "fencing";
    if (lower.includes("farmhouse") || lower.includes("house")) return "farmhouse";
    if (lower.includes("organic")) return "organic";
    if (lower.includes("bore")) return "borewell";
    return mapped.iconType;
  })() as WorkOrderPipelineItem["iconType"];
  const backendFarmlandId = toPositiveNumber(raw.farmland_id) ?? toPositiveNumber(mapped.farmlandId);
  const farmlandCode = toText(raw.farmland_code) || mapped.landId || mapped.code;
  // Completed only when every work order of the farmland reports a completed status
  const isCompleted =
    workOrderServices.length > 0 &&
    workOrderServices.every((ref) => isCompletedText(ref.statusText || ""));

  const location =
    mapped.location && mapped.location !== "—" ? mapped.location : formatLocation(raw, geoData);

  return {
    id: `wo-${backendFarmlandId ?? farmlandCode ?? index}`,
    code: farmlandCode || "—",
    farmlandId: farmlandCode,
    customerName: mapped.customerName || "—",
    category: CATEGORY_BY_ICON[primaryIcon] || serviceNames[0] || "—",
    servicesExtraCount: serviceNames.length > 1 ? serviceNames.length - 1 : undefined,
    location,
    surveyNumber: mapped.surveyNumber,
    assignedFO: mapped.assignedOfficer || "Not assigned",
    status: isCompleted ? "Completed" : "In Progress",
    uploadTag: null,
    iconType: primaryIcon || "borewell",
    backendFarmlandId,
    workOrderServices,
  };
};

// Union of two service lists. The same work order (key / work order code / service request item)
// is combined: e.g. the list's { id, code } with getFarmlandById's { code, service_id, item id }
export const mergeWorkOrderServices = (
  base: WorkOrderServiceRef[] = [],
  extra: WorkOrderServiceRef[] = []
): WorkOrderServiceRef[] => {
  const merged = [...base];
  extra.forEach((ref) => {
    const sameIdx = merged.findIndex(
      (own) =>
        own.key === ref.key ||
        (!!ref.workOrderCode && own.workOrderCode === ref.workOrderCode) ||
        (ref.serviceRequestItemId !== undefined && own.serviceRequestItemId === ref.serviceRequestItemId)
    );
    if (sameIdx === -1) {
      merged.push(ref);
      return;
    }
    const own = merged[sameIdx];
    merged[sameIdx] = {
      ...own,
      workOrderId: own.workOrderId ?? ref.workOrderId,
      workOrderCode: own.workOrderCode ?? ref.workOrderCode,
      serviceId: own.serviceId ?? ref.serviceId,
      // The ref that knows the service names it (the list's work orders carry no service)
      serviceName: !own.serviceId && ref.serviceId ? ref.serviceName : own.serviceName,
      serviceRequestItemId: own.serviceRequestItemId ?? ref.serviceRequestItemId,
      statusText: own.statusText || ref.statusText,
      stageId: own.stageId ?? ref.stageId,
    };
  });
  return merged;
};

// Merge rows of the same farmland (e.g. returned for several officers) into one, keeping
// every work order
export const mergeWorkOrderRows = (rows: WorkOrderPipelineItem[]): WorkOrderPipelineItem[] => {
  const byId = new Map<string, WorkOrderPipelineItem>();
  rows.forEach((row) => {
    const existing = byId.get(row.id);
    if (!existing) {
      byId.set(row.id, row);
      return;
    }
    const services = mergeWorkOrderServices(existing.workOrderServices, row.workOrderServices);
    byId.set(row.id, {
      ...existing,
      workOrderServices: services,
      servicesExtraCount: services.length > 1 ? services.length - 1 : existing.servicesExtraCount,
      status:
        services.length > 0 && services.every((svc) => isCompletedText(svc.statusText || ""))
          ? "Completed"
          : "In Progress",
    });
  });
  return [...byId.values()];
};

// ─── Work order stages (details) ──────────────────────────────────────────────

export type WorkOrderStageStatus = "DONE" | "IN PROGRESS" | "PENDING";

export interface WorkOrderStageView {
  id: string;
  name: string;
  status: WorkOrderStageStatus;
  remarks: string;
  updatedOn?: string;
  photos: { url: string; tag: string; date?: string }[];
}

export interface WorkOrderStagesView {
  stages: WorkOrderStageView[];
  progress: number;
  latestNote: string;
  latestUpdate?: string;
  photos: { url: string; tag: string; date?: string }[];
}

const getStageStatus = (stage: any, masterData?: MaintenanceMasterData): WorkOrderStageStatus => {
  if (Number(stage?.is_completed) === 1 || stage?.is_completed === true) return "DONE";
  const text =
    toText(stage?.stage_status_name) ||
    toText(stage?.status_name) ||
    toText(stage?.stage_status) ||
    (typeof stage?.status === "string" ? stage.status : "") ||
    getStageStatusText(masterData, stage?.stage_status_id ?? stage?.status_id);
  // An approved stage is finished
  if (isCompletedText(text) || (/approv/i.test(text) && !/(not|un|dis)\s*approv/i.test(text))) return "DONE";
  if (isInProgressText(text)) return "IN PROGRESS";
  return "PENDING";
};

const PHOTO_URL_KEYS = ["url", "file_url", "image_url", "photo_url", "path", "file_path", "location", "s3_url"];

const getStagePhotos = (stage: any): WorkOrderStageView["photos"] => {
  const lists = [stage?.images, stage?.photos, stage?.uploads, stage?.files, stage?.documents, stage?.attachments]
    .filter(Array.isArray)
    .flat();
  return lists
    .map((photo: any) => {
      if (typeof photo === "string") return { url: photo, tag: "" };
      const url = PHOTO_URL_KEYS.map((key) => toText(photo?.[key])).find((value) => /^https?:\/\//i.test(value));
      if (!url) return undefined;
      const lat = toText(photo?.latitude ?? photo?.lat);
      const lng = toText(photo?.longitude ?? photo?.lng ?? photo?.long);
      return {
        url,
        tag: lat && lng ? `${lat} N, ${lng} E` : "",
        date: toText(photo?.created_on ?? photo?.created_at ?? photo?.uploaded_on),
      };
    })
    .filter((photo): photo is { url: string; tag: string; date: string } => !!photo);
};

// FO updates of a stage (getWorkOrderStages `updates`), latest first
const getStageUpdates = (stage: any): any[] => {
  const updates = [stage?.updates, stage?.stage_updates, stage?.fo_updates].find(Array.isArray) || [];
  const time = (update: any) =>
    new Date(update?.created_on ?? update?.updated_on ?? update?.created_at ?? 0).getTime() || 0;
  return [...updates].sort((a, b) => time(b) - time(a));
};

// Photos of one FO update: image_urls are S3 keys (e.g. "work-orders/12/stages/1/…") or URLs
const getUpdatePhotos = (update: any): WorkOrderStageView["photos"] => {
  const date = toText(update?.created_on ?? update?.updated_on ?? update?.created_at) || undefined;
  return [update?.image_urls, update?.images, update?.photos]
    .filter(Array.isArray)
    .flat()
    .map((image: any) => {
      const url = typeof image === "string" ? image.trim() : PHOTO_URL_KEYS.map((key) => toText(image?.[key])).find(Boolean);
      return url ? { url, tag: "", date } : undefined;
    })
    .filter((photo): photo is { url: string; tag: string; date: string | undefined } => !!photo);
};

// Whether the backend names the stage's status (otherwise it is only inferred)
const hasStageStatusText = (stage: any, masterData?: MaintenanceMasterData): boolean =>
  Number(stage?.is_completed) === 1 ||
  stage?.is_completed === true ||
  !!(
    toText(stage?.stage_status_name) ||
    toText(stage?.status_name) ||
    toText(stage?.stage_status) ||
    (typeof stage?.status === "string" ? stage.status : "") ||
    getStageStatusText(masterData, stage?.stage_status_id ?? stage?.status_id)
  );

// getWorkOrderStages response → stages, progress, latest note / update date and photos
// Stages come from getWorkOrderStages; without them (no work order id / no stages yet) the
// service's stage list from master data is shown, all pending
export const mapWorkOrderStages = (
  response: any,
  masterData?: MaintenanceMasterData,
  serviceId?: number,
  // The service's stages from getServiceStagesByServiceId; master data when absent / empty
  serviceStages?: { id: number; name: string }[]
): WorkOrderStagesView => {
  const masterStages =
    serviceStages && serviceStages.length > 0 ? serviceStages : getMasterServiceStages(masterData, serviceId);
  const masterStageName = (stage: any): string => {
    const stageId = toPositiveNumber(stage?.service_stage_id ?? stage?.stage_id ?? stage?.farmland_service_stage_id);
    return (stageId && masterStages.find((s) => s.id === stageId)?.name) || "";
  };
  const data = response?.data && !Array.isArray(response.data) ? response.data : undefined;
  let rawStages = getResponseList(response, "stages", "workOrderStages", "work_order_stages");
  // getWorkOrderStages for one stage_id: data is that stage ({ stage_id, stage_status_id, updates })
  const isSingleStage =
    rawStages.length === 0 && !!data && (data.stage_id !== undefined || Array.isArray(data.updates));
  if (isSingleStage) rawStages = [data];

  const apiStages: WorkOrderStageView[] = rawStages.map((stage: any, idx: number) => {
    const updates = getStageUpdates(stage);
    const latestUpdate = updates[0];
    const status = getStageStatus(stage, masterData);
    return {
      id: String(stage?.work_order_stage_id ?? stage?.stage_id ?? stage?.id ?? idx),
      name:
        toText(stage?.stage_name) ||
        toText(stage?.name) ||
        toText(stage?.stage?.name) ||
        toText(stage?.stage_description) ||
        masterStageName(stage) ||
        toText(stage?.description) ||
        `Stage ${idx + 1}`,
      // A stage with FO updates but no known status is under way
      status: status === "PENDING" && updates.length > 0 && !hasStageStatusText(stage, masterData) ? "IN PROGRESS" : status,
      remarks:
        toText(stage?.fo_remarks) ||
        toText(stage?.remarks) ||
        toText(stage?.notes) ||
        updates.map((update) => toText(update?.remarks)).find(Boolean) ||
        "",
      updatedOn:
        toText(stage?.updated_on ?? stage?.updated_at ?? stage?.created_on ?? stage?.created_at) ||
        toText(latestUpdate?.created_on ?? latestUpdate?.updated_on ?? latestUpdate?.created_at) ||
        undefined,
      photos: [...getStagePhotos(stage), ...updates.flatMap(getUpdatePhotos)],
    };
  });

  const masterStageViews: WorkOrderStageView[] = masterStages.map((stage) => ({
    id: `master-${stage.id}`,
    name: stage.name,
    status: "PENDING" as const,
    remarks: "",
    photos: [],
  }));
  // One fetched stage is shown in its place among the service's master stages
  const singleStageId = isSingleStage ? toPositiveNumber(data?.stage_id) : undefined;
  const singleStageIdx =
    singleStageId !== undefined ? masterStages.findIndex((stage) => stage.id === singleStageId) : -1;
  const stages: WorkOrderStageView[] =
    singleStageIdx !== -1
      ? masterStageViews.map((stage, idx) => (idx === singleStageIdx ? apiStages[0] : stage))
      : apiStages.length > 0
      ? apiStages
      : masterStageViews;

  const backendProgress = toPositiveNumber(data?.progress ?? data?.overall_progress ?? data?.progress_percentage);
  const doneCount = stages.filter((stage) => stage.status === "DONE").length;
  const progress =
    backendProgress !== undefined
      ? Math.min(100, Math.round(backendProgress))
      : stages.length > 0
      ? Math.round((doneCount / stages.length) * 100)
      : 0;

  // Latest update = the most recently updated stage
  const byLatest = [...stages]
    .filter((stage) => stage.updatedOn && !isNaN(new Date(stage.updatedOn).getTime()))
    .sort((a, b) => new Date(b.updatedOn!).getTime() - new Date(a.updatedOn!).getTime());
  const latestNote =
    byLatest.find((stage) => stage.remarks)?.remarks ||
    [...stages].reverse().find((stage) => stage.remarks)?.remarks ||
    toText(data?.remarks) ||
    "";

  return {
    stages,
    progress,
    latestNote,
    latestUpdate: byLatest[0]?.updatedOn,
    photos: stages.flatMap((stage) => stage.photos),
  };
};
