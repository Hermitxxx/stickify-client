import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CardNav from "@/components/layout/CardNav";
import Footer from "@/components/layout/Footer";
import { getProducts } from "@/lib/services/product.service";
import ProductsExplorer from "@/components/features/products/ProductsExplorer";
import { Layers, Scissors, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Digital Cut Files & Skin Artworks | Stickify",
  description:
    "Explore precision-engineered digital sticker artworks and cut files for Phone, Tablet, and Laptop devices. Instant digital downloads, 300 DPI lossless resolution, pre-mapped for 3M vinyl cutters.",
  openGraph: {
    title: "Digital Cut Files & Skin Artworks | Stickify",
    description:
      "Instant digital cut artwork files for phone, tablet, and laptop skins. Precision engineered for seamless personalization.",
  },
};

export default async function ProductsPage() {
  // Fetch initial products and available device categories from MongoDB via Mongoose
  const { products, total, devices } = await getProducts({
    page: 1,
    limit: 24,
    sort: "featured",
  });

  return (
    <main className="relative min-h-screen text-fg font-sans antialiased selection:bg-gold selection:text-ink-950">
      {/* Sticky Global Navigation */}
      <CardNav />

      {/* Main Content Area */}
      <div className="relative z-10 pt-28 sm:pt-36 pb-20">
        {/* Editorial Header Section */}
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <div className="max-w-3xl space-y-4">
            <h1 className="font-sans font-bold tracking-tight text-3xl sm:text-5xl lg:text-6xl text-fg leading-[1.08]">
              Digital Cut Files & Sticker Artworks
            </h1>

            <p className="font-sans text-base sm:text-lg text-fg-muted leading-relaxed">
              Precision-mapped digital artwork files for self-cutters and vinyl crafters.
              Pre-calibrated for Cricut, Silhouette, and laser cutting onto 3M™ architectural vinyl.
            </p>
          </div>

          {/* 3-Step Micro-Explainer Strip for New Visitors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border/60">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-bg-elevated/40 border border-border/60">
              <div className="h-9 w-9 rounded-xl bg-ink-900 border border-border flex items-center justify-center shrink-0 text-orange">
                <Layers className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans font-semibold text-sm text-fg">
                  1. Choose Your Hardware
                </h3>
                <p className="font-sans text-xs text-fg-muted leading-relaxed">
                  Select designs calibrated for Phone, Tablet, or Laptop port and speaker tolerances.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-bg-elevated/40 border border-border/60">
              <div className="h-9 w-9 rounded-xl bg-ink-900 border border-border flex items-center justify-center shrink-0 text-gold">
                <Scissors className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans font-semibold text-sm text-fg">
                  2. Instant Vector Download
                </h3>
                <p className="font-sans text-xs text-fg-muted leading-relaxed">
                  Get lossless 300 DPI PNG artwork files with ready-to-cut vector boundary outlines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-bg-elevated/40 border border-border/60">
              <div className="h-9 w-9 rounded-xl bg-ink-900 border border-border flex items-center justify-center shrink-0 text-orange">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans font-semibold text-sm text-fg">
                  3. Cut & Apply on Vinyl
                </h3>
                <p className="font-sans text-xs text-fg-muted leading-relaxed">
                  Cut at home on Cricut/laser or print locally for a gapless, bubble-free 3M skin.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Interactive Products Explorer with debounced search, filter & sort */}
        <Suspense
          fallback={
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
              <div className="h-24 rounded-2xl bg-bg-elevated/60 border border-border mb-8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 rounded-2xl bg-bg-elevated/40 border border-border"
                  />
                ))}
              </div>
            </div>
          }
        >
          <ProductsExplorer
            initialProducts={products}
            initialTotal={total}
            availableDevices={devices}
          />
        </Suspense>
      </div>

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
