"use client";

import { motion } from "motion/react";
import CardNav, { CardNavItem } from "@/components/layout/CardNav";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { GoArrowRight } from "react-icons/go";

const NAV_ITEMS: CardNavItem[] = [
  {
    label: "Skins & Materials",
    bgColor: "var(--color-ink-900)",
    textColor: "var(--color-ink-50)",
    links: [
      { label: "Textured Leather", href: "#skins", ariaLabel: "Textured Leather Skins" },
      { label: "Cyber Carbon Fiber", href: "#skins", ariaLabel: "Cyber Carbon Skins" },
      { label: "Matte & Gloss Finish", href: "#skins", ariaLabel: "Matte Finish Skins" },
      { label: "Iridescent Holographic", href: "#skins", ariaLabel: "Holographic Skins" },
    ],
  },
  {
    label: "Supported Devices",
    bgColor: "var(--color-ink-800)",
    textColor: "var(--color-ink-50)",
    links: [
      { label: "iPhone & Android", href: "#devices", ariaLabel: "Smartphone Skins" },
      { label: "MacBook & Laptops", href: "#devices", ariaLabel: "Laptop Skins" },
      { label: "iPad & Tablets", href: "#devices", ariaLabel: "Tablet Skins" },
      { label: "Gaming Consoles & Controllers", href: "#devices", ariaLabel: "Console Skins" },
    ],
  },
  {
    label: "Explore Stickify",
    bgColor: "var(--color-ink-700)",
    textColor: "var(--color-ink-50)",
    links: [
      { label: "3D Customizer Studio", href: "#customizer", ariaLabel: "3D Customizer Studio" },
      { label: "Precision Fit Guarantee", href: "#guarantee", ariaLabel: "Precision Fit Guarantee" },
      { label: "Easy Installation Video", href: "#install", ariaLabel: "Installation Video" },
      { label: "Customer Showcase Gallery", href: "#showcase", ariaLabel: "Customer Gallery" },
    ],
  },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-transparent text-fg select-none">

      {/* Floating Card Navigation Bar */}
      <CardNav
        logo="/stickify-logo.svg"
        logoAlt="Stickify Logo"
        items={NAV_ITEMS}
        baseColor="rgba(19, 17, 16, 0.88)"
        menuColor="var(--color-ink-50)"
        buttonBgColor="var(--color-orange)"
        buttonTextColor="var(--color-ink-950)"
        ease="power3.out"
      />

      {/* Main Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-36 pb-24 md:pt-44 md:pb-32 flex flex-col items-center text-center">
        {/* Top Feature Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 pr-5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
        >
          <span className="rounded-full bg-gradient-to-r from-maroon via-red to-orange px-3 py-1 font-mono text-xs font-bold tracking-wider text-white uppercase shadow-sm">
            NEW
          </span>
          <span className="text-xs font-medium tracking-wide text-fg-muted md:text-sm">
            Creative Skins & Precision Wraps
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-4xl font-extrabold tracking-tight text-fg sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08]"
        >
          Radiant beams for creative{" "}
          <span className="relative inline-block bg-gradient-to-r from-gold via-orange to-red bg-clip-text text-transparent">
            user interfaces
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-base text-ink-400 sm:text-lg md:text-xl font-normal leading-relaxed"
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
          {/* Primary Button */}
          <PrimaryButton
            size="lg"
            variant="gradient"
            onClick={() => {
              const customizerEl = document.getElementById("devices");
              if (customizerEl) customizerEl.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Get started
          </PrimaryButton>

          {/* Secondary Button */}
          <SecondaryButton
            size="lg"
            iconRight={<GoArrowRight className="h-4 w-4" />}
            onClick={() => {
              const customizerEl = document.getElementById("devices");
              if (customizerEl) customizerEl.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Learn more
          </SecondaryButton>
        </motion.div>
      </div>
    </section>
  );
}
