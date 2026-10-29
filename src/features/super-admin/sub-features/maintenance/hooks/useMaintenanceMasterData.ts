import {
  useGetMaintenanceMasterDataQuery,
  type MaintenanceMasterData,
} from "../api/maintenanceServiceRequestApi";

// request_status_id of the Quotations tab: 3 = "Quotation Given"
export const QUOTATION_GIVEN_STATUS_ID = 3;
// request_status_id set by the final Confirm once every service is approved: 4 = "Maintenance Approved"
export const MAINTENANCE_APPROVED_REQUEST_STATUS_ID = 4;
// request_status_id of the user's response to the quotation: 5 = approved, 9 = rejected
export const USER_APPROVED_REQUEST_STATUS_ID = 5;
export const USER_REJECTED_REQUEST_STATUS_ID = 9;
// The Customer Response tab lists only requests the user has approved or rejected
export const CUSTOMER_RESPONSE_TAB_REQUEST_STATUS_IDS = [
  USER_APPROVED_REQUEST_STATUS_ID,
  USER_REJECTED_REQUEST_STATUS_ID,
];
// service_status_id of a service item the user approved (5) / rejected (8)
export const USER_APPROVED_SERVICE_STATUS_ID = 5;
export const USER_REJECTED_SERVICE_STATUS_ID = 8;
// service_status_id set by moveToWorkOrder (work_order_status_id 1 = new work order); the Work
// Orders In-Progress list filters by it
export const MOVED_TO_WORK_ORDER_SERVICE_STATUS_ID = 4;
export const NEW_WORK_ORDER_STATUS_ID = 1;
// The Customer Response tab filters only by service item status (request_status_id is sent empty)
export const CUSTOMER_RESPONSE_TAB_SERVICE_STATUS_IDS = [
  USER_APPROVED_SERVICE_STATUS_ID,
  USER_REJECTED_SERVICE_STATUS_ID,
];
export const CUSTOMER_RESPONSE_TAB_QUERY_REQUEST_STATUS_IDS: number[] = [];
// The Quotations tab lists quotations still in review and those already maintenance approved
export const QUOTATIONS_TAB_REQUEST_STATUS_IDS = [
  QUOTATION_GIVEN_STATUS_ID,
  MAINTENANCE_APPROVED_REQUEST_STATUS_ID,
];

export interface MasterStatusEntry {
  id: number;
  code?: string;
  description?: string;
  sort_order?: number | null;
  [key: string]: any;
}

const statusText = (s: MasterStatusEntry) => `${s.code ?? ""} ${s.description ?? ""}`.toLowerCase();

/**
 * Service request item statuses (service_status_id) from get_all_master_data:
 * farmlandServiceStatusResult, or another "…ServiceStatus…" list when that key is absent.
 */
export const getServiceStatusList = (
  masterData: MaintenanceMasterData | undefined
): MasterStatusEntry[] => {
  if (Array.isArray(masterData?.farmlandServiceStatusResult)) {
    return masterData!.farmlandServiceStatusResult as MasterStatusEntry[];
  }
  const fallbackKey = Object.keys(masterData || {}).find(
    (key) => /servicestatus/i.test(key) && !/stage|request/i.test(key) && Array.isArray(masterData![key])
  );
  return fallbackKey ? (masterData![fallbackKey] as MasterStatusEntry[]) : [];
};

/** The "Maintenance Approved" service status (sent by the Approve action). */
export const findMaintenanceApprovedStatus = (
  masterData: MaintenanceMasterData | undefined
): MasterStatusEntry | undefined => {
  const statuses = getServiceStatusList(masterData);
  return (
    statuses.find((s) => /maint/.test(statusText(s)) && /appr/.test(statusText(s))) ||
    statuses.find((s) => /appr/.test(statusText(s)) && !/(un|dis|not|reject)\s*appr/.test(statusText(s)))
  );
};

const toPositiveId = (value: unknown): number | undefined => {
  const num = Number(value);
  return value !== undefined && value !== null && value !== "" && Number.isFinite(num) && num > 0
    ? num
    : undefined;
};

/**
 * Whether a service request item is approved by maintenance: its estimation is flagged approved,
 * its status is "Maintenance Approved", or its status comes later in the master-data order
 * (e.g. moved to a work order).
 */
export const isServiceItemApproved = (
  s: any,
  approvedStatus: MasterStatusEntry | undefined,
  serviceStatuses: MasterStatusEntry[]
): boolean => {
  // An item without a submitted estimation can never be maintenance approved
  if (s && typeof s === "object" && "estimation" in s && !s.estimation) return false;
  if (Number(s?.estimation?.is_maintenance_approved) === 1 || Number(s?.is_maintenance_approved) === 1) {
    return true;
  }
  const statusId = toPositiveId(s?.service_status_id);
  if (!approvedStatus || statusId === undefined) return false;
  if (statusId === Number(approvedStatus.id)) return true;
  const itemStatus = serviceStatuses.find((st) => Number(st.id) === statusId);
  const itemOrder = toPositiveId(itemStatus?.sort_order);
  const approvedOrder = toPositiveId(approvedStatus.sort_order);
  return itemOrder !== undefined && approvedOrder !== undefined && itemOrder > approvedOrder;
};

export const MAINTENANCE_APPROVED_LABEL = "Maintenance Approved";
export const PARTIALLY_APPROVED_LABEL = "Partially Approved";

/**
 * Quotations-table status of a farmland row from its service_request_item statuses:
 * every item approved → "Maintenance Approved", some → "Partially Approved", none → undefined.
 */
export const getQuotationApprovalStatusText = (
  serviceItems: any[],
  masterData: MaintenanceMasterData | undefined
): string | undefined => {
  if (!Array.isArray(serviceItems) || serviceItems.length === 0) return undefined;
  const approvedStatus = findMaintenanceApprovedStatus(masterData);
  const statuses = getServiceStatusList(masterData);
  const approvedCount = serviceItems.filter((it) => isServiceItemApproved(it, approvedStatus, statuses)).length;
  if (approvedCount === 0) return undefined;
  return approvedCount === serviceItems.length ? MAINTENANCE_APPROVED_LABEL : PARTIALLY_APPROVED_LABEL;
};

/**
 * Master data for the maintenance module, loaded only from the maintenance API
 * (/master/get_all_master_data). Pages keep their default status IDs when a list is missing.
 */
export const useMaintenanceMasterData = (): {
  masterData: MaintenanceMasterData | undefined;
  isLoading: boolean;
} => {
  const { data: masterData, isLoading } = useGetMaintenanceMasterDataQuery();

  return { masterData, isLoading };
};
