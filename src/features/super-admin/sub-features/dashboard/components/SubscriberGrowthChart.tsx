import React from "react";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { formatNumber } from '@/features/super-admin/utils/formatters';
import type { SubscriberGrowthData } from '@/features/super-admin/types/dashboard';

interface Props {
  data: SubscriberGrowthData;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

const SubscriberGrowthChart: React.FC<Props> = ({
  data,
  period = "Weekly",
  onPeriodChange,
}) => {
  return (
    <Card
      className={cn(
        "flex flex-col box-border w-full",
        "bg-[color:var(--surface-card)] rounded-[24px] shadow-[var(--shadow-card)]",
        "min-h-[267px] h-full",
        "p-[20px]",
        "gap-[13px]",
      )}
    >
      {/* Header row */}
      <div className="flex justify-between items-start mb-2 shrink-0">
        <div className="flex flex-col gap-1 flex-1 pr-2">
          <p className="m-0 font-inter font-semibold text-[clamp(0.875rem,1.2vw,1.125rem)] text-[var(--text-primary)]">
            Subscriber's Growth Data
          </p>
          <p className="m-0 font-inter font-normal text-[clamp(0.5625rem,0.8vw,0.6875rem)] text-[var(--text-muted)] leading-snug">
            Weekly land acquisition reflecting strong investor confidence in
            GLC's verification-backed assets.
          </p>
        </div>

        {/* Period selector */}
        <select
          value={period}
          onChange={(e) => onPeriodChange?.(e.target.value)}
          className={cn(
            "font-inter text-[0.75rem] text-[var(--text-primary)]",
            "bg-[var(--surface-page)] border border-[var(--border-soft)]",
            "rounded-lg px-3 py-1.5 outline-none cursor-pointer shrink-0",
            "appearance-none",
          )}
        >
          <option value="Week">Week</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
        </select>
      </div>

      {/* Donut chart */}
      <div className="flex items-center justify-center flex-1 min-h-[160px]">
        <div className="relative w-[clamp(140px,14vw,200px)] aspect-square">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.segments.map((s) => ({
                  name: s.label,
                  value: s.value,
                }))}
                dataKey="value"
                innerRadius="68%"
                outerRadius="100%"
                paddingAngle={4}
                cornerRadius={6}
                stroke="#ffffff"
                strokeWidth={2}
                startAngle={90}
                endAngle={-270}
              >
                {data.segments.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-inter font-normal text-[clamp(0.5rem,0.7vw,0.625rem)] text-[var(--text-muted)] uppercase tracking-wider">
              Units total
            </span>
            <span className="font-inter font-bold text-[clamp(1rem,1.5vw,1.5rem)] text-[var(--text-primary)]">
              {formatNumber(data.unitsTotal)}
            </span>
          </div>

          {/* Segment value labels */}
          {data.segments.map((segment, i) => {
            // Position labels around the donut
            const positions = [
              { top: "-8%", right: "5%" },
              { top: "5%", right: "-18%" },
              { bottom: "-5%", right: "10%" },
            ];
            const pos = positions[i] || {};
            return (
              <div
                key={segment.label}
                className="absolute font-inter font-bold text-[clamp(0.625rem,0.9vw,0.8125rem)] text-[var(--text-primary)]"
                style={pos as React.CSSProperties}
              >
                {segment.value}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2">
        {data.segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: segment.color }}
            />
            <span className="font-inter text-[0.625rem] lg:text-[0.6875rem] text-[var(--text-muted)]">
              {segment.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SubscriberGrowthChart;
