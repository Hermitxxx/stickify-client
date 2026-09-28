# 10 — Design System

Look and feel: dark-first, vivid maroon → gold palette, rounded and tactile (shadcn preset **Maia**), with quiet, elegant typography. Product art carries the energy; the interface stays calm.

## Rule 1: No hardcoded design values

Every visual value comes from a token defined once in `src/app/globals.css`. Tailwind v4 turns each token into a utility class, so use the utility.

**Forbidden in `.tsx`/`.ts` files:**

- hex/rgb/hsl/oklch colors, in classes (`text-[#FCAD38]`), in strings, or in `style`
- raw CSS variables in classes (`text-[var(--color-gold)]`) or `style={{ color: "var(--…)" }}`
- arbitrary-value brackets for colors, spacing, radius, font size, shadows, gradients, z-index, or durations (`p-[13px]`, `rounded-[10px]`, `z-[999]`)
- font family names in components; inline `style={{ … }}` for anything a token covers
- one-off gradients, shadows, or easing curves written inline

**Do this instead:** use the token utility (`text-gold`, `bg-accent`, `rounded-lg`, `font-display`, `bg-gradient-brand`). If the value you need has no token, **add the token to `globals.css` first**, then use its utility. Arbitrary brackets are allowed only for a genuine one-off layout nudge (`top-[2px]` to align an icon), never for brand values.

Feature code uses **semantic** tokens (`bg-bg`, `bg-bg-elevated`, `text-fg`, `text-fg-muted`, `border-border`, `bg-accent`). Raw palette utilities (`bg-maroon`, `text-gold`) are only for the brand components listed in the inventory below.

## Tokens (`src/app/globals.css`)

Tailwind v4 does not allow `@theme` inside `@media`. Raw palette goes in `@theme static`; semantic values live in `:root` (overridden for light mode) and are exposed with `@theme inline`.

```css
@import "tailwindcss";

@theme static {
  --color-maroon: #972828;
  --color-red: #e45742;
  --color-orange: #eb7f31;
  --color-gold: #fcad38;
  --color-ink-950: #0a0908;
  --color-ink-900: #131110;
  --color-ink-700: #322b27;
  --color-ink-500: #6b5d51;
  --color-ink-300: #cabaa9;
  --color-ink-100: #f3ede4;
  --color-ink-50: #faf7f2;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 24px;

  --ease-brand: cubic-bezier(0.22, 1, 0.36, 1);
  --text-hero: clamp(2.75rem, 6vw, 5.5rem);
  --text-h1: clamp(2rem, 4vw, 3.5rem);
  --text-h2: clamp(1.5rem, 2.5vw, 2.25rem);
}

:root {
  --bg: var(--color-ink-950);
  --bg-elevated: var(--color-ink-900);
  --fg: var(--color-ink-50);
  --fg-muted: var(--color-ink-300);
  --border: var(--color-ink-700);
  --border-strong: var(--color-ink-500);
  --accent: var(--color-orange);
  --accent-strong: var(--color-maroon);
  --on-accent: var(--color-ink-950); /* dark text on orange/gold: white fails contrast */
  --danger: var(--color-maroon);
}
@media (prefers-color-scheme: light) {
  :root {
    --bg: var(--color-ink-50);
    --bg-elevated: var(--color-ink-100);
    --fg: var(--color-ink-950);
    --fg-muted: var(--color-ink-500);
    --border: var(--color-ink-100);
    --border-strong: var(--color-ink-300);
  }
}

@theme inline {
  --color-bg: var(--bg);
  --color-bg-elevated: var(--bg-elevated);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
  --color-on-accent: var(--on-accent);
  --color-danger: var(--danger);
  --font-display: var(--font-general-sans), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}

@utility bg-gradient-brand {
  background-image: linear-gradient(90deg, var(--color-maroon) 0%, var(--color-red) 35%, var(--color-orange) 70%, var(--color-gold) 100%);
}
```

**Typography (minimal, elegant):** headings use `font-display` (General Sans or Satoshi, self-hosted with `next/font/local`, weight 400–500, `tracking-tight`, sentence case). Body and UI use `font-sans` (Inter via `next/font/google`). ALL CAPS with wide tracking only for tiny labels ("NEW", "FREE PREVIEW"). Prices always `font-sans`. Body max line length about 65ch.

## Rule 2: Reuse components — never build from scratch

Before writing any markup, search `src/components/` for something that already does the job. Order of preference:

1. **Use** the existing component as-is.
2. **Extend** it by adding a `variant` or `size` to its `cva` definition.
3. **Compose** existing components into a feature component in `components/features/`.
4. **Create a new primitive** only when the *structure or behavior* is genuinely different (not just styling). Justify it in the PR description and add it to the inventory below.

A raw `<button>`, styled `<input>`, or hand-rolled card in feature or page code is a **Blocker** in review.

### Component inventory (update when you add one)

| Component | Location | Variants / notes |
|---|---|---|
| `Button` | `ui/button.tsx` | `primary`, `secondary`, `cta`; sizes `sm` `md` `lg`. One `cta` per screen. |
| `Input`, `Select`, `Checkbox` | `ui/` | `default`, `error` states |
| `Card` | `ui/card.tsx` | `default`, `interactive` |
| `Badge` | `ui/badge.tsx` | `new`, `free`, `bestseller` |
| `Chip` | `ui/chip.tsx` | `filter`, `device`, `swatch` |
| `Dialog`, `Toast`, `Skeleton` | `ui/` | one implementation each |
| `PriceTag` | `features/price-tag.tsx` | the only place prices are formatted |
| `StickerCard` | `features/sticker-card.tsx` | composes `Card` + `Badge` + `PriceTag` + `Button` |
| `DeviceSelector` | `features/device-selector.tsx` | composes `Chip` |
| `Reveal`, `RevealGroup` | `motion/` | the only scroll-reveal animation path |

### Button (the pattern every primitive follows)

```tsx
// src/components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-sans font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-fg text-bg hover:bg-fg-muted",
        secondary: "border border-border-strong text-fg hover:bg-bg-elevated",
        cta: "bg-gradient-brand text-on-accent hover:opacity-90",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

For links that look like buttons, apply `buttonVariants(...)` to a `next/link` — do not duplicate the styles. A fourth style means a new `variant` in this file, not a new component.

## Rule 3: Motion goes through `Reveal`

All scroll-in animation uses `Reveal` (single element) or `RevealGroup` (staggered list) in `components/motion/`. Do not hand-write `whileInView`/`viewport` config anywhere else.

```tsx
// src/components/motion/reveal.tsx
"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "fade";
const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 }, down: { x: 0, y: -32 },
  left: { x: 32, y: 0 }, right: { x: -32, y: 0 }, fade: { x: 0, y: 0 },
};
const EASE_BRAND = [0.22, 1, 0.36, 1] as const; // mirrors --ease-brand in globals.css

export function Reveal({ children, direction = "up", delay = 0, duration = 0.6, once = true, amount = 0.2, className }: {
  children: ReactNode; direction?: Direction; delay?: number; duration?: number;
  once?: boolean; amount?: number; className?: string;
}) {
  const reduce = useReducedMotion();
  const { x, y } = OFFSET[direction];
  const variants: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : x, y: reduce ? 0 : y },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: reduce ? 0 : duration, delay, ease: EASE_BRAND } },
  };
  return (
    <motion.div className={className} variants={variants} initial="hidden" whileInView="visible" viewport={{ once, amount }}>
      {children}
    </motion.div>
  );
}
```

`RevealGroup` is the same idea with a parent `staggerChildren` variant; children declare only `variants`.

## Rule 4: React Bits

- Add with the shadcn CLI (TypeScript + Tailwind variants): `npx shadcn@latest add @react-bits/<Name>-TS-TW`.
- Each component lands **once** under `components/motion/react-bits/`. Wrap it in one file that restyles it with tokens (`--gradient-brand`, `accent`, `fg`). Import the wrapper everywhere — never copy the raw source into pages, and never ship the library's demo colors.
- Budget: at most **1–2 React Bits effects per page** (hero background plus one supporting effect). Load heavy backgrounds with `next/dynamic` and `ssr: false`, and disable them under `prefers-reduced-motion` and on low-power/mobile where they hurt performance.
- Component names change often — confirm the current name against reactbits.dev before adding.

## Baseline quality

- **Accessibility:** WCAG 2.2 AA. Visible `focus-visible` ring on every interactive element, 44×44px touch targets, text contrast ≥ 4.5:1, meaningful `alt` on sticker previews, keyboard-operable device selector.
- **Performance:** Server Components by default; `"use client"` only on interactive leaves. `next/image` with explicit `sizes` for every preview; `next/font` for fonts; `priority` only on the single above-the-fold hero image.
- **Homepage sections (fixed scope):** Hero → Device selector with sticker cards → How it works (choose device → pick stickers → pay → download) → Social proof → Footer.
