import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Check, Clock, TrendingUp, Star } from "lucide-react";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";
import { cn } from "@/lib/utils";
import { S3Image } from '@/components/common/S3Image';

const SuperAdminAgentProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Use mock data for agent profile
  const baseData = mockDashboardData.agentProfile;
  
  // Find the specific agent from top performers list based on ID
  const specificAgent = mockDashboardData.topPerformersDetailed.find(p => p.id === id);

  // Merge dynamic name and avatar into the profile data
  const data = {
    ...baseData,
    name: specificAgent?.name || baseData.name,
    avatar: specificAgent?.avatar || baseData.avatar,
  };

  return (
    <div className="box-border min-h-screen bg-[#F6F7F6] p-[clamp(16px,2vw,32px)] overflow-auto custom-scrollbar flex flex-col gap-8 items-center">
      
      {/* Header Actions */}
      <div className="w-full max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-[#2D3032] hover:bg-gray-50 transition-colors shadow-sm w-fit"
        >
          <ArrowLeft size={16} />
          Go back
        </button>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-[40px] p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
        
        {/* Left Stats */}
        <div className="flex flex-col gap-12 min-w-[140px] items-center md:items-end z-10 border-r border-gray-100 pr-12 hidden md:flex">
          <div className="flex flex-col items-center md:items-end">
            <span className="text-4xl font-black text-[#2D3032] tracking-tight">{data.pendingReview}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Pending Review</span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-4xl font-black text-[#2D3032] tracking-tight">{data.rejectedDeals}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Rejected Deals</span>
          </div>
        </div>

        {/* Center Profile */}
        <div className="flex flex-col items-center z-10 flex-1">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-white mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#B2EBF2] to-[#E0F7FA] opacity-50"></div>
            <S3Image src={data.avatar} fallbackType="avatar" alt={data.name} className="w-full h-full object-cover relative z-10" />
          </div>
          
          <h1 className="text-xl font-bold text-[#2D3032] mb-1">{data.name}</h1>
          <span className="text-[13px] text-gray-500 font-medium mb-4">{data.role}</span>
          
          <div className="flex items-center gap-1.5 bg-[#F3F6E8] px-3 py-1.5 rounded-full mb-8">
            <Star size={12} className="text-[#8BC34A] fill-[#8BC34A]" />
            <span className="text-[11px] font-bold text-[#3E421B]">{data.performanceIndex}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[64px] leading-none font-black text-[#2D3032] tracking-tighter">{data.completedDeals}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 mb-3">Completed Deals</span>
            <div className="flex items-center gap-1.5 text-[#2E7D32]">
              <TrendingUp size={14} />
              <span className="text-[12px] font-bold">{data.growth}</span>
            </div>
          </div>
        </div>

        {/* Right Stats (Progress Bars) */}
        <div className="flex flex-col gap-8 min-w-[240px] z-10 border-l border-gray-100 pl-12 hidden md:flex">
          
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center text-[12px] font-semibold text-gray-500">
              <span>Close Ratio</span>
              <div className="flex items-center gap-1 text-[#2E7D32]">
                <span className="text-[13px] text-[#2D3032] font-bold">{data.closeRatio}%</span>
                <ArrowLeft size={12} className="rotate-135" />
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#8BC34A] rounded-full" style={{ width: `${data.closeRatio}%` }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center text-[12px] font-semibold text-gray-500">
              <span>Avg Response</span>
              <div className="flex items-center gap-1 text-gray-500">
                <span className="text-[13px] text-[#2D3032] font-bold">{data.avgResponse}</span>
                <span>—</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#374151] rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center text-[12px] font-semibold text-gray-500">
              <span>Quarter Perf</span>
              <div className="flex items-center gap-1 text-[#8BC34A]">
                <span className="text-[13px] text-[#2D3032] font-bold">{data.quarterPerf}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#8BC34A] rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

        </div>
      </div>

      {/* Transactions Section */}
      <div className="w-full max-w-6xl mt-4">
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-[14px] font-bold text-[#2D3032]">Recent Transaction</h2>
          <button className="flex items-center gap-2 px-5 py-2 rounded-xl border border-[#8BC34A] text-[#8BC34A] text-[13px] font-semibold hover:bg-[#F3F6E8] transition-colors">
            Export CSV <Download size={14} />
          </button>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] w-full overflow-hidden">
          <div className="w-full overflow-x-auto custom-scrollbar pb-2">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-[11px] font-bold text-gray-400 capitalize tracking-wide pb-4 px-4">Farmland ID</th>
                  <th className="text-left text-[11px] font-bold text-gray-400 capitalize tracking-wide pb-4 px-4">Date</th>
                  <th className="text-left text-[11px] font-bold text-gray-400 capitalize tracking-wide pb-4 px-4">Position</th>
                  <th className="text-left text-[11px] font-bold text-gray-400 capitalize tracking-wide pb-4 px-4">Land Value</th>
                  <th className="text-left text-[11px] font-bold text-gray-400 capitalize tracking-wide pb-4 px-4">Commission</th>
                  <th className="text-left text-[11px] font-bold text-gray-400 capitalize tracking-wide pb-4 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((trx, index) => (
                  <tr 
                    key={trx.id} 
                    className={cn(
                      "hover:bg-gray-50/50 transition-colors group",
                      index !== data.transactions.length - 1 && "border-b border-gray-50/80"
                    )}
                  >
                    <td className="py-5 px-4">
                      <span className="text-[13px] font-semibold text-[#2D3032]">{trx.farmlandId}</span>
                    </td>
                    <td className="py-5 px-4">
                      <span className="text-[13px] font-medium text-gray-500">{trx.date}</span>
                    </td>
                    <td className="py-5 px-4">
                      <span className="text-[13px] font-medium text-gray-500">{trx.position}</span>
                    </td>
                    <td className="py-5 px-4">
                      <span className="text-[13px] font-medium text-gray-500">{trx.landValue}</span>
                    </td>
                    <td className="py-5 px-4">
                      <span className="inline-flex px-3 py-1.5 bg-[#E8F5E9] text-[#2E7D32] text-[12px] font-bold rounded-lg tracking-wide">
                        {trx.commission}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      {trx.status === "Cleared" ? (
                        <div className="flex items-center gap-2 text-[#4CAF50]">
                          <Check size={14} strokeWidth={3} />
                          <span className="text-[12px] font-bold">Cleared</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-[#F57C00]">
                          <Clock size={14} strokeWidth={2.5} />
                          <span className="text-[12px] font-bold">Processing</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAgentProfile;
