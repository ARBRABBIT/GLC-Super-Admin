import React from "react";
import { Info, X, MapPin } from "lucide-react";
import type { ServiceRequestPipelineItem } from "../types/maintenance.types";

interface UnderVerificationDetailsModalProps {
  isOpen: boolean;
  item: ServiceRequestPipelineItem | null;
  onClose: () => void;
}

export const UnderVerificationDetailsModal: React.FC<UnderVerificationDetailsModalProps> = ({
  isOpen,
  item,
  onClose,
}) => {
  if (!isOpen || !item) return null;

  const officer = item.assignedOfficerDetails || {
    name: item.assignedOfficer || "Not assigned",
    phone: "+9112345678910",
    assignedDate: "12th June 2025",
    email: "Rameshyadav45@gmail.com",
  };

  const itemDisplayId = item.landId || item.code || "ID 2376";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-[28px] max-w-[580px] w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col gap-5 animate-in zoom-in-95 duration-200">
        {/* ── Modal Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#111827] m-0 tracking-tight">
            Under Verification - {itemDisplayId}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors border-none bg-transparent cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Top Summary Strip (3 Columns) ─────────────────────────────────── */}
        <div className="bg-[#F8F9FB] rounded-[18px] p-4 sm:p-4.5 border border-[#ECEFF2] grid grid-cols-3 divide-x divide-[#E5E7EB]">
          <div className="pr-3">
            <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
              OWNER NAME
            </span>
            <span className="block text-[14px] font-bold text-[#111827] truncate">
              {item.customerName}
            </span>
          </div>

          <div className="px-3 sm:px-4">
            <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
              SERVICE CATEGORY
            </span>
            <span className="block text-[14px] font-bold text-[#111827] truncate">
              {item.serviceCategory}
            </span>
          </div>

          <div className="pl-3 sm:pl-4">
            <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
              SITE LOCATION
            </span>
            <div className="flex items-center gap-1 text-[#10B981]">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#10B981]" />
              <span className="text-[14px] font-bold truncate text-[#10B981]">
                {item.location}
              </span>
            </div>
          </div>
        </div>

        {/* ── Assigned Officer Details Section ──────────────────────────────── */}
        <div className="flex flex-col gap-3 py-1">
          <span className="text-[13.5px] font-bold text-[#111827]">
            Assigned Officer Details
          </span>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-6">
            <div>
              <span className="block text-[11px] font-medium text-[#7A8699] mb-0.5">
                Field Officer
              </span>
              <span className="block text-[13.5px] font-bold text-[#111827]">
                {officer.name}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-[#7A8699] mb-0.5">
                Phone Number
              </span>
              <span className="block text-[13.5px] font-bold text-[#111827]">
                {officer.phone}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-[#7A8699] mb-0.5">
                Assigned Date
              </span>
              <span className="block text-[13.5px] font-bold text-[#111827]">
                {officer.assignedDate}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-[#7A8699] mb-0.5">
                Official Email
              </span>
              <span className="block text-[13.5px] font-bold text-[#111827] truncate">
                {officer.email}
              </span>
            </div>
          </div>
        </div>

        {/* ── Verification Warning Alert ────────────────────────────────────── */}
        <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-[#DC2626] font-semibold">
          <Info className="w-4 h-4 shrink-0 text-[#DC2626]" />
          <span>This service request is currently Under Verification.</span>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────────── */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold text-xs cursor-pointer border-none shadow-2xs hover:shadow-xs transition-all active:scale-98"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

