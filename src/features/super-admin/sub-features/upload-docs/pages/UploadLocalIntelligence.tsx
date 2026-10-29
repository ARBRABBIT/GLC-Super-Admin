import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOutletContext, useNavigate } from "react-router-dom";
import UploadDocumentsTabsCard from "../components/UploadDocumentsTabsCard";
import UploadFilesDocument from "../components/UploadFilesDocument";
import { UploadSubmittedModal } from "../components/UploadSubmittedModal";
import { 
  useGetLocalIntelligenceStatusQuery,
  useGetFarmlandByIdQuery,
  useUploadAnyIssuesMutation,
  useUploadLocalLiabilitiesMutation,
  useUploadPendingLoansMutation,
  useUploadOwnerMindsetMutation,
  useUploadSourcePersonMutation,
  useUploadAgreementsMutation,
  useUploadPreviousTransactionsMutation
} from "@/features/super-admin/api/farmland.api";
import { useGetAllMasterDataQuery } from "@/features/super-admin/api/masterData.api";
import { useSubmitFarmlandMutation } from "@/features/super-admin/api/farmlandAction.api";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/store/authSlice";

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  url?: string;
  status: "uploading" | "completed";
  imageType?: "cover" | "land";
}

const TABS = [
  { id: "any-issues", label: "Any Issues" },
  { id: "local-liabilities", label: "Local Liabilities" },
  { id: "any-pending-loans", label: "Any Pending Loans" },
  { id: "owner-mindset", label: "Owner Mindset" },
  { id: "source-person", label: "Source Person" },
  { id: "agreements", label: "Agreements" },
  { id: "previous-transactions", label: "Previous Transactions" },
];

const TAB_CODE_MAPPING: Record<string, string> = {
  "any-issues": "AYISS",
  "local-liabilities": "LCLBT",
  "any-pending-loans": "APDLN",
  "owner-mindset": "ONMDT",
  "source-person": "SRPON",
  "agreements": "AGEMT",
  "previous-transactions": "PVTNT",
};

