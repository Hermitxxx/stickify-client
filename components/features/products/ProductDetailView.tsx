"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Layers,
  FileCheck,
} from "lucide-react";
import { IProduct } from "@/lib/models/product.model";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Badge } from "@/components/ui/badge";

interface ProductDetailViewProps {
  product: IProduct;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    // Trigger native download via our dedicated download endpoint
    const link = document.createElement("a");
    link.href = `/api/products/${product.slug}/download`;
    link.download = `${product.slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
    }, 1500);
  };

  const getDeviceIcon = (device: string) => {
    const lower = device.toLowerCase();
    if (lower.includes("phone")) return <Smartphone className="h-4 w-4" />;
    if (lower.includes("tablet") || lower.includes("ipad"))
      return <Tablet className="h-4 w-4" />;
    if (lower.includes("laptop") || lower.includes("macbook"))
      return <Laptop className="h-4 w-4" />;
    return <Sparkles className="h-4 w-4" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back to Catalogue Navigation */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-fg-muted hover:text-gold transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sticker Catalogue</span>
        </Link>
      </div>

      {/* Main Split-Screen Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: High-Res Artwork Display */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-2xl overflow-hidden bg-bg-elevated border border-border/80 shadow-2xl group">
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-105"
            />
            {/* Top Right Artwork Format Tag */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Badge variant="gold" size="sm">
                300 DPI LOSSLESS
              </Badge>
              <Badge variant="brand" size="sm">
                {product.formats.join(", ")}
              </Badge>
            </div>
          </div>

          {/* Quick Specs Bar below image */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-bg-elevated/50 border border-border/60 text-center">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-fg-muted">
                Resolution
              </div>
              <div className="text-xs font-semibold text-fg mt-0.5">300 DPI Ultra HD</div>
            </div>
            <div className="border-x border-border/60">
              <div className="text-[10px] font-mono uppercase tracking-wider text-fg-muted">
                Vinyl Compatibility
              </div>
              <div className="text-xs font-semibold text-fg mt-0.5">3M Controltac™</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-fg-muted">
                File Type
              </div>
              <div className="text-xs font-semibold text-fg mt-0.5">Transparent PNG</div>
            </div>
          </div>
        </div>

        {/* Right Column: Product Meta & Purchase / Download Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Header & Badges */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-orange font-semibold">
                Instant Digital Delivery
              </span>
              <span className="text-fg-muted">•</span>
              <span className="font-mono text-xs text-fg-muted">{product.slug}</span>
            </div>

            <h1 className="font-sans font-bold text-3xl sm:text-4xl text-fg tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-mono text-3xl font-bold text-gold">
                ${product.price.toFixed(2)}
              </span>
              <span className="font-sans text-xs text-fg-muted">
                USD • One-time download license
              </span>
            </div>
          </div>

          {/* Editorial Description */}
          <p className="font-sans text-sm sm:text-base text-fg-muted leading-relaxed">
            {product.description}
          </p>

          {/* Compatible Devices Section */}
          <div className="space-y-2.5 pt-2">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Precision Formatted For
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.compatibleDevices?.map((dev) => (
                <div
                  key={dev}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-bg-elevated border border-border text-xs font-medium text-fg"
                >
                  <span className="text-orange">{getDeviceIcon(dev)}</span>
                  <span>{dev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Rights & Quality Assurances */}
          <div className="rounded-xl border border-border/70 bg-bg-elevated/40 p-4 space-y-3">
            <div className="flex items-start gap-3 text-xs text-fg-muted">
              <FileCheck className="h-4 w-4 text-orange shrink-0 mt-0.5" />
              <span>
                <strong className="text-fg">Vector-accurate cutting lines:</strong> Pre-calibrated for Cricut, Silhouette, and laser cutters.
              </span>
            </div>
            <div className="flex items-start gap-3 text-xs text-fg-muted">
              <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <span>
                <strong className="text-fg">Lifetime personal & commercial rights:</strong> Use for personal skins or commercial vinyl production.
              </span>
            </div>
            <div className="flex items-start gap-3 text-xs text-fg-muted">
              <CheckCircle2 className="h-4 w-4 text-orange shrink-0 mt-0.5" />
              <span>
                <strong className="text-fg">Instant file access:</strong> Download immediately after purchase or direct download.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <PrimaryButton
              className="flex-1 h-12 flex items-center justify-center gap-2.5 text-sm"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4" />
              <span>{isDownloading ? "Downloading file..." : "Download Sticker File"}</span>
            </PrimaryButton>

            <SecondaryButton
              className="h-12 px-4 flex items-center justify-center gap-2 text-xs"
              onClick={handleShare}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-gold" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>Share Cut</span>
                </>
              )}
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailView;
