import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import type { VisitorStats, TotalSales } from '@/features/super-admin/types/dashboard';
import { formatCurrency, formatPercent } from '@/features/super-admin/utils/formatters';

interface Props {
  visitors: VisitorStats;
  totalSales: TotalSales;
  bgClass?: string;
}

const VisitorSalesCard: React.FC<Props> = ({ visitors, totalSales, bgClass }) => {
  return (
    <div className="flex gap-3 lg:gap-4 shrink-0">
      {/* ── Visitors Card ── */}
      <div
        className={cn(
          "flex flex-col gap-2 p-4 lg:p-5 justify-center",
          bgClass || "bg-white/20 backdrop-blur-md border border-white/30",
          "rounded-2xl shadow-sm",
          "w-[206px] h-[147px]",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-inter font-medium text-[0.8125rem] lg:text-sm text-[var(--text-primary)]">
            Visitors
          </span>
          <span className="font-inter font-normal text-[0.625rem] lg:text-[0.6875rem] text-[var(--text-muted)] opacity-70">
            {visitors.vsLastWeekLabel}
          </span>
        </div>

        <div className="flex items-end gap-4 lg:gap-6 mt-1">
          <div className="flex flex-col items-center gap-1 w-full">
            <span className="font-inter font-bold text-[1.375rem] lg:text-[1.625rem] xl:text-[1.75rem] text-[var(--text-primary)] leading-none">
              {visitors.nriPercentage}%
            </span>
            <div className="w-[81px] h-[20px] bg-gray-200/50 rounded-[20px] overflow-hidden">
              <div
                className="h-full rounded-[20px] bg-[#8B9A46]"
                style={{ width: `${visitors.nriPercentage}%` }}
              />
            </div>
            <span className="font-inter text-[0.625rem] text-[var(--text-muted)] leading-none mt-1">
              NRI
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 w-full">
            <span className="font-inter font-bold text-[1.375rem] lg:text-[1.625rem] xl:text-[1.75rem] text-[var(--text-primary)] leading-none">
              {visitors.localPercentage}%
            </span>
            <div className="w-[81px] h-[20px] bg-gray-200/50 rounded-[20px] overflow-hidden">
              <div
                className="h-full rounded-[20px] bg-[#C5D654]"
                style={{ width: `${visitors.localPercentage}%` }}
              />
            </div>
            <span className="font-inter text-[0.625rem] text-[var(--text-muted)] leading-none mt-1">
              Local
            </span>
          </div>
        </div>
      </div>

      {/* ── Total Sales Card ── */}
      <div
        className={cn(
          "flex flex-col gap-2 p-4 lg:p-5 justify-center",
          bgClass || "bg-white/20 backdrop-blur-md border border-white/30",
          "rounded-2xl shadow-sm",
          "w-[206px] h-[147px]",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-inter font-medium text-[0.8125rem] lg:text-sm text-[var(--text-primary)]">
            Total Sales
          </span>
          <div className="flex items-center gap-1 bg-[#F0F7E4] rounded-full px-2 py-0.5">
            <TrendingUp size={12} className="text-[#6B8A2E]" />
            <span className="font-inter font-medium text-[0.625rem] lg:text-[0.6875rem] text-[#6B8A2E]">
              {formatPercent(totalSales.changePercent)}
            </span>
          </div>
        </div>

        <span className="font-inter font-bold text-[1.375rem] lg:text-[1.625rem] xl:text-[1.75rem] text-[var(--text-primary)]">
          {formatCurrency(totalSales.amount)}
        </span>

        {/* Mini sparkline */}
        <div className="flex items-end gap-[2px] h-6 mt-1">
          {totalSales.sparklineData.map((val, i) => {
            const maxVal = Math.max(...totalSales.sparklineData);
            const heightPercent = maxVal > 0 ? (val / maxVal) * 100 : 0;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-[#C5D654]/60"
                style={{ height: `${heightPercent}%`, minWidth: "3px" }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VisitorSalesCard;
