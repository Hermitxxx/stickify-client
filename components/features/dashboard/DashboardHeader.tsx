"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, User, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProfileMenu from "./ProfileMenu";

interface DashboardHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: "admin" | "user";
  };
  role: "admin" | "user";
  currentView: "admin" | "collector";
  onViewChange?: (view: "admin" | "collector") => void;
}

export function DashboardHeader({
  user,
  role,
  currentView,
  onViewChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
      {/* Back Link & Brand badge */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-sans text-fg-muted hover:text-fg transition-colors border border-border/70 rounded-full px-3.5 py-1.5 hover:bg-bg-elevated"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Store</span>
        </Link>

        <Badge variant={role === "admin" ? "gold" : "brand"} size="sm">
          {role === "admin" ? "ADMIN CONSOLE" : "COLLECTOR VAULT"}
        </Badge>
      </div>

      {/* Center Role/Mode Switcher for Admins */}
      <div className="flex items-center gap-3">
        {role === "admin" && onViewChange && (
          <div className="flex items-center p-1 bg-bg-elevated border border-border/80 rounded-xl">
            <button
              type="button"
              onClick={() => onViewChange("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all ${
                currentView === "admin"
                  ? "bg-accent/20 text-gold border border-gold/30 shadow-sm"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Panel</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange("collector")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all ${
                currentView === "collector"
                  ? "bg-accent/20 text-orange border border-accent/40 shadow-sm"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>My Vault</span>
            </button>
          </div>
        )}

        {/* Interactive Profile Menu with Avatar, Settings, and Actions */}
        <ProfileMenu user={user} onSwitchView={onViewChange} />
      </div>
    </div>
  );
}

export default DashboardHeader;
