"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  DollarSign,
  Receipt,
  Shield,
  Search,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { AdminDashboardData, AdminUserListItem } from "@/lib/services/dashboard.service";
import { ITransaction } from "@/lib/models/transaction.model";
import { SpotlightCard } from "@/components/motion/react-bits/SpotlightCard";
import { CountUp } from "@/components/motion/react-bits/CountUp";
import { DecryptedText } from "@/components/motion/react-bits/DecryptedText";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import DeleteUserModal from "./DeleteUserModal";

interface AdminDashboardViewProps {
  initialData: AdminDashboardData;
  currentUserId: string;
}

export function AdminDashboardView({
  initialData,
  currentUserId,
}: AdminDashboardViewProps) {
  const [data, setData] = useState<AdminDashboardData>(initialData);
  const [activeTab, setActiveTab] = useState<"users" | "transactions">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [userToDelete, setUserToDelete] = useState<AdminUserListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter users by search
  const filteredUsers = data.users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  });

  // Filter transactions by search
  const filteredTransactions = data.transactions.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      t.transactionId.toLowerCase().includes(q) ||
      t.userName.toLowerCase().includes(q) ||
      t.userEmail.toLowerCase().includes(q) ||
      t.productTitle.toLowerCase().includes(q)
    );
  });

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/admin/users?userId=${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete user");
      }

      // Optimistic update
      setData((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== userToDelete.id),
        stats: {
          ...prev.stats,
          totalUsers: prev.stats.totalUsers - 1,
          totalAdmins: userToDelete.role === "admin" ? prev.stats.totalAdmins - 1 : prev.stats.totalAdmins,
        },
      }));

      setStatusMessage({
        type: "success",
        text: `User account "${userToDelete.name}" successfully deleted.`,
      });
      setUserToDelete(null);
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to delete user.",
      });
    } finally {
      setIsDeleting(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const handleToggleRole = async (targetUser: AdminUserListItem) => {
    if (targetUser.id === currentUserId) {
      setStatusMessage({
        type: "error",
        text: "Safety Restriction: You cannot revoke your own admin rights.",
      });
      setTimeout(() => setStatusMessage(null), 4000);
      return;
    }

    const newRole: "admin" | "user" = targetUser.role === "admin" ? "user" : "admin";
    setUpdatingRoleId(targetUser.id);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update role");
      }

      setData((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u)),
        stats: {
          ...prev.stats,
          totalAdmins: newRole === "admin" ? prev.stats.totalAdmins + 1 : prev.stats.totalAdmins - 1,
        },
      }));

      setStatusMessage({
        type: "success",
        text: `Role for ${targetUser.name} changed to ${newRole.toUpperCase()}.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to update user role.",
      });
    } finally {
      setUpdatingRoleId(null);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-sans flex items-center justify-between border ${
            statusMessage.type === "success"
              ? "bg-accent/15 border-accent text-fg"
              : "bg-red/15 border-red text-red"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-red shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-fg-muted hover:text-fg text-xs font-mono"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Admin Executive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Platform Earnings */}
        <SpotlightCard className="p-5 bg-bg-elevated border-border/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-fg-muted uppercase tracking-wider">
              Total Platform Revenue
            </span>
            <div className="h-8 w-8 rounded-lg bg-gold/15 text-gold flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-3xl font-bold text-gold flex items-baseline">
              <span>$</span>
              <CountUp
                to={data.stats.totalEarnings}
                duration={1.8}
                className="font-mono font-bold"
              />
            </div>
            <p className="text-[11px] font-sans text-fg-muted">
              Lifetime gross from digital cut files
            </p>
          </div>
        </SpotlightCard>

        {/* Total Completed Transactions */}
        <SpotlightCard className="p-5 bg-bg-elevated border-border/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-fg-muted uppercase tracking-wider">
              Total Transactions
            </span>
            <div className="h-8 w-8 rounded-lg bg-orange/15 text-orange flex items-center justify-center">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-3xl font-bold text-fg">
              <CountUp
                to={data.stats.totalTransactions}
                duration={1.5}
                className="font-mono font-bold"
              />
            </div>
            <p className="text-[11px] font-sans text-fg-muted">
              Purchases verified on MongoDB
            </p>
          </div>
        </SpotlightCard>

        {/* Registered Platform Users */}
        <SpotlightCard className="p-5 bg-bg-elevated border-border/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-fg-muted uppercase tracking-wider">
              Total Users
            </span>
            <div className="h-8 w-8 rounded-lg bg-accent/15 text-accent-soft flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-3xl font-bold text-fg">
              <CountUp
                to={data.stats.totalUsers}
                duration={1.2}
                className="font-mono font-bold"
              />
            </div>
            <p className="text-[11px] font-sans text-fg-muted">
              Active collectors with auth profiles
            </p>
          </div>
        </SpotlightCard>

        {/* Admin Operators */}
        <SpotlightCard className="p-5 bg-bg-elevated border-border/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-fg-muted uppercase tracking-wider">
              System Operators
            </span>
            <div className="h-8 w-8 rounded-lg bg-maroon/25 text-red flex items-center justify-center">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-3xl font-bold text-fg">
              <CountUp
                to={data.stats.totalAdmins}
                duration={1.0}
                className="font-mono font-bold"
              />
            </div>
            <p className="text-[11px] font-sans text-fg-muted">
              Users with privileged access
            </p>
          </div>
        </SpotlightCard>
      </div>

      {/* Control Bar: View Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 rounded-2xl bg-bg-elevated border border-border/80">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-ink-950/70 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg text-xs font-sans font-semibold transition-all ${
              activeTab === "users"
                ? "bg-accent/20 text-orange border border-accent/40 shadow-sm"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            User Accounts ({data.users.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 rounded-lg text-xs font-sans font-semibold transition-all ${
              activeTab === "transactions"
                ? "bg-accent/20 text-orange border border-accent/40 shadow-sm"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            All Transactions ({data.transactions.length})
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "users"
                ? "Search users by name or email..."
                : "Search by ID, user, or skin..."
            }
            className="w-full h-10 pl-9 pr-3 text-xs font-sans rounded-xl bg-ink-900 border border-border/80 text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Main Tab Panels */}
      {activeTab === "users" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-bold text-xl text-fg">
              Platform User Directory
            </h2>
            <span className="font-mono text-xs text-fg-muted">
              Showing {filteredUsers.length} of {data.users.length} accounts
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-bg-elevated shadow-lg">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-border/80 bg-ink-950/60 text-fg-muted font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6 font-semibold">User</th>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold">Joined Date</th>
                  <th className="py-3.5 px-4 font-semibold">Purchases</th>
                  <th className="py-3.5 px-4 font-semibold">Total Spent</th>
                  <th className="py-3.5 px-4 sm:px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-fg">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-fg-muted">
                      No user accounts found matching &ldquo;{searchQuery}&rdquo;.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelf = user.id === currentUserId;
                    const isUpdating = updatingRoleId === user.id;

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-ink-900/60 transition-colors"
                      >
                        {/* User Identity */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-ink-800 border border-border flex items-center justify-center font-bold text-fg text-xs shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-fg flex items-center gap-1.5 truncate">
                                <span>{user.name}</span>
                                {isSelf && (
                                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-gold/15 text-gold border border-gold/30">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-fg-muted truncate">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Status */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleRole(user)}
                            disabled={isSelf || isUpdating}
                            title={isSelf ? "You cannot modify your own role" : "Click to toggle role"}
                            className="group inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <Badge
                              variant={user.role === "admin" ? "gold" : "default"}
                              size="sm"
                              className="transition-transform group-hover:scale-105"
                            >
                              {user.role.toUpperCase()}
                            </Badge>
                            {!isSelf && (
                              <ArrowUpDown className="h-3 w-3 text-fg-muted group-hover:text-gold transition-colors" />
                            )}
                          </button>
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-fg-muted">
                          {new Date(user.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* Purchases Count */}
                        <td className="py-3.5 px-4 font-mono font-medium text-fg">
                          {user.transactionCount} cuts
                        </td>

                        {/* Total Spent */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-gold">
                          ${user.totalSpent.toFixed(2)}
                        </td>

                        {/* Actions (Delete user) */}
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <button
                            type="button"
                            onClick={() => setUserToDelete(user)}
                            disabled={isSelf}
                            className={`p-2 rounded-xl transition-all ${
                              isSelf
                                ? "opacity-20 cursor-not-allowed text-fg-muted"
                                : "text-fg-muted hover:text-red hover:bg-red/15"
                            }`}
                            title={isSelf ? "Cannot delete active logged-in admin" : "Delete user account"}
                            aria-label={`Delete ${user.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Financial Transactions Audit Ledger */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-bold text-xl text-fg">
              Global Platform Transactions
            </h2>
            <span className="font-mono text-xs text-fg-muted">
              Showing {filteredTransactions.length} of {data.transactions.length} records
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-bg-elevated shadow-lg">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-border/80 bg-ink-950/60 text-fg-muted font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6 font-semibold">Transaction ID</th>
                  <th className="py-3.5 px-4 font-semibold">Skin Artwork</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 font-semibold">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-fg">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-fg-muted">
                      No transactions found matching &ldquo;{searchQuery}&rdquo;.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((txn) => (
                    <tr
                      key={txn._id}
                      className="hover:bg-ink-900/60 transition-colors"
                    >
                      {/* Transaction ID */}
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-orange">
                        {txn.transactionId}
                      </td>

                      {/* Skin Artwork Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-12 rounded-lg overflow-hidden bg-ink-950 border border-border/60 shrink-0">
                            <Image
                              src={txn.productImage}
                              alt={txn.productTitle}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/products/${txn.productSlug}`}
                              className="font-bold text-fg hover:text-gold transition-colors truncate block max-w-[200px]"
                            >
                              {txn.productTitle}
                            </Link>
                            <span className="text-[10px] font-mono text-fg-muted">
                              {txn.licenseType}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-fg truncate">
                          {txn.userName}
                        </div>
                        <div className="text-[11px] text-fg-muted truncate">
                          {txn.userEmail}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-mono font-bold text-gold">
                        ${txn.price.toFixed(2)} {txn.currency}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 border border-accent/30 px-2 py-0.5 text-[10px] font-mono font-semibold text-orange uppercase">
                          <CheckCircle2 className="h-3 w-3" />
                          {txn.status}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-[11px] text-fg-muted">
                        {txn.createdAt
                          ? new Date(txn.createdAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      <DeleteUserModal
        user={userToDelete}
        isOpen={Boolean(userToDelete)}
        isDeleting={isDeleting}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}

export default AdminDashboardView;
