import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, FileX } from "lucide-react";
import { cn } from "@/lib/utils";
import SuperAdminFarmlandCard from "@/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard";
import { useGetDraftFarmlandsQuery } from "@/features/super-admin/api/farmland.api";

type TabId = "verification-drafts" | "uploaded-drafts";

const TABS: { id: TabId; label: string }[] = [
  { id: "verification-drafts", label: "Verification Farmland Drafts" },
  { id: "uploaded-drafts", label: "Uploaded Farmland Drafts" },
];

const SuperAdminDraftFarmlands: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("verification-drafts");
  const [page, setPage] = useState(1);
  const limit = 8;

  React.useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const { data, isLoading, error, refetch } = useGetDraftFarmlandsQuery();

  const allFarmlands: any[] = data?.data || [];

  const verificationDrafts = allFarmlands.filter((f: any) => f.is_glc_exclusive === 0);
  const uploadedDrafts = allFarmlands.filter((f: any) => f.is_glc_exclusive === 1);

  const cardsData = activeTab === "verification-drafts" ? verificationDrafts : uploadedDrafts;
  const totalCount = cardsData.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const paginatedCards = cardsData.slice((page - 1) * limit, page * limit);

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-[1.75rem] font-bold text-[var(--text-primary)] tracking-tight">
          Draft Farmlands
        </h1>
        <p className="text-[0.875rem] text-[var(--text-muted)] font-medium">
          Farmlands that are pending completion or review
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-white p-1 rounded-full border border-gray-200 w-fit shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-[#2D3319] text-white shadow-sm"
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
            <Loader2 className="w-10 h-10 animate-spin text-[#BDD327]" />
            <p className="font-medium text-[var(--text-primary)]">Loading draft farmlands...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center w-full min-h-[400px] gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-[var(--text-primary)] font-semibold text-lg">Failed to load draft farmlands</p>
              <p className="text-[var(--text-muted)] text-sm mt-1">Please check your connection and try again</p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 rounded-full bg-[#2D3319] text-white text-sm font-medium hover:bg-[#3d4a0d] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : cardsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full min-h-[400px] gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
              <FileX className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-center">
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
            {/* Count badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--text-muted)]">
                {totalCount} draft{totalCount !== 1 ? "s" : ""} found
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedCards.map((farmland: any, idx: number) => (
                <SuperAdminFarmlandCard
                  key={farmland.id}
                  data={farmland}
                  imagePosition={idx % 2 === 0 ? "top" : "bottom"}
                  onViewDetails={(id) => {
                    if (farmland.is_glc_exclusive === 1) {
                      navigate(`/super-admin/upload/process/${id}/customer-information`);
                    } else {
                      navigate(`/super-admin/assigned-farmlands/${id}`);
                    }
                  }}
                />
              ))}
            </div>

            {/* Pagination UI */}
            {cardsData.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default SuperAdminDraftFarmlands;
