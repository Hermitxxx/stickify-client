"use client";

import React from "react";
import Link from "next/link";
import {
  Menu,
  Download,
  Bookmark,
  Receipt,
  Users,
  Layers,
  Sparkles,
  RotateCw,
  Shield,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProfileMenu from "./ProfileMenu";
import { DashboardTab } from "./DashboardSidebar";

interface DashboardTopBarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: "admin" | "user";
  };
  role: "admin" | "user";
  activeTab: DashboardTab;
  onOpenMobileSidebar: () => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onSwitchView?: (view: "admin" | "collector") => void;
}

export function DashboardTopBar({
  user,
  role,
  activeTab,
  onOpenMobileSidebar,
  isRefreshing = false,
  onRefresh,
  onSwitchView,
}: DashboardTopBarProps) {
  const getTabDetails = () => {
    switch (activeTab) {
      case "purchases":
        return {
          title: "Purchased Cut Files",
          category: "Collector Vault",
          icon: <Download className="h-4 w-4 text-orange" />,
        };
      case "bookmarks":
        return {
          title: "Bookmarked Skins",
          category: "Collector Vault",
          icon: <Bookmark className="h-4 w-4 text-gold" />,
        };
      case "transactions":
        return {
          title: "Transactions & Invoices",
          category: "Collector Vault",
          icon: <Receipt className="h-4 w-4 text-orange" />,
        };
      case "admin-users":
        return {
          title: "User Management",
          category: "Platform Administration",
          icon: <Users className="h-4 w-4 text-gold" />,
        };
      case "admin-transactions":
        return {
          title: "Platform Ledger & Audits",
          category: "Platform Administration",
          icon: <Layers className="h-4 w-4 text-gold" />,
        };
      default:
        return {
          title: "Overview",
          category: "Collector Vault",
          icon: <Download className="h-4 w-4 text-orange" />,
        };
    }
  };

  const { title, category, icon } = getTabDetails();

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/70 bg-bg/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Drawer Trigger + Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-border/80 bg-bg-elevated text-fg-muted hover:text-fg hover:border-gold/40 transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-fg-muted uppercase tracking-wider hidden sm:inline">
              {category}
            </span>
            <span className="text-fg-muted/40 hidden sm:inline">/</span>
            <div className="flex items-center gap-1.5">
              {icon}
              <h1 className="font-sans font-bold text-sm sm:text-base text-fg tracking-tight">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Right Actions: Sync, Drops, Role & ProfileMenu */}
      <div className="flex items-center gap-2.5">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-semibold bg-bg-elevated border border-border/80 text-fg-muted hover:text-fg hover:border-gold/40 transition-all cursor-pointer disabled:opacity-50"
            title="Synchronize purchases with Lemon Squeezy"
          >
            <RotateCw
              className={`h-3.5 w-3.5 ${
                isRefreshing ? "animate-spin text-gold" : "text-fg-muted"
              }`}
            />
            <span className="hidden md:inline">
              {isRefreshing ? "Syncing..." : "Sync Vault"}
            </span>
          </button>
        )}

        <Link
          href="/products"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold bg-accent/15 border border-accent/30 text-orange hover:bg-accent/25 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>New Drops</span>
        </Link>

        {/* Profile Menu Dropdown */}
        <ProfileMenu user={user} onSwitchView={onSwitchView} />
      </div>
    </header>
  );
}

export default DashboardTopBar;
