import React from "react";
import { Check } from "lucide-react";

interface WorkOrderPublishSuccessModalProps {
  isOpen: boolean;
  customerName?: string;
  phaseName?: string;
  onClose: () => void;
}

export const WorkOrderPublishSuccessModal: React.FC<WorkOrderPublishSuccessModalProps> = ({
  isOpen,
  customerName = "—",
  phaseName = "Foundation",
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-[28px] max-w-[440px] w-full p-8 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        {/* Blue Circular Check Icon */}
        <div className="w-16 h-16 rounded-full bg-[#1E75BB] flex items-center justify-center text-white mb-5 shadow-md">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        {/* Title */}
        <h3 className="text-[20px] sm:text-[22px] font-bold text-[#111827] m-0 mb-3 tracking-tight">
          Progress Update Published
        </h3>

        {/* Body Text matching Figma Image 3 */}
        <p className="text-[13.5px] text-[#4B5563] leading-relaxed m-0 mb-7 font-normal">
          The latest <span className="font-bold text-[#111827]">Execution milestones</span> and{" "}
          <span className="font-bold text-[#111827]">Site images</span> have been successfully pushed to{" "}
          <span className="font-bold text-[#111827]">{customerName}’s</span> mobile application. The customer can now view the &apos;{phaseName}&apos; phase status.
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-[48px] rounded-xl bg-[#1E75BB] hover:bg-[#1864A0] text-white font-['Plus_Jakarta_Sans'] font-semibold text-sm cursor-pointer border-none shadow-xs hover:shadow-md transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};
