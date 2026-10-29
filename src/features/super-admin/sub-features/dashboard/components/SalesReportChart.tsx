import React from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Line,
  ComposedChart,
} from "recharts";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { SalesReportDataPoint } from '@/features/super-admin/types/dashboard';

interface Props {
  data: SalesReportDataPoint[];
  period?: string;
  onPeriodChange?: (period: string) => void;
}

// ── Custom Tooltip ──
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2D3032] rounded-xl px-3 py-2 shadow-lg border border-white/10">
        <p className="font-inter font-semibold text-xs text-white mb-1">
          {label}
        </p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="font-inter text-[11px] text-white/80">
              {entry.name}: ₹{entry.value} Cr
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ── Custom Active Bar (for highlighted day) ──
const CustomBar = (props: any) => {
  const { x, y, width, height, payload } = props;
  const isActive = payload?.day === "We";

  if (isActive) {
    return (
      <g>
        {/* Highlight capsule background */}
        <rect
          x={x - 8}
          y={y - 15}
          width={width + 16}
          height={height + 30}
          rx={width / 2 + 8}
          fill="url(#activeBarGradient)"
          opacity={0.3}
        />
        {/* Actual bar */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={width / 2}
          fill="#8B9A46"
        />
        {/* Value label */}
        <foreignObject x={x - 16} y={y - 35} width={width + 32} height={28}>
          <div className="flex items-center justify-center">
            <div className="bg-[#8B9A46] text-white text-[10px] font-inter font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap">
              ₹{payload?.target} Cr
            </div>
          </div>
        </foreignObject>
      </g>
    );
  }

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={width / 2}
      fill="#C5D654"
      opacity={0.6}
    />
  );
};

const SalesReportChart: React.FC<Props> = ({
  data,
  period = "Week",
  onPeriodChange,
}) => {
  const maxValue = Math.max(...data.map((d) => Math.max(d.target, d.actual, d.projected)));
  const yMax = Math.ceil(maxValue * 1.3 / 15) * 15;

  return (
    <Card
      className={cn(
        "flex flex-col box-border w-full",
        "bg-[color:var(--surface-card)] rounded-[24px] shadow-[var(--shadow-card)]",
        "min-h-[468px] h-full",
        "pt-[24px] pr-[32px] pb-[24px] pl-[32px]",
        "gap-[10px]",
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3 shrink-0">
        <div className="flex flex-col gap-1">
          <p className="m-0 font-inter font-semibold text-[clamp(0.875rem,1.2vw,1.125rem)] text-[var(--text-primary)]">
            Sales Report (Target vs. Actual)
          </p>
          <p className="m-0 font-inter font-normal text-[clamp(0.625rem,0.85vw,0.75rem)] text-[var(--text-muted)]">
            Weekly overview of fractional pool funding and sole-ownership asset
            sales.
          </p>
        </div>

        {/* Period selector */}
        <select
          value={period}
          onChange={(e) => onPeriodChange?.(e.target.value)}
          className={cn(
            "font-inter text-[0.75rem] text-[var(--text-primary)]",
            "bg-[var(--surface-page)] border border-[var(--border-soft)]",
            "rounded-lg px-3 py-1.5 outline-none cursor-pointer",
            "appearance-none",
          )}
        >
          <option value="Week">Week</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
        </select>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        {[
          { label: "Target", color: "#8B9A46" },
          { label: "Actual", color: "#C5D654" },
          { label: "Escrow", color: "#E88B5A" },
          { label: "Projected", color: "#E88B5A" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: item.color }}
            />
            <span className="font-inter text-[0.625rem] lg:text-[0.6875rem] text-[var(--text-muted)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C5D654" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#C5D654" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--text-primary)"
              strokeOpacity={0.08}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--text-primary)",
                fontSize: 12,
                fontFamily: "Inter, sans-serif",
                opacity: 0.5,
              }}
            />
            <YAxis
              domain={[0, yMax]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v === 0 ? "0" : `₹${v} Cr`)}
              tick={{
                fill: "var(--text-primary)",
                fontSize: 11,
                fontFamily: "Inter, sans-serif",
                opacity: 0.5,
              }}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />

            {/* Target bars */}
            <Bar
              dataKey="target"
              name="Target"
              fill="#C5D654"
              radius={[8, 8, 8, 8]}
              barSize={14}
              shape={<CustomBar />}
            />

            {/* Actual line with dots */}
            <Line
              dataKey="actual"
              name="Actual"
              type="monotone"
              stroke="#3B3B3B"
              strokeWidth={1.5}
              dot={{ r: 4, fill: "#3B3B3B", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#3B3B3B" }}
            />

            {/* Escrow dots */}
            <Line
              dataKey="escrow"
              name="Escrow"
              type="monotone"
              stroke="transparent"
              dot={{ r: 4, fill: "#E88B5A", strokeWidth: 0 }}
            />

            {/* Projected dots */}
            <Line
              dataKey="projected"
              name="Projected"
              type="monotone"
              stroke="transparent"
              dot={{ r: 4, fill: "#E88B5A", strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesReportChart;
