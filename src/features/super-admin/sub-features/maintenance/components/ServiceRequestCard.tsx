import React from "react";
import { Droplet, Grid3X3, Home, Sprout } from "lucide-react";
import type { ServiceRequestPipelineItem } from "../types/maintenance.types";

interface ServiceRequestCardProps {
  item: ServiceRequestPipelineItem;
  onVerify: (item: ServiceRequestPipelineItem, actionType?: "approve" | "view-details" | "verify-now") => void;
}

export const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({ item, onVerify }) => {
  const isUnderVerification = item.stage === "Under Verification" || item.stage === "Quotations";
  const isCustomerResponse = item.stage === "Customer Response";

  const renderServiceIcon = (iconType: string) => {
    switch (iconType) {
      case "borewell":
        return (
          <div className="w-8 h-8 rounded-full bg-[#EBF7EE] text-[#48A760] flex items-center justify-center shrink-0">
            <Droplet className="w-4 h-4 fill-[#48A760]/20 stroke-[2.2]" />
          </div>
        );
      case "fencing":
        return (
          <div className="w-8 h-8 rounded-full bg-[#EBF5FA] text-[#1E75BB] flex items-center justify-center shrink-0">
            <Grid3X3 className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      case "farmhouse":
        return (
          <div className="w-8 h-8 rounded-full bg-[#F3F0FA] text-[#7C5CBF] flex items-center justify-center shrink-0">
            <Home className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      case "organic":
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-[#E8F8F3] text-[#10B981] flex items-center justify-center shrink-0">
            <Sprout className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
    }
  };

  const responseStatus =
    item.customerResponseStatus || (item.statusText as "Accepted" | "Rejected" | "Awaiting") || "Accepted";

  const renderResponseStatusBadge = () => {
    switch (responseStatus) {
      case "Accepted":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#E8F8F0] text-[#10B981] font-bold text-[11px] px-2.5 py-0.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Accepted
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#FEE2E2] text-[#EF4444] font-bold text-[11px] px-2.5 py-0.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            Rejected
          </span>
        );
      case "Awaiting":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#FEF9C3] text-[#CA8A04] font-bold text-[11px] px-2.5 py-0.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
            Awaiting
          </span>
        );
    }
  };

  const isQuotationCreated = item.statusText === "Quotation Created";
  const shouldShowApprove = isUnderVerification && (item.cardAction === "approve" || (isQuotationCreated && item.cardAction !== "view-details"));

  const handleActionClick = () => {
    if (isCustomerResponse) {
      onVerify(item, "view-details");
    } else if (isUnderVerification) {
      if (shouldShowApprove) {
        onVerify(item, "approve");
      } else {
        onVerify(item, "view-details");
      }
    } else {
      onVerify(item, "verify-now");
    }
  };

  const getButtonLabel = () => {
    if (isCustomerResponse) return "View Details";
    if (isUnderVerification) {
      return shouldShowApprove ? "Approve" : "View Details";
    }
    return "Verify Now";
  };

  return (
    <div className="bg-white rounded-[22px] border border-[#EAEFF4] p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[255px] group">
      {/* ── Top Row: Icon + ID Pill ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        {renderServiceIcon(item.iconType)}
        <span className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#4A5568] bg-[#F1F3F5] px-2.5 py-0.5 rounded-full tracking-wide">
          {item.code}
        </span>
      </div>

      {/* ── Middle: Customer Name, Category & Location ─────────────────────── */}
      <div className="flex flex-col gap-0.5 my-auto">
        <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] leading-tight text-[#1A1C1D] m-0 group-hover:text-[#1E75BB] transition-colors">
          {item.customerName}
        </h4>
        <p className="font-['Plus_Jakarta_Sans'] text-[12px] font-medium text-[#64748B] m-0">
          <span className="text-[#1A1C1D] font-semibold">{item.serviceCategory}</span>
          {item.serviceCategoryExtra && (
            <span className="text-[#1E75BB] font-bold"> {item.serviceCategoryExtra}</span>
          )}{" "}
          <span className="text-gray-300 mx-0.5">&bull;</span> {item.location}
        </p>

        {/* Status / Metric Box matching Figma Images */}
        {isCustomerResponse ? (
          <div className="bg-[#F8F9FB] rounded-xl p-2.5 mt-2 border border-[#ECEFF2] flex flex-col justify-center">
            <span className="text-[9.5px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
              STATUS
            </span>
            {renderResponseStatusBadge()}
          </div>
        ) : isUnderVerification ? (
          <div className="bg-[#F8F9FB] rounded-xl p-2.5 mt-2 border border-[#ECEFF2] flex flex-col justify-center">
            <span className="text-[9.5px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
              STATUS
            </span>
            {isQuotationCreated ? (
              <span className="inline-flex items-center gap-1.5 bg-[#FEF08A] text-[#111827] font-bold text-[11px] px-2.5 py-0.5 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                Quotation Created
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-[#DCFCE7] text-[#15803D] font-bold text-[11px] px-2.5 py-0.5 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                Under Verification
              </span>
            )}
          </div>
        ) : (
          <p className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#7A8699] font-normal line-clamp-2 leading-relaxed m-0 mt-1">
            {item.description}
          </p>
        )}
      </div>

      {/* ── Bottom: Action Button ───────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleActionClick}
        className="w-full h-[38px] rounded-full bg-[#1E75BB] hover:bg-[#1864A0] text-white font-['Plus_Jakarta_Sans'] font-bold text-[12px] flex items-center justify-center border-none cursor-pointer transition-all shadow-2xs hover:shadow-sm"
      >
        {getButtonLabel()}
      </button>
    </div>
  );
};
