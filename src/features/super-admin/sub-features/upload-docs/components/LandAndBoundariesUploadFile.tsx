import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { UploadFile, type UploadedFileItem } from "./UploadFile";
import { Comments } from "./Comments";

interface LandAndBoundariesUploadFileProps {
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
  hasCoverImage?: boolean;
  className?: string;
  style?: React.CSSProperties;

  // LandShape
  landShapeValue?: string;
  onLandShapeChange?: (val: string) => void;

  // Facilities
  facilityAvailabilityValue?: string;
  onFacilityAvailabilityChange?: (val: string) => void;
  waterFacilityValue?: string;
  onWaterFacilityChange?: (val: string) => void;
  electricityFacilityValue?: string;
  onElectricityFacilityChange?: (val: string) => void;

  // Trees
  treesAvailabilityValue?: string;
  onTreesAvailabilityChange?: (val: string) => void;
  treesCountValue?: string;
  onTreesCountChange?: (val: string) => void;

  // Survey Reports
  surveyReportTypeValue?: string;
  onSurveyReportTypeChange?: (val: string) => void;
  privateSurveyFiles?: UploadedFileItem[];
  onPrivateSurveyFileUpload?: (files: FileList) => void;
  onPrivateSurveyFileDelete?: (fileId: string) => void;
  privateSurveyCommentValue?: string;
  onPrivateSurveyCommentChange?: (val: string) => void;
  governmentSurveyFiles?: UploadedFileItem[];
  onGovernmentSurveyFileUpload?: (files: FileList) => void;
  onGovernmentSurveyFileDelete?: (fileId: string) => void;
  governmentSurveyCommentValue?: string;
  onGovernmentSurveyCommentChange?: (val: string) => void;

  // Boundaries
  boundaryTypeValue?: string;
  onBoundaryTypeChange?: (val: string) => void;
  boundaryOwnerNameValue?: string;
  onBoundaryOwnerNameChange?: (val: string) => void;
  boundaryOwnerAgeValue?: string;
  onBoundaryOwnerAgeChange?: (val: string) => void;
  boundaryRoadTypeValue?: string;
  onBoundaryRoadTypeChange?: (val: string) => void;
  boundaryRoadWidthValue?: string;
  onBoundaryRoadWidthChange?: (val: string) => void;
  boundaryTreesCountValue?: string;
  onBoundaryTreesCountChange?: (val: string) => void;
  shapeOfTheLandOptions?: any[];
  treesCountOptions?: any[];
  boundariesOptions?: any[];
}

