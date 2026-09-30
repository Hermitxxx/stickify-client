"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ShieldCheck, ExternalLink, Check, Loader2 } from "lucide-react";
import { ITransaction } from "@/lib/models/transaction.model";
import { SpotlightCard } from "@/components/motion/react-bits/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PurchasedSkinCardProps {
  transaction: ITransaction;
}

export function PurchasedSkinCard({ transaction }: PurchasedSkinCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);

    const slug = transaction.productSlug || transaction.productId;
    try {
      const res = await fetch(`/api/products/${slug}/download`);
      if (!res.ok) {
        // Fallback to direct image download
        if (transaction.productImage) {
          const a = document.createElement("a");
          a.href = transaction.productImage;
          a.download = `${transaction.productSlug || "skin-cut"}.png`;
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setDownloadSuccess(true);
          return;
        }
        throw new Error("Download request failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${transaction.productSlug || "precision-cut"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setDownloadSuccess(true);
    } catch (err) {
      console.error("Direct download failed, attempting fallback:", err);
      if (transaction.productImage) {
        window.open(transaction.productImage, "_blank");
        setDownloadSuccess(true);
      }
    } finally {
      setIsDownloading(false);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  return (
    <SpotlightCard className="flex flex-col justify-between p-5 bg-bg-elevated border-border/80 hover:border-gold/40 rounded-2xl transition-all duration-300 group shadow-lg">
      <div className="space-y-4">
        {/* Artwork Header */}
        <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden bg-ink-950 border border-border/60 group-hover:border-gold/30 transition-colors">
          <Image
            src={transaction.productImage}
            alt={transaction.productTitle}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
            <Badge variant="brand" size="sm">
              OWNED CUT • 300 DPI
            </Badge>
          </div>
        </div>

        {/* Title, Transaction ID, & License */}
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-sans font-bold text-base sm:text-lg text-fg line-clamp-1 group-hover:text-gold transition-colors">
              {transaction.productTitle}
            </h3>
            <span className="font-mono font-bold text-sm text-gold shrink-0">
              ${transaction.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-fg-muted">
            <span className="text-orange">{transaction.transactionId}</span>
            <span>•</span>
            <span>
              {transaction.createdAt
                ? new Date(transaction.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Active"}
            </span>
          </div>

          <p className="font-sans text-xs text-fg-muted flex items-center gap-1.5 pt-1">
            <ShieldCheck className="h-3.5 w-3.5 text-gold shrink-0" />
            <span className="truncate">{transaction.licenseType}</span>
          </p>
        </div>
      </div>

      {/* Download Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <Link
          href={`/products/${transaction.productSlug || transaction.productId}`}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-ink-800/80 px-3 py-2 rounded-xl transition-all border border-transparent hover:border-border/60"
        >
          <span>View Spec Page</span>
          <ExternalLink className="h-3.5 w-3.5 text-fg-muted" />
        </Link>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className={cn(
            "group/btn relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-sans text-xs font-bold transition-all duration-300 cursor-pointer select-none overflow-hidden shrink-0 whitespace-nowrap shadow-md",
            "focus-visible:outline-2 focus-visible:outline-accent active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
            downloadSuccess
              ? "bg-gold/20 text-gold border border-gold/40 shadow-gold/15"
              : "bg-orange text-ink-950 hover:bg-gold hover:shadow-gold/20 shadow-orange/20 border border-white/20"
          )}
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full" />
          {isDownloading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-950 shrink-0" />
              <span>Preparing File...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check className="h-3.5 w-3.5 text-gold shrink-0 stroke-[2.5]" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5 text-ink-950 shrink-0 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
              <span>Download Cut File</span>
            </>
          )}
        </button>
      </div>
    </SpotlightCard>
  );
}

export default PurchasedSkinCard;
