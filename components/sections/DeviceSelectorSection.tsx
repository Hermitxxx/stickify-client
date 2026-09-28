"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { FilterDisclosure, FilterItem } from "@/components/ui/filter-disclosure";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { GoStar, GoCheckCircle, GoCpu, GoShieldCheck, GoZap, GoArrowRight } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { FaLayerGroup, FaMobileAlt, FaLaptop, FaTabletAlt, FaGamepad } from "react-icons/fa";

export interface SkinProduct {
  id: string;
  name: string;
  category: "iPhone" | "MacBook" | "iPad" | "Gaming" | "Samsung";
  deviceModel: string;
  price: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  tagline: string;
  frontImage: string;
  backImage: string;
  swatches: string[];
  specs: {
    material: string;
    precision: string;
    protection: string;
    airRelease: string;
  };
}

const PRODUCTS: SkinProduct[] = [
  {
    id: "cyber-carbon",
    name: "Cyber Carbon Fiber",
    category: "iPhone",
    deviceModel: "iPhone 16 Pro / Pro Max",
    price: "$29.99",
    rating: 4.9,
    reviewsCount: 248,
    badge: "BEST SELLER",
    tagline: "3D Micro-Weave Tactile Texture",
    frontImage: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80",
    backImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    swatches: ["#1c1c1e", "#3a3a3c", "#E45742"],
    specs: {
      material: "3M™ Controltac™ Architectural Vinyl",
      precision: "0.05mm Micro-Laser Cut Gapless Fit",
      protection: "Scratch, Oil & Impact Buffer Shield",
      airRelease: "True Invisible Air-Release Channels"
    }
  },
  {
    id: "cognac-leather",
    name: "Cognac Vintage Leather",
    category: "MacBook",
    deviceModel: "MacBook Pro 14\" & 16\" M3",
    price: "$44.99",
    rating: 4.95,
    reviewsCount: 192,
    badge: "PREMIUM GRAIN",
    tagline: "Warm Full-Grain Tactile Finish",
    frontImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80",
    backImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80",
    swatches: ["#8B4513", "#D2691E", "#3D2314"],
    specs: {
      material: "Authentic Grain Textured Vinyl",
      precision: "Zero-Hassle Thermal Contour Mapped",
      protection: "Heat Dissipating Non-Fade Coating",
      airRelease: "Bubble-Free Snap Application"
    }
  },
  {
    id: "forged-gold-marble",
    name: "Forged Gold Marble",
    category: "iPad",
    deviceModel: "iPad Pro 13\" M4 & Air",
    price: "$34.99",
    rating: 4.91,
    reviewsCount: 134,
    badge: "LIMITED EDITION",
    tagline: "Metallic Leaf Vein High-Gloss Finish",
    frontImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    backImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80",
    swatches: ["#FCAD38", "#121212", "#E45742"],
    specs: {
      material: "Dual-Layer Gloss Polymer Film",
      precision: "Apple Pencil & Smart Connector Cut",
      protection: "UV-Safe Hydrophobic Surface Layer",
      airRelease: "Micro-Porous Adhesive Backing"
    }
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Neon Nebula",
    category: "Gaming",
    deviceModel: "PS5 Slim & DualSense Controller",
    price: "$39.99",
    rating: 4.98,
    reviewsCount: 310,
    badge: "HOLOGRAPHIC",
    tagline: "Chameleon Shift Prism Reflective",
    frontImage: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1000&q=80",
    backImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    swatches: ["#E45742", "#972828", "#FCAD38"],
    specs: {
      material: "Dynamic Iridescent Foil Vinyl",
      precision: "Port-Exact Laser Cut Calibration",
      protection: "Grip-Enhancing Sweating Barrier",
      airRelease: "Rapid Escape Thermal Channels"
    }
  },
  {
    id: "obsidian-matte",
    name: "Obsidian Matte Black",
    category: "iPhone",
    deviceModel: "iPhone 16 / 15 Series",
    price: "$24.99",
    rating: 4.89,
    reviewsCount: 412,
    badge: "ULTRA STEALTH",
    tagline: "Zero-Reflection Anti-Fingerprint",
    frontImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    backImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
    swatches: ["#000000", "#1c1c1e", "#2c2c2e"],
    specs: {
      material: "Velvet Soft-Touch Matte Polymer",
      precision: "MagSafe & Camera Bump Moulded",
      protection: "Oleophobic Fingerprint Repellent",
      airRelease: "100% Residue-Free Clean Peel"
    }
  },
  {
    id: "brushed-titanium",
    name: "Brushed Titanium Slate",
    category: "Samsung",
    deviceModel: "Galaxy S24 Ultra / Z Fold 6",
    price: "$27.99",
    rating: 4.86,
    reviewsCount: 168,
    badge: "PRO FINISH",
    tagline: "Linear Metallic Grain Reflection",
    frontImage: "https://images.unsplash.com/photo-1535868463750-c78d9543614f?auto=format&fit=crop&w=1000&q=80",
    backImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    swatches: ["#8e8e93", "#636366", "#3a3a3c"],
    specs: {
      material: "Real-Feel Metallic Brushed Foil",
      precision: "S-Pen Slot & Speaker Zero-Obstruct Cut",
      protection: "Edge-to-Edge Impact Buffer",
      airRelease: "Zero Wireless Charging Signal Loss"
    }
  },
  {
    id: "concrete-stone",
    name: "Concrete Terrazzo Stone",
    category: "MacBook",
    deviceModel: "MacBook Air 13\" & 15\" M3",
    price: "$42.99",
    rating: 4.92,
    reviewsCount: 88,
    badge: "ARCHITECTURAL",
    tagline: "Speckled Industrial Stone Texture",
    frontImage: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=1000&q=80",
    backImage: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80",
    swatches: ["#e5e5ea", "#d1d1d6", "#a1a1a6"],
    specs: {
      material: "Tactile Matte Mineral Composite",
      precision: "Apple Logo Cutout & Trackpad Guard",
      protection: "Thermal Vents Unlocked Shielding",
      airRelease: "Precision Grid Adhesive Matrix"
    }
  },
  {
    id: "crimson-lava",
    name: "Crimson Ember Magma",
    category: "Gaming",
    deviceModel: "Xbox Series X / Elite Controller",
    price: "$37.99",
    rating: 4.94,
    reviewsCount: 205,
    badge: "HOT ITEM",
    tagline: "Deep Volcanic Glow Texture",
    frontImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80",
    backImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80",
    swatches: ["#972828", "#E45742", "#FCAD38"],
    specs: {
      material: "3M™ Dual-Layer High Heat Vinyl",
      precision: "Ergonomic Grip Zone Stippling",
      protection: "High-Temperature Gaming Resilience",
      airRelease: "Air-Pocket Zero Micro Channels"
    }
  }
];

