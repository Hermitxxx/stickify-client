"use client";

import React from "react";
import { motion } from "motion/react";
import { AccordionApp, AccordionItemData } from "./card-split-accordian";
import { Layers } from "lucide-react";
import { HiCursorArrowRipple } from "react-icons/hi2";
import { IoIosTimer } from "react-icons/io";
import { PiHandTap } from "react-icons/pi";
import { GoShieldCheck } from "react-icons/go";

const HOW_IT_WORKS_ITEMS: AccordionItemData[] = [
  {
    id: 1,
    title: "01. Select Your Device Hardware",
    icon: <Layers className="size-7 md:size-8 text-[#FCAD38] shrink-0" />,
    content:
      "Select your exact phone, laptop, tablet, or gaming console model. Every skin is digitally calibrated to 0.05mm zero-gap precision around ports, speakers, and camera bumps.",
  },
  {
    id: 2,
    title: "02. Choose Tactile Material & Finish",
    icon: <HiCursorArrowRipple className="size-7 md:size-8 text-[#EB7F31] shrink-0" />,
    content:
      "Explore authentic 3M architectural vinyl textures — from full-grain Cognac Leather and Cyber Carbon Fiber to Velvet Soft-Touch Matte Obsidian and Iridescent Holographic Nebulas.",
  },
  {
    id: 3,
    title: "03. Precision Laser Cut & Rapid Shipping",
    icon: <IoIosTimer className="size-7 md:size-8 text-[#E45742] shrink-0" />,
    content:
      "We custom-cut your skin using zero-gap micro-laser calibration. Engineered with invisible air-release adhesive channels for bubble-free snap application out of the box.",
  },
  {
    id: 4,
    title: "04. Easy 5-Minute Apply & Clean Peel",
    icon: <PiHandTap className="size-7 md:size-8 text-[#972828] shrink-0" />,
    content:
      "Align, press, and smooth down using gentle warmth from a hairdryer for tight curved contours. When you want a new style, enjoy a 100% clean peel with zero sticky residue.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative w-full py-20 md:py-32 px-4 sm:px-6 select-none overflow-hidden">
      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#FCAD38]/10 blur-[150px] opacity-30" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#131110]/90 px-4 py-1.5 backdrop-blur-md border border-[#322b27]"
        >
          <GoShieldCheck className="w-4 h-4 text-[#FCAD38]" />
          <span className="text-xs font-bold tracking-wider text-[#cabaa9] uppercase">
            3-MINUTE WRAP GUIDE
          </span>
        </motion.div>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#faf7f2] text-center max-w-3xl mx-auto leading-[1.08]"
        >
          How it works.{" "}
          <span className="bg-gradient-to-r from-[#FCAD38] via-[#EB7F31] to-[#E45742] bg-clip-text text-transparent">
            Precision in every step.
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
          Transforming your device takes under five minutes. Explore our zero-hassle application guide below.
        </motion.p>

        {/* Card Split Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 md:mt-16 w-full flex justify-center"
        >
          <AccordionApp items={HOW_IT_WORKS_ITEMS} defaultOpenId={1} />
        </motion.div>
      </div>
    </section>
  );
}
