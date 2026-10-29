import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import UploadDocumentsTabsCard from "../components/UploadDocumentsTabsCard";
import UploadFilesDocument from "../components/UploadFilesDocument";
import { UploadSubmittedModal } from "../components/UploadSubmittedModal";
import { landAndBoundariesService } from "../../../api/landAndBoundaries.api";
import {
  useSaveRoadApproachMutation,
  useSaveRecentTransactionsMutation,
  useSaveGeologicalAdvantagesMutation,
  useSaveFuturePlansMutation,
  useSaveValidatingDisadvantagesMutation,
  useSaveUpcomingInfrastructureMutation,
  useSaveRailwayConnectivityMutation,
  useSaveAirportConnectivityMutation,
  useGetValuationStatusQuery,
} from "../../../api/valuation.api";
import { fileService } from "../../../api/file.api";

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  url?: string;
  status: "uploading" | "completed";
  imageType?: "cover" | "land";
  fileData?: File;
}

const TABS = [
  { id: "village-map-or-naksha", label: "Village Map or Naksha" },
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
];

const getDocTypeCode = (tabId: string) => {
  const map: Record<string, string> = {
    "village-map-or-naksha": "VMNAP",
    "sub-register-value": "SUBRV",
    "valuator-report": "VALRP",
    "legal-opinion-report": "LEGOP",
    "road-approach": "RDAPR",
    "recent-transactions": "RCTRN",
    "geological-advantages": "GEOAD",
    "future-plans": "FPLAN",
    "validating-disadvantages": "VALDS",
    "upcoming-infrastructures": "UPINF",
    "railway-track-connectivity": "HWCON",
    "airport-connectivity": "AIRPT",
  };
  return map[tabId] || tabId;
};

const getDocTypeDesc = (tabId: string) => {
  const map: Record<string, string> = {
    "village-map-or-naksha": "village_map_or_naksha",
    "sub-register-value": "sub_registrar_value",
    "valuator-report": "valuator_report",
    "legal-opinion-report": "legal_opinion_report",
    "road-approach": "road_approach",
    "recent-transactions": "recent_transaction",
    "geological-advantages": "geological_advantages",
    "future-plans": "future_plan",
    "validating-disadvantages": "validating_disadvantages",
    "upcoming-infrastructures": "upcoming_infrastructure",
    "railway-track-connectivity": "railway_truck_connectivity",
    "airport-connectivity": "airport_connectivity",
  };
  return map[tabId] || tabId.replace(/-/g, "_");
};

