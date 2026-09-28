import React from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between bg-bg text-fg overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Subtle calibrated background ambiance (no purple, no neon) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-b from-maroon/15 via-orange/10 to-transparent blur-3xl opacity-60"
      />

      {/* Top minimal bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-sans font-bold tracking-tight text-lg text-fg hover:text-gold transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-lg px-2 py-1"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-brand" />
          <span>STICKIFY</span>
        </Link>

        <Link
          href="/"
          className="font-sans text-xs text-fg-muted hover:text-fg transition-colors border border-border/60 rounded-full px-3.5 py-1.5 hover:border-border hover:bg-bg-elevated focus-visible:outline-2 focus-visible:outline-accent"
        >
          Back to store
        </Link>
      </header>

      {/* Main Form Slot */}
      <main className="relative z-10 my-auto py-10 flex items-center justify-center">
        <Reveal direction="up" duration={0.5} className="w-full">
          {children}
        </Reveal>
      </main>

      {/* Bottom Legal / Help Bar */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans text-fg-muted/60 border-t border-border/40 pt-6">
        <p>© {new Date().getFullYear()} Stickify Inc. Engineered 3M vinyl precision.</p>
        <div className="flex items-center gap-6">
          <Link
            href="/terms"
            className="hover:text-fg transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="hover:text-fg transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
