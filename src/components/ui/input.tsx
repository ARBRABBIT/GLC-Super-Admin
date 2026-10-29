import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  labelRightElement?: React.ReactNode;
  variant?: "default" | "white" | "form";
  containerClassName?: string;
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      icon,
      rightElement,
      labelRightElement,
      variant = "default",
      containerClassName,
      wrapperClassName,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const isForm = variant === "form";

    // ── Wrapper classes ───────────────────────────────────────────────────
    const wrapperClass = isForm
      ? cn(
          "relative flex items-center shrink-0",
          "h-[clamp(36px,2.9vw,40px)]",
          "bg-[var(--surface-card)]",
          "border border-[var(--border-default)]",
          "rounded-[var(--radius-dropdown)]",
          wrapperClassName
        )
      : cn(
          "relative flex items-center shrink-0 rounded-full",
          "h-[clamp(42px,5.47vh,73px)]",
          variant === "white"
            ? "bg-[var(--surface-card)]"
            : "bg-[var(--input)]",
          wrapperClassName
        );

    const inputClass = cn(
      "w-full h-full border-none outline-none box-border bg-transparent shrink-0",
      isForm
        ? "text-[var(--profile-text)] font-sans text-[clamp(12px,0.9vw,14px)]"
        : "text-[var(--text-primary)] font-sans text-[clamp(11px,1.11vw,21px)]",
      isForm 
        ? (icon ? "pl-[clamp(34px,2.5vw,42px)] pr-[clamp(12px,1vw,16px)]" : "px-[clamp(12px,1vw,16px)]")
        : "px-[clamp(34px,3.33vw,63px)]",
      !isForm && "login-input rounded-full",
      className,
    );

    return (
      <div
        className={cn(
          "flex flex-col",
          isForm
            ? "gap-[clamp(6px,0.5vh,10px)]"
            : "gap-[clamp(6px,0.78vh,10px)]",
          containerClassName,
        )}
      >
        {/* ── Label Row ── */}
        {(label || labelRightElement) && (
          <div className="flex justify-between items-center h-[clamp(16px,1.95vh,26px)]">
            {label ? (
              <label
                htmlFor={inputId}
                className={cn(
                  "font-medium leading-none",
                  isForm
                    ? "text-[clamp(12px,0.97vw,16px)] text-[var(--label-color)] font-sans"
                    : "text-[clamp(10px,0.97vw,18px)] text-[var(--text-muted)] font-sans",
                )}
              >
                {label}
              </label>
            ) : (
              <div />
            )}
            {labelRightElement && <div>{labelRightElement}</div>}
          </div>
        )}

        {/* ── Input Wrapper ── */}
        <div className={wrapperClass}>
          {/* Left Icon */}
          {icon && (
            <span
              className={cn(
                "absolute top-1/2 -translate-y-1/2 pointer-events-none flex items-center opacity-40",
                isForm ? "left-[clamp(10px,0.9vw,14px)]" : "left-[clamp(13px,1.11vw,21px)]"
              )}
            >
              {icon}
            </span>
          )}

          {/* Actual Input */}
          <input
            id={inputId}
            type={type}
            className={inputClass}
            ref={ref}
            {...props}
          />

          {/* Right Element */}
          {rightElement && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 flex items-center justify-center",
                isForm ? "right-[clamp(10px,0.9vw,14px)]" : "right-[clamp(13px,1.11vw,21px)]"
              )}
            >
              {rightElement}
            </div>
          )}
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
