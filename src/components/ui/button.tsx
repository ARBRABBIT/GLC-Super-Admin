import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant =
  | "primary" // [--btn-primary] pill, white text, uppercase — Login, Submit
  | "primary-sm" // [--btn-primary] small pill — table/badge row actions
  | "secondary" // [--btn-secondary] pill, black text, uppercase — View, Delete
  | "navy" // [--btn-navy] pill, white text — nav/dashboard with icon badge
  | "outline-primary" // transparent, blue border pill — Cancel
  | "outline-dark" // transparent, dark border pill — View Reason
  | "outline-danger" // transparent, red border pill — Reject
  | "outline-square" // transparent, blue border, rounded-xl — panel actions
  | "gradient-blue" // blue linear gradient pill — file/upload
  | "gradient-dark" // dark radial gradient pill — Enter Audit Room
  | "gradient-dark-sm" // dark radial gradient, rounded-lg — View Profile
  | "purple" // [--btn-purple] pill — Edit/tag
  | "dark" // [--btn-dark] pill, with optional dot — filter/selection
  | "export" // transparent, blue border rounded-lg — Export CSV
  | "lime"; // [--btn-lime] pill — Amount/highlight

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Icon rendered before the label */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label */
  rightIcon?: React.ReactNode;
  /** `navy` variant only — rendered inside the white circular badge */
  badgeIcon?: React.ReactNode;
  /** `dark` variant only — shows the blue dot indicator */
  showDot?: boolean;
  /** Stretches to full container width */
  fullWidth?: boolean;
  /** Disables interaction and shows a spinner */
  loading?: boolean;
}

const base =
  "inline-flex flex-row items-center justify-center select-none whitespace-nowrap " +
  "transition-all duration-150 ease-in-out " +
  "hover:opacity-85 active:scale-[0.97] " +
  "disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2";

