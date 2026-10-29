import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, LayoutDashboard, User } from "lucide-react";
import GlcLogo from "@/assets/glc-logo.svg";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logOut, selectCurrentUser } from "@/features/auth/store/authSlice";
import { DEFAULT_MAINTENANCE_OFFICER } from "../data/maintenanceData";

interface MaintenanceNavbarProps {
  activeTab?: "dashboard" | "service-requests" | "work-orders";
}

export const MaintenanceNavbar: React.FC<MaintenanceNavbarProps> = ({ activeTab = "dashboard" }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector(selectCurrentUser);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const officerName = user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : DEFAULT_MAINTENANCE_OFFICER.name;
  const officerEmail = user?.login_id || DEFAULT_MAINTENANCE_OFFICER.email;
  const officerRole = user?.role || DEFAULT_MAINTENANCE_OFFICER.role;

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/maintenance/login", { replace: true });
  };

  const currentTab =
    activeTab ||
    (location.pathname.includes("service-requests")
      ? "service-requests"
      : location.pathname.includes("work-orders")
        ? "work-orders"
        : "dashboard");

  const isPreview = location.pathname.includes("/preview");
  const isSuperAdmin = location.pathname.includes("/super-admin/maintenance");
  const basePath = isPreview
    ? "/maintenance/preview"
    : isSuperAdmin
    ? "/super-admin/maintenance"
    : "/maintenance";

  return (
    <header className="w-full bg-white border-b border-[#EAEAEA] sticky top-0 z-40 px-6 sm:px-8 lg:px-10 xl:px-12 py-3.5 flex items-center justify-between shadow-xs">
      {/* ── Left: Logo ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link to={`${basePath}/dashboard`} className="flex items-center gap-3 no-underline group">
          <img src={GlcLogo} alt="Green Land Capital" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          <div className="hidden sm:flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] leading-tight text-[#1A1C1D] tracking-tight">
              GREEN LAND CAPITAL
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] text-[#7A8699] font-medium tracking-wider uppercase">
              Soul of Soil
            </span>
          </div>
        </Link>
      </div>

      {/* ── Center: Navigation Tabs ─────────────────────────────────────────── */}
      <nav className="flex items-center gap-1 sm:gap-3">
        <Link
          to={`${basePath}/dashboard`}
          className={`px-5 py-2 rounded-full font-['Plus_Jakarta_Sans'] text-[13px] font-semibold transition-all duration-200 no-underline ${currentTab === "dashboard"
              ? "bg-[#1E75BB] text-white shadow-xs"
              : "text-[#4B5563] hover:text-[#1A1C1D] hover:bg-gray-100/50"
            }`}
        >
          Dashboard
        </Link>
        <Link
          to={`${basePath}/service-requests`}
          className={`px-5 py-2 rounded-full font-['Plus_Jakarta_Sans'] text-[13px] font-semibold transition-all duration-200 no-underline ${currentTab === "service-requests"
              ? "bg-[#1E75BB] text-white shadow-xs"
              : "text-[#4B5563] hover:text-[#1A1C1D] hover:bg-gray-100/50"
            }`}
        >
          Service Requests
        </Link>
        <Link
          to={`${basePath}/work-orders`}
          className={`px-5 py-2 rounded-full font-['Plus_Jakarta_Sans'] text-[13px] font-semibold transition-all duration-200 no-underline ${currentTab === "work-orders"
              ? "bg-[#1E75BB] text-white shadow-xs"
              : "text-[#4B5563] hover:text-[#1A1C1D] hover:bg-gray-100/50"
            }`}
        >
          Work Orders
        </Link>
      </nav>

      {/* ── Right: Notifications & Profile ───────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="w-10 h-10 rounded-full border border-[#E5E7EB] bg-white hover:bg-gray-50 flex items-center justify-center cursor-pointer transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-[18px] h-[18px] text-[#4B5563]" />
            {DEFAULT_MAINTENANCE_OFFICER.unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
            )}
          </button>

          {/* Notification Popover */}
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 pb-2">
                <span className="font-semibold text-xs text-gray-900">Notifications</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">3 new</span>
              </div>
              <div className="py-2 flex flex-col gap-2">
                <div className="p-2 rounded-lg hover:bg-gray-50 text-xs text-gray-700 cursor-pointer">
                  <p className="font-medium text-gray-900">New Service Request #SR-409</p>
                  <p className="text-gray-500 text-[11px]">Farmhouse 01 electrical maintenance required</p>
                  <span className="text-[10px] text-gray-400">10m ago</span>
                </div>
                <div className="p-2 rounded-lg hover:bg-gray-50 text-xs text-gray-700 cursor-pointer">
                  <p className="font-medium text-gray-900">Work Order Completed #WO-182</p>
                  <p className="text-gray-500 text-[11px]">Borewell motor replacement approved</p>
                  <span className="text-[10px] text-gray-400">1h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-300 ring-2 ring-orange-100">
              <img
                src={DEFAULT_MAINTENANCE_OFFICER.avatarUrl}
                alt={DEFAULT_MAINTENANCE_OFFICER.name}
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">{officerName}</p>
                <p className="text-[11px] text-gray-500">{officerEmail}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  {officerRole}
                </span>
              </div>
              <div className="py-1">
                <Link
                  to="/maintenance/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg no-underline"
                >
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  My Profile
                </Link>
                {user?.role === "SADMIN" && (
                  <Link
                    to="/super-admin/dashboard"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg no-underline"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-gray-500" />
                    Super Admin Portal
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg border-none bg-transparent cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
