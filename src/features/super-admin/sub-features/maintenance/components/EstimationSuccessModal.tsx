import React from "react";
import { Check } from "lucide-react";

interface EstimationSuccessModalProps {
  isOpen: boolean;
  itemCode?: string;
  onReturn: () => void;
}

export const EstimationSuccessModal: React.FC<EstimationSuccessModalProps> = ({
  isOpen,
  itemCode = "ID 3042",
  onReturn,
}) => {
  if (!isOpen) return null;

  const formattedCode = itemCode.replace("#", "").replace("-", " ");

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onReturn} />
      <div className="relative bg-white rounded-[28px] max-w-[390px] w-full p-6 sm:p-7 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        {/* Blue Circular Check Icon */}
        <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center text-white mb-4 shadow-sm">
          <Check className="w-7 h-7 stroke-[3]" />
        </div>

        {/* Title */}
        <h3 className="text-[18px] sm:text-[20px] font-bold text-[#111827] m-0 mb-2 tracking-tight">
          Estimation Sent Successfully
        </h3>

        {/* Body text matching Figma Image 3 */}
        <p className="text-xs text-[#64748B] leading-relaxed m-0 mb-6 font-normal px-2">
          The quotation for <span className="font-bold text-[#111827]">{formattedCode}</span> has been pushed to the user&apos;s mobile application. The status is now updated to <span className="text-[#10B981] font-semibold">Awaiting User Approval</span>.
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onReturn}
          className="w-full py-2.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-['Plus_Jakarta_Sans'] font-semibold text-xs cursor-pointer border-none shadow-2xs hover:shadow-xs transition-all active:scale-98"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

