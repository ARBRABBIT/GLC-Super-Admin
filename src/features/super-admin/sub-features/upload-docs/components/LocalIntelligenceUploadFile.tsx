import React, { useRef, useEffect } from "react";
import { UploadFile, type UploadedFileItem } from "./UploadFile";
import { Comments } from "./Comments";

interface LocalIntelligenceUploadFileProps {
  activeTabLabel: string;
  uploadedFiles: UploadedFileItem[];
  commentValue: string;
  onCommentChange: (val: string) => void;
  onFileUpload: (files: FileList, imageType?: "cover" | "land") => void;
  onFileDelete: (fileId: string) => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  anyIssuesTypeValue?: string;
  onAnyIssuesTypeChange?: (val: string) => void;
  localLiabilitiesTypeValue?: string;
  onLocalLiabilitiesTypeChange?: (val: string) => void;
  pendingLoansTypeValue?: string;
  onPendingLoansTypeChange?: (val: string) => void;
  pendingLoansAmountValue?: string;
  onPendingLoansAmountChange?: (val: string) => void;
  ownerMindsetValue?: string;
  onOwnerMindsetChange?: (val: string) => void;
  sourcePersonTypeValue?: string;
  onSourcePersonTypeChange?: (val: string) => void;
  sourcePersonNameValue?: string;
  onSourcePersonNameChange?: (val: string) => void;
  sourcePersonMobileValue?: string;
  onSourcePersonMobileChange?: (val: string) => void;
  agreementPaperValue?: string;
  onAgreementPaperChange?: (val: string) => void;
  agreementTypeValue?: string;
  onAgreementTypeChange?: (val: string) => void;
  agreementPriceValue?: string;
  onAgreementPriceChange?: (val: string) => void;
  prevTransactionsTypeValue?: string;
  onPrevTransactionsTypeChange?: (val: string) => void;
  prevTransactionsPriceValue?: string;
  onPrevTransactionsPriceChange?: (val: string) => void;
  ownerMindsetOptions?: any[];
  isFinishStep: boolean;
  isNextEnabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LocalIntelligenceUploadFile: React.FC<LocalIntelligenceUploadFileProps> = ({
  activeTabLabel,
  uploadedFiles,
  commentValue,
  onCommentChange,
  onFileUpload,
  onFileDelete,
  onPrevTab,
  onNextTab,
  isFinishStep,
  isNextEnabled = true,
  className = "",
  style,
  anyIssuesTypeValue = "",
  onAnyIssuesTypeChange,
  localLiabilitiesTypeValue = "",
  onLocalLiabilitiesTypeChange,
  pendingLoansTypeValue = "",
  onPendingLoansTypeChange,
  pendingLoansAmountValue = "",
  onPendingLoansAmountChange,
  ownerMindsetValue = "",
  onOwnerMindsetChange,
  sourcePersonTypeValue = "",
  onSourcePersonTypeChange,
  sourcePersonNameValue = "",
  onSourcePersonNameChange,
  sourcePersonMobileValue = "",
  onSourcePersonMobileChange,
  agreementPaperValue = "",
  onAgreementPaperChange,
  agreementTypeValue = "",
  onAgreementTypeChange,
  agreementPriceValue = "",
  onAgreementPriceChange,
  prevTransactionsTypeValue = "",
  onPrevTransactionsTypeChange,
  prevTransactionsPriceValue = "",
  onPrevTransactionsPriceChange,
  ownerMindsetOptions = [],
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
        <div className="flex flex-col gap-4">
          {activeTabLabel === "Any Issues" || activeTabLabel === "Local Liabilities" ? (
            <div className="flex flex-col gap-3">
              <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                {activeTabLabel === "Any Issues" ? "Any issues with Boundaries & Owners?" : "Any Local Liabilities?"}
              </h3>
              <div className="flex flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (activeTabLabel === "Any Issues") {
                      onAnyIssuesTypeChange?.("Available");
                    } else {
                      onLocalLiabilitiesTypeChange?.("Available");
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                    (activeTabLabel === "Any Issues" ? anyIssuesTypeValue : localLiabilitiesTypeValue) === "Available"
                      ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                      : "border-gray-300 bg-white text-black"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full border-2 ${
                      (activeTabLabel === "Any Issues" ? anyIssuesTypeValue : localLiabilitiesTypeValue) === "Available"
                        ? "border-white bg-[#BDD327]"
                        : "border-[#BDD327] bg-white"
                    }`}
                  />
                  <span className="font-semibold text-[14px]">Available</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeTabLabel === "Any Issues") {
                      onAnyIssuesTypeChange?.("Not Available");
                    } else {
                      onLocalLiabilitiesTypeChange?.("Not Available");
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                    (activeTabLabel === "Any Issues" ? anyIssuesTypeValue : localLiabilitiesTypeValue) === "Not Available"
                      ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                      : "border-gray-300 bg-white text-black"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full border-2 ${
                      (activeTabLabel === "Any Issues" ? anyIssuesTypeValue : localLiabilitiesTypeValue) === "Not Available"
                        ? "border-white bg-[#BDD327]"
                        : "border-[#BDD327] bg-white"
                    }`}
                  />
                  <span className="font-semibold text-[14px]">Not Available</span>
                </button>
              </div>
            </div>
          ) : activeTabLabel === "Any Pending Loans" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                  Any Bank Loans or Pending Loans on the Land
                </h3>
                <div className="flex flex-row items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onPendingLoansTypeChange?.("Available")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      pendingLoansTypeValue === "Available"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        pendingLoansTypeValue === "Available"
                          ? "border-white bg-[#BDD327]"
                          : "border-[#BDD327] bg-white"
                      }`}
                    />
                    <span className="font-semibold text-[14px]">Available</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onPendingLoansTypeChange?.("Not Available")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      pendingLoansTypeValue === "Not Available"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        pendingLoansTypeValue === "Not Available"
                          ? "border-white bg-[#BDD327]"
                          : "border-[#BDD327] bg-white"
                      }`}
                    />
                    <span className="font-semibold text-[14px]">Not Available</span>
                  </button>
                </div>
              </div>

