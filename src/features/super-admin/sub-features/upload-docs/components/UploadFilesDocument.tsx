import React from "react";
import { LegalUploadFile } from "./LegalUploadFile";
import { AgricultureReportUploadFile } from "./AgricultureReportUploadFile";
import { LandAndBoundariesUploadFile } from "./LandAndBoundariesUploadFile";
import { ValuationUploadFile } from "./ValuationUploadFile";
import { LocalIntelligenceUploadFile } from "./LocalIntelligenceUploadFile";

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  url?: string;
  status: "uploading" | "completed";
  imageType?: "cover" | "land";
}

interface UploadFilesDocumentProps {
  activeTabLabel: string;
  uploadedFiles: UploadedFileItem[];
  commentValue: string;
  onCommentChange: (val: string) => void;
  onFileUpload: (files: FileList, imageType?: "cover" | "land") => void;
  onFileDelete: (fileId: string) => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  isFinishStep?: boolean;
  isUploading?: boolean;
  hasCoverImage?: boolean;
  coordinatesValue?: string;
  onCoordinatesChange?: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
  selectedSoilType?: string;
  onSoilTypeChange?: (val: string) => void;
  selectedCropType?: string;
  onCropTypeChange?: (val: string) => void;
  waterLevelValue?: string;
  onWaterLevelChange?: (val: string) => void;
  selectedFutureCrops?: string;
  onFutureCropsChange?: (val: string) => void;
  yieldCostValue?: string;
  onYieldCostChange?: (val: string) => void;
  yieldReturnsValue?: string;
  onYieldReturnsChange?: (val: string) => void;
  cultivationTypeValue?: string;
  onCultivationTypeChange?: (val: string) => void;
  cultivationNameValue?: string;
  onCultivationNameChange?: (val: string) => void;
  cultivationContactValue?: string;
  onCultivationContactChange?: (val: string) => void;
  maintenanceCropValue?: string;
  onMaintenanceCropChange?: (val: string) => void;
  maintenanceReturnsValue?: string;
  onMaintenanceReturnsChange?: (val: string) => void;
  advantagesValue?: string;
  onAdvantagesChange?: (val: string) => void;
  disadvantagesValue?: string;
  onDisadvantagesChange?: (val: string) => void;
  landShapeValue?: string;
  onLandShapeChange?: (val: string) => void;
  facilityAvailabilityValue?: string;
  onFacilityAvailabilityChange?: (val: string) => void;
  waterFacilityValue?: string;
  onWaterFacilityChange?: (val: string) => void;
  ownerMindsetOptions?: any[];
  shapeOfTheLandOptions?: any[];
  treesCountOptions?: any[];
  boundariesOptions?: any[];
  electricityFacilityValue?: string;
  onElectricityFacilityChange?: (val: string) => void;
  treesAvailabilityValue?: string;
  onTreesAvailabilityChange?: (val: string) => void;
  treesCountValue?: string;
  onTreesCountChange?: (val: string) => void;
  surveyReportTypeValue?: string;
  onSurveyReportTypeChange?: (val: string) => void;
  privateSurveyFiles?: UploadedFileItem[];
  onPrivateSurveyFileUpload?: (files: FileList) => void;
  onPrivateSurveyFileDelete?: (id: string) => void;
  governmentSurveyFiles?: UploadedFileItem[];
  onGovernmentSurveyFileUpload?: (files: FileList) => void;
  onGovernmentSurveyFileDelete?: (id: string) => void;
  privateSurveyCommentValue?: string;
  onPrivateSurveyCommentChange?: (val: string) => void;
  governmentSurveyCommentValue?: string;
  onGovernmentSurveyCommentChange?: (val: string) => void;
  boundaryTypeValue?: string;
  onBoundaryTypeChange?: (val: string) => void;
  boundaryOwnerNameValue?: string;
  onBoundaryOwnerNameChange?: (val: string) => void;
  boundaryOwnerAgeValue?: string;
  onBoundaryOwnerAgeChange?: (val: string) => void;
  boundaryRoadTypeValue?: string;
  onBoundaryRoadTypeChange?: (val: string) => void;
  boundaryRoadWidthValue?: string;
  onBoundaryRoadWidthChange?: (val: string) => void;
  boundaryTreesCountValue?: string;
  onBoundaryTreesCountChange?: (val: string) => void;
  recentTransactionTypeValue?: string;
  onRecentTransactionTypeChange?: (val: string) => void;
  valuationPerAcreValue?: string;
  onValuationPerAcreChange?: (val: string) => void;
  localMarketPriceValue?: string;
  onLocalMarketPriceChange?: (val: string) => void;
  geologicalAdvantagesTypeValue?: string;
  onGeologicalAdvantagesTypeChange?: (val: string) => void;
  upcomingInfrastructuresValue?: string;
  onUpcomingInfrastructuresChange?: (val: string) => void;
  railwayConnectivityTypeValue?: string;
  onRailwayConnectivityTypeChange?: (val: string) => void;
  railwayDistanceValue?: string;
  onRailwayDistanceChange?: (val: string) => void;
  airportConnectivityTypeValue?: string;
  onAirportConnectivityTypeChange?: (val: string) => void;
  airportDistanceValue?: string;
  onAirportDistanceChange?: (val: string) => void;
  anyIssuesTypeValue?: string;
  onAnyIssuesTypeChange?: (val: string) => void;
  localLiabilitiesTypeValue?: string;
  onLocalLiabilitiesTypeChange?: (val: string) => void;
  pendingLoansTypeValue?: string;
  onPendingLoansTypeChange?: (val: string) => void;
  pendingLoansAmountValue?: string;
  onPendingLoansAmountChange?: (val: string) => void;
  ownerMindsetValue?: string;
  onOwnerMindsetChange?: (val: string) => void;
  sourcePersonTypeValue?: string;
  onSourcePersonTypeChange?: (val: string) => void;
  sourcePersonNameValue?: string;
  onSourcePersonNameChange?: (val: string) => void;
  sourcePersonMobileValue?: string;
  onSourcePersonMobileChange?: (val: string) => void;
  agreementPaperValue?: string;
  onAgreementPaperChange?: (val: string) => void;
  agreementTypeValue?: string;
  onAgreementTypeChange?: (val: string) => void;
  agreementPriceValue?: string;
  onAgreementPriceChange?: (val: string) => void;
  prevTransactionsTypeValue?: string;
  onPrevTransactionsTypeChange?: (val: string) => void;
  prevTransactionsPriceValue?: string;
  onPrevTransactionsPriceChange?: (val: string) => void;
}

