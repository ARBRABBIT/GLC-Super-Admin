import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowUpRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SuperAdminHeader from "@/features/super-admin/components/SuperAdminHeader";
import SuperAdminFarmlandCard from "@/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard";
import VisitorSalesCard from "@/features/super-admin/sub-features/dashboard/components/VisitorSalesCard";
import FarmlandStatsCard from "@/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";
import { useGetAllFarmlandsQuery } from "@/features/super-admin/api/farmland.api";
import { useGetAllMasterDataQuery } from "@/features/super-admin/api/masterData.api";
import { SIMPLE_MODE } from "@/core/config/featureFlags";

const SuperAdminFarmlands: React.FC=() => {
  const navigate=useNavigate();
  const data=mockDashboardData;
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: masterData } = useGetAllMasterDataQuery();
  const pendingStatusId = masterData?.milestoneStageStatusResult?.find((s: any) => s.code === 'PENDNG')?.id;
  
  const { data: farmlandsData, isLoading: isFarmlandsLoading, error } = useGetAllFarmlandsQuery({
    country_id: 1,
    offset: 0,
    limit: 200,
    status_id: pendingStatusId,
  }, { skip: !pendingStatusId });

  const isLoading = !masterData || isFarmlandsLoading;

  // Use data from API for the preview grid
  const exclusiveFiltered = farmlandsData?.data?.filter((f: any) => f.is_glc_exclusive === 0) || [];

  const filteredFarmlands = exclusiveFiltered.filter((f: any) => {
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

  const previewCards = filteredFarmlands.slice(0, 4);

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      {/* ── Header Section (hidden in SIMPLE_MODE) ── */}
      {!SIMPLE_MODE && (
        <div className="shrink-0">
          <SuperAdminHeader
            title="SUPER ADMIN"
            breadcrumb="Assigned farmlands"
          >
            <div className="flex items-start justify-between gap-4 mt-4 w-full h-full relative z-10">
              <div className="mt-4">
                <VisitorSalesCard
                  visitors={data.visitors}
                  totalSales={data.totalSales}
                />
              </div>
              <div className="mt-auto mb-6">
                <FarmlandStatsCard stats={data.farmlandStats} />
              </div>
            </div>
          </SuperAdminHeader>
        </div>
      )}

      {/* ── Assigned Farmlands Section ── */}
      <div className="mt-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] tracking-tight">
              Assigned Farmlands
            </h2>
            <p className="text-[0.875rem] text-[var(--text-muted)] font-medium">
              Intelligence Audits Assigned to Regional Officers
            </p>
          </div>
          {(exclusiveFiltered.length || 0) > 4 && (
            <Button
              onClick={() => navigate("/super-admin/assigned-farmlands")}
              className="rounded-full px-6 bg-[#2D3032] hover:bg-black text-white font-medium self-start md:self-auto flex items-center gap-2"
            >
              View all
              <ArrowUpRight size={16} />
            </Button>
          )}
        </div>

        {/* ── Search & Filters ── */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between xl:items-center">
          <div className="w-full sm:w-[220px]">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Agent or Farm Code"
              icon={<Search size={16} className="text-gray-400" />}
              className="rounded-full bg-white border-gray-200 text-xs sm:text-sm"
              wrapperClassName="h-9 sm:h-10"
            />
          </div>
          {!SIMPLE_MODE && (
            <div className="flex flex-wrap gap-3">
              {["Area", "Region", "State", "Status"].map((filter) => (
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

        <div className="w-full min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px] text-[#2D3032]">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-[var(--text-primary)] font-medium">Loading farmlands...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center w-full h-full min-h-[300px]">
              <p className="text-red-500 font-medium">Failed to load farmlands. Please try again later.</p>
            </div>
          ) : previewCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px]">
              <p className="text-[#2D3032] font-medium text-lg">
                {searchTerm.trim() ? "No matching farmlands found" : "No data available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {previewCards.map((farmland, idx) => (
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
      </div>
    </div>
  );
};

export default SuperAdminFarmlands;
