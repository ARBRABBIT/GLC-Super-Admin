import React from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from '@/features/super-admin/utils/formatters';
import type { FarmlandStats } from '@/features/super-admin/types/dashboard';

interface Props {
  stats: FarmlandStats;
  bgClass?: string;
}

const FarmlandStatsCard: React.FC<Props> = ({ stats, bgClass }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-0 divide-x divide-[var(--border-soft)]",
        bgClass || "bg-white/20 backdrop-blur-md border border-white/30",
        "rounded-[20px] shadow-sm",
        "px-4 lg:px-5 py-3 lg:py-4 justify-center",
        "w-[301px] h-[92px]",
        "self-start shrink-0",
      )}
    >
      {/* Total Farmlands */}
      <div className="flex flex-col items-center gap-0.5 pr-4 lg:pr-6">
        <span className="font-inter font-bold text-[1.375rem] lg:text-[1.625rem] xl:text-[1.75rem] text-[var(--text-primary)] leading-tight">
          {formatNumber(stats.totalFarmlands)}
        </span>
        <span className="font-inter font-medium text-[0.5625rem] lg:text-[0.625rem] xl:text-[0.6875rem] text-[var(--text-muted)] uppercase tracking-wider">
          Total Farmlands
        </span>
      </div>

      {/* Active Pools */}
      <div className="flex flex-col items-center gap-0.5 pl-4 lg:pl-6">
        <span className="font-inter font-bold text-[1.375rem] lg:text-[1.625rem] xl:text-[1.75rem] text-[var(--text-primary)] leading-tight">
          {stats.activePools}
        </span>
        <span className="font-inter font-medium text-[0.5625rem] lg:text-[0.625rem] xl:text-[0.6875rem] text-[var(--text-muted)] uppercase tracking-wider">
          Active Pools
        </span>
      </div>
    </div>
  );
};

export default FarmlandStatsCard;
