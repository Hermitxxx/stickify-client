import React from "react";
import type { Metadata } from "next";
import { requireAuth, getUserRole } from "@/lib/services/auth.service";
import { connectToDatabase } from "@/lib/db/mongoose";
import UserModel, { type IUser } from "@/lib/models/user.model";
import SettingsView from "@/components/features/dashboard/SettingsView";

export const metadata: Metadata = {
  title: "Account Settings & Profile — Stickify",
  description: "Update your profile avatar, personal details, email, and password.",
};

export default async function SettingsPage() {
  const session = await requireAuth("/dashboard/settings");
  const role = await getUserRole(session.user.id);

  await connectToDatabase();
  const userDoc = (await UserModel.findById(session.user.id).lean()) as (IUser & { _id: unknown }) | null;

  const user = {
    id: session.user.id,
    name: userDoc?.name || session.user.name || "Collector",
    email: userDoc?.email || session.user.email || "",
    image: userDoc?.image || session.user.image || null,
    role,
    createdAt: userDoc?.createdAt ? new Date(userDoc.createdAt).toISOString() : null,
    emailVerified: Boolean(userDoc?.emailVerified),
  };

  return (
    <main className="min-h-screen w-full bg-bg text-fg font-sans antialiased selection:bg-gold selection:text-ink-950 pb-24">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-orange/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <SettingsView initialUser={user} />
      </div>
    </main>
  );
}