export const UploadLocalIntelligence: React.FC = () => {
  const { farmlandId } = useOutletContext<{ farmlandId: string }>();
  const navigate = useNavigate();
  
  const numericId = parseInt(farmlandId.replace(/[^0-9]/g, "")) || 1;
  const { data: statusData, refetch: refetchStatus } = useGetLocalIntelligenceStatusQuery({ farmlandId: numericId });
  const { data: masterData } = useGetAllMasterDataQuery();
  const { data: farmlandDetails } = useGetFarmlandByIdQuery({ farmlandId: numericId });
  const [submitFarmland] = useSubmitFarmlandMutation();
  const user = useSelector(selectCurrentUser);
  const userId = user?.id || 1;
  
  const [uploadAnyIssues] = useUploadAnyIssuesMutation();
  const [uploadLocalLiabilities] = useUploadLocalLiabilitiesMutation();
  const [uploadPendingLoans] = useUploadPendingLoansMutation();
  const [uploadOwnerMindset] = useUploadOwnerMindsetMutation();
  const [uploadSourcePerson] = useUploadSourcePersonMutation();
  const [uploadAgreements] = useUploadAgreementsMutation();
  const [uploadPreviousTransactions] = useUploadPreviousTransactionsMutation();
  
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);
  const [uploadedStore, setUploadedStore] = useState<Record<string, UploadedFileItem[]>>({});
  const [commentsStore, setCommentsStore] = useState<Record<string, string>>({});
  const [completedTabs, setCompletedTabs] = useState<Record<string, boolean>>({});
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  
  const [isUploading, setIsUploading] = useState(false);


  // Local Intelligence specific states (keyed by activeTabId)
  const [anyIssuesTypeStore, setAnyIssuesTypeStore] = useState<Record<string, string>>({});
  const [localLiabilitiesTypeStore, setLocalLiabilitiesTypeStore] = useState<Record<string, string>>({});
  const [pendingLoansTypeStore, setPendingLoansTypeStore] = useState<Record<string, string>>({});
  const [pendingLoansAmountStore, setPendingLoansAmountStore] = useState<Record<string, string>>({});
  const [ownerMindsetStore, setOwnerMindsetStore] = useState<Record<string, string>>({});
  const [sourcePersonTypeStore, setSourcePersonTypeStore] = useState<Record<string, string>>({});
  const [sourcePersonNameStore, setSourcePersonNameStore] = useState<Record<string, string>>({});
  const [sourcePersonMobileStore, setSourcePersonMobileStore] = useState<Record<string, string>>({});
  const [agreementPaperStore, setAgreementPaperStore] = useState<Record<string, string>>({});
  const [agreementTypeStore, setAgreementTypeStore] = useState<Record<string, string>>({});
  const [agreementPriceStore, setAgreementPriceStore] = useState<Record<string, string>>({});
  const [prevTransactionsTypeStore, setPrevTransactionsTypeStore] = useState<Record<string, string>>({});
  const [prevTransactionsPriceStore, setPrevTransactionsPriceStore] = useState<Record<string, string>>({});

  // Map API response to state
  useEffect(() => {
    if (statusData?.data) {
      const backendData = statusData.data;
      const newCompleted = { ...completedTabs };
      const newComments = { ...commentsStore };
      const newAnyIssues = { ...anyIssuesTypeStore };
      const newLocalLiab = { ...localLiabilitiesTypeStore };
      const newPendingType = { ...pendingLoansTypeStore };
      const newPendingAmount = { ...pendingLoansAmountStore };
      const newOwnerMindset = { ...ownerMindsetStore };
      const newSourceName = { ...sourcePersonNameStore };
      const newSourceCountry = { ...sourcePersonTypeStore }; // re-using for country code
      const newSourceMobile = { ...sourcePersonMobileStore };
      const newAgreePaper = { ...agreementPaperStore };
      const newAgreeType = { ...agreementTypeStore };
      const newAgreePrice = { ...agreementPriceStore };
      const newPrevTransType = { ...prevTransactionsTypeStore };
      const newPrevTransPrice = { ...prevTransactionsPriceStore };

      Object.values(backendData).forEach((item: any) => {
        if (!item.description) return;
        // Find matching tabId by comparing the API's description to our tab IDs (converting hyphens to underscores)
        const tabId = Object.keys(TAB_CODE_MAPPING).find(key => key.replace(/-/g, '_') === item.description);
        if (!tabId) return;

        if (item.uploaded) {
          newCompleted[tabId] = true;
        }

        const activeVersion = item.versions?.[0];
        if (activeVersion) {
          newComments[tabId] = activeVersion.remarks || "";

          if (tabId === "any-issues") {
            newAnyIssues[tabId] = (activeVersion.is_any_issues_available === 1 || activeVersion.is_any_issues_available === "1") ? "Available" : "Not Available";
          } else if (tabId === "local-liabilities") {
            newLocalLiab[tabId] = (activeVersion.is_local_liabilities_available === 1 || activeVersion.is_local_liabilities_available === "1") ? "Available" : "Not Available";
          } else if (tabId === "any-pending-loans") {
            newPendingType[tabId] = (activeVersion.is_bank_loans_available === 1 || activeVersion.is_bank_loans_available === "1") ? "Available" : "Not Available";
            newPendingAmount[tabId] = activeVersion.loan_amount || "";
          } else if (tabId === "owner-mindset") {
            newOwnerMindset[tabId] = String(activeVersion.owner_mindset_id || "");
          } else if (tabId === "source-person") {
            newSourceName[tabId] = activeVersion.person_name || "";
            newSourceCountry[tabId] = activeVersion.country_code || "+91";
            newSourceMobile[tabId] = activeVersion.mobile || "";
          } else if (tabId === "agreements") {
            newAgreePaper[tabId] = (activeVersion.is_agreements_available === 1 || activeVersion.is_agreements_available === "1") ? "Available" : "Not Available";
            if (activeVersion.is_legal_agreement === "1" || activeVersion.is_legal_agreement === 1) newAgreeType[tabId] = "Legal";
            if (activeVersion.is_verbal_agreement === "1" || activeVersion.is_verbal_agreement === 1) newAgreeType[tabId] = "Verbal";
            newAgreePrice[tabId] = activeVersion.agreement_price || "";
          } else if (tabId === "previous-transactions") {
            newPrevTransType[tabId] = (activeVersion.is_previous_transactions_available === 1 || activeVersion.is_previous_transactions_available === "1") ? "Available" : "Not Available";
            newPrevTransPrice[tabId] = activeVersion.last_transaction_price || "";
          }
        }
      });

      setCompletedTabs(newCompleted);
      setCommentsStore(newComments);
      setAnyIssuesTypeStore(newAnyIssues);
      setLocalLiabilitiesTypeStore(newLocalLiab);
      setPendingLoansTypeStore(newPendingType);
      setPendingLoansAmountStore(newPendingAmount);
      setOwnerMindsetStore(newOwnerMindset);
      setSourcePersonNameStore(newSourceName);
      setSourcePersonTypeStore(newSourceCountry);
      setSourcePersonMobileStore(newSourceMobile);
      setAgreementPaperStore(newAgreePaper);
      setAgreementTypeStore(newAgreeType);
      setAgreementPriceStore(newAgreePrice);
      setPrevTransactionsTypeStore(newPrevTransType);
      setPrevTransactionsPriceStore(newPrevTransPrice);
    }
  }, [statusData]);


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
      newFiles.push({ id: Date.now().toString() + i, name: file.name, size: sizeStr, progress: 0, status: "uploading", imageType });
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
      const docType = TAB_CODE_MAPPING[activeTabId];
      
      switch (activeTabId) {
        case "any-issues":
          await uploadAnyIssues({
            farmlandId: numericId,
            is_any_issues_available: anyIssuesTypeStore[activeTabId] || "Not Available",
            remarks: currentTabComment,
            docType,
            version: 1
          }).unwrap();
          break;
        case "local-liabilities":
          await uploadLocalLiabilities({
            farmlandId: numericId,
            is_local_liabilities_available: localLiabilitiesTypeStore[activeTabId] === "1" ? 1 : 0,
            remarks: currentTabComment,
            docType,
            version: 1
          }).unwrap();
          break;
        case "any-pending-loans":
          await uploadPendingLoans({
            farmlandId: numericId,
            is_bank_loans_available: pendingLoansTypeStore[activeTabId] === "1" ? 1 : 0,
            loan_amount: pendingLoansAmountStore[activeTabId] || "",
            remarks: currentTabComment,
            docType,
            version: 1
          }).unwrap();
          break;
        case "owner-mindset":
          await uploadOwnerMindset({
            farmlandId: numericId,
            owner_mindset_id: ownerMindsetStore[activeTabId] ? parseInt(ownerMindsetStore[activeTabId]) : 1,
            remarks: currentTabComment,
            docType,
            version: 1
          }).unwrap();
          break;
        case "source-person":
          await uploadSourcePerson({
            farmlandId: numericId,
            source_person_id: 1, // Hardcoded as requested
            person_name: sourcePersonNameStore[activeTabId] || "",
            country_code: sourcePersonTypeStore[activeTabId] || "+91",
            mobile: sourcePersonMobileStore[activeTabId] || "",
            remarks: currentTabComment,
            docType,
            version: 1
          }).unwrap();
          break;
        case "agreements":
          await uploadAgreements({
            farmlandId: numericId,
            is_agreements_available: agreementPaperStore[activeTabId] === "Available" ? 1 : 0,
            is_legal_agreement: agreementTypeStore[activeTabId] === "Legal" ? 1 : 0,
            is_verbal_agreement: agreementTypeStore[activeTabId] === "Verbal" ? 1 : 0,
            agreement_price: agreementPriceStore[activeTabId] || "",
            remarks: currentTabComment,
            docType,
            version: 1
          }).unwrap();
          break;
        case "previous-transactions":
          await uploadPreviousTransactions({
            farmlandId: numericId,
            is_previous_transactions_available: prevTransactionsTypeStore[activeTabId] === "Available" ? 1 : 0,
            last_transaction_price: prevTransactionsPriceStore[activeTabId] || "",
            remarks: currentTabComment,
            docType,
            version: 1
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
        isFinishStep={activeTabId === TABS[TABS.length - 1].id}
        isUploading={isUploading}
        
        // Master Data
        ownerMindsetOptions={masterData?.ownerMindsetResult || []}

        // Local Intelligence Specific Props
        anyIssuesTypeValue={anyIssuesTypeStore[activeTabId] || ""}
        onAnyIssuesTypeChange={(v) => setAnyIssuesTypeStore(p => ({ ...p, [activeTabId]: v }))}
        localLiabilitiesTypeValue={localLiabilitiesTypeStore[activeTabId] || ""}
        onLocalLiabilitiesTypeChange={(v) => setLocalLiabilitiesTypeStore(p => ({ ...p, [activeTabId]: v }))}
        pendingLoansTypeValue={pendingLoansTypeStore[activeTabId] || ""}
        onPendingLoansTypeChange={(v) => setPendingLoansTypeStore(p => ({ ...p, [activeTabId]: v }))}
        pendingLoansAmountValue={pendingLoansAmountStore[activeTabId] || ""}
        onPendingLoansAmountChange={(v) => setPendingLoansAmountStore(p => ({ ...p, [activeTabId]: v }))}
        ownerMindsetValue={ownerMindsetStore[activeTabId] || ""}
        onOwnerMindsetChange={(v) => setOwnerMindsetStore(p => ({ ...p, [activeTabId]: v }))}
        sourcePersonTypeValue={sourcePersonTypeStore[activeTabId] || ""}
        onSourcePersonTypeChange={(v) => setSourcePersonTypeStore(p => ({ ...p, [activeTabId]: v }))}
        sourcePersonNameValue={sourcePersonNameStore[activeTabId] || ""}
        onSourcePersonNameChange={(v) => setSourcePersonNameStore(p => ({ ...p, [activeTabId]: v }))}
        sourcePersonMobileValue={sourcePersonMobileStore[activeTabId] || ""}
        onSourcePersonMobileChange={(v) => setSourcePersonMobileStore(p => ({ ...p, [activeTabId]: v }))}
        agreementPaperValue={agreementPaperStore[activeTabId] || ""}
        onAgreementPaperChange={(v) => setAgreementPaperStore(p => ({ ...p, [activeTabId]: v }))}
        agreementTypeValue={agreementTypeStore[activeTabId] || ""}
        onAgreementTypeChange={(v) => setAgreementTypeStore(p => ({ ...p, [activeTabId]: v }))}
        agreementPriceValue={agreementPriceStore[activeTabId] || ""}
        onAgreementPriceChange={(v) => setAgreementPriceStore(p => ({ ...p, [activeTabId]: v }))}
        prevTransactionsTypeValue={prevTransactionsTypeStore[activeTabId] || ""}
        onPrevTransactionsTypeChange={(v) => setPrevTransactionsTypeStore(p => ({ ...p, [activeTabId]: v }))}
        prevTransactionsPriceValue={prevTransactionsPriceStore[activeTabId] || ""}
        onPrevTransactionsPriceChange={(v) => setPrevTransactionsPriceStore(p => ({ ...p, [activeTabId]: v }))}
      />

      

      {showSubmittedModal && (
        <UploadSubmittedModal

          title="Local Intelligence Submitted"
          description={<>Proceed to complete the upload process.</>}
          onProceed={async () => {
            if (!masterData) return;
            try {
              const apprvdStatus = masterData.milestoneStageStatusResult?.find((s: any) => s.code === "APPRVD");
              const sadminStage = masterData.milestoneStagesResult?.find((s: any) => s.code === "SADMIN");
              
              await submitFarmland({
                farmlandId: numericId,
                master_milestone_stage_id: sadminStage?.id || 1,
                master_milestone_stage_status_id: apprvdStatus?.id || 1,
                userId: userId,
                forSale: (farmlandDetails?.data?.is_verification_farmland ?? farmlandDetails?.is_verification_farmland) ? 0 : 1
              }).unwrap();
              
              setShowSubmittedModal(false);
              setShowSuccessModal(true);
            } catch (error) {
              console.error("Failed to submit farmland:", error);
            }
          }}
          onDismiss={() => setShowSubmittedModal(false)}
        />
      )}

      {/* ── Success Modal (Final Step) ── */}
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
              All pipeline documents for <span className="text-[#0052cc]">{farmlandId}</span> have been successfully uploaded!
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
    </>
  );
};

export default UploadLocalIntelligence;
