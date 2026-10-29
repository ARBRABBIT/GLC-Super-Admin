import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Calendar, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import type { OperationsOverviewData } from "../types/maintenance.types";
import { OPERATIONS_OVERVIEW_BY_YEAR } from "../data/maintenanceData";

const CATEGORY_OPTIONS = ["Borewell", "Fencing", "Farmhouse"] as const;

interface OperationsOverviewCardProps {
  initialYear?: number;
}

export const OperationsOverviewCard: React.FC<OperationsOverviewCardProps> = ({
  initialYear = 2026,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORY_OPTIONS[0]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const currentData: OperationsOverviewData =
    OPERATIONS_OVERVIEW_BY_YEAR[selectedYear] || OPERATIONS_OVERVIEW_BY_YEAR[2026];

  const availableYears = Object.keys(OPERATIONS_OVERVIEW_BY_YEAR).map(Number);

  return (
    <div className="bg-white rounded-[24px] border border-[#ECEFF2] p-6 shadow-xs flex flex-col justify-between h-full min-h-[380px]">
      {/* ── Header: Title & Year Dropdown ───────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[15px] tracking-[0.05em] text-[#1E252B] uppercase m-0">
          OPERATIONS OVERVIEW
        </h3>

        <div className="flex items-center gap-2">
          {/* Category Filter Dropdown Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#F4F6F8] border border-[#E2E8F0] rounded-full font-['Plus_Jakarta_Sans'] text-[12px] font-semibold text-[#4A5568] cursor-pointer transition-colors"
            >
              <span>{selectedCategory}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30 animate-in fade-in zoom-in-95">
                {CATEGORY_OPTIONS.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category);
                      setCategoryDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold cursor-pointer border-none bg-transparent hover:bg-gray-50 ${
                      selectedCategory === category ? "text-[#1E75BB] font-bold bg-blue-50/50" : "text-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year Dropdown Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#F4F6F8] border border-[#E2E8F0] rounded-full font-['Plus_Jakarta_Sans'] text-[12px] font-semibold text-[#4A5568] cursor-pointer transition-colors"
            >
              <span>{selectedYear}</span>
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {yearDropdownOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30 animate-in fade-in zoom-in-95">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setSelectedYear(year);
                      setYearDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold cursor-pointer border-none bg-transparent hover:bg-gray-50 ${
                      selectedYear === year ? "text-[#1E75BB] font-bold bg-blue-50/50" : "text-gray-700"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── KPI Metrics Row ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-1 mb-2">
        {/* Service Requests */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-[26px] sm:text-[30px] leading-none text-[#1E75BB]">
              {currentData.totalServiceRequests}
            </span>
            <span className="inline-flex items-center text-[#1E75BB]">
              {currentData.serviceRequestsTrend === "up" ? (
                <ArrowUp className="w-4 h-4 stroke-[3]" />
              ) : (
                <ArrowDown className="w-4 h-4 stroke-[3]" />
              )}
            </span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mt-1">
            SERVICE REQUESTS
          </span>
        </div>

        {/* Work Orders */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center text-[#8CC63F]">
              {currentData.workOrdersTrend === "down" ? (
                <ArrowDown className="w-4 h-4 stroke-[3]" />
              ) : (
                <ArrowUp className="w-4 h-4 stroke-[3]" />
              )}
            </span>
            <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-[26px] sm:text-[30px] leading-none text-[#8CC63F]">
              {currentData.totalWorkOrders}
            </span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mt-1">
            WORK ORDERS
          </span>
        </div>
      </div>

      {/* ── Area Spline Chart ───────────────────────────────────────────────── */}
      <div className="w-full h-[180px] mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={currentData.monthlyTrend}
            margin={{ top: 15, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              {/* Service Requests Gradient (Blue) */}
              <linearGradient id="colorSR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E75BB" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1E75BB" stopOpacity={0.0} />
              </linearGradient>

              {/* Work Orders Gradient (Lime) */}
              <linearGradient id="colorWO" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8CC63F" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8CC63F" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "Plus Jakarta Sans" }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              ticks={[500, 1000, 1500, 2000]}
              tickFormatter={(val) => (val >= 2000 ? "2000+" : `${val}`)}
              tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "Plus Jakarta Sans" }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length >= 2) {
                  const srVal = ((payload[0].value as number) / 500).toFixed(1);
                  const woVal = ((payload[1].value as number) / 1000).toFixed(1);
                  return (
                    <div className="bg-white/95 backdrop-blur-xs border border-[#E2E8F0] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                      <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#1E75BB]">
                        {srVal}K SR
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#8CC63F]">
                        {woVal}K WO
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Service Requests (Blue Line & Area) */}
            <Area
              type="monotone"
              dataKey="serviceRequests"
              stroke="#1E75BB"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSR)"
              activeDot={{ r: 5, stroke: "#1E75BB", strokeWidth: 2, fill: "#fff" }}
            />

            {/* Work Orders (Lime Line & Area) */}
            <Area
              type="monotone"
              dataKey="workOrders"
              stroke="#8CC63F"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorWO)"
              activeDot={{ r: 5, stroke: "#8CC63F", strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
