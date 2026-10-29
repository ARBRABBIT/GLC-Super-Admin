import React from 'react';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // We can pass the user object here to populate some details
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-[600px] overflow-hidden shadow-2xl flex flex-col font-sans relative">
        
        {/* Header Section */}
        <div className="p-8 pb-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=150&h=150&fit=crop" alt="Farm" className="w-[60px] h-[60px] rounded-full object-cover shadow-sm" />
            <div className="flex flex-col">
              <span className="font-bold text-[18px] text-gray-900">Farm ID : GLCSOS 01</span>
              <span className="text-sm text-gray-500 font-medium">West Godaveri, A.P.</span>
            </div>
          </div>
          <div className="bg-[#F0FDF4] px-4 py-1.5 rounded-full flex items-center gap-2 border border-[#8BC34A]/30">
            <div className="w-2 h-2 rounded-full bg-[#8BC34A]" />
            <span className="text-xs font-bold text-gray-800">Active Deal</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-4 px-8 py-5 border-b border-gray-100">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">DATE INITIATED</span>
            <span className="text-[13px] font-medium text-gray-800">Oct 24, 2025</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">LAST UPDATE</span>
            <span className="text-[13px] font-medium text-gray-800">10:45 AM</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">STATUS</span>
            <span className="text-[13px] font-medium text-gray-800">Pending</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">SUBSCRIPTION</span>
            <span className="text-[13px] font-medium text-gray-800">Available</span>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="p-8 py-6 relative">
          <div className="absolute left-[39px] top-[24px] bottom-[24px] w-px bg-gray-300 border-l border-dashed border-gray-400" />
          
          <div className="flex flex-col gap-8">
            <div className="relative flex gap-6">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-[#8BC34A] mt-1 relative z-10" />
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#8BC34A] text-[14px]">Action : Property Information Shared</span>
                  <span className="text-[12px] text-gray-400 font-medium">Oct 25, 04:10 PM</span>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed pr-8">
                  Detailed brochure, pricing, land use details and investment highlights were shared with the user.
                </p>
              </div>
            </div>

            <div className="relative flex gap-6">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-[#8BC34A] mt-1 relative z-10" />
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#8BC34A] text-[14px]">Action : User not responded to CCS Team</span>
                  <span className="text-[12px] text-gray-400 font-medium">Oct 26, 11:00AM</span>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed pr-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>

            <div className="relative flex gap-6">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-[#8BC34A] mt-1 relative z-10" />
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#8BC34A] text-[14px]">Action : Follow-up Discussion</span>
                  <span className="text-[12px] text-gray-400 font-medium">Oct 27, 12:30 PM</span>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed pr-8">
                  CCS team had a follow-up conversation to understand the user's requirements and investment goals.
                </p>
              </div>
            </div>

            <div className="relative flex gap-6">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-[#8BC34A] mt-1 relative z-10" />
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#8BC34A] text-[14px]">Action : User Confirmed Interest</span>
                  <span className="text-[12px] text-gray-400 font-medium">Oct 29, 09:45 AM</span>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed pr-8">
                  The user confirmed continued interest and requested to visit the property.
                </p>
              </div>
            </div>

            <div className="relative flex gap-6">
              <div className="w-4 h-4 rounded-full bg-[#8BC34A] border-4 border-[#E8F5E9] mt-1 relative z-10" />
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#8BC34A] text-[14px]">Action : Site Visit Scheduled (Current)</span>
                  <span className="text-[12px] text-gray-400 font-medium">Nov 01, 10:45 AM</span>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed pr-8">
                  Site visit has been scheduled as per the user's availability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="bg-gray-50 p-8 py-6 border-t border-b border-gray-100 flex gap-4">
          <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="User" className="w-[50px] h-[50px] rounded-full object-cover" />
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 flex-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-medium">User Name</span>
              <span className="text-[13px] font-bold text-gray-900">{user?.name || 'Kishore Moore'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-medium">Mobile Numbner</span>
              <span className="text-[13px] font-bold text-gray-900">{user?.phone || '+91 912 345 6789'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-medium">Direct Contact</span>
              <span className="text-[13px] font-bold text-gray-900">K.Moore@greenlandcap.com</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-medium">Subscription Plan</span>
              <span className="text-[13px] font-bold text-gray-900">Silver Tier</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 py-5 flex justify-between items-center bg-white">
          <span className="font-bold text-[16px] text-gray-500">Comments Details</span>
          <button 
            onClick={onClose}
            className="bg-[#2A3125] text-white font-semibold px-8 py-2.5 rounded-xl hover:bg-black transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
