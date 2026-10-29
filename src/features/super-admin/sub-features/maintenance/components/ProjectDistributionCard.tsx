import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { ProjectDistributionCategory } from "../types/maintenance.types";

interface ProjectDistributionCardProps {
  totalProjects: number;
  categories: ProjectDistributionCategory[];
}

export const ProjectDistributionCard: React.FC<ProjectDistributionCardProps> = ({
  totalProjects,
  categories,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = categories.map((cat) => ({
    name: cat.name,
    value: cat.count,
    color: cat.color,
  }));

  return (
    <div className="bg-white rounded-[24px] border border-[#ECEFF2] p-6 shadow-xs flex flex-col justify-between h-full min-h-[380px]">
      {/* ── Card Title ──────────────────────────────────────────────────────── */}
      <div className="mb-2">
        <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[15px] tracking-[0.05em] text-[#1E252B] uppercase m-0">
          PROJECT DISTRIBUTION
        </h3>
      </div>

      {/* ── Donut Chart Container ───────────────────────────────────────────── */}
      <div className="relative w-full h-[190px] flex items-center justify-center my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0];
                  return (
                    <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg font-['Plus_Jakarta_Sans'] font-medium">
                      <span>{data.name}: </span>
                      <span className="font-bold text-blue-300">{data.value}</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: activeIndex === index ? "brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.15))" : "none",
                    transform: activeIndex === index ? "scale(1.04)" : "scale(1)",
                    transformOrigin: "center center",
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label: Total Count + "Projects" */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] leading-tight text-[#1A1C1D]">
            {totalProjects}
          </span>
          <span className="font-['Plus_Jakarta_Sans'] text-[12px] font-medium text-[#7A8699]">
            *Projects
          </span>
        </div>
      </div>

      {/* ── Legend List with Right-Aligned Counts ─────────────────────────────── */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-[#F1F3F5]">
        {categories.map((category, idx) => (
          <div
            key={category.id}
            onMouseEnter={() => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(null)}
            className={`flex items-center justify-between py-1 px-2 rounded-lg transition-colors cursor-pointer ${
              activeIndex === idx ? "bg-gray-50" : "hover:bg-gray-50/50"
            }`}
          >
            {/* Dot Indicator + Category Name */}
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-medium text-[#374151]">
                {category.name}
              </span>
            </div>

            {/* Total Number */}
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#1A1C1D]">
              {category.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
