// ─── Super Admin Dashboard Types ──────────────────────────────────────────────

export interface VisitorStats {
  nriPercentage: number;
  localPercentage: number;
  vsLastWeekLabel: string;
}

export interface TotalSales {
  amount: number;
  changePercent: number;
  sparklineData: number[];
}

export interface FarmlandStats {
  totalFarmlands: number;
  activePools: number;
}

export interface StatusCardItem {
  label: string;
  value: number;
  type: 'approved' | 'rejected' | 'in-progress';
}

export interface SalesReportDataPoint {
  day: string;
  target: number;
  actual: number;
  escrow: number;
  projected: number;
}

export interface TopPerformer {
  id: string;
  name: string;
  amount: string;
  avatar: string;
  isTopPerformer?: boolean;
  rank?: number;
  farms?: number;
  sales?: string;
  saleReports?: number;
}

export interface MomentumTimelinePoint {
  dayLabel: string;
  visits: number;
  enquiries: number;
  unlocks: number;
  total: number;
}

export interface ConversionCommandUser {
  id: string;
  name: string;
  avatar: string;
  stage: string;
  stageColor: string;
  phone: string;
  query: string;
  actions: string;
  comments: string;
  commentsHighlight?: string;
  subscriptions: string;
}

export interface FarmlandSpecificDetails {
  id: string;
  status: string;
  location: string;
  area: string;
  totalVisitors: number;
  visitorsGrowth: string;
  documentationUnlocked: number;
  purchaseRequests: number;
  momentumTimeline: MomentumTimelinePoint[];
  conversionCommandUsers: ConversionCommandUser[];
}

export interface SubscriberSegment {
  label: string;
  value: number;
  color: string;
}

export interface SubscriberGrowthData {
  segments: SubscriberSegment[];
  unitsTotal: number;
}

import type { FarmlandData as SuperAdminFarmlandData } from "./farmland.types";
import type { FarmlandListCardData } from "../sub-features/dashboard/components/SuperAdminFarmlandsListCard";
import type { SuperAdminUserCardData } from "../sub-features/dashboard/components/SuperAdminUserListCard";
import type { PoolBuyingCardData } from "../sub-features/dashboard/components/PoolBuyingCard";

export interface AssignedFarmlandDetailsData {
  id: string;
  status: {
    systemStatus: string;
    liveStatus: string;
  };
  assetDetails: {
    location: string;
    agentName: string;
    agentAvatar: string;
    creationTime: string;
    lastUpdated: string;
  };
  heroData: {
    title: string;
    location: string;
    badge: string;
    image: string;
  };
}

export interface CustomerInformationData {
  farmlandId: string;
  ownerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dob: string;
    religion: string;
    gender: string;
    locationLink: string;
    mapImage: string;
  };
  familyTree: {
    owner: { name: string; info: string; avatar: string };
    father: { name: string; info: string; avatar: string };
    spouse: { name: string; info: string; avatar: string };
    mother: { name: string; info: string; avatar: string };
    daughter: { name: string; info: string; avatar: string };
  };
  landDetails: {
    state: string;
    district: string;
    area: string;
    acquisitionCategory: string;
    agent: string;
    landConversion: string;
    valueForArea: string;
    agentReferralLocation: string;
    geoReference: {
      coordinates: string;
      gridElev: string;
    };
    largeAerialImage: string;
    smallMapImage: string;
  };
}

export interface UserProfileActivity {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  statusText: string;
  date: string;
  borderColor: string;
}

export interface AgentTransaction {
  id: string;
  farmlandId: string;
  date: string;
  position: string;
  landValue: string;
  commission: string;
  status: "Cleared" | "Processing";
}

export interface AgentProfileData {
  id: string;
  name: string;
  avatar: string;
  role: string;
  pendingReview: number;
  rejectedDeals: number;
  completedDeals: number;
  growth: string;
  performanceIndex: string;
  closeRatio: number;
  avgResponse: string;
  quarterPerf: string;
  transactions: AgentTransaction[];
}

export interface UserProfileData {
  id: string;
  name: string;
  avatar: string;
  tier: string;
  isActive: boolean;
  email: string;
  phone: string;
  stats: {
    farmlandPurchases: number;
    timesSubscribed: number;
    viewsLeft: number;
  };
  recentActivity: UserProfileActivity[];
}

export interface PoolInvestor {
  id: string;
  name: string;
  avatar: string;
  investedAmount: string;
  landAllocated: string;
  ownershipPercent: string;
  location: string;
  investedOn: string;
  plotId: string;
  poolName: string;
  status: "Active" | "Closed" | "Pending";
  tenure: string;
}

export interface PoolDetailData {
  id: string;
  farmlandId: string;
  totalLandArea: string;
  raisedAmount: string;
  targetAmount: string;
  totalInvestment: string;
  totalInvestors: number;
  mapImage: string;
  investors: PoolInvestor[];
}

export interface DashboardData {
  visitors: VisitorStats;
  totalSales: TotalSales;
  farmlandStats: FarmlandStats;
  statusCards: StatusCardItem[];
  salesReport: SalesReportDataPoint[];
  topPerformers: TopPerformer[];
  topPerformersDetailed: TopPerformer[];
  subscriberGrowth: SubscriberGrowthData;
  assignedFarmlands: SuperAdminFarmlandData[];
  farmlandsList: FarmlandListCardData[];
  usersList: SuperAdminUserCardData[];
  assignedFarmlandDetails: AssignedFarmlandDetailsData;
  customerInformation: CustomerInformationData;
  userProfile: UserProfileData;
  farmlandSpecificDetails: FarmlandSpecificDetails;
  agentProfile: AgentProfileData;
  poolBuyingPools: PoolBuyingCardData[];
  poolDetails: Record<string, PoolDetailData>;
}
