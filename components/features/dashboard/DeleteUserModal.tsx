"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { AdminUserListItem } from "@/lib/services/dashboard.service";

interface DeleteUserModalProps {
  user: AdminUserListItem | null;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteUserModal({
  user,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-bg-elevated border border-border p-6 shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-ink-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-red/15 border border-red/30 text-red flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 id="delete-dialog-title" className="font-sans font-bold text-lg text-fg">
              Delete User Account
            </h2>
            <p className="font-sans text-xs text-fg-muted">
              This action cannot be undone. All active sessions and account records will be permanently removed.
            </p>
          </div>
        </div>

        {/* User Card Summary */}
        <div className="p-3.5 rounded-xl bg-ink-900 border border-border/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-sans font-semibold text-sm text-fg">{user.name}</span>
            <span className="font-mono text-[11px] text-fg-muted uppercase">{user.role}</span>
          </div>
          <div className="font-sans text-xs text-fg-muted">{user.email}</div>
          <div className="text-[11px] font-mono text-orange pt-1">
            {user.transactionCount} transactions recorded
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-sans font-medium text-fg-muted hover:text-fg rounded-xl hover:bg-ink-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-semibold text-white bg-red hover:bg-red/90 rounded-xl transition-all shadow-md shadow-red/20 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isDeleting ? "Deleting..." : "Permanently Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteUserModal;