export const LandAndBoundariesUploadFile: React.FC<LandAndBoundariesUploadFileProps> = ({
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
  hasCoverImage = false,
  className = "",
  style,

  landShapeValue = "",
  onLandShapeChange,
  facilityAvailabilityValue = "",
  onFacilityAvailabilityChange,
  waterFacilityValue = "",
  onWaterFacilityChange,
  electricityFacilityValue = "",
  onElectricityFacilityChange,
  treesAvailabilityValue = "",
  onTreesAvailabilityChange,
  treesCountValue = "",
  onTreesCountChange,

  surveyReportTypeValue = "private",
  onSurveyReportTypeChange,
  privateSurveyFiles = [],
  onPrivateSurveyFileUpload,
  onPrivateSurveyFileDelete,
  privateSurveyCommentValue = "",
  onPrivateSurveyCommentChange,
  governmentSurveyFiles = [],
  onGovernmentSurveyFileUpload,
  onGovernmentSurveyFileDelete,
  governmentSurveyCommentValue = "",
  onGovernmentSurveyCommentChange,

  boundaryTypeValue = "",
  onBoundaryTypeChange,
  boundaryOwnerNameValue = "",
  onBoundaryOwnerNameChange,
  boundaryOwnerAgeValue = "",
  onBoundaryOwnerAgeChange,
  boundaryRoadTypeValue = "",
  onBoundaryRoadTypeChange,
  boundaryRoadWidthValue = "",
  onBoundaryRoadWidthChange,
  boundaryTreesCountValue = "",
  onBoundaryTreesCountChange,
  shapeOfTheLandOptions = [],
  treesCountOptions = [],
  boundariesOptions = [],
}) => {
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const landImagesInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTabLabel]);

  const [showChooseImageModal, setShowChooseImageModal] = useState(false);

  const [isLandShapeDropdownOpen, setIsLandShapeDropdownOpen] = useState(false);
  const [isTreesCountDropdownOpen, setIsTreesCountDropdownOpen] = useState(false);
  const [isBoundaryDropdownOpen, setIsBoundaryDropdownOpen] = useState(false);
  const [isBoundaryTreesDropdownOpen, setIsBoundaryTreesDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBoundaryDropdownOpen(false);
        setIsBoundaryTreesDropdownOpen(false);
        setIsTreesCountDropdownOpen(false);
        setIsLandShapeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateFiles = (files: FileList | File[]): File[] => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase();
      const isValidType = file.type.startsWith('image/') || 
                         ['pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg'].includes(ext || '');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        toast.error(`"${file.name}" is not a supported format. Please upload PDF, DOCX, or Images.`);
      } else if (!isValidSize) {
        toast.error(`"${file.name}" is too large. Max size is 5MB.`);
      } else {
        validFiles.push(file);
      }
    }
    return validFiles;
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const valid = validateFiles(e.target.files);
      if (valid.length > 0) {
        const dt = new DataTransfer();
        valid.forEach(f => dt.items.add(f));
        onFileUpload(dt.files, "cover");
        setShowChooseImageModal(false);
      }
      e.target.value = "";
    }
  };

  const handleLandImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const valid = validateFiles(e.target.files);
      if (valid.length > 0) {
        const dt = new DataTransfer();
        valid.forEach(f => dt.items.add(f));
        onFileUpload(dt.files, "land");
        setShowChooseImageModal(false);
      }
      e.target.value = "";
    }
  };

  const isBoundaryTab =
    activeTabLabel === "East Boundaries" ||
    activeTabLabel === "West Boundaries" ||
    activeTabLabel === "North Boundaries" ||
    activeTabLabel === "South Boundaries";

  const renderUploaderBox = (type: "private" | "government") => {
    const isPrivate = type === "private";
    const files = isPrivate ? privateSurveyFiles : governmentSurveyFiles;
    const deleteHandler = isPrivate ? onPrivateSurveyFileDelete : onGovernmentSurveyFileDelete;
    const uploadHandler = isPrivate ? onPrivateSurveyFileUpload : onGovernmentSurveyFileUpload;

    return (
      <div className="w-full bg-white shadow-sm rounded-xl p-4 border border-gray-100">
        <UploadFile
          uploadedFiles={files || []}
          onFileUpload={(filesList) => uploadHandler?.(filesList)}
          onFileDelete={(id) => deleteHandler?.(id)}
        />
      </div>
    );
  };

  const renderCommentBox = (type: "private" | "government") => {
    const isPrivate = type === "private";
    const commentVal = isPrivate ? privateSurveyCommentValue : governmentSurveyCommentValue;
    const changeHandler = isPrivate ? onPrivateSurveyCommentChange : onGovernmentSurveyCommentChange;
    const targetType = isPrivate ? "Private" : "Government";

    return (
      <div className="flex flex-col gap-2 w-full mt-2">
        <span className="font-semibold text-[16px] text-black">
          Add Comments
        </span>
        <Comments
          commentValue={commentVal || ""}
          onCommentChange={(val) => changeHandler?.(val)}
          activeTabLabel={targetType}
          mockDictationSuffix=" Survey Report."
        />
      </div>
    );
  };

  return (
    <div
      className={`bg-white select-none ${className} flex flex-col w-full rounded-3xl overflow-hidden h-full`}
      style={style}
    >
      {/* ── Choose Image Type Modal ── */}
      {showChooseImageModal && (
        <div
          onClick={() => setShowChooseImageModal(false)}
          className="z-[99999] fixed inset-0 bg-black/40 flex items-center justify-center select-none"
        >
          <div className="box-border relative w-full max-w-lg bg-white shadow-xl rounded-[24px] flex flex-col items-center justify-start p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-['Plus_Jakarta_Sans',_sans-serif] font-semibold text-[22px] text-black w-full mb-8">
              Choose upload Image
            </h3>

            <div className="flex flex-row gap-8 justify-center w-full">
              <div className="box-border w-[200px] h-[200px] bg-white shadow-md rounded-[12px] relative flex flex-col items-center justify-center">
                <span className="absolute top-4 font-['Plus_Jakarta_Sans',_sans-serif] font-semibold text-[16px] text-black">
                  Cover Image
                </span>
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-[#E6EEAD]">
                  <div className="w-[40px] h-[40px] bg-[#2A3008] rounded-full flex items-center justify-center">
                    <svg className="w-[20px] h-[20px] text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="15" x2="12" y2="3" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="5" y1="21" x2="19" y2="21" />
                    </svg>
                  </div>
                </div>
                <button type="button" onClick={() => !hasCoverImage && coverImageInputRef.current?.click()} className={`absolute bottom-4 px-6 py-2 bg-[#2A3008] text-white rounded-full font-medium text-[14px] border-none ${hasCoverImage ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95 transition-all cursor-pointer"}`} disabled={hasCoverImage}>
                  {hasCoverImage ? "Uploaded" : "Upload"}
                </button>
              </div>

              <div className="box-border w-[200px] h-[200px] bg-white shadow-md rounded-[12px] relative flex flex-col items-center justify-center">
                <span className="absolute top-4 font-['Plus_Jakarta_Sans',_sans-serif] font-semibold text-[16px] text-black">
                  Land Images
                </span>
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-[#E6EEAD]">
                  <div className="w-[40px] h-[40px] bg-[#2A3008] rounded-full flex items-center justify-center">
                    <svg className="w-[20px] h-[20px] text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="15" x2="12" y2="3" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="5" y1="21" x2="19" y2="21" />
                    </svg>
                  </div>
                </div>
                <button type="button" onClick={() => landImagesInputRef.current?.click()} className="absolute bottom-4 px-6 py-2 bg-[#2A3008] text-white rounded-full font-medium text-[14px] border-none hover:scale-105 active:scale-95 transition-all cursor-pointer">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <input ref={coverImageInputRef} type="file" multiple onChange={handleCoverImageChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,image/*" />
      <input ref={landImagesInputRef} type="file" multiple onChange={handleLandImagesChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,image/*" />

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
        <div className="flex flex-col gap-6" ref={dropdownRef}>
          {activeTabLabel === "Survey Report" ? (
            <div className="flex flex-col gap-6">
              <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                Select Survey Report Type
              </h3>
              
              <div className="flex flex-row items-center gap-4 flex-wrap">
                <button className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${surveyReportTypeValue === "private" ? "border-[#2D3409] bg-[#2D3409] text-white" : "border-gray-300 bg-white text-black"}`} type="button" onClick={() => onSurveyReportTypeChange?.("private")}>
                  <div className={`w-3 h-3 rounded-full border-2 ${surveyReportTypeValue === "private" ? "border-white bg-[#BDD327]" : "border-[#BDD327] bg-white"}`} />
                  <span className="font-semibold text-[14px]">Private Survey Report</span>
                </button>

                <button className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${surveyReportTypeValue === "government" ? "border-[#2D3409] bg-[#2D3409] text-white" : "border-gray-300 bg-white text-black"}`} type="button" onClick={() => onSurveyReportTypeChange?.("government")}>
                  <div className={`w-3 h-3 rounded-full border-2 ${surveyReportTypeValue === "government" ? "border-white bg-[#BDD327]" : "border-[#BDD327] bg-white"}`} />
                  <span className="font-semibold text-[14px]">Government Survey Report</span>
                </button>

                <button className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${surveyReportTypeValue === "both" ? "border-[#2D3409] bg-[#2D3409] text-white" : "border-gray-300 bg-white text-black"}`} type="button" onClick={() => onSurveyReportTypeChange?.("both")}>
                  <div className={`w-3 h-3 rounded-full border-2 ${surveyReportTypeValue === "both" ? "border-white bg-[#BDD327]" : "border-[#BDD327] bg-white"}`} />
                  <span className="font-semibold text-[14px]">Both Survey Reports</span>
                </button>
              </div>

              <div className="flex flex-col gap-8 w-full mt-4">
                {(surveyReportTypeValue === "private" || surveyReportTypeValue === "both") && (
                  <div className="flex flex-col gap-4 w-full">
                    <h4 className="font-semibold text-[18px] text-black m-0">Private Survey Report</h4>
                    {renderUploaderBox("private")}
                    {renderCommentBox("private")}
                  </div>
                )}

                {(surveyReportTypeValue === "government" || surveyReportTypeValue === "both") && (
                  <div className="flex flex-col gap-4 w-full border-t pt-8">
                    <h4 className="font-semibold text-[18px] text-black m-0">Government Survey Report</h4>
                    {renderUploaderBox("government")}
                    {renderCommentBox("government")}
                  </div>
                )}
              </div>
            </div>
          ) : activeTabLabel === "Shape of the Land" ? (
            <div className="flex flex-col gap-3">
              <h3 className="text-black font-semibold font-sans text-[16px] m-0">Shape of the Land</h3>
              <div className="relative w-full">
                <button className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] flex items-center justify-between px-4 cursor-pointer outline-none" type="button" onClick={() => setIsLandShapeDropdownOpen(!isLandShapeDropdownOpen)}>
                  <span className={`font-sans text-[14px] ${landShapeValue ? "text-black" : "text-gray-400"}`}>
                    {shapeOfTheLandOptions?.find((opt: any) => opt.id.toString() === landShapeValue)?.description || "Select shape..."}
                  </span>
                  <svg className="w-3 h-3 text-gray-500" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {isLandShapeDropdownOpen && (
                  <div className="absolute top-[100%] left-0 right-0 bg-white border border-gray-200 rounded-[8px] shadow-lg z-[1010] mt-1 max-h-[250px] overflow-y-auto">
                    {shapeOfTheLandOptions?.map((opt: any) => (
                      <div className={`px-4 py-3 font-sans text-[14px] cursor-pointer hover:bg-gray-50 ${landShapeValue === opt.id.toString() ? "bg-[#E5F1F9]" : ""}`} key={opt.id} onClick={() => { onLandShapeChange?.(opt.id.toString()); setIsLandShapeDropdownOpen(false); }}>
                        {opt.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeTabLabel === "Water and Electricity Facility" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">Select availability Facility</h3>
                <div className="flex flex-row items-center gap-4">
                  <button className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${facilityAvailabilityValue === "water" ? "border-[#2B2D2F] bg-[#2B2D2F] text-white" : "border-gray-300 bg-white text-black"}`} type="button" onClick={() => onFacilityAvailabilityChange?.("water")}>
                    <div className={`w-3 h-3 rounded-full border-2 ${facilityAvailabilityValue === "water" ? "border-white bg-[#5CA2D3]" : "border-[#85BFE5] bg-white"}`} />
                    <span className="font-semibold text-[14px]">Water Facility</span>
                  </button>
                  <button className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${facilityAvailabilityValue === "electricity" ? "border-[#2B2D2F] bg-[#2B2D2F] text-white" : "border-gray-300 bg-white text-black"}`} type="button" onClick={() => onFacilityAvailabilityChange?.("electricity")}>
                    <div className={`w-3 h-3 rounded-full border-2 ${facilityAvailabilityValue === "electricity" ? "border-white bg-[#5CA2D3]" : "border-[#85BFE5] bg-white"}`} />
                    <span className="font-semibold text-[14px]">Electricity Facility</span>
                  </button>
                  <button className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${facilityAvailabilityValue === "both" ? "border-[#2B2D2F] bg-[#2B2D2F] text-white" : "border-gray-300 bg-white text-black"}`} type="button" onClick={() => onFacilityAvailabilityChange?.("both")}>
                    <div className={`w-3 h-3 rounded-full border-2 ${facilityAvailabilityValue === "both" ? "border-white bg-[#5CA2D3]" : "border-[#85BFE5] bg-white"}`} />
                    <span className="font-semibold text-[14px]">Both</span>
                  </button>
                </div>
              </div>

              {(facilityAvailabilityValue === "water" || facilityAvailabilityValue === "both") && (
                <div className="flex flex-col gap-3">
                  <span className="font-semibold text-[14px]">Water Facility source?</span>
                  <input className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 outline-none focus:border-[#BDD327]" type="text" placeholder="Borewell" value={waterFacilityValue} onChange={(e) => onWaterFacilityChange?.(e.target.value)} />
                </div>
              )}
              {(facilityAvailabilityValue === "electricity" || facilityAvailabilityValue === "both") && (
                <div className="flex flex-col gap-3">
                  <span className="font-semibold text-[14px]">Distance to nearest transformer? (in meters)</span>
                  <input className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 outline-none focus:border-[#BDD327]" type="text" placeholder="100" value={electricityFacilityValue} onChange={(e) => onElectricityFacilityChange?.(e.target.value)} />
                </div>
              )}
            </div>
          ) : activeTabLabel === "Any Existing Trees" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">Any Existing Tress available surrounding land?</h3>
                <div className="flex flex-row items-center gap-4">
                  <button className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${treesAvailabilityValue === "available" ? "border-[#2D3409] bg-[#2D3409] text-white" : "border-gray-300 bg-white text-black"}`} type="button" onClick={() => { onTreesAvailabilityChange?.("available"); }}>
                    <div className={`w-3 h-3 rounded-full border-2 ${treesAvailabilityValue === "available" ? "border-white bg-[#BDD327]" : "border-[#BDD327] bg-white"}`} />
                    <span className="font-semibold text-[14px]">Available</span>
                  </button>
                  <button className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${treesAvailabilityValue === "not-available" ? "border-[#2D3409] bg-[#2D3409] text-white" : "border-gray-300 bg-white text-black"}`} type="button" onClick={() => { onTreesAvailabilityChange?.("not-available"); onTreesCountChange?.(""); }}>
                    <div className={`w-3 h-3 rounded-full border-2 ${treesAvailabilityValue === "not-available" ? "border-white bg-[#BDD327]" : "border-[#BDD327] bg-white"}`} />
                    <span className="font-semibold text-[14px]">Not Available</span>
                  </button>
                </div>
              </div>
              {treesAvailabilityValue === "available" && (
                <div className="flex flex-col gap-3">
                  <span className="font-semibold text-[14px] text-gray-600">Trees count</span>
                  <div className="relative w-full">
                    <button className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.15)] rounded-[8px] flex items-center justify-between px-4 outline-none cursor-pointer" type="button" onClick={() => setIsTreesCountDropdownOpen(!isTreesCountDropdownOpen)}>
                      <span className={`font-sans text-[14px] ${treesCountValue ? "text-black" : "text-gray-400"}`}>
                        {treesCountOptions?.find((opt: any) => opt.id.toString() === treesCountValue)?.description || "Select tree count..."}
                      </span>
                      <svg className="text-gray-500 w-3 h-3" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {isTreesCountDropdownOpen && (
                      <div className="absolute top-[100%] left-0 right-0 bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] shadow-lg z-[1010] mt-1 max-h-[250px] overflow-y-auto">
                        {treesCountOptions?.map((opt: any) => (
                          <div className={`px-4 py-3 font-sans text-[14px] cursor-pointer hover:bg-gray-50 ${treesCountValue === opt.id.toString() ? "bg-[#E5F1F9]" : ""}`} key={opt.id} onClick={() => { onTreesCountChange?.(opt.id.toString()); setIsTreesCountDropdownOpen(false); }}>
                            {opt.description}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : isBoundaryTab ? (
            <div className="flex flex-col gap-4">
              <h3 className="text-black font-semibold font-sans text-[16px] m-0">{activeTabLabel}</h3>
              <div className="relative w-full">
                <button className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.15)] rounded-[8px] flex items-center justify-between px-4 outline-none cursor-pointer" type="button" onClick={() => setIsBoundaryDropdownOpen(!isBoundaryDropdownOpen)}>
                  <span className={`font-sans text-[14px] ${boundaryTypeValue ? "text-black" : "text-gray-400"}`}>
                    {boundaryTypeValue || ("What is on the " + activeTabLabel.toLowerCase().split(' ')[0] + " side?")}
                  </span>
                  <svg className="text-gray-500 w-3 h-3" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {isBoundaryDropdownOpen && (
                  <div className="absolute top-[100%] left-0 right-0 bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] shadow-lg z-[1010] mt-1 max-h-[250px] overflow-y-auto">
                    {boundariesOptions?.map((opt: any) => (
                      <div className={`px-4 py-3 font-sans text-[14px] cursor-pointer hover:bg-gray-50 ${boundaryTypeValue === (opt.description === "Tress" ? "Trees" : opt.description) ? "bg-[#E5F1F9]" : ""}`} key={opt.id} onClick={() => { onBoundaryTypeChange?.(opt.description === "Tress" ? "Trees" : opt.description); setIsBoundaryDropdownOpen(false); }}>
                        {opt.description === "Tress" ? "Trees" : opt.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {boundaryTypeValue === "Land" && (
                <div className="flex flex-col gap-4 mt-4">
                  <span className="font-semibold text-[16px] text-black">Owner details of land</span>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-[14px] text-gray-600">Name</span>
                    <input className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.15)] rounded-[8px] px-4 font-sans text-[14px] outline-none focus:border-[#BDD327]" type="text" placeholder="Krishna" value={boundaryOwnerNameValue} onChange={(e) => onBoundaryOwnerNameChange?.(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-[14px] text-gray-600">Age</span>
                    <input className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.15)] rounded-[8px] px-4 font-sans text-[14px] outline-none focus:border-[#BDD327]" type="text" placeholder="43" value={boundaryOwnerAgeValue} onChange={(e) => onBoundaryOwnerAgeChange?.(e.target.value)} />
                  </div>
                </div>
              )}
              
              {boundaryTypeValue === "Road" && (
                <div className="flex flex-col gap-4 mt-4">
                  <span className="font-semibold text-[16px] text-black">Type of Road</span>
                  <div className="flex flex-row items-center gap-4">
                    <button className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${boundaryRoadTypeValue === "Private Road" ? "border-[#2780C4] bg-[#2780C4] text-white" : "border-gray-300 bg-transparent text-black"}`} type="button" onClick={() => onBoundaryRoadTypeChange?.("Private Road")}>
                      <div className={`w-3 h-3 rounded-full border-2 ${boundaryRoadTypeValue === "Private Road" ? "border-white bg-[#2780C4]" : "border-[#85BFE5] bg-white"}`} />
                      <span className="font-semibold text-[14px]">Private Road</span>
                    </button>
                    <button className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${boundaryRoadTypeValue === "Government Road" ? "border-[#2780C4] bg-[#2780C4] text-white" : "border-gray-300 bg-transparent text-black"}`} type="button" onClick={() => onBoundaryRoadTypeChange?.("Government Road")}>
                      <div className={`w-3 h-3 rounded-full border-2 ${boundaryRoadTypeValue === "Government Road" ? "border-white bg-[#2780C4]" : "border-[#85BFE5] bg-white"}`} />
                      <span className="font-semibold text-[14px]">Government Road</span>
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="font-semibold text-[14px] text-gray-600">Width of the Road <span className="text-gray-400">(in Feet)</span></span>
                    <input className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.15)] rounded-[8px] px-4 font-sans text-[14px] outline-none focus:border-[#BDD327]" type="text" placeholder="100" value={boundaryRoadWidthValue} onChange={(e) => onBoundaryRoadWidthChange?.(e.target.value)} />
                  </div>
                </div>
              )}
              
              {boundaryTypeValue === "Trees" && (
                <div className="flex flex-col gap-4 mt-4">
                  <span className="font-semibold text-[14px] text-gray-600">Trees Count</span>
                  <div className="relative w-full">
                    <button className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.15)] rounded-[8px] flex items-center justify-between px-4 outline-none cursor-pointer" type="button" onClick={() => setIsBoundaryTreesDropdownOpen(!isBoundaryTreesDropdownOpen)}>
                      <span className={`font-sans text-[14px] ${boundaryTreesCountValue ? "text-black" : "text-gray-400"}`}>
                        {boundaryTreesCountValue || "1 - 10"}
                      </span>
                      <svg className="text-gray-500 w-3 h-3" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {isBoundaryTreesDropdownOpen && (
                      <div className="absolute top-[100%] left-0 right-0 bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] shadow-lg z-[1010] mt-1 max-h-[250px] overflow-y-auto">
                        {(treesCountOptions?.map(opt => opt.description) || []).map((opt) => (
                          <div className={`px-4 py-3 font-sans text-[14px] cursor-pointer hover:bg-gray-50 ${boundaryTreesCountValue === opt ? "bg-[#E5F1F9]" : ""}`} key={opt} onClick={() => { onBoundaryTreesCountChange?.(opt); setIsBoundaryTreesDropdownOpen(false); }}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                Upload File
              </h3>
              {activeTabLabel === "Land Images" ? (
                <div className="flex flex-col gap-6 w-full">
                  <button
                    type="button"
                    onClick={() => setShowChooseImageModal(true)}
                    className="w-[200px] h-[50px] bg-[#2A3008] text-white rounded-full font-medium text-[14px] hover:opacity-90 transition-opacity"
                  >
                    Choose Images
                  </button>
                  {uploadedFiles && uploadedFiles.length > 0 && (
                    <div className="flex flex-col gap-5 w-full mt-2">
                      <h4 className="font-sans font-semibold text-[18px] text-black m-0">Uploaded Files</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        {/* Cover Image Column */}
                        <div className="flex flex-col gap-3 w-full">
                          <span className="font-sans text-[16px] text-black">Cover image</span>
                          {uploadedFiles.filter(f => f.imageType === "cover").map((file) => (
                            <div key={file.id} className="relative w-full shrink-0 h-[72px] bg-[#EEF5FA] rounded-[12px] flex flex-row items-center px-4 gap-4">
                              <div className="flex items-center justify-center bg-white w-[42px] h-[42px] rounded-[8px] shrink-0 border border-gray-100 shadow-sm relative">
                                <div className="w-[22px] h-[26px] bg-[#F2F4F7] rounded-sm flex items-end relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-white"></div>
                                  <div className="w-full bg-[#E33B32] text-white text-[6px] font-bold text-center leading-tight py-[2px] tracking-wide rounded-sm mx-[2px] mb-[2px]">PDF</div>
                                </div>
                              </div>
                              <div className="flex flex-col justify-center flex-1 min-w-0">
                                <span className="truncate text-black font-sans font-medium text-[15px] leading-[20px] block" title={file.name}>{file.name}</span>
                                <span className="font-sans font-medium text-[12px] text-gray-500 mt-1">{file.size}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {file.url && (
                                  <button type="button" onClick={() => window.open(file.url, '_blank')} className="flex items-center justify-center bg-transparent cursor-pointer hover:bg-gray-200 rounded p-1.5 transition-colors border-none" title="Download">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                  </button>
                                )}
                                <button type="button" onClick={() => onFileDelete(file.id)} className="flex items-center justify-center bg-transparent cursor-pointer hover:bg-red-100 rounded p-1.5 transition-colors border-none group" title="Delete">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-red-500 transition-colors"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Land Images Column */}
                        <div className="flex flex-col gap-3 w-full">
                          <span className="font-sans text-[16px] text-black">Land images</span>
                          {uploadedFiles.filter(f => f.imageType === "land" || !f.imageType).map((file) => (
                            <div key={file.id} className="relative w-full shrink-0 h-[72px] bg-[#EEF5FA] rounded-[12px] flex flex-row items-center px-4 gap-4">
                              <div className="flex items-center justify-center bg-white w-[42px] h-[42px] rounded-[8px] shrink-0 border border-gray-100 shadow-sm relative">
                                <div className="w-[22px] h-[26px] bg-[#F2F4F7] rounded-sm flex items-end relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-white"></div>
                                  <div className="w-full bg-[#E33B32] text-white text-[6px] font-bold text-center leading-tight py-[2px] tracking-wide rounded-sm mx-[2px] mb-[2px]">PDF</div>
                                </div>
                              </div>
                              <div className="flex flex-col justify-center flex-1 min-w-0">
                                <span className="truncate text-black font-sans font-medium text-[15px] leading-[20px] block" title={file.name}>{file.name}</span>
                                <span className="font-sans font-medium text-[12px] text-gray-500 mt-1">{file.size}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {file.url && (
                                  <button type="button" onClick={() => window.open(file.url, '_blank')} className="flex items-center justify-center bg-transparent cursor-pointer hover:bg-gray-200 rounded p-1.5 transition-colors border-none" title="Download">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                  </button>
                                )}
                                <button type="button" onClick={() => onFileDelete(file.id)} className="flex items-center justify-center bg-transparent cursor-pointer hover:bg-red-100 rounded p-1.5 transition-colors border-none group" title="Delete">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-red-500 transition-colors"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <UploadFile
                  uploadedFiles={uploadedFiles}
                  onFileUpload={onFileUpload}
                  onFileDelete={onFileDelete}
                />
              )}
            </div>
          )}
        </div>

        {/* ── Comments Area ── */}
        {activeTabLabel !== "Survey Report" && (
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
        )}
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
