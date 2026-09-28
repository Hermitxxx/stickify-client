import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/services/auth.service";
import { SpotlightCard } from "@/components/motion/react-bits/SpotlightCard";
import { User, ShieldCheck, Mail, Calendar, ArrowLeft } from "lucide-react";
import DashboardSignOutButton from "./SignOutButton";

export const metadata: Metadata = {
  title: "Dashboard — Stickify",
  description: "Manage your Stickify account, custom vinyl skins, and orders.",
};

export default async function DashboardPage() {
  const session = await requireAuth("/dashboard");

  return (
    <div className="min-h-[100dvh] w-full bg-bg text-fg px-4 py-8 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-b from-maroon/15 via-orange/10 to-transparent blur-3xl opacity-50"
      />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-sans text-fg-muted hover:text-fg transition-colors border border-border/70 rounded-full px-3.5 py-1.5 hover:bg-bg-elevated"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to store
          </Link>
          <DashboardSignOutButton />
        </div>

        {/* Dashboard Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs font-mono uppercase text-gold">
            <span className="h-2 w-2 rounded-full bg-gradient-brand animate-pulse" />
            Verified Member Vault
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-fg">
            Welcome, {session.user.name || "Collector"}
          </h1>
          <p className="font-sans text-sm text-fg-muted">
            Manage your custom precision cuts, registered device wraps, and security preferences.
          </p>
        </div>

        {/* User Profile Spotlight Card */}
        <SpotlightCard className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-border/70 pb-6 mb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-ink-950 font-bold text-2xl shadow-lg shadow-orange/20">
              {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="font-sans text-xl font-bold text-fg">
                  {session.user.name}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 border border-accent/30 px-2 py-0.5 text-[11px] font-semibold text-accent-soft">
                  <ShieldCheck className="h-3 w-3" /> Active
                </span>
              </div>
              <p className="font-sans text-xs text-fg-muted flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {session.user.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border/80 bg-ink-900/60 p-4 space-y-1">
              <span className="font-sans text-xs font-medium text-fg-muted uppercase tracking-wider">
                Account ID
              </span>
              <p className="font-mono text-xs text-fg truncate">
                {session.user.id}
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-ink-900/60 p-4 space-y-1">
              <span className="font-sans text-xs font-medium text-fg-muted uppercase tracking-wider">
                Member Since
              </span>
              <p className="font-sans text-xs text-fg flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gold" />
                {new Date(session.user.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-ink-900/60 p-4 space-y-1">
              <span className="font-sans text-xs font-medium text-fg-muted uppercase tracking-wider">
                Skins In Studio
              </span>
              <p className="font-sans text-xs font-semibold text-gold">
                0 Active Projects
              </p>
            </div>
          </div>
        </SpotlightCard>

        {/* Quick action grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/#devices"
            className="group rounded-2xl border border-border bg-bg-elevated p-6 transition-all duration-200 hover:border-border-strong hover:bg-ink-900"
          >
            <div className="h-10 w-10 rounded-xl bg-orange/15 text-orange flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
              <User className="h-5 w-5" />
            </div>
            <h3 className="font-sans text-base font-bold text-fg mb-1">
              Configure New Skin
            </h3>
            <p className="font-sans text-xs text-fg-muted leading-relaxed">
              Explore 3M vinyl cuts engineered for iPhones, MacBooks, iPads, and gaming consoles.
            </p>
          </Link>

          <div className="rounded-2xl border border-border bg-bg-elevated/60 p-6 space-y-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Precision Guarantee
            </span>
            <p className="font-sans text-xs text-fg-muted leading-relaxed">
              Every wrap is cut with precision micro-channels for bubble-free application and clean removal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
