import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stickify — Creative Skins & Precision Wraps",
  description: "Tactile 3M vinyl protection, custom-engineered cuts, and radiant finishes for phones, laptops, and tablets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased dark font-sans",
        geistSans.variable,
        geistMono.variable,
        figtree.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg font-sans selection:bg-gold selection:text-ink-950">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
