import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import UploadDocumentsTabsCard from "../components/UploadDocumentsTabsCard";
import UploadFilesDocument from "../components/UploadFilesDocument";
import { UploadSubmittedModal } from "../components/UploadSubmittedModal";
import { useGetFarmlandLegalDocsStatusQuery, useUploadFarmlandLegalDocMutation, useSaveLandCoordinatesMutation } from "@/features/super-admin/api/farmland.api";
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
];

const TAB_CODE_MAPPING: Record<string, string> = {
  "land-document": "LDDMT",
  "pattadhar-passbook": "PTDPB",
  "link-document": "LNDMT",
  "kasara-pahani": "KSRPN",
  "revenue-record": "RVERR",
  "lease-agreement": "LSAGM",
  "death-certificate": "DTCFT",
  "partition-deed": "PTNDD",
  "encumbrance-certificate": "EBCFT",
  "land-coordinates": "LDCDN",
  "owner-video-kyc": "OWKYV",
};

export const UploadLegalDocuments: React.FC = () => {
  const { farmlandId, onNextStep } = useOutletContext<{ farmlandId: string; onNextStep: () => void }>();
  
  const numericId = parseInt(farmlandId, 10) || 1;
  const { data: legalDocsStatus, refetch: refetchStatus } = useGetFarmlandLegalDocsStatusQuery({ farmlandId: numericId });
  
  const [uploadS3File] = useUploadS3FileMutation();
  const [uploadLegalDoc] = useUploadFarmlandLegalDocMutation();
  const [saveCoordinates] = useSaveLandCoordinatesMutation();

  const [activeTabId, setActiveTabId] = useState(TABS[0].id);
  const [uploadedStore, setUploadedStore] = useState<Record<string, UploadedFileItem[]>>({});
  const [commentsStore, setCommentsStore] = useState<Record<string, string>>({});
  const [coordinatesStore, setCoordinatesStore] = useState<Record<string, string>>({});
  const [completedTabs, setCompletedTabs] = useState<Record<string, boolean>>({});
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  
  
  const [isUploading, setIsUploading] = useState(false);

  // Sync completion status and pre-fill data with backend
  useEffect(() => {
    if (legalDocsStatus?.data) {
      const backendData = legalDocsStatus.data;
      const newCompletedState = { ...completedTabs };
      const newCommentsState = { ...commentsStore };
      const newUploadedState = { ...uploadedStore };
      const newCoordinatesState = { ...coordinatesStore };
      
      Object.values(backendData).forEach((item: any) => {
        if (item.code) {
          const tabId = Object.keys(TAB_CODE_MAPPING).find(key => TAB_CODE_MAPPING[key] === item.code);
          
          if (tabId) {
            if (item.uploaded) {
              newCompletedState[tabId] = true;
            }

            const activeVersion = item.versions?.[0];
            if (activeVersion) {
              if (activeVersion.remarks) {
                newCommentsState[tabId] = activeVersion.remarks;
              }
              
              if (activeVersion.files && Array.isArray(activeVersion.files)) {
                newUploadedState[tabId] = activeVersion.files.map((f: any, idx: number) => {
                  const url = typeof f === 'string' ? f : (f.document_url || "");
                  return {
                    id: `backend-${tabId}-${f.id || idx}`,
                    name: url.split('/').pop() || url,
                    size: 'Uploaded',
                    progress: 100,
                    status: 'completed',
                  };
                });
              } else if (typeof activeVersion.files === 'string') {
                newUploadedState[tabId] = activeVersion.files.split(',').map((fileStr: string, idx: number) => ({
                  id: `backend-${tabId}-${idx}`,
                  name: fileStr.split('/').pop() || fileStr,
                  url: fileStr,
                  size: 'Uploaded',
                  progress: 100,
                  status: 'completed',
                }));
              }
              
              if (activeVersion.land_coordinates && tabId === "land-coordinates") {
                newCoordinatesState[tabId] = activeVersion.land_coordinates;
              }
            }
          }
        }
      });
      
      setCompletedTabs(newCompletedState);
      setCommentsStore(newCommentsState);
      setUploadedStore(newUploadedState);
      setCoordinatesStore(newCoordinatesState);
    }
  }, [legalDocsStatus]);



  const activeTabLabel = TABS.find((t) => t.id === activeTabId)?.label || "";
  const currentTabFiles = uploadedStore[activeTabId] || [];
  const currentTabComment = commentsStore[activeTabId] || "";
  const currentTabCoordinates = coordinatesStore[activeTabId] || "";

  const isTabComplete = (tabId: string) => !!completedTabs[tabId];

  const handleTabSelect = (newTabId: string) => {
    setActiveTabId(newTabId);
  };

  const addFiles = (fileList: FileList, imageType?: "cover" | "land") => {
    const newFiles: UploadedFileItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
      newFiles.push({ 
        id: Date.now().toString() + i, 
        name: file.name, 
        size: sizeStr, 
        progress: 100, 
        status: "completed", 
        imageType,
        fileData: file 
      });
    }

    setUploadedStore((prev) => ({
      ...prev,
      [activeTabId]: [...(prev[activeTabId] || []), ...newFiles],
    }));
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

  const handleCoordinatesChange = (val: string) => {
    setCoordinatesStore((prev) => ({ ...prev, [activeTabId]: val }));
  };

  const handlePrevTab = () => {
    const currentTabIdx = TABS.findIndex((t) => t.id === activeTabId);
    if (currentTabIdx > 0) setActiveTabId(TABS[currentTabIdx - 1].id);
  };

  const handleNextTab = async () => {
    setIsUploading(true);
    
    try {
      const docType = TAB_CODE_MAPPING[activeTabId];
      let uploadedKeys: string[] = [];

      // 1. Upload files to S3
      if (currentTabFiles.length > 0) {
        for (const fileItem of currentTabFiles) {
          if (fileItem.fileData) {
            const formData = new FormData();
            formData.append("file", fileItem.fileData);
            
            // Clean filename and construct key
            const cleanFileName = fileItem.fileData.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileKey = `farmlands/${numericId}/${docType}/${numericId}_${cleanFileName}`;
            
            formData.append("key", fileKey);
            
            await uploadS3File(formData).unwrap();
            uploadedKeys.push(fileKey);
          } else if (fileItem.id.startsWith("backend-")) {
            // If it's already an uploaded file from the backend, we might want to preserve it.
            // Wait, the backend file string might just be the name or the full key. 
            // We'll assume the original keys are stored in `url` if we set it earlier, or `name` as fallback.
            uploadedKeys.push(fileItem.url || fileItem.name);
          }
        }
      }

      // 2. Submit to backend
      if (activeTabId === "land-coordinates") {
        await saveCoordinates({
          farmlandId: numericId,
          land_coordinates: currentTabCoordinates,
          remarks: currentTabComment,
          docType: docType,
          version: 1
        }).unwrap();
      } else {
        await uploadLegalDoc({
          farmlandId: numericId,
          docType: docType,
          documentUrls: uploadedKeys,
          remarks: currentTabComment,
          version: 1
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
      console.error("Upload failed:", error);
      toast.error("Failed to upload. Please try again.");
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

      {isUploading && (
        <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-[2px] flex items-center justify-center rounded-[2rem]">
          <div className="bg-black/80 text-white px-6 py-3 rounded-full font-sans shadow-lg flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving {activeTabLabel}...
          </div>
        </div>
      )}

      <UploadFilesDocument
        className="upload-files-card"
        activeTabLabel={activeTabLabel}
        uploadedFiles={currentTabFiles}
        commentValue={currentTabComment}
        onCommentChange={handleCommentChange}
        coordinatesValue={currentTabCoordinates}
        onCoordinatesChange={handleCoordinatesChange}
        onFileUpload={addFiles}
        onFileDelete={deleteFile}
        onPrevTab={handlePrevTab}
        onNextTab={handleNextTab}
        isFinishStep={activeTabId === TABS[TABS.length - 1].id}
        isUploading={isUploading}
      />

      

      {showSubmittedModal && (
        <UploadSubmittedModal

          title="Legal Documents Submitted"
          description={<>Proceed With <span className="text-[#0052cc] hover:underline cursor-pointer" onClick={() => setShowSubmittedModal(false)}>'Agriculture Report'</span> for further uploading</>}
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

export default UploadLegalDocuments;
