"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Loader2,
  Save,
  KeyRound,
  Copy,
  Check,
  Camera,
  Upload,
  Calendar,
  LogOut,
  RefreshCw,
  X,
  Sparkles,
  Layers,
  Cpu,
} from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/motion/react-bits/BentoGrid";
import { DecryptedText } from "@/components/motion/react-bits/DecryptedText";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { signOut } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

interface SettingsViewProps {
  initialUser: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: "admin" | "user" | string;
    createdAt?: string | null;
    emailVerified?: boolean;
  };
}

// Curated artistic vinyl skins & textures from the Stickify studio catalog
const AVATAR_PRESETS = [
  {
    name: "Obsidian Core",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Holo Grid",
    url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Cyber Neon",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Liquid Gold",
    url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Matte Carbon",
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80",
  },
];

export function SettingsView({ initialUser }: SettingsViewProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState(initialUser);
  const [copiedId, setCopiedId] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Profile Form state
  const [name, setName] = useState(initialUser.name);
  const [imageUrl, setImageUrl] = useState(initialUser.image || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Email Form state
  const [email, setEmail] = useState(initialUser.email);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Unsaved changes checks
  const isProfileDirty =
    name.trim() !== (user.name || "").trim() ||
    imageUrl.trim() !== (user.image || "").trim();

  const isEmailDirty =
    email.trim().toLowerCase() !== (user.email || "").trim().toLowerCase();

  // Password Strength Calculation
  const hasMinLength = newPassword.length >= 8;
  const hasMixedCase = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  let passwordStrengthScore = 0;
  if (hasMinLength) passwordStrengthScore += 1;
  if (hasMixedCase) passwordStrengthScore += 1;
  if (hasNumberOrSymbol) passwordStrengthScore += 1;
  if (newPassword.length >= 12) passwordStrengthScore += 1;

  const strengthLabels = ["Empty", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-border",
    "bg-red",
    "bg-orange",
    "bg-gold",
    "bg-success",
  ];

  // Copy Account ID
  const handleCopyId = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Direct File Upload from Device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setProfileError("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result;
      if (typeof result === "string") {
        setImageUrl(result);
        setProfileError(null);
      }
    };
    reader.onerror = () => {
      setProfileError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  // Reset Profile Changes
  const handleResetProfile = () => {
    setName(user.name);
    setImageUrl(user.image || "");
    setProfileError(null);
  };

  // 1. Handle Profile Update (Name & Avatar)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setUser((prev) => ({
        ...prev,
        name: data.user.name,
        image: data.user.image,
      }));

      setProfileSuccess("Collector profile and avatar successfully updated.");
      router.refresh();
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err: unknown) {
      const error = err as Error;
      setProfileError(error.message || "Failed to update profile details.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 2. Handle Email Update
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEmail(true);
    setEmailError(null);
    setEmailSuccess(null);

    if (email.trim().toLowerCase() === user.email.toLowerCase()) {
      setEmailError("The new email is identical to your current email.");
      setIsSavingEmail(false);
      return;
    }

    try {
      const res = await fetch("/api/user/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update email address");

      setUser((prev) => ({ ...prev, email: data.email }));
      setEmailSuccess("Primary account email updated successfully.");
      router.refresh();
      setTimeout(() => setEmailSuccess(null), 4000);
    } catch (err: unknown) {
      const error = err as Error;
      setEmailError(error.message || "Failed to update email.");
    } finally {
      setIsSavingEmail(false);
    }
  };

  // 3. Handle Password Change
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      setIsSavingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      setIsSavingPassword(false);
      return;
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      setPasswordSuccess("Security credentials updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(null), 4000);
    } catch (err: unknown) {
      const error = err as Error;
      setPasswordError(error.message || "Failed to update password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  // 4. Handle Sign Out from Settings
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  const initials = (user.name || user.email || "C").charAt(0).toUpperCase();

  const formattedJoinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-fg-muted hover:text-gold transition-colors px-3 py-1.5 rounded-xl bg-bg-elevated/80 border border-border/80 hover:border-gold/40 backdrop-blur-md shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-orange" />
            <span>Vault Dashboard</span>
          </Link>

          <span className="text-fg-muted/40 font-mono text-xs hidden sm:inline">/</span>
          <span className="text-xs font-mono text-fg font-medium hidden sm:inline">Settings</span>

          <Badge variant={user.role === "admin" ? "gold" : "brand"} size="sm" className="ml-1">
            {user.role === "admin" ? "ADMIN OPERATOR" : "VERIFIED COLLECTOR"}
          </Badge>
        </div>

        <div className="flex items-center gap-2.5">
          {formattedJoinDate && (
            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-elevated/50 border border-border/60 text-xs font-mono text-fg-muted">
              <Calendar className="h-3.5 w-3.5 text-orange/80 shrink-0" />
              <span>Joined {formattedJoinDate}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopyId}
            title="Click to copy account ID"
            className="inline-flex items-center gap-2 text-xs font-mono text-fg-muted hover:text-fg bg-ink-900/60 hover:bg-ink-800 border border-border/60 px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
          >
            <span>ID: {user.id.slice(0, 8)}...</span>
            {copiedId ? (
              <Check className="h-3.5 w-3.5 text-gold shrink-0 animate-in fade-in" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-fg-muted hover:text-gold shrink-0 transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div className="space-y-1.5">
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-fg tracking-tight">
          <DecryptedText
            text="Collector Profile & Settings"
            animateOn="view"
            speed={35}
          />
        </h1>
        <p className="font-sans text-sm text-fg-muted max-w-2xl leading-relaxed">
          Configure your creator persona, avatar presets, vector delivery routing, and cryptographic vault credentials.
        </p>
      </div>

      {/* React Bits Bento Grid Architecture */}
      <BentoGrid>
        {/* BENTO TILE 1: Studio Avatar & Identity (col-span-12 lg:col-span-8) */}
        <BentoCard
          className="col-span-12 lg:col-span-8"
          glowColor="rgba(235, 127, 49, 0.14)"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="font-sans font-bold text-lg text-fg flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-orange" />
                  <span>Studio Avatar & Identity</span>
                </h2>
                <p className="font-sans text-xs text-fg-muted mt-0.5">
                  Your public persona across the Stickify catalog, vault packages, and receipts.
                </p>
              </div>

              {isProfileDirty && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange/10 border border-orange/30 text-orange text-[10px] font-mono font-medium animate-pulse">
                  Unsaved Edits
                </span>
              )}
            </div>

            {/* Notification Messages */}
            {profileSuccess && (
              <div className="p-3.5 rounded-xl bg-gold/10 border border-gold/40 text-xs font-sans text-gold flex items-center justify-between shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileSuccess(null)}
                  className="text-gold/70 hover:text-gold p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {profileError && (
              <div className="p-3.5 rounded-xl bg-red/10 border border-red/40 text-xs font-sans text-red flex items-center justify-between shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red shrink-0" />
                  <span>{profileError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileError(null)}
                  className="text-red/70 hover:text-red p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Avatar Preview & Artwork Presets */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-fg-muted">
                    Avatar Artwork & Studio Badge
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="text-[11px] font-mono text-fg-muted hover:text-red transition-colors cursor-pointer"
                    >
                      Reset to Initials
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-2xl bg-ink-900/60 border border-border/60">
                  {/* Avatar Frame with Studio Glow */}
                  <div className="relative h-20 w-20 sm:h-22 sm:w-22 rounded-2xl overflow-hidden bg-gradient-brand flex items-center justify-center text-ink-950 font-bold text-3xl shadow-xl shadow-orange/20 shrink-0 border-2 border-border/80 group">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={name || "Collector"}
                        fill
                        unoptimized={imageUrl.startsWith("data:")}
                        sizes="88px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span>{initials}</span>
                    )}

                    {/* Camera upload overlay trigger */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload custom image file"
                      className="absolute inset-0 bg-ink-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-fg gap-1 cursor-pointer"
                    >
                      <Camera className="h-5 w-5 text-gold" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Upload</span>
                    </button>

                    <div className="absolute bottom-1 right-1 p-1 rounded-md bg-ink-950/90 border border-white/20 text-orange shadow-md pointer-events-none group-hover:opacity-0 transition-opacity">
                      <Camera className="h-3 w-3" />
                    </div>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Artwork Presets & Actions */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-fg-muted block">
                        Pick a curated skin preset or upload photo:
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-gold hover:text-orange transition-colors cursor-pointer"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload File</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {AVATAR_PRESETS.map((preset) => {
                        const isSelected = imageUrl === preset.url;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setImageUrl(preset.url)}
                            className={cn(
                              "group/preset flex items-center gap-1.5 p-1 pr-2 rounded-xl border transition-all cursor-pointer text-xs font-sans select-none",
                              isSelected
                                ? "bg-accent/20 border-gold text-gold font-semibold shadow-sm shadow-gold/20"
                                : "bg-ink-950/80 border-border/70 text-fg-muted hover:text-fg hover:border-gold/30 hover:bg-ink-800"
                            )}
                          >
                            <div className="relative h-5 w-5 rounded-md overflow-hidden shrink-0 border border-white/10">
                              <Image
                                src={preset.url}
                                alt={preset.name}
                                fill
                                sizes="20px"
                                className="object-cover"
                              />
                            </div>
                            <span className="text-[11px] font-medium truncate">
                              {preset.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <Input
                    type="url"
                    value={imageUrl.startsWith("data:") ? "Local custom image loaded" : imageUrl}
                    onChange={(e) => {
                      if (!imageUrl.startsWith("data:")) {
                        setImageUrl(e.target.value);
                      }
                    }}
                    disabled={imageUrl.startsWith("data:")}
                    placeholder="https://example.com/custom-avatar.png"
                    helperText={
                      imageUrl.startsWith("data:")
                        ? "Custom image loaded from local device. Click 'Reset to Initials' to change."
                        : "Or paste a direct image URL."
                    }
                    className="h-11 text-xs"
                  />
                </div>
              </div>

              {/* Full Name Field */}
              <div className="space-y-1.5">
                <Input
                  label="Collector Name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  leftIcon={<User className="h-4 w-4 text-orange" />}
                  helperText="Displayed across receipts, personal cut files, and skin downloads."
                  className="h-11 text-sm font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                {isProfileDirty ? (
                  <button
                    type="button"
                    onClick={handleResetProfile}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-fg-muted hover:text-fg transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Discard changes</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-fg-muted/60">
                    Profile up to date
                  </span>
                )}

                <PrimaryButton
                  type="submit"
                  size="md"
                  disabled={isSavingProfile || !isProfileDirty || !name.trim()}
                  className="h-11 px-6 text-xs sm:text-sm font-bold"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-ink-950" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 text-ink-950" />
                      <span>Save Profile Details</span>
                    </>
                  )}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </BentoCard>

        {/* BENTO TILE 2: Collector Status & Vault Passport (col-span-12 lg:col-span-4) */}
        <BentoCard
          className="col-span-12 lg:col-span-4"
          glowColor="rgba(252, 173, 56, 0.12)"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="font-sans text-xs font-bold text-fg flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-gold shrink-0" />
                <span>Collector Passport</span>
              </span>
              <span className="text-[10px] font-mono text-gold px-2 py-0.5 rounded-md bg-gold/10 border border-gold/30 uppercase">
                Tier 1 Verified
              </span>
            </div>

            {/* Passport Identity Card Representation */}
            <div className="p-4 rounded-2xl bg-ink-900/80 border border-border/70 space-y-3.5 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-gradient-brand flex items-center justify-center text-ink-950 font-bold text-lg shadow-md shrink-0 border border-white/20">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      unoptimized={imageUrl.startsWith("data:")}
                      className="object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-sans font-bold text-sm text-fg truncate">
                    {name || "Collector"}
                  </div>
                  <div className="text-[11px] font-mono text-fg-muted truncate">
                    {email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px] font-mono">
                <div>
                  <span className="text-fg-muted/60 block text-[9px] uppercase tracking-wider">Status</span>
                  <span className="text-gold font-semibold">
                    {user.role === "admin" ? "Operator" : "Active Collector"}
                  </span>
                </div>
                <div>
                  <span className="text-fg-muted/60 block text-[9px] uppercase tracking-wider">Member Since</span>
                  <span className="text-fg font-medium">{formattedJoinDate || "Recent"}</span>
                </div>
              </div>
            </div>

            {/* Passport Specifications */}
            <div className="space-y-2.5 text-xs text-fg-muted pt-1">
              <div className="flex items-center justify-between">
                <span>Vector Master Rights</span>
                <span className="font-mono text-gold font-semibold">Full Unlimited</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cutter Compatibility</span>
                <span className="font-mono text-fg font-medium">SVG / DXF / AI / PDF</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Precision Density</span>
                <span className="font-mono text-orange font-medium">300 DPI Studio Lossless</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cryptographic Vault</span>
                <span className="font-mono text-fg font-medium">AES-256 Enabled</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50 mt-4">
            <button
              type="button"
              onClick={handleCopyId}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-ink-900/50 border border-border/60 text-xs font-mono text-fg-muted hover:text-fg hover:border-gold/40 transition-all cursor-pointer"
            >
              <span>ID: {user.id}</span>
              {copiedId ? (
                <Check className="h-3.5 w-3.5 text-gold shrink-0" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-fg-muted shrink-0" />
              )}
            </button>
          </div>
        </BentoCard>

        {/* BENTO TILE 3: Email Address & Notification Routing (col-span-12 md:col-span-5) */}
        <BentoCard
          className="col-span-12 md:col-span-5"
          glowColor="rgba(252, 173, 56, 0.12)"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="font-sans font-bold text-base text-fg flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gold" />
                  <span>Email & Vector Delivery</span>
                </h2>
                <p className="font-sans text-xs text-fg-muted mt-0.5">
                  Receives license keys and digital skin assets.
                </p>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] font-mono shrink-0">
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified</span>
              </span>
            </div>

            {emailSuccess && (
              <div className="p-3 rounded-xl bg-gold/10 border border-gold/40 text-xs font-sans text-gold flex items-center justify-between shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                  <span>{emailSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailSuccess(null)}
                  className="text-gold/70 hover:text-gold p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {emailError && (
              <div className="p-3 rounded-xl bg-red/10 border border-red/40 text-xs font-sans text-red flex items-center justify-between shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red shrink-0" />
                  <span>{emailError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailError(null)}
                  className="text-red/70 hover:text-red p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <Input
                label="Primary Account Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@stickify.com"
                leftIcon={<Mail className="h-4 w-4 text-gold" />}
                helperText="Alters delivery target for purchase receipts and download files."
                className="h-11 text-sm font-mono"
              />

              <div className="flex items-center justify-between pt-1">
                {isEmailDirty ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(user.email);
                      setEmailError(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-fg-muted hover:text-fg transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Reset</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-fg-muted/60">
                    Routing active
                  </span>
                )}

                <PrimaryButton
                  type="submit"
                  size="md"
                  disabled={isSavingEmail || !isEmailDirty || !email.includes("@")}
                  className="h-10 px-5 text-xs sm:text-sm font-bold"
                >
                  {isSavingEmail ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-ink-950" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Email</span>
                  )}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </BentoCard>

        {/* BENTO TILE 4: Security Credentials & Password (col-span-12 md:col-span-7) */}
        <BentoCard
          className="col-span-12 md:col-span-7"
          glowColor="rgba(235, 127, 49, 0.12)"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="font-sans font-bold text-base text-fg flex items-center gap-2">
                  <Lock className="h-4 w-4 text-orange" />
                  <span>Security & Passwords</span>
                </h2>
                <p className="font-sans text-xs text-fg-muted mt-0.5">
                  Update your authentication key to keep your skin vault protected.
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-gold/10 border border-gold/40 text-xs font-sans text-gold flex items-center justify-between shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPasswordSuccess(null)}
                  className="text-gold/70 hover:text-gold p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {passwordError && (
              <div className="p-3 rounded-xl bg-red/10 border border-red/40 text-xs font-sans text-red flex items-center justify-between shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red shrink-0" />
                  <span>{passwordError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPasswordError(null)}
                  className="text-red/70 hover:text-red p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Current Password"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  leftIcon={<KeyRound className="h-4 w-4 text-orange" />}
                  className="h-11 text-sm font-mono"
                />

                <Input
                  label="New Password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  leftIcon={<Lock className="h-4 w-4 text-gold" />}
                  className="h-11 text-sm font-mono"
                />
              </div>

              {/* Interactive Password Strength Indicator */}
              {newPassword.length > 0 && (
                <div className="space-y-2 p-3 rounded-xl bg-ink-900/60 border border-border/50">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-fg-muted">Password Strength:</span>
                    <span
                      className={cn(
                        "font-semibold",
                        passwordStrengthScore <= 1 && "text-red",
                        passwordStrengthScore === 2 && "text-orange",
                        passwordStrengthScore === 3 && "text-gold",
                        passwordStrengthScore >= 4 && "text-success"
                      )}
                    >
                      {strengthLabels[passwordStrengthScore]}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={cn(
                          "rounded-full transition-all duration-300",
                          step <= passwordStrengthScore
                            ? strengthColors[passwordStrengthScore]
                            : "bg-ink-800"
                        )}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono text-fg-muted">
                    <div className="flex items-center gap-1">
                      {hasMinLength ? (
                        <Check className="h-3 w-3 text-gold" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-fg-muted/40 ml-1" />
                      )}
                      <span className={cn(hasMinLength && "text-fg")}>8+ characters</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasMixedCase ? (
                        <Check className="h-3 w-3 text-gold" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-fg-muted/40 ml-1" />
                      )}
                      <span className={cn(hasMixedCase && "text-fg")}>Upper & lowercase</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasNumberOrSymbol ? (
                        <Check className="h-3 w-3 text-gold" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-fg-muted/40 ml-1" />
                      )}
                      <span className={cn(hasNumberOrSymbol && "text-fg")}>Number or symbol</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {newPassword && confirmPassword && newPassword === confirmPassword ? (
                        <Check className="h-3 w-3 text-success" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-fg-muted/40 ml-1" />
                      )}
                      <span className={cn(newPassword && confirmPassword && newPassword === confirmPassword && "text-success")}>
                        Passwords match
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Input
                label="Confirm New Password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<ShieldCheck className="h-4 w-4 text-fg-muted" />}
                error={
                  confirmPassword && newPassword !== confirmPassword
                    ? "Passwords do not match."
                    : undefined
                }
                className="h-11 text-sm font-mono"
              />

              <div className="flex justify-end pt-1">
                <PrimaryButton
                  type="submit"
                  size="md"
                  disabled={
                    isSavingPassword ||
                    !currentPassword ||
                    newPassword.length < 8 ||
                    newPassword !== confirmPassword
                  }
                  className="h-10 px-6 text-xs sm:text-sm font-bold"
                >
                  {isSavingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-ink-950" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Update Security Password</span>
                  )}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </BentoCard>

        {/* BENTO TILE 5: Stickify Vault Protection & Hardware Session (col-span-12) */}
        <BentoCard
          className="col-span-12"
          glowColor="rgba(235, 127, 49, 0.08)"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold shrink-0" />
                <h3 className="font-sans font-bold text-base text-fg">
                  Stickify Vault Protection & Session Health
                </h3>
                <span className="text-[10px] font-mono text-gold px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30 uppercase">
                  Encrypted Session
                </span>
              </div>

              {/* Hardware & Cryptographic Protocol Readout */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-ink-900/60 border border-border/50 space-y-1">
                  <div className="text-[10px] font-mono text-fg-muted/70 uppercase">Cipher Standard</div>
                  <div className="font-mono text-fg font-semibold flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-orange" />
                    <span>AES-256 GCM</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-ink-900/60 border border-border/50 space-y-1">
                  <div className="text-[10px] font-mono text-fg-muted/70 uppercase">Session Engine</div>
                  <div className="font-mono text-fg font-semibold flex items-center gap-1.5">
                    <Cpu className="h-3 w-3 text-gold" />
                    <span>Better Auth v1.7</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-ink-900/60 border border-border/50 space-y-1">
                  <div className="text-[10px] font-mono text-fg-muted/70 uppercase">Transport Security</div>
                  <div className="font-mono text-fg font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3 text-success" />
                    <span>TLS 1.3 Strict</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-ink-900/60 border border-border/50 space-y-1">
                  <div className="text-[10px] font-mono text-fg-muted/70 uppercase">Hardware Engine</div>
                  <div className="font-mono text-fg font-semibold flex items-center gap-1.5">
                    <Layers className="h-3 w-3 text-orange" />
                    <span>WebGL Accelerated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Action */}
            <div className="shrink-0 flex items-center gap-3">
              <SecondaryButton
                variant="outline"
                size="md"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-xs text-danger hover:text-red hover:border-danger/40 px-5"
              >
                {isSigningOut ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out Current Session</span>
                  </>
                )}
              </SecondaryButton>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}

export default SettingsView;
