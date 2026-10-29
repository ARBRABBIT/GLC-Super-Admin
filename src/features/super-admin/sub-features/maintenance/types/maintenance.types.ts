export interface ProjectTimelineItem {
  id: string;
  code: string;
  title: string;
  category: 'FARMHOUSE' | 'FENCING' | 'BOREWELL' | 'ROAD' | 'SOLAR' | 'OTHER';
  progressPercentage: number;
  status: 'In Progress' | 'Completed' | 'Pending';
  themeColor: 'blue' | 'green' | 'teal' | 'amber';
  images: string[];
}

export interface ProjectDistributionCategory {
  id: string;
  name: string;
  count: number;
  color: string;
}

export interface MonthlyMetricPoint {
  month: string;
  serviceRequests: number;
  workOrders: number;
}

export interface OperationsOverviewData {
  year: number;
  totalServiceRequests: string;
  serviceRequestsTrend: 'up' | 'down';
  serviceRequestsChangePercent: string;
  totalWorkOrders: string;
  workOrdersTrend: 'up' | 'down';
  workOrdersChangePercent: string;
  monthlyTrend: MonthlyMetricPoint[];
}

export interface PipelineStage {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  iconName: 'mail' | 'alert' | 'sync' | 'team' | 'clipboard';
  badgeColor: string;
  iconBgColor: string;
  iconColor: string;
}

export interface MaintenanceOfficerProfile {
  name: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phone?: string;
  role: string;
  email: string;
  avatarUrl: string;
  bannerUrl?: string;
  unreadNotificationsCount: number;
}

export interface ServiceRequestItemDetail {
  name: string;
  icon: 'farmhouse' | 'borewell' | 'organic' | 'fencing';
  subtitle?: string;
}

export interface ServiceRequestPipelineItem {
  id: string;
  code: string; // e.g. "ID-3042"
  farmlandId?: number | string;
  serviceRequestId?: number | string;
  service_request_id?: number | string;
  service_request_item_id?: number | string;
  serviceRequestItemId?: number | string;
  raw?: any;
  underReviewDetails?: any;
  customerName: string; // e.g. "Suresh Reddy"
  serviceCategory: 'Borewell' | 'Fencing' | 'Farmhouse' | 'Organic Management';
  serviceCategoryExtra?: string; // e.g. "+2"
  location: string; // e.g. "Hyderabad"
  location_details?: any;
  locationDetails?: any;
  description: string;
  iconType: 'borewell' | 'fencing' | 'farmhouse' | 'organic';
  stage: 'New Requests' | 'Under Verification' | 'Quotations' | 'Customer Response';
  cardAction?: 'approve' | 'view-details' | 'verify-now';

  // Detailed properties for Verify Now & Estimation screens
  landId: string; // e.g. "GLCSOS001"
  landSize: string; // e.g. "5.0 Acres"
  address: string; // e.g. "Plot 42, Green Valley, Shamshabad Mandal, Hyderabad."
  preferredVisitDate: string; // e.g. "Oct 24, 2026"
  servicesList: ServiceRequestItemDetail[];
  requirementsText: string;
  assignedOfficer?: string;
  phone?: string;
  surveyNumber?: string;
  userNotes?: string;
  liveLocationUrl?: string;
  estimatedCost?: string; // e.g. "₹5,12,000" or "₹ 2 Lakhs"
  estimatedDuration?: string; // e.g. "90 Days"
  statusText?: string; // e.g. "Under Verification" | "Quotation Created"
  createdDate?: string; // e.g. "12 May 2025"
  serviceDescription?: string;

  // Customer Response Details matching Figma
  customerResponseStatus?: 'Accepted' | 'Rejected' | 'Awaiting' | 'Pending' | 'Pending Review';
  quotationAmount?: string; // e.g. "₹5,12,000" or "₹24,50,000" or "₹4,50,000"
  dateSent?: string; // e.g. "Nov 14, 2026"
  rejectionReason?: string; // e.g. "The estimated cost exceeds my budget."
  rejectionTimestamp?: string; // e.g. "Nov 11, 2026 at 04:32 PM"
  acceptanceDate?: string; // e.g. "Nov 16, 2026"
  assignedOfficerDetails?: {
    name: string;
    phone: string;
    email: string;
    assignedDate: string;
  };
}

