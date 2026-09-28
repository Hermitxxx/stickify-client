"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export interface RevealGroupProps {
  children: ReactNode;
  stagger?: number;
  once?: boolean;
  amount?: number;
  className?: string;
}

export function RevealGroup({
  children,
  stagger = 0.08,
  once = true,
  amount = 0.15,
  className,
}: RevealGroupProps) {
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger } },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

export default RevealGroup;
