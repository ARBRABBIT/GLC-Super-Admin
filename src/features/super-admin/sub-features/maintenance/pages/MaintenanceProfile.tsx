import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  SquarePen,
  LogOut,
  BadgeCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logOut, selectCurrentUser } from "@/features/auth/store/authSlice";
import { DEFAULT_MAINTENANCE_OFFICER } from "../data/maintenanceData";
import { MaintenanceLogoutModal } from "../components/MaintenanceLogoutModal";
import { MaintenanceUpdatePasswordModal } from "../components/MaintenanceUpdatePasswordModal";
import { useGetMaintenanceUserProfileQuery } from "../api/maintenanceAuthApi";

export default function MaintenanceProfile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: profileResponse } = useGetMaintenanceUserProfileQuery(currentUser?.id ?? 0, {
    skip: !currentUser?.id,
  });

  const apiProfile = profileResponse?.data;
  const firstName = apiProfile?.first_name || currentUser?.first_name || DEFAULT_MAINTENANCE_OFFICER.firstName;
  const lastName = apiProfile?.last_name || currentUser?.last_name || DEFAULT_MAINTENANCE_OFFICER.lastName;
  const displayName = `${firstName} ${lastName}`.trim() || DEFAULT_MAINTENANCE_OFFICER.name;
  const displayEmail = apiProfile?.email || currentUser?.login_id || DEFAULT_MAINTENANCE_OFFICER.email;
  const displayPhone = apiProfile?.phone_number
    ? `${apiProfile.country_code || "+91"} ${apiProfile.phone_number}`
    : DEFAULT_MAINTENANCE_OFFICER.phone;
  const displayDob = apiProfile?.dob ? apiProfile.dob.split("T")[0] : DEFAULT_MAINTENANCE_OFFICER.dateOfBirth;
  const displayRole = currentUser?.role || DEFAULT_MAINTENANCE_OFFICER.role;
  const avatarUrl = apiProfile?.profile_url || DEFAULT_MAINTENANCE_OFFICER.avatarUrl;

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/maintenance/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-['Plus_Jakarta_Sans']">
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col">
        {/* ── Top Back Button matching Figma Image 1 ──────────────────────────── */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-[#1F2937] hover:text-[#1E75BB] bg-transparent border-none cursor-pointer transition-colors p-0"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back</span>
          </button>
        </div>

        {/* ── Main Outer Rounded Card matching Figma ──────────────────────────── */}
        <div className="bg-[#F8F9FA] rounded-[32px] border border-[#E9EDF0] p-4 sm:p-6 lg:p-8 flex flex-col gap-6 shadow-2xs">
          {/* ── 1. Top Hero Profile Banner Card ───────────────────────────────── */}
          <div className="bg-white rounded-[24px] border border-[#ECEFF2] overflow-hidden shadow-xs">
            {/* Banner Image */}
            <div className="w-full h-40 sm:h-52 md:h-60 relative overflow-hidden bg-gray-100">
              <img
                src={
                  DEFAULT_MAINTENANCE_OFFICER.bannerUrl ||
                  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80"
                }
                alt="Profile banner"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Profile Avatar & Details Strip */}
            <div className="px-6 sm:px-8 pb-6 pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              {/* Left Avatar & Name */}
              <div className="flex items-end gap-4 -mt-14 sm:-mt-16">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden bg-orange-400 shadow-md shrink-0">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mb-1">
                  <h1 className="text-[20px] sm:text-[22px] font-bold text-[#111827] m-0 tracking-tight">
                    {displayName}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#64748B] font-normal m-0 mt-0.5">
                    {displayRole}
                  </p>
                </div>
              </div>

              {/* Right Blue Verified Badge matching Figma */}
              <div className="self-end sm:self-center mb-1">
                <div className="w-10 h-10 rounded-full bg-[#1E75BB] flex items-center justify-center text-white shadow-xs">
                  <BadgeCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. Personal Details Card matching Figma ────────────────────────── */}
          <div className="bg-white rounded-[24px] border border-[#ECEFF2] p-6 sm:p-7 shadow-xs flex flex-col gap-5">
            <h2 className="text-[17px] font-bold text-[#111827] m-0 tracking-tight">
              Personal details
            </h2>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* First name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1F2937]">
                  First name
                </label>
                <input
                  type="text"
                  readOnly
                  value={firstName}
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#111827] outline-hidden shadow-2xs"
                />
              </div>

              {/* Last name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1F2937]">
                  Last name
                </label>
                <input
                  type="text"
                  readOnly
                  value={lastName}
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#111827] outline-hidden shadow-2xs"
                />
              </div>

              {/* Date Of Birth */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1F2937]">
                  Date Of Birth
                </label>
                <input
                  type="text"
                  readOnly
                  value={displayDob}
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#111827] outline-hidden shadow-2xs"
                />
              </div>

              {/* Phone number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1F2937]">
                  Phone number
                </label>
                <input
                  type="text"
                  readOnly
                  value={displayPhone}
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#111827] outline-hidden shadow-2xs"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1F2937]">
                  Email
                </label>
                <input
                  type="text"
                  readOnly
                  value={displayEmail}
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#111827] outline-hidden shadow-2xs"
                />
              </div>

              {/* Password with Edit Icon */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1F2937]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value="XXXXXXXXXXX"
                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#111827] outline-hidden shadow-2xs tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1E75BB] bg-transparent border-none cursor-pointer p-1 transition-colors"
                    title="Change password"
                  >
                    <SquarePen className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3. Alerts Card matching Figma ──────────────────────────────────── */}
          <div className="bg-white rounded-[24px] border border-[#ECEFF2] p-6 sm:p-7 shadow-xs flex flex-col gap-4">
            <h2 className="text-[17px] font-bold text-[#111827] m-0 tracking-tight">
              Alerts
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-xs sm:text-sm text-[#111827] m-0">
                  Notifications
                </p>
                <p className="text-xs text-[#64748B] font-normal m-0 mt-0.5">
                  Receive updates via Notifications
                </p>
              </div>

              {/* Green Toggle Switch */}
              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors border-none ${notificationsEnabled ? "bg-[#10B981]" : "bg-gray-300"
                  }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notificationsEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                />
              </button>
            </div>
          </div>

          {/* ── 4. Logout Card matching Figma ──────────────────────────────────── */}
          <div className="bg-white rounded-[24px] border border-[#ECEFF2] p-6 sm:p-7 shadow-xs flex items-center justify-between">
            <span className="font-bold text-xs sm:text-sm text-[#111827]">
              Want to logout?
            </span>

            <button
              type="button"
              onClick={() => setLogoutModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF1F2] hover:bg-[#FEE2E2] text-[#EF4444] border border-[#FECDD3] rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
              Logout
            </button>
          </div>
        </div>
      </main>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}
      <MaintenanceLogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      <MaintenanceUpdatePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
}
