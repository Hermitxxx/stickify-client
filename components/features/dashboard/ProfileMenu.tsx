"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  Shield,
  Download,
  Bookmark,
  ChevronDown,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { signOut } from "@/lib/auth/auth-client";
import { Badge } from "@/components/ui/badge";

interface ProfileMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: "admin" | "user";
  };
  onSwitchView?: (view: "admin" | "collector") => void;
}

export function ProfileMenu({ user, onSwitchView }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  const initials = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="group flex items-center gap-3 p-1.5 pr-3 rounded-2xl border border-border/80 bg-bg-elevated hover:bg-ink-900 hover:border-gold/40 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
      >
        {/* Avatar */}
        <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-gradient-brand flex items-center justify-center text-ink-950 font-bold text-sm shadow-md shadow-orange/20 shrink-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              fill
              sizes="36px"
              className="object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* User Identity info */}
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="font-sans text-xs font-bold text-fg group-hover:text-gold transition-colors truncate max-w-[130px]">
            {user.name}
          </span>
          <span className="font-mono text-[10px] text-fg-muted uppercase tracking-wider">
            {user.role}
          </span>
        </div>

        {/* Animated Chevron */}
        <ChevronDown
          className={`h-3.5 w-3.5 text-fg-muted group-hover:text-fg transition-transform duration-200 ${
            isOpen ? "rotate-180 text-gold" : ""
          }`}
        />
      </button>

      {/* Dropdown Floating Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-bg-elevated/95 backdrop-blur-xl border border-border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1.5">
          {/* Header Card */}
          <div className="p-3.5 rounded-xl bg-ink-900 border border-border/70 flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-gradient-brand flex items-center justify-center text-ink-950 font-bold text-base shadow-md shadow-orange/20 shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-sm text-fg truncate">
                  {user.name}
                </span>
                <Badge
                  variant={user.role === "admin" ? "gold" : "brand"}
                  size="sm"
                >
                  {user.role.toUpperCase()}
                </Badge>
              </div>
              <p className="font-sans text-xs text-fg-muted truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-0.5 pt-1">
            {/* 1. Settings Link */}
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans text-fg hover:text-gold hover:bg-ink-800/80 transition-colors group"
            >
              <div className="h-7 w-7 rounded-lg bg-ink-800 flex items-center justify-center text-fg-muted group-hover:text-gold transition-colors">
                <Settings className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-fg group-hover:text-gold transition-colors">
                  Account Settings
                </div>
                <div className="text-[11px] text-fg-muted">
                  Update profile, avatar, email & password
                </div>
              </div>
            </Link>

            {/* 2. My Vault / Purchases Link */}
            <Link
              href="/dashboard?view=collector"
              onClick={() => {
                if (onSwitchView) onSwitchView("collector");
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans text-fg hover:text-orange hover:bg-ink-800/80 transition-colors group"
            >
              <div className="h-7 w-7 rounded-lg bg-ink-800 flex items-center justify-center text-fg-muted group-hover:text-orange transition-colors">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-fg group-hover:text-orange transition-colors">
                  My Skin Vault
                </div>
                <div className="text-[11px] text-fg-muted">
                  Owned vinyl cuts & vector files
                </div>
              </div>
            </Link>

            {/* 3. Admin Console (If Admin) */}
            {user.role === "admin" && (
              <Link
                href="/dashboard/admin"
                onClick={() => {
                  if (onSwitchView) onSwitchView("admin");
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans text-fg hover:text-gold hover:bg-ink-800/80 transition-colors group"
              >
                <div className="h-7 w-7 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-gold">
                    Admin Console
                  </div>
                  <div className="text-[11px] text-fg-muted">
                    Manage users, earnings & transactions
                  </div>
                </div>
              </Link>
            )}

            {/* 4. Browse Store Catalogue */}
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans text-fg hover:text-fg hover:bg-ink-800/80 transition-colors group"
            >
              <div className="h-7 w-7 rounded-lg bg-ink-800 flex items-center justify-center text-fg-muted group-hover:text-fg transition-colors">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-fg">
                  Sticker Catalogue
                </div>
                <div className="text-[11px] text-fg-muted">
                  Explore precision artworks for devices
                </div>
              </div>
            </Link>
          </div>

          {/* Divider */}
          <div className="my-1 border-t border-border/60" />

          {/* Log Out Action */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans font-semibold text-red hover:bg-red/10 transition-colors cursor-pointer disabled:opacity-40"
          >
            <div className="h-7 w-7 rounded-lg bg-red/15 flex items-center justify-center text-red">
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </div>
            <span>{isLoggingOut ? "Signing out..." : "Log Out of Account"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
