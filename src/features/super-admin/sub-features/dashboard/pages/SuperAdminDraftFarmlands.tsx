import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, FileX, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { S3Image } from "@/components/common/S3Image";
import { useGetDraftFarmlandsQuery } from "@/features/super-admin/api/farmland.api";

type TabId = "verification-drafts" | "uploaded-drafts";

const TABS: { id: TabId; label: string }[] = [
  { id: "verification-drafts", label: "Verification Farmland Drafts" },
  { id: "uploaded-drafts", label: "Uploaded Farmland Drafts" },
];

const SuperAdminDraftFarmlands: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("verification-drafts");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  React.useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const { data, isLoading, error, refetch } = useGetDraftFarmlandsQuery();

  const allFarmlands: any[] = data?.data || [];

  const verificationDrafts = allFarmlands.filter((f: any) => f.is_glc_exclusive === 0);
  const uploadedDrafts = allFarmlands.filter((f: any) => f.is_glc_exclusive === 1);

  const currentTabDrafts = activeTab === "verification-drafts" ? verificationDrafts : uploadedDrafts;

  const filteredCards = currentTabDrafts.filter((f: any) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const farmCode = (f.farm_code || "").toLowerCase();
    const village = (f.village_name || "").toLowerCase();
    const agentFirst = (f.agent?.first_name || "").toLowerCase();
    const agentLast = (f.agent?.last_name || "").toLowerCase();
    const agentFull = `${agentFirst} ${agentLast}`.trim();
    return farmCode.includes(term) || village.includes(term) || agentFull.includes(term);
  });

  const totalCount = filteredCards.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const paginatedCards = filteredCards.slice((page - 1) * limit, page * limit);

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-[1.75rem] font-bold text-[var(--text-primary)] tracking-tight font-['Plus_Jakarta_Sans']">
          Draft Farmlands
        </h1>
        <p className="text-[0.875rem] text-[var(--text-muted)] font-medium font-inter">
          Farmlands that are pending completion or review
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-white p-1 rounded-full border border-gray-200 w-fit shadow-xs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 font-inter cursor-pointer",
              activeTab === tab.id
                ? "bg-[#2D3319] text-white shadow-xs"
                : "bg-transparent text-[var(--text-primary)] hover:bg-gray-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 w-full min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full min-h-[400px] gap-4 text-[#2D3032]">
            <Loader2 className="w-10 h-10 animate-spin text-[#2D3319]" />
            <p className="font-medium text-[var(--text-primary)] font-inter">Loading draft farmlands...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center w-full min-h-[400px] gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-center font-inter">
              <p className="text-[var(--text-primary)] font-semibold text-lg">Failed to load draft farmlands</p>
              <p className="text-[var(--text-muted)] text-sm mt-1">Please check your connection and try again</p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 rounded-full bg-[#2D3319] text-white text-sm font-medium hover:bg-black transition-colors font-inter cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : currentTabDrafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full min-h-[400px] gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
              <FileX className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-center font-inter">
              <p className="text-[var(--text-primary)] font-semibold text-lg">No draft farmlands</p>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                {activeTab === "verification-drafts"
                  ? "There are no farmlands pending verification at this time."
                  : "There are no uploaded farmland drafts at this time."}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Search and Count Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-muted)] font-inter">
                  {totalCount} draft{totalCount !== 1 ? "s" : ""} found
                </span>
              </div>
              <div className="w-full sm:w-[260px]">
                <Input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by code or location..."
                  icon={<Search size={16} className="text-gray-400" />}
                  className="rounded-full bg-white border-gray-200 font-inter text-sm"
                  wrapperClassName="h-10"
                />
              </div>
            </div>

            {/* Table */}
            {filteredCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full min-h-[300px] bg-white rounded-2xl border border-gray-100 shadow-xs">
                <p className="text-[#2D3032] font-medium text-base font-inter">
                  No draft farmlands match your search criteria.
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
                    {paginatedCards.map((farmland: any) => {
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

                      const statusText = farmland.status || "Draft";
                      const isApproved = statusText.toLowerCase().includes("approv");
                      const isReverted =
                        statusText.toLowerCase().includes("revert") ||
                        statusText.toLowerCase().includes("reject");

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
                                  {farmland.village_name || "Draft Farmland"}
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
                                isApproved
                                  ? "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]"
                                  : isReverted
                                  ? "bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2]"
                                  : "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]"
                              )}
                            >
                              <span
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  isApproved
                                    ? "bg-[#16A34A]"
                                    : isReverted
                                    ? "bg-[#EF4444]"
                                    : "bg-[#D97706]"
                                )}
                              />
                              {statusText}
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
                              onClick={() => {
                                if (farmland.is_glc_exclusive === 1) {
                                  navigate(`/super-admin/upload/process/${farmland.id}/customer-information`);
                                } else {
                                  navigate(`/super-admin/assigned-farmlands/${farmland.id}`);
                                }
                              }}
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

            {/* Pagination UI */}
            {filteredCards.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500 font-inter">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} entries
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)] font-inter transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)] font-inter transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDraftFarmlands;
