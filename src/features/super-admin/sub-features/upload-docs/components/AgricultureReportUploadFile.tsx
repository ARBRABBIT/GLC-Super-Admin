import React, { useRef, useState, useEffect } from "react";
import { UploadFile, type UploadedFileItem } from "./UploadFile";
import { Comments } from "./Comments";
import { useGetAllMasterDataQuery } from "@/features/super-admin/api/masterData.api";

interface AgricultureReportUploadFileProps {
  activeTabLabel: string;
  uploadedFiles: UploadedFileItem[];
  commentValue: string;
  onCommentChange: (val: string) => void;
  onFileUpload: (files: FileList) => void;
  onFileDelete: (fileId: string) => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  isFinishStep: boolean;
  isNextEnabled?: boolean;
  className?: string;
  style?: React.CSSProperties;

  // Agriculture specific states
  selectedSoilType?: string;
  onSoilTypeChange?: (val: string) => void;
  selectedCropType?: string;
  onCropTypeChange?: (val: string) => void;
  waterLevelValue?: string;
  onWaterLevelChange?: (val: string) => void;
  selectedFutureCrops?: string;
  onFutureCropsChange?: (val: string) => void;
  yieldCostValue?: string;
  onYieldCostChange?: (val: string) => void;
  yieldReturnsValue?: string;
  onYieldReturnsChange?: (val: string) => void;
  cultivationTypeValue?: string;
  onCultivationTypeChange?: (val: string) => void;
  cultivationNameValue?: string;
  onCultivationNameChange?: (val: string) => void;
  cultivationContactValue?: string;
  onCultivationContactChange?: (val: string) => void;
  maintenanceCropValue?: string;
  onMaintenanceCropChange?: (val: string) => void;
  maintenanceReturnsValue?: string;
  onMaintenanceReturnsChange?: (val: string) => void;
  advantagesValue?: string;
  onAdvantagesChange?: (val: string) => void;
  disadvantagesValue?: string;
  onDisadvantagesChange?: (val: string) => void;
}

