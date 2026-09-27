"use client";

import { motion } from "motion/react";
import CardNav, { CardNavItem } from "./CardNav";
import SpecularButton from "./SpecularButton";
import HeroBeams from "./HeroBeams";
import { GoArrowRight } from "react-icons/go";

const NAV_ITEMS: CardNavItem[] = [
  {
    label: "Skins & Materials",
    bgColor: "#1c1715",
    textColor: "#faf7f2",
    links: [
      { label: "Textured Leather", href: "#skins", ariaLabel: "Textured Leather Skins" },
      { label: "Cyber Carbon Fiber", href: "#skins", ariaLabel: "Cyber Carbon Skins" },
      { label: "Matte & Gloss Finish", href: "#skins", ariaLabel: "Matte Finish Skins" },
      { label: "Iridescent Holographic", href: "#skins", ariaLabel: "Holographic Skins" },
    ],
  },
  {
    label: "Supported Devices",
    bgColor: "#281e19",
    textColor: "#faf7f2",
    links: [
      { label: "iPhone & Android", href: "#devices", ariaLabel: "Smartphone Skins" },
      { label: "MacBook & Laptops", href: "#devices", ariaLabel: "Laptop Skins" },
      { label: "iPad & Tablets", href: "#devices", ariaLabel: "Tablet Skins" },
      { label: "Gaming Consoles & Controllers", href: "#devices", ariaLabel: "Console Skins" },
    ],
  },
  {
    label: "Explore Stickify",
    bgColor: "#36261f",
    textColor: "#faf7f2",
    links: [
      { label: "3D Customizer Studio", href: "#customizer", ariaLabel: "3D Customizer Studio" },
      { label: "Precision Fit Guarantee", href: "#guarantee", ariaLabel: "Precision Fit Guarantee" },
      { label: "Easy Installation Video", href: "#install", ariaLabel: "Installation Video" },
      { label: "Customer Showcase Gallery", href: "#showcase", ariaLabel: "Customer Gallery" },
    ],
  },
];

const AMBER_LEATHER_COLOR = "#FCAD38";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0a0908] text-[#faf7f2] select-none">
      {/* 3D Radiant Beams Background */}
      <HeroBeams className="opacity-90" />

      {/* Subtle Background Gradients & Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0908]/70 via-transparent to-[#0a0908]" />
      <div 
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px] opacity-25 transition-all duration-700"
        style={{ background: AMBER_LEATHER_COLOR }}
      />

      {/* Floating Card Navigation Bar */}
      <CardNav
        logo="/stickify-logo.svg"
        logoAlt="Stickify Logo"
        items={NAV_ITEMS}
        baseColor="rgba(19, 17, 16, 0.88)"
        menuColor="#faf7f2"
        buttonBgColor="#EB7F31"
        buttonTextColor="#0a0908"
        ease="power3.out"
      />

      {/* Main Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-36 pb-24 md:pt-44 md:pb-32 flex flex-col items-center text-center">
        {/* Top Feature Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] p-1.5 pr-5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.08]"
        >
          <span className="rounded-full bg-gradient-to-r from-[#972828] via-[#E45742] to-[#EB7F31] px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-white uppercase shadow-sm">
            NEW
          </span>
          <span className="text-xs font-medium tracking-wide text-[#cabaa9] md:text-sm">
            Creative Skins & Precision Wraps
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-4xl font-extrabold tracking-tight text-[#faf7f2] sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08]"
        >
          Radiant beams for creative{" "}
          <span className="relative inline-block bg-gradient-to-r from-[#FCAD38] via-[#EB7F31] to-[#E45742] bg-clip-text text-transparent">
            user interfaces
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-base text-[#9c8b7c] sm:text-lg md:text-xl font-normal leading-relaxed"
        >
          Ultra-thin 3M vinyl protection with zero bulk. Custom-engineered cuts, rich tactile textures, and vibrant ambient finishes tailored for your devices.
        </motion.p>

        {/* Action Buttons Container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {/* Primary Button using SpecularButton */}
          <SpecularButton
            size="lg"
            radius={18}
            tint="#EB7F31"
            tintOpacity={0.15}
            blur={8}
            textColor="#faf7f2"
            lineColor="#FCAD38"
            baseColor="#972828"
            intensity={1.2}
            shineSize={12}
            shineFade={35}
            thickness={1.4}
            speed={0.4}
            followMouse
            proximity={300}
            autoAnimate
            onClick={() => {
              const customizerEl = document.getElementById("devices");
              if (customizerEl) customizerEl.scrollIntoView({ behavior: "smooth" });
            }}
            className="font-semibold shadow-lg shadow-orange-950/20"
          >
            Get started
          </SpecularButton>

          {/* Secondary Button */}
          <button
            type="button"
            onClick={() => {
              const customizerEl = document.getElementById("devices");
              if (customizerEl) customizerEl.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative inline-flex items-center gap-2 rounded-[18px] border border-[#322b27] bg-[#131110]/80 px-8 py-[18px] text-[1.15rem] font-medium text-[#faf7f2] backdrop-blur-md transition-all duration-300 hover:border-[#6b5d51] hover:bg-[#201c1a] hover:shadow-lg focus:outline-none"
          >
            <span>Learn more</span>
            <GoArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[#6b5d51]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#4a8f5c] animate-pulse" />
          <span>Precision 3M Vinyl • Amber Leather Finish • 0.23mm Thickness</span>
        </div>
      </div>
    </section>
  );
}
