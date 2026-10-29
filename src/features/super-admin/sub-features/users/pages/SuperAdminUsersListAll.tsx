import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import SuperAdminUserListCard from "@/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";
import { SIMPLE_MODE } from "@/core/config/featureFlags";


const SuperAdminUsersListAll: React.FC = () => {
  const navigate = useNavigate();
  const data = mockDashboardData;
  const [filter] = useState<string>("All");

  const filteredUsers=data.usersList.filter((user) => {
    if (filter === "All") return true;
    if (filter === "NRI") return user.type === "NRI";
    if (filter === "Local") return user.type === "Local";
    if (filter === "Subscribed") return user.isSubscribed;
    if (filter === "Non-Subscribed") return !user.isSubscribed;
    return true;
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

        {/* Filters Row (hidden in SIMPLE_MODE) */}

        {!SIMPLE_MODE && (
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full md:w-[320px]">
              <Input
                placeholder="Search By Agent"
                icon={<Search size={18} className="text-gray-400" />}
                className="rounded-full bg-white border-gray-200"
                wrapperClassName="h-10"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {["Value range", "location", "Date"].map((option) => (
                <button
                  key={option}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {option}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}


        {/* List of Users */}
        <div className="flex flex-col gap-4">
          {filteredUsers.map((user) => (
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

export default SuperAdminUsersListAll;
