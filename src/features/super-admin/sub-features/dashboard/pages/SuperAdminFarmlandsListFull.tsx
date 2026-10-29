import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import SuperAdminFarmlandsListCard from "@/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandsListCard";
import SuperAdminSoldOutTable from "@/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";
import { cn } from "@/lib/utils";

const SuperAdminFarmlandsListFull: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"farmland" | "soldOut">("farmland");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Duplicating the 4 mock items to fill the grid like a real list
  const data = [
    ...mockDashboardData.farmlandsList,
    ...mockDashboardData.farmlandsList.map(f => ({ ...f, id: f.id + "-copy-1", title: f.title.replace("0", "04") })),
  ];

  const filteredData = data.filter((farmland: any) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const title = (farmland.title || "").toLowerCase();
    const officer = (farmland.assignedOfficer?.name || "").toLowerCase();
    const location = (farmland.location || "").toLowerCase();
    const status = (farmland.status || "").toLowerCase();
    return title.includes(term) || officer.includes(term) || location.includes(term) || status.includes(term);
  });

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      <div className="bg-[#F6F7F6] rounded-[24px] p-6 flex flex-col gap-8 min-h-screen">
        
        {/* Go Back Button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors"
           >
            <ArrowLeft size={16} />
            Go back to dashboard
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          
          {/* Toggle Pills */}
          <div className="flex items-center bg-white p-1 rounded-full border border-gray-200 w-fit shrink-0">
            <button
              onClick={() => setActiveTab("farmland")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-colors w-32",
                activeTab === "farmland" 
                  ? "bg-[#2D3319] text-white" 
                  : "bg-transparent text-[var(--text-primary)] hover:bg-gray-50"
              )}
            >
              Farmland
            </button>
            <button
              onClick={() => setActiveTab("soldOut")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-colors w-32",
                activeTab === "soldOut" 
                  ? "bg-[#2D3319] text-white" 
                  : "bg-transparent text-[var(--text-primary)] hover:bg-gray-50"
              )}
            >
              Sold Out
            </button>
          </div>

          {/* Right side filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {["location", "Status"].map((filter) => (
              <button
                key={filter}
                className="flex items-center gap-2 px-4 py-2 h-10 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {filter}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
            ))}
            <div className="w-full sm:w-[220px]">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search By Agent"
                icon={<Search size={16} className="text-gray-400" />}
                className="rounded-full bg-white border-gray-200 text-xs sm:text-sm"
                wrapperClassName="h-9 sm:h-10"
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {activeTab === "farmland" ? (
          filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full min-h-[300px]">
              <p className="text-[#2D3032] font-medium text-lg">
                {searchTerm.trim() ? "No matching farmlands found" : "No data available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredData.map((farmland) => (
                <SuperAdminFarmlandsListCard
                  key={farmland.id}
                  data={farmland}
                  onViewDetails={(id) => navigate(`/super-admin/farmlands-list/${id}`)}
                  onEditTag={(id) => navigate(`/super-admin/edit-farmland-tag/${id}`)}
                />
              ))}
            </div>
          )
        ) : (
          <SuperAdminSoldOutTable />
        )}
      </div>
    </div>
  );
};

export default SuperAdminFarmlandsListFull;
