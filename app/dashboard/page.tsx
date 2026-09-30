import React from "react";
import type { Metadata } from "next";
import { requireAuth, getUserRole } from "@/lib/services/auth.service";
import {
  getUserDashboardData,
  getAdminDashboardData,
  UserDashboardData,
  AdminDashboardData,
} from "@/lib/services/dashboard.service";
import DashboardContainer from "@/components/features/dashboard/DashboardContainer";

export const metadata: Metadata = {
  title: "Collector & Admin Dashboard — Stickify",
  description:
    "Role-based dashboard for managing precision digital sticker cut files, transactions, bookmarks, and platform administration.",
};

interface DashboardPageProps {
  searchParams?: Promise<{ view?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // 1. Enforce Authentication
  const session = await requireAuth("/dashboard");

  // 2. Perform Authoritative Role Check
  const role = await getUserRole(session.user.id);

  // 3. Fetch User Dashboard Data (purchases, bookmarks, personal stats)
  const userData: UserDashboardData = await getUserDashboardData(
    session.user.id,
    session.user.email,
    session.user.name
  );

  // 4. If Admin, fetch Platform Administration Data (all users, earnings, global transactions)
  let adminData: AdminDashboardData | null = null;
  if (role === "admin") {
    adminData = await getAdminDashboardData();
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const initialView =
    role === "admin"
      ? resolvedParams.view === "collector"
        ? "collector"
        : "admin"
      : "collector";

  return (
    <main className="min-h-screen w-full bg-bg text-fg font-sans antialiased selection:bg-gold selection:text-ink-950 pb-24">
      {/* Background Ambience subtle glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-orange/5 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <DashboardContainer
          userData={userData}
          adminData={adminData}
          role={role}
          initialView={initialView}
        />
      </div>
    </main>
  );
}
