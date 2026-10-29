import React from "react";

interface UploadSubmittedModalProps {

  onProceed: () => void;
  onDismiss: () => void;
  title?: string;
  description?: React.ReactNode;
}

export const UploadSubmittedModal: React.FC<UploadSubmittedModalProps> = ({

  onProceed,
  onDismiss,
  title,
  description,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div 
        className="box-sizing-border-box bg-white border border-[rgba(0,0,0,0.2)] shadow-[0px_0px_12.5px_rgba(0,0,0,0.15)] rounded-[24px] flex flex-col items-center justify-between p-8 relative animate-in zoom-in-95 duration-200"
        style={{
          width: "clamp(17.97rem, 37.43vw, 33.6875rem)", // 539px max
          height: "clamp(16.5rem, 34.38vw, 30.9375rem)", // 495px max
        }}
      >
        {/* Title */}
        <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[clamp(0.8rem,1.67vw,1.5rem)] text-black text-center mt-2">
          {title || "Customer Information Submitted"}
        </h3>

        {/* Icon Group */}
        <div className="relative flex items-center justify-center w-[clamp(6rem,12.5vw,11.25rem)] h-[clamp(6rem,12.5vw,11.25rem)] bg-[#2A3008]/[0.08] rounded-full shrink-0">
          <div className="w-[clamp(4.2rem,8.75vw,7.875rem)] h-[clamp(4.2rem,8.75vw,7.875rem)] flex items-center justify-center">
            <svg className="w-full h-full text-[#BDD327]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-13 5l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
          </div>
        </div>

        {/* Description */}
        {description ? (
          <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[clamp(0.67rem,1.39vw,1.25rem)] leading-snug text-[#3D4949] text-center max-w-[319px]">
            {description}
          </span>
        ) : (
          <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[clamp(0.67rem,1.39vw,1.25rem)] leading-snug text-[#3D4949] text-center max-w-[319px]">
            Proceed With <span className="text-[#0052cc] hover:underline cursor-pointer" onClick={onDismiss}>'Legal Documents'</span> for further uploading
          </span>
        )}

        {/* Button */}
        <button
          type="button"
          onClick={onProceed}
          className="flex items-center justify-center text-white rounded-[57px] shadow-lg hover:scale-105 active:scale-95 cursor-pointer font-['Plus_Jakarta_Sans'] font-normal w-[clamp(13.27rem,27.64vw,24.875rem)] h-[clamp(1.87rem,3.89vw,3.5rem)] shrink-0 mb-2"
          style={{
            background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)"
          }}
        >
          <span className="font-['Plus_Jakarta_Sans'] font-normal text-white text-[clamp(0.6rem,1.25vw,1.125rem)]">
            Proceed
          </span>
        </button>

      </div>
    </div>
  );
};
