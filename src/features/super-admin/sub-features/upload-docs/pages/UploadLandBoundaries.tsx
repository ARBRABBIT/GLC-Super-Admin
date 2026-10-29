import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import UploadDocumentsTabsCard from "../components/UploadDocumentsTabsCard";
import UploadFilesDocument from "../components/UploadFilesDocument";
import { UploadSubmittedModal } from "../components/UploadSubmittedModal";
import { useGetAllMasterDataQuery } from "../../../api/masterData.api";
import { useUploadS3FileMutation } from "../../../api/file.api";
import {
  useUploadLandAndBoundariesDocMutation,
  useUploadLandAndBoundariesCoverImageMutation,
  useGetLandAndBoundariesCoverImageQuery,
  useGetLandAndBoundariesStatusQuery,
  useSaveShapeOfLandMutation,
  useSaveWaterElectricityMutation,
  useSaveExistingTreesMutation,
  useSaveEastBoundariesMutation,
  useSaveWestBoundariesMutation,
  useSaveNorthBoundariesMutation,
  useSaveSouthBoundariesMutation,
} from "../../../api/landAndBoundaries.api";

const TAB_CODE_MAPPING: Record<string, string> = {
  "land-images": "LNIMG",
  "landscape-view": "LSVFW",
  "shape-land": "SHPLD",
  "water-electricity": "WEFAC",
  "existing-trees": "EXTRE",
  "master-plan": "MPLAN",
  "east-boundaries": "EBOUN",
  "north-boundaries": "NBOUN",
  "south-boundaries": "SBOUN",
  "west-boundaries": "WBOUN",
};

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
];

