import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Pencil } from "lucide-react";

export interface FarmlandListCardData {
  id: string;
  title: string;
  acres: string;
  soilType: string;
  image: string;
  agent: {
    name: string;
    avatar: string;
  };
}

interface Props {
  data: FarmlandListCardData;
  onViewDetails?: (id: string) => void;
  onEditTag?: (id: string) => void;
  className?: string;
}

const SuperAdminFarmlandsListCard: React.FC<Props> = ({
  data,
  onViewDetails,
  onEditTag,
  className,
}) => {
  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden bg-[color:var(--surface-card)] rounded-[24px] shadow-sm border border-[var(--border-soft)]",
        className
      )}
    >
      {/* Image at Top */}
      <div className="w-full h-[180px] shrink-0 p-3 pb-0">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover rounded-[16px]"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col p-4 lg:p-6 gap-4">
        {/* Title and Edit Tag */}
        <div className="flex items-center justify-between gap-2">
          <Typography variant="h4" className="font-bold text-[1.125rem] lg:text-[1.25rem] text-[var(--text-primary)]">
            {data.title}
          </Typography>
          <button
            onClick={() => onEditTag?.(data.id)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-white text-[#8B9A46] hover:bg-gray-50 transition-colors font-inter font-medium text-[0.6875rem] lg:text-[0.75rem]"
          >
            <Pencil size={12} className="text-[#8B9A46]" />
            Edit Tag
          </button>
        </div>

        {/* Info Grid (Acres and Soil Type) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="font-inter font-semibold text-[0.625rem] lg:text-[0.6875rem] text-[var(--text-muted)] uppercase tracking-wide">
              ACRES
            </span>
            <span className="font-inter font-bold text-[0.875rem] lg:text-[1rem] text-[var(--text-primary)]">
              {data.acres}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-inter font-semibold text-[0.625rem] lg:text-[0.6875rem] text-[var(--text-muted)] uppercase tracking-wide">
              SOIL TYPE
            </span>
            <span className="font-inter font-bold text-[0.875rem] lg:text-[1rem] text-[var(--text-primary)]">
              {data.soilType}
            </span>
          </div>
        </div>

        {/* Separator if needed, but design shows space */}
        <div className="h-px w-full bg-gray-100 my-1" />

        {/* Agent & Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={data.agent.avatar}
              alt={data.agent.name}
              className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.agent.name)}&background=random`;
              }}
            />
            <span className="font-inter font-medium text-[0.6875rem] lg:text-[0.75rem] text-[var(--text-muted)]">
              {data.agent.name}
            </span>
          </div>

          <button
            onClick={() => onViewDetails?.(data.id)}
            className="px-4 py-1.5 rounded-full border border-[var(--border-strong)] bg-white text-[var(--text-primary)] hover:bg-gray-50 transition-colors font-inter font-medium text-[0.6875rem] lg:text-[0.75rem]"
          >
            View Details
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SuperAdminFarmlandsListCard;
