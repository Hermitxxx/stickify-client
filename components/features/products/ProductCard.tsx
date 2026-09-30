"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Smartphone,
  Tablet,
  Laptop,
  Sparkles,
  Scissors,
} from "lucide-react";
import { SpotlightCard } from "@/components/motion/react-bits/SpotlightCard";
import { BookmarkButton } from "./BookmarkButton";
import { IProduct } from "@/lib/models/product.model";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsSkinOwned } from "@/lib/redux/slices/purchasesSlice";

interface ProductCardProps {
  product: IProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const isOwned = useAppSelector((state) =>
    selectIsSkinOwned(state, product.slug) || selectIsSkinOwned(state, product._id)
  );

  const getDeviceIcon = (device: string) => {
    const lower = device.toLowerCase();
    if (lower.includes("phone")) return <Smartphone className="h-3 w-3" />;
    if (lower.includes("tablet") || lower.includes("ipad"))
      return <Tablet className="h-3 w-3" />;
    if (lower.includes("laptop") || lower.includes("macbook"))
      return <Laptop className="h-3 w-3" />;
    return <Sparkles className="h-3 w-3" />;
  };

  return (
    <SpotlightCard className="h-full flex flex-col justify-between p-4 sm:p-5 bg-bg-elevated border-border/80 hover:border-gold/30 rounded-2xl transition-all duration-300 group shadow-lg hover:shadow-2xl hover:shadow-black/50">
      <div className="space-y-3.5">
        {/* Artwork Image Container with 16:11 Aspect Ratio */}
        <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden bg-ink-950 border border-border/60 group-hover:border-gold/30 transition-colors">
          <Link
            href={`/products/${product.slug}`}
            className="block w-full h-full relative"
            aria-label={`View ${product.title} specifications`}
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              priority={priority}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Top Left Precision Tag & Owned indicator */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-20 pointer-events-none">
            <div className="px-2 py-0.5 rounded-md bg-ink-950/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-fg-muted font-medium flex items-center gap-1">
              <Scissors className="h-2.5 w-2.5 text-orange" />
              <span>300 DPI</span>
            </div>
            {isOwned && (
              <Badge variant="gold" size="sm" className="bg-gold/20 text-gold border-gold/40 text-[9px] font-mono font-bold shadow-sm shadow-gold/20">
                OWNED
              </Badge>
            )}
          </div>

          {/* Top Right Quick Bookmark Button */}
          <div className="absolute top-2.5 right-2.5 z-20">
            <BookmarkButton
              product={product}
              variant="floating"
              showText={false}
            />
          </div>
        </div>

        {/* Title, Price, & Description */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="font-sans font-bold text-base text-fg hover:text-gold transition-colors line-clamp-1"
            >
              {product.title}
            </Link>
            <span className="font-mono font-bold text-sm text-gold shrink-0">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <p className="font-sans text-xs text-fg-muted line-clamp-1 leading-relaxed">
            {product.description}
          </p>

          {/* Compatible Device Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
            {product.compatibleDevices?.slice(0, 3).map((dev) => (
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

      {/* Actions Strip: Dashboard Card Styling */}
      <div className="mt-4 pt-3.5 border-t border-border/50 flex items-center justify-between gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange hover:text-gold transition-colors py-1"
        >
          <span>View Specs</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        {/* Footer Bookmark Button */}
        <BookmarkButton
          product={product}
          variant="action-strip"
          showText={true}
        />
      </div>
    </SpotlightCard>
  );
}

export default ProductCard;
