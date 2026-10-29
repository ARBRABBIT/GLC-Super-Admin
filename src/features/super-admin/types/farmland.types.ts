export interface GetAllFarmlandsPayload {
  offset?: string | number;
  limit?: string | number;
  status_id?: number;
  country_id?: number;
  state_id?: number;
  region_id?: number;
  area_id?: number;
  startDate?: string;
  endDate?: string;
}

export interface LocationData {
  country_id: number | null;
  state_id: number | null;
  district_id: number | null;
  mandal_id: number | null;
  region_id: number | null;
  area_id: number | null;
}

export interface AgentData {
  first_name: string | null;
  last_name: string | null;
  img: string | null;
}

export interface FarmlandData {
  id: number;
  farm_code: string;
  total_acres: string;
  valuation: string;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  status: string;
  status_id: number;
  priority_id: number;
  village_name: string | null;
  location: LocationData;
  agent: AgentData;
  is_glc_exclusive?: number;
}

export interface GetAllFarmlandsResponse {
  success: boolean;
  totalCount: number;
  data: FarmlandData[];
}

export interface GetFarmlandByIdPayload {
  farmlandId: number | string;
}

export interface GetOwnerDetailsByFarmlandIdPayload {
  farmlandId: number;
}

export interface OwnerDetailsData {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  country_code: string | null;
  phone: string | null;
  gender: string | null;
  dob: string | null;
}

export interface GetOwnerDetailsResponse {
  success: boolean;
  data: OwnerDetailsData;
}

export interface FamilyTreeRelative {
  member_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  age: number | null;
  related_to_member_id: number | null;
  relationship_code: string;
  relationship_description: string;
  relatives: any[];
}

export interface FamilyTreeOwner {
  member_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  age: number | null;
  related_to_member_id: number | null;
  relationship_code: string;
  relationship_description: string;
  relatives: FamilyTreeRelative[];
}

export interface GetFamilyTreeResponse {
  success: boolean;
  data: FamilyTreeOwner[];
}

export interface GetFamilyTreePayload {
  farmland_id: number;
}

export interface GetLocalIntelligenceStatusPayload {
  farmlandId: number;
}

export interface GetLandAndBoundariesStatusPayload {
  farmlandId: number;
}

export interface GetAgricultureReportStatusPayload {
  farmlandId: number;
}

export interface GetFarmlandLegalDocsStatusPayload {
  farmlandId: number;
}

export interface LegalDocVersionFile {
  id: number;
  document_url: string;
}

export interface LegalDocVersion {
  version: number;
  remarks: string | null;
  files: LegalDocVersionFile[];
  land_coordinates?: string | null;
}

export interface LegalDocItem {
  code: string;
  description: string;
  uploaded: boolean;
  versions: LegalDocVersion[];
}

export interface GetFarmlandLegalDocsStatusResponse {
  success: boolean;
  data: Record<string, LegalDocItem>;
}