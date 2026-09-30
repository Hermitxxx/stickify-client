"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  enableSpotlight?: boolean;
}

/**
 * BentoGrid - React Bits inspired modular layout system with cursor tracking
 */
export function BentoGrid({
  children,
  className = "",
}: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 w-full select-none-text",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * BentoCard - Individual bento tile with cursor-following spotlight and tactile borders
 */
export function BentoCard({
  children,
  className = "",
  glowColor = "rgba(235, 127, 49, 0.12)",
  enableSpotlight = true,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group/bento relative overflow-hidden rounded-3xl border border-border/80 bg-bg-elevated/95 p-6 sm:p-7 md:p-8 text-fg shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-gold/40 hover:shadow-2xl hover:shadow-orange/5",
        className
      )}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      {enableSpotlight && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 80%)`,
          }}
        />
      )}

      {/* Subtle top sheen border accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover/bento:via-gold/30 transition-all duration-500" />

      {/* Content slot */}
      <div className="relative z-10 h-full flex flex-col justify-between">{children}</div>
    </div>
  );
}

export default BentoGrid;
