import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import type { FarmlandData } from "@/features/super-admin/types/farmland.types";
import { S3Image } from "@/components/common/S3Image";

interface Props {
  data: FarmlandData;
  imagePosition?: "top" | "bottom";
  onViewDetails?: (id: number | string) => void;
  className?: string;
}

const SuperAdminFarmlandCard: React.FC<Props> = ({
  data,
  imagePosition = "top",
  onViewDetails,
  className,
}) => {
  const contentNode = (
    <div className="flex flex-col p-4 lg:p-6 gap-4">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {data.status && (
          <span className="px-3 py-1 bg-[#F2F4F7] text-[var(--text-primary)] rounded-full font-inter font-medium text-[0.625rem] lg:text-[0.6875rem] uppercase tracking-wide">
            {data.status}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Typography variant="h4" className="font-bold text-[1.125rem] lg:text-[1.25rem] text-[var(--text-primary)]">
            {data.farm_code}
          </Typography>
          {data.is_glc_exclusive === 1 && (
            <span className="px-2 py-0.5 bg-[#E6EEAD] text-[#2A3125] text-[0.625rem] lg:text-[0.6875rem] font-bold rounded-full border border-[#D5DF96]">
              GLC Exclusive
            </span>
          )}
        </div>
        <Typography variant="span" className="font-normal text-[0.75rem] lg:text-[0.8125rem] text-[var(--text-muted)]">
          Area - {data.total_acres} acres
        </Typography>
        <Typography variant="span" className="font-normal text-[0.75rem] lg:text-[0.8125rem] text-[var(--text-muted)]">
          Cost per acre - {data.valuation && data.total_acres ? (Number(data.valuation) / Number(data.total_acres)).toFixed(2) : "N/A"}
        </Typography>
      </div>

      {/* Agent & Button */}
      <div className="flex items-center justify-between mt-1">
        {data.agent && (data.agent.first_name || data.agent.last_name) ? (
          <div className="flex items-center gap-2">
            <S3Image
              src={data.agent.img}
              fallbackType="avatar"
              alt={`${data.agent.first_name || ""} ${data.agent.last_name || ""}`.trim()}
              className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover border border-gray-200"
            />
            <span className="font-inter font-medium text-[0.6875rem] lg:text-[0.75rem] text-[var(--text-primary)]">
              {`${data.agent.first_name || ""} ${data.agent.last_name || ""}`.trim()}
            </span>
          </div>
        ) : (
          <div></div>
        )}

        <button
          onClick={() => onViewDetails?.(data.id)}
          className="px-4 py-1.5 rounded-full border border-[var(--border-strong)] bg-white text-[var(--text-primary)] hover:bg-gray-50 transition-colors font-inter font-medium text-[0.6875rem] lg:text-[0.75rem]"
        >
          View Details
        </button>
      </div>
    </div>
  );

  const imageNode = (
    <div className="w-full h-[200px] shrink-0 bg-gray-100">
      <S3Image
        src={data.cover_image_url}
        fallbackType="cover"
        alt={data.farm_code}
        className="w-full h-full object-cover"
      />
    </div>
  );

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden bg-[color:var(--surface-card)] rounded-[24px] shadow-sm border border-[var(--border-soft)]",
        className
      )}
    >
      {imagePosition === "top" ? (
        <>
          {imageNode}
          {contentNode}
        </>
      ) : (
        <>
          {contentNode}
          {imageNode}
        </>
      )}
    </Card>
  );
};

export default SuperAdminFarmlandCard;
