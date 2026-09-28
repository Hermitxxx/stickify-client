"use client";

import Link from "next/link";
import { DecryptedText } from "@/components/motion/react-bits/DecryptedText";

interface AuthHeaderProps {
  badgeText: string;
  title: string;
  subtitle: string;
}

export function AuthHeader({ badgeText, title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-3 mb-8">
      {/* Brand Mark Link */}
      <Link
        href="/"
        className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-bg-elevated/80 px-4 py-1.5 transition-all duration-200 hover:border-border-strong hover:bg-bg-elevated"
      >
        <span className="h-2 w-2 rounded-full bg-gradient-brand animate-pulse" />
        <span className="font-sans text-xs font-semibold tracking-wider text-fg uppercase">
          Stickify
        </span>
        <span className="text-fg-muted/40">/</span>
        <DecryptedText
          text={badgeText}
          speed={35}
          className="text-xs font-mono uppercase text-gold"
          encryptedClassName="text-xs font-mono text-gold/40"
        />
      </Link>

      {/* Main Title */}
      <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-fg">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="max-w-md font-sans text-sm text-fg-muted leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

export default AuthHeader;