export const AgricultureReportUploadFile: React.FC<AgricultureReportUploadFileProps> = ({
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

  selectedSoilType = "Red Soil",
  onSoilTypeChange,
  selectedCropType = "Paddy",
  onCropTypeChange,
  waterLevelValue = "",
  onWaterLevelChange,
  selectedFutureCrops = "",
  onFutureCropsChange,
  yieldCostValue = "",
  onYieldCostChange,
  yieldReturnsValue = "",
  onYieldReturnsChange,
  cultivationTypeValue = "Self",
  onCultivationTypeChange,
  cultivationNameValue = "",
  onCultivationNameChange,
  cultivationContactValue = "",
  onCultivationContactChange,
  maintenanceCropValue = "",
  onMaintenanceCropChange,
  maintenanceReturnsValue = "",
  onMaintenanceReturnsChange,
  advantagesValue = "",
  onAdvantagesChange,
  disadvantagesValue = "",
  onDisadvantagesChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSoilDropdownOpen, setIsSoilDropdownOpen] = useState(false);
  const [isCropDropdownOpen, setIsCropDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTabLabel]);
  
  const { data: masterDataObj } = useGetAllMasterDataQuery();
  const soilTypeOptions = masterDataObj?.soilTypeResult?.map((s: any) => s.description) || [];
  const cropTypeOptions = masterDataObj?.cropsResult?.map((c: any) => c.description) || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsSoilDropdownOpen(false);
        setIsCropDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasComments = activeTabLabel !== "Future Crops";

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
        <div className="flex flex-col gap-6" ref={dropdownRef}>
          {activeTabLabel === "Maintenance" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                  If Green Land Captial does the maintenace, what will be the suggested crop?
                </h3>
                <div className="relative w-full">
                  <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full min-h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] flex items-center justify-between px-4 cursor-pointer outline-none">
                    {maintenanceCropValue ? (
                      <div className="flex flex-wrap gap-2 py-2">
                        {maintenanceCropValue.split(",").map((s) => s.trim()).filter(Boolean).map((crop) => (
                          <div key={crop} className="flex items-center gap-2 bg-white border border-[#E5E385] rounded px-2 py-1">
                            <div className="w-3 h-3 bg-[#2D3409] rounded-sm flex items-center justify-center">
                              <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4" className="w-2 h-2">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <span className="font-sans text-[12px] text-gray-700">{crop}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="font-sans text-[14px] text-gray-400 py-3">Select Types</span>
                    )}
                    <svg className="w-3 h-3 text-gray-500 flex-shrink-0" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-[100%] left-0 right-0 bg-white border border-gray-300 rounded-[8px] shadow-lg z-[1010] mt-1 p-4 max-h-[300px] flex flex-col gap-4">
                      <div className="w-full h-[40px] border border-gray-300 rounded-full flex items-center px-4 shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 0, 0, 0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} maxLength={50} className="w-full h-full border-none outline-none bg-transparent font-sans text-[14px] text-black" />
                      </div>

                      <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-2">
                        {cropTypeOptions
                          .filter((c: any) => c.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((crop: any, idx: number) => {
                            const selectedList = maintenanceCropValue ? maintenanceCropValue.split(",").map((s) => s.trim()).filter(Boolean) : [];
                            const isChecked = selectedList.includes(crop);
                            return (
                              <div key={idx} onClick={() => { let newList; if (isChecked) { newList = selectedList.filter((item) => item !== crop); } else { newList = [...selectedList, crop]; } if (onMaintenanceCropChange) { onMaintenanceCropChange(newList.join(", ")); } }} className="flex items-center gap-2 cursor-pointer">
                                <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${isChecked ? "bg-[#2D3409] border border-transparent" : "bg-white border border-[#E5E385]"}`}>
                                  {isChecked && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4" className="w-2.5 h-2.5">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </div>
                                <span className="font-sans text-[14px] text-gray-700 truncate">{crop}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">What will be the best returns?</h3>
                <input type="text" placeholder="Enter Amount" value={maintenanceReturnsValue} onChange={(e) => onMaintenanceReturnsChange?.(e.target.value.replace(/[^0-9.]/g, ''))} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />
              </div>
            </div>
          ) : activeTabLabel === "Future Crops" ? (
            <div className="flex flex-col gap-6">
              <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                Future crop plans suggested by <span className="text-[#3A8EE6]">Green Land Captial</span>
              </h3>
              <div className="w-full h-[250px] relative">
                <Comments
                  commentValue={commentValue}
                  onCommentChange={onCommentChange}
                  activeTabLabel={activeTabLabel}
                />
              </div>
            </div>
          ) : activeTabLabel === "Current Cultivation" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">What is the Current Cultivation Type?</h3>
                <div className="flex flex-row gap-4">
                  <button type="button" onClick={() => onCultivationTypeChange?.("Self")} className={`flex items-center gap-2 px-6 py-2 border rounded-full cursor-pointer transition-all ${cultivationTypeValue === "Self" ? "border-black bg-black text-white" : "border-gray-300 bg-white text-black"}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${cultivationTypeValue === "Self" ? "border-white" : "border-[#3A8EE6]"}`}>
                      {cultivationTypeValue === "Self" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="font-sans font-medium text-[14px]">Self</span>
                  </button>

                  <button type="button" onClick={() => onCultivationTypeChange?.("Lease")} className={`flex items-center gap-2 px-6 py-2 border rounded-full cursor-pointer transition-all ${cultivationTypeValue === "Lease" ? "border-black bg-black text-white" : "border-gray-300 bg-white text-black"}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${cultivationTypeValue === "Lease" ? "border-white" : "border-[#3A8EE6]"}`}>
                      {cultivationTypeValue === "Lease" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="font-sans font-medium text-[14px]">Lease</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">Name</h3>
                <input type="text" placeholder="Enter Name" value={cultivationNameValue} onChange={(e) => onCultivationNameChange?.(e.target.value)} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">Contact Details</h3>
                <input type="tel" placeholder="Enter Contact Details" value={cultivationContactValue} onChange={(e) => onCultivationContactChange?.(e.target.value.replace(/[^0-9]/g, ''))} maxLength={10} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />
              </div>
            </div>
          ) : activeTabLabel === "Current Yield Cost" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">What is the current yielding cost?</h3>
                <input type="text" placeholder="10,000.00" value={yieldCostValue} onChange={(e) => onYieldCostChange?.(e.target.value.replace(/[^0-9.]/g, ''))} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">Current returns from yield?</h3>
                <input type="text" placeholder="10,000.00" value={yieldReturnsValue} onChange={(e) => onYieldReturnsChange?.(e.target.value.replace(/[^0-9.]/g, ''))} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />
              </div>
            </div>
          ) : activeTabLabel === "Natural Advantages and Disadvantages" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">What are the Advantages?</h3>
                <input type="text" placeholder="Better soil" value={advantagesValue} onChange={(e) => onAdvantagesChange?.(e.target.value)} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">What are the Disadvantages?</h3>
                <input type="text" placeholder="Road side land" value={disadvantagesValue} onChange={(e) => onDisadvantagesChange?.(e.target.value)} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {activeTabLabel === "Soil" ? (
                <div className="flex flex-col gap-3">
                  <h3 className="text-black font-semibold font-sans text-[16px] m-0">Soil Type</h3>
                  <div className="relative w-full">
                    <button type="button" onClick={() => setIsSoilDropdownOpen(!isSoilDropdownOpen)} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] flex items-center justify-between px-4 outline-none cursor-pointer">
                      <span className={`font-sans text-[14px] ${selectedSoilType ? "text-black" : "text-gray-400"}`}>
                        {selectedSoilType || "Select soil type..."}
                      </span>
                      <svg className="w-3 h-3 text-gray-500" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {isSoilDropdownOpen && (
                      <div className="absolute top-[100%] left-0 right-0 bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] shadow-lg z-[1010] mt-1 max-h-[250px] overflow-y-auto">
                        {soilTypeOptions.length > 0 ? soilTypeOptions.map((opt: any) => (
                          <div key={opt} onClick={() => { onSoilTypeChange?.(opt); setIsSoilDropdownOpen(false); }} className={`px-4 py-3 font-sans text-[14px] cursor-pointer hover:bg-gray-50 ${selectedSoilType === opt ? "bg-[#E5F1F9]" : ""}`}>
                            {opt}
                          </div>
                        )) : (
                          <div className="px-4 py-3 font-sans text-[14px] text-gray-500">Loading...</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTabLabel === "Type Of Crop" ? (
                <div className="flex flex-col gap-3">
                  <h3 className="text-black font-semibold font-sans text-[16px] m-0">Types of Crops available present?</h3>
                  <div className="relative w-full">
                    <button type="button" onClick={() => setIsCropDropdownOpen(!isCropDropdownOpen)} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] flex items-center justify-between px-4 outline-none cursor-pointer">
                      <span className={`font-sans text-[14px] ${selectedCropType ? "text-black" : "text-gray-400"}`}>
                        {selectedCropType || "Select crop type..."}
                      </span>
                      <svg className="w-3 h-3 text-gray-500" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {isCropDropdownOpen && (
                      <div className="absolute top-[100%] left-0 right-0 bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] shadow-lg z-[1010] mt-1 max-h-[250px] overflow-y-auto">
                        {cropTypeOptions.length > 0 ? cropTypeOptions.map((opt: any) => (
                          <div key={opt} onClick={() => { onCropTypeChange?.(opt); setIsCropDropdownOpen(false); }} className={`px-4 py-3 font-sans text-[14px] cursor-pointer hover:bg-gray-50 ${selectedCropType === opt ? "bg-[#E5F1F9]" : ""}`}>
                            {opt}
                          </div>
                        )) : (
                          <div className="px-4 py-3 font-sans text-[14px] text-gray-500">Loading...</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTabLabel === "Types of Crop can be grown" ? (
                <div className="flex flex-col gap-3">
                  <h3 className="text-black font-semibold font-sans text-[16px] m-0">Types of Crop can be Grown in Future</h3>
                  <div className="relative w-full">
                    <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full min-h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] flex items-center justify-between px-4 cursor-pointer outline-none">
                      {selectedFutureCrops ? (
                        <div className="flex flex-wrap gap-2 py-2">
                          {selectedFutureCrops.split(",").map((s) => s.trim()).filter(Boolean).map((crop) => (
                            <div key={crop} className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-[#3A8EE6] rounded-sm flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4" className="w-2.5 h-2.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                              <span className="font-sans text-[14px] text-[#3A8EE6] font-semibold">{crop}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="font-sans text-[14px] text-gray-400 py-3">Select types</span>
                      )}
                      <svg className="w-3 h-3 text-gray-500 flex-shrink-0" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute top-[100%] left-0 right-0 bg-white border border-gray-300 rounded-[8px] shadow-lg z-[1010] mt-1 p-4 max-h-[300px] flex flex-col gap-4">
                        <div className="w-full h-[40px] border border-gray-300 rounded-full flex items-center px-4 shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 0, 0, 0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} maxLength={50} className="w-full h-full border-none outline-none bg-transparent font-sans text-[14px] text-black" />
                        </div>

                        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-2">
                          {cropTypeOptions
                            .filter((c: any) => c.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((crop: any, idx: number) => {
                              const selectedList = selectedFutureCrops ? selectedFutureCrops.split(",").map((s) => s.trim()).filter(Boolean) : [];
                              const isChecked = selectedList.includes(crop);
                              return (
                                <div key={idx} onClick={() => { let newList; if (isChecked) { newList = selectedList.filter((item) => item !== crop); } else { newList = [...new Set([...selectedList, crop])]; } if (onFutureCropsChange) { onFutureCropsChange(newList.join(", ")); } }} className="flex items-center gap-2 cursor-pointer">
                                  <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${isChecked ? "bg-[#3A8EE6] border border-transparent" : "bg-white border border-[#3A8EE6]"}`}>
                                    {isChecked && (
                                      <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4" className="w-2.5 h-2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="font-sans text-[14px] text-[#3A8EE6] font-medium truncate">{crop}</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTabLabel === "Ground Water Level" ? (
                <div className="flex flex-col gap-3">
                  <h3 className="text-black font-semibold font-sans text-[16px] m-0">Depth of Ground Water Level</h3>
                  <input type="text" placeholder="Enter depth" value={waterLevelValue} onChange={(e) => onWaterLevelChange?.(e.target.value.replace(/[^0-9.]/g, ''))} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />
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
          )}
        </div>

        {/* ── Comments Area ── */}
        {hasComments && (
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
