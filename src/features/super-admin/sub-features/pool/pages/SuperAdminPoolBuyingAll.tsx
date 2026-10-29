import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PoolBuyingCard from "@/features/super-admin/sub-features/dashboard/components/PoolBuyingCard";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";
import { SIMPLE_MODE } from "@/core/config/featureFlags";
import { 
  SelectLocationModal, 
  LOCATION_FARMLAND_MAP 
} from "../components/SelectLocationModal";


const SuperAdminPoolBuyingAll: React.FC = () => {
  const navigate = useNavigate();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
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

  // Duplicate the pools to create a longer list for the "View All" page
  const allPools = [
    ...data.poolBuyingPools,
    ...data.poolBuyingPools.map((p) => ({ ...p, id: p.id + "-dup" })),
  ];

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      <div className="bg-[#F6F7F6] rounded-[24px] p-6 flex flex-col gap-6 min-h-screen">

        {/* Top Row: Go Back + Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} />
            Go back
          </button>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex-1 rounded-full px-6 bg-[#2D3032] hover:bg-black text-white font-medium flex items-center justify-center gap-2"
            >
              Create Pool
              <ArrowUpRight size={16} />
            </Button>
            <Button
              onClick={() => navigate("/super-admin/pool-buying/all")}
              className="flex-1 rounded-full px-6 bg-[#2D3032] hover:bg-black text-white font-medium flex items-center justify-center gap-2"
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
                placeholder="Search"
                icon={<Search size={18} className="text-gray-400" />}
                className="rounded-full bg-white border-gray-200"
                wrapperClassName="h-10"
              />
            </div>

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
          </div>
        )}


        {/* Pool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allPools.map((pool) => (
            <PoolBuyingCard
              key={pool.id}
              data={pool}
              onViewDetails={(id) => navigate(`/super-admin/pool-buying/${id}`)}
            />
          ))}
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
