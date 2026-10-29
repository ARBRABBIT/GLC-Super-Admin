import React from "react";
import { LogOut } from "lucide-react";

interface MaintenanceLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const MaintenanceLogoutModal: React.FC<MaintenanceLogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-[28px] max-w-[380px] w-full p-8 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        {/* Pink/Red Circle Icon matching Figma Image 2 */}
        <div className="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#EF4444] mb-4 shadow-2xs">
          <LogOut className="w-6 h-6 stroke-[2.2] translate-x-0.5" />
        </div>

        {/* Title */}
        <h3 className="text-[19px] sm:text-[20px] font-bold text-[#111827] m-0 mb-2 tracking-tight">
          Confirm Logout
        </h3>

        {/* Subtitle */}
        <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed m-0 mb-6 font-normal max-w-[260px]">
          Are you sure you want to logout from Your Dashboard?
        </p>

        {/* Action Buttons matching Figma */}
        <div className="flex items-center justify-center gap-4 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-[#64748B] hover:text-[#111827] hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-8 py-2.5 rounded-full border border-[#1E75BB] bg-white hover:bg-[#1E75BB] text-[#1E75BB] hover:text-white font-bold text-xs cursor-pointer transition-all shadow-2xs"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
