export interface MasterDataEntity {
  id: number;
  code: string;
  description: string;
  created_on?: string;
  sort_order?: number | null;
  [key: string]: any;
}

export interface MasterDataResponse {
  userRolesResult: MasterDataEntity[];
  tagResult: MasterDataEntity[];
  clientInterestsResult: MasterDataEntity[];
  facilitiesResult: MasterDataEntity[];
  milestoneStageStatusResult: MasterDataEntity[];
  milestoneStagesResult: MasterDataEntity[];
  notificationTypesResult: MasterDataEntity[];
  payoutStatusResult: MasterDataEntity[];
  farmlandStatusResult: MasterDataEntity[];
  userRegistrationStatusResult: MasterDataEntity[];
  boundariesResult: MasterDataEntity[];
  cropsResult: MasterDataEntity[];
  distancesResult: MasterDataEntity[];
  infrastructuresResult: MasterDataEntity[];
  ownerMindsetResult: MasterDataEntity[];
  shapeOfTheLandResult: MasterDataEntity[];
  soilTypeResult: MasterDataEntity[];
  treesCountResult: MasterDataEntity[];
  farmlandUploadResult: MasterDataEntity[];
  revertStatus: MasterDataEntity[];
  revertStatusResult?: MasterDataEntity[];
  sourcePersonsResult?: MasterDataEntity[];
  familyRelationshipTypesResult?: MasterDataEntity[];
}

export interface Country {
  id: number;
  code: string;
  desc: string;
}

export interface State {
  id: number;
  country_id: number;
  code: string;
  desc: string;
}

export interface District {
  id: number;
  state_id: number;
  code: string;
  desc: string;
}

export interface Mandal {
  id: number;
  districts_id: number;
  code: string;
  desc: string;
}

export interface GeoMasterDataRaw {
  countrys: any[][];
  states: any[][];
  districts: any[][];
  mandals: any[][];
}

export interface GeoMasterData {
  countries: Country[];
  states: State[];
  districts: District[];
  mandals: Mandal[];
}
