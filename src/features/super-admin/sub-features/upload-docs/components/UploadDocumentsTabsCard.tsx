import React from "react";

interface TabItem {
  id: string;
  label: string;
}

interface UploadDocumentsTabsCardProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  isTabComplete: (tabId: string) => boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const UploadDocumentsTabsCard: React.FC<UploadDocumentsTabsCardProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  isTabComplete,
  className = "",
  style,
}) => {
  return (
    <div
      className={`bg-white rounded-3xl shadow-[0px_20px_40px_rgba(0,_49,_50,_0.06)] flex flex-col select-none shrink-0 overflow-hidden box-border h-full ${className}`}
      style={style}
    >
      {/* Heading (Fixed) */}
      <div className="px-6 py-6 border-b border-gray-100 shrink-0">
        <h3 className="font-sans font-bold text-base md:text-lg text-[#1A1C1D] leading-tight m-0">
          {/* Dynamic heading based on context */}
          Section List
        </h3>
        <p className="font-sans text-xs md:text-sm text-[#5A5C5E] mt-1 m-0">
          Select a report section to continue
        </p>
      </div>

      {/* Vertical Tab List (Scrollable) */}
      <div className="flex flex-col py-2 flex-1 overflow-y-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isUploaded = isTabComplete(tab.id);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabSelect(tab.id)}
              className={`flex items-center gap-3 px-6 py-3.5 cursor-pointer transition-all duration-200 select-none text-left ${isActive ? "bg-[#F4F7E6] border-r-[3px] border-[#BDD327]" : "hover:bg-gray-50 border-r-[3px] border-transparent"}`}
            >
              {/* Indicator Dot / Checkmark Badge */}
              {isUploaded ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-[#BDD327] shrink-0"
                >
                  <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-13 5l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              ) : (
                <div
                  className={`rounded-full shrink-0 flex items-center justify-center box-border w-5 h-5 ${isActive ? "bg-[#E6EEAD]" : "bg-[#E1E5EF]"}`}
                >
                  <div
                    className={`rounded-full w-[40%] h-[40%] ${isActive ? "bg-[#2D3409]" : "bg-[#C0C2B7]"}`}
                  />
                </div>
              )}

              {/* Tab Label */}
              <span
                className={`font-sans font-semibold leading-none text-sm ${isActive ? "text-[#2D3409]" : "text-[#5A5C5E]"}`}
              >
                {tab.label}
              </span>

              {/* Active Arrow */}
              {isActive && (
                <svg className="w-4 h-4 text-[#2D3409] ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UploadDocumentsTabsCard;
