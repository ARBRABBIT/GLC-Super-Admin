import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import SuperAdminFarmlandCard from "@/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard";
import { useGetAllFarmlandsQuery } from "@/features/super-admin/api/farmland.api";
import { useGetAllMasterDataQuery } from "@/features/super-admin/api/masterData.api";
import { SIMPLE_MODE } from "@/core/config/featureFlags";

const SuperAdminAssignedFarmlandsList: React.FC=() => {
  const navigate=useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 8;
  const { data: masterData } = useGetAllMasterDataQuery();
  const pendingStatusId = masterData?.milestoneStageStatusResult?.find((s: any) => s.code === 'PENDNG')?.id;

  const { data: farmlandsData, isLoading: isFarmlandsLoading, error } = useGetAllFarmlandsQuery({
    country_id: 1,
    offset: 0,
    limit: 200,
    status_id: pendingStatusId,
  }, { skip: !pendingStatusId });

  const isLoading = !masterData || isFarmlandsLoading;
  const cardsData = farmlandsData?.data?.filter((f: any) => f.is_glc_exclusive === 0) || [];

  const filteredCards = cardsData.filter((f: any) => {
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
  const paginatedCards = filteredCards.slice((page - 1) * limit, page * limit);

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      {/* ── Page Header ── */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
        
        {/* Go Back Button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
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
              placeholder="Search by Agent or Farm Code"
              icon={<Search size={16} className="text-gray-400" />}
              className="rounded-full bg-white border-gray-200 text-xs sm:text-sm"
              wrapperClassName="h-9 sm:h-10"
            />
          </div>

          {!SIMPLE_MODE && (
            <div className="flex flex-wrap gap-3">
              {["Value range", "location", "Date"].map((filter) => (
                <button
                  key={filter}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {filter}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid of Cards */}
        <div className="w-full min-h-[400px] mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] text-[#2D3032]">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-[var(--text-primary)] font-medium">Loading farmlands...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center w-full h-full min-h-[400px]">
              <p className="text-red-500 font-medium">Failed to load farmlands. Please try again later.</p>
            </div>
          ) : paginatedCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px]">
              <p className="text-[#2D3032] font-medium text-lg">
                {searchTerm.trim() ? "No matching farmlands found" : "No data available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedCards.map((farmland, idx) => (
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

        {/* Pagination UI */}
        {filteredCards.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)]"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)]"
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

export default SuperAdminAssignedFarmlandsList;
