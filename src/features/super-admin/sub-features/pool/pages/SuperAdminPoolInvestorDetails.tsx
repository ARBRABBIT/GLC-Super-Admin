import React from "react";
import { useNavigate, useParams } from "react-router-dom";
const nameIcon = "/super-admin/icons/name.svg";
const idIcon = "/super-admin/icons/id.svg";
const plotIdIcon = "/super-admin/icons/plotid.svg";
const landIcon = "/super-admin/icons/land.svg";
const ownIcon = "/super-admin/icons/own.svg";
const dateIcon = "/super-admin/icons/date.svg";
const poolIcon = "/super-admin/icons/pool.svg";
const locIcon = "/super-admin/icons/loc.svg";

import {ArrowLeft, Plus, Minus, Navigation, CheckCircle2} from "lucide-react";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";

const SuperAdminPoolInvestorDetails: React.FC = () => {
  const navigate = useNavigate();
  const { investorId } = useParams<{ id: string; investorId: string }>();

  // Find investor from mock data
  const poolDetail = mockDashboardData.poolDetails["POOL-001"];
  const investor = poolDetail?.investors.find((inv) => inv.id === investorId) || poolDetail?.investors[0];

  if (!investor) return null;

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      <div className="bg-[#F6F7F6] rounded-[24px] p-6 lg:p-8 flex flex-col gap-6 min-h-screen">

        {/* Go Back */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors"
           >
            <ArrowLeft size={16} />
            Go back
          </button>
        </div>

        {/* Investor Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={investor.avatar}
              alt={investor.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(investor.name)}&background=random&size=150`;
              }}
            />
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-inter font-bold text-[1.5rem] text-[var(--text-primary)] leading-tight">
              {investor.name}
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="font-inter text-[0.8125rem] text-[var(--text-muted)]">
                Investor ID: <strong className="text-[var(--text-primary)]">{investor.id}</strong>
              </span>
              <span className="text-gray-300">|</span>
              <span className="font-inter text-[0.8125rem] text-[var(--text-muted)]">
                Pool: <strong className="text-[var(--text-primary)]">{investor.poolName}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Land Allocation + Investment Information Row */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Land Allocation */}
          <div className="flex-1 bg-white rounded-[20px] border border-gray-200 p-6 flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-inter font-bold text-[1.125rem] text-[var(--text-primary)]">
                Land Allocation
              </h3>
              <p className="font-inter text-[0.8125rem] text-[var(--text-muted)]">
                Plot allocated to this investor
              </p>
            </div>

            {/* Map with highlighted plot */}
            <div className="relative w-full h-[350px] rounded-[16px] overflow-hidden border border-gray-100">
              <img
                src={poolDetail?.mapImage || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80"}
                alt="Land Allocation"
                className="w-full h-full object-cover"
              />

              {/* Grid overlay */}
              <div className="absolute inset-0">
                <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.35 }}>
                  {[16.6, 33.3, 50, 66.6, 83.3].map((pct, i) => (
                    <line key={`v-${i}`} x1={`${pct}%`} y1="0" x2={`${pct}%`} y2="100%" stroke="white" strokeWidth="1.5" />
                  ))}
                  {[20, 40, 60, 80].map((pct, i) => (
                    <line key={`h-${i}`} x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`} stroke="white" strokeWidth="1.5" />
                  ))}
                </svg>

                {/* Highlighted plot area */}
                <div
                  className="absolute bg-[#C5D654]/40 border-2 border-[#C5D654] rounded-md flex items-center justify-center"
                  style={{ top: "35%", left: "30%", width: "20%", height: "25%" }}
                >
                  <span className="bg-white/90 px-2 py-1 rounded text-[0.6875rem] font-inter font-semibold text-[var(--text-primary)]">
                    {investor.landAllocated.replace(" Acres", "-acre")}
                  </span>
                </div>

                {/* + markers */}
                {[
                  { top: "10%", left: "25%" }, { top: "10%", left: "55%" }, { top: "10%", left: "75%" },
                  { top: "30%", left: "12%" }, { top: "30%", left: "60%" }, { top: "30%", left: "85%" },
                  { top: "50%", left: "12%" }, { top: "50%", left: "60%" },
                  { top: "70%", left: "25%" }, { top: "70%", left: "45%" }, { top: "70%", left: "75%" },
                  { top: "90%", left: "20%" }, { top: "90%", left: "45%" }, { top: "90%", left: "70%" },
                ].map((pos, i) => (
                  <div
                    key={i}
                    className="absolute w-5 h-5 flex items-center justify-center"
                    style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -50%)" }}
                  >
                    <span className="text-white/60 text-lg font-light">+</span>
                  </div>
                ))}
              </div>

              {/* Zoom controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-1 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-100">
                  <Plus size={16} className="text-[var(--text-primary)]" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-100">
                  <Minus size={16} className="text-[var(--text-primary)]" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Navigation size={16} className="text-[var(--text-primary)]" />
                </button>
              </div>
            </div>
          </div>

          {/* Investment Information */}
          <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">
            <div className="bg-white rounded-[20px] border border-gray-200 p-6 flex flex-col gap-0">
              <h3 className="font-inter font-bold text-[1.125rem] text-[var(--text-primary)] mb-3">
                Investment Information
              </h3>

              {[
                { label: "Investment Amount", value: `₹${investor.investedAmount}` },
                { label: "Current Status", value: investor.status, isBadge: true },
                { label: "Invested on", value: investor.investedOn },
                { label: "Ownership Percentage", value: investor.ownershipPercent },
                { label: "Location", value: investor.location.split(",")[0] },
                { label: "Tenure", value: investor.tenure, isBold: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <span className="font-inter text-[0.8125rem] text-[var(--text-muted)]">
                    {item.label}
                  </span>
                  {item.isBadge ? (
                    <span className="px-3 py-1 bg-[#1B3A2D] text-white rounded-full font-inter font-medium text-[0.6875rem]">
                      {item.value}
                    </span>
                  ) : (
                    <span className={`font-inter ${item.isBold ? "font-bold" : "font-semibold"} text-[0.875rem] text-[var(--text-primary)]`}>
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Investment Verified Banner */}
            <div className="bg-[#F0F7E4] rounded-[16px] border border-[#D4E8B0] px-5 py-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1B3A2D] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={18} className="text-white" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-inter font-bold text-[0.75rem] text-[#1B3A2D] uppercase tracking-wide">
                  Investment Verified
                </span>
                <span className="font-inter text-[0.75rem] text-[#3D5A1E] leading-relaxed">
                  Title deed and documentation process initiated for Plot {investor.plotId}.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ownership Information */}
        <div className="bg-white rounded-[20px] border border-gray-200 p-6">
          <h3 className="font-inter font-bold text-[1.125rem] text-[var(--text-primary)] mb-6">
            Ownership Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
            {[
              { icon: nameIcon, label: "Investor Name", value: investor.name },
              { icon: ownIcon, label: "Ownership Percentage", value: investor.ownershipPercent, valueColor: "text-[#1B3A2D]" },
              { icon: idIcon, label: "Investor ID", value: investor.id },
              { icon: dateIcon, label: "Purchase Date", value: investor.investedOn, valueColor: "text-[#1B3A2D]" },
              { icon: plotIdIcon, label: "Plot ID", value: investor.plotId },
              { icon: poolIcon, label: "Pool Name", value: investor.poolName, valueColor: "text-[#1B3A2D]" },
              { icon: landIcon, label: "Land Area", value: investor.landAllocated },
              { icon: locIcon, label: "Location", value: investor.location, valueColor: "text-[#1B3A2D]" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-4 h-4 object-contain"
                  />
                </div>

                <div className="flex items-center justify-between flex-1">
                  <span className="font-inter text-[0.8125rem] text-[var(--text-muted)]">
                    {item.label}
                  </span>

                  <span
                    className={`font-inter font-bold text-[0.875rem] ${item.valueColor || "text-[var(--text-primary)]"
                      }`}
                  >
                    {item.value}
                  </span>
                </div>
              </div>
            
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPoolInvestorDetails;
