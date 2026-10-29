import React, { useRef, useEffect } from "react";
import { UploadFile, type UploadedFileItem } from "./UploadFile";
import { Comments } from "./Comments";

interface ValuationUploadFileProps {
  activeTabLabel: string;
  uploadedFiles: UploadedFileItem[];
  commentValue: string;
  onCommentChange: (val: string) => void;
  onFileUpload: (files: FileList, imageType?: "cover" | "land") => void;
  onFileDelete: (fileId: string) => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  isFinishStep: boolean;
  isNextEnabled?: boolean;
  className?: string;
  style?: React.CSSProperties;

  boundaryRoadTypeValue?: string;
  onBoundaryRoadTypeChange?: (val: string) => void;
  boundaryRoadWidthValue?: string;
  onBoundaryRoadWidthChange?: (val: string) => void;

  recentTransactionTypeValue?: string;
  onRecentTransactionTypeChange?: (val: string) => void;
  valuationPerAcreValue?: string;
  onValuationPerAcreChange?: (val: string) => void;
  localMarketPriceValue?: string;
  onLocalMarketPriceChange?: (val: string) => void;

  geologicalAdvantagesTypeValue?: string;
  onGeologicalAdvantagesTypeChange?: (val: string) => void;

  upcomingInfrastructuresValue?: string;
  onUpcomingInfrastructuresChange?: (val: string) => void;

  railwayConnectivityTypeValue?: string;
  onRailwayConnectivityTypeChange?: (val: string) => void;
  railwayDistanceValue?: string;
  onRailwayDistanceChange?: (val: string) => void;

  airportConnectivityTypeValue?: string;
  onAirportConnectivityTypeChange?: (val: string) => void;
  airportDistanceValue?: string;
  onAirportDistanceChange?: (val: string) => void;
}

