"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookmarkCheck, ExternalLink, Trash2, Smartphone, Tablet, Laptop, Sparkles } from "lucide-react";
import { IBookmark } from "@/lib/models/bookmark.model";
import { BookmarkItem } from "@/lib/redux/slices/bookmarksSlice";
import { SpotlightCard } from "@/components/motion/react-bits/SpotlightCard";

interface BookmarkedSkinCardProps {
  bookmark: IBookmark | BookmarkItem;
  onUnbookmark: (productId: string) => Promise<void>;
}

export function BookmarkedSkinCard({
  bookmark,
  onUnbookmark,
}: BookmarkedSkinCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    try {
      await onUnbookmark(bookmark.productId.toString());
    } finally {
      setIsRemoving(false);
    }
  };

  const getDeviceIcon = (dev: string) => {
    const lower = dev.toLowerCase();
    if (lower.includes("phone")) return <Smartphone className="h-3 w-3" />;
    if (lower.includes("tablet") || lower.includes("ipad"))
      return <Tablet className="h-3 w-3" />;
    if (lower.includes("laptop") || lower.includes("macbook"))
      return <Laptop className="h-3 w-3" />;
    return <Sparkles className="h-3 w-3" />;
  };

  return (
    <SpotlightCard className="h-full flex flex-col justify-between p-4 sm:p-5 bg-bg-elevated border-border/80 hover:border-gold/30 rounded-2xl transition-all duration-300">
      <div className="space-y-3.5">
        {/* Artwork Image */}
        <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden bg-ink-950 border border-border/60 group">
          <Image
            src={bookmark.productImage}
            alt={bookmark.productTitle}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Quick Bookmark Tag */}
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-ink-950/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gold flex items-center gap-1">
            <BookmarkCheck className="h-3 w-3 text-gold" />
            <span>Saved Cut</span>
          </div>
        </div>

        {/* Title & Price */}
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-sans font-bold text-base text-fg line-clamp-1">
              {bookmark.productTitle}
            </h3>
            <span className="font-mono font-bold text-sm text-gold shrink-0">
              ${bookmark.productPrice.toFixed(2)}
            </span>
          </div>

          {/* Compatible device pills */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            {bookmark.compatibleDevices?.slice(0, 3).map((dev) => (
              <span
                key={dev}
                className="inline-flex items-center gap-1 text-[10px] font-sans text-fg-muted bg-ink-900/80 px-2 py-0.5 rounded-md border border-border/40"
              >
                {getDeviceIcon(dev)}
                <span>{dev}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions Strip */}
      <div className="mt-4 pt-3.5 border-t border-border/50 flex items-center justify-between gap-2">
        <Link
          href={`/products/${bookmark.productSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange hover:text-gold transition-colors"
        >
          <span>View Specs</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          className="inline-flex items-center gap-1 text-xs font-sans text-fg-muted hover:text-red transition-colors p-1.5 rounded-lg hover:bg-ink-800 disabled:opacity-40"
          title="Remove from saved bookmarks"
          aria-label="Remove bookmark"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{isRemoving ? "Removing..." : "Unbookmark"}</span>
        </button>
      </div>
    </SpotlightCard>
  );
}

export default BookmarkedSkinCard;
