import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminHeader from "@/features/super-admin/components/SuperAdminHeader";
import VisitorSalesCard from "@/features/super-admin/sub-features/dashboard/components/VisitorSalesCard";
import FarmlandStatsCard from "@/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";
import { useGetAllFarmlandsQuery } from "@/features/super-admin/api/farmland.api";
import { SIMPLE_MODE } from "@/core/config/featureFlags";
import {
  ChevronDown,
  Search as SearchIcon,
  ArrowUpRight,
  X as XIcon,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { S3Image } from "@/components/common/S3Image";
import { cn } from "@/lib/utils";

const UploadSuperAdmin: React.FC = () => {
  const navigate = useNavigate();
  const data = mockDashboardData;
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: farmlandsData, isLoading, error } = useGetAllFarmlandsQuery({
    country_id: 1,
    offset: 0,
    limit: 200,
  });

  const sourceFarmlands = (farmlandsData?.data || []).filter(
    (f: any) => f.is_glc_exclusive === 1
  );
  const listToDisplay = sourceFarmlands.length > 0 ? sourceFarmlands : (farmlandsData?.data || []);

  const filteredFarmlands = listToDisplay.filter((f: any) => {
    if (selectedStatus !== "All") {
      const statusLower = (f.status || "").toLowerCase();
      if (!statusLower.includes(selectedStatus.toLowerCase())) return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const farmCode = (f.farm_code || "").toLowerCase();
      const village = (f.village_name || "").toLowerCase();
      const agentFirst = (f.agent?.first_name || "").toLowerCase();
      const agentLast = (f.agent?.last_name || "").toLowerCase();
      const agentFull = `${agentFirst} ${agentLast}`.trim();
      if (!farmCode.includes(term) && !village.includes(term) && !agentFull.includes(term)) {
        return false;
      }
    }
    return true;
  });

  const totalCount = filteredFarmlands.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const paginatedFarmlands = filteredFarmlands.slice((page - 1) * limit, page * limit);

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      {/* ── Header Section (hidden in SIMPLE_MODE) ── */}
      {!SIMPLE_MODE && (
        <div className="shrink-0">
          <SuperAdminHeader
            title="SUPER ADMIN"
            breadcrumb="Upload Center"
            subtitle="Direct secure portal to load structured datasets, Geospatial GeoJSON mappings, and admin registers."
          >
            <div className="flex items-start justify-between gap-4 mt-4 w-full h-full relative z-10">
              <div className="mt-4">
                <VisitorSalesCard
                  visitors={data.visitors}
                  totalSales={data.totalSales}
                  bgClass="bg-[#FFFFFF] border-none shadow-sm"
                />
              </div>
              <div className="mt-auto mb-6">
                <FarmlandStatsCard
                  stats={data.farmlandStats}
                  bgClass="bg-[#FFFFFF] border-none shadow-sm"
                />
              </div>
            </div>
          </SuperAdminHeader>
        </div>
      )}

      {/* ── Uploaded Farmlands Main Section ── */}
      <div className="flex flex-col gap-[clamp(0.96rem,2vw,1.5rem)] mt-[clamp(0.96rem,2vw,1.5rem)] px-[clamp(0.25rem,1.5vw,0.75rem)]">
        {/* Title row and Upload button */}
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-[clamp(0.12rem,0.25vw,0.25rem)]">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[clamp(1.06rem,2.2vw,3.0rem)] leading-tight text-[#131600]">
              Uploaded Farmlands
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] font-semibold text-[clamp(0.58rem,1.2vw,1.6rem)] leading-normal text-[#45474C]">
              Upload documents to list a farmland
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-[clamp(0.24rem,0.5vw,0.375rem)] h-[clamp(1.2rem,2.5vw,2.75rem)] px-[clamp(0.72rem,1.5vw,1.25rem)] rounded-[clamp(1.2rem,2.5vw,2.18rem)] text-white transition-transform hover:scale-[1.02] shadow-sm shrink-0"
            style={{
              background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)",
            }}
          >
            <span className="font-['Plus_Jakarta_Sans'] font-normal text-[clamp(0.48rem,1vw,1.35rem)] leading-none text-center">
              Upload a farmland
            </span>
            <ArrowUpRight size={14} className="text-white" />
          </button>
        </div>

        {/* ── Search & Filters (hidden in SIMPLE_MODE) ── */}
        {!SIMPLE_MODE && (
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 w-full">
            <div className="w-full sm:w-[260px]">
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                icon={<SearchIcon size={16} className="text-gray-400" />}
                className="rounded-full bg-white border-gray-200 font-inter text-sm"
                wrapperClassName="h-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedStatus((prev) =>
                      prev === "All" ? "Approved" : prev === "Approved" ? "Reverted" : "All"
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs font-inter"
                >
                  <span>Status: {selectedStatus}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              </div>

              {["Area", "Region", "State"].map((filter) => (
                <button
                  key={filter}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs font-inter"
                >
                  {filter}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Farmlands Table ── */}
        <div className="w-full min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full min-h-[400px] text-[#2D3032]">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="font-medium text-[var(--text-primary)] font-inter">Loading farmlands...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center w-full min-h-[400px]">
              <p className="text-red-500 font-medium text-center font-inter">Failed to load farmlands. Please try again later.</p>
            </div>
          ) : filteredFarmlands.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full min-h-[400px]">
              <p className="text-[#2D3032] font-medium text-lg font-inter">
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
                  {paginatedFarmlands.map((farmland: any) => {
                    const costPerAcre =
                      farmland.valuation && farmland.total_acres && Number(farmland.total_acres) > 0
                        ? `₹${(Number(farmland.valuation) / Number(farmland.total_acres)).toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}`
                        : farmland.valuation
                        ? `₹${Number(farmland.valuation).toLocaleString("en-IN")}`
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
                        {/* Farmland Info: Cover Thumbnail + Farm Code + GLC Exclusive + Village */}
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
                                <span className="font-bold text-sm text-[var(--text-primary)] font-['Plus_Jakarta_Sans']">
                                  {farmland.farm_code}
                                </span>
                                {farmland.is_glc_exclusive === 1 && (
                                  <span className="px-2 py-0.5 bg-[#E6EEAD] text-[#2A3125] text-[10px] font-bold rounded-full border border-[#D5DF96]">
                                    GLC Exclusive
                                  </span>
                                )}
                              </div>
                              <span className="text-[12px] text-[var(--text-muted)] font-inter">
                                {farmland.village_name || "Assigned Farmland"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Area */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-sm text-[var(--text-primary)] font-inter">
                            {farmland.total_acres ? `${Number(farmland.total_acres).toFixed(2)} acres` : "N/A"}
                          </div>
                        </td>

                        {/* Cost per Acre + Total Valuation */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-sm text-[var(--text-primary)] font-inter">
                            {costPerAcre}
                          </div>
                          {totalValuation && (
                            <div className="text-[11px] text-[var(--text-muted)] mt-0.5 font-inter">
                              Total: {totalValuation}
                            </div>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase font-inter",
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

                        {/* Assigned Agent */}
                        <td className="py-4 px-6">
                          {agentFullName ? (
                            <div className="flex items-center gap-2.5">
                              <S3Image
                                src={farmland.agent?.img}
                                fallbackType="avatar"
                                alt={agentFullName}
                                className="w-7 h-7 rounded-full object-cover border border-gray-200"
                              />
                              <span className="font-medium text-sm text-[var(--text-primary)] font-inter">
                                {agentFullName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic font-inter">Unassigned</span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() =>
                              navigate(`/super-admin/assigned-farmlands/${farmland.id}`, {
                                state: { from: "upload" },
                              })
                            }
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
        {filteredFarmlands.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500 font-inter">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)] font-inter transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)] font-inter transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Upload Modal ── */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-[1rem]">
          <div
            className="absolute inset-0 bg-[#0F1011]/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsUploadModalOpen(false)}
          />
          <div
            className="relative bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] max-w-[95vw] max-h-[95vh] overflow-hidden z-10 flex flex-col md:flex-row animate-in fade-in zoom-in duration-200"
            style={{
              width: "clamp(22.4rem, 46.67vw, 48rem)",
              height: "clamp(21.87rem, 45.56vw, 46rem)",
              borderRadius: "clamp(1.07rem, 2.22vw, 2.5rem)",
            }}
          >
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute right-[clamp(0.8rem,1.67vw,2.0rem)] top-[clamp(0.72rem,1.5vw,1.8rem)] text-[#000000] opacity-60 hover:opacity-100 p-1 hover:bg-black/5 rounded-full transition-all z-20 cursor-pointer"
            >
              <XIcon size={20} />
            </button>

            {/* Left Side */}
            <div className="flex-1 flex flex-col justify-between p-[clamp(1.33rem,2.78vw,3.0rem)] border-r border-[#C6C8BA]/30 h-full relative">
              <div className="flex flex-col gap-[clamp(0.4rem,0.83vw,1.0rem)]">
                <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-[clamp(1.07rem,2.22vw,2.5rem)] leading-[clamp(1.33rem,2.78vw,3.0rem)] tracking-[-0.01em] text-[#191C1B]">
                  Upload a new farmland
                </h2>
                <p className="font-['Plus_Jakarta_Sans'] font-normal text-[clamp(0.47rem,0.97vw,1.1rem)] leading-[clamp(0.6rem,1.25vw,1.4rem)] text-[#45483E]">
                  Complete the following onboarding pipeline to successfully list a farmland.
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-center relative pl-[clamp(1rem,2.2vw,2.5rem)] my-[clamp(0.96rem,2vw,2.5rem)]">
                <div
                  className="absolute w-[1px] bg-[#2C2C2C]/25"
                  style={{
                    left: "calc(clamp(1rem, 2.2vw, 2.5rem) + 4px)",
                    top: "clamp(0.48rem, 1vw, 1.25rem)",
                    bottom: "clamp(0.48rem, 1vw, 1.25rem)"
                  }}
                />
                <div className="flex flex-col gap-[clamp(1.34rem,2.8vw,3.5rem)]">
                  {[
                    { name: "Customer Information", active: true },
                    { name: "Legal Documents", active: false },
                    { name: "Agriculture Report", active: false },
                    { name: "Land & Boundaries", active: false },
                    { name: "Valuation", active: false },
                    { name: "Local Intelligence", active: false },
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex items-center gap-[clamp(0.6rem,1.25vw,1.5rem)] z-10">
                      <div className="w-[9px] h-[9px] shrink-0 flex items-center justify-center">
                        <div
                          className={`w-[9px] h-[9px] rounded-full transition-all ${
                            step.active
                              ? "bg-[#CED2B4] border-[1.5px] border-[#CCDB99]/80 shadow-[0_0_0_3px_rgba(189,211,39,0.38)]"
                              : "bg-[#C0C2B7] border-[1.5px] border-[#CCDB99]/80"
                          }`}
                        />
                      </div>
                      <span
                        className={`font-['Plus_Jakarta_Sans'] font-semibold text-[clamp(0.4rem,0.83vw,0.75rem)] uppercase tracking-[0.6px] leading-none transition-colors ${
                          step.active ? "text-[#2A3008] font-bold" : "text-[#808277]"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="w-full md:w-[clamp(10.67rem,22.22vw,22.0rem)] bg-[#F3F4F1] h-full flex flex-col justify-between items-center p-[clamp(1.33rem,2.78vw,3.0rem)] pt-[clamp(1.92rem,4vw,5.0rem)] pb-[clamp(1.33rem,2.78vw,3.0rem)] shrink-0">
              <div
                className="bg-white border border-[#C6C8BA]/20 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] rounded-[clamp(0.8rem,1.67vw,1.8rem)] p-[clamp(0.62rem,1.3vw,1.5rem)] flex flex-col gap-[clamp(0.29rem,0.6vw,0.8rem)] w-[clamp(8rem,16.67vw,17.0rem)] h-[clamp(7.48rem,15.59vw,16.0rem)] transition-transform duration-300 hover:scale-[1.03] select-none"
                style={{ transform: "rotate(2deg)" }}
              >
                <div className="w-full aspect-[4/3] rounded-[clamp(0.4rem,0.83vw,1.0rem)] overflow-hidden shrink-0">
                  <img
                    src="/super-admin/images/document_preview_mockup.png"
                    alt="Document Mockup Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-[60%] h-[clamp(0.24rem,0.5vw,0.6rem)] bg-[#EDEEEB] rounded-full mt-1" />
                <div className="w-[40%] h-[clamp(0.24rem,0.5vw,0.6rem)] bg-[#EDEEEB] rounded-full" />
              </div>

              <p
                className="font-['Plus_Jakarta_Sans'] font-semibold text-[12px] leading-[16px] text-[#45483E] text-center tracking-[0.6px] my-[clamp(0.48rem,1vw,1.5rem)]"
                style={{ width: "212px" }}
              >
                Upload high-resolution scans of your land titles and documents in PDF format.
              </p>

              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  navigate("/super-admin/upload/land-details/new");
                }}
                className="hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0px_4px_12px_rgba(42,48,8,0.2)] text-white font-['Plus_Jakarta_Sans'] font-medium text-[clamp(0.43rem,0.9vw,1.1rem)] w-[clamp(7.66rem,15.95vw,17.0rem)] h-[clamp(1.32rem,2.76vw,3.25rem)] rounded-[35px]"
                style={{
                  background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)",
                }}
              >
                <span>Start Uploading Documents</span>
                <ArrowUpRight size={14} className="text-white shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSuperAdmin;
