"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Download,
  Share2,
  Check,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Tablet,
  Laptop,
  ArrowLeft,
  Sparkles,
  FileCheck,
  Scissors,
  Layers,
  Loader2,
  Lock,
  CreditCard,
  AlertCircle,
  ExternalLink,
  X,
} from "lucide-react";
import { IProduct } from "@/lib/models/product.model";
import { SpotlightCard } from "@/components/motion/react-bits/SpotlightCard";
import { BookmarkButton } from "./BookmarkButton";
import { useSession } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  addPurchasedSkin,
  selectIsSkinOwned,
  fetchPurchases,
} from "@/lib/redux/slices/purchasesSlice";

interface ProductDetailViewProps {
  product: IProduct;
  initialIsOwned?: boolean;
}

export function ProductDetailView({
  product,
  initialIsOwned = false,
}: ProductDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const isSkinOwnedInRedux = useAppSelector((state) =>
    selectIsSkinOwned(state, product.slug) || selectIsSkinOwned(state, product._id)
  );

  const isPurchasedRedirect = searchParams.get("purchased") === "true";
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isOwned, setIsOwned] = useState<boolean>(
    initialIsOwned || isPurchasedRedirect || isSkinOwnedInRedux
  );
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(isPurchasedRedirect);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState<string>(
    product.compatibleDevices?.[0] || ""
  );

  // Synchronize ownership with Redux state
  useEffect(() => {
    if (isSkinOwnedInRedux && !isOwned) {
      setIsOwned(true);
    }
  }, [isSkinOwnedInRedux, isOwned]);

  // Handle payment return redirect: permanently confirm in DB, update Redux, and clean URL
  useEffect(() => {
    if (isPurchasedRedirect) {
      const txnId = searchParams.get("txn_id") || undefined;
      fetch("/api/dashboard/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          transactionId: txnId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.transaction) {
            dispatch(addPurchasedSkin(data.transaction));
          }
        })
        .catch(console.error);

      // Clean the search query param so returning later won't depend on URL params
      const cleanTimer = setTimeout(() => {
        router.replace(`/products/${product.slug}`, { scroll: false });
      }, 4000);

      const toastTimer = setTimeout(() => setShowSuccessToast(false), 8000);
      return () => {
        clearTimeout(cleanTimer);
        clearTimeout(toastTimer);
      };
    }
  }, [isPurchasedRedirect, product.slug, searchParams, dispatch, router]);

  // Client-side verification of ownership fallback
  useEffect(() => {
    let isMounted = true;
    async function checkOwnership() {
      try {
        const res = await fetch(`/api/products/${product.slug}/ownership`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.isOwned) {
            setIsOwned(true);
            dispatch(fetchPurchases());
          }
        }
      } catch (err) {
        console.error("Failed to check ownership:", err);
      }
    }

    if (!isOwned) {
      checkOwnership();
    }

    return () => {
      isMounted = false;
    };
  }, [product.slug, isOwned, dispatch]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * Initiates Lemon Squeezy checkout for this skin
   */
  const handleLemonBuy = async () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/products/${product.slug}`);
      return;
    }

    setIsPurchasing(true);
    setDownloadError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.slug,
          selectedDevice,
          returnUrl: `${window.location.origin}/products/${product.slug}?purchased=true`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.noVariant) {
          setShowSetupModal(true);
          return;
        }
        throw new Error(data.error || "Checkout initiation failed");
      }

      if (data.alreadyOwned) {
        setIsOwned(true);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: unknown) {
      console.error("Purchase error:", err);
      const message = err instanceof Error ? err.message : "Could not connect to payment gateway. Please try again.";
      setDownloadError(message);
    } finally {
      setIsPurchasing(false);
    }
  };

  /**
   * Dev Mode / Quick Unlock Simulator (in case user's Lemon store does not have products yet)
   */
  const handleSimulatePurchase = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.slug,
          selectedDevice,
          simulate: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsOwned(true);
        if (data.transaction) {
          dispatch(addPurchasedSkin(data.transaction));
        } else {
          dispatch(fetchPurchases());
        }
        setShowSetupModal(false);
        setShowSuccessToast(true);
      } else {
        throw new Error(data.error || "Simulation failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Simulation failed";
      alert("Simulation error: " + message);
    } finally {
      setIsSimulating(false);
    }
  };

  /**
   * Protected download handler: validates ownership before downloading
   */
  const handleDownload = async () => {
    if (!isOwned) {
      setDownloadError("Skin locked: You must purchase this skin cut file before downloading.");
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);

    try {
      const res = await fetch(`/api/products/${product.slug}/download`);

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        if (res.status === 401) {
          router.push(`/login?callbackUrl=/products/${product.slug}`);
          return;
        }
        if (res.status === 403) {
          setIsOwned(false);
          setDownloadError("Purchase verification failed. Please complete checkout to download.");
          return;
        }
        throw new Error(errorJson.error || "Failed to download skin cut file.");
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${product.slug}-300dpi-cutfile.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err: unknown) {
      console.error("Download error:", err);
      const message = err instanceof Error ? err.message : "Failed to download. Please try again.";
      setDownloadError(message);
    } finally {
      setIsDownloading(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    const lower = device.toLowerCase();
    if (lower.includes("phone")) return <Smartphone className="h-3.5 w-3.5" />;
    if (lower.includes("tablet") || lower.includes("ipad"))
      return <Tablet className="h-3.5 w-3.5" />;
    if (lower.includes("laptop") || lower.includes("macbook"))
      return <Laptop className="h-3.5 w-3.5" />;
    return <Sparkles className="h-3.5 w-3.5" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Toast Notification on Successful Purchase */}
      {showSuccessToast && (
        <div className="mb-6 p-4 rounded-2xl bg-gold/15 border border-gold/40 text-fg flex items-center justify-between shadow-xl shadow-gold/10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gold/20 flex items-center justify-center text-gold shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-sm text-gold">
                Payment Verified • Skin Unlocked!
              </h4>
              <p className="font-sans text-xs text-fg-muted">
                Your license is confirmed and the 300 DPI vector cut files are now unlocked for immediate download.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccessToast(false)}
            className="p-1 rounded-lg text-fg-muted hover:text-fg hover:bg-ink-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Breadcrumb & Navigation Bar */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-bg-elevated/80 border border-border/80 hover:border-gold/40 text-xs font-mono font-medium text-fg-muted hover:text-fg transition-all backdrop-blur-md shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-orange" />
          <span>Back to Catalogue</span>
        </Link>

        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-2 text-xs font-mono text-fg-muted/70"
        >
          <Link href="/" className="hover:text-fg transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-fg transition-colors">
            Catalogue
          </Link>
          <span>/</span>
          <span className="text-fg font-medium truncate max-w-[240px]">
            {product.title}
          </span>
        </nav>
      </div>

      {/* Main Split-Screen Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: High-Res Artwork Showcase & Engineering Specs */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <SpotlightCard className="p-3 sm:p-5 bg-bg-elevated border-border/80 rounded-2xl shadow-2xl relative overflow-hidden group">
            {/* Viewport Frame */}
            <div className="relative aspect-[16/11] sm:aspect-[4/3] lg:aspect-[16/11] w-full rounded-xl overflow-hidden bg-ink-950/95 border border-border/60 flex items-center justify-center">
              {/* Subtle ambient spotlight behind artwork */}
              <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(235,127,49,0.12) 0%, rgba(10,9,8,0) 70%)",
                }}
              />

              <Image
                src={product.image}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain p-4 sm:p-8 transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Top Left Precision Tag */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ink-950/85 backdrop-blur-md border border-white/10 text-[10px] font-mono font-medium text-fg shadow-md pointer-events-none">
                <Scissors className="h-3 w-3 text-orange" />
                <span>300 DPI • Master Cut</span>
              </div>

              {/* Top Right Badges: Ownership Status & Bookmark */}
              <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
                {isOwned ? (
                  <span className="px-2.5 py-1 rounded-lg bg-gold/20 border border-gold/40 text-gold text-[10px] font-mono font-bold tracking-tight shadow-sm shadow-gold/20 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-gold" />
                    <span>OWNED & LICENSED</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-ink-900/80 border border-border/70 text-fg-muted text-[10px] font-mono font-medium tracking-tight flex items-center gap-1">
                    <Lock className="h-3 w-3 text-orange" />
                    <span>LOCKED CUT</span>
                  </span>
                )}
                <BookmarkButton
                  product={product}
                  variant="floating"
                  showText={false}
                />
              </div>

              {/* Bottom Left Fit Confirmation */}
              <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-[10px] font-mono text-fg-muted/80 bg-ink-950/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/5 pointer-events-none">
                <CheckCircle2 className="h-3 w-3 text-orange" />
                <span>0.05mm CAD Laser Contours</span>
              </div>
            </div>

            {/* Quick Engineering Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
              <div className="p-3 rounded-xl bg-ink-900/60 border border-border/60 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-fg-muted flex items-center gap-1.5">
                  <Scissors className="h-3 w-3 text-orange" />
                  Tolerance
                </span>
                <span className="text-xs sm:text-sm font-semibold text-fg font-sans mt-1">
                  ±0.05 mm CAD
                </span>
              </div>

              <div className="p-3 rounded-xl bg-ink-900/60 border border-border/60 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-fg-muted flex items-center gap-1.5">
                  <Layers className="h-3 w-3 text-gold" />
                  Resolution
                </span>
                <span className="text-xs sm:text-sm font-semibold text-fg font-sans mt-1">
                  300 DPI Master
                </span>
              </div>

              <div className="p-3 rounded-xl bg-ink-900/60 border border-border/60 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-fg-muted flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3 text-orange" />
                  Media Spec
                </span>
                <span className="text-xs sm:text-sm font-semibold text-fg font-sans mt-1">
                  3M Controltac™
                </span>
              </div>

              <div className="p-3 rounded-xl bg-ink-900/60 border border-border/60 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-fg-muted flex items-center gap-1.5">
                  <FileCheck className="h-3 w-3 text-gold" />
                  Export
                </span>
                <span className="text-xs sm:text-sm font-semibold text-fg font-sans mt-1">
                  Lossless PNG
                </span>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column: Product Meta, Precision Formatted Devices & Action Buttons */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Header & Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/25 text-orange text-[11px] font-mono font-semibold uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-orange" />
                <span>Tactile Skin Cut File</span>
              </span>
              <span className="text-[10px] font-mono text-fg-muted/70">
                STK-{(product.slug || "01").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase()}
              </span>
            </div>

            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-fg tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Pricing & License Strip */}
            <div className="p-4 rounded-2xl bg-bg-elevated/70 border border-border/70 flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-gold tracking-tight">
                  ${product.price.toFixed(2)}
                </span>
                <span className="font-sans text-xs font-semibold text-fg-muted uppercase">
                  USD
                </span>
              </div>

              {isOwned ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gold bg-gold/15 px-3 py-1.5 rounded-lg border border-gold/30">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0" />
                  <span className="font-bold">License Active</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-orange bg-orange/10 px-3 py-1.5 rounded-lg border border-orange/20">
                  <Lock className="h-3 w-3 text-orange shrink-0" />
                  <span>Purchase to Unlock</span>
                </span>
              )}
            </div>
          </div>

          {/* Editorial Description */}
          <p className="font-sans text-sm sm:text-base text-fg-muted leading-relaxed">
            {product.description}
          </p>

          {/* Compatible Devices Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-fg-muted">
                Precision Formatted For
              </h3>
              <span className="font-mono text-[10px] text-fg-muted/70">
                {product.compatibleDevices?.length || 0} Profiles
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {product.compatibleDevices?.map((dev) => {
                const isSelected = selectedDevice === dev;
                return (
                  <button
                    key={dev}
                    type="button"
                    onClick={() => setSelectedDevice(dev)}
                    className={cn(
                      "group/dev inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all text-xs font-medium shadow-sm cursor-pointer select-none text-left",
                      isSelected
                        ? "bg-accent/20 border-gold text-gold font-semibold shadow-sm shadow-gold/20"
                        : "bg-bg-elevated border-border/80 hover:border-gold/40 hover:bg-ink-800 text-fg"
                    )}
                  >
                    <span className={cn("transition-transform group-hover/dev:scale-110", isSelected ? "text-gold" : "text-orange")}>
                      {getDeviceIcon(dev)}
                    </span>
                    <span className="truncate">{dev}</span>
                    {isSelected && (
                      <Check className="h-3 w-3 ml-auto text-gold shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Studio Assurances & Lemon Squeezy Security Strip */}
          <div className="rounded-2xl border border-border/70 bg-bg-elevated/40 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
              <span className="font-sans text-xs font-bold text-fg flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                <span>Stickify Studio Assurance</span>
              </span>
              <span className="text-[10px] font-mono text-fg-muted uppercase flex items-center gap-1">
                <span>Lemon Squeezy Powered</span>
              </span>
            </div>

            <div className="space-y-2.5 pt-0.5">
              <div className="flex items-start gap-2.5 text-xs text-fg-muted">
                <FileCheck className="h-3.5 w-3.5 text-orange shrink-0 mt-0.5" />
                <span>
                  <strong className="text-fg">Vector-accurate cutting lines:</strong> Pre-calibrated for Cricut, Silhouette, and laser cutters.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-fg-muted">
                <ShieldCheck className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong className="text-fg">Lifetime commercial license:</strong> Use for personal skins or commercial vinyl production.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-fg-muted">
                <CheckCircle2 className="h-3.5 w-3.5 text-orange shrink-0 mt-0.5" />
                <span>
                  <strong className="text-fg">Instant unlock:</strong> Download immediately unlocks upon checkout verification.
                </span>
              </div>
            </div>
          </div>

          {/* Error Message if download or checkout failed */}
          {downloadError && (
            <div className="p-3.5 rounded-xl bg-red/10 border border-red/30 text-xs font-sans text-red flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{downloadError}</span>
            </div>
          )}

          {/* Action Buttons Section */}
          <div className="space-y-3 pt-2">
            {/* Condition 1: User does NOT own this skin yet */}
            {!isOwned ? (
              <>
                {/* Primary Action: Buy Now with Lemon Squeezy */}
                <button
                  type="button"
                  onClick={handleLemonBuy}
                  disabled={isPurchasing}
                  className={cn(
                    "group relative w-full h-12 px-6 rounded-xl font-sans font-bold text-sm flex items-center justify-center gap-2.5 select-none transition-all duration-300 cursor-pointer overflow-hidden shadow-xl shadow-orange/20",
                    "bg-orange hover:bg-gold text-ink-950 active:scale-[0.99]",
                    "disabled:opacity-60 disabled:pointer-events-none"
                  )}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  {isPurchasing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-ink-950 shrink-0" />
                      <span>Connecting to Lemon Squeezy...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 text-ink-950 shrink-0" />
                      <span>Buy Skin Cut Files — ${product.price.toFixed(2)} USD</span>
                    </>
                  )}
                </button>

                {/* Disabled Download Button: Explicitly locked until purchase */}
                <div className="space-y-1.5">
                  <button
                    type="button"
                    disabled={true}
                    aria-disabled={true}
                    className="w-full h-11 sm:h-12 px-6 rounded-xl font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 select-none bg-ink-950/40 border border-dashed border-border/80 text-fg-muted/60 cursor-not-allowed opacity-75 shadow-none"
                    title="Download locked. Purchase this skin to unlock vector cut files."
                  >
                    <Lock className="h-4 w-4 text-orange/60 shrink-0" />
                    <span>Download Cut Files (Locked — Buy to Download)</span>
                  </button>

                  <p className="text-[11px] font-mono text-center text-fg-muted/80 flex items-center justify-center gap-1.5">
                    <Lock className="h-3 w-3 text-orange shrink-0" />
                    <span>300 DPI lossless vector files unlock automatically after purchase</span>
                  </p>
                </div>
              </>
            ) : (
              /* Condition 2: User OWNS this skin — Download is fully UNLOCKED */
              <>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={cn(
                    "group relative w-full h-12 px-6 rounded-xl font-sans font-bold text-sm flex items-center justify-center gap-2.5 select-none transition-all duration-300 cursor-pointer overflow-hidden shadow-xl shadow-gold/20",
                    "bg-gradient-to-r from-gold to-orange hover:from-orange hover:to-gold text-ink-950 active:scale-[0.99]",
                    "disabled:opacity-60 disabled:pointer-events-none"
                  )}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-ink-950 shrink-0" />
                      <span>Preparing Lossless Cut Files...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 text-ink-950 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5" />
                      <span>Download Precision Cut Files (300 DPI)</span>
                    </>
                  )}
                </button>

                <div className="p-3 rounded-xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                    <span>Skin Owned • Commercial License Active</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="hover:underline font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <span>View in Vault</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </>
            )}

            {/* Companion Actions: Bookmark & Share */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <BookmarkButton
                product={product}
                variant="detail"
                className="w-full h-11"
              />

              <button
                type="button"
                onClick={handleShare}
                className={cn(
                  "w-full h-11 px-4 rounded-xl font-sans text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer select-none border whitespace-nowrap shrink-0",
                  "focus-visible:outline-2 focus-visible:outline-accent active:scale-[0.98]",
                  copied
                    ? "bg-gold/15 border-gold/40 text-gold shadow-sm shadow-gold/20"
                    : "bg-bg-elevated/80 border-border/80 hover:border-gold/30 hover:bg-ink-800 text-fg hover:text-gold shadow-sm"
                )}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-gold shrink-0" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 text-fg-muted group-hover:text-gold shrink-0 transition-colors" />
                    <span>Share Cut</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lemon Squeezy Store Setup & Dev Unlock Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-bg-elevated border border-border/80 rounded-2xl p-6 shadow-2xl space-y-5 text-fg">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-orange/15 border border-orange/30 flex items-center justify-center text-orange">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-fg">
                    Lemon Squeezy Store Setup
                  </h3>
                  <p className="text-[11px] font-mono text-fg-muted">
                    Store ID: 486296 (Stickify)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSetupModal(false)}
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:bg-ink-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans text-fg-muted leading-relaxed">
              <p>
                Your Lemon Squeezy account is authorized and connected with Store ID <strong className="text-fg">486296</strong>.
              </p>
              <p>
                To complete live payments through Lemon Squeezy hosted checkouts, you need at least one product created in your Lemon Squeezy Dashboard:
              </p>
              <div className="p-3 rounded-xl bg-ink-900 border border-border/70 space-y-1 font-mono text-[11px] text-fg">
                <div>1. Go to <a href="https://app.lemonsqueezy.com/products/new" target="_blank" rel="noreferrer" className="text-gold underline">app.lemonsqueezy.com/products/new</a></div>
                <div>2. Create a product (e.g. &quot;Precision Skin Cut License&quot;)</div>
                <div>3. Paste its Variant ID into <code className="text-orange">.env</code> as <code className="text-orange">LEMONSQUEEZY_VARIANT_ID</code></div>
              </div>
              <p>
                To test the purchase and download unlocking flow right now without leaving the browser, click the test simulator below:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSetupModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-medium text-fg-muted hover:text-fg border border-border hover:bg-ink-800 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSimulatePurchase}
                disabled={isSimulating}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-gold text-ink-950 hover:bg-orange transition-colors flex items-center justify-center gap-2 shadow-md shadow-gold/20"
              >
                {isSimulating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
                <span>Simulate & Unlock Download Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailView;
