# Stickify — Product Requirements Document

| | |
|---|---|
| **Version** | 0.2 (draft) — rebuilt on the marketing-site PRD template |
| **Last updated** | 2026-09-28 |
| **Status** | Draft. Database, file storage, payment provider, and launch date are pending (§11) |
| **Stack** | Next.js 16, React (latest), TypeScript, React Bits, Better Auth, JWT |

**Top priorities (in this order)**
1. **Optimized SEO** — built in from day one, not added at the end (§6).
2. **A complete marketing site** — Home, Products, Pricing, How it works, FAQs, About, Contact, with a sticky header and a legal footer (§4).
3. **Responsive design** across mobile, tablet, and desktop.
4. **Clean phase boundary** — Phase 1 ships the site and the ability to buy; customer accounts (Better Auth) and portals are Phase 2 (§3).

*Reading guide:* IDs like `SEO-03` are stable references. **P0** = required at launch, **P1** = important, ship if time allows, **P2** = later. Items marked *proposed* are defaults I chose so work can proceed and need client confirmation.

---

## 1. Project overview and objectives

**Project name:** Stickify

**Target launch date:** TBD — to confirm with the client (§11, D-01). Milestones in §9 are sequenced by dependency until a date is set.

**Executive summary.** Stickify is a website where people choose stickers for their devices (phones, tablets, laptops), pay online, and download the sticker files. It sells digital files only, with no physical shipping. The site solves two problems: people find it hard to locate well-made sticker artwork that fits their exact device, and the client needs a trustworthy, search-friendly storefront that delivers files instantly while protecting paid files from leakage.

**Strategic goals**
1. Establish an online presence and brand authority in the device-personalisation niche.
2. Generate direct revenue by selling sticker files online.
3. Provide a platform to sell digital products that can later expand beyond stickers (new product types, bundles, subscriptions).

**Success metrics (KPIs).** Numbers are *proposed* starting targets for a new site with no baseline; agree on final values with the client and re-baseline after 30 days of real data.

| Area | KPI | Proposed target |
|---|---|---|
| Traffic | Monthly unique visitors within 90 days of launch | 5,000 |
| Traffic | Share of visits from organic search by day 90 | ≥ 40% |
| Engagement | Average session duration | > 2 minutes |
| Engagement | Sticker detail views per session | ≥ 3 |
| Conversion | Visitor → paid order | ≥ 2% |
| Conversion | Checkout started → paid | ≥ 60% |
| Delivery | Download success on first attempt (paying customers) | ≥ 99% |
| Delivery | Paid-file access without payment | 0 incidents |
| Performance | Core Web Vitals "good" (mobile, field data) | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 |
| SEO | Intended pages indexed within 14 days of launch | 100% |
| SEO | Target keywords ranking in the top 10 by day 90 | X keywords (list agreed in SEO-01) |

**Optimized SEO** is a launch requirement. The full specification is in §6.

## 2. Target audience and personas

**Primary audience.** Phone, tablet, and laptop owners who want to personalise their devices and would rather download artwork instantly than order a physical product. *(Age, location, and language to be confirmed with the client — D-02.)*

| Persona | Description | What they need from the site |
|---|---|---|
| **A — The Researcher** | Compares options before paying; reads pricing, licence, and FAQs first. | Clear value proposition, transparent pricing, educational content (How it works, FAQs), a visible licence and refund policy. |
| **B — The Quick Buyer** | Knows their device and wants something that looks good now. Mostly on mobile. | Device selection in one tap, instant preview on their device, fast checkout, immediate download. |
| **C — The Returning Customer** | Bought before and wants the files again, or wants more. | A reliable way to re-download (email link in Phase 1, account library in Phase 2), new-release visibility. |

## 3. High-level scope

### Phase 1 — MVP launch (in scope)
- Core marketing pages: Home, Products, Pricing, About, FAQs, Contact, plus a How it works section.
- Sticker catalogue with device selection and an on-device preview.
- Cart and checkout **without customer accounts** (guest checkout), hosted payment, and secure file delivery by emailed link (§5.3).
- A small admin area for the client's staff to manage stickers, devices, and prices. Better Auth is used here for **invited admin accounts only — no public sign-up**.
- Optimized SEO (§6), responsive design, analytics, and legal pages.

