import React, { useState } from "react";
import { Check, AlertCircle, Mail, X, User, MapPin, History, Clock } from "lucide-react";
import type { ServiceRequestPipelineItem } from "../types/maintenance.types";

interface QuotationStatusDetailsModalProps {
  isOpen: boolean;
  item: ServiceRequestPipelineItem | null;
  onClose: () => void;
  onMoveToWorkOrder?: (item: ServiceRequestPipelineItem) => void;
}

export const QuotationStatusDetailsModal: React.FC<QuotationStatusDetailsModalProps> = ({
  isOpen,
  item,
  onClose,
  onMoveToWorkOrder,
}) => {
  const [activeServiceTab, setActiveServiceTab] = useState<string>("Fencing");

  if (!isOpen || !item) return null;

  const status = item.customerResponseStatus || (item.statusText as 'Accepted' | 'Rejected' | 'Awaiting') || 'Accepted';
  const itemDisplayId = item.landId || item.code || "ID 3042";

  const handleDone = () => {
    if (status === "Accepted" && onMoveToWorkOrder) {
      onMoveToWorkOrder(item);
    } else {
      onClose();
    }
  };

  const serviceCategories = ["Fencing", "Borewell", "Farmhouse Construction"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-[28px] max-w-[620px] w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col gap-5 animate-in zoom-in-95 duration-200">
        
        {/* ── Modal Header ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-[20px] sm:text-[22px] font-bold text-[#111827] m-0 tracking-tight">
              Quotation Status Details – {itemDisplayId}
            </h2>

            {/* Subtitle depending on status format in Figma */}
            {status === "Rejected" ? (
              <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5 font-medium">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#64748B]" /> {item.customerName}
                </span>
                <span>|</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#64748B]" /> {itemDisplayId} ({item.landSize || "2.0 Acres"})
                </span>
                <span>|</span>
                <span>{item.location}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5 font-medium">
                <span>{item.customerName}</span>
                <span>•</span>
                <span>{itemDisplayId} ({item.landSize || "5.0 Acres"})</span>
                <span>•</span>
                <span>{item.location}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors border-none bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Service Tabs for Accepted State (Figma Image 2) ────────────────── */}
        {status === "Accepted" && (
          <div className="flex flex-wrap items-center gap-2 -mt-2">
            {serviceCategories.map((svc) => (
              <button
                key={svc}
                type="button"
                onClick={() => setActiveServiceTab(svc)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none transition-all ${
                  activeServiceTab === svc
                    ? "bg-[#1877F2] text-white shadow-2xs"
                    : "bg-[#F1F5F9] text-gray-700 hover:bg-gray-200"
                }`}
              >
                {svc}
              </button>
            ))}
          </div>
        )}

        {/* ── Summary Overview Panel (2x2 Grid) ─────────────────────────────── */}
        <div className="bg-[#F8F9FB] rounded-[18px] p-5 border border-[#ECEFF2]">
          {status === "Awaiting" ? (
            /* Awaiting 2x2 Grid (Figma Image 4) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Left Column: Services Included list with green numbers */}
              <div>
                <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-2.5">
                  SERVICES INCLUDED
                </span>
                <div className="flex flex-col gap-1.5 text-xs font-semibold text-[#111827]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#15803D] font-bold">1.</span>
                    <span>Farmhouse Construction</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#15803D] font-bold">2.</span>
                    <span>Borewell Drilling</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#15803D] font-bold">3.</span>
                    <span>Organic Farming Setup</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Amount and Date Sent + Awaiting Badge */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
                    OFFICIAL QUOTATION AMOUNT
                  </span>
                  <span className="text-[17px] font-bold text-[#10B981]">
                    {item.quotationAmount || item.estimatedCost || "₹24,50,000"}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1.5">
                    DATE SENT
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#111827]">
                      {item.dateSent || "Nov 15, 2026"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF08A] text-[#854D0E] shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#854D0E]" />
                      Awaiting
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : status === "Rejected" ? (
            /* Rejected 2x2 Grid (Figma Image 3) */
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              {/* Row 1 Left: Services Included */}
              <div>
                <span className="block text-[11px] font-normal text-[#64748B] mb-1">
                  Services Included
                </span>
                <span className="block text-[13.5px] font-bold text-[#111827]">
                  {item.serviceCategory === "Borewell"
                    ? "Borewell Drilling & Maintenance"
                    : item.serviceCategory === "Fencing"
                    ? "Organic Farming Setup"
                    : "Organic Farming Setup"}
                </span>
              </div>

              {/* Row 1 Right: Current Response Status */}
              <div>
                <span className="block text-[11px] font-normal text-[#64748B] mb-1">
                  Current Response Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#DC2626] shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                  Rejected
                </span>
              </div>

              {/* Row 2 Left: Official Quotation Amount */}
              <div>
                <span className="block text-[11px] font-normal text-[#64748B] mb-1">
                  Official Quotation Amount
                </span>
                <span className="block text-[13.5px] font-bold text-[#111827]">
                  {item.quotationAmount || item.estimatedCost || "₹4,50,000"}
                </span>
              </div>

              {/* Row 2 Right: Date Sent */}
              <div>
                <span className="block text-[11px] font-normal text-[#64748B] mb-1">
                  Date Sent
                </span>
                <span className="block text-[13.5px] font-bold text-[#111827]">
                  {item.dateSent || "Nov 10, 2026"}
                </span>
              </div>
            </div>
          ) : (
            /* Accepted 2x2 Grid (Figma Image 2) */
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              {/* Row 1 Left: SERVICES INCLUDED */}
              <div>
                <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
                  SERVICES INCLUDED
                </span>
                <span className="block text-[14px] font-bold text-[#111827]">
                  {item.serviceCategory} + 2
                </span>
              </div>

              {/* Row 1 Right: OFFICIAL QUOTATION AMOUNT */}
              <div>
                <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
                  OFFICIAL QUOTATION AMOUNT
                </span>
                <span className="block text-[17px] font-bold text-[#10B981]">
                  {item.quotationAmount || item.estimatedCost || "₹5,12,000"}
                </span>
              </div>

              {/* Row 2 Left: DATE SENT */}
              <div>
                <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
                  DATE SENT
                </span>
                <span className="block text-[13.5px] font-semibold text-[#111827]">
                  {item.dateSent || "Nov 14, 2026"}
                </span>
              </div>

              {/* Row 2 Right: CURRENT RESPONSE STATUS */}
              <div>
                <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
                  CURRENT RESPONSE STATUS
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                  Accepted
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Customer Response Tracking Section ────────────────────────────── */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#111827]">
            {status === "Rejected" && <History className="w-4 h-4 text-[#111827]" />}
            <span>Customer Response Tracking</span>
          </div>

          {/* Accepted Banner */}
          {status === "Accepted" && (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#15803D] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-bold text-[#166534]">
                  Status: Accepted
                </span>
                <p className="text-[12px] text-[#15803D] m-0 mt-0.5 leading-relaxed font-normal">
                  Customer accepted the quotation on {item.acceptanceDate || "Nov 16, 2026"}. Ready for operational dispatch.
                </p>
              </div>
            </div>
          )}

          {/* Rejected Banner */}
          {status === "Rejected" && (
            <div className="bg-[#FEF2F2] border border-[#FECACA]/60 rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[#DC2626]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-[13.5px] font-bold">
                  Status: Rejected
                </span>
              </div>
              <div className="bg-white rounded-xl px-4 py-2.5 text-xs text-[#1F2937] border border-red-100/80">
                <span className="font-bold text-[#DC2626]">Reason: </span>
                {item.rejectionReason || "The estimated cost exceeds my budget."}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#DC2626] font-medium">
                <Clock className="w-3 h-3 text-[#DC2626]" />
                <span>Rejected on {item.rejectionTimestamp || "Nov 11, 2026 at 04:32 PM"}</span>
              </div>
            </div>
          )}

          {/* Awaiting Banner */}
          {status === "Awaiting" && (
            <div className="bg-[#F8F9FB] border border-[#ECEFF2] rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#15803D] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-bold text-[#111827]">
                  Status: Awaiting Customer Response
                </span>
                <p className="text-[12px] text-[#64748B] m-0 mt-0.5 leading-relaxed font-normal">
                  The quotation has been sent successfully. Waiting for customer confirmation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer Actions ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2">
          {status === "Accepted" ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="font-medium text-xs text-[#4B5563] hover:text-[#111827] transition-colors border-none bg-transparent cursor-pointer p-0"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleDone}
                className="px-7 py-2.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold text-xs cursor-pointer border-none shadow-2xs hover:shadow-xs transition-all active:scale-98"
              >
                Done
              </button>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-7 py-2.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold text-xs cursor-pointer border-none shadow-2xs hover:shadow-xs transition-all active:scale-98"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
