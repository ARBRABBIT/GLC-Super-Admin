import React, { useState, useEffect } from "react";
import { X, Check, LayoutGrid, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceRequestFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServices: string[];
  selectedDateRange: { start: string; end: string } | null;
  onApply: (services: string[], dateRange: { start: string; end: string } | null) => void;
  onClear: () => void;
}

const ALL_SERVICES = [
  "Organic Management",
  "Fencing",
  "Bore Well",
  "Farmhouse",
  "Solar Setup",
  "Land Demarcation"
];

const formatDateToISO = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDateToDisplay = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

export const ServiceRequestFilterModal: React.FC<ServiceRequestFilterModalProps> = ({
  isOpen,
  onClose,
  selectedServices: initialServices,
  selectedDateRange: initialDateRange,
  onApply,
  onClear
}) => {
  const [activeTab, setActiveTab] = useState<"services" | "date">("services");
  const [tempServices, setTempServices] = useState<string[]>(initialServices);
  const [tempQuickSelect, setTempQuickSelect] = useState<string>("");
  const [selectedRangeSpan, setSelectedRangeSpan] = useState<string>("");
  const [tempDateRange, setTempDateRange] = useState<{ start: string; end: string } | null>(initialDateRange);
  const [currentViewDate, setCurrentViewDate] = useState<Date>(() => new Date());

  useEffect(() => {
    if (isOpen) {
      setTempServices(initialServices);
      setTempDateRange(initialDateRange);
      if (initialDateRange && initialDateRange.start && initialDateRange.end) {
        setSelectedRangeSpan(`${initialDateRange.start} – ${initialDateRange.end}`);
      } else {
        setTempQuickSelect("");
        setSelectedRangeSpan("");
      }
      setCurrentViewDate(new Date());
    }
  }, [isOpen, initialServices, initialDateRange]);

  if (!isOpen) return null;

  const handleToggleService = (service: string) => {
    if (tempServices.includes(service)) {
      setTempServices(tempServices.filter((s) => s !== service));
    } else {
      setTempServices([...tempServices, service]);
    }
  };

  const handleSelectAll = () => {
    if (tempServices.length === ALL_SERVICES.length) {
      setTempServices([]);
    } else {
      setTempServices([...ALL_SERVICES]);
    }
  };

  const handleQuickSelect = (type: "Today" | "Last 7 Days" | "This Month") => {
    setTempQuickSelect(type);
    const now = new Date();
    if (type === "Today") {
      const iso = formatDateToISO(now);
      setTempDateRange({ start: iso, end: iso });
      setSelectedRangeSpan(formatDateToDisplay(now));
    } else if (type === "Last 7 Days") {
      const past7 = new Date();
      past7.setDate(now.getDate() - 6);
      setTempDateRange({ start: formatDateToISO(past7), end: formatDateToISO(now) });
      setSelectedRangeSpan(`${formatDateToDisplay(past7)} – ${formatDateToDisplay(now)}`);
    } else if (type === "This Month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setTempDateRange({ start: formatDateToISO(firstDay), end: formatDateToISO(lastDay) });
      setSelectedRangeSpan(`${formatDateToDisplay(firstDay)} – ${formatDateToDisplay(lastDay)}`);
    }
  };

  const handleDateClick = (day: number) => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const clickedDate = new Date(year, month, day);
    const iso = formatDateToISO(clickedDate);
    const display = formatDateToDisplay(clickedDate);

    if (!tempDateRange || (tempDateRange.start && tempDateRange.end && tempDateRange.start !== tempDateRange.end)) {
      setTempDateRange({ start: iso, end: iso });
      setSelectedRangeSpan(display);
      setTempQuickSelect("");
    } else {
      const startD = new Date(tempDateRange.start);
      if (clickedDate < startD) {
        setTempDateRange({ start: iso, end: tempDateRange.start });
        setSelectedRangeSpan(`${display} – ${formatDateToDisplay(startD)}`);
      } else {
        setTempDateRange({ start: tempDateRange.start, end: iso });
        setSelectedRangeSpan(`${formatDateToDisplay(startD)} – ${display}`);
      }
      setTempQuickSelect("");
    }
  };

  const handlePrevMonth = () => {
    setCurrentViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleApply = () => {
    onApply(tempServices, tempDateRange);
    onClose();
  };

  const handleReset = () => {
    setTempServices([]);
    setTempQuickSelect("");
    setTempDateRange(null);
    setSelectedRangeSpan("");
    onClear();
    onClose();
  };

  // Calendar calculations for current view month
  const viewYear = currentViewDate.getFullYear();
  const viewMonth = currentViewDate.getMonth();
  const monthName = currentViewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const mondayOffset = (firstDayIndex + 6) % 7;

  const prevMonthTotalDays = new Date(viewYear, viewMonth, 0).getDate();
  const emptyPreDays = Array.from(
    { length: mondayOffset },
    (_, i) => prevMonthTotalDays - mondayOffset + 1 + i
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-[24px] max-w-2xl w-full shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* ── Modal Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[18px] text-[#1E75BB] m-0">
            {activeTab === "services" ? "Select Your Service" : "Select Date Range"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center border-none bg-transparent cursor-pointer text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Modal Content: 2-Column Sidebar + Panel ─────────────────────── */}
        <div className="flex flex-col sm:flex-row min-h-[360px]">
          {/* Left Sidebar Navigation */}
          <div className="w-full sm:w-48 bg-[#F8FAFC] border-r border-gray-100 p-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("services")}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-xs font-bold transition-all border-none cursor-pointer ${
                activeTab === "services"
                  ? "bg-[#1E75BB] text-white shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-gray-200/60"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Services
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("date")}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-xs font-bold transition-all border-none cursor-pointer ${
                activeTab === "date"
                  ? "bg-[#1E75BB] text-white shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-gray-200/60"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Date Range
            </button>

            {/* Quick Selects for Date Tab */}
            {activeTab === "date" && (
              <div className="mt-4 pt-4 border-t border-gray-200/60 flex flex-col gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-2 mb-1">
                  Quick Selects
                </span>
                {(["Today", "Last 7 Days", "This Month"] as const).map((qs) => (
                  <button
                    key={qs}
                    type="button"
                    onClick={() => handleQuickSelect(qs)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border-none ${
                      tempQuickSelect === qs
                        ? "bg-blue-50 text-[#1E75BB] font-bold"
                        : "bg-transparent text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {qs}
                  </button>
                ))}

                {selectedRangeSpan && (
                  <div className="mt-3 px-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                      Selected Span
                    </span>
                    <span className="text-xs font-bold text-[#1E75BB] mt-0.5 block">
                      {selectedRangeSpan}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Content Panel */}
          <div className="flex-1 p-6 flex flex-col justify-center">
            {activeTab === "services" ? (
              <div className="flex flex-col gap-3">
                {/* Select All */}
                <div
                  onClick={handleSelectAll}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-gray-800">
                    Select All
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      tempServices.length === ALL_SERVICES.length
                        ? "bg-[#1E75BB] border-[#1E75BB] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {tempServices.length === ALL_SERVICES.length && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Individual Services */}
                {ALL_SERVICES.map((svc) => {
                  const isChecked = tempServices.includes(svc);
                  return (
                    <div
                      key={svc}
                      onClick={() => handleToggleService(svc)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isChecked
                          ? "border-[#1E75BB]/30 bg-blue-50/40"
                          : "border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-gray-800">
                        {svc}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-[#1E75BB] border-[#1E75BB] text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Calendar Date Picker View */
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-gray-900 m-0">
                    {monthName}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 border-none bg-transparent cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 border-none bg-transparent cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-gray-400 mb-2">
                  <span>MO</span>
                  <span>TU</span>
                  <span>WE</span>
                  <span>TH</span>
                  <span>FR</span>
                  <span>SA</span>
                  <span>SU</span>
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center font-['Plus_Jakarta_Sans'] text-xs font-semibold">
                  {emptyPreDays.map((d) => (
                    <div key={`pre-${d}`} className="h-8 flex items-center justify-center text-gray-300">
                      {d}
                    </div>
                  ))}
                  {daysArray.map((day) => {
                    const thisDateISO = formatDateToISO(new Date(viewYear, viewMonth, day));
                    const isStart = tempDateRange?.start === thisDateISO;
                    const isEnd = tempDateRange?.end === thisDateISO;
                    const isInRange =
                      tempDateRange?.start &&
                      tempDateRange?.end &&
                      thisDateISO > tempDateRange.start &&
                      thisDateISO < tempDateRange.end;

                    return (
                      <div
                        key={day}
                        onClick={() => handleDateClick(day)}
                        className={`h-8 flex items-center justify-center cursor-pointer transition-colors ${
                          isStart || isEnd
                            ? "bg-[#1E75BB] text-white font-bold rounded-full"
                            : isInRange
                            ? "bg-blue-100/70 text-[#1E75BB] rounded-md"
                            : "text-gray-700 hover:bg-gray-100 rounded-full"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Modal Footer ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-[#FAFBFD]">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-[#1E75BB] hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            Clear Filters
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200/60 bg-transparent border-none cursor-pointer"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-full bg-[#1E75BB] hover:bg-[#1864A0] text-white text-xs font-bold shadow-sm transition-all border-none cursor-pointer"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