### Phase 2 — future releases (out of scope for Phase 1)
- **User accounts and portal dashboards** using Better Auth: customer sign-up and sign-in, library of purchases, order history, re-downloads, profile.
- JWT-based authorization extended to customers (Phase 1 already uses it for the admin role).
- Multi-language / internationalization (i18n).
- Discount codes, wishlist, bundles, refunds dashboard, blog/content hub for SEO, social login, sticker editor.

### Scope note — please confirm (D-03)
Your template lists accounts as out of scope, while the product itself requires paying and downloading. To keep both true, this PRD lets people **buy as guests and receive an emailed download link** in Phase 1, and adds accounts in Phase 2. If you would rather have accounts in Phase 1, the change is contained to §5.3 and §5.5.

## 4. Site architecture and sitemap

```
/                          Homepage
/products                  Products: catalogue with device selector
  /products/[slug]         Sticker detail with on-device preview
/devices/[brand]/[model]   Device landing pages (P1, SEO)
/pricing                   Pricing
/how-it-works              How it works (P1 page; also a Homepage section)
/faqs                      FAQs
/about                     About
/contact                   Contact
/privacy-policy            Privacy Policy
/terms-of-service          Terms of Service
/refund-policy             Refund Policy (digital goods)
/licence                   Licence terms
/cart, /checkout, /order/[token]   Transactional pages (noindex)
/admin/*                   Admin area (private)
```

### 4.1 Global navigation (NAV)
| ID | P | Requirement |
|---|---|---|
| NAV-01 | P0 | **Sticky header** on all public pages: logo linking to Home, primary links (Products, How it works, Pricing, FAQs, About, Contact), and a visually highlighted **Primary Action** button ("Choose your device", using the `cta` button variant). |
| NAV-02 | P0 | Cart icon with item count in the header. |
| NAV-03 | P0 | Mobile navigation (menu) that is keyboard and screen-reader accessible and closes on route change. |
| NAV-04 | P0 | Current page is indicated in the nav (`aria-current`). Breadcrumbs on product and device pages. |

### 4.2 Footer (FTR)
| ID | P | Requirement |
|---|---|---|
| FTR-01 | P0 | Links to Privacy Policy, Terms of Service, Refund Policy, and Licence terms. |
| FTR-02 | P0 | Copyright line with year and company name; company email; social links. |
| FTR-03 | P0 | Secondary navigation (Products, FAQs, Contact) and, if consent exists, a newsletter signup (P1). |

### 4.3 Page requirements
| ID | Page | P | Content and behaviour |
|---|---|---|---|
| HOME-01 | Homepage — **Hero** | P0 | Main value proposition, a short row of feature highlights (instant download, fits your device, clear licence), and one primary `cta` button. At most one React Bits background effect. |
| HOME-02 | Homepage — **Device selector with sticker cards** | P0 | Device category and model chips followed by a staggered grid of sticker cards for the selected device. |
| HOME-03 | Homepage — **How it works** | P0 | Four steps: choose device → pick stickers → pay → download. |
| HOME-04 | Homepage — **Social proof** | P0 | Real ratings, testimonials, and customer photos. Needs client content; use real reviews only (§6). |
| HOME-05 | Homepage — **Footer** | P0 | See §4.2. |
| PRD-01 | Products | P0 | Paginated catalogue with the device selector, sticker cards (preview, title, price, badges), and links to detail pages. |
| PRD-02 | Sticker detail | P0 | Large on-device preview, description, compatible devices, included formats, licence summary, price, add-to-cart, related stickers. |
| PRC-01 | Pricing | P0 | Transparent explanation of what a purchase includes, price range or per-sticker price, licence scope, download rules, and refund policy summary. (Serves Persona A.) |
| HIW-01 | How it works (page) | P1 | Expanded version of HOME-03 with screenshots and FAQs; reuses the same component. |
| FAQ-01 | FAQs | P0 | Grouped questions (buying, downloads, compatibility, licence, refunds, support), with an in-page anchor list. Content maintained as data, not hardcoded in components. |
| ABT-01 | About | P0 | Brand story, who is behind the sticker artwork, and the mission. Trust-building content. |
| CON-01 | Contact | P0 | Contact form (name, email, subject, message), company email address, social links. |
| LEG-01 | Legal pages | P0 | Privacy Policy, Terms of Service, Refund Policy, Licence terms. Text provided or approved by the client. |
| ERR-01 | 404 and error pages | P0 | Helpful 404 with search/links; branded error page. Returns correct HTTP status codes. |

