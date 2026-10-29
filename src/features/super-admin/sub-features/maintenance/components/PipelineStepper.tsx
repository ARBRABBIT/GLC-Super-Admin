import React, { useState } from "react";
import { Mail, AlertTriangle, RefreshCw, Users, ClipboardCheck, ChevronRight } from "lucide-react";
import type { PipelineStage } from "../types/maintenance.types";
import { PipelineDetailModal } from "./PipelineDetailModal";

interface PipelineStepperProps {
  stages: PipelineStage[];
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({ stages }) => {
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);

  const renderIcon = (iconName: string, iconColor: string) => {
    const props = { className: "w-5 h-5", style: { color: iconColor } };
    switch (iconName) {
      case "mail":
        return <Mail {...props} />;
      case "alert":
        return <AlertTriangle {...props} />;
      case "sync":
        return <RefreshCw {...props} />;
      case "team":
        return <Users {...props} />;
      case "clipboard":
        return <ClipboardCheck {...props} />;
      default:
        return <Mail {...props} />;
    }
  };

  return (
    <div className="w-full mt-8">
      {/* ── Section Header ─────────────────────────────────────────────────── */}
      <div className="mb-4">
        <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[20px] sm:text-[22px] leading-tight text-[#1A1C1D] m-0">
          Service Request &amp; Work Order Pipeline
        </h2>
        <p className="font-['Plus_Jakarta_Sans'] text-[13px] sm:text-[14px] text-[#7A8699] font-normal mt-1 m-0">
          Manage and track service requests &amp; work orders across all mandals.
        </p>
      </div>

      {/* ── Pipeline Cards Grid Container ──────────────────────────────────── */}
      <div className="bg-white rounded-[24px] border border-[#ECEFF2] p-4 sm:p-5 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[860px] gap-2">
          {stages.map((stage, index) => {
            const isLast = index === stages.length - 1;

            return (
              <React.Fragment key={stage.id}>
                {/* ── Single Pipeline Card ─────────────────────────────────────── */}
                <div
                  onClick={() => setSelectedStage(stage)}
                  className="flex-1 min-w-[160px] bg-white rounded-[18px] border border-[#E9ECEF] hover:border-[#1E75BB]/40 p-4 transition-all duration-200 hover:shadow-md cursor-pointer relative group flex flex-col justify-between h-[100px]"
                >
                  {/* Top Row: Icon + Count Badge */}
                  <div className="flex items-center justify-between w-full">
                    {/* Square Icon Container */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ backgroundColor: stage.iconBgColor }}
                    >
                      {renderIcon(stage.iconName, stage.iconColor)}
                    </div>

                    {/* Blue Circle Count Badge */}
                    <div className="w-6 h-6 rounded-full bg-[#1E75BB] text-white flex items-center justify-center font-['Plus_Jakarta_Sans'] font-bold text-[11px] shadow-xs">
                      {stage.count}
                    </div>
                  </div>

                  {/* Bottom Row: Title + Subtitle */}
                  <div className="flex flex-col mt-2">
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] leading-tight text-[#1A1C1D] group-hover:text-[#1E75BB] transition-colors">
                      {stage.title}
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-medium text-[#7A8699] leading-tight mt-0.5">
                      {stage.subtitle}
                    </span>
                  </div>
                </div>

                {/* ── Chevron Divider (between cards) ─────────────────────────── */}
                {!isLast && (
                  <div className="flex items-center justify-center text-[#D1D5DB] px-1 shrink-0">
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Modal on Click */}
      <PipelineDetailModal
        stage={selectedStage}
        onClose={() => setSelectedStage(null)}
      />
    </div>
  );
};
