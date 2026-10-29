import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import SuperAdminFarmlandCard from "@/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard";
import { useGetAllFarmlandsQuery } from "@/features/super-admin/api/farmland.api";
import { useGetAllMasterDataQuery } from "@/features/super-admin/api/masterData.api";


// ── Custom Dropdown Component ──
const CustomSelect: React.FC<{
  value: { id: number | null; label: string } | null;
  onChange: (val: { id: number | null; label: string } | null) => void;
  options: { id: number | null; label: string }[];
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative h-10 w-[180px] bg-white border border-gray-200 rounded-full flex items-center">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer w-full h-full flex items-center justify-between px-4"
      >
        <span className={`font-['Inter'] font-medium text-sm ${value ? 'text-gray-700' : 'text-gray-400'}`}>
          {value ? value.label : placeholder}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full max-h-[240px] overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2 custom-scrollbar">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-400 font-['Inter'] italic">No options</div>
          ) : (
            options.map((opt) => (
              <div
                key={opt.id ?? 'all'}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer text-sm transition-colors flex items-center gap-2 ${value?.id === opt.id
                  ? "bg-[#F4F9FF] text-[#3B82F6] font-medium"
                  : "text-gray-700 hover:bg-gray-50 hover:text-[#3B82F6]"
                  }`}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const SuperAdminFarmlandsListPreview: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 8;

  const [selectedStatus, setSelectedStatus] = useState<{ id: number | null; label: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: masterData } = useGetAllMasterDataQuery();

  const statusOptions = masterData?.milestoneStageStatusResult
    ?.filter((s: any) => s.code === "APPRVD" || s.code === "REVRTD")
    .map((s: any) => ({
      id: s.id,
      label: s.description || s.code,
    })) || [];

  useEffect(() => {
    if (masterData && !selectedStatus) {
      const approvedOption = statusOptions.find(opt => opt.label === "Approved" || opt.label.includes("Approv"));
      if (approvedOption) {
        setSelectedStatus(approvedOption);
      } else if (statusOptions.length > 0) {
        setSelectedStatus(statusOptions[0]);
      }
    }
  }, [masterData, statusOptions, selectedStatus]);

  const { data: farmlandsData, isLoading, error } = useGetAllFarmlandsQuery({
    country_id: 1,
    offset: 0,
    limit: 200,
    status_id: selectedStatus?.id !== null ? selectedStatus?.id : undefined,
  }, { skip: !selectedStatus });

  const allCards = farmlandsData?.data || [];
  const filteredCards = allCards.filter((f: any) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const farmCode = (f.farm_code || "").toLowerCase();
    const agentFirstName = (f.agent?.first_name || "").toLowerCase();
    const agentLastName = (f.agent?.last_name || "").toLowerCase();
    const agentFullName = `${agentFirstName} ${agentLastName}`.trim();
    const status = (f.status || "").toLowerCase();
    const village = (f.village_name || "").toLowerCase();

    return (
      farmCode.includes(term) ||
      agentFullName.includes(term) ||
      agentFirstName.includes(term) ||
      agentLastName.includes(term) ||
      status.includes(term) ||
      village.includes(term)
    );
  });

  const totalCount = filteredCards.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const cardsData = filteredCards.slice((page - 1) * limit, page * limit);

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      <div className="bg-[#F6F7F6] rounded-[24px] p-6 flex flex-col gap-8 min-h-screen">

        {/* Go Back Button */}
        {/* <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        </div> */}

        {/* Header */}
        <div className="flex flex-col">
          <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] tracking-tight">
            Farmlands List
          </h2>
          <p className="text-[0.875rem] text-[var(--text-muted)] font-medium">
            All farmlands in the system
          </p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="w-full sm:w-[220px]">
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search By Farm Code or Agent"
              icon={<Search size={16} className="text-gray-400" />}
              className="rounded-full bg-white border-gray-200 text-xs sm:text-sm"
              wrapperClassName="h-9 sm:h-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <CustomSelect
                value={selectedStatus}
                onChange={(val) => {
                  if (val) {
                    setSelectedStatus(val);
                    setPage(1); // reset pagination when filter changes
                  }
                }}
                options={statusOptions}
                placeholder="Status"
              />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="w-full min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] text-[#2D3032]">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-[var(--text-primary)] font-medium">Loading farmlands...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px]">
              <p className="text-red-500 font-medium text-center">Failed to load farmlands. Please try again later.</p>
            </div>
          ) : cardsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px]">
              <p className="text-[#2D3032] font-medium text-lg">
                {searchTerm.trim() ? "No matching farmlands found" : "No farmlands available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cardsData.map((farmland, idx) => (
                <SuperAdminFarmlandCard
                  key={farmland.id}
                  data={farmland}
                  imagePosition={idx % 2 === 0 ? "top" : "bottom"}
                  onViewDetails={(id) => navigate(`/super-admin/assigned-farmlands/${id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredCards.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)]"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminFarmlandsListPreview;