### 4.4 Contact form details (CON)
| ID | P | Requirement |
|---|---|---|
| CON-02 | P0 | Server-side validation (Zod), clear error and success states, and a confirmation email to the sender (P1). |
| CON-03 | P0 | Spam protection: honeypot field, rate limiting, and CAPTCHA if abuse appears (provider TBD). |
| CON-04 | P0 | Messages are delivered to the company inbox through the email provider (TBD, D-09). |

## 5. Functional requirements — commerce

### 5.1 Catalogue and preview (CAT)
| ID | P | Requirement |
|---|---|---|
| CAT-01 | P0 | Select device category, brand, and model. The catalogue filters to compatible stickers. The selection persists across reloads (URL parameter plus cookie). |
| CAT-02 | P0 | Preview shows the sticker on a mockup of the chosen device, using the **preview asset only**. Previews are watermarked and downscaled (max 1200 px longest side, *proposed*). Original files are never sent to the browser before purchase. |
| CAT-03 | P1 | Search, tag filters, and sort (newest, popular, price). |

### 5.2 Cart and checkout (CHK)
| ID | P | Requirement |
|---|---|---|
| CHK-01 | P0 | Cart add and remove; digital items have quantity 1. Cart persists in a cookie. |
| CHK-02 | P0 | Checkout collects an email address (for receipt and download link). |
| CHK-03 | P0 | The server computes all prices and totals from catalogue data. The client never supplies a price. |
| CHK-04 | P0 | An order is created as `pending` before redirecting to payment. Pending orders expire after 60 minutes (*proposed*). |

### 5.3 Payments and delivery (PAY, DLD)
The payment provider is TBD (D-05). Requirements are provider-agnostic.

| ID | P | Requirement |
|---|---|---|
| PAY-01 | P0 | Payment happens on the provider's hosted page. Card data never touches Stickify servers. |
| PAY-02 | P0 | A webhook verifies the provider's signature before doing anything. |
| PAY-03 | P0 | Webhook handling is idempotent: the same provider event processed twice grants access once. |
| PAY-04 | P0 | Failed, cancelled, and expired payments are handled, and the buyer can retry. |
| DLD-01 | P0 | After a verified payment, the buyer receives an email with an **order link** (`/order/[token]`) and sees the same page after checkout. The token is unguessable and expires (default 30 days, *proposed*). |
| DLD-02 | P0 | Downloads require a valid order token whose order is `paid`. Otherwise the response is 403/404 with no file information. |
| DLD-03 | P0 | Files are delivered by a signed URL valid for at most 5 minutes, or streamed by the server, only after DLD-02 passes. Original files live in private storage. |
| DLD-04 | P0 | Per-item download limit (default 10, *proposed*, admin-configurable). |
| DLD-05 | P0 | Every download attempt is logged (order, file, result, time, IP hash). |
| DLD-06 | P1 | "Resend my download link" by email address. |
| DLD-07 | P2 | Per-buyer forensic watermark to trace leaks. |

### 5.4 Admin (ADM)
| ID | P | Requirement |
|---|---|---|
| ADM-01 | P0 | Admin area for invited staff only, using **Better Auth**; no public sign-up. Role is carried as a JWT claim and re-checked on the server in every admin handler and action. |
| ADM-02 | P0 | Create, edit, unpublish, and delete stickers (title, description, tags, price, compatible devices, SEO title and description). |
| ADM-03 | P0 | Manage devices and the sticker-to-device mapping. |
| ADM-04 | P0 | Upload original files to private storage with type and size validation; the system generates the watermarked preview. |
| ADM-05 | P1 | View orders and payments; issue refunds. |
| ADM-06 | P1 | Audit log of admin actions. |

