import React from "react";
import { ArrowLeft } from "lucide-react";

interface UploadGoBackProps {
  onClick: () => void;
  className?: string;
}

const UploadGoBack: React.FC<UploadGoBackProps> = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-[clamp(0.29rem,0.6vw,0.75rem)] px-[clamp(0.72rem,1.5vw,1.75rem)] h-[clamp(1.44rem,3vw,3.25rem)] bg-white rounded-[clamp(1.44rem,3vw,3.75rem)] shadow-[0px_0px_4px_rgba(0,0,0,0.12)] hover:bg-gray-50 transition-all cursor-pointer ${className}`}
    >
      <ArrowLeft size={18} className="text-[#353535]" />
      <span className="font-['Plus_Jakarta_Sans'] font-normal text-[clamp(0.53rem,1.1vw,1.125rem)] leading-none text-[#353535]">
        Go Back
      </span>
    </button>
  );
};

export default UploadGoBack;
