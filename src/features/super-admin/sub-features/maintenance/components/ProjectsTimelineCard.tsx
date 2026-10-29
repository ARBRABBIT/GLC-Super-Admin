import React from "react";
import type { ProjectTimelineItem } from "../types/maintenance.types";

interface ProjectsTimelineCardProps {
  items: ProjectTimelineItem[];
  onProjectClick?: (item: ProjectTimelineItem) => void;
}

export const ProjectsTimelineCard: React.FC<ProjectsTimelineCardProps> = ({
  items,
  onProjectClick,
}) => {
  return (
    <div className="bg-white rounded-[24px] border border-[#ECEFF2] p-6 shadow-xs flex flex-col justify-between h-full min-h-[380px]">
      {/* ── Card Title ──────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[15px] tracking-[0.05em] text-[#1E252B] uppercase m-0">
          PROJECTS TIMELINE
        </h3>
      </div>

      {/* ── Timeline Items List ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 flex-1 justify-around">
        {items.map((item) => {
          const isBlue = item.themeColor === "blue" || item.progressPercentage > 60;
          const capsuleBg = isBlue
            ? "bg-[#1E75BB] text-white"
            : "bg-[#8CC63F] text-white";

          return (
            <div
              key={item.id}
              onClick={() => onProjectClick?.(item)}
              className="group flex flex-col gap-1.5 cursor-pointer transition-transform hover:translate-x-1"
            >
              {/* Project Label: Code + Category */}
              <div className="font-['Plus_Jakarta_Sans'] text-[12px] uppercase">
                <span className="font-extrabold text-[#1E252B]">{item.code}</span>{" "}
                <span className="font-medium text-[#7A8699]">{item.category}</span>
              </div>

              {/* Progress Capsule Pill with Overlapping Image Previews */}
              <div
                className={`w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] h-[44px] rounded-full ${capsuleBg} flex items-center px-2 py-1 gap-2.5 shadow-xs transition-all group-hover:shadow-md`}
              >
                {/* Overlapping Circles */}
                <div className="flex items-center -space-x-2 pl-1 shrink-0">
                  {item.images.slice(0, 2).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-200 shrink-0 shadow-xs"
                    >
                      <img
                        src={imgUrl}
                        alt="Farmland preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Progress Percentage Text */}
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] tracking-tight whitespace-nowrap pl-1">
                  {item.progressPercentage}% Complete
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