export const UploadLandBoundaries: React.FC = () => {
  const { farmlandId, onNextStep } = useOutletContext<{ farmlandId: string; onNextStep: () => void }>();
  
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);
  const [uploadedStore, setUploadedStore] = useState<Record<string, UploadedFileItem[]>>({});
  const [commentsStore, setCommentsStore] = useState<Record<string, string>>({});
  const [completedTabs, setCompletedTabs] = useState<Record<string, boolean>>({});
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  
  

  // Land Boundaries specific states
  const [landShape, setLandShape] = useState("");
  const [facilityAvailability, setFacilityAvailability] = useState("");
  const [waterFacility, setWaterFacility] = useState("");
  const [electricityFacility, setElectricityFacility] = useState("");
  const [treesAvailability, setTreesAvailability] = useState("");
  const [treesCount, setTreesCount] = useState("");
  const [surveyReportType, setSurveyReportType] = useState("private");
  
  const [privateSurveyFiles, setPrivateSurveyFiles] = useState<UploadedFileItem[]>([]);
  const [governmentSurveyFiles, setGovernmentSurveyFiles] = useState<UploadedFileItem[]>([]);
  const [privateSurveyComment, setPrivateSurveyComment] = useState("");
  const [governmentSurveyComment, setGovernmentSurveyComment] = useState("");

  // Boundary specific (depends on activeTabId)
  const [boundaryTypeStore, setBoundaryTypeStore] = useState<Record<string, string>>({});
  const [boundaryOwnerNameStore, setBoundaryOwnerNameStore] = useState<Record<string, string>>({});
  const [boundaryOwnerAgeStore, setBoundaryOwnerAgeStore] = useState<Record<string, string>>({});
  const [boundaryRoadTypeStore, setBoundaryRoadTypeStore] = useState<Record<string, string>>({});
  const [boundaryRoadWidthStore, setBoundaryRoadWidthStore] = useState<Record<string, string>>({});
  const [boundaryTreesCountStore, setBoundaryTreesCountStore] = useState<Record<string, string>>({});

  const { data: masterDataResponse } = useGetAllMasterDataQuery();
  const masterData = masterDataResponse || ({} as any);

  const { data: statusResponse, refetch: refetchStatus } = useGetLandAndBoundariesStatusQuery({ farmlandId: Number(farmlandId) }, { skip: !farmlandId });
  const { data: coverImageResponse, refetch: refetchCoverImage } = useGetLandAndBoundariesCoverImageQuery({ farmlandId: Number(farmlandId) }, { skip: !farmlandId });

  const [uploadS3, { isLoading: isUploading }] = useUploadS3FileMutation();
  const [uploadDoc] = useUploadLandAndBoundariesDocMutation();
  const [saveCoverImage] = useUploadLandAndBoundariesCoverImageMutation();
  const [saveShape] = useSaveShapeOfLandMutation();
  const [saveWater] = useSaveWaterElectricityMutation();
  const [saveTrees] = useSaveExistingTreesMutation();
  const [saveEast] = useSaveEastBoundariesMutation();
  const [saveWest] = useSaveWestBoundariesMutation();
  const [saveNorth] = useSaveNorthBoundariesMutation();
  const [saveSouth] = useSaveSouthBoundariesMutation();



  useEffect(() => {
    if (statusResponse?.success && statusResponse?.data) {
      const data = statusResponse.data;
      const newCompleted: Record<string, boolean> = {};
      const newComments: Record<string, string> = {};
      
      const findDocByDesc = (desc: string) => {
        return Object.values(data).find((d: any) => d.description === desc);
      };

      const TAB_DESC_MAPPING: Record<string, string> = {
        "land-images": "land_images",
        "landscape-view": "landscape_view_of_farmland",
        "shape-land": "shape_of_the_land",
        "water-electricity": "water_and_electricity_facility",
        "existing-trees": "any_existing_trees",
        "master-plan": "master_plan",
        "east-boundaries": "east_boundaries",
        "north-boundaries": "north_boundaries",
        "south-boundaries": "south_boundaries",
        "west-boundaries": "west_boundaries",
      };

      const newUploadedStore: Record<string, UploadedFileItem[]> = {};
      const newPvtSurveyFiles: UploadedFileItem[] = [];
      const newGovtSurveyFiles: UploadedFileItem[] = [];

      // New temp states for hydration
      const newBoundaryTypeStore: Record<string, string> = {};
      const newBoundaryOwnerNameStore: Record<string, string> = {};
      const newBoundaryOwnerAgeStore: Record<string, string> = {};
      const newBoundaryRoadTypeStore: Record<string, string> = {};
      const newBoundaryRoadWidthStore: Record<string, string> = {};
      const newBoundaryTreesCountStore: Record<string, string> = {};

      const mapFiles = (filesArray: any[], tabId: string): UploadedFileItem[] => {
        if (!filesArray) return [];
        return filesArray.map((f: any) => ({
          id: `backend-${f.id}`,
          name: f.document_url?.split('/').pop() || f.document_url, // For display, maybe split by '/' in UI, but the UI expects a name
          url: f.document_url,
          size: "-",
          progress: 100,
          status: "completed",
          imageType: tabId === "land-images" ? "land" : undefined,
        }));
      };

      let pvtPresent = false;
      let govtPresent = false;

      TABS.forEach(tab => {
        if (tab.id === "survey-report") {
          const govtDoc: any = findDocByDesc("government_survay_report");
          const pvtDoc: any = findDocByDesc("private_survay_report");
          if (govtDoc?.uploaded || pvtDoc?.uploaded) {
            newCompleted[tab.id] = true;
            // Restore comments and files if present
            if (pvtDoc?.versions?.[0]) {
              pvtPresent = true;
              if (pvtDoc.versions[0].remarks) setPrivateSurveyComment(pvtDoc.versions[0].remarks);
              if (pvtDoc.versions[0].files) newPvtSurveyFiles.push(...mapFiles(pvtDoc.versions[0].files, tab.id));
            }
            if (govtDoc?.versions?.[0]) {
              govtPresent = true;
              if (govtDoc.versions[0].remarks) setGovernmentSurveyComment(govtDoc.versions[0].remarks);
              if (govtDoc.versions[0].files) newGovtSurveyFiles.push(...mapFiles(govtDoc.versions[0].files, tab.id));
            }
          }
        } else {
          const desc = TAB_DESC_MAPPING[tab.id];
          if (desc) {
            const doc: any = findDocByDesc(desc);
            if (doc?.uploaded) {
              newCompleted[tab.id] = true;
              const v = doc.versions?.[0];
              if (v) {
                if (v.remarks) newComments[tab.id] = v.remarks;
                if (v.files?.length) {
                  newUploadedStore[tab.id] = mapFiles(v.files, tab.id);
                }

                // Field Mapping
                if (tab.id === "shape-land" && v.shape_of_land_id) {
                  const shapeObj = masterData?.shapeOfTheLandResult?.find((o: any) => o.id === v.shape_of_land_id);
                  if (shapeObj) setLandShape(shapeObj.description);
                } else if (tab.id === "water-electricity") {
                  if (v.is_water_availability && v.is_electricity_availability) setFacilityAvailability("both");
                  else if (v.is_water_availability) setFacilityAvailability("water");
                  else if (v.is_electricity_availability) setFacilityAvailability("electricity");
                  
                  if (v.is_bore) setWaterFacility("bore");
                  else if (v.is_municipal) setWaterFacility("municipal");

                  if (v.is_2phase) setElectricityFacility("2phase");
                  else if (v.is_3phase) setElectricityFacility("3phase");
                } else if (tab.id === "existing-trees") {
                  if (v.is_any_existing_trees) {
                    setTreesAvailability("available");
                    if (v.trees_count_id) setTreesCount(v.trees_count_id.toString());
                  } else {
                    setTreesAvailability("not-available");
                  }
                } else if (["east-boundaries", "west-boundaries", "north-boundaries", "south-boundaries"].includes(tab.id)) {
                  if (v.boundary_id) {
                    const bObj = masterData?.boundariesResult?.find((o: any) => o.id === v.boundary_id);
                    if (bObj) newBoundaryTypeStore[tab.id] = bObj.description === "Trees" ? "Tress" : bObj.description;
                  }
                  if (v.owner_name) newBoundaryOwnerNameStore[tab.id] = v.owner_name;
                  if (v.age) newBoundaryOwnerAgeStore[tab.id] = v.age.toString();
                  if (v.road_type_id === 1) newBoundaryRoadTypeStore[tab.id] = "Private Road";
                  else if (v.road_type_id === 2) newBoundaryRoadTypeStore[tab.id] = "Government Road";
                  if (v.road_width) newBoundaryRoadWidthStore[tab.id] = v.road_width.toString();
                  if (v.trees_count_id) {
                    // Tree count options map for boundary is string based in UI
                    const tDesc = ["1 - 10", "11 - 50", "51 - 100", "100+"][v.trees_count_id - 1]; // basic mapping or find from master
                    if (tDesc) newBoundaryTreesCountStore[tab.id] = tDesc; 
                  }
                }
              }
            }
          }
        }
      });

      if (coverImageResponse?.success && coverImageResponse?.data?.cover_image_url) {
        if (!newUploadedStore["land-images"]) {
          newUploadedStore["land-images"] = [];
        }
        newUploadedStore["land-images"].push({
          id: `cover-backend`,
          name: coverImageResponse.data.cover_image_url,
          size: "-",
          progress: 100,
          status: "completed",
          imageType: "cover",
        });
      }

      setCompletedTabs(newCompleted);
      setCommentsStore(prev => ({ ...prev, ...newComments }));
      setUploadedStore(prev => ({ ...prev, ...newUploadedStore }));
      if (newPvtSurveyFiles.length > 0) setPrivateSurveyFiles(newPvtSurveyFiles);
      if (newGovtSurveyFiles.length > 0) setGovernmentSurveyFiles(newGovtSurveyFiles);

      if (pvtPresent && govtPresent) setSurveyReportType("both");
      else if (pvtPresent) setSurveyReportType("private");
      else if (govtPresent) setSurveyReportType("government");

      if (Object.keys(newBoundaryTypeStore).length > 0) setBoundaryTypeStore(prev => ({ ...prev, ...newBoundaryTypeStore }));
      if (Object.keys(newBoundaryOwnerNameStore).length > 0) setBoundaryOwnerNameStore(prev => ({ ...prev, ...newBoundaryOwnerNameStore }));
      if (Object.keys(newBoundaryOwnerAgeStore).length > 0) setBoundaryOwnerAgeStore(prev => ({ ...prev, ...newBoundaryOwnerAgeStore }));
      if (Object.keys(newBoundaryRoadTypeStore).length > 0) setBoundaryRoadTypeStore(prev => ({ ...prev, ...newBoundaryRoadTypeStore }));
      if (Object.keys(newBoundaryRoadWidthStore).length > 0) setBoundaryRoadWidthStore(prev => ({ ...prev, ...newBoundaryRoadWidthStore }));
      if (Object.keys(newBoundaryTreesCountStore).length > 0) setBoundaryTreesCountStore(prev => ({ ...prev, ...newBoundaryTreesCountStore }));
    }
  }, [statusResponse, masterData, coverImageResponse]);

  const activeTabLabel = TABS.find((t) => t.id === activeTabId)?.label || "";
  const currentTabFiles = uploadedStore[activeTabId] || [];
  const hasCoverImage = uploadedStore["land-images"]?.some((f) => f.imageType === "cover") || false;
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

  const addPrivateSurveyFiles = (fileList: FileList) => {
    const newFiles: UploadedFileItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
      newFiles.push({ id: Date.now().toString() + i, name: file.name, size: sizeStr, progress: 0, status: "uploading", fileData: file });
    }
    setPrivateSurveyFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => simulateUploadArray(file.id, setPrivateSurveyFiles));
  };

  const addGovtSurveyFiles = (fileList: FileList) => {
    const newFiles: UploadedFileItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
      newFiles.push({ id: Date.now().toString() + i, name: file.name, size: sizeStr, progress: 0, status: "uploading", fileData: file });
    }
    setGovernmentSurveyFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => simulateUploadArray(file.id, setGovernmentSurveyFiles));
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

  const simulateUploadArray = (fileId: string, setStore: any) => {
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += Math.floor(Math.random() * 25) + 15;
      if (progressVal >= 100) {
        progressVal = 100;
        clearInterval(interval);
        setStore((prev: any[]) => prev.map((f) => f.id === fileId ? { ...f, progress: 100, status: "completed" } : f));
      } else {
        setStore((prev: any[]) => prev.map((f) => f.id === fileId ? { ...f, progress: progressVal } : f));
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
console.log(masterData,"insideupload")
  const handleNextTab = async () => {
    try {
      const docType = TAB_CODE_MAPPING[activeTabId];

      if (activeTabId === "shape-land") {
        const shapeObj = masterData?.shapeOfTheLandResult?.find((o: any) => o.id.toString() === landShape);
        if (shapeObj) {
          await saveShape({
            farmlandId: Number(farmlandId),
            docType,
            shape_of_land_id: shapeObj.id,
            remarks: currentTabComment || "",
            version: "1",
          }).unwrap();
        }
      } else if (activeTabId === "water-electricity") {
        await saveWater({
          farmlandId: Number(farmlandId),
          docType,
          is_water_availability: facilityAvailability === "water" || facilityAvailability === "both" ? 1 : 0,
          is_electricity_availability: facilityAvailability === "electricity" || facilityAvailability === "both" ? 1 : 0,
          is_bore: waterFacility === "bore" ? 1 : 0,
          is_municipal: waterFacility === "municipal" ? 1 : 0,
          is_2phase: electricityFacility === "2phase" ? 1 : 0,
          is_3phase: electricityFacility === "3phase" ? 1 : 0,
          remarks: currentTabComment || "",
          version: "1",
        }).unwrap();
      } else if (activeTabId === "existing-trees") {
        await saveTrees({
          farmlandId: Number(farmlandId),
          docType,
          is_any_existing_trees: treesAvailability === "available" ? 1 : 0,
          trees_count_id: treesCount ? Number(treesCount) : null,
          remarks: currentTabComment || "",
          version: "1",
        }).unwrap();
      } else if (["east-boundaries", "west-boundaries", "north-boundaries", "south-boundaries"].includes(activeTabId)) {
        const boundaryDesc = boundaryTypeStore[activeTabId] === "Trees" ? "Tress" : boundaryTypeStore[activeTabId];
        const boundaryObj = masterData.boundariesResult?.find((o: any) => o.description === boundaryDesc);
        if (boundaryObj) {
          const payload = {
            farmlandId: Number(farmlandId),
            docType,
            boundary_id: boundaryObj.id,
            owner_name: "",
            age: "",
            road_type_id: null,
            road_width: null,
            trees_count_id: null,
            remarks: currentTabComment || "",
            version: "1",
          };
          if (activeTabId === "east-boundaries") await saveEast(payload).unwrap();
          else if (activeTabId === "west-boundaries") await saveWest(payload).unwrap();
          else if (activeTabId === "north-boundaries") await saveNorth(payload).unwrap();
          else if (activeTabId === "south-boundaries") await saveSouth(payload).unwrap();
        }
      } else if (activeTabId === "survey-report") {
        // Upload Private Survey Report
        const pvtKeys = [];
        for (const fileItem of privateSurveyFiles) {
          if (fileItem.fileData) {
            const formData = new FormData();
            formData.append("file", fileItem.fileData);
            const cleanFileName = fileItem.fileData.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileKey = `farmlands/${Number(farmlandId)}/PVSVR/${Number(farmlandId)}_${cleanFileName}`;
            formData.append("key", fileKey);
            await uploadS3(formData).unwrap();
            pvtKeys.push(fileKey);
          } else if (fileItem.id.startsWith("backend-")) {
            pvtKeys.push(fileItem.url || fileItem.name);
          }
        }
        if (pvtKeys.length > 0 || privateSurveyComment) {
          await uploadDoc({
            farmlandId: Number(farmlandId),
            docType: "PVSVR",
            documentUrls: pvtKeys,
            remarks: privateSurveyComment || "",
            version: "1"
          }).unwrap();
        }

        // Upload Government Survey Report
        const govtKeys = [];
        for (const fileItem of governmentSurveyFiles) {
          if (fileItem.fileData) {
            const formData = new FormData();
            formData.append("file", fileItem.fileData);
            const cleanFileName = fileItem.fileData.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileKey = `farmlands/${Number(farmlandId)}/GVSVR/${Number(farmlandId)}_${cleanFileName}`;
            formData.append("key", fileKey);
            await uploadS3(formData).unwrap();
            govtKeys.push(fileKey);
          } else if (fileItem.id.startsWith("backend-")) {
            govtKeys.push(fileItem.url || fileItem.name);
          }
        }
        if (govtKeys.length > 0 || governmentSurveyComment) {
          await uploadDoc({
            farmlandId: Number(farmlandId),
            docType: "GVSVR",
            documentUrls: govtKeys,
            remarks: governmentSurveyComment || "",
            version: "1"
          }).unwrap();
        }
      } else {
        // Standard document upload
        if (currentTabFiles.length > 0) {
          const coverFiles = currentTabFiles.filter(f => f.imageType === "cover");
          const otherFiles = currentTabFiles.filter(f => f.imageType !== "cover");

          // Upload cover image
          if (coverFiles.length > 0) {
            const fileItem = coverFiles[0];
            if (fileItem.fileData) {
              const formData = new FormData();
              formData.append("file", fileItem.fileData);
              const cleanFileName = fileItem.fileData.name.replace(/[^a-zA-Z0-9.-]/g, '_');
              const fileKey = `farmlands/${Number(farmlandId)}/${docType}/${Number(farmlandId)}_cover_${cleanFileName}`;
              formData.append("key", fileKey);
              
              await uploadS3(formData).unwrap();
              
              await saveCoverImage({
                farmlandId: Number(farmlandId),
                imageUrl: fileKey
              }).unwrap();
            }
          }

          // Upload other files
          if (otherFiles.length > 0) {
             const keys = [];
             for (const fileItem of otherFiles) {
               if (fileItem.fileData) {
                 const formData = new FormData();
                 formData.append("file", fileItem.fileData);
                 const cleanFileName = fileItem.fileData.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                 const fileKey = `farmlands/${Number(farmlandId)}/${docType}/${Number(farmlandId)}_${cleanFileName}`;
                 formData.append("key", fileKey);
                 
                 await uploadS3(formData).unwrap();
                 keys.push(fileKey);
                } else if (fileItem.id.startsWith("backend-")) {
                  keys.push(fileItem.url || fileItem.name);
                }
             }

             if (keys.length > 0 || currentTabComment) {
               await uploadDoc({
                 farmlandId: Number(farmlandId),
                 docType,
                 documentUrls: keys,
                 remarks: currentTabComment || "",
                 version: "1"
               }).unwrap();
             }
          }
        } else if (currentTabComment) {
             await uploadDoc({
               farmlandId: Number(farmlandId),
               docType,
               documentUrls: [],
               remarks: currentTabComment || "",
               version: "1"
             }).unwrap();
        }
      }


      refetchStatus();
      refetchCoverImage();
      
      toast.success(`${activeTabLabel} details have been saved`);

      const currentTabIdx = TABS.findIndex((t) => t.id === activeTabId);
      if (currentTabIdx < TABS.length - 1) {
        setActiveTabId(TABS[currentTabIdx + 1].id);
      } else {
        setShowSubmittedModal(true);
      }
    } catch (error) {
      console.error("Error saving tab data", error);
      toast.error(`Failed to save ${activeTabLabel} details`);
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
        hasCoverImage={hasCoverImage}
        commentValue={currentTabComment}
        onCommentChange={handleCommentChange}
        onFileUpload={addFiles}
        onFileDelete={deleteFile}
        onPrevTab={handlePrevTab}
        onNextTab={handleNextTab}
        isUploading={isUploading}
        
        // Land Boundaries Specific Props
        landShapeValue={landShape}
        onLandShapeChange={setLandShape}
        facilityAvailabilityValue={facilityAvailability}
        onFacilityAvailabilityChange={setFacilityAvailability}
        waterFacilityValue={waterFacility}
        onWaterFacilityChange={setWaterFacility}
        electricityFacilityValue={electricityFacility}
        onElectricityFacilityChange={setElectricityFacility}
        treesAvailabilityValue={treesAvailability}
        onTreesAvailabilityChange={setTreesAvailability}
        treesCountValue={treesCount}
        onTreesCountChange={setTreesCount}
        surveyReportTypeValue={surveyReportType}
        onSurveyReportTypeChange={setSurveyReportType}
        privateSurveyFiles={privateSurveyFiles}
        onPrivateSurveyFileUpload={addPrivateSurveyFiles}
        onPrivateSurveyFileDelete={(id) => setPrivateSurveyFiles(prev => prev.filter(f => f.id !== id))}
        governmentSurveyFiles={governmentSurveyFiles}
        onGovernmentSurveyFileUpload={addGovtSurveyFiles}
        onGovernmentSurveyFileDelete={(id) => setGovernmentSurveyFiles(prev => prev.filter(f => f.id !== id))}
        privateSurveyCommentValue={privateSurveyComment}
        onPrivateSurveyCommentChange={setPrivateSurveyComment}
        governmentSurveyCommentValue={governmentSurveyComment}
        onGovernmentSurveyCommentChange={setGovernmentSurveyComment}

        // Boundary specific props
        boundaryTypeValue={boundaryTypeStore[activeTabId] || ""}
        onBoundaryTypeChange={(v) => setBoundaryTypeStore(p => ({ ...p, [activeTabId]: v }))}
        boundaryOwnerNameValue={boundaryOwnerNameStore[activeTabId] || ""}
        onBoundaryOwnerNameChange={(v) => setBoundaryOwnerNameStore(p => ({ ...p, [activeTabId]: v }))}
        boundaryOwnerAgeValue={boundaryOwnerAgeStore[activeTabId] || ""}
        onBoundaryOwnerAgeChange={(v) => setBoundaryOwnerAgeStore(p => ({ ...p, [activeTabId]: v }))}
        boundaryRoadTypeValue={boundaryRoadTypeStore[activeTabId] || ""}
        onBoundaryRoadTypeChange={(v) => setBoundaryRoadTypeStore(p => ({ ...p, [activeTabId]: v }))}
        boundaryRoadWidthValue={boundaryRoadWidthStore[activeTabId] || ""}
        onBoundaryRoadWidthChange={(v) => setBoundaryRoadWidthStore(p => ({ ...p, [activeTabId]: v }))}
        boundaryTreesCountValue={boundaryTreesCountStore[activeTabId] || ""}
        onBoundaryTreesCountChange={(v) => setBoundaryTreesCountStore(p => ({ ...p, [activeTabId]: v }))}
        
        // Master Data options
        shapeOfTheLandOptions={masterData?.shapeOfTheLandResult || []}
        treesCountOptions={masterData?.treesCountResult || []}
        boundariesOptions={masterData?.boundariesResult || []}
      />

      

      {showSubmittedModal && (
        <UploadSubmittedModal

          title="Land Boundaries Submitted"
          description={<>Proceed With <span className="text-[#0052cc] hover:underline cursor-pointer" onClick={() => setShowSubmittedModal(false)}>'Valuation'</span> for further uploading</>}
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

export default UploadLandBoundaries;
