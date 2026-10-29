import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminNotificationsDropdown from "@/features/super-admin/components/SuperAdminNotificationsDropdown";

interface UploadProfileAvatarProps {
  className?: string;
  style?: React.CSSProperties;
  avatarUrl?: string;
  onNotificationsClick?: () => void;
}

export const UploadProfileAvatar: React.FC<UploadProfileAvatarProps> = ({
  className = "",
  style,
  avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  onNotificationsClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleBellClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className={`flex flex-row items-center p-0 select-none gap-[clamp(0.44rem,_0.91vw,_1.09rem)] w-[clamp(3.9rem,_8.13vw,_9.75rem)] h-[clamp(1.73rem,_3.61vw,_4.33rem)] relative ${className}`}
      style={style}
    >
      {/* ── Bell / Notifications Button (Frame 1171277098) ── */}
      <button
        type="button"
        onClick={handleBellClick}
        className="flex items-center justify-center bg-white rounded-[40px] border-none cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0px_0px_4px_rgba(0,0,0,0.12)] shrink-0 w-[clamp(1.73rem,_3.61vw,_4.33rem)] h-[clamp(1.73rem,_3.61vw,_4.33rem)] p-2"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[24px] h-[24px] relative"
        >
          {/* Bell outline matching figma (Feather-like bell shape with bottom flare) */}
          <path
            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
            stroke="#2C2C2C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bell clapper */}
          <path
            d="M13.73 21a2 2 0 0 1-3.46 0"
            stroke="#2C2C2C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Red notification dot */}
          <circle cx="17.5" cy="4.5" r="2.5" fill="#EF4646" />
        </svg>
      </button>

      {/* ── Profile Avatar Container (Frame 2147239617) ── */}
      <div
        onClick={() => navigate("/super-admin/profile")}
        className="bg-white rounded-full overflow-hidden flex items-center justify-center shadow-[0px_0px_4px_rgba(0,0,0,0.12)] shrink-0 w-[clamp(1.73rem,_3.61vw,_4.33rem)] h-[clamp(1.73rem,_3.61vw,_4.33rem)] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
      >
        <img
          src={avatarUrl}
          alt="Profile Avatar"
          className="w-full h-full rounded-full object-cover"
        />
      </div>

      {/* ── Notifications Dropdown ── */}
      <SuperAdminNotificationsDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default UploadProfileAvatar;
