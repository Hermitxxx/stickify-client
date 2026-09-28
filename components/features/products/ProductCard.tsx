"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Smartphone, Tablet, Laptop, Sparkles, Scissors } from "lucide-react";
import { SpotlightCard } from "@/components/motion/react-bits/SpotlightCard";
import { IProduct } from "@/lib/models/product.model";

interface ProductCardProps {
  product: IProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const getDeviceIcon = (device: string) => {
    const lower = device.toLowerCase();
    if (lower.includes("phone")) return <Smartphone className="h-3 w-3" />;
    if (lower.includes("tablet") || lower.includes("ipad")) return <Tablet className="h-3 w-3" />;
    if (lower.includes("laptop") || lower.includes("macbook")) return <Laptop className="h-3 w-3" />;
    return <Sparkles className="h-3 w-3" />;
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-accent rounded-2xl"
    >
      <SpotlightCard className="h-full flex flex-col justify-between p-4 sm:p-5 bg-bg-elevated border-border/80 hover:border-gold/40 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 rounded-2xl">
        <div className="space-y-4">
          {/* Artwork Image Container - Aspect 16:11 perfectly framing sticker graphics */}
          <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden bg-ink-950 border border-border/60 group-hover:border-accent/40 transition-colors">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              priority={priority}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Subtle Resolution / Format Tag */}
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-ink-950/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-fg-muted font-medium flex items-center gap-1">
              <Scissors className="h-2.5 w-2.5 text-orange" />
              <span>300 DPI • Cut File</span>
            </div>
          </div>

          {/* Product Header: Title & Price */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-sans font-bold text-base sm:text-lg text-fg group-hover:text-gold transition-colors line-clamp-1">
                {product.title}
              </h3>
              <span className="font-mono font-bold text-base sm:text-lg text-gold shrink-0">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <p className="font-sans text-xs text-fg-muted line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Footer Area: Compatibility & Action */}
        <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-between gap-2 text-xs">
          {/* Compatible Device Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.compatibleDevices?.slice(0, 3).map((dev) => (
              <span
                key={dev}
                className="inline-flex items-center gap-1 text-[11px] font-sans text-fg-muted bg-ink-900/60 px-2 py-0.5 rounded-md border border-border/40"
              >
                {getDeviceIcon(dev)}
                <span>{dev}</span>
              </span>
            ))}
          </div>

          {/* Action indicator */}
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange group-hover:text-gold transition-colors shrink-0">
            <span>Explore</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </SpotlightCard>
    </Link>
  );
}

export default ProductCard;
