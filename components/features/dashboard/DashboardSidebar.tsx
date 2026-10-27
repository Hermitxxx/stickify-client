"use client";

import React from "react";
import Link from "next/link";
import {
  Download,
  Bookmark,
  Receipt,
  Users,
  Shield,
  Sparkles,
  Settings,
  ArrowLeft,
  RotateCw,
  X,
  ExternalLink,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SpotlightCard } from "@/components/motion/react-bits/SpotlightCard";
import { Magnet } from "@/components/motion/react-bits/Magnet";
import { Badge } from "@/components/ui/badge";
import DashboardSignOutButton from "@/app/dashboard/SignOutButton";

export type DashboardTab =
  | "purchases"
  | "bookmarks"
  | "transactions"
  | "admin-users"
  | "admin-transactions";

interface DashboardSidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: "admin" | "user";
  };
  role: "admin" | "user";
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  purchasesCount: number;
  bookmarksCount: number;
  transactionsCount: number;
  adminUsersCount?: number;
  adminTransactionsCount?: number;
  totalSpent?: number;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function DashboardSidebar({
  user,
  role,
  activeTab,
  onTabChange,
  purchasesCount,
  bookmarksCount,
  transactionsCount,
  adminUsersCount = 0,
  adminTransactionsCount = 0,
  totalSpent,
  isRefreshing = false,
  onRefresh,
  isOpenMobile = false,
  onCloseMobile,
}: DashboardSidebarProps) {
  const handleItemClick = (tab: DashboardTab) => {
    onTabChange(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between gap-6">
      {/* Top Section: Brand + Identity + Nav */}
      <div className="space-y-6">
        {/* Brand & Mobile Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-brand flex items-center justify-center text-ink-950 font-black text-sm shadow-md shadow-orange/25 group-hover:scale-105 transition-transform shrink-0">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-base text-fg tracking-tight flex items-center gap-1.5">
                STICKIFY
                <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
              </span>
              <span className="font-mono text-[9px] text-fg-muted uppercase tracking-wider">
                PRECISION VAULT
              </span>
            </div>
          </Link>

          {/* Close button for Mobile drawer */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-bg-elevated transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* User Identity Mini Card */}
        <SpotlightCard className="p-3.5 rounded-xl bg-bg-elevated/70 border-border/70">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-brand flex items-center justify-center text-ink-950 font-bold text-sm shrink-0 shadow-sm shadow-orange/20">
                {(user.name || user.email || "C").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-sans font-semibold text-xs text-fg truncate">
                    {user.name}
                  </p>
                </div>
                <Badge
                  variant={role === "admin" ? "gold" : "brand"}
                  size="sm"
                  className="mt-0.5 text-[9px] py-0 px-1.5 uppercase font-mono"
                >
                  {role === "admin" ? "ADMIN" : "COLLECTOR"}
                </Badge>
              </div>
            </div>

            {onRefresh && (
              <Magnet magnetStrength={2} padding={25}>
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  title="Sync Vault with Lemon Squeezy"
                  className="h-8 w-8 rounded-lg bg-ink-950/80 border border-border/80 flex items-center justify-center text-fg-muted hover:text-gold hover:border-gold/40 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <RotateCw
                    className={`h-3.5 w-3.5 ${
                      isRefreshing ? "animate-spin text-gold" : ""
                    }`}
                  />
                </button>
              </Magnet>
            )}
          </div>
        </SpotlightCard>

        {/* Back to store navigation */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-sans text-fg-muted hover:text-fg hover:border-gold/40 transition-colors border border-border/70 rounded-xl px-3 py-2 bg-ink-950/40 w-full"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-orange" />
          <span>Back to Store Catalogue</span>
        </Link>

        {/* Primary Navigation Menus */}
        <div className="space-y-5">
          {/* Group 1: Collector Vault */}
          <div className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-fg-muted/70">
              Collector Vault
            </div>

            {/* Nav item 1: Purchased Cut Files */}
            <button
              type="button"
              onClick={() => handleItemClick("purchases")}
              className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-colors text-left cursor-pointer ${
                activeTab === "purchases"
                  ? "text-fg font-semibold"
                  : "text-fg-muted hover:text-fg hover:bg-bg-elevated/50"
              }`}
            >
              {activeTab === "purchases" && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-accent/20 border border-accent/40 rounded-xl shadow-sm shadow-orange/10 -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-2.5">
                <Download
                  className={`h-4 w-4 ${
                    activeTab === "purchases" ? "text-orange" : "text-fg-muted"
                  }`}
                />
                <span>Purchased Cut Files</span>
              </div>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                  activeTab === "purchases"
                    ? "bg-orange text-ink-950 font-bold"
                    : "bg-ink-900 border border-border/70 text-fg-muted"
                }`}
              >
                {purchasesCount}
              </span>
            </button>

            {/* Nav item 2: Bookmarked Skins */}
            <button
              type="button"
              onClick={() => handleItemClick("bookmarks")}
              className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-colors text-left cursor-pointer ${
                activeTab === "bookmarks"
                  ? "text-fg font-semibold"
                  : "text-fg-muted hover:text-fg hover:bg-bg-elevated/50"
              }`}
            >
              {activeTab === "bookmarks" && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-accent/20 border border-accent/40 rounded-xl shadow-sm shadow-orange/10 -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-2.5">
                <Bookmark
                  className={`h-4 w-4 ${
                    activeTab === "bookmarks" ? "text-gold" : "text-fg-muted"
                  }`}
                />
                <span>Bookmarked Skins</span>
              </div>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                  activeTab === "bookmarks"
                    ? "bg-gold text-ink-950 font-bold"
                    : "bg-ink-900 border border-border/70 text-fg-muted"
                }`}
              >
                {bookmarksCount}
              </span>
            </button>

            {/* Nav item 3: Transactions & Invoices */}
            <button
              type="button"
              onClick={() => handleItemClick("transactions")}
              className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-colors text-left cursor-pointer ${
                activeTab === "transactions"
                  ? "text-fg font-semibold"
                  : "text-fg-muted hover:text-fg hover:bg-bg-elevated/50"
              }`}
            >
              {activeTab === "transactions" && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-accent/20 border border-accent/40 rounded-xl shadow-sm shadow-orange/10 -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-2.5">
                <Receipt
                  className={`h-4 w-4 ${
                    activeTab === "transactions" ? "text-orange" : "text-fg-muted"
                  }`}
                />
                <span>Transactions & Invoices</span>
              </div>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                  activeTab === "transactions"
                    ? "bg-orange text-ink-950 font-bold"
                    : "bg-ink-900 border border-border/70 text-fg-muted"
                }`}
              >
                {transactionsCount}
              </span>
            </button>
          </div>

          {/* Group 2: Platform Administration (Admin Only) */}
          {role === "admin" && (
            <div className="space-y-1 pt-2 border-t border-border/50">
              <div className="px-3 pb-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-gold/80 flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-gold" />
                <span>Admin Console</span>
              </div>

              {/* Admin Nav item 1: User Accounts */}
              <button
                type="button"
                onClick={() => handleItemClick("admin-users")}
                className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-colors text-left cursor-pointer ${
                  activeTab === "admin-users"
                    ? "text-fg font-semibold"
                    : "text-fg-muted hover:text-fg hover:bg-bg-elevated/50"
                }`}
              >
                {activeTab === "admin-users" && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-gold/15 border border-gold/40 rounded-xl shadow-sm shadow-gold/10 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-2.5">
                  <Users
                    className={`h-4 w-4 ${
                      activeTab === "admin-users" ? "text-gold" : "text-fg-muted"
                    }`}
                  />
                  <span>User Accounts</span>
                </div>
                {adminUsersCount > 0 && (
                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                      activeTab === "admin-users"
                        ? "bg-gold text-ink-950 font-bold"
                        : "bg-ink-900 border border-border/70 text-fg-muted"
                    }`}
                  >
                    {adminUsersCount}
                  </span>
                )}
              </button>

              {/* Admin Nav item 2: Platform Ledger */}
              <button
                type="button"
                onClick={() => handleItemClick("admin-transactions")}
                className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-colors text-left cursor-pointer ${
                  activeTab === "admin-transactions"
                    ? "text-fg font-semibold"
                    : "text-fg-muted hover:text-fg hover:bg-bg-elevated/50"
                }`}
              >
                {activeTab === "admin-transactions" && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-gold/15 border border-gold/40 rounded-xl shadow-sm shadow-gold/10 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-2.5">
                  <Layers
                    className={`h-4 w-4 ${
                      activeTab === "admin-transactions" ? "text-gold" : "text-fg-muted"
                    }`}
                  />
                  <span>Platform Ledger</span>
                </div>
                {adminTransactionsCount > 0 && (
                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                      activeTab === "admin-transactions"
                        ? "bg-gold text-ink-950 font-bold"
                        : "bg-ink-900 border border-border/70 text-fg-muted"
                    }`}
                  >
                    {adminTransactionsCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Group 3: Shortcuts & Settings */}
          <div className="space-y-1 pt-2 border-t border-border/50">
            <div className="px-3 pb-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-fg-muted/70">
              Shortcuts & Settings
            </div>

            <Link
              href="/products"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-sans font-medium text-fg-muted hover:text-orange hover:bg-bg-elevated/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-orange" />
                <span>Browse New Drops</span>
              </div>
              <ExternalLink className="h-3 w-3 text-fg-muted" />
            </Link>

            <Link
              href="/dashboard/settings"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-sans font-medium text-fg-muted hover:text-fg hover:bg-bg-elevated/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="h-4 w-4 text-fg-muted" />
                <span>Account Settings</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section: Sign Out */}
      <div className="pt-4 border-t border-border/70">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-sans text-fg-muted">End Session</span>
          <DashboardSignOutButton />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-border/80 bg-ink-950/80 backdrop-blur-xl flex-col p-5 h-screen sticky top-0 overflow-y-auto z-30">
        {navContent}
      </aside>

      {/* 2. Mobile Responsive Slide-Over Drawer with Backdrop */}
      <AnimatePresence>
        {isOpenMobile && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-bg-elevated border-r border-border p-5 z-50 lg:hidden overflow-y-auto shadow-2xl"
            >
              {navContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default DashboardSidebar;
