import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown } from "lucide-react";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";

const SuperAdminTopPerformers: React.FC=() => {
  const navigate=useNavigate();
  const performers=mockDashboardData.topPerformersDetailed;

  // Ranks 1, 2, 3
  const rank1 = performers.find(p => p.rank === 1);
  const rank2 = performers.find(p => p.rank === 2);
  const rank3 = performers.find(p => p.rank === 3);

  // Remaining for table
  const tablePerformers=performers.filter(p => (p.rank ?? 0) > 3).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

  return (
    <div className="box-border min-h-screen bg-[#F6F7F6] p-[clamp(16px,2vw,32px)] overflow-auto custom-scrollbar flex flex-col gap-6">
      {/* Back Button */}
      <div className="w-full max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Go back to dashboard
        </button>
      </div>

      {/* Podium Card */}
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm max-w-5xl mx-auto w-full flex justify-center items-end min-h-[400px]">
        <div className="flex items-end justify-center gap-2 sm:gap-6 md:gap-12 w-full max-w-3xl">
          
          {/* Rank 2 (Silver) */}
          {rank2 && (
            <div 
              onClick={() => navigate(`/super-admin/agent-profile/${rank2.id}`)}
              className="flex flex-col items-center flex-1 max-w-[200px] cursor-pointer group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Crown size={16} className="text-gray-400 group-hover:text-[#8BC34A] transition-colors" />
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[16px] overflow-hidden mb-3 border border-gray-200 group-hover:border-[#8BC34A] transition-colors">
                  <img src={rank2.avatar} alt={rank2.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-[14px] sm:text-[16px] text-center text-[#2D3032] whitespace-nowrap group-hover:text-[#8BC34A] transition-colors">{rank2.name}</span>
                <span className="text-[10px] sm:text-[12px] text-gray-400">Agent</span>
              </div>
              <div className="w-full bg-gradient-to-b from-gray-100 to-gray-50 h-[120px] rounded-t-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_-2px_10px_rgba(0,0,0,0.05)] border-t border-x border-gray-200 relative pt-4 px-2 sm:px-4">
                <div className="flex justify-between w-full mb-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 tracking-widest uppercase">Farms</span>
                    <span className="text-[12px] sm:text-[14px] font-bold text-[#2D3032]">{rank2.farms}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 tracking-widest uppercase">Sales</span>
                    <span className="text-[12px] sm:text-[14px] font-bold text-[#2D3032]">{rank2.sales}</span>
                  </div>
                </div>
                <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-500 w-[60%]"></div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          {rank1 && (
            <div 
              onClick={() => navigate(`/super-admin/agent-profile/${rank1.id}`)}
              className="flex flex-col items-center flex-1 max-w-[200px] -mt-10 z-10 cursor-pointer group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FFF8E1] flex items-center justify-center mb-4 border border-[#FFECB3] shadow-sm">
                  <Crown size={20} className="text-[#F57F17]" />
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] overflow-hidden mb-3 border-2 border-[#FFE082] shadow-md group-hover:border-[#F57F17] transition-colors">
                  <img src={rank1.avatar} alt={rank1.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-[16px] sm:text-[18px] text-center text-[#2D3032] whitespace-nowrap group-hover:text-[#F57F17] transition-colors">{rank1.name}</span>
                <span className="text-[12px] text-gray-400">Agent</span>
              </div>
              <div className="w-full bg-gradient-to-b from-gray-100 to-gray-50 h-[160px] rounded-t-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_-4px_15px_rgba(0,0,0,0.1)] border-t border-x border-gray-200 relative pt-6 px-3 sm:px-5">
                <div className="flex justify-between w-full mb-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] sm:text-[11px] font-bold text-gray-400 tracking-widest uppercase">Farms</span>
                    <span className="text-[14px] sm:text-[16px] font-bold text-[#2D3032]">{rank1.farms}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] sm:text-[11px] font-bold text-gray-400 tracking-widest uppercase">Sales</span>
                    <span className="text-[14px] sm:text-[16px] font-bold text-[#2D3032]">{rank1.sales}</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F57F17] w-[85%]"></div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {rank3 && (
            <div 
              onClick={() => navigate(`/super-admin/agent-profile/${rank3.id}`)}
              className="flex flex-col items-center flex-1 max-w-[200px] cursor-pointer group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-8 h-8 rounded-full bg-[#FBE9E7] flex items-center justify-center mb-4">
                  <Crown size={16} className="text-[#D84315]" />
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[16px] overflow-hidden mb-3 border border-[#FFAB91] group-hover:border-[#D84315] transition-colors">
                  <img src={rank3.avatar} alt={rank3.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-[14px] sm:text-[16px] text-center text-[#2D3032] whitespace-nowrap group-hover:text-[#D84315] transition-colors">{rank3.name}</span>
                <span className="text-[10px] sm:text-[12px] text-gray-400">Agent</span>
              </div>
              <div className="w-full bg-gradient-to-b from-gray-100 to-gray-50 h-[100px] rounded-t-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_-2px_10px_rgba(0,0,0,0.05)] border-t border-x border-gray-200 relative pt-3 px-2 sm:px-4">
                <div className="flex justify-between w-full mb-3">
                  <div className="flex flex-col">
                    <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 tracking-widest uppercase">Farms</span>
                    <span className="text-[12px] sm:text-[14px] font-bold text-[#2D3032]">{rank3.farms}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 tracking-widest uppercase">Sales</span>
                    <span className="text-[12px] sm:text-[14px] font-bold text-[#2D3032]">{rank3.sales}</span>
                  </div>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D84315] w-[45%]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm max-w-5xl mx-auto w-full">
        <h2 className="text-[14px] font-bold text-[#2D3032] mb-6">Championship Standings</h2>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-4">Rank</th>
                <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-4">Agent</th>
                <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-4">Farmlands</th>
                <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-4">Sale Reports</th>
                <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {tablePerformers.map((performer) => (
                <tr key={performer.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 text-[13px] font-semibold text-[#2D3032] w-16">{performer.rank}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img src={performer.avatar} alt={performer.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-[13px] font-medium text-[#2D3032]">{performer.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-[13px] text-gray-500">{performer.farms}</td>
                  <td className="py-4 text-[13px] text-gray-500">{performer.saleReports}</td>
                  <td className="py-4">
                    <button 
                      onClick={() => navigate(`/super-admin/agent-profile/${performer.id}`)}
                      className="px-4 py-1.5 rounded-full border border-[#8BC34A] text-[#8BC34A] text-[12px] font-medium hover:bg-[#8BC34A] hover:text-white transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8 text-[12px] font-medium text-gray-500">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">&lt;</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#8BC34A] text-white">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">3</button>
          <span className="px-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">8</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminTopPerformers;
