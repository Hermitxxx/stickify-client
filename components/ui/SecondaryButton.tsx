"use client";

import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "surface" | "subtle" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
}

const SIZES: Record<"sm" | "md" | "lg", string> = {
  sm: "h-9 px-4 text-xs font-semibold gap-1.5 rounded-xl",
  md: "h-11 px-6 text-sm font-medium gap-2 rounded-2xl",
  lg: "h-14 px-8 text-base sm:text-lg font-medium gap-2 rounded-2xl",
};

const VARIANTS: Record<"default" | "surface" | "subtle" | "outline" | "ghost", string> = {
  default:
    "border border-border bg-bg-elevated/80 text-fg backdrop-blur-md hover:border-border-strong hover:bg-ink-800 hover:shadow-lg",
  surface:
    "border border-border bg-bg-elevated/80 text-fg backdrop-blur-md hover:border-border-strong hover:bg-ink-800 hover:shadow-lg",
  subtle:
    "border border-white/10 bg-white/5 text-fg hover:bg-gold hover:text-ink-950 hover:border-gold",
  outline:
    "border border-border bg-transparent text-fg hover:bg-bg-elevated hover:border-border-strong",
  ghost:
    "text-fg-muted hover:text-fg hover:bg-white/5",
};

export function SecondaryButton({
  children,
  variant = "default",
  size = "md",
  icon,
  iconRight,
  className = "",
  disabled,
  type = "button",
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-center font-sans select-none overflow-hidden cursor-pointer transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        SIZES[size],
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {iconRight && <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">{iconRight}</span>}
    </button>
  );
}

export default SecondaryButton;
