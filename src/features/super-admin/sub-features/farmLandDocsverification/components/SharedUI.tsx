import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import type { DocumentTab } from '@/features/super-admin/types/legal-docs';
import { BackButton } from '@/components/ui/BackButton';
import UploadProfileAvatar from '../../upload-docs/components/UploadProfileAvatar';
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from 'react';

import { useDraftFarmlandMutation } from '@/features/super-admin/api/farmlandAction.api';
import { useGetAllMasterDataQuery } from '@/features/super-admin/api/masterData.api';
import { useGetFarmlandByIdQuery } from '@/features/super-admin/api/farmland.api';

// ─── Page Header (Back button + Bell + Avatar) ───────────────────────────────

export const PageHeader: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const farmlandId = id || "1";
  
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [draftFarmland, { isLoading: isDrafting }] = useDraftFarmlandMutation();
  const { data: masterData } = useGetAllMasterDataQuery();
  const hasDrafted = useRef(false);

  useEffect(() => {
    if (masterData && !hasDrafted.current) {
      hasDrafted.current = true;
      const sadminStage = masterData.milestoneStagesResult?.find((s: any) => s.code === "SADMIN");
      const inprgsStatus = masterData.milestoneStageStatusResult?.find((s: any) => s.code === "INPRGS");
      
      const numericId = parseInt(farmlandId.replace(/[^0-9]/g, "")) || 1;
      
      draftFarmland({
        farmlandId: numericId,
        master_milestone_stage_id: sadminStage?.id || 1,
        master_milestone_stage_status_id: inprgsStatus?.id || 1,
        is_draft: 1
      }).catch(err => console.error("Failed to auto-draft farmland:", err));
    }
  }, [masterData, farmlandId, draftFarmland]);

  const handleGoBack = () => {
    setIsDraftModalOpen(true);
  };

  const confirmDraft = async () => {
    if (!masterData) return;
    try {
      const sadminStage = masterData.milestoneStagesResult?.find((s: any) => s.code === "SADMIN");
      const inprgsStatus = masterData.milestoneStageStatusResult?.find((s: any) => s.code === "INPRGS");
      
      const numericId = parseInt(farmlandId.replace(/[^0-9]/g, "")) || 1;
      
      await draftFarmland({
        farmlandId: numericId,
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

  return (
    <>
      <BackButton
        onClick={handleGoBack}
        label="Go back to dashboard"
      />
      <UploadProfileAvatar />

      {isDraftModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[rgba(0,0,0,0.2)] shadow-[0px_0px_12.5px_rgba(0,0,0,0.15)] rounded-[24px] flex flex-col p-[clamp(1.5rem,3.125vw,2.5rem)] max-w-sm w-full mx-4 text-center">
            <h3 className="font-['Manrope'] font-bold text-xl text-[#1A1C1D] mb-4">
              Save to Draft?
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-[#5A5C5E] mb-8">
              Are you sure you want to save this verification process to draft?
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
    </>
  );
};

// ─── Stepper Sidebar ──────────────────────────────────────────────────────────

export const StepperSidebar: React.FC<{
  farmlandId: string;
}> = ({ farmlandId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: farmlandDetails } = useGetFarmlandByIdQuery({ farmlandId });
  const displayCode = farmlandDetails?.data?.farmland_code || farmlandId;

  const steps = [
    { id: 'customer-information', name: 'CUSTOMER INFORMATION', routePath: 'customer-information' },
    { id: 'legal-documents', name: 'LEGAL DOCUMENTS', routePath: 'legal-documents' },
    { id: 'agriculture-report', name: 'AGRICULTURE REPORT', routePath: 'agriculture-report' },
    { id: 'land-boundaries', name: 'LAND & BOUNDARIES', routePath: 'land-boundaries' },
    { id: 'valuation', name: 'VALUATION', routePath: 'valuation' },
    { id: 'local-intelligence', name: 'LOCAL INTELLIGENCE', routePath: 'local-intelligence' },
  ];

  const activeIndex = steps.findIndex(s => location.pathname.includes(s.routePath));

  const onNavigate = (routePath: string) => {
    navigate(`/super-admin/assigned-farmlands/${farmlandId}/${routePath}`);
  };

  return (
    <div
      className={cn(
        "relative box-border bg-white rounded-[24px] shadow-[0px_20px_40px_rgba(0,49,50,0.06)] px-8 py-10 flex flex-col select-none shrink-0 overflow-y-auto w-[280px] h-full"
      )}
    >
      {/* ── Farmland ID Header ── */}
      <div className="flex flex-col gap-1 mb-8">
        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[0.85rem] leading-tight text-[#1A1C1D]">
          Farmland ID:
        </span>
        <h3 className="font-['Plus_Jakarta_Sans'] text-[1.6rem] leading-tight text-[#1A1C1D] font-medium break-all">
          {displayCode}
        </h3>
      </div>

      {/* ── Full Timeline Container ── */}
      <div className="relative flex flex-col">
        {/* Timeline Vertical Line */}
        <div className="absolute border-l border-[rgba(44,44,44,0.15)] left-[9px] top-[14px] bottom-[14px] w-0" />

        {steps.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <div
              key={step.id}
              onClick={() => onNavigate(step.routePath)}
              className="relative flex flex-row items-center gap-6 py-[22px] z-10 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0 relative bg-white">
                {isCompleted ? (
                  // Completed Step
                  <div className="w-[20px] h-[20px] rounded-full flex items-center justify-center bg-[#BDD327]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="4"
                      className="w-[10px] h-[10px]"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isActive ? (
                  // Active Step
                  <div className="w-full h-full rounded-full box-border bg-[#2D3409] border-[2px] border-[rgba(122,_149,_28,_0.8)] shadow-[0_0_0_4px_rgba(189,_211,_39,_0.38)]" />
                ) : (
                  // Incomplete Step
                  <div className="w-full h-full rounded-full box-border bg-[#E5E9D8] border border-transparent shadow-[0_0_0_2px_rgba(255,_255,_255,_1)]" />
                )}
              </div>

              <span
                className={cn(
                  "font-['Plus_Jakarta_Sans'] text-[0.8rem] leading-tight",
                  isActive ? "text-[#1A1C1D] font-bold" : "text-[#1A1C1D] font-medium opacity-60"
                )}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* <div className="mt-16 flex justify-center">
        <button
          onClick={() => navigate({ search: '?openSummary=true' })}
          className="w-full py-4 rounded-full text-[#2B3024] bg-[#E1E8B0] font-bold tracking-wide hover:opacity-90 hover:shadow-md transition-all text-sm uppercase"
        >
          Check Final Status
        </button>
      </div> */}
    </div>
  );
};

// ─── Tabs Card ────────────────────────────────────────────────────────────────

export const TabsCard: React.FC<{
  tabs: DocumentTab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
}> = ({ tabs, activeTabId, onTabClick }) => (
  <div
    className="bg-white rounded-3xl shadow-[0px_20px_40px_rgba(0,_49,_50,_0.06)] flex flex-col select-none shrink-0 overflow-hidden box-border h-full w-[320px]"
  >
    {/* Heading (Fixed) */}
    <div className="px-6 py-6 border-b border-gray-100 shrink-0">
      <h3 className="font-sans font-bold text-base md:text-lg text-[#1A1C1D] leading-tight m-0">
        Section List
      </h3>
      <p className="font-sans text-xs md:text-sm text-[#5A5C5E] mt-1 m-0">
        Select a report section to continue
      </p>
    </div>

    {/* Vertical Tab List (Scrollable) */}
    <div className="flex flex-col py-2 flex-1 overflow-y-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isApproved = tab.status === 'approved';
        const isRejected = tab.status === 'rejected';

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabClick(tab.id)}
            className={`flex items-center gap-3 px-6 py-3.5 cursor-pointer transition-all duration-200 select-none text-left ${isActive ? "bg-[#F4F7E6] border-r-[3px] border-[#BDD327]" : "hover:bg-gray-50 border-r-[3px] border-transparent"}`}
          >
            {/* Indicator Dot / Checkmark Badge */}
            {isApproved ? (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-[#BDD327] shrink-0"
              >
                <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-13 5l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            ) : isRejected ? (
              <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center box-border bg-red-100 text-red-600">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </div>
            ) : (
              <div
                className={`rounded-full shrink-0 flex items-center justify-center box-border w-5 h-5 ${isActive ? "bg-[#E6EEAD]" : "bg-[#E1E5EF]"}`}
              >
                <div
                  className={`rounded-full w-[40%] h-[40%] ${isActive ? "bg-[#2D3409]" : "bg-[#C0C2B7]"}`}
                />
              </div>
            )}

            {/* Tab Label */}
            <span
              className={`font-sans font-semibold leading-none text-sm ${isActive ? "text-[#2D3409]" : isRejected ? "text-red-600" : "text-[#5A5C5E]"}`}
            >
              {tab.label}
            </span>

            {/* Active Arrow */}
            {isActive && (
              <svg className="w-4 h-4 text-[#2D3409] ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Comments Section ─────────────────────────────────────────────────────────

export const CommentsSection: React.FC<{ comment: string; title?: string; className?: string }> = ({ comment, title = "Comments", className }) => (
  <div className={`flex flex-col relative w-full h-[140px] ${className || 'flex-1'}`}>
    <h3 className="text-base font-semibold text-gray-900 mb-3 px-1">{title}</h3>
    <div className="relative w-full flex-1">
      <div className="box-border absolute w-full h-full left-0 top-0 bg-[rgba(230,238,173,0.2)] border border-[#E6EEAD] rounded-[12px] z-[0]" />
      <div className="absolute inset-0 p-4 overflow-y-auto text-black font-sans text-[14px] leading-relaxed z-[1]">
        {comment}
      </div>
    </div>
  </div>
);

// ─── Footer Actions (Reject + Approve) ───────────────────────────────────────

export const FooterActions: React.FC<{
  isApproved: boolean;
  isRejected?: boolean;
  revertReason?: string | null;
  onReject: () => void;
  onApprove: () => void;
  isSubmitting?: boolean;
}> = ({ onReject, onApprove, isSubmitting = false, isRejected = false, revertReason }) => (
  <div className="flex justify-between items-center mt-auto pt-6 border-t border-gray-100 w-full shrink-0 bg-white">
    <div className="flex items-center gap-3">
      {isRejected && (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 text-sm font-bold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          Reverted
        </span>
      )}
      {isRejected && revertReason && (
        <span className="text-sm text-red-600 font-medium max-w-md truncate" title={revertReason}>
          Reason: {revertReason}
        </span>
      )}
    </div>
    <div className="flex gap-5">
      <button
        onClick={onReject}
        disabled={isSubmitting}
        className={`px-6 py-2.5 rounded-full border border-red-200 text-red-600 text-sm font-semibold bg-white transition-all shadow-sm ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-50 hover:text-red-700 hover:border-red-300"
        }`}
      >
        REJECT
      </button>
      <button
        onClick={onApprove}
        disabled={isSubmitting}
        className={`px-8 py-2.5 rounded-full text-white text-sm font-semibold transition-all shadow-sm ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 hover:shadow-md"
        }`}
        style={{
          background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)",
        }}
      >
        {isSubmitting ? "PROCESSING..." : "APPROVE"}
      </button>
    </div>
  </div>
);
