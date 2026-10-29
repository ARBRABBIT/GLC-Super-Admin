import React from "react";
import { Check, X, Calendar, MapPin } from "lucide-react";
import type { ServiceRequestItemDetail } from "../types/maintenance.types";

interface AssignmentSuccessModalProps {
  isOpen: boolean;
  officerName?: string;
  address?: string;
  preferredVisitDate?: string;
  servicesList?: ServiceRequestItemDetail[];
  onClose?: () => void;
  onReturn: () => void;
}

export const AssignmentSuccessModal: React.FC<AssignmentSuccessModalProps> = ({
  isOpen,
  officerName = "Not assigned",
  address = "Plot 42, Green Valley, Shamshabad Mandal, Hyderabad.",
  preferredVisitDate = "Oct 24, 2026",
  servicesList,
  onClose,
  onReturn,
}) => {
  if (!isOpen) return null;

  // Calculate user initials for the circular avatar
  const getInitials = (name: string) => {
    if (!name) return "AS";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Extract short address like "(Plot 42, Hyderabad)"
  const getShortAddress = (fullAddress: string) => {
    if (!fullAddress) return "Plot 42, Hyderabad";
    const parts = fullAddress.split(",").map((s) => s.trim());
    if (parts.length >= 2) {
      const first = parts[0];
      const last = parts[parts.length - 1].replace(".", "");
      return `${first}, ${last}`;
    }
    return fullAddress;
  };

  // Format Scheduled Visit Address
  const getVisitAddress = (fullAddress: string) => {
    if (!fullAddress) return "Plot 42, Green Valley, Shamshabad";
    const parts = fullAddress.split(",").map((s) => s.trim());
    if (parts.length >= 3) {
      return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
    }
    return fullAddress.replace(".", "");
  };

  const defaultServices: ServiceRequestItemDetail[] = [
    { name: "Farmhouse Construction", icon: "farmhouse" },
    { name: "Borewell Drilling", icon: "borewell" },
    { name: "Organic Farming Setup", icon: "organic" },
  ];

  const currentServices =
    servicesList && servicesList.length > 0 ? servicesList : defaultServices;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      onReturn();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] sm:rounded-[28px] max-w-[440px] w-full p-6 sm:p-8 shadow-2xl relative flex flex-col items-center text-center animate-in zoom-in-95 duration-200 border border-gray-100">
        {/* ── Top-Right Close Button ────────────────────────────────────────── */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer transition-colors"
          title="Close"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        {/* ── Green Check Icon Badge ───────────────────────────────────────── */}
        <div className="w-12 h-12 rounded-2xl bg-[#E8F8F0] text-[#10B981] flex items-center justify-center mb-4.5 mt-1">
          <Check className="w-6 h-6 stroke-[2.5]" />
        </div>

        {/* ── Title ─────────────────────────────────────────────────────────── */}
        <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] sm:text-[20px] text-[#111827] m-0 mb-1.5 leading-snug">
          Field Officers Successfully Dispatched!
        </h3>

        {/* ── Subtitle ──────────────────────────────────────────────────────── */}
        <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#64748B] m-0 mb-5 leading-relaxed font-normal">
          Work order have been created for {officerName} ({getShortAddress(address)}).
        </p>

        {/* ── Card 1: Scheduled Visit & Location Box ───────────────────────── */}
        <div className="w-full bg-[#F8FAFC] rounded-2xl p-4 flex flex-col gap-2.5 text-left mb-4 border border-[#F1F5F9]">
          <div className="flex items-center gap-2.5 text-[13px] font-semibold text-[#1E293B]">
            <Calendar className="w-4 h-4 text-[#1E75BB] shrink-0" />
            <span>Scheduled Visit: {preferredVisitDate}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[13px] text-[#64748B]">
            <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span className="truncate">{getVisitAddress(address)}</span>
          </div>
        </div>

        {/* ── Card 2: Dispatched Officer Card ──────────────────────────────── */}
        <div className="w-full bg-[#F2FBF6] rounded-2xl p-5 flex flex-col items-center gap-2 border border-[#E0F2E9]">
          {/* Circular Avatar with initials */}
          <div className="w-10 h-10 rounded-full bg-[#D96B27] text-white font-bold text-[14px] flex items-center justify-center shadow-2xs">
            {getInitials(officerName)}
          </div>

          {/* Officer Name */}
          <span className="font-semibold text-[14.5px] text-[#111827] mt-0.5">
            {officerName}
          </span>

          {/* Dispatched Badge */}
          <div className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#15803D] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Dispatched</span>
          </div>

          {/* Assigned Services Summary */}
          <div className="mt-1 font-bold text-[12.5px] text-[#111827] text-center leading-snug">
            {currentServices.map((svc, idx) => {
              const isLast = idx === currentServices.length - 1;
              const isSecondToLast = idx === currentServices.length - 2;
              return (
                <div key={idx}>
                  {svc.name}
                  {isSecondToLast ? " and" : !isLast ? "," : ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
