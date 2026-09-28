"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

const styles = {
  srOnly: {
    position: "absolute" as const,
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap" as const,
    border: 0,
    visibility: "hidden" as const,
  },
};

export interface DecryptedTextProps extends HTMLMotionProps<"span"> {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: "view" | "hover";
}

export function DecryptedText({
  text,
  speed = 40,
  maxIterations = 8,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&*",
  className = "text-fg",
  parentClassName = "",
  encryptedClassName = "text-gold/70 font-mono",
  animateOn = "view",
  ...props
}: DecryptedTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState<string>(() => text);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(() => new Set());
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const orderRef = useRef<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const availableChars = useMemo<string[]>(() => {
    return characters.split("");
  }, [characters]);

  const shuffleText = useCallback(
    (originalText: string, currentRevealed: Set<number>) => {
      return originalText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join("");
    },
    [availableChars]
  );

  const computeOrder = useCallback((len: number): number[] => {
    const order: number[] = [];
    for (let i = 0; i < len; i++) order.push(i);
    return order;
  }, []);

  const triggerDecrypt = useCallback(() => {
    if (shouldReduceMotion) {
      setDisplayText(text);
      return;
    }
    orderRef.current = computeOrder(text.length);
    setRevealedIndices(new Set());
    setIsAnimating(true);
  }, [computeOrder, text, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || !isAnimating) return;

    let iteration = 0;

    intervalRef.current = setInterval(() => {
      setRevealedIndices((prevRevealed) => {
        if (prevRevealed.size < text.length) {
          const nextIndex = prevRevealed.size;
          const newRevealed = new Set(prevRevealed);
          newRevealed.add(nextIndex);
          setDisplayText(shuffleText(text, newRevealed));
          return newRevealed;
        }

        iteration++;
        if (iteration >= maxIterations || prevRevealed.size >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsAnimating(false);
          setDisplayText(text);
        }
        return prevRevealed;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, text, speed, maxIterations, shuffleText, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (animateOn !== "view") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            triggerDecrypt();
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [animateOn, hasAnimated, triggerDecrypt, shouldReduceMotion]);

  const handleMouseEnter = () => {
    if (animateOn === "hover" && !isAnimating) {
      triggerDecrypt();
    }
  };

  return (
    <motion.span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={cn("inline-block whitespace-pre-wrap select-none", parentClassName)}
      {...props}
    >
      <span className="sr-only" style={styles.srOnly}>
        {displayText}
      </span>

      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealed = revealedIndices.has(index) || !isAnimating || Boolean(shouldReduceMotion);

          return (
            <span
              key={index}
              className={isRevealed ? className : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}

export default DecryptedText;
