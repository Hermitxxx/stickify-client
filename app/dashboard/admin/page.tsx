import React from "react";
import type { Metadata } from "next";
import { requireRole } from "@/lib/services/auth.service";
import {
  getUserDashboardData,
  getAdminDashboardData,
} from "@/lib/services/dashboard.service";
import DashboardContainer from "@/components/features/dashboard/DashboardContainer";

export const metadata: Metadata = {
  title: "Admin Console — Stickify",
  description: "Platform management, user accounts, and financial audit ledger.",
};

export default async function AdminDashboardPage() {
  // Strictly enforce Admin role. Non-admins are redirected back to /dashboard.
  const { session } = await requireRole("admin", "/dashboard");

  const [userData, adminData] = await Promise.all([
    getUserDashboardData(session.user.id, session.user.email, session.user.name),
    getAdminDashboardData(),
  ]);

  return (
    <main className="min-h-screen w-full bg-bg text-fg font-sans antialiased selection:bg-gold selection:text-ink-950 pb-24">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-maroon/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <DashboardContainer
          userData={userData}
          adminData={adminData}
          role="admin"
          initialView="admin"
        />
      </div>
    </main>
  );
}
