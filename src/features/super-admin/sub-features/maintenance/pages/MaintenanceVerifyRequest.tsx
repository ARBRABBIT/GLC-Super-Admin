import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Check,
  Tractor,
  Droplet,
  Sprout,
  Grid3X3,
  X,
  ArrowRight,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { MaintenanceNavbar } from "../components/MaintenanceNavbar";
import { AssignmentSuccessModal } from "../components/AssignmentSuccessModal";
import { AVAILABLE_FIELD_OFFICERS, INITIAL_SERVICE_REQUESTS } from "../data/maintenanceData";
import type { ServiceRequestPipelineItem } from "../types/maintenance.types";
import { useNavigate, useParams } from "react-router-dom";

interface MaintenanceVerifyRequestProps {
  requestItem?: ServiceRequestPipelineItem;
  onBack?: () => void;
}

export default function MaintenanceVerifyRequest({
  requestItem: propItem,
  onBack,
}: MaintenanceVerifyRequestProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const currentItem =
    propItem ||
    INITIAL_SERVICE_REQUESTS.find((r) => r.id === id || r.code === id) ||
    INITIAL_SERVICE_REQUESTS[0];

  const [selectedOfficer, setSelectedOfficer] = useState<string>("");
  const [officerSearch, setOfficerSearch] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [isManagerRequested, setIsManagerRequested] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOfficers = AVAILABLE_FIELD_OFFICERS.filter((fo) => {
    const query = officerSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      fo.name.toLowerCase().includes(query) ||
      (fo.location && fo.location.toLowerCase().includes(query)) ||
      fo.role.toLowerCase().includes(query)
    );
  });

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/maintenance/service-requests");
    }
  };

  const handleAssign = () => {
    setSuccessModalOpen(true);
  };

  const renderServiceIcon = (icon: string) => {
    switch (icon) {
      case "farmhouse":
        return <Tractor className="w-4 h-4 text-[#388E3C] stroke-[2.2]" />;
      case "borewell":
        return <Droplet className="w-4 h-4 text-[#388E3C] stroke-[2.2]" />;
      case "organic":
        return <Sprout className="w-4 h-4 text-[#388E3C] stroke-[2.2]" />;
      case "fencing":
      default:
        return <Grid3X3 className="w-4 h-4 text-[#388E3C] stroke-[2.2]" />;
    }
  };

  const primaryServiceName =
    currentItem.servicesList && currentItem.servicesList.length > 0
      ? currentItem.servicesList[0].name
      : currentItem.serviceCategory === "Borewell"
      ? "Farmhouse Construction"
      : `${currentItem.serviceCategory} Construction`;

  const serviceHeading =
    currentItem.serviceCategory === "Borewell"
      ? "Farmhouse Construction"
      : `${currentItem.serviceCategory} Construction`;

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-['Plus_Jakarta_Sans']">
      <MaintenanceNavbar activeTab="service-requests" />

      <main className="flex-1 w-full px-6 sm:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 flex flex-col">
        {/* ── Page Header / Title ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3.5 mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="w-8 h-8 rounded-full bg-transparent hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors border-none p-0 text-[#1F2937]"
            title="Back to Service Requests"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] sm:text-[27px] text-[#111827] m-0 font-normal tracking-tight">
            Active Service Request: <span className="font-normal text-[#111827]">{currentItem.customerName}</span> –{" "}
            <span className="font-normal text-[#111827]">{serviceHeading}</span>
          </h1>
        </div>

        {/* ── 2-Column Grid (Full Screen Width) ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Property & Request Details Card ───────────────────── */}
          <div className="lg:col-span-6 bg-[#F8F9FA] rounded-[24px] border border-[#ECEFF2] p-7 sm:p-9 shadow-2xs flex flex-col divide-y divide-[#E9ECEF]">
            {/* 1. Land ID */}
            <div className="grid grid-cols-12 gap-4 items-center pb-4.5">
              <span className="col-span-4 text-[13.5px] font-medium text-[#64748B]">
                Land ID
              </span>
              <span className="col-span-8 text-[14px] font-bold text-[#111827] tracking-wide">
                {currentItem.landId}
              </span>
            </div>

            {/* 2. Customer Name */}
            <div className="grid grid-cols-12 gap-4 items-center py-4.5">
              <span className="col-span-4 text-[13.5px] font-medium text-[#64748B]">
                Customer Name
              </span>
              <span className="col-span-8 text-[14px] font-bold text-[#111827]">
                {currentItem.customerName}
              </span>
            </div>

            {/* 3. Land Size */}
            <div className="grid grid-cols-12 gap-4 items-center py-4.5">
              <span className="col-span-4 text-[13.5px] font-medium text-[#64748B]">
                Land Size
              </span>
              <span className="col-span-8 text-[14px] font-bold text-[#111827]">
                {currentItem.landSize}
              </span>
            </div>

            {/* 4. Address */}
            <div className="grid grid-cols-12 gap-4 items-start py-4.5">
              <span className="col-span-4 text-[13.5px] font-medium text-[#64748B] pt-0.5">
                Address
              </span>
              <span className="col-span-8 text-[13.5px] font-normal text-[#1F2937] leading-relaxed">
                {currentItem.address}
              </span>
            </div>

            {/* 5. Preferred Visit Date */}
            <div className="grid grid-cols-12 gap-4 items-center py-4.5">
              <span className="col-span-4 text-[13.5px] font-medium text-[#64748B]">
                Preferred Visit Date
              </span>
              <span className="col-span-8 text-[13.5px] font-normal text-[#1F2937]">
                {currentItem.preferredVisitDate}
              </span>
            </div>

            {/* 6. Services */}
            <div className="grid grid-cols-12 gap-4 items-start py-4.5">
              <span className="col-span-4 text-[13.5px] font-medium text-[#64748B] pt-0.5">
                Services
              </span>
              <div className="col-span-8 flex flex-col gap-2.5">
                {currentItem.servicesList.map((svc, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-2.5">
                      {renderServiceIcon(svc.icon)}
                      <span className="text-[13.5px] font-normal text-[#111827]">
                        {svc.name}
                      </span>
                    </div>
                    {svc.subtitle && (
                      <span className="text-[11.5px] font-normal text-[#64748B] ml-6.5 mt-0.5">
                        {svc.subtitle}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Requirements */}
            <div className="grid grid-cols-12 gap-4 items-start pt-4.5">
              <span className="col-span-4 text-[13.5px] font-medium text-[#64748B] pt-0.5">
                Requirements
              </span>
              <div className="col-span-8">
                <p className="text-[13.5px] font-normal italic text-[#374151] leading-relaxed m-0">
                  &ldquo;{currentItem.requirementsText}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* ── Right Column: Assign Field Officer Card ────────────────────────── */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-[24px] border border-[#EBEFF3] p-7 sm:p-9 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[360px]">
              {/* Card Header */}
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] sm:text-[17px] text-[#111827] m-0">
                  Assign Field Officer
                </h2>
                <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#64748B] font-normal m-0 mt-1">
                  Assign specialized ground officer for verification.
                </p>

                {/* Search / Select Field Officer Input */}
                <div className="relative mt-6" ref={dropdownRef}>
                  <div
                    onClick={() => setDropdownOpen(true)}
                    className={`w-full h-[48px] rounded-xl px-4 flex items-center justify-between cursor-pointer border bg-white transition-all ${
                      dropdownOpen
                        ? "border-[#1E75BB] ring-2 ring-[#1E75BB]/10"
                        : "border-dashed border-[#CBD5E1] hover:border-[#1E75BB]/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
                      <input
                        type="text"
                        placeholder={`Search Field Officer for ${primaryServiceName}...`}
                        value={dropdownOpen ? officerSearch : selectedOfficer || officerSearch}
                        onChange={(e) => {
                          setOfficerSearch(e.target.value);
                          if (!dropdownOpen) setDropdownOpen(true);
                        }}
                        onFocus={() => setDropdownOpen(true)}
                        className="w-full bg-transparent border-none text-[13.5px] text-[#111827] outline-hidden placeholder:text-[#94A3B8] placeholder:font-normal"
                      />
                    </div>
                    {(selectedOfficer || officerSearch) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOfficer("");
                          setOfficerSearch("");
                        }}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown Options */}
                  {dropdownOpen && (
                    <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-30 animate-in fade-in zoom-in-95">
                      <div className="max-h-72 overflow-y-auto flex flex-col gap-1">
                        {filteredOfficers.length === 0 ? (
                          <div className="p-4 sm:p-5 flex flex-col items-center text-center gap-4">
                            <span className="text-xs text-[#64748B] font-medium">
                              No field officers for this region
                            </span>

                            <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 flex items-center justify-center shrink-0 shadow-2xs">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-[13px] text-[#111827]">
                                    Inform Role Manager
                                  </span>
                                  <span className="text-[11px] text-[#64748B] mt-0.5 leading-tight">
                                    Send a notification to role manager to create field officer for this region
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setIsManagerRequested(true);
                                  toast.success("Notification sent to Role Manager successfully!");
                                }}
                                className={`shrink-0 flex items-center gap-1.5 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all border-none cursor-pointer ${
                                  isManagerRequested
                                    ? "bg-[#DCFCE7] text-[#15803D]"
                                    : "bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B]"
                                }`}
                              >
                                {isManagerRequested ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Requested</span>
                                  </>
                                ) : (
                                  <>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                    <span>Request Role Manager</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          filteredOfficers.map((fo) => (
                            <div
                              key={fo.id}
                              onClick={() => {
                                setSelectedOfficer(fo.name);
                                setOfficerSearch(fo.name);
                                setDropdownOpen(false);
                              }}
                              className={`flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors ${
                                selectedOfficer === fo.name
                                  ? "bg-blue-50/70 text-[#1E75BB]"
                                  : "text-gray-800"
                              }`}
                            >
                              <div className="flex flex-col">
                                <span className="font-bold text-[13.5px] text-[#111827]">
                                  {fo.name}
                                </span>
                                <span className="text-[12px] text-[#64748B] mt-0.5">
                                  {fo.role} &bull; {fo.location || "Hyderabad"}
                                </span>
                              </div>
                              {selectedOfficer === fo.name && (
                                <Check className="w-4 h-4 text-[#1E75BB] stroke-[2.5]" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button matching Figma */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleAssign}
                  className={`w-full h-[48px] rounded-xl font-['Plus_Jakarta_Sans'] font-semibold text-[14px] flex items-center justify-center border-none cursor-pointer transition-all ${
                    selectedOfficer
                      ? "bg-[#1E75BB] hover:bg-[#1864A0] text-white shadow-xs hover:shadow-md"
                      : "bg-[#DCE4EC] hover:bg-[#D5DFE8] text-[#7A8C9E]"
                  }`}
                >
                  Assign All Officers to Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Assignment Logged Success Modal ────────────────────────────────── */}
      <AssignmentSuccessModal
        isOpen={successModalOpen}
        officerName={selectedOfficer || "Not assigned"}
        address={currentItem.address}
        preferredVisitDate={currentItem.preferredVisitDate}
        servicesList={currentItem.servicesList}
        onClose={() => setSuccessModalOpen(false)}
        onReturn={() => {
          setSuccessModalOpen(false);
          handleBack();
        }}
      />
    </div>
  );
}
