"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export type RevealDirection = "up" | "down" | "left" | "right" | "fade";

export interface RevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  className?: string;
}

const OFFSET: Record<RevealDirection, { x: number; y: number }> = {
  up:    { x: 0, y: 32 },
  down:  { x: 0, y: -32 },
  left:  { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  fade:  { x: 0, y: 0 },
};

/**
 * Universal reveal wrapper — wrap sections, text blocks, cards, or lists
 * with consistent viewport scroll-reveal animations.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.2,
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const { x, y } = OFFSET[direction];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: reduceMotion ? 0 : x,
      y: reduceMotion ? 0 : y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // house easing curve
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
