import * as Icons from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { type NavItem } from "@/core/config/layoutConfig";

interface SidebarProps {
  navItems?: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navItems = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="w-[76px] bg-[#191B1C] rounded-[24px] flex flex-col justify-between p-3.5 box-border shrink-0 ml-4 mt-4 mb-4 h-[calc(100vh-32px)]">
      {/* TOP */}
      <div className="flex flex-col gap-9 w-full items-center">
        {/* Logo */}
        <div className="w-12 h-12 bg-[#0F1011] rounded-2xl flex justify-center items-center shrink-0 overflow-hidden">
          <img src="/logo.svg" alt="logo" className="w-[60%] h-[60%] object-contain" />
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-3 items-center w-full">
          {navItems.map(({ icon, iconImg, label, path }) => {
            const IconComponent = icon ? (Icons as any)[icon] || Icons.HelpCircle : Icons.HelpCircle;
            return (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                title={label}
                className={({ isActive }) =>
                  `w-12 h-12 rounded-xl flex justify-center items-center cursor-pointer shrink-0 transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2D3032] text-white'
                      : 'text-[#8E9093] hover:bg-[#252729] hover:text-white'
                  }`
                }
              >
                {iconImg ? (
                  <img
                    src={iconImg}
                    alt={label}
                    className="w-[22px] h-[22px] opacity-80"
                    style={{ filter: 'brightness(0) invert(0.7)' }}
                  />
                ) : (
                  <IconComponent
                    size={22}
                    strokeWidth={1.5}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col gap-4 items-center w-full">
        {/* Logout */}
        <div
          data-logout="true"
          onClick={() => navigate('/super-admin/login')}
          className="w-12 h-12 rounded-xl flex justify-center items-center cursor-pointer shrink-0 transition-all duration-200 text-[#8E9093] hover:bg-[#252729] hover:text-white"
          title="Logout"
        >
          <Icons.LogOut
            size={22}
            strokeWidth={1.5}
          />
        </div>

        {/* Profile avatar */}
        <div
          onClick={() => navigate("/super-admin/profile")}
          className="w-12 h-12 rounded-xl bg-[#252729] flex justify-center items-center shrink-0 cursor-pointer hover:bg-[#2D3032] transition-colors"
          title="Profile"
        >
          <Icons.User size={22} className="text-[#8E9093]" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