export interface FieldOfficerOption {
  id: string;
  name: string;
  role: string;
  location?: string;
  phone: string;
  assignedCount: number;
}

// ─── Work Order Pipeline Types (Figma Match) ──────────────────────────────────
export interface WorkOrderPhaseMilestone {
  id: string;
  name: string;
  status: 'DONE' | 'IN PROGRESS' | 'PENDING';
}

export interface WorkOrderSitePhoto {
  url: string;
  timestamp: string;
  locationGps: string;
}

export interface WorkOrderHandoverDoc {
  name: string;
  size: string;
  type: 'pdf';
}

export interface WorkOrderServiceRef {
  // Unique per service of the farmland (work order id, else service request item / service id)
  key: string;
  // Numeric work order id (getWorkOrderFarmlands work_orders[].id; getWorkOrderStages `work_order_id`).
  // Absent while the backend has not returned a work order for the service yet
  workOrderId?: number;
  // Work order code (e.g. "WO26100009"): `work_order_id` of getWorkOrderFarmlands / getFarmlandById
  workOrderCode?: string;
  serviceId?: number;
  serviceName: string;
  serviceRequestItemId?: number;
  statusText?: string;
  // Current stage of the work order (getWorkOrderStages `stage_id`), when the backend returns it
  stageId?: number;
}

export interface WorkOrderPipelineItem {
  id: string;
  code: string; // e.g. "#ID-4092" or "ID – 4092"
  farmlandId?: string; // e.g. "GLCSOS1", "GLCSOS13"
  customerName: string; // e.g. "K. Raghunath", "Ananya Rao", "Suresh Reddy"
  category: 'BOREWELL' | 'FENCING' | 'FARMHOUSE' | 'ORGANIC' | string;
  serviceCategoryExtra?: string; // e.g. "+2", "+1"
  servicesExtraCount?: number; // e.g. 2, 1
  location: string; // e.g. "Chevella", "Moinabad", "Shankarpally", "Shamshabad Mandal"
  surveyNumber?: string; // e.g. "Survey No. #442, 445"
  assignedFO: string; // e.g. "Rahul Verma", "Priya Das", "Amit Sharma", "Suresh Reddy"
  status: 'In Progress' | 'Completed';
  uploadTag?: 'PENDING UPLOAD' | 'RECENTLY ADDED' | null;
  updatePending?: boolean; // e.g. true for "UPDATE UPLOAD PENDING"
  iconType: 'borewell' | 'fencing' | 'farmhouse' | 'organic';
  // Backend farmland_id of work orders loaded from getAllMaintenanceFarmlands (for getFarmlandById)
  backendFarmlandId?: number;
  // Backend work orders of this farmland, one per service (getWorkOrderFarmlands); the details
  // page loads each one's stages with getWorkOrderStages
  workOrderServices?: WorkOrderServiceRef[];

  // In Progress Detail Properties
  overallProgress?: number; // e.g. 25, 30, 40
  estimatedCompletion?: string; // e.g. "Dec 2026"
  currentPhase?: string; // e.g. "Foundation and framing"
  updateDate?: string; // e.g. "October 24, 2026"
  phases?: WorkOrderPhaseMilestone[];
  sitePhotos?: WorkOrderSitePhoto[];
  foNote?: string;
  siteCode?: string; // e.g. "Site SOS 01"

  // Completed Detail Properties
  timelineJourney?: string; // e.g. "June – Oct 2025"
  finalPayment?: string; // e.g. "₹3,30,000"
  transactionId?: string; // e.g. "GLC-TXN-8829102-S"
  amountBalance?: string; // e.g. "₹0"
  settlementDate?: string; // e.g. "Oct 24, 2023"
  documents?: WorkOrderHandoverDoc[];
}
