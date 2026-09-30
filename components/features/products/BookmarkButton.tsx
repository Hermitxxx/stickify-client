"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  toggleBookmark,
  selectIsProductBookmarked,
  selectIsProductLoading,
} from "@/lib/redux/slices/bookmarksSlice";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  product: {
    _id?: string;
    id?: string;
    title?: string;
    slug?: string;
    image?: string;
    price?: number;
    compatibleDevices?: string[];
  };
  variant?: "floating" | "action-strip" | "detail";
  className?: string;
  showText?: boolean;
}

export function BookmarkButton({
  product,
  variant = "floating",
  className = "",
  showText = true,
}: BookmarkButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const productId = (product._id || product.id || "").toString();

  const isBookmarked = useAppSelector((state) =>
    selectIsProductBookmarked(state, productId)
  );
  const isLoading = useAppSelector((state) =>
    selectIsProductLoading(state, productId)
  );

  const [justToggled, setJustToggled] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId || isLoading) return;

    setJustToggled(true);
    setTimeout(() => setJustToggled(false), 800);

    const result = await dispatch(
      toggleBookmark({
        productId,
        productTitle: product.title,
        productSlug: product.slug,
        productImage: product.image,
        productPrice: product.price,
        compatibleDevices: product.compatibleDevices,
      })
    );

    if (toggleBookmark.rejected.match(result)) {
      const payload = result.payload as { unauthorized?: boolean; message?: string } | undefined;
      if (payload?.unauthorized) {
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "/products";
        router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      }
    }
  };

  // 1. Floating Glass Button (top-right of artwork)
  if (variant === "floating") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        title={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        className={cn(
          "group/btn relative px-2.5 py-1 rounded-lg backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer select-none",
          "focus-visible:outline-2 focus-visible:outline-accent",
          isBookmarked
            ? "bg-ink-950/90 border border-gold/50 text-gold shadow-md shadow-gold/20"
            : "bg-ink-950/75 border border-white/10 text-fg-muted hover:text-fg hover:border-gold/30 hover:bg-ink-950/90",
          justToggled && "scale-105",
          className
        )}
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin text-orange" />
        ) : isBookmarked ? (
          <BookmarkCheck className="h-3 w-3 text-gold fill-gold/20" />
        ) : (
          <Bookmark className="h-3 w-3 group-hover/btn:text-gold transition-colors" />
        )}

        {showText && (
          <span
            className={cn(
              "text-[10px] font-mono tracking-tight font-medium",
              isBookmarked ? "text-gold" : "text-fg-muted group-hover/btn:text-fg"
            )}
          >
            {isBookmarked ? "Saved" : "Save"}
          </span>
        )}
      </button>
    );
  }

  // 2. Action Strip Button (inside card footer)
  if (variant === "action-strip") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        title={isBookmarked ? "Remove bookmark" : "Bookmark this skin"}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this skin"}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-sans font-medium px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer select-none",
          "focus-visible:outline-2 focus-visible:outline-accent",
          isBookmarked
            ? "text-gold bg-gold/10 border border-gold/30 hover:bg-gold/15"
            : "text-fg-muted hover:text-fg hover:bg-ink-800/80 border border-transparent hover:border-border/60",
          isLoading && "opacity-60 pointer-events-none",
          className
        )}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-orange" />
        ) : isBookmarked ? (
          <BookmarkCheck className="h-3.5 w-3.5 text-gold fill-gold/20" />
        ) : (
          <Bookmark className="h-3.5 w-3.5" />
        )}

        {showText && (
          <span>
            {isLoading ? "Saving..." : isBookmarked ? "Bookmarked" : "Bookmark"}
          </span>
        )}
      </button>
    );
  }

  // 3. Detail Page Action Button (ProductDetailView)
  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      title={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
      className={cn(
        "h-11 px-4 sm:px-5 rounded-xl font-sans text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 select-none transition-all duration-200 cursor-pointer border whitespace-nowrap shrink-0",
        "focus-visible:outline-2 focus-visible:outline-accent active:scale-98",
        isBookmarked
          ? "bg-gold/15 border-gold/40 text-gold hover:bg-gold/25 shadow-sm shadow-gold/20"
          : "bg-bg-elevated/80 border-border/80 hover:border-gold/30 hover:bg-ink-800 text-fg hover:text-gold shadow-sm",
        isLoading && "opacity-60 pointer-events-none",
        justToggled && "scale-102",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-gold shrink-0" />
      ) : isBookmarked ? (
        <BookmarkCheck className="h-4 w-4 text-gold fill-gold/20 shrink-0" />
      ) : (
        <Bookmark className="h-4 w-4 text-fg-muted group-hover:text-gold shrink-0 transition-colors" />
      )}

      <span>
        {isLoading
          ? "Updating..."
          : isBookmarked
          ? "Saved in Vault"
          : "Bookmark Cut"}
      </span>
    </button>
  );
}

export default BookmarkButton;
