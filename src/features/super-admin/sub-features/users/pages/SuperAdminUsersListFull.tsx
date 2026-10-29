import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Monitor, Smartphone, Crown, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import SuperAdminHeader from "@/features/super-admin/components/SuperAdminHeader";
import VisitorSalesCard from "@/features/super-admin/sub-features/dashboard/components/VisitorSalesCard";
import FarmlandStatsCard from "@/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";
import { SIMPLE_MODE } from "@/core/config/featureFlags";
import { cn } from "@/lib/utils";

const SuperAdminUsersListFull: React.FC = () => {
  const data = mockDashboardData;
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredUsers = data.usersList.filter((user) => {
    // Status / Type filter
    if (filter === "NRI" && user.type !== "NRI") return false;
    if (filter === "Local" && user.type !== "Local") return false;
    if (filter === "Subscribed" && !user.isSubscribed) return false;
    if (filter === "Non-Subscribed" && user.isSubscribed) return false;

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchName = user.name.toLowerCase().includes(q);
      const matchEmail = user.email.toLowerCase().includes(q);
      const matchType = user.type.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchType) return false;
    }

    return true;
  });

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      {/* ── Header Section (hidden in SIMPLE_MODE) ── */}
      {!SIMPLE_MODE && (
        <div className="shrink-0">
          <SuperAdminHeader
            title="SUPER ADMIN"
            breadcrumb="Assigned Farmlands"
          >
            <div className="flex items-start justify-between gap-4 mt-4 w-full h-full relative z-10">
              <div className="mt-4">
                <VisitorSalesCard
                  visitors={data.visitors}
                  totalSales={data.totalSales}
                />
              </div>
              <div className="mt-auto mb-6">
                <FarmlandStatsCard stats={data.farmlandStats} />
              </div>
            </div>
          </SuperAdminHeader>
        </div>
      )}

      {/* ── Users Section ── */}
      <div className="mt-6 flex flex-col gap-6">
        {/* Title Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-[1.5rem] lg:text-[1.75rem] font-bold text-[var(--text-primary)] font-['Plus_Jakarta_Sans'] tracking-tight">
              Users
            </h2>
            <p className="text-[0.875rem] text-[var(--text-muted)] font-medium font-inter">
              Managed dossiers from premium agents
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        {!SIMPLE_MODE && (
          <div className="flex flex-col xl:flex-row gap-4 justify-between xl:items-center">
            <div className="w-full xl:w-[320px]">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                icon={<Search size={18} className="text-gray-400" />}
                className="rounded-full bg-white border-gray-200 font-inter text-sm"
                wrapperClassName="h-10"
              />
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs font-inter"
              >
                <span>{filter}</span>
                <ChevronDown size={14} className={cn("text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
              </button>
              
              {isOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-gray-100 p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150">
                  {["All", "NRI", "Local", "Subscribed", "Non-Subscribed"].map((option) => {
                    const isSelected = filter === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setFilter(option);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3.5 py-2 text-xs font-medium rounded-xl cursor-pointer flex items-center justify-between transition-colors font-inter",
                          isSelected
                            ? "bg-[#F4F9EF] text-[#2D3319] font-bold"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <span>{option}</span>
                        {isSelected && <Check size={13} strokeWidth={2.5} className="text-[#2D3319]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="w-full overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-xs">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-[#FAFAFA]/80">
                <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                  User
                </th>
                <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                  Residency
                </th>
                <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                  Subscription
                </th>
                <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                  Tier
                </th>
                <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter">
                  Source
                </th>
                <th className="font-semibold text-xs text-[var(--text-muted)] py-4 px-6 uppercase tracking-wider font-inter text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-inter text-sm">
                    No users match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70 transition-colors"
                  >
                    {/* User Info: Avatar + Name + Email */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user.name
                              )}&background=random`;
                            }}
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-sm text-[var(--text-primary)] font-['Plus_Jakarta_Sans']">
                            {user.name}
                          </span>
                          <span className="text-[12px] text-[var(--text-muted)] font-inter">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Residency Type Badge */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium font-inter bg-[#F3F4F6] text-[#4B5563]">
                        {user.type}
                      </span>
                    </td>

                    {/* Subscription Status */}
                    <td className="py-4 px-6">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase font-inter",
                          user.isSubscribed
                            ? "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]"
                            : "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            user.isSubscribed ? "bg-[#16A34A]" : "bg-[#DC2626]"
                          )}
                        />
                        {user.isSubscribed ? "Subscribed" : "Non-Subscribed"}
                      </span>
                    </td>

                    {/* Tier with Crown */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-xs border border-gray-100">
                          <Crown
                            size={13}
                            className={cn(
                              "fill-current",
                              user.tier === "gold" && "text-[#D4AF37]",
                              user.tier === "silver" && "text-[#6B7280]",
                              user.tier === "bronze" && "text-[#92400E]"
                            )}
                          />
                        </div>
                        <span className="text-xs font-semibold capitalize text-[var(--text-primary)] font-inter">
                          {user.tier}
                        </span>
                      </div>
                    </td>

                    {/* Source Device */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-inter font-medium">
                        {user.source === "Website" ? (
                          <Monitor size={15} className="text-gray-400 shrink-0" />
                        ) : (
                          <Smartphone size={15} className="text-gray-400 shrink-0" />
                        )}
                        <span>{user.source}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => navigate(`/super-admin/user-profile/${user.id}`)}
                        className="px-4 py-1.5 rounded-full border border-gray-300 bg-white text-[var(--text-primary)] hover:bg-[#2D3032] hover:text-white hover:border-[#2D3032] transition-colors font-inter font-medium text-xs whitespace-nowrap cursor-pointer shadow-xs inline-flex items-center gap-1"
                      >
                        View Profile
                        <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminUsersListFull;
