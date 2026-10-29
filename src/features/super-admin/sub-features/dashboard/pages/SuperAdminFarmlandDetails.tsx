import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, X } from "lucide-react";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";
import { FollowUpModal } from '@/features/super-admin/components/FollowUpModal';
import { S3Image } from '@/components/common/S3Image';

const SuperAdminFarmlandDetails: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Agent" | "Website">("Website");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saleReason, setSaleReason] = useState("");
  const [selectedFollowUpUser, setSelectedFollowUpUser] = useState<any>(null);
  
  // Use mock data
  const data = mockDashboardData.farmlandSpecificDetails;

  return (
    <div className="box-border min-h-screen bg-[#F6F7F6] p-[clamp(16px,2vw,32px)] overflow-auto custom-scrollbar flex flex-col gap-6 relative">
      
      {/* Mark as Sold Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col mx-4 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-semibold text-[#2D3032] mb-1">
                Mark {data.id} as Sold
              </h3>
              <p className="text-sm text-gray-500 pr-6">
                This action will update the property status to 'Sold' and archive active listings.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                  <S3Image src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop" fallbackType="cover" alt="Farmland" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#2D3032]">{data.id}</span>
                  <span className="text-[12px] text-gray-500">{data.location}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[13px] font-medium text-[#2D3032]">Sale reason</span>
                <div className="grid grid-cols-2 gap-3">
                  {["Sold via Website", "Sold via Agent", "Sold Outside Platform", "Other"].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setSaleReason(reason)}
                      className={`py-2 px-3 rounded-xl text-[12px] font-medium transition-all border ${
                        saleReason === reason 
                          ? "bg-[#F3F6E8] border-[#8BC34A] text-[#3E421B]" 
                          : "bg-[#F9FAFB] border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-xl border border-[#8BC34A] text-[#8BC34A] text-sm font-medium hover:bg-[#F3F6E8] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Handle confirm logic here
                  setIsModalOpen(false);
                }}
                className="px-6 py-2 rounded-xl bg-[#3E421B] text-white text-sm font-medium hover:bg-[#2D3012] transition-colors"
              >
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-wrap justify-between items-center w-full max-w-5xl mx-auto gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-[#2D3032] hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Go back to dashboard
        </button>

        <div className="flex items-center bg-white rounded-full p-1 border border-gray-100 shadow-sm">
          <button
            onClick={() => setActiveTab("Agent")}
            className={`px-8 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              activeTab === "Agent" ? "bg-[#2D3012] text-white" : "text-gray-500 hover:text-[#2D3032]"
            }`}
          >
            Agent
          </button>
          <button
            onClick={() => setActiveTab("Website")}
            className={`px-8 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              activeTab === "Website" ? "bg-[#2D3012] text-white" : "text-gray-500 hover:text-[#2D3032]"
            }`}
          >
            Website
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] max-w-5xl mx-auto w-full flex flex-col">
        
        {/* Hero Section */}
        <div className="flex flex-wrap items-start justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
              <S3Image src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop" fallbackType="cover" alt="Farmland" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-[#2D3032]">Farmland ID: {data.id}</h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8BC34A]"></span>
                  <span className="text-[12px] text-gray-500">{data.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[13px] text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {data.location}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"></path><path d="M4 12h16"></path><path d="M12 4v16"></path></svg>
                  {data.area}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-8 md:gap-12">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Visitors</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#2D3032]">{data.totalVisitors}</span>
                <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-1.5 py-0.5 rounded-sm">{data.visitorsGrowth}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Documentation Unlocked</span>
              <span className="text-xl font-bold text-[#2D3032]">{data.documentationUnlocked}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Purchase Request</span>
              <span className="text-xl font-bold text-[#2D3032]">{String(data.purchaseRequests).padStart(2, '0')}</span>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-[#3E421B] text-white text-sm font-semibold hover:bg-[#2D3012] transition-colors ml-4"
            >
              Mark as Sold
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 mb-10"></div>

        {/* Momentum Timeline */}
        <div className="w-full mb-12">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#8BC34A]"></span>
                <span className="text-[13px] font-medium text-[#8BC34A]">Live on website</span>
              </div>
              <h2 className="text-[15px] font-bold text-[#2D3032]">Momentum Timeline</h2>
              <p className="text-[12px] text-gray-400">Aggregate activity velocity over last {activeTab === "Website" ? "14" : "20"} days</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#3E421B]"></span>
                <span className="text-[11px] font-semibold text-gray-500">Unlocks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#C5E1A5]"></span>
                <span className="text-[11px] font-semibold text-gray-500">Enquiries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#E0E0E0]"></span>
                <span className="text-[11px] font-semibold text-gray-500">Visits</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[140px] flex items-end gap-1.5 sm:gap-2 border-b border-gray-200 pb-2 relative">
            {data.momentumTimeline.map((point, idx) => {
              // Calculate percentage heights based on a max total of 200 for scale
              const maxScale = 200;
              const visitPct = (point.visits / maxScale) * 100;
              const enqPct = (point.enquiries / maxScale) * 100;
              const unlockPct = (point.unlocks / maxScale) * 100;
              
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full gap-0.5 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                    V: {point.visits} | E: {point.enquiries} | U: {point.unlocks}
                  </div>
                  {/* Unlocks */}
                  {point.unlocks > 0 && <div className="w-full bg-[#3E421B] rounded-t-sm" style={{ height: `${unlockPct}%` }}></div>}
                  {/* Enquiries */}
                  {point.enquiries > 0 && <div className="w-full bg-[#C5E1A5] rounded-t-sm" style={{ height: `${enqPct}%` }}></div>}
                  {/* Visits */}
                  {point.visits > 0 && <div className="w-full bg-[#E0E0E0] rounded-t-sm" style={{ height: `${visitPct}%` }}></div>}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between w-full mt-2">
            <span className="text-[11px] font-medium text-gray-400">{activeTab === "Website" ? "14 Days Ago" : "20 Days Ago"}</span>
            <span className="text-[11px] font-medium text-gray-400">Today</span>
          </div>
        </div>

        {/* Conversion Command Table */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[15px] font-bold text-[#2D3032]">Conversion Command</h2>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-[#8BC34A] text-[#8BC34A] text-[12px] font-semibold hover:bg-[#8BC34A] hover:text-white transition-colors">
              Export CSV <Download size={14} />
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-[10px] font-bold text-[#78909C] uppercase tracking-wider pb-3">USER</th>
                  <th className="text-left text-[10px] font-bold text-[#78909C] uppercase tracking-wider pb-3">STAGE</th>
                  <th className="text-left text-[10px] font-bold text-[#78909C] uppercase tracking-wider pb-3">PHONE</th>
                  <th className="text-left text-[10px] font-bold text-[#78909C] uppercase tracking-wider pb-3">QUERY</th>
                  <th className="text-left text-[10px] font-bold text-[#78909C] uppercase tracking-wider pb-3">ACTIONS</th>
                  <th className="text-left text-[10px] font-bold text-[#78909C] uppercase tracking-wider pb-3">FOLLOW UPS</th>
                  <th className="text-left text-[10px] font-bold text-[#78909C] uppercase tracking-wider pb-3">SUBBSCRIPTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.conversionCommandUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 pr-4 cursor-pointer" onClick={() => navigate(`/super-admin/user-profile/${user.id}`)}>
                      <div className="flex items-center gap-3">
                        <S3Image src={user.avatar} fallbackType="avatar" alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-[13px] font-semibold text-[#2D3032] group-hover:text-[#8BC34A] transition-colors">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${user.stageColor}`}>
                        {user.stage}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-[12px] font-medium text-gray-500">{user.phone}</td>
                    <td className="py-4 pr-4 text-[12px] font-medium text-gray-500">{user.query}</td>
                    <td className="py-4 pr-4 text-[12px] font-medium text-gray-500">{user.actions}</td>
                    <td className="py-4 pr-4 text-[12px] font-medium cursor-pointer" onClick={() => setSelectedFollowUpUser(user)}>
                      {user.commentsHighlight ? (
                        <span className="text-[#8BC34A] underline decoration-[#8BC34A] underline-offset-4">{user.commentsHighlight}</span>
                      ) : (
                        <span className="text-[#8BC34A] underline decoration-[#8BC34A] underline-offset-4">{user.comments || "Active Deal"}</span>
                      )}
                    </td>
                    <td className="py-4 text-[12px] font-medium text-gray-500">{user.subscriptions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      {/* Follow Up Modal */}
      <FollowUpModal 
        isOpen={!!selectedFollowUpUser} 
        onClose={() => setSelectedFollowUpUser(null)} 
        user={selectedFollowUpUser} 
      />
    </div>
  );
};

export default SuperAdminFarmlandDetails;
