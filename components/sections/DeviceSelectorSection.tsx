"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { FilterDisclosure, FilterItem } from "@/components/ui/filter-disclosure";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { GoArrowRight } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { FaLayerGroup, FaMobileAlt, FaLaptop, FaTabletAlt, FaGamepad } from "react-icons/fa";
import {
  Sparkles,
  Scissors,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { IProduct } from "@/lib/models/product.model";
import { BookmarkButton } from "@/components/features/products/BookmarkButton";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsSkinOwned } from "@/lib/redux/slices/purchasesSlice";

interface DeviceSelectorSectionProps {
  products?: IProduct[];
  devices?: string[];
  totalCount?: number;
}

const DEVICE_ICON_MAP: Record<string, typeof FaMobileAlt> = {
  phone: FaMobileAlt,
  iphone: FaMobileAlt,
  samsung: FaMobileAlt,
  laptop: FaLaptop,
  macbook: FaLaptop,
  tablet: FaTabletAlt,
  ipad: FaTabletAlt,
  gaming: FaGamepad,
};

function SkinProductCard({
  product,
  onOpenDetails,
}: {
  product: IProduct;
  onOpenDetails: (p: IProduct) => void;
}) {
  const router = useRouter();
  const isOwned = useAppSelector((state) =>
    selectIsSkinOwned(state, product.slug) || selectIsSkinOwned(state, product._id)
  );

  return (
    <div className="group relative flex flex-col justify-between w-full rounded-2xl border border-white/10 bg-bg-elevated/90 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-2xl hover:shadow-black/70 backdrop-blur-md">
      {/* Product Artwork Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink-950 border border-border/60 group-hover:border-gold/30 transition-colors">
        <Link
          href={`/products/${product.slug}`}
          className="block w-full h-full relative"
          aria-label={`View ${product.title} cut file`}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Top-Left Precision Spec Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-20 pointer-events-none">
          <div className="px-2 py-0.5 rounded-md bg-ink-950/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-fg-muted font-medium flex items-center gap-1">
            <Scissors className="h-2.5 w-2.5 text-orange" />
            <span>300 DPI</span>
          </div>

          {isOwned && (
            <Badge
              variant="gold"
              size="sm"
              className="bg-gold/20 text-gold border-gold/40 text-[9px] font-mono font-bold shadow-sm shadow-gold/20"
            >
              OWNED
            </Badge>
          )}
        </div>

        {/* Top-Right Bookmark Button */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <BookmarkButton product={product} variant="floating" showText={false} />
        </div>
      </div>

      {/* Content: Title, Price, Compatible Devices */}
      <div className="mt-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="text-lg font-bold tracking-tight text-fg group-hover:text-gold transition-colors leading-snug line-clamp-1"
            >
              {product.title}
            </Link>
            <span className="font-mono text-xl font-extrabold text-gold shrink-0">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <p className="mt-1 text-xs text-fg-muted line-clamp-2 leading-relaxed">
            {product.description || "Precision vector artwork mapped for Cricut, Silhouette, and laser vinyl cutters."}
          </p>

          {/* Compatible Device Tags */}
          {product.compatibleDevices && product.compatibleDevices.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-3">
              {product.compatibleDevices.slice(0, 3).map((dev) => (
                <span
                  key={dev}
                  className="inline-flex items-center gap-1 text-[10px] font-mono text-fg-muted/80 bg-ink-900/80 px-2 py-0.5 rounded-md border border-border/40"
                >
                  <span>{dev}</span>
                </span>
              ))}
              {product.compatibleDevices.length > 3 && (
                <span className="text-[10px] font-mono text-fg-muted/60">
                  +{product.compatibleDevices.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Action Buttons Strip */}
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
          <SecondaryButton
            variant="subtle"
            size="sm"
            className="flex-1 text-xs"
            iconRight={<GoArrowRight className="h-3.5 w-3.5" />}
            onClick={() => onOpenDetails(product)}
          >
            Quick specs
          </SecondaryButton>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-orange hover:text-gold hover:bg-ink-800/80 transition-colors"
          >
            <span>{isOwned ? "Download" : "Buy Cut"}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DeviceSelectorSection({
  products = [],
  devices = [],
  totalCount,
}: DeviceSelectorSectionProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All Devices");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Construct device filter list dynamically
  const filterItems = useMemo<FilterItem[]>(() => {
    const items: FilterItem[] = [
      { id: "All Devices", label: "All Devices", icon: FaLayerGroup },
    ];

    const uniqueDevices = Array.from(
      new Set(
        devices.length > 0
          ? devices
          : products.flatMap((p) => p.compatibleDevices || [])
      )
    ).filter(Boolean);

    for (const dev of uniqueDevices) {
      const lower = dev.toLowerCase();
      const matchedKey = Object.keys(DEVICE_ICON_MAP).find((k) =>
        lower.includes(k)
      );
      const icon = matchedKey ? DEVICE_ICON_MAP[matchedKey] : FaLayerGroup;
      items.push({ id: dev, label: dev, icon });
    }

    return items;
  }, [devices, products]);

  // Filter products by active category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All Devices") {
      return products;
    }
    return products.filter((p) =>
      p.compatibleDevices?.some(
        (d) => d.toLowerCase() === activeCategory.toLowerCase()
      )
    );
  }, [products, activeCategory]);

  return (
    <section
      id="devices"
      className="relative w-full py-20 md:py-32 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* Background ambient glow matching brand tokens */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-orange/10 blur-[160px] opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-bg-elevated/90 px-4 py-1.5 backdrop-blur-md border border-border/80"
        >
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-fg-muted uppercase">
            3M PRECISION ENGINEERED SKINS
          </span>
        </motion.div>

        {/* Big Centred Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-fg text-center max-w-4xl mx-auto leading-[1.08]"
        >
          Pick your device.{" "}
          <span className="bg-gradient-to-r from-gold via-orange to-red bg-clip-text text-transparent">
            Elevate your style.
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-fg-muted text-center max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Explore precision-mapped vinyl cut templates for smartphones, tablets, and laptops. Pre-calibrated for Cricut, Silhouette, and laser cutters.
        </motion.p>

        {/* Dynamic FilterDisclosure Control */}
        {filterItems.length > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 md:mt-14 mb-14 flex justify-center w-full max-w-full py-2 px-2"
          >
            <FilterDisclosure
              items={filterItems}
              defaultActiveId="All Devices"
              onChange={(id) => setActiveCategory(id)}
            />
          </motion.div>
        )}

        {/* Dynamic Product Cards Grid: 3-Column Layout */}
        <motion.div
          layout
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id || product.slug}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex"
              >
                <SkinProductCard
                  product={product}
                  onOpenDetails={(p) => setSelectedProduct(p)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Products CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 sm:mt-18 flex flex-col sm:flex-row items-center justify-center gap-4 text-center w-full"
        >
          <Link
            href="/products"
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-2xl bg-orange hover:bg-gold text-ink-950 font-sans font-bold text-sm sm:text-base tracking-wide transition-all duration-300 shadow-xl shadow-orange/20 hover:shadow-gold/30 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <Sparkles className="h-4 w-4 text-ink-950 transition-transform duration-300 group-hover:rotate-12" />
            <span>
              View All Products
              {totalCount || products.length ? ` (${totalCount || products.length}+ Artworks)` : ""}
            </span>
            <ArrowRight className="h-4 w-4 text-ink-950 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Product Details Quick-View Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 16 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-bg-elevated p-6 shadow-2xl overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-fg-muted hover:text-fg transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <IoClose className="w-5 h-5" />
                </button>

                {/* Modal Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-ink-950 mb-4 border border-border/60">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-ink-950/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-fg font-medium flex items-center gap-1.5">
                    <Scissors className="h-3 w-3 text-orange" />
                    <span>300 DPI Master Cut</span>
                  </div>
                </div>

                {/* Modal Title & Price */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="text-xs font-mono uppercase text-gold tracking-wider block mb-1">
                      {selectedProduct.compatibleDevices?.join(" • ") || "Phone • Tablet • Laptop"}
                    </span>
                    <h3 className="text-2xl font-bold text-fg tracking-tight">
                      {selectedProduct.title}
                    </h3>
                  </div>
                  <span className="text-2xl font-black text-gold shrink-0 font-mono">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-fg-muted mb-4 leading-relaxed">
                  {selectedProduct.description || "Precision vector cut template engineered with ±0.05mm tolerance for edge-to-edge device skin application."}
                </p>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs font-sans">
                  <div className="p-2.5 rounded-xl bg-ink-800 border border-white/5">
                    <span className="text-fg-muted font-mono text-[10px] uppercase block">
                      Material
                    </span>
                    <span className="text-fg font-semibold leading-snug">
                      3M™ Controltac™ Vinyl
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-ink-800 border border-white/5">
                    <span className="text-fg-muted font-mono text-[10px] uppercase block">
                      Tolerance
                    </span>
                    <span className="text-fg font-semibold leading-snug">
                      ±0.05 mm Micro-Laser CAD
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-ink-800 border border-white/5">
                    <span className="text-fg-muted font-mono text-[10px] uppercase block">
                      Resolution
                    </span>
                    <span className="text-fg font-semibold leading-snug">
                      300 DPI Lossless Vector
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-ink-800 border border-white/5">
                    <span className="text-fg-muted font-mono text-[10px] uppercase block">
                      Export Formats
                    </span>
                    <span className="text-fg font-semibold leading-snug">
                      {selectedProduct.formats?.join(" • ") || "PNG, SVG"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <SecondaryButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Close
                  </SecondaryButton>
                  <PrimaryButton
                    variant="gradient"
                    size="sm"
                    onClick={() => {
                      const slug = selectedProduct.slug;
                      setSelectedProduct(null);
                      router.push(`/products/${slug}`);
                    }}
                  >
                    View Cut File • ${selectedProduct.price.toFixed(2)} USD
                  </PrimaryButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
