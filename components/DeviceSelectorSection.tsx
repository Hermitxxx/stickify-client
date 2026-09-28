"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FilterDisclosure, FilterItem } from "./filter-disclosure";
import FlipCard from "./FlipCard";
import PrimaryButton from "./PrimaryButton";
import { GoStar, GoCheckCircle, GoCpu, GoShieldCheck, GoZap, GoArrowRight } from "react-icons/go";
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
  const [activeSwatch, setActiveSwatch] = useState<Record<string, number>>({});

  const filteredProducts = activeCategory === "All Devices"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleSwatchClick = (productId: string, swatchIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSwatch((prev) => ({ ...prev, [productId]: swatchIdx }));
  };

  return (
    <section id="devices" className="relative w-full py-20 md:py-32 px-4 sm:px-6 select-none overflow-hidden">
      {/* Background ambient glow matching brand tokens */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#EB7F31]/10 blur-[160px] opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#131110]/90 px-4 py-1.5 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-[#FCAD38] animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-[#cabaa9] uppercase">
            3M PRECISION ENGINEERED SKINS
          </span>
        </motion.div>

        {/* Big Centred Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#faf7f2] text-center max-w-4xl mx-auto leading-[1.08]"
        >
          Pick your device.{" "}
          <span className="bg-gradient-to-r from-[#FCAD38] via-[#EB7F31] to-[#E45742] bg-clip-text text-transparent">
            Elevate your style.
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-[#cabaa9] text-center max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Filter by hardware, preview 3D tactile materials, and flip cards to inspect micro-laser engineering specifications.
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

        {/* Product Cards Grid: 2 Column Grid Layout */}
        <motion.div
          layout
          className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 max-w-6xl mx-auto items-center justify-items-center"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex justify-center"
                >
                  <FlipCard
                    width={540}
                    height={420}
                    radius={24}
                    background="#131110"
                    shadow
                    shadowColor="#000000"
                    shadowOpacity={0.65}
                    hoverScale={1.02}
                    stiffness={160}
                    damping={18}
                    glareOpacity={0.22}
                    className="w-full max-w-[540px] shadow-2xl transition-all"
                    front={
                      <div className="relative w-full h-full overflow-hidden flex flex-col justify-between p-6">
                        {/* Front Background Image */}
                        <img
                          src={product.frontImage}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/50 to-black/60" />

                        {/* Top Header Row */}
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {product.badge && (
                              <span className="px-3 py-1 rounded-full bg-[#E45742] text-[#faf7f2] font-mono text-[10px] font-bold tracking-wider uppercase shadow-md">
                                {product.badge}
                              </span>
                            )}
                            <span className="px-3 py-1 rounded-full bg-black/60 text-white/90 font-sans text-[11px] font-medium backdrop-blur-md">
                              {product.deviceModel}
                            </span>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-[#FCAD38] text-xs font-semibold backdrop-blur-md">
                            <GoStar className="w-3.5 h-3.5 fill-[#FCAD38]" />
                            <span>{product.rating}</span>
                            <span className="text-[#cabaa9] text-[10px]">({product.reviewsCount})</span>
                          </div>
                        </div>

                        {/* Bottom Content Area */}
                        <div className="relative z-10 space-y-3 pt-12">
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xs font-mono tracking-wider text-[#FCAD38] uppercase">
                                {product.category} Series
                              </p>
                              <h3 className="text-2xl font-bold text-[#faf7f2] tracking-tight mt-0.5">
                                {product.name}
                              </h3>
                              <p className="text-sm text-[#cabaa9] font-normal mt-1">
                                {product.tagline}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-black text-[#faf7f2] tracking-tight font-sans">
                                {product.price}
                              </span>
                            </div>
                          </div>

                          {/* Interactive Swatch & Flip Hint */}
                          <div className="pt-3 flex items-center justify-between border-t border-white/10">
                            <div className="flex items-center gap-2">
                              {product.swatches.map((color, idx) => (
                                <button
                                  key={idx}
                                  onClick={(e) => handleSwatchClick(product.id, idx, e)}
                                  className={`w-4 h-4 rounded-full border transition-all ${
                                    (activeSwatch[product.id] || 0) === idx
                                      ? "border-[#FCAD38] scale-125 shadow-md"
                                      : "border-transparent opacity-70 hover:opacity-100"
                                  }`}
                                  style={{ backgroundColor: color }}
                                  title="Texture Variant"
                                />
                              ))}
                            </div>

                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FCAD38] bg-[#FCAD38]/10 px-3 py-1 rounded-full backdrop-blur-md">
                              <svg className="w-3.5 h-3.5 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.035 8.035 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Click or Drag to Flip
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                    back={
                      <div className="relative w-full h-full overflow-hidden p-6 flex flex-col justify-between bg-[#131110]">
                        {/* Detailed Back Image */}
                        <img
                          src={product.backImage}
                          alt={`${product.name} macro details`}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#131110]/90 via-[#131110]/95 to-[#0a0908]" />

                        {/* Top Header */}
                        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
                          <div>
                            <span className="text-[11px] font-mono tracking-widest text-[#FCAD38] uppercase">
                              TECH SPECIFICATIONS
                            </span>
                            <h4 className="text-xl font-bold text-white tracking-tight">
                              {product.name}
                            </h4>
                          </div>
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#201c1a] text-[#cabaa9]">
                            0.05mm Fit
                          </span>
                        </div>

                        {/* Specs Grid */}
                        <div className="relative z-10 grid grid-cols-2 gap-3 my-3">
                          <div className="p-2.5 rounded-xl bg-[#201c1a]/70 flex items-start gap-2.5">
                            <GoCpu className="w-4 h-4 text-[#FCAD38] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] text-[#cabaa9] uppercase font-mono">Material</p>
                              <p className="text-xs font-medium text-[#faf7f2] leading-snug">{product.specs.material}</p>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#201c1a]/70 flex items-start gap-2.5">
                            <GoShieldCheck className="w-4 h-4 text-[#E45742] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] text-[#cabaa9] uppercase font-mono">Cut Precision</p>
                              <p className="text-xs font-medium text-[#faf7f2] leading-snug">{product.specs.precision}</p>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#201c1a]/70 flex items-start gap-2.5">
                            <GoCheckCircle className="w-4 h-4 text-[#972828] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] text-[#cabaa9] uppercase font-mono">Protection</p>
                              <p className="text-xs font-medium text-[#faf7f2] leading-snug">{product.specs.protection}</p>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#201c1a]/70 flex items-start gap-2.5">
                            <GoZap className="w-4 h-4 text-[#FCAD38] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] text-[#cabaa9] uppercase font-mono">Air Release</p>
                              <p className="text-xs font-medium text-[#faf7f2] leading-snug">{product.specs.airRelease}</p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Actions Bar */}
                        <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Customize ${product.name} in 3D Studio coming soon!`);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-[#201c1a] hover:bg-[#322b27] text-[#faf7f2] text-xs font-semibold transition-all flex items-center gap-1.5"
                          >
                            <span>3D Studio</span>
                            <GoArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <PrimaryButton
                            variant="gradient"
                            size="sm"
                            onClick={() => {
                              alert(`Added ${product.name} (${product.deviceModel}) to cart!`);
                            }}
                          >
                            Buy Skin • {product.price}
                          </PrimaryButton>
                        </div>
                      </div>
                    }
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
