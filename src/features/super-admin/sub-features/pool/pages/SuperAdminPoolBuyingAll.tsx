import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";
import { SIMPLE_MODE } from "@/core/config/featureFlags";
import { 
  SelectLocationModal, 
  LOCATION_FARMLAND_MAP 
} from "../components/SelectLocationModal";
import { cn } from "@/lib/utils";

const formatDisplayAmount = (amount: number): string => {
  return amount.toLocaleString("en-IN");
};

const SuperAdminPoolBuyingAll: React.FC = () => {
  const navigate = useNavigate();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const data = mockDashboardData;

  const handleLocationContinue = (location: string, selectedLand?: any) => {
    setIsLocationModalOpen(false);
    const details =
      selectedLand ||
      LOCATION_FARMLAND_MAP[location] ||
      LOCATION_FARMLAND_MAP["Hyderabad, Telangana"];
    navigate("/super-admin/pool-buying/create", {
      state: {
        location: selectedLand?.location || location,
        farmlandId: details.farmlandId || details.farm_code,
        assignedCode: details.assignedCode || details.farm_code,
        wholeAreaAcres: details.wholeAreaAcres || details.total_acres || "25.00",
        wholeAreaSqFt: details.wholeAreaSqFt || "10,89,000",
      },
    });
  };

  // Pools list for the "View All" page
  const allPools = [
    ...data.poolBuyingPools,
    ...data.poolBuyingPools.map((p) => ({ ...p, id: p.id + "-dup" })),
  ];

  const filteredPools = allPools.filter((pool) => {
    if (selectedStatus !== "All" && pool.status !== selectedStatus) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchLoc = pool.location.toLowerCase().includes(q);
      const matchId = pool.farmlandId.toLowerCase().includes(q);
      const matchPoolId = pool.id.toLowerCase().includes(q);
      if (!matchLoc && !matchId && !matchPoolId) return false;
    }
    return true;
  });

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      <div className="bg-[#F6F7F6] rounded-[24px] p-6 flex flex-col gap-6 min-h-screen">

        {/* Top Row: Go Back + Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors cursor-pointer shadow-xs font-inter"
          >
            <ArrowLeft size={16} />
            Go back
          </button>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex-1 rounded-full px-6 bg-[#2D3032] hover:bg-black text-white font-medium flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              Create Pool
              <ArrowUpRight size={16} />
            </Button>
            <Button
              onClick={() => navigate("/super-admin/pool-buying/all")}
              className="flex-1 rounded-full px-6 bg-[#2D3032] hover:bg-black text-white font-medium flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              View all
              <ArrowUpRight size={16} />
            </Button>
          </div>
        </div>

        {/* Search + Filters (hidden in SIMPLE_MODE) */}
        {!SIMPLE_MODE && (
          <div className="flex flex-col xl:flex-row gap-4 justify-between xl:items-center">
            <div className="w-full xl:w-[260px]">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                icon={<Search size={18} className="text-gray-400" />}
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
                      prev === "All" ? "Active" : prev === "Active" ? "Closed" : "All"
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

        {/* Pool Table */}
        <div className="w-full overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-xs">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-[#FAFAFA]/80">
                <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                  Farmland / Pool
                </th>
                <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                  Investors
                </th>
                <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                  Target Amount
                </th>
                <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                  Status
                </th>
                <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPools.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-inter text-sm">
                    No investment pools match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredPools.map((pool) => {
                  return (
                    <tr
                      key={pool.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Farmland / Pool Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <img
                              src={pool.image}
                              alt={pool.farmlandId}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/super-admin/images/farmland1.png";
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[var(--text-primary)] font-['Plus_Jakarta_Sans']">
                                {pool.farmlandId}
                              </span>
                              <span className="text-[11px] text-gray-400 font-inter">
                                ({pool.id})
                              </span>
                            </div>
                            <span className="text-[12px] text-[var(--text-muted)] font-inter">
                              {pool.location}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Investors */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-sm text-[var(--text-primary)] font-inter">
                          {pool.investors} Investors
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5 font-inter">
                          Active participants
                        </div>
                      </td>

                      {/* Target Amount */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-sm text-[var(--text-primary)] font-['Plus_Jakarta_Sans']">
                          ₹{formatDisplayAmount(pool.targetAmount)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase font-inter",
                            pool.status === "Active"
                              ? "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]"
                              : pool.status === "Closed"
                              ? "bg-gray-100 text-gray-700 border border-gray-200"
                              : "bg-amber-50 text-amber-600 border border-amber-200"
                          )}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              pool.status === "Active"
                                ? "bg-[#16A34A]"
                                : pool.status === "Closed"
                                ? "bg-gray-400"
                                : "bg-amber-500"
                            )}
                          />
                          {pool.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => navigate(`/super-admin/pool-buying/${pool.id}`)}
                          className="px-4 py-1.5 rounded-full border border-gray-300 bg-white text-[var(--text-primary)] hover:bg-[#2D3032] hover:text-white hover:border-[#2D3032] transition-colors font-inter font-medium text-xs whitespace-nowrap cursor-pointer shadow-xs"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Select Location Pop-up Modal */}
      <SelectLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onContinue={handleLocationContinue}
      />
    </div>
  );
};

export default SuperAdminPoolBuyingAll;
