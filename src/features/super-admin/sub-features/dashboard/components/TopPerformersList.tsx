import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { TopPerformer } from '@/features/super-admin/types/dashboard';
import { useNavigate } from "react-router-dom";

interface Props {
  performers: TopPerformer[];
}

const TopPerformersList: React.FC<Props> = ({ performers }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate('/super-admin/top-performers')}
      className={cn(
        "flex flex-col justify-center items-center box-border overflow-hidden w-full",
        "bg-[color:var(--surface-card)] rounded-[24px] shadow-[var(--shadow-card)]",
        "min-h-[294px] h-full",
        "p-[16px]",
        "gap-[8px]",
        "cursor-pointer hover:shadow-md transition-shadow"
      )}
     >
      <p className="m-0 font-inter font-semibold text-[clamp(0.875rem,1.2vw,1.125rem)] text-[var(--text-primary)] mb-4 w-full text-left">
        Top Performer's List
      </p>

      {/* Performer avatars row */}
      <div className="flex items-end justify-center w-full gap-3 lg:gap-6 overflow-x-auto pb-2">
        {performers.map((performer) => (
          <div
            key={performer.id}
            className={cn(
  "flex flex-col items-center shrink-0 bg-[#F5F5F5] rounded-[24px] transition-transform duration-200",
  performer.isTopPerformer
    ? "w-[120px] h-[180px] pt-4 pb-3 px-2"
    : "w-[100px] h-[145px] pt-4 pb-3 px-2"
)}
          >
            {/* Avatar */}
            <div
              className={cn(
                "relative rounded-full overflow-hidden",
                performer.isTopPerformer
                  ? "w-16 h-16 lg:w-[4.5rem] lg:h-[4.5rem] ring-3 ring-[#8B9A46] ring-offset-2"
                  : "w-12 h-12 lg:w-14 lg:h-14",
              )}
            >
              <img
                src={performer.avatar}
                alt={performer.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".avatar-fallback")) {
                    const fallback = document.createElement("div");
                    fallback.className =
                      "avatar-fallback w-full h-full flex items-center justify-center bg-[#E8EAE0] text-[var(--text-primary)] font-inter font-semibold text-sm";
                    fallback.textContent = performer.name
                      .split(".")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>

            {/* Name */}
            <span
              className={cn(
                "font-inter text-center leading-tight",
                performer.isTopPerformer
                  ? "font-semibold text-[0.75rem] lg:text-[0.8125rem] text-[var(--text-primary)]"
                  : "font-normal text-[0.6875rem] lg:text-[0.75rem] text-[var(--text-muted)]",
              )}
            >
              {performer.name}
            </span>

            {/* Amount */}
            <span
              className={cn(
                "font-inter font-bold leading-tight",
                performer.isTopPerformer
                  ? "text-[0.875rem] lg:text-[1rem] text-[var(--text-primary)]"
                  : "text-[0.75rem] lg:text-[0.8125rem] text-[var(--text-primary)]",
              )}
            >
              {performer.amount}
            </span>

            {/* TOP PERFORMER badge */}
            {performer.isTopPerformer && (
              <span className="bg-[#2D3032] text-white font-inter font-bold text-[0.5rem] lg:text-[0.5625rem] px-2 py-0.5 rounded-md uppercase tracking-wider">
                Top Performer
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopPerformersList;
