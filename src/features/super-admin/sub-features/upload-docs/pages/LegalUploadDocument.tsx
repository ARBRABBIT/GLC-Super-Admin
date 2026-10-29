import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";

import { BackButton } from "@/components/ui/BackButton";
import UploadProfileAvatar from '@/features/super-admin/sub-features/upload-docs/components/UploadProfileAvatar';
import UploadShortTimelineSidebar, { type UploadStepId } from '@/features/super-admin/sub-features/upload-docs/components/UploadShortTimelineSidebar';
import UploadDocumentsTabsCard from '@/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard';
import UploadFilesDocument from '@/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument';
import { UploadSubmittedModal } from '@/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal';

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "completed";
  imageType?: "cover" | "land";
}

// Sub-tabs configuration per pipeline step
const STEP_TABS_CONFIG: Record<
  string,
  { label: string; tabs: { id: string; label: string }[] }
> = {
  "legal-documents": {
    label: "Legal Documents",
    tabs: [
      { id: "land-document", label: "Land Document" },
      { id: "pattadhar-passbook", label: "Pattadhar Passbook" },
      { id: "link-document", label: "Link Document" },
      { id: "kasara-pahani", label: "Kasara Pahani & Proceeding Copies" },
      { id: "revenue-record", label: "Revenue Record" },
      { id: "lease-agreement", label: "Lease Agreement" },
      { id: "death-certificate", label: "Death Certificate" },
      { id: "partition-deed", label: "Partition Deed" },
      { id: "encumbrance-certificate", label: "Encumbrance Certificate" },
      { id: "land-coordinates", label: "Land Coordinates" },
      { id: "owner-video-kyc", label: "Owner Video KYC" },
    ],
  },
  "agriculture-report": {
    label: "Agriculture Report",
    tabs: [
      { id: "local-agriculture-officer-report", label: "Local Agricluture Officer Report" },
      { id: "last-5-years-crop-yielding", label: "Last 5 years Crop Yielding Report" },
      { id: "soil", label: "Soil" },
      { id: "type-of-crop", label: "Type Of Crop" },
      { id: "ground-water-level", label: "Ground Water Level" },
      { id: "types-of-crop-can-be-grown", label: "Types of Crop can be grown" },
      { id: "current-yield-cost", label: "Current Yield Cost" },
      { id: "current-cultivation", label: "Current Cultivation" },
      { id: "future-crops", label: "Future Crops" },
      { id: "maintenance", label: "Maintenance" },
      { id: "natural-advantages-disadvantages", label: "Natural Advantages and Disadvantages" },
    ],
  },
  "land-boundaries": {
    label: "Land & Boundaries",
    tabs: [
      { id: "land-images", label: "Land Images" },
      { id: "landscape-view", label: "Landscape View of Farmlands" },
      { id: "shape-land", label: "Shape of the Land" },
      { id: "water-electricity", label: "Water and Electricity Facility" },
      { id: "existing-trees", label: "Any Existing Trees" },
      { id: "master-plan", label: "Master Plan" },
      { id: "survey-report", label: "Survey Report" },
      { id: "east-boundaries", label: "East Boundaries" },
      { id: "west-boundaries", label: "West Boundaries" },
      { id: "north-boundaries", label: "North Boundaries" },
      { id: "south-boundaries", label: "South Boundaries" },
    ],
  },
  "valuation": {
    label: "Valuation",
    tabs: [
      { id: "village-map-naksha", label: "Village Map or Naksha" },
      { id: "sub-register-value", label: "Sub - Register Value" },
      { id: "valuator-report", label: "Valuator Report" },
      { id: "legal-opinion-report", label: "Legal Opinion Report" },
      { id: "road-approach", label: "Road Approach" },
      { id: "recent-transactions", label: "Recent Transactions" },
      { id: "geological-advantages", label: "Geological Advantages" },
      { id: "future-plans", label: "Future Plans" },
      { id: "validating-disadvantages", label: "Validating Disadvantages" },
      { id: "upcoming-infrastructures", label: "Upcoming Infrastrucutres" },
      { id: "railway-track-connectivity", label: "Railway Track Connectivity" },
      { id: "airport-connectivity", label: "Airport Connectivity" },
    ],
  },
  "local-intelligence": {
    label: "Local Intelligence",
    tabs: [
      { id: "any-issues", label: "Any Issues" },
      { id: "local-liabilities", label: "Local Liabilities" },
      { id: "any-pending-loans", label: "Any Pending Loans" },
      { id: "owner-mindset", label: "Owner Mindset" },
      { id: "source-person", label: "Source Person" },
      { id: "agreements", label: "Agreements" },
      { id: "previous-transactions", label: "Previous Transactions" },
    ],
  },
};

const STEP_ORDER: UploadStepId[] = [
  "customer-information",
  "legal-documents",
  "agriculture-report",
  "land-boundaries",
  "valuation",
  "local-intelligence",
];

