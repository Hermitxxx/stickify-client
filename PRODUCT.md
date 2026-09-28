# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are owners of smartphones (iPhone, Samsung), tablets (iPad), and laptops (MacBook) who want to personalize their hardware with high-precision artwork. They own or have access to vinyl cutters (Cricut, Silhouette, laser) or use local print/cut shops, and prefer instant digital downloads over waiting for physical shipping.

## Product Purpose

Stickify is a web platform for discovering, purchasing, and downloading precision-engineered digital sticker artworks and vinyl cut files. Success means customers can find a design matching their exact device, purchase it securely, and immediately download production-ready cut assets.

## Positioning

Unlike generic wallpaper or sticker sites, Stickify designs are dimensional, 0.05mm micro-laser contour mapped and calibrated for seamless 3M™ Controltac™ vinyl application with accurate port, speaker, and logo cutouts.

## Operating Context

Customers browse catalogue artworks on desktop and mobile web, authenticate with their Stickify account, and access their purchased cuts through a personal account vault. Downloaded files are loaded into cutting software (Cricut Design Space, Silhouette Studio, Illustrator) for cutting on vinyl sheets.

## Capabilities and Constraints

- **Digital Delivery Only**: Sells and delivers digital assets exclusively (PNG at 300 DPI, vector cutting outlines). No physical inventory or parcel shipping.
- **Account-Gated Access**: Customers must register or sign in via Better Auth to purchase, download, and access their library of sticker cuts.
- **Device Personalization**: Products are categorized by device compatibility (Phone, Tablet, Laptop).
- **Technology Stack**: Next.js 16 (Turbopack, App Router), React 19, TypeScript, Tailwind CSS v4, MongoDB Atlas with Mongoose ODM, Better Auth with MongoDB adapter.

## Brand Commitments

- **Name**: Stickify
- **Visual Identity**: Dark-first canvas (`--color-ink-950` to `--color-ink-900`) with a vivid, calibrated maroon-to-gold palette (`--color-orange`, `--color-gold`, `--color-maroon`). Rounded and tactile components with quiet, elegant typography.
- **Voice**: Technical, precise, confident, and direct. Avoid generic AI copy clichés ("seamless", "elevate", "unleash").

## Evidence on Hand

- Live MongoDB database (`stickify`) with 10 production sticker artwork documents in the `products` collection.
- High-resolution Cloudinary artwork images linked in production database.
- Better Auth authentication layer implemented and running.
- Comprehensive PRD at `PRD.md` and Design System rules at `10-design-system.md`.

## Product Principles

1. **Art carries the energy; the UI stays calm**: Clean, dark, uncrowded surfaces let device artwork shine without neon or visual noise.
2. **Instant & reliable delivery**: File downloads are one-click, lossless, and immediate from the customer's vault.
3. **Strict token discipline**: Every visual value derives from semantic design tokens — no hardcoded colors, magic numbers, or arbitrary brackets.
4. **Frictionless scanability**: Clear device filtering, debounced search, and transparent pricing.

## Accessibility & Inclusion

- WCAG 2.2 AA compliance across all routes.
- Visible focus rings on all interactive elements.
- Minimum 44×44px tap targets for mobile devices.
- Meaningful alt attributes and screen-reader accessible navigation.