const LEGAL_TABS = [
  "Land Document",
  "Pattadhar Passbook",
  "Link Document",
  "Kasara Pahani & Proceeding Copies",
  "Revenue Record",
  "Lease Agreement",
  "Death Certificate",
  "Partition Deed",
  "Encumbrance Certificate",
  "Land Coordinates",
  "Owner Video KYC",
];

const AGRI_TABS = [
  "Local Agriculture Officer Report",
  "Last 5 years Crop Yielding Report",
  "Soil",
  "Type Of Crop",
  "Ground Water Level",
  "Types of Crop can be grown",
  "Current Yield Cost",
  "Current Cultivation",
  "Future Crops",
  "Maintenance",
  "Natural Advantages and Disadvantages",
];

const BOUNDARY_TABS = [
  "Land Images",
  "Landscape View of Farmlands",
  "Shape of the Land",
  "Water and Electricity Facility",
  "Any Existing Trees",
  "Master Plan",
  "Survey Report",
  "East Boundaries",
  "West Boundaries",
  "North Boundaries",
  "South Boundaries",
];

const VALUATION_TABS = [
  "Village Map or Naksha",
  "Sub - Register Value",
  "Valuator Report",
  "Legal Opinion Report",
  "Road Approach",
  "Recent Transactions",
  "Geological Advantages",
  "Future Plans",
  "Validating Disadvantages",
  "Upcoming Infrastrucutres",
  "Railway Track Connectivity",
  "Airport Connectivity",
];

const INTEL_TABS = [
  "Any Issues",
  "Local Liabilities",
  "Any Pending Loans",
  "Owner Mindset",
  "Source Person",
  "Agreements",
  "Previous Transactions",
];

