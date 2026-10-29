import React, { useState } from "react";
import { LayoutGrid, Search, Bell } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import SuperAdminNotificationsDropdown from "./SuperAdminNotificationsDropdown";

// ─── Reusable Super Admin Header ─────────────────────────────────────────────
// Use this component across ALL Super Admin screens.
// Pass different title/breadcrumb/heroImage for each screen.
//
// Usage:
//   <SuperAdminHeader title="SUPER ADMIN" breadcrumb="Dashboard" />
//   <SuperAdminHeader title="SUPER ADMIN" breadcrumb="Users" showSearch={false} />
// ─────────────────────────────────────────────────────────────────────────────

export interface SuperAdminHeaderProps {
  /** Main title displayed in the header, e.g. "SUPER ADMIN" */
  title: string;
  /** Subtitle text below the title */
  subtitle?: string;
  /** Breadcrumb label, e.g. "Dashboard" */
  breadcrumb?: string;
  /** Custom icon for the breadcrumb — defaults to LayoutGrid */
  breadcrumbIcon?: React.ReactNode;
  /** Whether to show the search bar — defaults to true */
  showSearch?: boolean;
  /** Whether to show the notification bell — defaults to true */
  showNotification?: boolean;
  /** Callback when search input changes */
  onSearch?: (query: string) => void;
  /** Optional content to render on the right side of the header */
  rightContent?: React.ReactNode;
  /** Optional hero illustration URL (renders on the right of the header) */
  heroImage?: string;
  /** Slot for extra content inside the header (below title) */
  children?: React.ReactNode;
  /** Additional className for the container */
  className?: string;
}

const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({
  title,
  subtitle = "Next-generation platform infrastructure for scaling sustainable estates.",
  breadcrumb = "Dashboard",
  breadcrumbIcon,
  showSearch = true,
  showNotification = true,
  onSearch,
  rightContent,
  heroImage = "/super-admin/412454830_4ab87760-e674-4c28-80e0-4ba647ad5166 1.svg",
  children,
  className,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div
      className={cn(
        // structure
        "relative w-full flex flex-col justify-start shrink-0 z-50",
        // spacing
        "px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4 xl:px-[1.625rem] xl:py-[1.125rem] 2xl:px-8 2xl:py-5",
        // size
        "h-[400px]", // Set to exact 400px height requested
        // shape
        "rounded-[24px]", // Exact 24px border radius
        // row gap
        "gap-2.5",
        className,
      )}
    >
      {/* ── Background Elements Container (with overflow-hidden) ── */}
      <div className="absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none z-0">
        {/* ── Background gradient ── */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(94.23deg, #B1BCB3 -8.84%, #DBE3DA 51.66%, #B1BCB3 108.77%)",
          }}
        />

        {/* ── Decorative blurs ── */}
        <div
          className="absolute w-[clamp(80px,8vw,126px)] h-[clamp(80px,8vw,126px)] bg-[#F2FFDB] blur-[60px] rounded-full"
          style={{ left: "-37px", top: "70%" }}
        />
        <div
          className="absolute w-[1657px] h-[23px] left-1/2 -translate-x-1/2 bg-[#F2FFDA] blur-[40px]"
          style={{ bottom: "-10px" }}
        />

        {/* ── Hero illustration (Middle) ── */}
        {heroImage && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <img
              src={heroImage}
              alt=""
              aria-hidden="true"
              className="w-[45%] max-w-[400px] h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* ── ROW 1: Breadcrumb ←→ Search + Bell ── */}
      <div className="relative z-50 flex items-start justify-between gap-4">
        {/* Breadcrumb */}
        <div className="flex shrink-0 items-center gap-1.5 min-w-fit">
          {breadcrumbIcon || (
            <LayoutGrid
              size={16}
              strokeWidth={2}
              className="shrink-0 text-white"
            />
          )}
          <Typography
            variant="span"
            className="font-inter font-normal whitespace-nowrap leading-5 text-white text-[0.75rem] sm:text-[0.8125rem] xl:text-sm"
          >
            {breadcrumb}
          </Typography>
        </div>

        {/* Right controls: Search + Bell + custom */}
        <div className="flex flex-1 items-center justify-end gap-2 lg:gap-3 max-w-[18rem] md:max-w-xs lg:max-w-sm xl:max-w-[23.25rem] 2xl:max-w-[26rem]">
          {/* Search */}
          {showSearch && (
            <Input
              variant="white"
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              icon={
                <Search
                  size={20}
                  strokeWidth={2}
                  className="text-[var(--text-muted-strong)]"
                />
              }
              containerClassName="flex-1"
              wrapperClassName="h-10 lg:h-11 xl:h-[3.25rem] bg-[var(--surface-card)] rounded-full shadow-sm"
              className="font-inter font-normal text-[var(--text-primary)] placeholder:text-[var(--text-muted-strong)] text-[0.8125rem] lg:text-sm xl:text-base"
            />
          )}

          {/* Bell */}
          {showNotification && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(true)}
                aria-label="Notifications"
                className={cn(
                  "relative shrink-0 flex items-center justify-center",
                  "w-10 h-10 lg:w-11 lg:h-11 xl:w-[3.25rem] xl:h-[3.25rem]",
                  "rounded-full bg-[var(--surface-card)] shadow-sm",
                  "transition-all duration-200",
                )}
              >
                <Bell
                  strokeWidth={1.8}
                  className="text-[var(--text-primary)] w-4 h-4 lg:w-[1.125rem] lg:h-[1.125rem] xl:w-[1.35rem] xl:h-[1.35rem]"
                />
                {/* Notification dot */}
                <span
                  aria-hidden="true"
                  className="absolute top-[0.78rem] right-[0.78rem] xl:top-[0.95rem] xl:right-[0.95rem] w-1.5 h-1.5 rounded-full bg-[var(--status-danger)]"
                />
              </button>
              
              <SuperAdminNotificationsDropdown 
                isOpen={isNotificationsOpen} 
                onClose={() => setIsNotificationsOpen(false)} 
              />
            </div>
          )}

          {/* Custom right content */}
          {rightContent}
        </div>
      </div>

      {/* ── ROW 2: Title + Subtitle ── */}
      <div className="relative z-10 flex flex-col gap-1.5 xl:gap-2 -mt-1 xl:-mt-1">
        <p
          className={cn(
            "!m-0 font-inter font-medium uppercase leading-[120%] tracking-[-0.02em]",
            "text-[var(--text-strong)]",
            "text-[1.75rem] sm:text-[1.875rem] lg:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.5rem]",
          )}
        >
          {title}
        </p>

        {subtitle && (
          <Typography
            variant="p"
            className={cn(
              "-mt-2 font-inter font-normal text-[var(--text-muted)]",
              "max-w-[95%] sm:max-w-[28rem] xl:max-w-[29.375rem]",
              "text-[0.75rem] sm:text-[0.8125rem] xl:text-sm",
              "leading-4 xl:leading-[1.125rem]",
            )}
          >
            {subtitle}
          </Typography>
        )}
      </div>

      {/* ── Optional children slot ── */}
      {children && (
        <div className="relative z-10">{children}</div>
      )}
    </div>
  );
};

export default SuperAdminHeader;
