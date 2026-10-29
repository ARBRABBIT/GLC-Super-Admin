import React, { useRef, useEffect } from "react";
import { UploadFile, type UploadedFileItem } from "./UploadFile";
import { Comments } from "./Comments";

interface LegalUploadFileProps {
  activeTabLabel: string;
  uploadedFiles: UploadedFileItem[];
  commentValue: string;
  onCommentChange: (val: string) => void;
  onFileUpload: (files: FileList, imageType?: "cover" | "land") => void;
  onFileDelete: (fileId: string) => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  isFinishStep?: boolean;
  isNextEnabled?: boolean;
  coordinatesValue?: string;
  onCoordinatesChange?: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const LegalUploadFile: React.FC<LegalUploadFileProps> = ({
  activeTabLabel,
  uploadedFiles,
  commentValue,
  onCommentChange,
  onFileUpload,
  onFileDelete,
  onPrevTab,
  onNextTab,
  isFinishStep,
  isNextEnabled,
  coordinatesValue = "",
  onCoordinatesChange,
  className = "",
  style,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTabLabel]);

  return (
    <div 
      className={`bg-white select-none ${className} flex flex-col w-full rounded-3xl overflow-hidden h-full`} 
      style={style} 
    >
      {/* ── Header (Fixed) ── */}
      <div className="px-6 py-6 shrink-0">
        <h2 className="text-black font-sans font-bold text-base md:text-lg m-0 leading-tight">
          {activeTabLabel}
        </h2>
        <p className="text-[#8C9088] font-sans text-xs md:text-sm m-0 mt-1">
          Provide details and supporting documents for the {activeTabLabel}.
        </p>
      </div>

      <hr className="border-t border-gray-100 w-full m-0 shrink-0" />

      {/* ── Content Area (Scrollable) ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8 flex flex-col gap-8">
        {/* ── Upload / Input Area ── */}
        <div className="flex flex-col gap-4">
          <h3 className="text-black font-semibold font-sans text-base m-0">
            {activeTabLabel === "Land Coordinates" ? "Land Coordinates" : "Upload file"}
          </h3>
          
          {activeTabLabel === "Land Coordinates" ? (
            <input
              type="text"
              placeholder="https://maps.app.goo.gl/..."
              value={coordinatesValue}
              onChange={(e) => onCoordinatesChange?.(e.target.value)}
              className="w-full min-h-12 border border-[rgba(0,0,0,0.3)] rounded-lg px-4 font-sans text-sm text-blue-600 outline-none focus:border-blue-500"
            />
          ) : (
            <UploadFile
              uploadedFiles={uploadedFiles}
              onFileUpload={onFileUpload}
              onFileDelete={onFileDelete}
            />
          )}
        </div>

        {/* ── Comments Area ── */}
        <div className="flex flex-col gap-4">
          <h3 className="text-black font-semibold font-sans text-base m-0">
            Add Comments
          </h3>
          <Comments
            commentValue={commentValue}
            onCommentChange={onCommentChange}
            activeTabLabel={activeTabLabel}
          />
        </div>
      </div>

      {/* ── Footer Navigation ── */}
      <div className="flex flex-row justify-end items-center gap-4 px-6 md:px-8 py-4 md:py-6 border-t border-gray-100 bg-white shrink-0">
        <button 
          type="button" 
          onClick={onPrevTab} 
          className="flex items-center justify-center font-sans font-semibold text-[#1A1C1D] border border-[#D0D5DD] bg-white cursor-pointer hover:bg-gray-50 active:scale-95 transition-all box-border w-28 md:w-32 min-h-11 md:min-h-12 rounded-full text-sm md:text-base" 
        >
          Back
        </button>

        <button 
          type="button" 
          onClick={onNextTab} 
          disabled={!isNextEnabled} 
          className={`flex items-center justify-center font-sans font-semibold text-white transition-all w-28 md:w-32 min-h-11 md:min-h-12 bg-[#2A3008] rounded-full text-sm md:text-base border-none ${isNextEnabled ? 'cursor-pointer hover:scale-105 active:scale-95 shadow-md' : 'opacity-50 cursor-not-allowed'}`} 
        >
          {isFinishStep ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};