const DEVICE_FILTERS: FilterItem[] = [
  { id: "All Devices", label: "All Devices", icon: FaLayerGroup },
  { id: "iPhone", label: "iPhone", icon: FaMobileAlt },
  { id: "MacBook", label: "MacBook", icon: FaLaptop },
  { id: "iPad", label: "iPad", icon: FaTabletAlt },
  { id: "Gaming", label: "Gaming", icon: FaGamepad },
  { id: "Samsung", label: "Samsung", icon: FaMobileAlt },
];

export default function DeviceSelectorSection() {
  const [activeCategory, setActiveCategory] = useState("All Devices");
  const [selectedProduct, setSelectedProduct] = useState<SkinProduct | null>(null);

  const filteredProducts = activeCategory === "All Devices"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section id="devices" className="relative w-full py-20 md:py-32 px-4 sm:px-6 select-none overflow-hidden">
      {/* Background ambient glow matching brand tokens */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-orange/10 blur-[160px] opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-bg-elevated/90 px-4 py-1.5 backdrop-blur-md"
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
          Filter by hardware, preview 3D tactile materials, and inspect micro-laser engineering specifications.
        </motion.p>

        {/* FilterDisclosure Control */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 md:mt-14 mb-14 flex justify-center w-full max-w-full py-2 px-2"
        >
          <FilterDisclosure
            items={DEVICE_FILTERS}
            defaultActiveId="All Devices"
            onChange={(id) => setActiveCategory(id)}
          />
        </motion.div>

        {/* Product Cards Grid: 3-Column Layout */}
        <motion.div
          layout
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex"
                >
                  <div className="group relative flex flex-col justify-between w-full rounded-2xl border border-white/10 bg-bg-elevated/90 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-2xl hover:shadow-black/70 backdrop-blur-md">
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-bg">
                      <Image
                        src={product.frontImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Content: Name & Price */}
                    <div className="mt-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-fg group-hover:text-gold transition-colors leading-snug">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-xl font-extrabold text-gold">
                          {product.price}
                        </p>
                      </div>

                      {/* Button to See Details */}
                      <SecondaryButton
                        variant="subtle"
                        size="sm"
                        className="mt-4 w-full"
                        iconRight={<GoArrowRight className="h-4 w-4" />}
                        onClick={() => setSelectedProduct(product)}
                      >
                        See details
                      </SecondaryButton>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Product Details Modal */}
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
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-bg mb-4">
                  <Image
                    src={selectedProduct.frontImage}
                    alt={selectedProduct.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                  />
                </div>

                {/* Modal Title & Price */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="text-xs font-mono uppercase text-gold tracking-wider block mb-1">
                      {selectedProduct.category} Series • {selectedProduct.deviceModel}
                    </span>
                    <h3 className="text-2xl font-bold text-fg tracking-tight">
                      {selectedProduct.name}
                    </h3>
                  </div>
                  <span className="text-2xl font-black text-gold shrink-0">
                    {selectedProduct.price}
                  </span>
                </div>

                <p className="text-sm text-fg-muted mb-4">
                  {selectedProduct.tagline}
                </p>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs">
                  <div className="p-2.5 rounded-lg bg-ink-800 border border-white/5">
                    <span className="text-ink-400 font-mono text-[10px] uppercase block">Material</span>
                    <span className="text-fg font-medium leading-snug">{selectedProduct.specs.material}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-ink-800 border border-white/5">
                    <span className="text-ink-400 font-mono text-[10px] uppercase block">Precision</span>
                    <span className="text-fg font-medium leading-snug">{selectedProduct.specs.precision}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-ink-800 border border-white/5">
                    <span className="text-ink-400 font-mono text-[10px] uppercase block">Protection</span>
                    <span className="text-fg font-medium leading-snug">{selectedProduct.specs.protection}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-ink-800 border border-white/5">
                    <span className="text-ink-400 font-mono text-[10px] uppercase block">Air Release</span>
                    <span className="text-fg font-medium leading-snug">{selectedProduct.specs.airRelease}</span>
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
                      alert(`Added ${selectedProduct.name} to cart!`);
                      setSelectedProduct(null);
                    }}
                  >
                    Buy Skin • {selectedProduct.price}
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
