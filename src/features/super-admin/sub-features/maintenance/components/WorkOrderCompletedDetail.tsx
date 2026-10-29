import React from "react";
import { Check, CreditCard, FolderCheck, FileText, CheckCircle2 } from "lucide-react";
import type { WorkOrderPipelineItem } from "../types/maintenance.types";

interface WorkOrderCompletedDetailProps {
  item: WorkOrderPipelineItem;
  onBack: () => void;
}

export const WorkOrderCompletedDetail: React.FC<WorkOrderCompletedDetailProps> = ({
  item,
  onBack,
}) => {
  const categoryName =
    item.category === "BOREWELL"
      ? "Borewell"
      : item.category === "FENCING"
      ? "Fencing"
      : item.category === "FARMHOUSE"
      ? "Farmhouse"
      : "Organic";

  const documents = item.documents || [
    { name: "Occupancy Certificate", size: "2.4 MB", type: "pdf" },
    { name: "Structural Warranty", size: "1.8 MB", type: "pdf" },
    { name: "Final Tax Invoice", size: "0.9 MB", type: "pdf" },
  ];

  return (
    <div className="w-full flex flex-col font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200">
      {/* ── Breadcrumbs ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-xs text-[#7A8699] mb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-[#7A8699] hover:text-[#1E75BB] font-medium bg-transparent border-none cursor-pointer p-0 transition-colors"
        >
          Work Orders
        </button>
        <span className="text-[#CBD5E1]">&gt;</span>
        <span className="font-semibold text-[#1A1C1D]">
          {item.farmlandId || item.code} – {categoryName}
        </span>
      </div>

      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[24px] sm:text-[28px] text-[#111827] m-0 tracking-tight">
            Work Order Pipeline
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#7A8699] font-normal mt-0.5 m-0">
            Manage and track work orders across all mandals.
          </p>
        </div>
      </div>

      {/* ── Top Hero Summary Card matching Figma Image 5 ────────────────────── */}
      <div className="bg-[#F9FAFB] rounded-[28px] p-8 sm:p-10 text-center flex flex-col items-center border border-[#ECEFF2] shadow-2xs mb-6">
        {/* Blue Circular Checkmark */}
        <div className="w-14 h-14 rounded-full bg-[#1E75BB] flex items-center justify-center text-white mb-4 shadow-sm">
          <Check className="w-7 h-7 stroke-[3]" />
        </div>

        {/* Hero Title */}
        <h2 className="text-[22px] sm:text-[26px] font-bold text-[#111827] m-0 tracking-tight">
          Work Order Complete: {item.code.replace("#", "").replace("ID-", "ID – ")} {categoryName}
        </h2>

        {/* Subtitle Description */}
        <p className="text-xs sm:text-[13px] text-[#64748B] max-w-[660px] leading-relaxed my-3 m-0">
          The lifecycle journey from <span className="font-semibold text-[#111827]">{item.timelineJourney || "June – Oct 2025"}</span> for this project has reached its final milestone. All structural, environmental, and legal parameters have been fulfilled.
        </p>

        {/* 100% Completed Progress Bar */}
        <div className="w-full max-w-[720px] mt-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#1E75BB] tracking-wider mb-1.5 uppercase">
            <span>PROJECT STATUS</span>
            <span>100% COMPLETED</span>
          </div>
          <div className="w-full h-2.5 bg-blue-100 rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#1E75BB] rounded-full" />
          </div>
        </div>
      </div>

      {/* ── Bottom Two-Column Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Financial Settlement (Span 6) */}
        <div className="lg:col-span-6 bg-white rounded-[24px] border border-[#ECEFF2] p-7 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8F8F0] flex items-center justify-center text-[#10B981]">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-[16px] font-bold text-[#111827] m-0">
              Financial Settlement
            </h3>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#7A8699] font-medium">Final Payment</span>
            <div className="flex items-center gap-3">
              <span className="text-[20px] font-bold text-[#111827]">
                {item.finalPayment || "₹3,30,000"}
              </span>
              <span className="inline-flex items-center gap-1 bg-[#E8F8F0] text-[#10B981] font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                <Check className="w-3 h-3 stroke-[3]" />
                Received
              </span>
            </div>
            <span className="text-[11px] text-[#7A8699] mt-0.5 font-medium">
              Transaction ID: {item.transactionId || "GLC-TXN-8829102-S"}
            </span>
          </div>

          {/* Amount Balance Dashed Box */}
          <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-dashed border-[#CBD5E1] grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
                Amount Balance
              </span>
              <div className="flex items-center gap-1.5 text-[16px] font-bold text-[#111827]">
                <span>{item.amountBalance || "₹0"}</span>
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
                Settlement Date
              </span>
              <span className="block text-xs font-bold text-[#111827]">
                {item.settlementDate || "Oct 24, 2023"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Handover Documentation (Span 6) */}
        <div className="lg:col-span-6 bg-white rounded-[24px] border border-[#ECEFF2] p-7 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
              <FolderCheck className="w-4 h-4" />
            </div>
            <h3 className="text-[16px] font-bold text-[#111827] m-0">
              Handover Documentation
            </h3>
          </div>

          {/* 3 Document Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="bg-[#FAFAFA] hover:bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] flex items-center justify-center text-[#EF4444] group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#111827] line-clamp-2 leading-tight">
                  {doc.name}
                </span>
                <span className="text-[10px] text-[#7A8699] font-medium">
                  {doc.size}
                </span>
              </div>
            ))}
          </div>

          {/* Success Banner */}
          <div className="bg-[#E8F8F0] text-[#166534] rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span>All documents pushed to user vault</span>
          </div>
        </div>
      </div>
    </div>
  );
};
