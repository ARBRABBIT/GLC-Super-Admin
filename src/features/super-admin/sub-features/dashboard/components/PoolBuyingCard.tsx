import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface PoolBuyingCardData {
  id: string;
  location: string;
  farmlandId: string;
  investors: number;
  status: "Active" | "Closed" | "Pending";
  raisedAmount: number;
  targetAmount: number;
  image: string;
}

interface Props {
  data: PoolBuyingCardData;
  onViewDetails?: (id: string) => void;
  className?: string;
}

const formatDisplayAmount = (amount: number): string => {
  return amount.toLocaleString("en-IN");
};

const PoolBuyingCard: React.FC<Props> = ({ data, onViewDetails, className }) => {
  const progressPercent = data.targetAmount > 0 ? Math.min((data.raisedAmount / data.targetAmount) * 100, 100) : 0;

  return (
    <Card
      className={cn(
        "flex flex-row overflow-hidden bg-[color:var(--surface-card)] rounded-[24px] shadow-sm border border-[var(--border-soft)]",
        className
      )}
    >
      {/* Left: Image */}
      <div className="w-[200px] min-h-[260px] shrink-0 ">
        <img
          src={data.image}
          alt={data.farmlandId}
          className="w-full h-full object-cover "
        />
      </div>

      {/* Right: Content */}
      <div className="flex flex-col flex-1 py-4 pr-5 pl-1 justify-between">
        {/* Info Grid */}
        <div className="flex flex-col gap-4">
          <div className="w-[90%] mx-auto grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-inter font-semibold text-[0.625rem] text-[var(--text-muted)] uppercase tracking-[0.08em]">
                Location
              </span>
              <span className="font-inter font-semibold text-[0.875rem] text-[var(--text-primary)] leading-tight">
                {data.location}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-inter font-semibold text-[0.625rem] text-[var(--text-muted)] uppercase tracking-[0.08em]">
                Farm Land ID
              </span>
              <span className="font-inter font-semibold text-[0.875rem] text-[var(--text-primary)] leading-tight">
                {data.farmlandId}
              </span>
            </div>
          </div>

          <div className="w-[90%] mx-auto grid grid-cols-2 gap-x-8">
            <div className=" flex flex-col gap-0.5">
              <span className="font-inter font-semibold text-[0.625rem] text-[var(--text-muted)] uppercase tracking-[0.08em]">
                Investors
              </span>
              <span className="font-inter font-bold text-[1.125rem] text-[var(--text-primary)]">
                {data.investors}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-inter font-semibold text-[0.625rem] text-[var(--text-muted)] uppercase tracking-[0.08em]">
                Status
              </span>
              <span className="font-inter font-bold text-[1.125rem] text-[var(--text-primary)]">
                {data.status}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2 mt-3">
          <div className="w-[90%] mx-auto h-[6px] bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#1B3A2D] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Amount Row */}
          <div className="w-[90%] mx-auto flex items-end justify-between">
            <div className="flex flex-col">
              <span className="font-inter font-bold text-[0.9375rem] text-[#1B3A2D]">
                {formatDisplayAmount(data.raisedAmount)}
              </span>
              <span className="font-inter text-[0.5625rem] text-[var(--text-muted)]">
                {data.raisedAmount < data.targetAmount ? "Raised amount" : "Target amount"}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-inter font-bold text-[0.9375rem] text-[var(--text-primary)]">
                {formatDisplayAmount(data.targetAmount)}
              </span>
              <span className="font-inter text-[0.5625rem] text-[var(--text-muted)]">
                Target amount
              </span>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button
  onClick={() => onViewDetails?.(data.id)}
  className="w-[90%] mx-auto block py-2.5 mt-2 rounded-full bg-[#2D3319] hover:bg-[#1a1f0f] text-white font-inter font-medium text-[0.8125rem] transition-colors"
>
  View Details
</button>
      </div>
    </Card>
  );
};

export default PoolBuyingCard;
