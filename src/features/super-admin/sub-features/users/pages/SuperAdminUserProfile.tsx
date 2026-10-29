import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";
import { S3Image } from '@/components/common/S3Image';

const SuperAdminUserProfile: React.FC = () => {
  const navigate = useNavigate();

  // In a real app, you would fetch user data by ID.
  // For now, we'll just use the single mock profile.
  const profile = mockDashboardData.userProfile;

  return (
    <div className="box-border min-h-screen bg-[#F6F7F6] p-[clamp(16px,2vw,32px)] overflow-auto custom-scrollbar">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors mb-6 shadow-sm"
      >
        <ArrowLeft size={16} />
        Go back to dashboard
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Profile Hero */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#E8F5E9] shadow-inner p-1">
              <S3Image
                src={profile.avatar}
                fallbackType="avatar"
                alt={profile.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#2D3032] mb-2">{profile.name}</h1>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-500 tracking-widest">{profile.tier}</span>
            {profile.isActive && (
              <span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold tracking-wider">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-1">{profile.email}</p>
          <p className="text-xs text-gray-400">{profile.phone}</p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 mb-10"></div>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-center md:justify-around w-full gap-8 md:gap-16 mb-10">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-[#545E6A] mb-2 leading-none">
              {String(profile.stats.farmlandPurchases).padStart(2, '0')}
            </span>
            <div className="w-6 h-0.5 bg-[#8BC34A] mb-2"></div>
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              Farmland Purchases
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-[#545E6A] mb-2 leading-none">
              {String(profile.stats.timesSubscribed).padStart(2, '0')}
            </span>
            <div className="w-6 h-0.5 bg-[#8BC34A] mb-2"></div>
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              Times Subscribed
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-[#545E6A] mb-2 leading-none">
              {String(profile.stats.viewsLeft).padStart(2, '0')}
            </span>
            <div className="w-6 h-0.5 bg-[#8BC34A] mb-2"></div>
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              Views Left
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 mb-10"></div>

        {/* Recent Activity */}
        <div className="w-full">
          <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6">
            Recent Activity
          </h3>

          <div className="flex flex-col gap-4">
            {profile.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-[16px] border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] border-l-4 ${activity.borderColor}`}
              >
                <div className="flex flex-col gap-1.5 mb-2 sm:mb-0">
                  <span className="text-[14px] font-semibold text-[#2D3032]">
                    {activity.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-500">
                      {activity.subtitle}
                    </span>
                    {activity.badge && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-[11px] font-medium text-[#8BC34A]">
                          {activity.badge}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5">
                  <span className="text-[14px] font-semibold text-[#2D3032]">
                    {activity.statusText}
                  </span>
                  <span className="text-[12px] text-gray-400">
                    {activity.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminUserProfile;
