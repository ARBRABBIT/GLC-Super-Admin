import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminHeader from "@/features/super-admin/components/SuperAdminHeader";
import VisitorSalesCard from "@/features/super-admin/sub-features/dashboard/components/VisitorSalesCard";
import FarmlandStatsCard from "@/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard";
import SuperAdminFarmlandCard from "@/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard";
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

const UploadSuperAdmin: React.FC = () => {
  const navigate = useNavigate();
  const data = mockDashboardData;
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data: farmlandsData, isLoading, error } = useGetAllFarmlandsQuery({
    country_id: 1,
    offset: (page - 1) * limit,
    limit: limit,
  });

  const cardsData = farmlandsData?.data?.filter((f: any) => f.is_glc_exclusive === 1) || [];
  const totalCount = farmlandsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

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
          <div className="flex flex-row flex-wrap gap-[clamp(0.72rem,1.5vw,1.25rem)] items-center justify-between w-full">
            <div className="relative w-[clamp(8.64rem,18vw,22.0rem)] max-w-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full h-[clamp(1.2rem,2.5vw,2.6rem)] pl-[clamp(2rem,2.5rem,2.75rem)] pr-[1rem] bg-white border border-[#EBEBEB] rounded-[clamp(2rem,4rem,4.04rem)] font-['Outfit'] font-normal text-[clamp(0.43rem,0.9vw,1.25rem)] text-[#767676] placeholder:text-[#767676] shadow-[0px_2.3rem_0.95rem_rgba(0,0,0,0.01)] focus:outline-none focus:border-gray-400"
              />
              <SearchIcon size={16} className="absolute left-[1.125rem] top-1/2 -translate-y-1/2 text-[#767676]" />
            </div>

            <div className="flex items-center justify-end flex-wrap gap-[clamp(0.48rem,1vw,0.75rem)]">
              {["Area", "Region", "State", "Status"].map((f) => (
                <div key={f} className="relative shrink-0">
                  <select className="appearance-none h-[clamp(1.1rem,2.3vw,2.4rem)] pl-[clamp(1rem,1.5rem,1.75rem)] pr-[clamp(2rem,2.5rem,2.75rem)] bg-white border border-[#EBEBEB] rounded-[clamp(2rem,4rem,4.04rem)] font-['Plus_Jakarta_Sans'] font-normal text-[clamp(0.43rem,0.9vw,1.25rem)] text-[#5A5C5E] cursor-pointer focus:outline-none hover:bg-gray-50">
                    <option value="">{f}</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-[1rem] top-1/2 -translate-y-1/2 text-[#5A5C5E] pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Farmland Cards Grid ── */}
        <div className="w-full min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full min-h-[400px] text-[#2D3032]">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="font-medium">Loading farmlands...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center w-full min-h-[400px]">
              <p className="text-red-500 font-medium text-center">Failed to load farmlands. Please try again later.</p>
            </div>
          ) : cardsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full min-h-[400px]">
              <p className="text-[#2D3032] font-medium text-lg">No farmlands available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cardsData.map((farmland, idx) => (
                <SuperAdminFarmlandCard
                  key={farmland.id}
                  data={farmland}
                  imagePosition={idx % 2 === 0 ? "top" : "bottom"}
                  onViewDetails={(id) => navigate(`/super-admin/assigned-farmlands/${id}`, { state: { from: 'upload' } })}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {cardsData.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