export const ValuationUploadFile: React.FC<ValuationUploadFileProps> = ({
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
  className = "",
  style,
  boundaryRoadTypeValue = "",
  onBoundaryRoadTypeChange,
  boundaryRoadWidthValue = "",
  onBoundaryRoadWidthChange,
  recentTransactionTypeValue = "",
  onRecentTransactionTypeChange,
  valuationPerAcreValue = "",
  onValuationPerAcreChange,
  localMarketPriceValue = "",
  onLocalMarketPriceChange,
  geologicalAdvantagesTypeValue = "",
  onGeologicalAdvantagesTypeChange,
  upcomingInfrastructuresValue = "",
  onUpcomingInfrastructuresChange,
  railwayConnectivityTypeValue = "",
  onRailwayConnectivityTypeChange,
  railwayDistanceValue = "",
  onRailwayDistanceChange,
  airportConnectivityTypeValue = "",
  onAirportConnectivityTypeChange,
  airportDistanceValue = "",
  onAirportDistanceChange,
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
        {/* ── Content Area ── */}
        <div className="flex flex-col gap-6">
          {activeTabLabel === "Road Approach" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">Type of Road Approach</h3>
                <div className="flex flex-row items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onBoundaryRoadTypeChange?.("Private Road")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      boundaryRoadTypeValue === "Private Road"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      boundaryRoadTypeValue === "Private Road"
                        ? "border-white bg-[#BDD327]"
                        : "border-[#BDD327] bg-white"
                    }`} />
                    <span className="font-semibold text-[14px]">Private Road</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onBoundaryRoadTypeChange?.("Government Road")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      boundaryRoadTypeValue === "Government Road" || boundaryRoadTypeValue === "Governement Road"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      boundaryRoadTypeValue === "Government Road" || boundaryRoadTypeValue === "Governement Road"
                        ? "border-white bg-[#BDD327]"
                        : "border-[#BDD327] bg-white"
                    }`} />
                    <span className="font-semibold text-[14px]">Government Road</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="font-semibold text-[14px] text-gray-700">Width of the Road (in Feet)</span>
                <input
                  type="text"
                  value={boundaryRoadWidthValue}
                  onChange={(e) => onBoundaryRoadWidthChange?.(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="Enter width"
                  maxLength={50}
                  className="w-full h-[48px] border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 outline-none focus:border-[#BDD327]"
                />
              </div>
            </div>
          ) : activeTabLabel === "Recent Transactions" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">Any recent transaction in surrounding lands?</h3>
                <div className="flex flex-row items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onRecentTransactionTypeChange?.("Available")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      recentTransactionTypeValue === "Available"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      recentTransactionTypeValue === "Available"
                        ? "border-white bg-[#BDD327]"
                        : "border-[#BDD327] bg-white"
                    }`} />
                    <span className="font-semibold text-[14px]">Available</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRecentTransactionTypeChange?.("Not Available")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      recentTransactionTypeValue === "Not Available"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      recentTransactionTypeValue === "Not Available"
                        ? "border-white bg-[#BDD327]"
                        : "border-[#BDD327] bg-white"
                    }`} />
                    <span className="font-semibold text-[14px]">Not Available</span>
                  </button>
                </div>
              </div>

              {recentTransactionTypeValue === "Available" && (
                <>
                  <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                    <span className="font-semibold text-[14px] text-gray-700">Valuation Per Acre</span>
                    <input
                      type="text"
                      value={valuationPerAcreValue}
                      onChange={(e) => onValuationPerAcreChange?.(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="Enter valuation"
                      maxLength={50}
                      className="w-full h-[48px] border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 outline-none focus:border-[#BDD327]"
                    />
                  </div>
                  <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                    <span className="font-semibold text-[14px] text-gray-700">Locall Market Acre Price</span>
                    <input
                      type="text"
                      value={localMarketPriceValue}
                      onChange={(e) => onLocalMarketPriceChange?.(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="Enter price"
                      maxLength={50}
                      className="w-full h-[48px] border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 outline-none focus:border-[#BDD327]"
                    />
                  </div>
                </>
              )}
            </div>
          ) : activeTabLabel === "Geological Advantages" ? (
            <div className="flex flex-col gap-3">
              <h3 className="text-black font-semibold font-sans text-[16px] m-0">Any Surrounding Mines & Geological Advantages?</h3>
              <div className="flex flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={() => onGeologicalAdvantagesTypeChange?.("Available")}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                    geologicalAdvantagesTypeValue === "Available"
                      ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                      : "border-gray-300 bg-white text-black"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border-2 ${
                    geologicalAdvantagesTypeValue === "Available"
                      ? "border-white bg-[#BDD327]"
                      : "border-[#BDD327] bg-white"
                  }`} />
                  <span className="font-semibold text-[14px]">Available</span>
                </button>

                <button
                  type="button"
                  onClick={() => onGeologicalAdvantagesTypeChange?.("Not Available")}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                    geologicalAdvantagesTypeValue === "Not Available"
                      ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                      : "border-gray-300 bg-white text-black"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border-2 ${
                    geologicalAdvantagesTypeValue === "Not Available"
                      ? "border-white bg-[#BDD327]"
                      : "border-[#BDD327] bg-white"
                  }`} />
                  <span className="font-semibold text-[14px]">Not Available</span>
                </button>
              </div>
            </div>
          ) : (activeTabLabel === "Future Plans" || activeTabLabel === "Validating Disadvantages") ? (
            <div className="flex flex-col gap-4">
              {/* The comments box covers these entirely */}
            </div>
          ) : activeTabLabel === "Upcoming Infrastrucutres" ? (
            <div className="flex flex-col gap-3">
              <h3 className="text-black font-semibold font-sans text-[16px] m-0">Upcoming Infrastructures</h3>
              <div className="relative w-full h-[48px]">
                <select
                  value={upcomingInfrastructuresValue}
                  onChange={(e) => onUpcomingInfrastructuresChange?.(e.target.value)}
                  className="appearance-none w-full h-full bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black cursor-pointer focus:outline-none focus:border-[#BDD327]"
                >
                  <option value="" disabled hidden>Select option</option>
                  <option value="Available">IT COMPANIES</option>
                  <option value="Not Available">Not Available</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L7 7L13 1" stroke="#363434" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          ) : activeTabLabel === "Railway Track Connectivity" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">Any Railway Track Connectivity?</h3>
                <div className="flex flex-row items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onRailwayConnectivityTypeChange?.("Available")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      railwayConnectivityTypeValue === "Available"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                  }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      railwayConnectivityTypeValue === "Available"
                        ? "border-white bg-[#BDD327]"
                        : "border-[#BDD327] bg-white"
                    }`} />
                    <span className="font-semibold text-[14px]">Available</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRailwayConnectivityTypeChange?.("Not Available")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      railwayConnectivityTypeValue === "Not Available"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                  }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      railwayConnectivityTypeValue === "Not Available"
                        ? "border-white bg-[#BDD327]"
                        : "border-[#BDD327] bg-white"
                    }`} />
                    <span className="font-semibold text-[14px]">Not Available</span>
                  </button>
                </div>
              </div>

              {railwayConnectivityTypeValue === "Available" && (
                <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                  <span className="font-semibold text-[14px] text-gray-700">Select distance</span>
                  <div className="relative w-full h-[48px]">
                    <select
                      value={railwayDistanceValue}
                      onChange={(e) => onRailwayDistanceChange?.(e.target.value)}
                      className="appearance-none w-full h-full bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black cursor-pointer focus:outline-none focus:border-[#BDD327]"
                    >
                      <option value="" disabled hidden>Select option</option>
                      <option value="0 - 10 kms">0 - 10 kms</option>
                      <option value="10 - 20 kms">10 - 20 kms</option>
                      <option value="20+ kms">20+ kms</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L13 1" stroke="#363434" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTabLabel === "Airport Connectivity" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">Any Airpot Connectivity?</h3>
                <div className="flex flex-row items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onAirportConnectivityTypeChange?.("Available")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      airportConnectivityTypeValue === "Available"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                  }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      airportConnectivityTypeValue === "Available"
                        ? "border-white bg-[#BDD327]"
                        : "border-[#BDD327] bg-white"
                    }`} />
                    <span className="font-semibold text-[14px]">Available</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAirportConnectivityTypeChange?.("Not Available")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      airportConnectivityTypeValue === "Not Available"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                  }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      airportConnectivityTypeValue === "Not Available"
                        ? "border-white bg-[#BDD327]"
                        : "border-[#BDD327] bg-white"
                    }`} />
                    <span className="font-semibold text-[14px]">Not Available</span>
                  </button>
                </div>
              </div>

              {airportConnectivityTypeValue === "Available" && (
                <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                  <span className="font-semibold text-[14px] text-gray-700">Select distance</span>
                  <div className="relative w-full h-[48px]">
                    <select
                      value={airportDistanceValue}
                      onChange={(e) => onAirportDistanceChange?.(e.target.value)}
                      className="appearance-none w-full h-full bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black cursor-pointer focus:outline-none focus:border-[#BDD327]"
                    >
                      <option value="" disabled hidden>Select option</option>
                      <option value="0 - 10 kms">0 - 10 kms</option>
                      <option value="10 - 20 kms">10 - 20 kms</option>
                      <option value="20+ kms">20+ kms</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L13 1" stroke="#363434" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h3 className="text-black font-semibold font-sans text-[16px] m-0">Upload File</h3>
              <UploadFile
                uploadedFiles={uploadedFiles}
                onFileUpload={onFileUpload}
                onFileDelete={onFileDelete}
              />
            </div>
          )}
        </div>

        {/* ── Comments Area ── */}
        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-black font-semibold font-sans text-[16px] m-0">
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
