"use client";

import React, { useLayoutEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import { LogOut, LayoutDashboard, User, Loader2 } from "lucide-react";
import { useSession, signOut } from "@/lib/auth/auth-client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectBookmarksCount } from "@/lib/redux/slices/bookmarksSlice";

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
  onClick?: () => void;
  isAction?: boolean;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo?: string;
  logoAlt?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  position?: "fixed" | "sticky" | "absolute";
}

const CardNav: React.FC<CardNavProps> = ({
  logo = "/stickify-logo.svg",
  logoAlt = "Stickify Logo",
  className = "",
  ease = "power3.out",
  baseColor = "rgba(19, 17, 16, 0.92)",
  menuColor = "var(--color-ink-50)",
  position = "fixed",
}) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const dispatch = useAppDispatch();
  const bookmarksCount = useAppSelector(selectBookmarksCount);

  // Dynamic real navigation cards
  const navItems: CardNavItem[] = [
    {
      label: "Sticker Collection",
      bgColor: "var(--color-ink-900)",
      textColor: "var(--color-ink-50)",
      links: [
        { label: "All Products Catalogue", href: "/products", ariaLabel: "Browse All Products" },
        { label: "Phone Artworks", href: "/products?device=Phone", ariaLabel: "Phone Stickers" },
        { label: "Tablet Artworks", href: "/products?device=Tablet", ariaLabel: "Tablet Stickers" },
        { label: "Laptop Artworks", href: "/products?device=Laptop", ariaLabel: "Laptop Stickers" },
      ],
    },
    {
      label: "Stickify Experience",
      bgColor: "var(--color-ink-800)",
      textColor: "var(--color-ink-50)",
      links: [
        { label: "How It Works", href: "/#how-it-works", ariaLabel: "How Stickify Works" },
        { label: "3M Precision Fit Guarantee", href: "/#cta", ariaLabel: "Precision Fit Guarantee" },
        { label: "Interactive Customizer", href: "/#devices", ariaLabel: "Customizer Studio" },
      ],
    },
    {
      label: session ? "Vault & Profile" : "Account Access",
      bgColor: "var(--color-ink-700)",
      textColor: "var(--color-ink-50)",
      links: session
        ? [
            { label: "My Dashboard", href: "/dashboard", ariaLabel: "User Dashboard" },
            ...((session.user as { role?: string })?.role === "admin"
              ? [{ label: "Admin Console", href: "/dashboard/admin", ariaLabel: "Admin Console" }]
              : []),
            {
              label:
                bookmarksCount > 0
                  ? `Saved Cuts (${bookmarksCount})`
                  : "Saved Device Cuts",
              href: "/dashboard",
              ariaLabel: "Saved Cuts",
            },
            {
              label: isSigningOut ? "Signing out..." : "Log Out",
              href: "#signout",
              ariaLabel: "Sign out of account",
              onClick: handleSignOut,
              isAction: true,
            },
          ]
        : [
            { label: "Sign In", href: "/login", ariaLabel: "Sign In to Stickify" },
            { label: "Create Account", href: "/register", ariaLabel: "Create Stickify Account" },
            { label: "Order Tracking", href: "/login", ariaLabel: "Track Order" },
          ],
    },
  ];

  const calculateHeight = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        void contentEl.offsetHeight; // Force reflow cleanly

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  }, []);

  const createTimeline = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1"
    );

    return tl;
  }, [calculateHeight, ease]);

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [createTimeline]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded, calculateHeight, createTimeline]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const closeMenu = () => {
    const tl = tlRef.current;
    if (!tl || !isExpanded) return;
    setIsHamburgerOpen(false);
    tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
    tl.reverse();
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  const positionClass =
    position === "sticky"
      ? "sticky"
      : position === "absolute"
      ? "absolute"
      : "fixed";

  return (
    <div
      className={`card-nav-container ${positionClass} left-1/2 -translate-x-1/2 w-[92%] max-w-[850px] z-40 top-4 md:top-6 transition-all duration-300 ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${
          isExpanded ? "open" : ""
        } block h-[60px] p-0 rounded-2xl shadow-2xl relative overflow-hidden will-change-[height] border border-white/10 backdrop-blur-xl`}
        style={{ backgroundColor: baseColor }}
      >
        {/* Top Navbar Row */}
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-3 sm:pl-[1.1rem] z-[2]">
          {/* Hamburger Menu Toggle */}
          <div
            className={`hamburger-menu ${
              isHamburgerOpen ? "open" : ""
            } group h-full flex items-center justify-center cursor-pointer gap-2 px-2 rounded-xl hover:bg-white/5 transition-colors`}
            onClick={toggleMenu}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMenu();
              }
            }}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={{ color: menuColor || "#000" }}
          >
            <div className="flex flex-col gap-[5px] justify-center items-center">
              <div
                className={`hamburger-line w-[22px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                  isHamburgerOpen ? "translate-y-[3.5px] rotate-45" : ""
                } group-hover:opacity-75`}
              />
              <div
                className={`hamburger-line w-[22px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                  isHamburgerOpen ? "-translate-y-[3.5px] -rotate-45" : ""
                } group-hover:opacity-75`}
              />
            </div>
            <span className="hidden sm:inline font-sans text-xs font-semibold text-fg-muted group-hover:text-fg transition-colors">
              Menu
            </span>
          </div>

          {/* Logo in Center */}
          <div className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            <Link
              href="/"
              onClick={closeMenu}
              className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Image
                src={logo}
                alt={logoAlt}
                width={120}
                height={26}
                priority
                className="h-[26px] w-auto"
              />
            </Link>
          </div>

          {/* Dynamic Top Bar Navigation & Auth Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/products"
              onClick={closeMenu}
              className="text-xs font-semibold text-fg hover:text-gold transition-colors px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-border"
            >
              Products
            </Link>

            {isPending ? (
              <div className="h-8 w-20 rounded-xl bg-ink-800/80 animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg hover:text-gold transition-colors px-3 py-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-border"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-orange" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger hover:text-red transition-colors px-2.5 py-1.5 rounded-xl hover:bg-danger/10 border border-danger/25 disabled:opacity-40"
                  aria-label="Log out"
                >
                  {isSigningOut ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <LogOut className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {isSigningOut ? "..." : "Log out"}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="text-xs font-semibold text-fg hover:text-gold transition-colors px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-white/5"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="h-9 px-3.5 sm:px-4 rounded-xl bg-gradient-brand text-xs font-bold text-on-accent inline-flex items-center justify-center hover:opacity-95 transition-all active:scale-95 shadow-md shadow-orange/20"
                >
                  <span className="hidden sm:inline">Create Account</span>
                  <span className="sm:hidden">Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Navigation Cards */}
        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-3 sm:p-4 flex flex-col items-stretch gap-2.5 justify-start z-[1] ${
            isExpanded
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none"
          } md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {navItems.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col gap-2 p-[14px_18px] rounded-xl min-w-0 flex-[1_1_auto] h-auto min-h-[60px] md:h-full md:min-h-0 md:flex-[1_1_0%] border border-white/5 shadow-lg"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label font-sans font-bold tracking-tight text-[16px] md:text-[18px] flex items-center justify-between">
                <span>{item.label}</span>
                {idx === 2 && session && (
                  <span className="text-[10px] font-mono uppercase bg-accent/20 text-gold px-1.5 py-0.5 rounded">
                    Active
                  </span>
                )}
              </div>

              <div className="nav-card-links mt-auto flex flex-col gap-1.5 pt-2">
                {item.links.map((lnk, i) =>
                  lnk.isAction ? (
                    <button
                      key={`${lnk.label}-${i}`}
                      type="button"
                      onClick={() => {
                        lnk.onClick?.();
                        closeMenu();
                      }}
                      className="nav-card-link inline-flex items-center gap-1.5 text-left text-danger hover:text-red transition-colors text-sm font-medium focus-visible:outline-none"
                    >
                      <LogOut className="h-3.5 w-3.5 shrink-0" />
                      <span>{lnk.label}</span>
                    </button>
                  ) : (
                    <Link
                      key={`${lnk.label}-${i}`}
                      href={lnk.href}
                      onClick={closeMenu}
                      className="nav-card-link inline-flex items-center gap-1.5 no-underline transition-colors hover:text-gold text-fg-muted text-sm font-medium"
                      aria-label={lnk.ariaLabel}
                    >
                      {lnk.href.includes("dashboard") ? (
                        <User className="h-3.5 w-3.5 shrink-0 text-orange" />
                      ) : (
                        <GoArrowUpRight
                          className="nav-card-link-icon shrink-0 text-fg-muted"
                          aria-hidden="true"
                        />
                      )}
                      <span>{lnk.label}</span>
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;