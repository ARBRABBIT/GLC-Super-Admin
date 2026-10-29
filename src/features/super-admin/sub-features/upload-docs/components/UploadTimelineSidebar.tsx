import React from "react";
import { useGetFarmlandByIdQuery } from "@/features/super-admin/api/farmland.api";

export type UploadStepId =
  | "customer-information"
  | "legal-documents"
  | "agriculture-report"
  | "land-boundaries"
  | "valuation"
  | "local-intelligence";

interface UploadTimelineSidebarProps {
  farmlandId: string;
  activeStep: UploadStepId;
  style?: React.CSSProperties;
  className?: string;
}

const steps: { id: UploadStepId; label: string }[] = [
  { id: "customer-information", label: "Customer Information" },
  { id: "legal-documents", label: "Legal Documents" },
  { id: "agriculture-report", label: "Agriculture Report" },
  { id: "land-boundaries", label: "Land & Boundaries" },
  { id: "valuation", label: "Valuation" },
  { id: "local-intelligence", label: "Local Intelligence" },
];

export const UploadTimelineSidebar: React.FC<UploadTimelineSidebarProps> = ({
  farmlandId,
  activeStep,
  style,
  className = "",
}) => {
  const { data: farmlandDetails } = useGetFarmlandByIdQuery({ farmlandId });
  const displayCode = farmlandDetails?.data?.farmland_code || farmlandId;

  return (
    <div 
      className={`bg-white rounded-[clamp(0.8rem,1.67vw,2.0rem)] shadow-[0px_20px_40px_rgba(0,49,50,0.06)] p-[clamp(1.07rem,2.22vw,2.5rem)] flex flex-col select-none w-full md:w-[clamp(13.68rem,28.5vw,28.0rem)] shrink-0 ${className}`}
      style={{
        minHeight: "clamp(27.36rem,57vw,58.0rem)",
        ...style
      }}
    >
      {/* ── Farmland ID Header ── */}
      <div className="flex flex-col mb-[clamp(1.5rem,3.1vw,3.75rem)] w-full">
        <span className="font-['Outfit'] font-normal text-[clamp(0.6rem,1.25vw,1.5rem)] text-gray-900 leading-none">
          Farmland Code:
        </span>
        <span className="font-['Outfit'] font-normal text-[clamp(1.5rem,3vw,3.5rem)] text-gray-900 leading-none break-all mt-1">
          {displayCode}
        </span>
      </div>

      {/* ── Timeline Steps ── */}
      <div className="relative flex-1 flex flex-col justify-between py-2 pl-1 min-h-[clamp(16.66rem,34.7vw,36.0rem)]">
        
        {/* Timeline Vertical Line */}
        <div 
          className="absolute border-l border-[rgba(44,44,44,0.25)]"
          style={{
            left: "clamp(0.36rem,0.76vw,0.85rem)",
            top: "16px",
            bottom: "16px",
            width: "0px"
          }}
        />

        {steps.map((step) => {
          const isActive = step.id === activeStep;

          return (
            <div 
              key={step.id} 
              className="relative flex flex-row items-center gap-[clamp(0.8rem,1.67vw,2.0rem)] z-10 py-2"
            >
              {/* Indicator Dot */}
              <div 
                className="w-[clamp(0.73rem,1.53vw,1.65rem)] h-[clamp(0.73rem,1.53vw,1.65rem)] flex items-center justify-center relative shrink-0"
              >
                {isActive && (
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(255, 255, 255, 0.002)",
                      boxShadow: "0px 0px 0px clamp(4px,0.42vw,8px) rgba(189, 211, 39, 0.38)"
                    }}
                  />
                )}
                <div 
                  className="w-[clamp(0.47rem,0.97vw,1.1rem)] h-[clamp(0.47rem,0.97vw,1.1rem)] rounded-full transition-all duration-300 relative z-10"
                  style={{
                    boxSizing: "border-box",
                    backgroundColor: isActive ? "#2D3409" : "#C0C2B7",
                    border: isActive ? "2px solid rgba(122, 149, 28, 0.8)" : "2px solid #CAD69F",
                  }}
                />
              </div>

              {/* Step Label */}
              <span 
                className="font-['Plus_Jakarta_Sans'] font-semibold uppercase tracking-wider leading-none text-left"
                style={{
                  fontSize: isActive ? "clamp(0.6rem,1.25vw,1.6rem)" : "clamp(0.47rem,0.97vw,1.2rem)",
                  color: isActive ? "#2A3008" : "#5A5C5E",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UploadTimelineSidebar;
