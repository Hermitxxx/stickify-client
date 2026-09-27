# [Brand] — Design Guide
**Product:** Custom skins/wraps for phones, tablets, laptops
**Stack:** Next.js 16 · React 19 (latest) · TypeScript · Tailwind CSS v4 · React Bits · Framer Motion · Lenis

---

## 1. Design Philosophy

This is a different kind of brand than a luxury fashion site — it's tactile and customization-driven, with a vivid product palette. But bold color doesn't mean loud UI: typography stays minimal and elegant throughout, so the product photography and gradient palette carry the energy while the interface itself feels calm, confident, and premium.

- **Dark-first canvas.** A dark, near-black background makes colorful skins, textures, and device mockups pop the way they would in a product photo studio. Light mode exists, but dark is the primary experience.
- **The palette is the product.** Maroon → Red → Orange → Gold isn't decoration here — it *is* what's being sold. Use it boldly in gradients, product accents, and CTAs, not just as a hint.
- **Tactile, not sterile.** Rounded corners, layered device mockups, slight depth (soft shadows/glow) — this is a physical product people touch, the UI should feel touchable too.
- **Every UI element is a variant of a reusable primitive.** No new component per use-case — see §6.
- **Motion confirms interaction.** Reveal animations, hover states, and cursor feedback matter more here than on a static content site, because customization is the core interaction (color swatches, material previews, device selector).

---

## 2. Color System

Same `@theme` token approach — Tailwind v4 generates a utility class from every variable automatically.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Brand palette — the core identity */
  --color-maroon: #972828;
  --color-red:    #E45742;
  --color-orange: #EB7F31;
  --color-gold:   #FCAD38;

  --gradient-brand: linear-gradient(
    90deg,
    var(--color-maroon) 0%,
    var(--color-red) 35%,
    var(--color-orange) 70%,
    var(--color-gold) 100%
  );

  /* Neutrals — dark-first scale so skins/product shots pop against it */
  --color-ink-950: #0a0908;   /* primary page background (dark mode default) */
  --color-ink-900: #131110;
  --color-ink-800: #201c1a;
  --color-ink-700: #322b27;
  --color-ink-600: #4a4038;
  --color-ink-500: #6b5d51;
  --color-ink-400: #9c8b7c;
  --color-ink-300: #cabaa9;
  --color-ink-200: #e6dcd0;
  --color-ink-100: #f3ede4;
  --color-ink-50:  #faf7f2;   /* light-mode background */

  /* Semantic tokens — always reference these in components, never raw values */
  --color-bg: var(--color-ink-950);
  --color-bg-elevated: var(--color-ink-900);   /* cards, product tiles */
  --color-fg: var(--color-ink-50);
  --color-fg-muted: var(--color-ink-300);
  --color-border: var(--color-ink-700);
  --color-border-strong: var(--color-ink-500);

  /* Brand accents — CTAs, price highlights, badges, active states */
  --color-accent: var(--color-orange);
  --color-accent-strong: var(--color-maroon);
  --color-accent-soft: var(--color-gold);

  /* Feedback */
  --color-error: var(--color-maroon);
  --color-success: #4a8f5c;
}

@media (prefers-color-scheme: light) {
  @theme {
    --color-bg: var(--color-ink-50);
    --color-bg-elevated: var(--color-ink-100);
    --color-fg: var(--color-ink-950);
    --color-fg-muted: var(--color-ink-600);
    --color-border: var(--color-ink-200);
  }
}
```

**Rule:** components reference semantic tokens (`bg-bg`, `text-fg`, `bg-bg-elevated`) for layout, and reach for the raw brand-color utilities (`bg-orange`, `text-gold`, `from-maroon to-gold`) only inside the specific components designed to carry the brand identity — CTAs, price tags, active filter chips, progress indicators, the color-swatch picker itself. Keep it intentional, not scattered across every element.

### No hardcoded values — ever

Same non-negotiable rule as any other project on this stack. Once a value exists in `@theme`, Tailwind already generated its utility class — use that, never a raw hex, a manually-referenced CSS variable, or inline styles.

```tsx
// ❌ Wrong
<div className="bg-[#EB7F31]">Order Now</div>
<div className="bg-[var(--color-orange)]">Order Now</div>
<div style={{ background: "var(--color-orange)" }}>Order Now</div>