              {pendingLoansTypeValue === "Available" && (
                <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                  <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                    Please Enter Loan Amount
                  </h3>
                  <input
                    type="text"
                    value={pendingLoansAmountValue}
                    onChange={(e) => onPendingLoansAmountChange?.(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="Enter loan amount"
                    maxLength={50}
                    className="w-full h-[48px] box-border border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]"
                  />
                </div>
              )}
            </div>
          ) : activeTabLabel === "Owner Mindset" ? (
            <div className="flex flex-col gap-3">
              <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                Owner Mindset
              </h3>
              <div className="relative w-full h-[48px]">
                <select
                  value={ownerMindsetValue}
                  onChange={(e) => onOwnerMindsetChange?.(e.target.value)}
                  className="appearance-none w-full h-full bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black cursor-pointer focus:outline-none focus:border-[#BDD327]"
                >
                  <option value="">Select</option>
                  {ownerMindsetOptions?.map((option: any) => (
                    <option key={option.id} value={option.id}>
                      {option.description}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L7 7L13 1" stroke="#363434" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          ) : activeTabLabel === "Source Person" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                  Source Person
                </h3>
                <div className="relative w-full h-[48px]">
                  <select
                    value={sourcePersonTypeValue}
                    onChange={(e) => onSourcePersonTypeChange?.(e.target.value)}
                    className="appearance-none w-full h-full bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black cursor-pointer focus:outline-none focus:border-[#BDD327]"
                  >
                    <option value="">Select</option>
                    <option value="Government Person">Government Person</option>
                    <option value="Broker">Broker</option>
                    <option value="Neighbor">Neighbor</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L7 7L13 1" stroke="#363434" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {sourcePersonTypeValue && sourcePersonTypeValue !== "" && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                  <h3 className="text-black font-semibold font-sans text-[16px] m-0 border-b pb-2">
                    Person Contact Details
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-[14px]">Name</span>
                      <input
                        type="text"
                        value={sourcePersonNameValue}
                        onChange={(e) => onSourcePersonNameChange?.(e.target.value)}
                        placeholder="Krishna"
                        maxLength={50}
                        className="w-full h-[48px] border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] focus:outline-none focus:border-[#BDD327]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-[14px]">Mobile</span>
                      <input
                        type="tel"
                        value={sourcePersonMobileValue}
                        onChange={(e) => onSourcePersonMobileChange?.(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="8857463923"
                        maxLength={10}
                        className="w-full h-[48px] border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] focus:outline-none focus:border-[#BDD327]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTabLabel === "Agreements" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                  Any Paper Agreement On This Land
                </h3>
                <div className="flex flex-row items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onAgreementPaperChange?.("Available")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      agreementPaperValue === "Available"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        agreementPaperValue === "Available"
                          ? "border-white bg-[#BDD327]"
                          : "border-[#BDD327] bg-white"
                      }`}
                    />
                    <span className="font-semibold text-[14px]">Available</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAgreementPaperChange?.("Not Available")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      agreementPaperValue === "Not Available"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        agreementPaperValue === "Not Available"
                          ? "border-white bg-[#BDD327]"
                          : "border-[#BDD327] bg-white"
                      }`}
                    />
                    <span className="font-semibold text-[14px]">Not Available</span>
                  </button>
                </div>
              </div>

              {agreementPaperValue === "Available" && (
                <>
                  <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                    <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                      Agreement Type
                    </h3>
                    <div className="flex flex-row items-center gap-4">
                      <button
                        type="button"
                        onClick={() => onAgreementTypeChange?.("Legal")}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                          agreementTypeValue === "Legal"
                            ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                            : "border-gray-300 bg-white text-black"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full border-2 ${
                            agreementTypeValue === "Legal"
                              ? "border-white bg-[#BDD327]"
                              : "border-[#BDD327] bg-white"
                          }`}
                        />
                        <span className="font-semibold text-[14px]">Legal</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onAgreementTypeChange?.("Verbal")}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                          agreementTypeValue === "Verbal"
                            ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                            : "border-gray-300 bg-white text-black"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full border-2 ${
                            agreementTypeValue === "Verbal"
                              ? "border-white bg-[#BDD327]"
                              : "border-[#BDD327] bg-white"
                          }`}
                        />
                        <span className="font-semibold text-[14px]">Verbal</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                    <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                      Last Price of the land when made agreement?
                    </h3>
                    <input
                      type="text"
                      value={agreementPriceValue}
                      onChange={(e) => onAgreementPriceChange?.(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="1,00,000.00"
                      maxLength={50}
                      className="w-full h-[48px] border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] focus:outline-none focus:border-[#BDD327]"
                    />
                  </div>
                </>
              )}
            </div>
          ) : activeTabLabel === "Previous Transactions" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                  Any Previous Transactions on the Land?
                </h3>
                <div className="flex flex-row items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onPrevTransactionsTypeChange?.("Available")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      prevTransactionsTypeValue === "Available"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        prevTransactionsTypeValue === "Available"
                          ? "border-white bg-[#BDD327]"
                          : "border-[#BDD327] bg-white"
                      }`}
                    />
                    <span className="font-semibold text-[14px]">Available</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onPrevTransactionsTypeChange?.("Not Available")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      prevTransactionsTypeValue === "Not Available"
                        ? "border-[#2B2D2F] bg-[#2B2D2F] text-white"
                        : "border-gray-300 bg-white text-black"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        prevTransactionsTypeValue === "Not Available"
                          ? "border-white bg-[#BDD327]"
                          : "border-[#BDD327] bg-white"
                      }`}
                    />
                    <span className="font-semibold text-[14px]">Not Available</span>
                  </button>
                </div>
              </div>

              {prevTransactionsTypeValue === "Available" && (
                <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                  <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                    Last Price of the land when made agreement?
                  </h3>
                  <div className="relative w-full h-[48px]">
                    <select
                      value={prevTransactionsPriceValue}
                      onChange={(e) => onPrevTransactionsPriceChange?.(e.target.value)}
                      className="appearance-none w-full h-full bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black cursor-pointer focus:outline-none focus:border-[#BDD327]"
                    >
                      <option value="">Select</option>
                      <option value="1,00,000.00">1,00,000.00</option>
                      <option value="2,50,000.00">2,50,000.00</option>
                      <option value="5,00,000.00">5,00,000.00</option>
                      <option value="10,00,000.00">10,00,000.00</option>
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
              <h3 className="text-black font-semibold font-sans text-[16px] m-0">
                Upload File
              </h3>
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
