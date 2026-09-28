"use client";

import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "gradient" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  className?: string;
}

const SIZES: Record<"sm" | "md" | "lg", string> = {
  sm: "h-9 px-4 text-xs gap-1.5 rounded-xl",
  md: "h-11 px-6 text-sm font-semibold gap-2 rounded-2xl",
  lg: "h-14 px-8 text-base sm:text-lg font-bold gap-2.5 rounded-2xl",
};

const VARIANTS: Record<"primary" | "gradient" | "outline" | "ghost", string> = {
  primary:
    "bg-orange text-ink-950 hover:bg-gold shadow-lg shadow-orange/20 border border-white/20 hover:shadow-gold/20",
  gradient:
    "bg-gradient-to-r from-gold via-orange to-red text-ink-950 hover:opacity-95 shadow-xl shadow-orange/25 border border-white/30 hover:shadow-gold/25",
  outline:
    "border border-border bg-bg-elevated/90 text-fg hover:bg-ink-800 hover:border-border-strong hover:text-fg backdrop-blur-md",
  ghost:
    "text-fg hover:text-gold hover:bg-white/5",
};

export function PrimaryButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  disabled,
  type = "button",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-center font-sans select-none overflow-hidden outline-none cursor-pointer transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        SIZES[size],
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {/* Subtle sheen highlight on hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

      {icon && <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export default PrimaryButton;