### 5.5 Phase 2 — accounts and portal (AUTH)
Out of scope for Phase 1; listed so Phase 1 does not paint us into a corner.

| ID | P | Requirement |
|---|---|---|
| AUTH-01 | P2 | Customer sign-up, sign-in, email verification, password reset with Better Auth. |
| AUTH-02 | P2 | Library and order history; past guest orders can be claimed by matching verified email. |
| AUTH-03 | P2 | Entitlements checked against server data, not JWT contents. |
| AUTH-04 | P2 | Profile, session management, account deletion. |

## 6. Optimized SEO (top priority)

SEO is a launch requirement and is built into every page. Requirement IDs below are acceptance criteria for the launch checklist.

### 6.1 Strategy and content
| ID | P | Requirement |
|---|---|---|
| SEO-01 | P0 | Before the build starts, produce a keyword map: one primary keyword and 2–4 secondary keywords per indexable page (for example, "[device] stickers download"). Agree the "X keywords" KPI from this list. |
| SEO-02 | P0 | Every indexable page has a unique `<title>` (about 50–60 characters), meta description (about 140–155 characters), a single `<h1>`, and a logical heading hierarchy. |
| SEO-03 | P0 | Page copy is original and useful: no thin or duplicated pages. Sticker and device pages have unique descriptive text, not just an image grid. |
| SEO-04 | P1 | Device landing pages (`/devices/[brand]/[model]`) with a unique intro, compatible stickers, and device-specific FAQs, to capture "stickers for [device]" searches. |
| SEO-05 | P2 | Blog or guides section for informational queries (Phase 2). |

### 6.2 Technical SEO
| ID | P | Requirement |
|---|---|---|
| SEO-06 | P0 | Pages are server-rendered or statically generated so crawlers receive full HTML; no critical content depends on client-only rendering. |
| SEO-07 | P0 | Use the Next.js Metadata API for titles, descriptions, canonical URLs, Open Graph, and Twitter cards; generate social images per page. |
| SEO-08 | P0 | Auto-generated `sitemap.xml` (indexable, canonical URLs only, with `lastmod`) and `robots.txt` that references it. Submit to Google Search Console and Bing Webmaster Tools. |
| SEO-09 | P0 | Clean, lowercase, hyphenated URLs; canonical tag on every page; one canonical version of the domain (HTTPS, chosen `www` or apex) with 301 redirects for the rest and for any renamed slugs. |
| SEO-10 | P0 | Filter, sort, and pagination parameters do not create duplicate indexable pages (canonical to the clean URL or `noindex` for parameter combinations). |
| SEO-11 | P0 | `noindex` on cart, checkout, order-link, thank-you, and search-result pages. `/api` and `/admin` are disallowed in `robots.txt`. Original sticker files are never publicly linkable or indexable. |
| SEO-12 | P0 | Correct status codes: 404 for missing pages, 301 for moves, 410 for permanently removed stickers. |
| SEO-13 | P0 | Semantic HTML (header, nav, main, footer, article, section), descriptive link text, and internal links between related stickers, devices, How it works, and FAQs. |

### 6.3 Structured data (JSON-LD)
| ID | P | Requirement |
|---|---|---|
| SEO-14 | P0 | `Organization` and `WebSite` on the homepage; `BreadcrumbList` on nested pages. |
| SEO-15 | P0 | `Product` with `Offer` (price, currency, availability) on each sticker page. Include `AggregateRating`/`Review` **only if real, visible reviews exist**; never fabricate them. |
| SEO-16 | P1 | `FAQPage` on the FAQs page. Note: Google now shows FAQ rich results for only a narrow set of sites, so do not count on the rich result; the content still serves long-tail queries. |
| SEO-17 | P0 | Structured data validated with Google's Rich Results Test before launch. |

### 6.4 Performance and images (Core Web Vitals)
| ID | P | Requirement |
|---|---|---|
| SEO-18 | P0 | Core Web Vitals "good" on mobile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Lighthouse SEO score ≥ 95 and no critical issues in Search Console. |
| SEO-19 | P0 | All images use `next/image` with width/height and explicit `sizes`, modern formats (AVIF/WebP), lazy loading below the fold, and `priority` only on the hero image. |
| SEO-20 | P0 | Descriptive, unique `alt` text and descriptive file names for sticker previews and device mockups. Decorative images have empty `alt`. |
| SEO-21 | P0 | Fonts loaded with `next/font`; effects from React Bits are lazy-loaded and never block first paint. |

