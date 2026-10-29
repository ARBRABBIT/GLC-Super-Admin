import React, { useState } from "react";
import { MapPin } from "lucide-react";
import type { ServiceRequestPipelineItem } from "../types/maintenance.types";

interface GeneratedEstimationModalProps {
  isOpen: boolean;
  item: ServiceRequestPipelineItem | null;
  onClose: () => void;
  onApprove: (
    item: ServiceRequestPipelineItem,
    estimationData: { landSize: string; estimatedCost: string; description: string }
  ) => void;
}

export const GeneratedEstimationModal: React.FC<GeneratedEstimationModalProps> = ({
  isOpen,
  item,
  onClose,
  onApprove,
}) => {
  const [landSize, setLandSize] = useState(item?.landSize || "5 Acres");
  const [estimatedCost, setEstimatedCost] = useState(item?.estimatedCost || "₹ 2 Lakhs");
  const [description, setDescription] = useState(
    item?.serviceDescription || "the scope of work, parts required, and labor details..."
  );
  const [activeServiceTab, setActiveServiceTab] = useState<string>("Fencing");

  React.useEffect(() => {
    if (item) {
      setLandSize(item.landSize || "5 Acres");
      setEstimatedCost(item.estimatedCost || "₹ 2 Lakhs");
      setDescription(item.serviceDescription || "the scope of work, parts required, and labor details...");
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const serviceCategories = ["Fencing", "Borewell", "Farmhouse Construction"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApprove(item, { landSize, estimatedCost, description });
  };

  const itemDisplayId = item.landId || item.code || "ID 3042";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-[28px] max-w-[620px] w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col gap-5 animate-in zoom-in-95 duration-200">
        {/* ── Modal Header & Service Tabs ───────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#111827] m-0 tracking-tight">
            Generated Official Estimation - {itemDisplayId}
          </h2>

          {/* Service Pill Tabs */}
          <div className="flex flex-wrap items-center gap-2">
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
        </div>

        {/* ── Top Summary Strip (3 Columns) ─────────────────────────────────── */}
        <div className="bg-[#F8F9FB] rounded-[18px] p-4 sm:p-4.5 border border-[#ECEFF2] grid grid-cols-3 divide-x divide-[#E5E7EB]">
          {/* Owner Name */}
          <div className="pr-3">
            <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
              OWNER NAME
            </span>
            <span className="block text-[14px] font-bold text-[#111827] truncate">
              {item.customerName}
            </span>
          </div>

          {/* Service Category */}
          <div className="px-3 sm:px-4">
            <span className="block text-[10px] font-bold text-[#7A8699] uppercase tracking-wider mb-1">
              SERVICE CATEGORY
            </span>
            <span className="block text-[14px] font-bold text-[#111827] truncate">
              {item.serviceCategory}
              {item.serviceCategoryExtra ? ` ${item.serviceCategoryExtra} Others` : " +2 Others"}
            </span>
          </div>

          {/* Site Location */}
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

        {/* ── Form Inputs ───────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
          {/* Row 1: Land Size & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] font-medium text-[#4B5563] mb-2">
                Enter Land Size
              </label>
              <input
                type="text"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                placeholder="5 Acres"
                className="w-full h-[46px] bg-[#F8FAFC] rounded-xl px-4 text-xs font-bold text-[#111827] border border-[#E2E8F0] focus:border-[#1877F2] focus:bg-white outline-hidden transition-all placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-medium text-[#4B5563] mb-2">
                Enter Estimated Cost
              </label>
              <input
                type="text"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="₹ 2 Lakhs"
                className="w-full h-[46px] bg-[#F8FAFC] rounded-xl px-4 text-xs font-bold text-[#111827] border border-[#E2E8F0] focus:border-[#1877F2] focus:bg-white outline-hidden transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Row 2: Service Description Textarea */}
          <div>
            <label className="block text-[12.5px] font-medium text-[#4B5563] mb-2">
              Enter Service Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="the scope of work, parts required, and labor details..."
              className="w-full bg-[#F8FAFC] rounded-2xl p-4 text-xs text-[#111827] border border-[#E2E8F0] focus:border-[#1877F2] focus:bg-white outline-hidden transition-all resize-none placeholder:text-gray-400 leading-relaxed min-h-[110px]"
            />
          </div>

          {/* ── Footer Actions ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="font-medium text-xs text-[#4B5563] hover:text-[#111827] transition-colors border-none bg-transparent cursor-pointer p-0"
            >
              Back
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold text-xs cursor-pointer border-none shadow-2xs hover:shadow-xs transition-all active:scale-98"
            >
              Approve and Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

