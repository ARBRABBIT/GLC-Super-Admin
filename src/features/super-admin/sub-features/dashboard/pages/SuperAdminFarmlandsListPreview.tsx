import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { S3Image } from "@/components/common/S3Image";
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
  const limit = 10;

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

        {/* Farmlands Table */}
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
            <div className="w-full overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-xs">
              <table className="w-full min-w-[900px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#FAFAFA]/80">
                    <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                      Farmland
                    </th>
                    <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                      Area
                    </th>
                    <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                      Cost / Acre
                    </th>
                    <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                      Status
                    </th>
                    <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                      Assigned Agent
                    </th>
                    <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cardsData.map((farmland) => {
                    const costPerAcre =
                      farmland.valuation && farmland.total_acres && Number(farmland.total_acres) > 0
                        ? `₹${(Number(farmland.valuation) / Number(farmland.total_acres)).toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}`
                        : "N/A";
                    const totalValuation =
                      farmland.valuation && !isNaN(Number(farmland.valuation))
                        ? `₹${Number(farmland.valuation).toLocaleString("en-IN")}`
                        : null;
                    const agentFullName = `${farmland.agent?.first_name || ""} ${
                      farmland.agent?.last_name || ""
                    }`.trim();

                    return (
                      <tr
                        key={farmland.id}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70 transition-colors"
                      >
                        {/* Farmland Info: Thumbnail + Code + Badge + Village */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                              <S3Image
                                src={farmland.cover_image_url}
                                fallbackType="cover"
                                alt={farmland.farm_code}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[var(--text-primary)]">
                                  {farmland.farm_code}
                                </span>
                                {farmland.is_glc_exclusive === 1 && (
                                  <span className="px-2 py-0.5 bg-[#E6EEAD] text-[#2A3125] text-[10px] font-bold rounded-full border border-[#D5DF96]">
                                    GLC Exclusive
                                  </span>
                                )}
                              </div>
                              <span className="text-[12px] text-[var(--text-muted)]">
                                {farmland.village_name || "Assigned Farmland"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Area */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-sm text-[var(--text-primary)]">
                            {farmland.total_acres ? `${Number(farmland.total_acres).toFixed(2)} acres` : "N/A"}
                          </div>
                        </td>

                        {/* Cost per Acre + Valuation */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-sm text-[var(--text-primary)]">
                            {costPerAcre}
                          </div>
                          {totalValuation && (
                            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                              Total: {totalValuation}
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase",
                              farmland.status?.toLowerCase().includes("approv") || farmland.status_id === 1
                                ? "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]"
                                : "bg-[#F2F4F7] text-[var(--text-primary)] border border-gray-200"
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                farmland.status?.toLowerCase().includes("approv") || farmland.status_id === 1
                                  ? "bg-[#16A34A]"
                                  : "bg-gray-400"
                              )}
                            />
                            {farmland.status || "Approved"}
                          </span>
                        </td>

                        {/* Agent */}
                        <td className="py-4 px-6">
                          {agentFullName ? (
                            <div className="flex items-center gap-2.5">
                              <S3Image
                                src={farmland.agent?.img}
                                fallbackType="avatar"
                                alt={agentFullName}
                                className="w-7 h-7 rounded-full object-cover border border-gray-200"
                              />
                              <span className="font-medium text-sm text-[var(--text-primary)]">
                                {agentFullName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Unassigned</span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => navigate(`/super-admin/assigned-farmlands/${farmland.id}`)}
                            className="px-4 py-1.5 rounded-full border border-gray-300 bg-white text-[var(--text-primary)] hover:bg-[#2D3032] hover:text-white hover:border-[#2D3032] transition-colors font-inter font-medium text-xs whitespace-nowrap cursor-pointer shadow-xs"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
