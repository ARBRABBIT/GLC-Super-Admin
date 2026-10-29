import React from "react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { ArrowRight, Monitor, Smartphone, Crown } from "lucide-react";

export interface SuperAdminUserCardData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  type: "NRI" | "Local";
  isSubscribed: boolean;
  tier: "gold" | "silver" | "bronze"; // for the crown icon color
  source: "Website" | "Mobile";
}

interface Props {
  data: SuperAdminUserCardData;
  onViewProfile?: (id: string) => void;
  className?: string;
}

const SuperAdminUserListCard: React.FC<Props> = ({
  data,
  onViewProfile,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full bg-[color:var(--surface-card)] rounded-[1.5rem] lg:rounded-[2rem] shadow-sm border border-[var(--border-soft)]",
        "px-[1.25rem] lg:px-[1.5rem] xl:px-[2rem]",
        "h-[5rem] lg:h-[5.5rem] xl:h-[6rem]",
        "transition-shadow duration-200 hover:shadow-[0px_24px_48px_rgba(0,49,50,0.10)]",
        className
      )}
    >
      {/* Left Section: Avatar & Info */}
      <div className="flex items-center gap-4 lg:gap-5 xl:gap-6 min-w-0 w-[18rem] lg:w-[22rem] shrink-0">
        <div className="relative rounded-full overflow-hidden w-12 h-12 lg:w-14 lg:h-14 shrink-0">
          <img
            src={data.avatar}
            alt={data.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                data.name
              )}&background=random`;
            }}
          />
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <Typography
            variant="h4"
            className="font-[family-name:var(--font-heading)] font-bold text-[color:var(--text-heading)] leading-none truncate !text-[1rem] lg:!text-[1.0625rem]"
          >
            {data.name}
          </Typography>
          <span className="text-[color:var(--text-secondary)] font-[family-name:var(--font-sans)] leading-none truncate text-[0.75rem] lg:text-[0.8125rem]">
            {data.email}
          </span>
        </div>
      </div>

      {/* Middle Section: Badges */}
      <div className="flex items-center justify-center flex-1 gap-3 lg:gap-4 shrink-0">
        {/* Type Badge */}
        <span className="flex items-center justify-center px-3 lg:px-4 py-1 lg:py-1.5 rounded-full bg-[#F3F4F6] text-[#4B5563] font-inter font-medium text-[0.625rem] lg:text-[0.6875rem] tracking-wide">
          {data.type}
        </span>

        {/* Subscription Badge */}
        {data.isSubscribed ? (
          <span className="flex items-center justify-center px-3 lg:px-4 py-1 lg:py-1.5 rounded-full bg-[#ECFDF5] text-[#059669] font-inter font-medium text-[0.625rem] lg:text-[0.6875rem] tracking-wide">
            Subscribed
          </span>
        ) : (
          <span className="flex items-center justify-center px-3 lg:px-4 py-1 lg:py-1.5 rounded-full bg-[#FEF2F2] text-[#DC2626] font-inter font-medium text-[0.625rem] lg:text-[0.6875rem] tracking-wide">
            Non-Subscribed
          </span>
        )}

        {/* Tier Crown */}
        <div className="flex items-center justify-center w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-white shadow-sm border border-gray-100">
          <Crown
            size={14}
            className={cn(
              "fill-current",
              data.tier === "gold" && "text-[#D4AF37]",
              data.tier === "silver" && "text-[#4B5563]", // Actually black/dark gray in image
              data.tier === "bronze" && "text-[#1E3A8A]"  // Blue star/crown in image
            )}
          />
        </div>
      </div>

      {/* Right Section: Source & Button */}
      <div className="flex items-center justify-end gap-6 lg:gap-8 min-w-[12rem] lg:min-w-[14rem] shrink-0">
        <div className="flex items-center gap-2 text-[color:var(--text-secondary)]">
          {data.source === "Website" ? (
            <Monitor size={14} className="opacity-70" />
          ) : (
            <Smartphone size={14} className="opacity-70" />
          )}
          <span className="font-inter font-medium text-[0.6875rem] lg:text-[0.75rem]">
            {data.source}
          </span>
        </div>

        <button
          onClick={() => onViewProfile?.(data.id)}
          className="flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full bg-[#1A1A1A] text-white hover:bg-black transition-colors font-inter font-medium text-[0.6875rem] lg:text-[0.75rem]"
        >
          View Profile
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default SuperAdminUserListCard;
