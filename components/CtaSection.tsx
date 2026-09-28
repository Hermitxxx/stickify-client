"use client";

import React from "react";
import { motion } from "motion/react";
import { GoArrowRight, GoShieldCheck } from "react-icons/go";
import { HiSparkles } from "react-icons/hi2";

export default function CtaSection() {
  return (
    <section id="cta" className="relative w-full py-24 md:py-36 px-4 sm:px-6 select-none overflow-hidden">
      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-r from-[#EB7F31]/15 via-[#FCAD38]/10 to-transparent blur-[160px] opacity-40" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Top Badge matching reference pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FCAD38]/30 bg-[#FCAD38]/10 px-4 py-1.5 backdrop-blur-md"
        >
          <HiSparkles className="w-4 h-4 text-[#FCAD38]" />
          <span className="text-xs font-bold tracking-wider text-[#FCAD38] uppercase">
            3D CUSTOMIZER STUDIO
          </span>
        </motion.div>

        {/* Huge Headline matching reference typography */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#faf7f2] max-w-4xl mx-auto leading-[1.05]"
        >
          Every Curve{" "}
          <span className="bg-gradient-to-r from-[#FCAD38] via-[#EB7F31] to-[#E45742] bg-clip-text text-transparent">
            Covered.
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-[#cabaa9] max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Transforming ordinary hardware into tactile masterpieces. Premium 3M vinyl protection custom-cut to 0.05mm precision with air-release technology.
        </motion.p>

        {/* Floating Indicator Dot & Action Button Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          {/* Glowing accent dot */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#E45742] animate-pulse" />

          {/* Action Pill matching reference layout */}
          <button
            onClick={() => {
              const devicesEl = document.getElementById("devices");
              if (devicesEl) devicesEl.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative inline-flex items-center gap-3.5 rounded-full border border-white/10 bg-[#131110]/90 p-2 pr-7 text-base md:text-lg font-semibold text-[#faf7f2] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-[#201c1a] hover:shadow-2xl cursor-pointer"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#E45742] to-[#EB7F31] text-[#0a0908] shadow-md transition-transform duration-300 group-hover:scale-110">
              <GoArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
            <span>Design Your Custom Skin</span>
          </button>
        </motion.div>

        {/* Visual Media Showcase Frame matching reference */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#131110]/80 p-3 shadow-2xl backdrop-blur-xl"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#0a0908]">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
              alt="Stickify Precision Custom Skin Studio"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-transparent to-black/30" />

            {/* Overlay Feature Badges */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs md:text-sm font-medium text-[#faf7f2] backdrop-blur-md">
                <GoShieldCheck className="h-4 w-4 text-[#FCAD38]" />
                <span>3M Architectural Grade Vinyl</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs md:text-sm font-medium text-[#faf7f2] backdrop-blur-md">
                <span>0.05mm Micro-Laser Cut Precision</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
