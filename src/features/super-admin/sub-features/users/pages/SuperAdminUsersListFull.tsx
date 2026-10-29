import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import SuperAdminHeader from "@/features/super-admin/components/SuperAdminHeader";
import VisitorSalesCard from "@/features/super-admin/sub-features/dashboard/components/VisitorSalesCard";
import FarmlandStatsCard from "@/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard";
import SuperAdminUserListCard from "@/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard";

import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";

import { SIMPLE_MODE } from "@/core/config/featureFlags";

const SuperAdminUsersListFull: React.FC = () => {
  const data = mockDashboardData;
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("All");
  const [isOpen, setIsOpen] = useState(false);

  const filteredUsers = data.usersList.filter((user) => {
    if (filter === "All") return true;
    if (filter === "NRI") return user.type === "NRI";
    if (filter === "Local") return user.type === "Local";
    if (filter === "Subscribed") return user.isSubscribed;
    if (filter === "Non-Subscribed") return !user.isSubscribed;
    return true;
  });

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      {/* ── Header Section (hidden in SIMPLE_MODE) ── */}
      {!SIMPLE_MODE && (
        <div className="shrink-0">
          <SuperAdminHeader
            title="SUPER ADMIN"
            breadcrumb="Assigned Farmlands"
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

      {/* ── Users Section ── */}
      <div className="mt-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-[1.5rem] lg:text-[1.75rem] font-bold text-[var(--text-primary)] tracking-tight">
              Users
            </h2>
            <p className="text-[0.875rem] text-[var(--text-muted)] font-medium">
              Managed dossiers from premium agents
            </p>
          </div>
        </div>

        {/* Search & Filters (hidden in SIMPLE_MODE) */}
        {!SIMPLE_MODE && (
          <div className="flex flex-col xl:flex-row gap-4 justify-between xl:items-center">
            <div className="w-full xl:w-[320px]">
              <Input
                placeholder="Search"
                icon={<Search size={18} className="text-gray-400" />}
                className="rounded-full bg-white border-gray-200"
                wrapperClassName="h-10"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {filter}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              
              {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-[1rem] shadow-lg border border-gray-100 py-2 z-50">
                  {["All", "NRI", "Local", "Subscribed", "Non-Subscribed"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        if (option === "All") {
                          navigate("/super-admin/users-list/all");
                        } else {
                          setFilter(option);
                        }
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}


        <div className="flex flex-col gap-4">
          {filteredUsers.slice(0, 4).map((user) => (
            <SuperAdminUserListCard
              key={user.id}
              data={user}
              onViewProfile={(id) => navigate(`/super-admin/user-profile/${id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminUsersListFull;
