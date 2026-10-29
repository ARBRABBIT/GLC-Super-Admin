import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useGetFarmlandByIdQuery } from "@/features/super-admin/api/farmland.api";

export type UploadStepId =
  | "customer-information"
  | "legal-documents"
  | "agriculture-report"
  | "land-boundaries"
  | "valuation"
  | "local-intelligence";

interface UploadShortTimelineSidebarProps {
  farmlandId: string;
  activeStep: UploadStepId;
  style?: React.CSSProperties;
  className?: string;
}

const PIPELINE_STEPS: { id: UploadStepId; label: string }[] = [
  { id: "customer-information", label: "Customer Information" },
  { id: "legal-documents", label: "Legal Documents" },
  { id: "agriculture-report", label: "Agriculture & Report" },
  { id: "land-boundaries", label: "Land & Boundaries" },
  { id: "valuation", label: "Valuation" },
  { id: "local-intelligence", label: "Local Intelligence" },
];

export const UploadShortTimelineSidebar: React.FC<UploadShortTimelineSidebarProps> = ({
  farmlandId,
  activeStep,
  style,
  className = "",
}) => {
  const navigate = useNavigate();
  const { data: response } = useGetFarmlandByIdQuery({ farmlandId }, {
    skip: !farmlandId,
  });
  const farmlandData = response?.data || response?.result;

  const displayCode =
    farmlandData?.farmLandCode || farmlandData?.farmland_code || farmlandData?.customId || "GLCSOS 01";

  const activeIndex = PIPELINE_STEPS.findIndex((s) => s.id === activeStep);

  const handleStepClick = (stepId: UploadStepId) => {
    navigate(`/super-admin/upload/process/${farmlandId}/${stepId}`);
  };

  return (
    <div
      className={cn(
        "relative box-border bg-white rounded-[24px] shadow-[0px_20px_40px_rgba(0,49,50,0.06)] px-8 py-10 flex flex-col select-none shrink-0 overflow-y-auto",
        className
      )}
      style={style}
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

        {PIPELINE_STEPS.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <div
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className="relative flex flex-row items-center gap-6 py-[22px] z-10 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0 relative bg-white">
                {isCompleted ? (
                  // Completed Step: Solid green circle with white checkmark
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
                  // Active Step: Solid dark green dot with light green ring
                  <div className="w-full h-full rounded-full box-border bg-[#2D3409] border-[2px] border-[rgba(122,_149,_28,_0.8)] shadow-[0_0_0_4px_rgba(189,_211,_39,_0.38)]" />
                ) : (
                  // Pending Step: Light green ring with small green dot
                  <div className="w-[20px] h-[20px] rounded-full box-border flex items-center justify-center border-[2px] border-[#BDD327] bg-white">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#BDD327]" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-1 w-full pr-4">
                <span
                  className={`font-['Plus_Jakarta_Sans'] font-bold uppercase tracking-wider text-[0.75rem] leading-tight break-words whitespace-normal ${
                    isActive ? "text-[#2A3008]" : "text-[#8C9088]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UploadShortTimelineSidebar;