// ✅ Correct
<div className="bg-orange">Order Now</div>
// or, for the layout role it's playing:
<div className="bg-accent">Order Now</div>
```

This applies to every category, not just color:

| Category | ❌ Don't | ✅ Do |
|---|---|---|
| Color | `bg-[#EB7F31]`, `bg-[--color-orange]` | `bg-orange` / `bg-accent` |
| Spacing | `p-[24px]`, `gap-[--spacing-x]` | `p-6`, or add the value to `@theme` first |
| Radius | `rounded-[16px]` | `rounded-2xl` (defined in `@theme` if custom) |
| Font | `font-[General_Sans]` | `font-display` (once `--font-display` is set) |
| Gradient | `bg-[linear-gradient(...)]` written inline per-component | `bg-[image:var(--gradient-brand)]` defined once, referenced everywhere — or a `.bg-gradient-brand` utility |

If a value repeats anywhere, it belongs in `@theme` as a token. Arbitrary-value brackets (`[...]`) are reserved only for genuine one-off nudges (e.g. `top-[2px]` to align an icon), never for brand colors, spacing, radius, typography, or gradients.

---

## 3. Typography

Even on a bold, colorful, tactile brand, the type itself stays quiet and precise — it's the palette and product photography that carry the energy, not loud lettering. A minimal, elegant sans throughout keeps the UI feeling premium rather than gimmicky.

| Role | Font | Use |
|---|---|---|
| Display / Headings | **General Sans** or **Satoshi** (clean geometric sans, light-to-medium weight, tight tracking) | Hero, product names, section headers |
| Body / UI | **Inter** | Nav, buttons, body copy, prices, forms |

```css
@theme {
  --font-display: "General Sans", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  --text-hero:  clamp(2.75rem, 6vw, 5.5rem);
  --text-h1:    clamp(2rem, 4vw, 3.5rem);
  --text-h2:    clamp(1.5rem, 2.5vw, 2.25rem);
  --text-body:  1rem;
  --text-small: 0.875rem;
}
```

**Type rules:**
- Headings: weight 400–500 (not bold), `tracking-tight`, sentence case — restraint here is what makes the bold color palette read as premium instead of loud.
- Avoid ALL CAPS on headings; reserve uppercase + wide tracking for small functional labels only ("NEW", "IN STOCK", nav items) — used sparingly, not as the default heading treatment.
- Body: `leading-relaxed`, max ~65ch line length, generous line-height for an airy, uncluttered feel.
- Prices always `font-sans` — numbers read cleaner in a grotesque than a display face.
- Let whitespace do as much work as the type — minimal typography needs room to breathe, so don't compress line-height or letter-spacing to fit more on screen.

- Headings: bold weight (600–700), tight tracking, can go ALL CAPS for short labels ("NEW DROP", "IN STOCK") since this brand is bolder than a luxury fashion site.
- Body: `leading-relaxed`, max ~65ch line length.
- Prices always `font-sans` — numbers read cleaner in the grotesque.

---

## 4. Spacing & Radius

Unlike a sharp-cornered luxury site, this brand can be **rounded and chunky** — it reads as friendly, modern, tactile (like the physical product itself).

```css
@theme {
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 24px;
  --radius-full: 9999px;
}
```

- Product cards, buttons, device mockups: `rounded-lg` or `rounded-md` — never sharp `rounded-none`.
- Color swatches / material chips: `rounded-full`.
- Container: `max-w-[1400px] mx-auto px-6 md:px-10`.
- Section vertical rhythm: `py-20 md:py-32`.

---

## 5. Component Architecture — Reuse Rule

Same principle as any production codebase: **primitives with variants, not a new component per use-case.**

```
/components
  /ui              ← primitives (variant-driven)
    Button.tsx
    Badge.tsx
    Card.tsx
    Input.tsx
    Chip.tsx        ← color swatch / material selector chip
  /commerce
    ProductCard.tsx
    DeviceSelector.tsx
    SkinPreview.tsx   ← live device mockup with selected skin applied
    PriceTag.tsx
  /motion
    Reveal.tsx        ← universal reveal wrapper (see §6)
    RevealGroup.tsx
  /layout
    Header.tsx
    Footer.tsx
```

```tsx
// components/ui/Button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-display font-semibold transition-colors duration-300 rounded-md disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-accent text-ink-950 hover:bg-accent-strong hover:text-fg",
        outline: "border border-border-strong text-fg hover:bg-bg-elevated",
        ghost:   "text-fg hover:text-fg-muted",
        gradient: "bg-[image:var(--gradient-brand)] text-ink-950 hover:opacity-90", // reserved for the single primary CTA per page
      },
      size: {
        sm: "h-9 px-4 text-small",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-body",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

Apply the same `cva` pattern to `Badge` (`new`, `bestseller`, `limited`), `Card` (`product`, `editorial`), `Chip` (`color-swatch`, `material`, `filter`). A new component is only justified when the *structure* genuinely differs — e.g. `SkinPreview` (device frame + applied texture + rotate control) is structurally distinct from a generic `Card`, so it's its own component, but built by composing `Card` + `Chip` + `Button` internally wherever it can be.

---

## 6. Universal Reveal Wrapper (Framer Motion)

This is the single component every section/element animation goes through — no one-off `motion.div` with hand-typed transitions scattered across the codebase.

```tsx
// components/motion/Reveal.tsx
"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "fade";

interface RevealProps {
  children: ReactNode;
  direction?: Direction;   // default "up"
  delay?: number;           // seconds
  duration?: number;        // seconds, default 0.6
  once?: boolean;           // default true — animate only the first time it enters view
  amount?: number;          // 0–1, how much of the element must be visible to trigger (default 0.2)
  className?: string;
}

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up:    { x: 0, y: 32 },
  down:  { x: 0, y: -32 },
  left:  { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  fade:  { x: 0, y: 0 },
};

/**
 * Universal reveal wrapper — wrap ANY section, card, image, or text block
 * with this instead of writing a new motion.div + transition by hand.
 *
 *   <Reveal><h2>New Drop</h2></Reveal>
 *   <Reveal direction="left" delay={0.15}><ProductCard /></Reveal>
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
        ease: [0.22, 1, 0.36, 1], // house easing curve — used everywhere, never mixed with other curves
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
```

For **grids of items that should reveal in sequence** (product grid, color swatch list), pair it with a stagger container instead of delaying each `Reveal` manually:

```tsx
// components/motion/RevealGroup.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface RevealGroupProps {
  children: ReactNode;
  stagger?: number;   // seconds between each child, default 0.08
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
```

Children inside a `RevealGroup` skip their own `initial`/`whileInView` (the parent already controls that) and just declare `variants` — Framer Motion propagates the parent's animation state down automatically:

```tsx
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

<RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {products.map((p) => (
    <motion.div key={p.id} variants={item}>
      <ProductCard product={p} />
    </motion.div>
  ))}
</RevealGroup>
```

**Rules:**
- `Reveal` / `RevealGroup` are the *only* place `whileInView`/`viewport` config is written. Every page section imports one of these two — never a raw `motion.div` with its own scroll-trigger logic.
- One house easing curve (`[0.22, 1, 0.36, 1]`) everywhere — matches the Lenis scroll easing in §7, so scroll and reveal motion feel like one system, not two fighting each other.
- `useReducedMotion` is baked in — nobody has to remember to handle `prefers-reduced-motion` per-usage.
- Default `direction="up"` covers ~80% of cases; reach for `left`/`right` only for side-by-side comparison layouts (e.g. "before/after" skin previews).

---

## 7. Lenis — Smooth Scroll

One global provider mounted once at the root layout.

```tsx
// components/layout/SmoothScrollProvider.tsx
"use client";
import { ReactLenis } from "lenis/react";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing: (t: number) => 1 - Math.pow(1 - t, 3), // matches Reveal's house curve
        smoothWheel: true,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}
```

```tsx
// app/layout.tsx
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
```

- Use `lenis.scrollTo()` for any "jump to section" links (e.g. device-type nav), never native `scrollIntoView` — mixing the two causes stutter.
- Keep `smoothWheel` for desktop; native touch scroll on mobile feels better than an over-smoothed one.

---

## 8. React Bits Integration

React Bits ships as copy-in source, so each component is restyled once with the brand tokens, wrapped in `/components/motion` (or `/components/ui` if it's more structural than decorative), then reused everywhere.

| Page / Section | React Bits Component | Purpose | Wrapper file |
|---|---|---|---|
| Homepage hero | `Aurora` / `Beams` (background), recolored to `--gradient-brand` at low opacity | Warm ambient glow behind hero, evokes the product's color range | `HeroBackground.tsx` |
| Hero headline | `SplitText` or `ShinyText` | One-time headline reveal on load | works alongside `Reveal` |
| Product/skin color grid | `SpotlightCard` or `GlareHover`, tinted with `--color-accent` | Cursor-reactive glow on hover — reinforces "this is customizable" | `SkinHoverCard.tsx` |
| "How it works" / material texture section | `TiltedCard` (subtle tilt on hover for the device mockup) | Adds tactility to the mockup preview | `DeviceTiltCard.tsx` |
| Footer / newsletter | `GradientText` for heading + low-opacity `Particles` backdrop | Frame the signup block | `NewsletterFrame.tsx` |
| Empty states (empty cart, no search results) | `Particles` or `Silk`, recolored, low opacity | Small moment of polish without noise | `EmptyStateFx.tsx` |

**Restyling requirement:** override every React Bits component's default palette/easing to the token system on import — no default demo colors ship to production. Confirm exact current component names against reactbits.dev before wiring in, since it updates frequently.

**Budget:** 1–2 React Bits effects per page max, layered with `Reveal`/`RevealGroup` for the rest of the motion — don't stack multiple heavy background effects at once (perf cost on mobile, and it stops feeling premium and starts feeling busy).

---

## 9. Next.js 16 / TypeScript Notes

- Server Components by default; `"use client"` only on interactive primitives (`Button`, `DeviceSelector`, `Reveal`/`RevealGroup`, cart drawer).
- Strict TypeScript (`strict: true`) — every component prop typed, no `any` in shared primitives.
- Product/device data typed via a shared `types/product.ts` (device type, color options, material options, price) so the skin configurator and product cards share one source of truth.
- Images: Next.js `<Image>` throughout — device mockups and skin textures are the heaviest assets on this site, so proper `sizes`/`priority` matters more here than on a typical content site.

---

## 10. Suggested Homepage Sections

For a device-skins/wraps brand, the homepage's job is: hook visually → prove customization is easy → build trust → convert.

1. **Hero** — bold headline + a rotating/animated device mockup showing a few skin options, `HeroBackground` glow behind it, primary CTA ("Design Yours" / "Shop Skins").
2. **Device Selector Bar with Skin Cards** — quick-select chips for Phone / Tablet / Laptop / Smartwatch, immediately followed by a `RevealGroup` grid of top skin designs for the selected device — merges device selection and product discovery into one section so users move fast from "what device do I have" to "which skin do I like."
3. **Social Proof** — customer photos of devices with skins applied (UGC-style grid) + review ratings; this category converts heavily on "does it actually look good in person."
4. **Footer** — device compatibility list, care instructions, shipping/returns, socials.

Keep it to these five — skins are an impulse-adjacent purchase, so the path from hero to "add to cart" should be short and uncluttered.