"use client";

import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import { GoArrowRight } from "react-icons/go";
import { cn } from "@/lib/utils";

export interface CtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "pill" | "gradient" | "nav";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

const SIZES: Record<"sm" | "md" | "lg", { button: string; iconBadge: string }> = {
  sm: {
    button: "h-9 px-4 text-xs font-semibold gap-2 rounded-xl",
    iconBadge: "h-6 w-6 text-xs",
  },
  md: {
    button: "h-11 px-5 text-sm font-semibold gap-2.5 rounded-2xl",
    iconBadge: "h-8 w-8 text-sm",
  },
  lg: {
    button: "p-2 pr-7 text-base md:text-lg font-semibold gap-3.5 rounded-full",
    iconBadge: "h-11 w-11 text-base",
  },
};

export function CtaButton({
  children,
  variant = "pill",
  size = "lg",
  icon,
  iconPosition = "left",
  className = "",
  disabled,
  type = "button",
  ...props
}: CtaButtonProps) {
  const defaultIcon = (
    <GoArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
  );
  const activeIcon = icon ?? defaultIcon;

  if (variant === "pill") {
    return (
      <button
        type={type}
        disabled={disabled}
        className={cn(
          "group relative inline-flex items-center rounded-full border border-white/10 bg-bg-elevated/90 text-fg backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-ink-800 hover:shadow-2xl cursor-pointer select-none outline-none active:scale-95 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          SIZES[size].button,
          className
        )}
        {...props}
      >
        {iconPosition === "left" && (
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-red to-orange text-ink-950 shadow-md transition-transform duration-300 group-hover:scale-110",
              SIZES[size].iconBadge
            )}
          >
            {activeIcon}
          </span>
        )}
        <span className="relative z-10">{children}</span>
        {iconPosition === "right" && (
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-red to-orange text-ink-950 shadow-md transition-transform duration-300 group-hover:scale-110",
              SIZES[size].iconBadge
            )}
          >
            {activeIcon}
          </span>
        )}
      </button>
    );
  }

  if (variant === "nav") {
    return (
      <button
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center border-0 rounded-xl px-4 py-2 font-medium cursor-pointer transition-colors duration-300 bg-orange text-ink-950 hover:bg-gold select-none outline-none active:scale-95 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }

  // "gradient" variant
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-center font-sans select-none overflow-hidden outline-none cursor-pointer transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:pointer-events-none bg-gradient-brand text-on-accent font-bold hover:opacity-90 shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        SIZES[size].button,
        className
      )}
      {...props}
    >
      {activeIcon && iconPosition === "left" && (
        <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">{activeIcon}</span>
      )}
      <span className="relative z-10">{children}</span>
      {activeIcon && iconPosition === "right" && (
        <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">{activeIcon}</span>
      )}
    </button>
  );
}

export const ctabutton = CtaButton;
export default CtaButton;