export const UploadValuation: React.FC = () => {
  const { farmlandId, onNextStep } = useOutletContext<{ farmlandId: string; onNextStep: () => void }>();
  
  const [uploadDoc] = landAndBoundariesService.useUploadLandAndBoundariesDocMutation();
  const [uploadS3] = fileService.useUploadS3FileMutation();
  const [saveRoadApproach] = useSaveRoadApproachMutation();
  const [saveRecentTransactions] = useSaveRecentTransactionsMutation();
  const [saveGeologicalAdvantages] = useSaveGeologicalAdvantagesMutation();
  const [saveFuturePlans] = useSaveFuturePlansMutation();
  const [saveValidatingDisadvantages] = useSaveValidatingDisadvantagesMutation();
  const [saveUpcomingInfrastructure] = useSaveUpcomingInfrastructureMutation();
  const [saveRailwayConnectivity] = useSaveRailwayConnectivityMutation();
  const [saveAirportConnectivity] = useSaveAirportConnectivityMutation();
  
  const { data: statusResponse, refetch: refetchStatus } = useGetValuationStatusQuery({ farmlandId: Number(farmlandId) }, { skip: !farmlandId });
  
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);
  const [uploadedStore, setUploadedStore] = useState<Record<string, UploadedFileItem[]>>({});
  const [commentsStore, setCommentsStore] = useState<Record<string, string>>({});
  const [completedTabs, setCompletedTabs] = useState<Record<string, boolean>>({});
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  
  
  const [isUploading, setIsUploading] = useState(false);

  // Valuation specific states (keyed by activeTabId)
  const [recentTransactionTypeStore, setRecentTransactionTypeStore] = useState<Record<string, string>>({});
  const [valuationPerAcreStore, setValuationPerAcreStore] = useState<Record<string, string>>({});
  const [localMarketPriceStore, setLocalMarketPriceStore] = useState<Record<string, string>>({});
  const [geologicalAdvantagesTypeStore, setGeologicalAdvantagesTypeStore] = useState<Record<string, string>>({});
  const [upcomingInfrastructuresStore, setUpcomingInfrastructuresStore] = useState<Record<string, string>>({});
  const [railwayConnectivityTypeStore, setRailwayConnectivityTypeStore] = useState<Record<string, string>>({});
  const [railwayDistanceStore, setRailwayDistanceStore] = useState<Record<string, string>>({});
  const [airportConnectivityTypeStore, setAirportConnectivityTypeStore] = useState<Record<string, string>>({});
  const [airportDistanceStore, setAirportDistanceStore] = useState<Record<string, string>>({});
  
  // Boundary road properties used in "road-approach"
  const [boundaryRoadTypeStore, setBoundaryRoadTypeStore] = useState<Record<string, string>>({});
  const [boundaryRoadWidthStore, setBoundaryRoadWidthStore] = useState<Record<string, string>>({});



  useEffect(() => {
    if (statusResponse?.success && statusResponse?.data) {
      const data = statusResponse.data;
      const newCompleted: Record<string, boolean> = {};
      const newComments: Record<string, string> = {};
      const newUploadedStore: Record<string, UploadedFileItem[]> = {};
      
      const newRecentTransactionTypeStore: Record<string, string> = {};
      const newValuationPerAcreStore: Record<string, string> = {};
      const newLocalMarketPriceStore: Record<string, string> = {};
      const newGeologicalAdvantagesTypeStore: Record<string, string> = {};
      const newUpcomingInfrastructuresStore: Record<string, string> = {};
      const newRailwayConnectivityTypeStore: Record<string, string> = {};
      const newRailwayDistanceStore: Record<string, string> = {};
      const newAirportConnectivityTypeStore: Record<string, string> = {};
      const newAirportDistanceStore: Record<string, string> = {};
      const newBoundaryRoadTypeStore: Record<string, string> = {};
      const newBoundaryRoadWidthStore: Record<string, string> = {};

      const mapFiles = (filesArray: any[]): UploadedFileItem[] => {
        if (!filesArray) return [];
        return filesArray.map((f: any) => ({
          id: `backend-${f.id}`,
          name: f.document_url?.split('/').pop() || f.document_url,
          url: f.document_url,
          size: "-",
          progress: 100,
          status: "completed",
        }));
      };

      const findDocByDesc = (desc: string) => Object.values(data).find((d: any) => d.description === desc);

      TABS.forEach(tab => {
        const desc = getDocTypeDesc(tab.id);
        const doc: any = findDocByDesc(desc);
        
        if (doc?.uploaded) {
          newCompleted[tab.id] = true;
          const v = doc.versions?.[0];
          if (v) {
            if (v.remarks) newComments[tab.id] = v.remarks;
            if (v.files?.length) newUploadedStore[tab.id] = mapFiles(v.files);
            
            if (tab.id === "road-approach") {
              if (v.is_private === 1) newBoundaryRoadTypeStore[tab.id] = "Private Road";
              else if (v.is_governament === 1) newBoundaryRoadTypeStore[tab.id] = "Government Road";
              if (v.road_width) newBoundaryRoadWidthStore[tab.id] = v.road_width.toString();
            } else if (tab.id === "recent-transactions") {
              if (v.is_transactions_available === 1) newRecentTransactionTypeStore[tab.id] = "Available";
              else if (v.is_transactions_available === 0) newRecentTransactionTypeStore[tab.id] = "Not Available";
              if (v.valuation_per_acre) newValuationPerAcreStore[tab.id] = v.valuation_per_acre.toString();
              if (v.local_market_acre_price) newLocalMarketPriceStore[tab.id] = v.local_market_acre_price.toString();
            } else if (tab.id === "geological-advantages") {
              if (v.is_geological_advantage_available === 1) newGeologicalAdvantagesTypeStore[tab.id] = "Available";
              else if (v.is_geological_advantage_available === 0) newGeologicalAdvantagesTypeStore[tab.id] = "Not Available";
            } else if (tab.id === "upcoming-infrastructures") {
              if (v.infrastructure_id === 1) newUpcomingInfrastructuresStore[tab.id] = "Highway";
              else if (v.infrastructure_id === 2) newUpcomingInfrastructuresStore[tab.id] = "Metro";
              else if (v.infrastructure_id === 3) newUpcomingInfrastructuresStore[tab.id] = "Airport";
            } else if (tab.id === "railway-track-connectivity") {
              if (v.is_railway_connectivity_available === 1) newRailwayConnectivityTypeStore[tab.id] = "Available";
              else if (v.is_railway_connectivity_available === 0) newRailwayConnectivityTypeStore[tab.id] = "Not Available";
              if (v.distance_id === 1) newRailwayDistanceStore[tab.id] = "0-5km";
              else if (v.distance_id === 2) newRailwayDistanceStore[tab.id] = "5-10km";
              else if (v.distance_id === 3) newRailwayDistanceStore[tab.id] = "10+km";
            } else if (tab.id === "airport-connectivity") {
              if (v.is_airport_connectivity_available === 1) newAirportConnectivityTypeStore[tab.id] = "Available";
              else if (v.is_airport_connectivity_available === 0) newAirportConnectivityTypeStore[tab.id] = "Not Available";
              if (v.distance_id === 1) newAirportDistanceStore[tab.id] = "0-5km";
              else if (v.distance_id === 2) newAirportDistanceStore[tab.id] = "5-10km";
              else if (v.distance_id === 3) newAirportDistanceStore[tab.id] = "10+km";
            }
          }
        }
      });
      
      setCompletedTabs(newCompleted);
      setCommentsStore(prev => ({ ...prev, ...newComments }));
      setUploadedStore(prev => ({ ...prev, ...newUploadedStore }));
      if (Object.keys(newRecentTransactionTypeStore).length > 0) setRecentTransactionTypeStore(prev => ({ ...prev, ...newRecentTransactionTypeStore }));
      if (Object.keys(newValuationPerAcreStore).length > 0) setValuationPerAcreStore(prev => ({ ...prev, ...newValuationPerAcreStore }));
      if (Object.keys(newLocalMarketPriceStore).length > 0) setLocalMarketPriceStore(prev => ({ ...prev, ...newLocalMarketPriceStore }));
      if (Object.keys(newGeologicalAdvantagesTypeStore).length > 0) setGeologicalAdvantagesTypeStore(prev => ({ ...prev, ...newGeologicalAdvantagesTypeStore }));
      if (Object.keys(newUpcomingInfrastructuresStore).length > 0) setUpcomingInfrastructuresStore(prev => ({ ...prev, ...newUpcomingInfrastructuresStore }));
      if (Object.keys(newRailwayConnectivityTypeStore).length > 0) setRailwayConnectivityTypeStore(prev => ({ ...prev, ...newRailwayConnectivityTypeStore }));
      if (Object.keys(newRailwayDistanceStore).length > 0) setRailwayDistanceStore(prev => ({ ...prev, ...newRailwayDistanceStore }));
      if (Object.keys(newAirportConnectivityTypeStore).length > 0) setAirportConnectivityTypeStore(prev => ({ ...prev, ...newAirportConnectivityTypeStore }));
      if (Object.keys(newAirportDistanceStore).length > 0) setAirportDistanceStore(prev => ({ ...prev, ...newAirportDistanceStore }));
      if (Object.keys(newBoundaryRoadTypeStore).length > 0) setBoundaryRoadTypeStore(prev => ({ ...prev, ...newBoundaryRoadTypeStore }));
      if (Object.keys(newBoundaryRoadWidthStore).length > 0) setBoundaryRoadWidthStore(prev => ({ ...prev, ...newBoundaryRoadWidthStore }));
    }
  }, [statusResponse]);

  const activeTabLabel = TABS.find((t) => t.id === activeTabId)?.label || "";
  const currentTabFiles = uploadedStore[activeTabId] || [];
  const currentTabComment = commentsStore[activeTabId] || "";

  const isTabComplete = (tabId: string) => !!completedTabs[tabId];

  const handleTabSelect = (newTabId: string) => {
    setActiveTabId(newTabId);
  };

  const addFiles = (fileList: FileList, imageType?: "cover" | "land") => {
    const newFiles: UploadedFileItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
      newFiles.push({ id: Date.now().toString() + i, name: file.name, size: sizeStr, progress: 0, status: "uploading", imageType, fileData: file });
    }

    setUploadedStore((prev) => ({
      ...prev,
      [activeTabId]: [...(prev[activeTabId] || []), ...newFiles],
    }));

    newFiles.forEach((file) => simulateUpload(file.id, setUploadedStore));
  };

  const simulateUpload = (fileId: string, setStore: any) => {
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += Math.floor(Math.random() * 25) + 15;
      if (progressVal >= 100) {
        progressVal = 100;
        clearInterval(interval);
        setStore((prev: any) => ({
          ...prev,
          [activeTabId]: (prev[activeTabId] || []).map((f: any) => f.id === fileId ? { ...f, progress: 100, status: "completed" } : f),
        }));
      } else {
        setStore((prev: any) => ({
          ...prev,
          [activeTabId]: (prev[activeTabId] || []).map((f: any) => f.id === fileId ? { ...f, progress: progressVal } : f),
        }));
      }
    }, 300);
  };

  const deleteFile = (fileId: string) => {
    setUploadedStore((prev) => ({
      ...prev,
      [activeTabId]: (prev[activeTabId] || []).filter((f) => f.id !== fileId),
    }));
  };

  const handleCommentChange = (val: string) => {
    setCommentsStore((prev) => ({ ...prev, [activeTabId]: val }));
  };

  const handlePrevTab = () => {
    const currentTabIdx = TABS.findIndex((t) => t.id === activeTabId);
    if (currentTabIdx > 0) setActiveTabId(TABS[currentTabIdx - 1].id);
  };

  const handleNextTab = async () => {
    setIsUploading(true);
    try {
      const activeData = { farmlandId: Number(farmlandId), remarks: currentTabComment, version: "1.0", docType: getDocTypeCode(activeTabId) };
      const hasFiles = currentTabFiles.length > 0;
      
      switch (activeTabId) {
        case "village-map-or-naksha":
        case "sub-register-value":
        case "valuator-report":
        case "legal-opinion-report":
          if (hasFiles) {
            const keys = [];
            for (const fileItem of currentTabFiles) {
              if (fileItem.fileData) {
                const formData = new FormData();
                formData.append("file", fileItem.fileData);
                const cleanFileName = fileItem.fileData.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const fileKey = `farmlands/${Number(farmlandId)}/${activeData.docType}/${Number(farmlandId)}_${cleanFileName}`;
                formData.append("key", fileKey);
                await uploadS3(formData).unwrap();
                keys.push(fileKey);
              } else if (fileItem.id.startsWith("backend-")) {
                keys.push(fileItem.url || fileItem.name);
              }
            }
            if (keys.length > 0) {
              await uploadDoc({ ...activeData, documentUrls: keys }).unwrap();
            }
          }
          break;
        case "road-approach":
          await saveRoadApproach({
            ...activeData,
            version: "1",
            is_private: boundaryRoadTypeStore[activeTabId] === "Private Road" ? 1 : 0,
            is_governament: boundaryRoadTypeStore[activeTabId] === "Government Road" ? 1 : 0,
            road_width: Number(boundaryRoadWidthStore[activeTabId]) || 0
          }).unwrap();
          break;
        case "recent-transactions":
          await saveRecentTransactions({
            ...activeData,
            is_transactions_available: recentTransactionTypeStore[activeTabId] === "Available" ? 1 : 0,
            valuation_per_acre: valuationPerAcreStore[activeTabId] || "0",
            local_market_acre_price: localMarketPriceStore[activeTabId] || "0"
          }).unwrap();
          break;
        case "geological-advantages":
          await saveGeologicalAdvantages({
            ...activeData,
            is_geological_advantage_available: geologicalAdvantagesTypeStore[activeTabId] === "Available" ? 1 : 0
          }).unwrap();
          break;
        case "future-plans":
          await saveFuturePlans({ ...activeData }).unwrap();
          break;
        case "validating-disadvantages":
          await saveValidatingDisadvantages({ ...activeData }).unwrap();
          break;
        case "upcoming-infrastructures":
          await saveUpcomingInfrastructure({
            ...activeData,
            infrastructure_id: upcomingInfrastructuresStore[activeTabId] === "Highway" ? 1 : upcomingInfrastructuresStore[activeTabId] === "Metro" ? 2 : 3
          }).unwrap();
          break;
        case "railway-track-connectivity":
          await saveRailwayConnectivity({
            ...activeData,
            is_railway_connectivity_available: railwayConnectivityTypeStore[activeTabId] === "Available" ? 1 : 0,
            distance_id: railwayDistanceStore[activeTabId] === "0-5km" ? 1 : railwayDistanceStore[activeTabId] === "5-10km" ? 2 : 3
          }).unwrap();
          break;
        case "airport-connectivity":
          await saveAirportConnectivity({
            ...activeData,
            is_airport_connectivity_available: airportConnectivityTypeStore[activeTabId] === "Available" ? 1 : 0,
            distance_id: airportDistanceStore[activeTabId] === "0-5km" ? 1 : airportDistanceStore[activeTabId] === "5-10km" ? 2 : 3
          }).unwrap();
          break;
      }
      
      refetchStatus();
      toast.success(`${activeTabLabel} details have been saved`);

      const currentTabIdx = TABS.findIndex((t) => t.id === activeTabId);
      if (currentTabIdx < TABS.length - 1) {
        setActiveTabId(TABS[currentTabIdx + 1].id);
      } else {
        setShowSubmittedModal(true);
      }
    } catch (error) {
      console.error("Failed to save valuation details", error);
      toast.error("Failed to save valuation details");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <UploadDocumentsTabsCard
        tabs={TABS}
        activeTabId={activeTabId}
        onTabSelect={handleTabSelect}
        isTabComplete={isTabComplete}
        className="w-[320px] shrink-0"
      />

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
        isUploading={isUploading}
        
        // Road Approach
        boundaryRoadTypeValue={boundaryRoadTypeStore[activeTabId] || ""}
        onBoundaryRoadTypeChange={(v) => setBoundaryRoadTypeStore(p => ({ ...p, [activeTabId]: v }))}
        boundaryRoadWidthValue={boundaryRoadWidthStore[activeTabId] || ""}
        onBoundaryRoadWidthChange={(v) => setBoundaryRoadWidthStore(p => ({ ...p, [activeTabId]: v }))}

        // Valuation Specific Props
        recentTransactionTypeValue={recentTransactionTypeStore[activeTabId] || ""}
        onRecentTransactionTypeChange={(v) => setRecentTransactionTypeStore(p => ({ ...p, [activeTabId]: v }))}
        valuationPerAcreValue={valuationPerAcreStore[activeTabId] || ""}
        onValuationPerAcreChange={(v) => setValuationPerAcreStore(p => ({ ...p, [activeTabId]: v }))}
        localMarketPriceValue={localMarketPriceStore[activeTabId] || ""}
        onLocalMarketPriceChange={(v) => setLocalMarketPriceStore(p => ({ ...p, [activeTabId]: v }))}
        geologicalAdvantagesTypeValue={geologicalAdvantagesTypeStore[activeTabId] || ""}
        onGeologicalAdvantagesTypeChange={(v) => setGeologicalAdvantagesTypeStore(p => ({ ...p, [activeTabId]: v }))}
        upcomingInfrastructuresValue={upcomingInfrastructuresStore[activeTabId] || ""}
        onUpcomingInfrastructuresChange={(v) => setUpcomingInfrastructuresStore(p => ({ ...p, [activeTabId]: v }))}
        railwayConnectivityTypeValue={railwayConnectivityTypeStore[activeTabId] || ""}
        onRailwayConnectivityTypeChange={(v) => setRailwayConnectivityTypeStore(p => ({ ...p, [activeTabId]: v }))}
        railwayDistanceValue={railwayDistanceStore[activeTabId] || ""}
        onRailwayDistanceChange={(v) => setRailwayDistanceStore(p => ({ ...p, [activeTabId]: v }))}
        airportConnectivityTypeValue={airportConnectivityTypeStore[activeTabId] || ""}
        onAirportConnectivityTypeChange={(v) => setAirportConnectivityTypeStore(p => ({ ...p, [activeTabId]: v }))}
        airportDistanceValue={airportDistanceStore[activeTabId] || ""}
        onAirportDistanceChange={(v) => setAirportDistanceStore(p => ({ ...p, [activeTabId]: v }))}
      />

      

      {showSubmittedModal && (
        <UploadSubmittedModal

          title="Valuation Submitted"
          description={<>Proceed With <span className="text-[#0052cc] hover:underline cursor-pointer" onClick={() => setShowSubmittedModal(false)}>'Local Intelligence'</span> for further uploading</>}
          onProceed={() => {
            setShowSubmittedModal(false);
            onNextStep();
          }}
          onDismiss={() => setShowSubmittedModal(false)}
        />
      )}
    </>
  );
};

export default UploadValuation;
