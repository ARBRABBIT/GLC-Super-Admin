import React, { useState, useEffect, useRef } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { BackButton } from "@/components/ui/BackButton";
import UploadProfileAvatar from "./components/UploadProfileAvatar";
import UploadShortTimelineSidebar, { type UploadStepId } from "./components/UploadShortTimelineSidebar";
import { useDraftFarmlandMutation } from "@/features/super-admin/api/farmlandAction.api";
import { useGetAllMasterDataQuery } from "@/features/super-admin/api/masterData.api";

export const UploadDocsRoot: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const farmlandId = id || "GLCSOS-05";
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [draftFarmland, { isLoading: isDrafting }] = useDraftFarmlandMutation();
  const { data: masterData } = useGetAllMasterDataQuery();
  const hasDrafted = useRef(false);

  useEffect(() => {
    if (masterData && !hasDrafted.current) {
      hasDrafted.current = true;
      const sadminStage = masterData.milestoneStagesResult?.find((s: any) => s.code === "SADMIN");
      const inprgsStatus = masterData.milestoneStageStatusResult?.find((s: any) => s.code === "INPRGS");
      
      draftFarmland({
        farmlandId: parseInt(farmlandId.replace(/[^0-9]/g, "")) || 1,
        master_milestone_stage_id: sadminStage?.id || 1,
        master_milestone_stage_status_id: inprgsStatus?.id || 1,
        is_draft: 1
      }).catch(err => console.error("Failed to auto-draft farmland:", err));
    }
  }, [masterData, farmlandId, draftFarmland]);

  // Determine active step from URL
  const pathParts = location.pathname.split("/");
  const currentStepString = pathParts[pathParts.length - 1];
  
  // Validate the current step
  const validSteps = [
    "customer-information",
    "legal-documents",
    "agriculture-report",
    "land-boundaries",
    "valuation",
    "local-intelligence"
  ];
  
  const activeStep = validSteps.includes(currentStepString) 
    ? (currentStepString as UploadStepId) 
    : "customer-information";

  const handleGoBack = () => {
    setIsDraftModalOpen(true);
  };

  const confirmDraft = async () => {
    if (!masterData) return;
    try {
      const sadminStage = masterData.milestoneStagesResult?.find((s: any) => s.code === "SADMIN");
      const inprgsStatus = masterData.milestoneStageStatusResult?.find((s: any) => s.code === "INPRGS");
      
      await draftFarmland({
        farmlandId: parseInt(farmlandId.replace(/[^0-9]/g, "")) || 1,
        master_milestone_stage_id: sadminStage?.id || 1,
        master_milestone_stage_status_id: inprgsStatus?.id || 1,
        is_draft: 1
      }).unwrap();
      
      setIsDraftModalOpen(false);
      navigate("/super-admin/draft-farmlands");
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  };

  const cancelDraft = () => {
    setIsDraftModalOpen(false);
  };



  const handleNextStep = () => {
    const stepIndex = validSteps.indexOf(activeStep);
    if (stepIndex < validSteps.length - 1) {
      const nextStepId = validSteps[stepIndex + 1];
      navigate(`/super-admin/upload/process/${farmlandId}/${nextStepId}`);
    } else {
      // Finished all steps
      navigate("/super-admin/farmlands-list");
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F2F2F2] font-sans flex flex-col">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-10 pt-8 pb-4 shrink-0">
        <BackButton
          onClick={handleGoBack}
          label="Go back to dashboard"
        />
        <UploadProfileAvatar />
      </div>

      {/* Main 3-column layout */}
      <div className="flex items-stretch gap-5 px-10 pb-10 flex-1 min-h-0">
        {/* Column 1: Short Timeline Sidebar */}
        <UploadShortTimelineSidebar
          farmlandId={farmlandId}
          activeStep={activeStep}
          className="w-[280px] shrink-0 h-full"
        />

        {/* Columns 2+3: Outlet renders TabsCard + FilesDocument */}
        <div className="flex-1 min-w-0 min-h-0 h-full flex flex-row gap-5 relative">
          <Outlet context={{ farmlandId, activeStep, onNextStep: handleNextStep }} />
        </div>
      </div>

      {/* Draft Confirmation Modal */}
      {isDraftModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[rgba(0,0,0,0.2)] shadow-[0px_0px_12.5px_rgba(0,0,0,0.15)] rounded-[24px] flex flex-col p-[clamp(1.5rem,3.125vw,2.5rem)] max-w-sm w-full mx-4 text-center">
            <h3 className="font-['Manrope'] font-bold text-xl text-[#1A1C1D] mb-4">
              Save to Draft?
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-[#5A5C5E] mb-8">
              Are you sure you want to save this farmland to draft?
            </p>
            
            <div className="flex gap-4 w-full">
              <button
                onClick={cancelDraft}
                className="flex-1 py-[clamp(0.6rem,1.25vw,1rem)] rounded-full border border-[#D1D5DB] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1C1D] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDraft}
                disabled={isDrafting}
                className="flex-1 py-[clamp(0.6rem,1.25vw,1rem)] rounded-full text-white font-['Plus_Jakarta_Sans'] font-bold flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{
                  background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)",
                }}
              >
                {isDrafting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDocsRoot;