export const LegalUploadDocument: React.FC = () => {
  const { step, id } = useParams<{ step: string; id: string }>();
  const navigate = useNavigate();
  const targetId = id || "GLCSOS-05";

  // Validate the current step or default to legal-documents
  const currentStepId = (step && STEP_TABS_CONFIG[step] ? step : "legal-documents") as UploadStepId;
  const stepConfig = STEP_TABS_CONFIG[currentStepId];

  // State
  const [activeTabId, setActiveTabId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, _setToastMessage] = useState("");



  // Track completed tabs explicitly (so checkmark only appears when we transition tabs)
  const [completedTabs, setCompletedTabs] = useState<Record<string, Record<string, boolean>>>({});

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Store uploaded files per step and tab ID
  // Structure: { [stepId]: { [tabId]: UploadedFileItem[] } }
  const [uploadedStore, setUploadedStore] = useState<
    Record<string, Record<string, UploadedFileItem[]>>
  >({});

  // Store comments per step and tab ID
  // Structure: { [stepId]: { [tabId]: string } }
  const [commentsStore, setCommentsStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store soil types per farmland ID
  // Structure: { [farmlandId]: string }
  const [soilTypeStore, setSoilTypeStore] = useState<
    Record<string, string>
  >({});

  // Store crop types per farmland ID
  // Structure: { [farmlandId]: string }
  const [cropTypeStore, setCropTypeStore] = useState<
    Record<string, string>
  >({});

  // Store ground water levels per farmland ID
  // Structure: { [farmlandId]: string }
  const [waterLevelStore, setWaterLevelStore] = useState<
    Record<string, string>
  >({});

  // Store future crops per farmland ID
  // Structure: { [farmlandId]: string }
  const [futureCropsStore, setFutureCropsStore] = useState<
    Record<string, string>
  >({});

  // Store yield cost per farmland ID
  const [yieldCostStore, setYieldCostStore] = useState<
    Record<string, string>
  >({});

  // Store yield returns per farmland ID
  const [yieldReturnsStore, setYieldReturnsStore] = useState<
    Record<string, string>
  >({});

  // Store cultivation type per farmland ID
  const [cultivationTypeStore, setCultivationTypeStore] = useState<
    Record<string, string>
  >({});

  // Store cultivation name per farmland ID
  const [cultivationNameStore, setCultivationNameStore] = useState<
    Record<string, string>
  >({});

  // Store cultivation contact per farmland ID
  const [cultivationContactStore, setCultivationContactStore] = useState<
    Record<string, string>
  >({});

  // Store maintenance crop suggestions per farmland ID
  const [maintenanceCropStore, setMaintenanceCropStore] = useState<
    Record<string, string>
  >({});

  // Store maintenance best returns per farmland ID
  const [maintenanceReturnsStore, setMaintenanceReturnsStore] = useState<
    Record<string, string>
  >({});

  // Store natural advantages per farmland ID
  const [advantagesStore, setAdvantagesStore] = useState<
    Record<string, string>
  >({});

  // Store natural disadvantages per farmland ID
  const [disadvantagesStore, setDisadvantagesStore] = useState<
    Record<string, string>
  >({});

  // Store land shape per farmland ID
  const [landShapeStore, setLandShapeStore] = useState<
    Record<string, string>
  >({});

  // Store facility availability per farmland ID
  const [facilityAvailabilityStore, setFacilityAvailabilityStore] = useState<
    Record<string, string>
  >({});

  // Store water facility type per farmland ID
  const [waterFacilityTypeStore, setWaterFacilityTypeStore] = useState<
    Record<string, string>
  >({});

  // Store electricity facility type per farmland ID
  const [electricityFacilityTypeStore, setElectricityFacilityTypeStore] = useState<
    Record<string, string>
  >({});

  // Store tree availability per farmland ID
  const [treesAvailabilityStore, setTreesAvailabilityStore] = useState<
    Record<string, string>
  >({});

  // Store tree count per farmland ID
  const [treesCountStore, setTreesCountStore] = useState<
    Record<string, string>
  >({});

  // Store survey report type per farmland ID (private, government, both)
  const [surveyReportTypeStore, setSurveyReportTypeStore] = useState<
    Record<string, string>
  >({});

  // Store private survey files per farmland ID
  const [privateSurveyFilesStore, setPrivateSurveyFilesStore] = useState<
    Record<string, UploadedFileItem[]>
  >({});

  // Store government survey files per farmland ID
  const [governmentSurveyFilesStore, setGovernmentSurveyFilesStore] = useState<
    Record<string, UploadedFileItem[]>
  >({});

  // Store private survey comments per farmland ID
  const [privateSurveyCommentStore, setPrivateSurveyCommentStore] = useState<
    Record<string, string>
  >({});

  // Store government survey comments per farmland ID
  const [governmentSurveyCommentStore, setGovernmentSurveyCommentStore] = useState<
    Record<string, string>
  >({});

  // Store boundary type per farmland ID and activeTabId
  const [boundaryTypeStore, setBoundaryTypeStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store boundary owner name per farmland ID and activeTabId
  const [boundaryOwnerNameStore, setBoundaryOwnerNameStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store boundary owner age per farmland ID and activeTabId
  const [boundaryOwnerAgeStore, setBoundaryOwnerAgeStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store boundary road type per farmland ID and activeTabId
  const [boundaryRoadTypeStore, setBoundaryRoadTypeStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store boundary road width per farmland ID and activeTabId
  const [boundaryRoadWidthStore, setBoundaryRoadWidthStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store boundary trees count per farmland ID and activeTabId
  const [boundaryTreesCountStore, setBoundaryTreesCountStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store recent transactions state per farmland ID and activeTabId
  const [recentTransactionTypeStore, setRecentTransactionTypeStore] = useState<
    Record<string, Record<string, string>>
  >({});
  const [valuationPerAcreStore, setValuationPerAcreStore] = useState<
    Record<string, Record<string, string>>
  >({});
  const [localMarketPriceStore, setLocalMarketPriceStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store geological advantages type per farmland ID and activeTabId
  const [geologicalAdvantagesTypeStore, setGeologicalAdvantagesTypeStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store upcoming infrastructures selection per farmland ID and activeTabId
  const [upcomingInfrastructuresStore, setUpcomingInfrastructuresStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store railway connectivity type per farmland ID and activeTabId
  const [railwayConnectivityTypeStore, setRailwayConnectivityTypeStore] = useState<
    Record<string, Record<string, string>>
  >({});
  // Store railway distance selection per farmland ID and activeTabId
  const [railwayDistanceStore, setRailwayDistanceStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store airport connectivity type per farmland ID and activeTabId
  const [airportConnectivityTypeStore, setAirportConnectivityTypeStore] = useState<
    Record<string, Record<string, string>>
  >({});
  // Store airport distance selection per farmland ID and activeTabId
  const [airportDistanceStore, setAirportDistanceStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store any issues type per farmland ID and activeTabId
  const [anyIssuesTypeStore, setAnyIssuesTypeStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store local liabilities type per farmland ID and activeTabId
  const [localLiabilitiesTypeStore, setLocalLiabilitiesTypeStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store pending loans type per farmland ID and activeTabId
  const [pendingLoansTypeStore, setPendingLoansTypeStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store pending loans amount per farmland ID and activeTabId
  const [pendingLoansAmountStore, setPendingLoansAmountStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store owner mindset per farmland ID and activeTabId
  const [ownerMindsetStore, setOwnerMindsetStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store source person type per farmland ID and activeTabId
  const [sourcePersonTypeStore, setSourcePersonTypeStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store source person name per farmland ID and activeTabId
  const [sourcePersonNameStore, setSourcePersonNameStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store source person mobile per farmland ID and activeTabId
  const [sourcePersonMobileStore, setSourcePersonMobileStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store agreement paper availability per farmland ID and activeTabId
  const [agreementPaperStore, setAgreementPaperStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store agreement type per farmland ID and activeTabId
  const [agreementTypeStore, setAgreementTypeStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store agreement price per farmland ID and activeTabId
  const [agreementPriceStore, setAgreementPriceStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store previous transactions availability per farmland ID and activeTabId
  const [prevTransactionsTypeStore, setPrevTransactionsTypeStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Store previous transactions price per farmland ID and activeTabId
  const [prevTransactionsPriceStore, setPrevTransactionsPriceStore] = useState<
    Record<string, Record<string, string>>
  >({});

  // Sync active tab when step changes
  useEffect(() => {
    if (stepConfig && stepConfig.tabs.length > 0) {
      setActiveTabId(stepConfig.tabs[0].id);
    }
    setShowSuccessModal(false);
  }, [currentStepId]);

  const activeTabLabel = stepConfig?.tabs.find((t) => t.id === activeTabId)?.label || "";
  const currentTabFiles = uploadedStore[currentStepId]?.[activeTabId] || [];
  const currentTabComment = commentsStore[currentStepId]?.[activeTabId] || "";

  // Check if a tab is complete
  const isTabComplete = (tabId: string) => {
    return !!completedTabs[currentStepId]?.[tabId];
  };

  const handleTabSelect = (newTabId: string) => {
    setActiveTabId(newTabId);
  };

  const addFiles = (fileList: FileList, imageType?: "cover" | "land") => {
    const newFiles: UploadedFileItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;

      newFiles.push({
        id: Date.now().toString() + i,
        name: file.name,
        size: sizeStr,
        progress: 0,
        status: "uploading",
        imageType,
      });
    }

    // Update state to include new files
    setUploadedStore((prev) => {
      const stepData = prev[currentStepId] || {};
      const tabData = stepData[activeTabId] || [];
      return {
        ...prev,
        [currentStepId]: {
          ...stepData,
          [activeTabId]: [...tabData, ...newFiles],
        },
      };
    });

    // Simulate upload progress
    newFiles.forEach((file) => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += Math.floor(Math.random() * 25) + 15;
      if (progressVal >= 100) {
        progressVal = 100;
        clearInterval(interval);
        setUploadedStore((prev) => {
          const stepData = prev[currentStepId] || {};
          const tabData = stepData[activeTabId] || [];
          return {
            ...prev,
            [currentStepId]: {
              ...stepData,
              [activeTabId]: tabData.map((f) =>
                f.id === fileId ? { ...f, progress: 100, status: "completed" as const } : f
              ),
            },
          };
        });
      } else {
        setUploadedStore((prev) => {
          const stepData = prev[currentStepId] || {};
          const tabData = stepData[activeTabId] || [];
          return {
            ...prev,
            [currentStepId]: {
              ...stepData,
              [activeTabId]: tabData.map((f) =>
                f.id === fileId ? { ...f, progress: progressVal } : f
              ),
            },
          };
        });
      }
    }, 300);
  };

  const deleteFile = (fileId: string) => {
    setUploadedStore((prev) => {
      const stepData = prev[currentStepId] || {};
      const tabData = stepData[activeTabId] || [];
      return {
        ...prev,
        [currentStepId]: {
          ...stepData,
          [activeTabId]: tabData.filter((f) => f.id !== fileId),
        },
      };
    });
  };

  const addPrivateSurveyFiles = (fileList: FileList) => {
    const newFiles: UploadedFileItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;

      newFiles.push({
        id: Date.now().toString() + i,
        name: file.name,
        size: sizeStr,
        progress: 0,
        status: "uploading",
      });
    }

    setPrivateSurveyFilesStore((prev) => {
      const currentFiles = prev[targetId] || [];
      return {
        ...prev,
        [targetId]: [...currentFiles, ...newFiles],
      };
    });

    newFiles.forEach((file) => {
      simulatePrivateSurveyUpload(file.id);
    });
  };

  const simulatePrivateSurveyUpload = (fileId: string) => {
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += Math.floor(Math.random() * 25) + 15;
      if (progressVal >= 100) {
        progressVal = 100;
        clearInterval(interval);
        setPrivateSurveyFilesStore((prev) => {
          const currentFiles = prev[targetId] || [];
          return {
            ...prev,
            [targetId]: currentFiles.map((f) =>
              f.id === fileId ? { ...f, progress: 100, status: "completed" as const } : f
            ),
          };
        });
      } else {
        setPrivateSurveyFilesStore((prev) => {
          const currentFiles = prev[targetId] || [];
          return {
            ...prev,
            [targetId]: currentFiles.map((f) =>
              f.id === fileId ? { ...f, progress: progressVal } : f
            ),
          };
        });
      }
    }, 300);
  };

  const deletePrivateSurveyFile = (fileId: string) => {
    setPrivateSurveyFilesStore((prev) => {
      const currentFiles = prev[targetId] || [];
      return {
        ...prev,
        [targetId]: currentFiles.filter((f) => f.id !== fileId),
      };
    });
  };

  const addGovtSurveyFiles = (fileList: FileList) => {
    const newFiles: UploadedFileItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;

      newFiles.push({
        id: Date.now().toString() + i,
        name: file.name,
        size: sizeStr,
        progress: 0,
        status: "uploading",
      });
    }

    setGovernmentSurveyFilesStore((prev) => {
      const currentFiles = prev[targetId] || [];
      return {
        ...prev,
        [targetId]: [...currentFiles, ...newFiles],
      };
    });

    newFiles.forEach((file) => {
      simulateGovtSurveyUpload(file.id);
    });
  };

  const simulateGovtSurveyUpload = (fileId: string) => {
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += Math.floor(Math.random() * 25) + 15;
      if (progressVal >= 100) {
        progressVal = 100;
        clearInterval(interval);
        setGovernmentSurveyFilesStore((prev) => {
          const currentFiles = prev[targetId] || [];
          return {
            ...prev,
            [targetId]: currentFiles.map((f) =>
              f.id === fileId ? { ...f, progress: 100, status: "completed" as const } : f
            ),
          };
        });
      } else {
        setGovernmentSurveyFilesStore((prev) => {
          const currentFiles = prev[targetId] || [];
          return {
            ...prev,
            [targetId]: currentFiles.map((f) =>
              f.id === fileId ? { ...f, progress: progressVal } : f
            ),
          };
        });
      }
    }, 300);
  };

  const deleteGovtSurveyFile = (fileId: string) => {
    setGovernmentSurveyFilesStore((prev) => {
      const currentFiles = prev[targetId] || [];
      return {
        ...prev,
        [targetId]: currentFiles.filter((f) => f.id !== fileId),
      };
    });
  };


  const handleCommentChange = (val: string) => {
    setCommentsStore((prev) => {
      const stepData = prev[currentStepId] || {};
      return {
        ...prev,
        [currentStepId]: {
          ...stepData,
          [activeTabId]: val,
        },
      };
    });
  };

  // Navigation handlers
  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePreviousStep = () => {
    const stepIndex = STEP_ORDER.indexOf(currentStepId);
    if (stepIndex > 0) {
      const prevStepId = STEP_ORDER[stepIndex - 1];
      if (prevStepId === "customer-information") {
        navigate(`/super-admin/upload/customer-information/${targetId}`);
      } else {
        navigate(`/super-admin/upload/documents/${prevStepId}/${targetId}`);
      }
    }
  };

  const handleNextStep = () => {
    const stepIndex = STEP_ORDER.indexOf(currentStepId);
    if (stepIndex < STEP_ORDER.length - 1) {
      const nextStepId = STEP_ORDER[stepIndex + 1];
      navigate(`/super-admin/upload/documents/${nextStepId}/${targetId}`);
    } else {
      // Completed last step! Show final success modal
      setShowSuccessModal(true);
    }
  };

  // Navigating through sub-tabs
  const handlePrevTab = () => {
    const currentTabIdx = stepConfig.tabs.findIndex((t) => t.id === activeTabId);
    if (currentTabIdx > 0) {
      setActiveTabId(stepConfig.tabs[currentTabIdx - 1].id);
    } else {
      // Go to previous overall step
      handlePreviousStep();
    }
  };

  const handleNextTab = () => {
    // Determine the toast message based on current inputs before we transition tabs
    let msg = "";
    const hasFiles = currentTabFiles.length > 0;
    const hasComment = currentTabComment.trim() !== "";
    const isSoilTab = currentStepId === "agriculture-report" && activeTabId === "soil";
    const isCropTab = currentStepId === "agriculture-report" && activeTabId === "type-of-crop";
    const isWaterLevelTab = currentStepId === "agriculture-report" && activeTabId === "ground-water-level";
    const isFutureCropsTab = currentStepId === "agriculture-report" && activeTabId === "types-of-crop-can-be-grown";
    const isYieldCostTab = currentStepId === "agriculture-report" && activeTabId === "current-yield-cost";
    const isCultivationTab = currentStepId === "agriculture-report" && activeTabId === "current-cultivation";
    const isMaintenanceTab = currentStepId === "agriculture-report" && activeTabId === "maintenance";
    const isNaturalAdvDisadvTab = currentStepId === "agriculture-report" && activeTabId === "natural-advantages-disadvantages";
    const isShapeLandTab = currentStepId === "land-boundaries" && activeTabId === "shape-land";
    const isWaterElectricityTab = currentStepId === "land-boundaries" && activeTabId === "water-electricity";
    const isExistingTreesTab = currentStepId === "land-boundaries" && activeTabId === "existing-trees";
    const isSurveyReportTab = currentStepId === "land-boundaries" && activeTabId === "survey-report";
    const isBoundaryTab = activeTabId === "east-boundaries" || activeTabId === "west-boundaries" || activeTabId === "north-boundaries" || activeTabId === "south-boundaries";
    const hasBoundary = isBoundaryTab && !!boundaryTypeStore[targetId]?.[activeTabId];

    let hasSurveyReport = false;
    if (isSurveyReportTab) {
      const surveyType = surveyReportTypeStore[targetId] || "private";
      const privateFiles = privateSurveyFilesStore[targetId] || [];
      const govtFiles = governmentSurveyFilesStore[targetId] || [];
      const privateComment = (privateSurveyCommentStore[targetId] || "").trim();
      const govtComment = (governmentSurveyCommentStore[targetId] || "").trim();

      const hasPrivateData = privateFiles.length > 0 || privateComment !== "";
      const hasGovtData = govtFiles.length > 0 || govtComment !== "";

      if (surveyType === "private") {
        hasSurveyReport = hasPrivateData;
      } else if (surveyType === "government") {
        hasSurveyReport = hasGovtData;
      } else if (surveyType === "both") {
        hasSurveyReport = hasPrivateData && hasGovtData;
      }
    }

    const isValuationStep = currentStepId === "valuation";
    const isLocalIntelStep = currentStepId === "local-intelligence";

    let hasValuationField = false;
    if (isValuationStep) {
      if (activeTabId === "village-map-or-naksha") {
        hasValuationField = currentTabFiles.length > 0;
      } else if (activeTabId === "road-approach") {
        hasValuationField = !!boundaryRoadTypeStore[targetId]?.[activeTabId];
      } else if (activeTabId === "recent-transactions") {
        hasValuationField = !!recentTransactionTypeStore[targetId]?.[activeTabId];
      } else if (activeTabId === "geological-advantages") {
        hasValuationField = !!geologicalAdvantagesTypeStore[targetId]?.[activeTabId];
      } else if (activeTabId === "future-plans" || activeTabId === "validating-disadvantages") {
        hasValuationField = currentTabComment.trim() !== "";
      } else if (activeTabId === "upcoming-infrastructures") {
        hasValuationField = !!upcomingInfrastructuresStore[targetId]?.[activeTabId];
      } else if (activeTabId === "railway-track-connectivity") {
        hasValuationField = !!railwayConnectivityTypeStore[targetId]?.[activeTabId];
      } else if (activeTabId === "airport-connectivity") {
        hasValuationField = !!airportConnectivityTypeStore[targetId]?.[activeTabId];
      }
    }

    let hasLocalIntelField = false;
    if (isLocalIntelStep) {
      if (activeTabId === "any-issues") {
        hasLocalIntelField = !!anyIssuesTypeStore[targetId]?.[activeTabId];
      } else if (activeTabId === "local-liabilities") {
        hasLocalIntelField = !!localLiabilitiesTypeStore[targetId]?.[activeTabId];
      } else if (activeTabId === "any-pending-loans") {
        hasLocalIntelField = !!pendingLoansTypeStore[targetId]?.[activeTabId];
      } else if (activeTabId === "owner-mindset") {
        hasLocalIntelField = !!ownerMindsetStore[targetId]?.[activeTabId];
      } else if (activeTabId === "source-person") {
        hasLocalIntelField = !!sourcePersonTypeStore[targetId]?.[activeTabId];
      } else if (activeTabId === "agreements") {
        hasLocalIntelField = !!agreementPaperStore[targetId]?.[activeTabId];
      } else if (activeTabId === "previous-transactions") {
        hasLocalIntelField = !!prevTransactionsTypeStore[targetId]?.[activeTabId];
      }
    }

    if (isValuationStep && hasValuationField) {
      msg = `${activeTabLabel} has been saved`;
    } else if (isLocalIntelStep && hasLocalIntelField) {
      msg = `${activeTabLabel} has been saved`;
    } else if (hasFiles) {
      msg = `${activeTabLabel} “Files” has been saved`;
    } else if (hasComment) {
      msg = `${activeTabLabel} “Comment” has been saved`;
    } else if (isSoilTab) {
      msg = `${activeTabLabel} “Soil Type” has been saved`;
    } else if (isCropTab) {
      msg = `${activeTabLabel} “Crop Type” has been saved`;
    } else if (isWaterLevelTab) {
      msg = `${activeTabLabel} “Water Level” has been saved`;
    } else if (isFutureCropsTab) {
      msg = `${activeTabLabel} “Future Crops” has been saved`;
    } else if (isYieldCostTab) {
      msg = `${activeTabLabel} “Yield Cost & Returns” has been saved`;
    } else if (isCultivationTab) {
      msg = `${activeTabLabel} “Cultivation Type & Details” has been saved`;
    } else if (isMaintenanceTab) {
      msg = `${activeTabLabel} “Maintenance Details” has been saved`;
    } else if (isNaturalAdvDisadvTab) {
      msg = `${activeTabLabel} “Advantages & Disadvantages” has been saved`;
    } else if (isShapeLandTab) {
      msg = `${activeTabLabel} “Land Shape” has been saved`;
    } else if (isWaterElectricityTab) {
      msg = `${activeTabLabel} “Water & Electricity Facilities” has been saved`;
    } else if (isExistingTreesTab) {
      msg = `${activeTabLabel} “Existing Trees” has been saved`;
    } else if (isSurveyReportTab) {
      msg = `${activeTabLabel} has been saved`;
    } else if (isBoundaryTab) {
      msg = `${activeTabLabel} has been saved`;
    }

    if (
      hasFiles ||
      hasComment ||
      isSoilTab ||
      isCropTab ||
      isWaterLevelTab ||
      isFutureCropsTab ||
      isYieldCostTab ||
      isCultivationTab ||
      isMaintenanceTab ||
      isNaturalAdvDisadvTab ||
      isShapeLandTab ||
      isWaterElectricityTab ||
      isExistingTreesTab ||
      (isSurveyReportTab && hasSurveyReport) ||
      (isBoundaryTab && hasBoundary) ||
      (isValuationStep && hasValuationField) ||
      (isLocalIntelStep && hasLocalIntelField)
    ) {
      setCompletedTabs((prev) => ({
        ...prev,
        [currentStepId]: {
          ...(prev[currentStepId] || {}),
          [activeTabId]: true,
        },
      }));
    }

    if (msg) {
      toast.success(msg);
    }

    const currentTabIdx = stepConfig.tabs.findIndex((t) => t.id === activeTabId);
    if (currentTabIdx < stepConfig.tabs.length - 1) {
      setActiveTabId(stepConfig.tabs[currentTabIdx + 1].id);
    } else {
      // Completed all tabs of this step, show submit/proceed modal
      setShowSubmittedModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex justify-center items-center font-sans p-4">

      {/* ── Submission Success Modal ── */}
      {showSubmittedModal && (
        <UploadSubmittedModal

          title={`${STEP_TABS_CONFIG[currentStepId]?.label || ""} Submitted`}
          description={
            currentStepId === "local-intelligence" ? (
              "Proceed to upload the land"
            ) : (
              <>
                Proceed With <span className="text-[#0052cc] hover:underline cursor-pointer" onClick={() => setShowSubmittedModal(false)}>{`'${STEP_TABS_CONFIG[STEP_ORDER[STEP_ORDER.indexOf(currentStepId) + 1]]?.label || ""}'`}</span> for further uploading
              </>
            )
          }
          onProceed={() => {
            setShowSubmittedModal(false);
            if (currentStepId === "local-intelligence") {
              navigate("/super-admin/dashboard");
            } else {
              handleNextStep();
            }
          }}
          onDismiss={() => setShowSubmittedModal(false)}
        />
      )}

      {/* ── Success Modal ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="box-sizing-border-box bg-white border border-[rgba(0,0,0,0.2)] shadow-[0px_0px_12.5px_rgba(0,0,0,0.15)] rounded-[24px] flex flex-col items-center justify-between p-8 relative animate-in zoom-in-95 duration-200"
            style={{
              width: "clamp(17.97rem, 37.43vw, 33.6875rem)",
              height: "clamp(16.5rem, 34.38vw, 30.9375rem)",
            }}
          >
            <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[clamp(0.8rem,1.67vw,1.5rem)] text-black text-center mt-2">
              Farmland Upload Completed
            </h3>

            {/* Large Checkmark Badge */}
            <div className="relative flex items-center justify-center w-[clamp(6rem,12.5vw,11.25rem)] h-[clamp(6rem,12.5vw,11.25rem)] bg-[#2A3008]/[0.08] rounded-full shrink-0">
              <div className="w-[clamp(4.2rem,8.75vw,7.875rem)] h-[clamp(4.2rem,8.75vw,7.875rem)] flex items-center justify-center">
                <svg className="w-full h-full text-[#BDD327]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-13 5l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
            </div>

            <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[clamp(0.58rem,1.2vw,1.25rem)] leading-snug text-[#3D4949] text-center max-w-[320px]">
              All pipeline documents for <span className="text-[#0052cc]">{targetId}</span> have been successfully uploaded!
            </span>

            <button
              type="button"
              onClick={() => navigate("/super-admin/dashboard")}
              className="flex items-center justify-center text-white rounded-[57px] shadow-lg hover:scale-105 active:scale-95 cursor-pointer font-['Plus_Jakarta_Sans'] font-normal w-[clamp(13.27rem,27.64vw,24.875rem)] h-[clamp(1.87rem,3.89vw,3.5rem)] shrink-0 mb-2"
              style={{
                background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)"
              }}
            >
              <span className="font-['Plus_Jakarta_Sans'] font-normal text-white text-[clamp(0.6rem,1.25vw,1.125rem)]">
                Go to Dashboard
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Main Canvas Container (matches Figma design canvas scaled fluidly using clamp all the way to 1920px) */}
      <div
        className="relative bg-[#F2F2F2] rounded-[2rem] overflow-hidden shadow-[0px_20px_40px_rgba(0,0,0,0.02)] w-full max-w-[120rem]"
        style={{
          height: activeTabId === "survey-report"
            ? (surveyReportTypeStore[targetId] === "both"
                ? "clamp(93rem, 47rem + 71.8vw, 133rem)"
                : "clamp(72.5rem, 27rem + 71vw, 112.5rem)")
            : "clamp(36.13rem, 75.27vw, 90.3rem)",
        }}
      >
        {/* Top Header - Back Button (Frame 1171277099) */}
        <BackButton
          onClick={handleGoBack}
          label="Go back to dashboard"
          style={{
            position: "absolute",
            left: "clamp(1.33rem, 2.78vw, 3.33rem)", // 40px base -> 28.4px min to 53.3px max
            top: "clamp(1.07rem, 2.22vw, 2.67rem)", // 32px base -> 22.7px min to 42.7px max
            zIndex: 10,
          }}
        />

        {/* Top Header - Bell & Avatar (Frame 2147239620) */}
        <UploadProfileAvatar
          style={{
            position: "absolute",
            right: "clamp(1.33rem, 2.78vw, 3.33rem)", // 40px base -> 28.4px min to 53.3px max
            top: "clamp(1.13rem, 2.36vw, 2.83rem)", // 34px base -> 24.2px min to 45.3px max
          }}
        />

        {/* Left Column: Short Timeline Sidebar (Table) */}
        <UploadShortTimelineSidebar
          farmlandId={targetId}
          activeStep={currentStepId}
          style={{
            position: "absolute",
            left: "clamp(1.33rem, 2.78vw, 3.33rem)", // 40px base -> 28.4px min to 53.3px max
            top: "clamp(4rem, 8.33vw, 10rem)", // 120px base -> 85.3px min to 160px max
            width: "clamp(13.67rem, 28.47vw, 34.16rem)", // 410px base -> 291.5px min to 546.6px max
            height: "clamp(14.76rem, 30.76vw, 36.9rem)", // 443px base -> 315px min to 590.6px max
            background: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "none",
            border: "none",
          }}
        />

        {/* Right Column: Sub-Tabs Selector Card (Table) */}
        <UploadDocumentsTabsCard
          tabs={stepConfig?.tabs || []}
          activeTabId={activeTabId}
          onTabSelect={handleTabSelect}
          isTabComplete={isTabComplete}
          style={{
            position: "absolute",
            left: "clamp(15.53rem, 32.36vw, 38.8rem)", // 466px base -> 331.4px min to 621.3px max
            right: "clamp(1.33rem, 2.78vw, 3.33rem)", // 40px base -> 28.4px min to 53.3px max
            width: "auto",
            top: "clamp(3.8rem, 7.92vw, 9.5rem)", // 114px base -> 81px min to 152px max
            height: "clamp(14.76rem, 30.76vw, 36.9rem)", // 443px base -> 315px min to 590.6px max
            background: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "none",
          }}
        />

        {/* Bottom Section: Upload & Comments Card (Table) */}
        <UploadFilesDocument
          className="upload-files-card"
          activeTabLabel={activeTabLabel}
          uploadedFiles={currentTabFiles}
          commentValue={currentTabComment}
          onCommentChange={handleCommentChange}
          onFileUpload={addFiles}
          onFileDelete={deleteFile}
          onPrevTab={handlePrevTab}
          onNextTab={handleNextTab}
          isFinishStep={currentStepId === "local-intelligence" && activeTabId === stepConfig?.tabs[stepConfig.tabs.length - 1]?.id}
          selectedSoilType={soilTypeStore[targetId] || "Red Soil"}
          onSoilTypeChange={(val) => {
            setSoilTypeStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          selectedCropType={cropTypeStore[targetId] || "Paddy"}
          onCropTypeChange={(val) => {
            setCropTypeStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          waterLevelValue={waterLevelStore[targetId] || ""}
          onWaterLevelChange={(val) => {
            setWaterLevelStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          selectedFutureCrops={futureCropsStore[targetId] || ""}
          onFutureCropsChange={(val) => {
            setFutureCropsStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          yieldCostValue={yieldCostStore[targetId] || ""}
          onYieldCostChange={(val) => {
            setYieldCostStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          yieldReturnsValue={yieldReturnsStore[targetId] || ""}
          onYieldReturnsChange={(val) => {
            setYieldReturnsStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          cultivationTypeValue={cultivationTypeStore[targetId] || "Self"}
          onCultivationTypeChange={(val) => {
            setCultivationTypeStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          cultivationNameValue={cultivationNameStore[targetId] || ""}
          onCultivationNameChange={(val) => {
            setCultivationNameStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          cultivationContactValue={cultivationContactStore[targetId] || ""}
          onCultivationContactChange={(val) => {
            setCultivationContactStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          maintenanceCropValue={maintenanceCropStore[targetId] || ""}
          onMaintenanceCropChange={(val) => {
            setMaintenanceCropStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          maintenanceReturnsValue={maintenanceReturnsStore[targetId] || ""}
          onMaintenanceReturnsChange={(val) => {
            setMaintenanceReturnsStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          advantagesValue={advantagesStore[targetId] || ""}
          onAdvantagesChange={(val) => {
            setAdvantagesStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          disadvantagesValue={disadvantagesStore[targetId] || ""}
          onDisadvantagesChange={(val) => {
            setDisadvantagesStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          landShapeValue={landShapeStore[targetId] || ""}
          onLandShapeChange={(val) => {
            setLandShapeStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          facilityAvailabilityValue={facilityAvailabilityStore[targetId] || ""}
          onFacilityAvailabilityChange={(val) => {
            setFacilityAvailabilityStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          waterFacilityValue={waterFacilityTypeStore[targetId] || ""}
          onWaterFacilityChange={(val) => {
            setWaterFacilityTypeStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          electricityFacilityValue={electricityFacilityTypeStore[targetId] || ""}
          onElectricityFacilityChange={(val) => {
            setElectricityFacilityTypeStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          treesAvailabilityValue={treesAvailabilityStore[targetId] || ""}
          onTreesAvailabilityChange={(val) => {
            setTreesAvailabilityStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          treesCountValue={treesCountStore[targetId] || ""}
          onTreesCountChange={(val) => {
            setTreesCountStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          surveyReportTypeValue={surveyReportTypeStore[targetId] || "private"}
          onSurveyReportTypeChange={(val) => {
            setSurveyReportTypeStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          privateSurveyFiles={privateSurveyFilesStore[targetId] || []}
          onPrivateSurveyFileUpload={addPrivateSurveyFiles}
          onPrivateSurveyFileDelete={deletePrivateSurveyFile}
          governmentSurveyFiles={governmentSurveyFilesStore[targetId] || []}
          onGovernmentSurveyFileUpload={addGovtSurveyFiles}
          onGovernmentSurveyFileDelete={deleteGovtSurveyFile}
          privateSurveyCommentValue={privateSurveyCommentStore[targetId] || ""}
          onPrivateSurveyCommentChange={(val) => {
            setPrivateSurveyCommentStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          governmentSurveyCommentValue={governmentSurveyCommentStore[targetId] || ""}
          onGovernmentSurveyCommentChange={(val) => {
            setGovernmentSurveyCommentStore((prev) => ({
              ...prev,
              [targetId]: val,
            }));
          }}
          boundaryTypeValue={boundaryTypeStore[targetId]?.[activeTabId] || ""}
          onBoundaryTypeChange={(val) => {
            setBoundaryTypeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          boundaryOwnerNameValue={boundaryOwnerNameStore[targetId]?.[activeTabId] || ""}
          onBoundaryOwnerNameChange={(val) => {
            setBoundaryOwnerNameStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          boundaryOwnerAgeValue={boundaryOwnerAgeStore[targetId]?.[activeTabId] || ""}
          onBoundaryOwnerAgeChange={(val) => {
            setBoundaryOwnerAgeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          boundaryRoadTypeValue={boundaryRoadTypeStore[targetId]?.[activeTabId] || ""}
          onBoundaryRoadTypeChange={(val) => {
            setBoundaryRoadTypeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          boundaryRoadWidthValue={boundaryRoadWidthStore[targetId]?.[activeTabId] || ""}
          onBoundaryRoadWidthChange={(val) => {
            setBoundaryRoadWidthStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          boundaryTreesCountValue={boundaryTreesCountStore[targetId]?.[activeTabId] || ""}
          onBoundaryTreesCountChange={(val) => {
            setBoundaryTreesCountStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          recentTransactionTypeValue={recentTransactionTypeStore[targetId]?.[activeTabId] || ""}
          onRecentTransactionTypeChange={(val) => {
            setRecentTransactionTypeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          valuationPerAcreValue={valuationPerAcreStore[targetId]?.[activeTabId] || ""}
          onValuationPerAcreChange={(val) => {
            setValuationPerAcreStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          localMarketPriceValue={localMarketPriceStore[targetId]?.[activeTabId] || ""}
          onLocalMarketPriceChange={(val) => {
            setLocalMarketPriceStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          geologicalAdvantagesTypeValue={geologicalAdvantagesTypeStore[targetId]?.[activeTabId] || ""}
          onGeologicalAdvantagesTypeChange={(val) => {
            setGeologicalAdvantagesTypeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          upcomingInfrastructuresValue={upcomingInfrastructuresStore[targetId]?.[activeTabId] || ""}
          onUpcomingInfrastructuresChange={(val) => {
            setUpcomingInfrastructuresStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          railwayConnectivityTypeValue={railwayConnectivityTypeStore[targetId]?.[activeTabId] || ""}
          onRailwayConnectivityTypeChange={(val) => {
            setRailwayConnectivityTypeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          railwayDistanceValue={railwayDistanceStore[targetId]?.[activeTabId] || ""}
          onRailwayDistanceChange={(val) => {
            setRailwayDistanceStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          airportConnectivityTypeValue={airportConnectivityTypeStore[targetId]?.[activeTabId] || ""}
          onAirportConnectivityTypeChange={(val) => {
            setAirportConnectivityTypeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          airportDistanceValue={airportDistanceStore[targetId]?.[activeTabId] || ""}
          onAirportDistanceChange={(val) => {
            setAirportDistanceStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          anyIssuesTypeValue={anyIssuesTypeStore[targetId]?.[activeTabId] || ""}
          onAnyIssuesTypeChange={(val) => {
            setAnyIssuesTypeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          localLiabilitiesTypeValue={localLiabilitiesTypeStore[targetId]?.[activeTabId] || ""}
          onLocalLiabilitiesTypeChange={(val) => {
            setLocalLiabilitiesTypeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          pendingLoansTypeValue={pendingLoansTypeStore[targetId]?.[activeTabId] || ""}
          onPendingLoansTypeChange={(val) => {
            setPendingLoansTypeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          pendingLoansAmountValue={pendingLoansAmountStore[targetId]?.[activeTabId] || ""}
          onPendingLoansAmountChange={(val) => {
            setPendingLoansAmountStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          ownerMindsetValue={ownerMindsetStore[targetId]?.[activeTabId] || ""}
          onOwnerMindsetChange={(val) => {
            setOwnerMindsetStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          sourcePersonTypeValue={sourcePersonTypeStore[targetId]?.[activeTabId] || ""}
          onSourcePersonTypeChange={(val) => {
            setSourcePersonTypeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          sourcePersonNameValue={sourcePersonNameStore[targetId]?.[activeTabId] || ""}
          onSourcePersonNameChange={(val) => {
            setSourcePersonNameStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          sourcePersonMobileValue={sourcePersonMobileStore[targetId]?.[activeTabId] || ""}
          onSourcePersonMobileChange={(val) => {
            setSourcePersonMobileStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          agreementPaperValue={agreementPaperStore[targetId]?.[activeTabId] || ""}
          onAgreementPaperChange={(val) => {
            setAgreementPaperStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          agreementTypeValue={agreementTypeStore[targetId]?.[activeTabId] || ""}
          onAgreementTypeChange={(val) => {
            setAgreementTypeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          agreementPriceValue={agreementPriceStore[targetId]?.[activeTabId] || ""}
          onAgreementPriceChange={(val) => {
            setAgreementPriceStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          prevTransactionsTypeValue={prevTransactionsTypeStore[targetId]?.[activeTabId] || ""}
          onPrevTransactionsTypeChange={(val) => {
            setPrevTransactionsTypeStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
          prevTransactionsPriceValue={prevTransactionsPriceStore[targetId]?.[activeTabId] || ""}
          onPrevTransactionsPriceChange={(val) => {
            setPrevTransactionsPriceStore((prev) => ({
              ...prev,
              [targetId]: {
                ...(prev[targetId] || {}),
                [activeTabId]: val,
              },
            }));
          }}
        />

        {/* Toast Notification: Frame 2147239854 */}
        {showToast && toastMessage && (
          <div
            className="animate-in fade-in slide-in-from-bottom-5 duration-300 select-none"
            style={{
              boxSizing: "border-box",
              position: "absolute",
              width: "clamp(14.8rem, 30.83vw, 37.0rem)", // 444px
              height: "clamp(2.67rem, 5.56vw, 6.67rem)", // 80px
              right: "clamp(1.33rem, 2.78vw, 3.33rem)", // 40px
              bottom: "clamp(1rem, 2.08vw, 2.5rem)", // 30px
              background: "#FFFFFF",
              border: "1px solid #CBDBAF",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 clamp(0.8rem, 1.67vw, 2.0rem)", // 24px
              zIndex: 100,
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Frame 2147239855 (Logo + Message) */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "clamp(0.33rem, 0.69vw, 0.83rem)", // 10px
              }}
            >
              {/* Green checkmark badge */}
              <div
                style={{
                  width: "clamp(1.07rem, 2.22vw, 2.67rem)", // 32px
                  height: "clamp(1.07rem, 2.22vw, 2.67rem)",
                  borderRadius: "50%",
                  background: "#2D3509",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    width: "clamp(0.53rem, 1.11vw, 1.33rem)", // 16px
                    height: "clamp(0.53rem, 1.11vw, 1.33rem)",
                    color: "#FFFFFF",
                  }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              {/* Toast Message Text */}
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(0.53rem, 1.11vw, 1.33rem)", // 16px
                  lineHeight: "clamp(0.8rem, 1.67vw, 2.0rem)", // 24px
                  color: "#000000",
                }}
              >
                {toastMessage}
              </span>
            </div>

            {/* Close Button: basil:cross-solid */}
            <button
              type="button"
              onClick={() => setShowToast(false)}
              style={{
                width: "clamp(1rem, 2.08vw, 2.5rem)", // 30px
                height: "clamp(1rem, 2.08vw, 2.5rem)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  width: "clamp(0.5rem, 1.04vw, 1.25rem)", // 15px
                  height: "clamp(0.5rem, 1.04vw, 1.25rem)",
                  color: "#000000",
                }}
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default LegalUploadDocument;