export const UploadFilesDocument: React.FC<UploadFilesDocumentProps> = (props) => {
  const { activeTabLabel } = props;

  let isNextEnabled = false;
  const hasFiles = props.uploadedFiles && props.uploadedFiles.length > 0;
  const hasComment = !!props.commentValue?.trim();

  // 1. Legal Tabs
  if (LEGAL_TABS.includes(activeTabLabel)) {
    if (activeTabLabel === "Land Coordinates") {
      isNextEnabled = !!props.coordinatesValue?.trim() && hasComment;
    } else {
      isNextEnabled = hasFiles && hasComment;
    }
  }
  // 2. Agri Tabs
  else if (AGRI_TABS.includes(activeTabLabel)) {
    if (activeTabLabel === "Local Agriculture Officer Report" || activeTabLabel === "Last 5 years Crop Yielding Report") {
      isNextEnabled = hasFiles && hasComment;
    } else if (activeTabLabel === "Soil") {
      isNextEnabled = !!props.selectedSoilType && hasComment;
    } else if (activeTabLabel === "Type Of Crop") {
      isNextEnabled = !!props.selectedCropType && hasComment;
    } else if (activeTabLabel === "Ground Water Level") {
      isNextEnabled = !!props.waterLevelValue?.trim() && hasComment;
    } else if (activeTabLabel === "Types of Crop can be grown") {
      isNextEnabled = !!props.selectedFutureCrops && hasComment;
    } else if (activeTabLabel === "Current Yield Cost") {
      isNextEnabled = !!props.yieldCostValue?.trim() && !!props.yieldReturnsValue?.trim() && hasComment;
    } else if (activeTabLabel === "Current Cultivation") {
      isNextEnabled = !!props.cultivationTypeValue && !!props.cultivationNameValue?.trim() && !!props.cultivationContactValue?.trim() && hasComment;
    } else if (activeTabLabel === "Future Crops") {
      isNextEnabled = hasComment;
    } else if (activeTabLabel === "Maintenance") {
      isNextEnabled = !!props.maintenanceCropValue && !!props.maintenanceReturnsValue?.trim() && hasComment;
    } else if (activeTabLabel === "Natural Advantages and Disadvantages") {
      isNextEnabled = !!props.advantagesValue?.trim() && !!props.disadvantagesValue?.trim() && hasComment;
    }
  }
  // 3. Boundary Tabs
  else if (BOUNDARY_TABS.includes(activeTabLabel)) {
    if (activeTabLabel === "Land Images" || activeTabLabel === "Landscape View of Farmlands" || activeTabLabel === "Master Plan") {
      isNextEnabled = hasFiles && hasComment;
    } else if (activeTabLabel === "Shape of the Land") {
      isNextEnabled = !!props.landShapeValue?.trim() && hasComment;
    } else if (activeTabLabel === "Water and Electricity Facility") {
      const facility = props.facilityAvailabilityValue;
      const hasWater = facility === "water" || facility === "both";
      const hasElectricity = facility === "electricity" || facility === "both";
      
      const waterValid = hasWater ? !!props.waterFacilityValue : true;
      const electricityValid = hasElectricity ? !!props.electricityFacilityValue : true;
      
      isNextEnabled = !!facility && waterValid && electricityValid && hasComment;
    } else if (activeTabLabel === "Any Existing Trees") {
      const isTreesAvailable = props.treesAvailabilityValue === "available";
      const isCountValid = isTreesAvailable ? !!props.treesCountValue : true;
      isNextEnabled = !!props.treesAvailabilityValue && isCountValid && hasComment;
    } else if (activeTabLabel === "Survey Report") {
      const type = props.surveyReportTypeValue;
      const hasPrivate = !!props.privateSurveyFiles?.length && !!props.privateSurveyCommentValue?.trim();
      const hasGov = !!props.governmentSurveyFiles?.length && !!props.governmentSurveyCommentValue?.trim();
      if (type === "private") isNextEnabled = hasPrivate;
      else if (type === "government") isNextEnabled = hasGov;
      else if (type === "both") isNextEnabled = hasPrivate && hasGov;
    } else { // Boundaries
      isNextEnabled = !!props.boundaryTypeValue && hasComment;
    }
  }
  // 4. Valuation Tabs
  else if (VALUATION_TABS.includes(activeTabLabel)) {
    if (activeTabLabel === "Recent Transactions") {
      isNextEnabled = !!props.recentTransactionTypeValue && !!props.valuationPerAcreValue?.trim() && !!props.localMarketPriceValue?.trim() && hasComment;
    } else if (activeTabLabel === "Geological Advantages") {
      isNextEnabled = !!props.geologicalAdvantagesTypeValue && hasComment;
    } else if (activeTabLabel === "Upcoming Infrastrucutres") {
      isNextEnabled = !!props.upcomingInfrastructuresValue && hasComment;
    } else if (activeTabLabel === "Railway Track Connectivity") {
      const railwayAvailable = props.railwayConnectivityTypeValue === "Available";
      isNextEnabled = !!props.railwayConnectivityTypeValue && (railwayAvailable ? !!props.railwayDistanceValue?.trim() : true) && hasComment;
    } else if (activeTabLabel === "Airport Connectivity") {
      const airportAvailable = props.airportConnectivityTypeValue === "Available";
      isNextEnabled = !!props.airportConnectivityTypeValue && (airportAvailable ? !!props.airportDistanceValue?.trim() : true) && hasComment;
    } else if (activeTabLabel === "Road Approach") {
      isNextEnabled = !!props.boundaryRoadTypeValue && !!props.boundaryRoadWidthValue?.trim() && hasComment;
    } else if (activeTabLabel === "Future Plans" || activeTabLabel === "Validating Disadvantages") {
      isNextEnabled = hasComment;
    } else {
      isNextEnabled = hasFiles && hasComment;
    }
  }
  // 5. Intel Tabs
  else if (INTEL_TABS.includes(activeTabLabel)) {
    if (activeTabLabel === "Any Issues") {
      isNextEnabled = !!props.anyIssuesTypeValue && hasComment;
    } else if (activeTabLabel === "Local Liabilities") {
      isNextEnabled = !!props.localLiabilitiesTypeValue && hasComment;
    } else if (activeTabLabel === "Any Pending Loans") {
      const loansAvailable = props.pendingLoansTypeValue === "Available";
      isNextEnabled = !!props.pendingLoansTypeValue && (loansAvailable ? !!props.pendingLoansAmountValue?.trim() : true) && hasComment;
    } else if (activeTabLabel === "Owner Mindset") {
      isNextEnabled = !!props.ownerMindsetValue && hasComment;
    } else if (activeTabLabel === "Source Person") {
      isNextEnabled = !!props.sourcePersonTypeValue && !!props.sourcePersonNameValue?.trim() && !!props.sourcePersonMobileValue?.trim() && hasComment;
    } else if (activeTabLabel === "Agreements") {
      const agreementsAvailable = props.agreementPaperValue === "Available";
      isNextEnabled = !!props.agreementPaperValue && (agreementsAvailable ? !!props.agreementTypeValue && !!props.agreementPriceValue?.trim() : true) && hasComment;
    } else if (activeTabLabel === "Previous Transactions") {
      const prevTxAvailable = props.prevTransactionsTypeValue === "Available";
      isNextEnabled = !!props.prevTransactionsTypeValue && (prevTxAvailable ? !!props.prevTransactionsPriceValue?.trim() : true) && hasComment;
    }
  }

  // 6. Disable during upload
  if (props.isUploading) {
    isNextEnabled = false;
  }

  const childProps = { ...props, isFinishStep: !!props.isFinishStep, isNextEnabled };

  if (LEGAL_TABS.includes(activeTabLabel)) {
    return <LegalUploadFile {...childProps} />;
  }
  if (AGRI_TABS.includes(activeTabLabel)) {
    return <AgricultureReportUploadFile {...childProps} />;
  }
  if (BOUNDARY_TABS.includes(activeTabLabel)) {
    return <LandAndBoundariesUploadFile {...childProps} />;
  }
  if (VALUATION_TABS.includes(activeTabLabel)) {
    return <ValuationUploadFile {...childProps} />;
  }
  if (INTEL_TABS.includes(activeTabLabel)) {
    return <LocalIntelligenceUploadFile {...childProps} />;
  }
  return null;
};

export default UploadFilesDocument;
