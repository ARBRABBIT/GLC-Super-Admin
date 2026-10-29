import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const backButtonVariants = cva(
  "inline-flex flex-row items-center cursor-pointer border-none font-[var(--font-inter)] font-normal leading-[110%] transition-all duration-200 hover:-translate-y-px active:translate-y-0 [filter:drop-shadow(0px_0px_4px_rgba(0,0,0,0.12))] hover:[filter:drop-shadow(0px_2px_8px_rgba(0,0,0,0.18))]",
  {
    variants: {
      variant: {
        // White pill — matches original Figma design
        light: [
          "bg-[var(--surface-card)]",
          "text-[var(--text-button)]",
        ],
        // Dark sidebar-toned
        dark: [
          "bg-[var(--surface-sidebar)]",
          "text-[var(--surface-sidebar-text)]",
        ],
        // Brand blue
        brand: [
          "bg-[var(--brand-500)]",
          "text-[var(--surface-card)]",
        ],
        // Subtle tinted brand
        brandTint: [
          "bg-[var(--brand-tint)]",
          "text-[var(--brand-500)]",
          "border border-[var(--btn-outline-square-border)]",
        ],
      },
      size: {
        sm:      "w-fit min-w-[clamp(8rem,13.8vw,12.5rem)] h-auto min-h-[clamp(2rem,2.9vw,2.625rem)] px-[clamp(0.6rem,1.1vw,1rem)] py-[clamp(0.4rem,0.9vw,0.875rem)] gap-[clamp(0.2rem,0.4vw,0.375rem)] text-[clamp(0.7rem,0.97vw,0.875rem)] rounded-[var(--btn-radius-pill-sm)]",
        default: "w-fit min-w-[clamp(10rem,16.6vw,15rem)] h-auto min-h-[clamp(2.2rem,3.6vw,3.25rem)] px-[clamp(0.7rem,1.38vw,1.25rem)] py-[clamp(0.4rem,1vw,1.1875rem)] gap-[clamp(0.3rem,0.55vw,0.5rem)] text-[clamp(0.75rem,1.1vw,1rem)] rounded-[var(--btn-radius-pill)]",
        lg:      "w-fit min-w-[clamp(12rem,19.4vw,17.5rem)] h-auto min-h-[clamp(2.6rem,4.1vw,3.75rem)] px-[clamp(0.9rem,1.6vw,1.5rem)] py-[clamp(0.6rem,1.5vw,1.375rem)] gap-[clamp(0.4rem,0.69vw,0.625rem)] text-[clamp(0.85rem,1.25vw,1.125rem)] rounded-[var(--btn-radius-pill)]",
      },
    },
    defaultVariants: {
      variant: "light",
      size: "default",
    },
  }
)

const iconColorMap: Record<string, string> = {
  light:     "var(--text-button)",
  dark:      "var(--surface-sidebar-text)",
  brand:     "var(--surface-card)",
  brandTint: "var(--brand-500)",
}

const iconSizeMap = {
  sm:      20,
  default: 24,
  lg:      28,
} as const

export interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof backButtonVariants> {
  label?: string
  as?: React.ElementType
}

const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  (
    {
      className,
      variant = "light",
      size = "default",
      label = "Go back to dashboard",
      as,
      ...props
    },
    ref
  ) => {
    const Component: React.ElementType = as ?? "button"
    const iconSize  = iconSizeMap[size ?? "default"]
    const iconColor = iconColorMap[variant ?? "light"]

    return (
      <Component
        ref={ref}
        className={cn(backButtonVariants({ variant, size }), className)}
        {...props}
      >
        {/* Arrow icon */}
        <span className="flex items-center justify-center shrink-0">
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5"
              stroke={iconColor}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19L5 12L12 5"
              stroke={iconColor}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {/* Label */}
        <span className="truncate">{label}</span>
      </Component>
    )
  }
)

BackButton.displayName = "BackButton"

export { BackButton, backButtonVariants }