### 6.5 Measurement
| ID | P | Requirement |
|---|---|---|
| SEO-22 | P0 | Google Search Console and Bing Webmaster verified before launch. |
| SEO-23 | P0 | Analytics installed with consent handling where required (tool TBD, D-10). Track: organic sessions, landing pages, conversions by source. |
| SEO-24 | P1 | Monthly SEO review: index coverage, CWV field data, keyword rankings, click-through rate, and fixes. |

## 7. Non-functional requirements

| ID | Area | Requirement |
|---|---|---|
| NFR-01 | Responsive design | Mobile-first layouts verified on mobile, tablet, and desktop; no horizontal scroll; touch targets ≥ 44 px. |
| NFR-02 | Accessibility | WCAG 2.2 AA: keyboard operation, visible focus, labels, contrast, `prefers-reduced-motion` respected. |
| NFR-03 | Security | Security headers (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`); input validation on every boundary; rate limits on contact, checkout, and download; secrets only in environment variables; dependency and secret scanning in CI. |
| NFR-04 | Privacy | Minimum personal data; hashed IPs in logs; cookie consent where the target market requires it; privacy policy matches actual data use. |
| NFR-05 | Reliability | Webhooks are retry-safe; error tracking and uptime monitoring; backups and restore tested once the database is chosen. |
| NFR-06 | Browser support | Last two versions of Chrome, Edge, Firefox, Safari; iOS Safari 16+; Android Chrome. |
| NFR-07 | Testing | Automated tests for pricing, webhook idempotency, token and download checks, and admin authorization; an end-to-end test for choose device → pay → download; CI runs lint, typecheck, test, and build. |

## 8. Technical approach and engineering constraints

- **Stack:** Next.js 16 (App Router), React (latest), TypeScript (strict), React Bits for UI effects, Better Auth for authentication, JWT for authorization. Tailwind CSS v4 is assumed for styling.
- **Database and file storage are not decided.** Code against interfaces (ports) with in-memory mock adapters so the app runs end to end, then add real adapters after D-06 and D-07 are decided. Do not add a database, storage, or payment SDK before then.
- **Design system principles**
  - **No hardcoded design values.** Colors, spacing, radius, fonts, shadows, and gradients come from tokens defined once, and components use the generated utilities.
  - **Reuse components; never build from scratch.** Buttons come from one `Button` component with `primary`, `secondary`, and `cta` variants; the same approach applies to inputs, cards, badges, and chips. A new component is created only when a needed structure does not exist.
  - **Look and feel:** dark-first, maroon → red → orange → gold palette, rounded corners, minimal and elegant typography.
- **Scroll and motion:** one universal reveal wrapper for section and element animations; smooth scrolling with Lenis; at most 1–2 React Bits effects per page.
- **Security-critical rules:** paid files are reachable only after a server-side payment check; entitlements come only from the verified webhook, never from the browser return URL; prices are computed on the server.

### Working with Google Antigravity
- Save this file as `docs/PRD.md` in the repository. Start each agent task with: *"Read docs/PRD.md and implement <ID>."* Requirement IDs are the unit of work.
- Have agents produce a plan first and approve it before code on security-critical tasks (T5, T6, T8).
- If a task depends on an open decision (§11), the agent should stop and ask, using mock adapters in the meantime.

| Task | Scope | Covers | Depends on |
|---|---|---|---|
| T1 | Project scaffold, tokens, base components (`Button` variants, inputs, cards), layout shell with sticky header and footer | NAV, FTR, NFR-01/02 | — |
| T2 | SEO foundation: metadata helper, sitemap, robots, JSON-LD helpers, redirects, 404 | SEO-06 to SEO-14 | T1 |
| T3 | Homepage sections and How it works | HOME-01 to 05 | T1 |
| T4 | Catalogue, device selector, sticker detail, preview (mock data) | PRD-01/02, CAT, SEO-15 | T1, T2 |
| T5 | Cart, checkout, payments port with mock provider, webhook with idempotency | CHK, PAY | T4 |
| T6 | Order link, signed-URL delivery via storage port (mock), limits, logging | DLD | T5 |
| T7 | Static pages: Pricing, FAQs, About, Contact form, legal pages | PRC, FAQ, ABT, CON, LEG | T1, T2 |
| T8 | Better Auth for admin, JWT role checks, admin CRUD, uploads | ADM | T4 |
| T9 | Performance, accessibility, and SEO audit pass; structured-data validation | SEO-17 to SEO-21, NFR | T3, T4, T7 |
| T10 | End-to-end tests and hardening (headers, rate limits) | NFR-03, NFR-07 | T6, T8 |
| T11 | Real database, storage, and payment adapters | D-05 to D-07 | Decisions |

## 9. Milestones

Dates follow once the launch date (D-01) and infrastructure decisions are set.

| Milestone | Content | Exit criteria |
|---|---|---|
| **M0 Discovery** | Keyword map (SEO-01), content list, decisions D-01 to D-08 | Client sign-off on scope and open decisions |
| **M1 Foundation** | T1, T2 | Design tokens, base components, SEO helpers, CI green |
| **M2 Marketing site** | T3, T7 | All marketing pages complete on mock content and responsive |
| **M3 Catalogue** | T4 | Device → sticker → preview works |
| **M4 Buy and download** | T5, T6, T11 (payments and storage) | Paid order delivers files; duplicate webhook grants once; unpaid access returns 403 |
| **M5 Admin** | T8 | Client staff can publish a sticker unaided |
| **M6 Hardening** | T9, T10 | SEO checklist (§6) passes, CWV good, security review done |
| **M7 Launch** | Production release, Search Console submission | KPIs in §1 are being collected |

## 10. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Paid files leak | Lost revenue | Private storage, signed URLs, server checks, logging, tests for unpaid access |
| Payment provider unsuitable for the client's market | Blocked launch | Decide D-05 early; keep the payments port thin |
| Late infrastructure decisions | Schedule slip | Ports and mock adapters; decide D-06/D-07 before M4 |
| Thin content hurts rankings | Weak organic traffic | Keyword map, unique copy per page, device landing pages |
| Missing client content (art, copy, testimonials, legal) | Blocks M2/M3 | Request the content list (§12) at M0 |
| Fake or missing reviews | Structured-data policy issues and lost trust | Use real reviews only; hide rating markup until they exist |
| Scope creep (accounts, editor, i18n) | Delay | Phase 2 list in §3; changes go through this document |

## 11. Open questions and decisions

| ID | Decision | Status | Notes |
|---|---|---|---|
| D-01 | Target launch date | Open | Needed to set milestone dates |
| D-02 | Audience details (age, location, language) | Open | Shapes copy, SEO keywords, and payment options |
| D-03 | Guest checkout in Phase 1 (this PRD's default) vs accounts in Phase 1 | Proposed: guest | See §3 scope note |
| D-04 | What exactly is sold: one file per sticker or device-specific files; formats (PNG, SVG, PDF) | Open | Affects data model and upload flow |
| D-05 | Payment provider and currency/tax handling | Open | Depends on the client's country and payouts |
| D-06 | Database | Open | To discuss |
| D-07 | File storage | Open | Must support private files and signed URLs |
| D-08 | Licence terms and refund policy for digital goods | Open | Client to provide |
| D-09 | Transactional email provider | Open | Order emails and contact form |
| D-10 | Analytics tool and cookie consent approach | Open | |
| D-11 | Hosting and domain (apex vs `www`) | Open | Needed for canonical setup |
| D-12 | Standalone Pricing page vs Pricing section (PRC-01 assumes a page) | Proposed: page | Persona A needs transparent pricing |

## 12. Content needed from the client

Logo and brand assets; sticker artwork with previews; device list and device mockups; Homepage, About, Pricing, and FAQ copy; real testimonials or customer photos; company email and social links; legal text (Privacy, Terms, Refund, Licence); target keyword ideas and competitors.
