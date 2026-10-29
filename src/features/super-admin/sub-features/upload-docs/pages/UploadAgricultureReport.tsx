import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import UploadDocumentsTabsCard from "../components/UploadDocumentsTabsCard";
import UploadFilesDocument from "../components/UploadFilesDocument";
import { UploadSubmittedModal } from "../components/UploadSubmittedModal";

import {
  useGetAgricultureReportStatusQuery,
  useSaveSoilMutation,
  useSaveCropTypeMutation,
  useSaveGroundWaterMutation,
  useSaveTypesOfCropCanBeGrownMutation,
  useSaveCurrentCultivationMutation,
  useSaveCurrentYieldMutation,
  useSaveFutureCropsMutation,
  useSaveMaintenanceMutation,
  useSaveAdvantagesDisadvantagesMutation,
  useUploadAgricultureReportDocMutation,
} from "@/features/super-admin/api/agricultureReport.api";
import { useGetAllMasterDataQuery } from "@/features/super-admin/api/masterData.api";
import { useUploadS3FileMutation } from "@/features/super-admin/api/file.api";
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
  { id: "local-agriculture-officer-report", label: "Local Agriculture Officer Report" },
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
];

export const UploadAgricultureReport: React.FC = () => {
  const { farmlandId, onNextStep } = useOutletContext<{ farmlandId: string; onNextStep: () => void }>();
  
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);
  const [uploadedStore, setUploadedStore] = useState<Record<string, UploadedFileItem[]>>({});
  const [commentsStore, setCommentsStore] = useState<Record<string, string>>({});
  const [completedTabs, setCompletedTabs] = useState<Record<string, boolean>>({});
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  
  

  const { data: masterData } = useGetAllMasterDataQuery();

  const [saveSoil] = useSaveSoilMutation();
  const [saveCropType] = useSaveCropTypeMutation();
  const [saveGroundWater] = useSaveGroundWaterMutation();
  const [saveTypesOfCropCanBeGrown] = useSaveTypesOfCropCanBeGrownMutation();
  const [saveCurrentCultivation] = useSaveCurrentCultivationMutation();
  const [saveCurrentYield] = useSaveCurrentYieldMutation();
  const [saveFutureCrops] = useSaveFutureCropsMutation();
  const [saveMaintenance] = useSaveMaintenanceMutation();
  const [saveAdvantagesDisadvantages] = useSaveAdvantagesDisadvantagesMutation();
  const [uploadS3File, { isLoading: isUploading }] = useUploadS3FileMutation();
  const [uploadDoc] = useUploadAgricultureReportDocMutation();

  const { data: statusData, refetch: refetchStatus } = useGetAgricultureReportStatusQuery({ farmlandId }, { skip: !farmlandId });

  // Agriculture specific state
  const [soilType, setSoilType] = useState("Red Soil");
  const [cropType, setCropType] = useState("Paddy");
  const [waterLevel, setWaterLevel] = useState("");
  const [futureCrops, setFutureCrops] = useState("");
  const [yieldCost, setYieldCost] = useState("");
  const [yieldReturns, setYieldReturns] = useState("");
  const [cultivationType, setCultivationType] = useState("Self");
  const [cultivationName, setCultivationName] = useState("");
  const [cultivationContact, setCultivationContact] = useState("");
  const [maintenanceCrop, setMaintenanceCrop] = useState("");
  const [maintenanceReturns, setMaintenanceReturns] = useState("");
  const [advantages, setAdvantages] = useState("");
  const [disadvantages, setDisadvantages] = useState("");



  useEffect(() => {
    if (statusData?.data && masterData) {
      const { farmlandUploadResult, soilTypeResult, cropsResult } = masterData;
      
      const newCommentsStore = { ...commentsStore };
      const newCompletedTabs = { ...completedTabs };
      const newUploadedStore: Record<string, UploadedFileItem[]> = {};

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

      const getIdByCode = (code: string) => farmlandUploadResult?.find((item: any) => item.code === code)?.id;

      const laorpId = getIdByCode("LAORP");
      const laorpStatus = laorpId ? statusData.data[laorpId] : null;
      if (laorpStatus?.uploaded && laorpStatus.versions?.length > 0) {
        if (laorpStatus.versions[0].remarks) newCommentsStore["local-agriculture-officer-report"] = laorpStatus.versions[0].remarks;
        if (laorpStatus.versions[0].files?.length) newUploadedStore["local-agriculture-officer-report"] = mapFiles(laorpStatus.versions[0].files);
        newCompletedTabs["local-agriculture-officer-report"] = true;
      }

      const l5cyrId = getIdByCode("L5CYR");
      const l5cyrStatus = l5cyrId ? statusData.data[l5cyrId] : null;
      if (l5cyrStatus?.uploaded && l5cyrStatus.versions?.length > 0) {
        if (l5cyrStatus.versions[0].remarks) newCommentsStore["last-5-years-crop-yielding"] = l5cyrStatus.versions[0].remarks;
        if (l5cyrStatus.versions[0].files?.length) newUploadedStore["last-5-years-crop-yielding"] = mapFiles(l5cyrStatus.versions[0].files);
        newCompletedTabs["last-5-years-crop-yielding"] = true;
      }

      const soilId = getIdByCode("SOILS");
      const soilStatus = soilId ? statusData.data[soilId] : null;
      if (soilStatus?.uploaded && soilStatus.versions?.length > 0) {
        const v = soilStatus.versions[0];
        if (v.remarks) newCommentsStore["soil"] = v.remarks;
        const soilObj = soilTypeResult?.find((s: any) => s.id === v.soil_type_id);
        if (soilObj) setSoilType(soilObj.description);
        newCompletedTabs["soil"] = true;
      }

      const cropId = getIdByCode("TYCRP");
      const cropStatus = cropId ? statusData.data[cropId] : null;
      if (cropStatus?.uploaded && cropStatus.versions?.length > 0) {
        const v = cropStatus.versions[0];
        if (v.remarks) newCommentsStore["type-of-crop"] = v.remarks;
        const cropObj = cropsResult?.find((c: any) => c.id === v.crop_id);
        if (cropObj) setCropType(cropObj.description);
        newCompletedTabs["type-of-crop"] = true;
      }

      const gwId = getIdByCode("GWLVL");
      const gwStatus = gwId ? statusData.data[gwId] : null;
      if (gwStatus?.uploaded && gwStatus.versions?.length > 0) {
        const v = gwStatus.versions[0];
        if (v.remarks) newCommentsStore["ground-water-level"] = v.remarks;
        if (v.ground_water_level) setWaterLevel(v.ground_water_level);
        newCompletedTabs["ground-water-level"] = true;
      }

      const tccbgId = getIdByCode("TCCBG");
      const tccbgStatus = tccbgId ? statusData.data[tccbgId] : null;
      if (tccbgStatus?.uploaded && tccbgStatus.versions?.length > 0) {
        const v = tccbgStatus.versions[0];
        if (v.remarks) newCommentsStore["types-of-crop-can-be-grown"] = v.remarks;
        if (v.crop_ids && Array.isArray(v.crop_ids)) {
          const cropNames = v.crop_ids.map((id: number) => cropsResult?.find((c: any) => c.id === id)?.description).filter(Boolean);
          if (cropNames.length > 0) setFutureCrops(cropNames.join(", "));
        }
        newCompletedTabs["types-of-crop-can-be-grown"] = true;
      }

      const curydId = getIdByCode("CURYD");
      const curydStatus = curydId ? statusData.data[curydId] : null;
      if (curydStatus?.uploaded && curydStatus.versions?.length > 0) {
        const v = curydStatus.versions[0];
        if (v.remarks) newCommentsStore["current-yield-cost"] = v.remarks;
        if (v.current_yield_cost) setYieldCost(v.current_yield_cost);
        if (v.current_returns) setYieldReturns(v.current_returns);
        newCompletedTabs["current-yield-cost"] = true;
      }

      const curclId = getIdByCode("CURCL");
      const curclStatus = curclId ? statusData.data[curclId] : null;
      if (curclStatus?.uploaded && curclStatus.versions?.length > 0) {
        const v = curclStatus.versions[0];
        if (v.remarks) newCommentsStore["current-cultivation"] = v.remarks;
        if (v.is_lease !== undefined && v.is_lease !== null) setCultivationType(v.is_lease === 0 ? "Self" : "Lease");
        if (v.name) setCultivationName(v.name);
        if (v.contact_number) setCultivationContact(v.contact_number);
        newCompletedTabs["current-cultivation"] = true;
      }

      const fcrpsId = getIdByCode("FCRPS");
      const fcrpsStatus = fcrpsId ? statusData.data[fcrpsId] : null;
      if (fcrpsStatus?.uploaded && fcrpsStatus.versions?.length > 0) {
        const v = fcrpsStatus.versions[0];
        if (v.remarks) newCommentsStore["future-crops"] = v.remarks;
        newCompletedTabs["future-crops"] = true;
      }

      const maintId = getIdByCode("MAINT");
      const maintStatus = maintId ? statusData.data[maintId] : null;
      if (maintStatus?.uploaded && maintStatus.versions?.length > 0) {
        const v = maintStatus.versions[0];
        if (v.remarks) newCommentsStore["maintenance"] = v.remarks;
        if (v.expected_return) setMaintenanceReturns(v.expected_return);
        if (v.crop_ids && Array.isArray(v.crop_ids)) {
          const cropNames = v.crop_ids.map((id: number) => cropsResult?.find((c: any) => c.id === id)?.description).filter(Boolean);
          if (cropNames.length > 0) setMaintenanceCrop(cropNames.join(", "));
        }
        newCompletedTabs["maintenance"] = true;
      }

      const natadId = getIdByCode("NATAD");
      const natadStatus = natadId ? statusData.data[natadId] : null;
      if (natadStatus?.uploaded && natadStatus.versions?.length > 0) {
        const v = natadStatus.versions[0];
        if (v.remarks) newCommentsStore["natural-advantages-disadvantages"] = v.remarks;
        if (v.advantages) setAdvantages(v.advantages);
        if (v.disadvantages) setDisadvantages(v.disadvantages);
        newCompletedTabs["natural-advantages-disadvantages"] = true;
      }

      setCommentsStore(newCommentsStore);
      setCompletedTabs(newCompletedTabs);
      setUploadedStore(newUploadedStore);
    }
  }, [statusData, masterData]);

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

    newFiles.forEach((file) => simulateUpload(file.id));
  };

  const simulateUpload = (fileId: string) => {
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += Math.floor(Math.random() * 25) + 15;
      if (progressVal >= 100) {
        progressVal = 100;
        clearInterval(interval);
        setUploadedStore((prev) => ({
          ...prev,
          [activeTabId]: (prev[activeTabId] || []).map((f) => f.id === fileId ? { ...f, progress: 100, status: "completed" as const } : f),
        }));
      } else {
        setUploadedStore((prev) => ({
          ...prev,
          [activeTabId]: (prev[activeTabId] || []).map((f) => f.id === fileId ? { ...f, progress: progressVal } : f),
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

  const showErrorToast = (message: string) => {
    toast.success(message);
  };

  const handleNextTab = async () => {
    try {
      if (activeTabId === "local-agriculture-officer-report" || activeTabId === "last-5-years-crop-yielding") {
        if (currentTabFiles.length === 0) return showErrorToast("Please upload at least one file.");
        
        const filesToUpload = currentTabFiles.filter((f) => f.fileData);
        
        if (filesToUpload.length === 0) {
          // If files are already uploaded in state (from backend) but no new files are selected
    
          const currentTabIdx = TABS.findIndex((t) => t.id === activeTabId);
          if (currentTabIdx < TABS.length - 1) setActiveTabId(TABS[currentTabIdx + 1].id);
          else setShowSubmittedModal(true);
          return;
        }

        const docType = activeTabId === "local-agriculture-officer-report" ? "LAORP" : "L5CYR";

        const documentUrlsArray = [];
        for (const fileItem of filesToUpload) {
          if (fileItem.fileData) {
            const formData = new FormData();
            formData.append("file", fileItem.fileData);
            const cleanFileName = fileItem.fileData.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileKey = `farmlands/${Number(farmlandId)}/${docType}/${Number(farmlandId)}_${cleanFileName}`;
            formData.append("key", fileKey);
            
            await uploadS3File(formData).unwrap();
            documentUrlsArray.push(fileKey);
          }
        }
        
        const documentUrls = documentUrlsArray;

        await uploadDoc({
          farmlandId,
          docType,
          documentUrls,
          remarks: currentTabComment,
          version: "1"
        }).unwrap();
      } else if (activeTabId === "soil") {
        if (!soilType) return showErrorToast("Please select a soil type.");
        const soilObj = masterData?.soilTypeResult?.find((s: any) => s.description === soilType);
        const soil_type_id = soilObj?.id || 1;
        await saveSoil({
          farmlandId,
          docType: "SOILS",
          soil_type_id,
          remarks: currentTabComment,
          version: "1"
        }).unwrap();
      } else if (activeTabId === "type-of-crop") {
        if (!cropType) return showErrorToast("Please select a crop type.");
        const cropObj = masterData?.cropsResult?.find((c: any) => c.description === cropType);
        const crop_id = cropObj?.id || 1;
        await saveCropType({
          farmlandId,
          docType: "TYCRP",
          crop_id,
          remarks: currentTabComment,
          version: "1"
        }).unwrap();
      } else if (activeTabId === "ground-water-level") {
        if (!waterLevel) return showErrorToast("Please enter ground water level.");
        await saveGroundWater({
          farmlandId,
          docType: "GWLVL",
          ground_water_level: waterLevel,
          remarks: currentTabComment,
          version: "1"
        }).unwrap();
      } else if (activeTabId === "types-of-crop-can-be-grown") {
        if (!futureCrops) return showErrorToast("Please select types of crop that can be grown.");
        const selectedCrops = futureCrops.split(",").map(s => s.trim()).filter(Boolean);
        const crop_ids = selectedCrops.map(crop => {
          const cObj = masterData?.cropsResult?.find((c: any) => c.description === crop);
          return cObj?.id || 1;
        });
        await saveTypesOfCropCanBeGrown({
          farmlandId,
          docType: "TCCBG",
          is_crop_available: "",
          crop_ids,
          remarks: currentTabComment,
          version: "1"
        }).unwrap();
      } else if (activeTabId === "current-yield-cost") {
        if (!yieldCost || !yieldReturns) return showErrorToast("Please enter current yield cost and returns.");
        await saveCurrentYield({
          farmlandId,
          docType: "CURYD",
          current_yield_cost: yieldCost,
          current_returns: yieldReturns,
          remarks: currentTabComment,
          version: "1"
        }).unwrap();
      } else if (activeTabId === "current-cultivation") {
        if (!cultivationName || !cultivationContact) return showErrorToast("Please enter cultivation details.");
        await saveCurrentCultivation({
          farmlandId,
          docType: "CURCL",
          is_lease: cultivationType === "Self" ? 0 : 1,
          name: cultivationName,
          contact_number: cultivationContact,
          remarks: currentTabComment,
          version: "1"
        }).unwrap();
      } else if (activeTabId === "future-crops") {
        await saveFutureCrops({
          farmlandId,
          docType: "FCRPS",
          remarks: currentTabComment,
          version: "1"
        }).unwrap();
      } else if (activeTabId === "maintenance") {
        if (!maintenanceCrop || !maintenanceReturns) return showErrorToast("Please enter maintenance details.");
        const selectedCrops = maintenanceCrop.split(",").map(s => s.trim()).filter(Boolean);
        const crop_ids = selectedCrops.map(crop => {
          const cObj = masterData?.cropsResult?.find((c: any) => c.description === crop);
          return cObj?.id || 1;
        });
        await saveMaintenance({
          farmlandId,
          docType: "MAINT",
          expected_return: maintenanceReturns,
          crop_ids,
          remarks: currentTabComment,
          version: "1"
        }).unwrap();
      } else if (activeTabId === "natural-advantages-disadvantages") {
        if (!advantages || !disadvantages) return showErrorToast("Please enter advantages and disadvantages.");
        await saveAdvantagesDisadvantages({
          farmlandId,
          docType: "NATAD",
          advantages,
          disadvantages,
          remarks: currentTabComment,
          version: "1"
        }).unwrap();
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
      console.error("Failed to save:", error);
      showErrorToast("Failed to save data. Please try again.");
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
        
        // Agriculture Specific Props
        selectedSoilType={soilType}
        onSoilTypeChange={setSoilType}
        selectedCropType={cropType}
        onCropTypeChange={setCropType}
        waterLevelValue={waterLevel}
        onWaterLevelChange={setWaterLevel}
        selectedFutureCrops={futureCrops}
        onFutureCropsChange={setFutureCrops}
        yieldCostValue={yieldCost}
        onYieldCostChange={setYieldCost}
        yieldReturnsValue={yieldReturns}
        onYieldReturnsChange={setYieldReturns}
        cultivationTypeValue={cultivationType}
        onCultivationTypeChange={setCultivationType}
        cultivationNameValue={cultivationName}
        onCultivationNameChange={setCultivationName}
        cultivationContactValue={cultivationContact}
        onCultivationContactChange={setCultivationContact}
        maintenanceCropValue={maintenanceCrop}
        onMaintenanceCropChange={setMaintenanceCrop}
        maintenanceReturnsValue={maintenanceReturns}
        onMaintenanceReturnsChange={setMaintenanceReturns}
        advantagesValue={advantages}
        onAdvantagesChange={setAdvantages}
        disadvantagesValue={disadvantages}
        onDisadvantagesChange={setDisadvantages}
      />

      

      {showSubmittedModal && (
        <UploadSubmittedModal

          title="Agriculture Report Submitted"
          description={<>Proceed With <span className="text-[#0052cc] hover:underline cursor-pointer" onClick={() => setShowSubmittedModal(false)}>'Land Boundaries'</span> for further uploading</>}
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

export default UploadAgricultureReport;