const variantClasses: Record<ButtonVariant, string> = {
  // ── Solid filled pills ───────────────────────────────────────────────────
  primary:
    "bg-[var(--brand-500)] text-[var(--surface-card)] border-none " +
    "rounded-[var(--btn-radius-pill)] " +
    "font-[family-name:var(--btn-font-primary)] font-semibold uppercase tracking-[0.7px] " +
    "px-6 lg:px-7 xl:px-8 2xl:px-10 " +
    "h-[44px] lg:h-[48px] xl:h-[52px] 2xl:h-[56px] " +
    "text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]",

  "primary-sm":
    "bg-[var(--brand-500)] text-[var(--surface-card)] border-none " +
    "rounded-[24px] font-[family-name:var(--font-inter)] font-bold " +
    "px-3 lg:px-4 " +
    "h-[26px] lg:h-[28px] xl:h-[30px] 2xl:h-[31px] " +
    "text-[9px] lg:text-[10px] xl:text-[10px] 2xl:text-[11px]",

  secondary:
    "bg-[var(--btn-secondary)] text-[var(--text-primary)] border-none " +
    "rounded-[var(--btn-radius-pill)] " +
    "font-[family-name:var(--btn-font-primary)] font-semibold uppercase tracking-[0.7px] " +
    "px-6 lg:px-7 xl:px-8 2xl:px-10 " +
    "h-[36px] lg:h-[38px] xl:h-[40px] 2xl:h-[44px] " +
    "text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]",

  navy:
    "bg-[var(--btn-navy)] text-white border-none " +
    "rounded-[73px] gap-2 " +
    "font-[family-name:var(--btn-font-primary)] font-medium " +
    "px-3 lg:px-3.5 " +
    "h-[44px] lg:h-[48px] xl:h-[50px] 2xl:h-[56px] " +
    "text-[13px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px]",

  purple:
    "bg-[var(--btn-purple)] text-white border-none " +
    "rounded-[30px] font-[family-name:var(--btn-font-poppins)] font-normal " +
    "px-4 " +
    "h-[24px] lg:h-[26px] xl:h-[27px] 2xl:h-[29px] " +
    "text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]",

  dark:
    "bg-[var(--btn-dark)] text-white border border-black " +
    "rounded-[var(--btn-radius-pill-sm)] gap-2.5 " +
    "font-[family-name:var(--btn-font-primary)] font-semibold " +
    "px-4 lg:px-[18px] " +
    "h-[32px] lg:h-[34px] xl:h-[36px] 2xl:h-[38px] " +
    "text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]",

  lime:
    "bg-[var(--btn-lime)] text-[var(--text-primary)] border-none " +
    "rounded-[20px] font-[family-name:var(--btn-font-primary)] font-medium " +
    "px-4 lg:px-5 " +
    "h-[34px] lg:h-[36px] xl:h-[38px] 2xl:h-[40px] " +
    "text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]",

  // ── Outline variants ─────────────────────────────────────────────────────
  "outline-primary":
    "bg-transparent text-[var(--btn-outline-primary-text)] " +
    "border border-[var(--btn-outline-primary-border)] " +
    "rounded-[var(--btn-radius-pill-sm)] " +
    "font-[family-name:var(--btn-font-primary)] font-medium " +
    "px-4 lg:px-5 " +
    "h-[32px] lg:h-[34px] xl:h-[36px] 2xl:h-[38px] " +
    "text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]",

  "outline-dark":
    "bg-transparent text-[var(--btn-outline-dark-text)] " +
    "border border-[var(--btn-outline-dark-border)] " +
    "rounded-[var(--btn-radius-pill-sm)] " +
    "font-[family-name:var(--btn-font-primary)] font-medium " +
    "px-4 lg:px-5 " +
    "h-[32px] lg:h-[34px] xl:h-[36px] 2xl:h-[38px] " +
    "text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]",

  "outline-danger":
    "bg-transparent text-[var(--btn-outline-danger-text)] " +
    "border border-[var(--btn-outline-danger-border)] " +
    "rounded-[var(--btn-radius-pill-sm)] " +
    "font-[family-name:var(--btn-font-primary)] font-medium " +
    "px-4 lg:px-5 " +
    "h-[32px] lg:h-[34px] xl:h-[36px] 2xl:h-[38px] " +
    "text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]",

  "outline-square":
    "bg-transparent text-[var(--brand-500)] " +
    "border border-[var(--btn-outline-square-border)] " +
    "rounded-[var(--radius-dropdown)] " +
    "font-[family-name:var(--font-inter)] font-semibold " +
    "px-4 lg:px-5 " +
    "h-[36px] lg:h-[38px] xl:h-[40px] 2xl:h-[42px] " +
    "text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]",

  export:
    "bg-transparent text-[var(--brand-400)] " +
    "border border-[var(--brand-400)] " +
    "rounded-[var(--btn-radius-rounded)] gap-1.5 " +
    "font-[family-name:var(--btn-font-primary)] font-medium " +
    "px-4 lg:px-5 " +
    "h-[32px] lg:h-[34px] xl:h-[36px] 2xl:h-[38px] " +
    "text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]",

  // ── Gradient variants ────────────────────────────────────────────────────
  "gradient-blue":
    "bg-[linear-gradient(135deg,var(--btn-gradient-blue-from)_0%,var(--btn-gradient-blue-to)_100%)] " +
    "text-white border-none rounded-[var(--btn-radius-circle)] " +
    "font-[family-name:var(--font-inter)] font-medium " +
    "shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.10),0px_2px_4px_-2px_rgba(0,0,0,0.10)] " +
    "px-4 lg:px-5 " +
    "h-[30px] lg:h-[32px] xl:h-[34px] 2xl:h-[36px] " +
    "text-[10px] lg:text-[11px] xl:text-[11px] 2xl:text-[12px]",

  "gradient-dark":
    "bg-[radial-gradient(50%_50%_at_50%_50%,var(--btn-gradient-dark-from)_0%,var(--btn-gradient-dark-to)_100%)] " +
    "text-white border-none rounded-[69px] uppercase tracking-[0.4px] " +
    "font-[family-name:var(--font-inter)] font-normal " +
    "px-8 lg:px-9 xl:px-10 " +
    "h-[40px] lg:h-[42px] xl:h-[44px] 2xl:h-[48px] " +
    "text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]",

  "gradient-dark-sm":
    "bg-[radial-gradient(50%_50%_at_50%_50%,var(--btn-gradient-dark-from)_0%,var(--btn-gradient-dark-to)_100%)] " +
    "text-white border-none rounded-[var(--btn-radius-rounded)] gap-1.5 " +
    "font-[family-name:var(--btn-font-primary)] font-normal " +
    "px-3 lg:px-4 " +
    "h-[28px] lg:h-[29px] xl:h-[30px] 2xl:h-[32px] " +
    "text-[10px] lg:text-[11px] xl:text-[12px] 2xl:text-[13px]",
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    className="shrink-0 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      strokeOpacity="0.3"
      strokeWidth="2"
    />
    <path
      d="M14 8a6 6 0 0 0-6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      leftIcon,
      rightIcon,
      badgeIcon,
      showDot = false,
      fullWidth = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          base,
          variantClasses[variant],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {/* Navy: white icon badge */}
        {variant === "navy" && badgeIcon && (
          <span className="flex items-center justify-center shrink-0 bg-white rounded-[20px] w-7 h-7 lg:w-8 lg:h-8 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9">
            {badgeIcon}
          </span>
        )}

        {/* Dark: dot indicator */}
        {variant === "dark" && showDot && (
          <span className="shrink-0 rounded-full w-[12px] h-[12px] bg-[var(--brand-400)] border-[2px] border-[var(--pie-1)]" />
        )}

        {/* Left icon (non-navy) */}
        {leftIcon && variant !== "navy" && (
          <span className="flex items-center shrink-0">{leftIcon}</span>
        )}

        {/* Spinner */}
        {loading && <Spinner />}

        {/* Label */}
        {children}

        {/* Right icon */}
        {rightIcon && (
          <span className="flex items-center shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
