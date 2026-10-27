# Stickify

<div align="center">

### Precision-made digital skins for the hardware you already own.

Discover, purchase, and download production-ready sticker artwork for phones, tablets, and laptops — calibrated for vinyl cutters, print shops, and makers.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/license-private-131110.svg)](#license)

</div>

---

## What is Stickify?

Stickify is a digital storefront for high-precision device artwork and vinyl cut files. Each design is organized around compatible hardware, so customers can find the right fit, preview the catalogue, check out securely, and access their purchases from one account.

This is a **digital-only product**: no physical inventory, no shipping queue, and no waiting for a parcel. Downloaded files are intended for workflows such as Cricut Design Space, Silhouette Studio, Illustrator, laser cutting, or local print-and-cut services.

## Highlights

- **Device-first discovery** — browse designs by Phone, Tablet, or Laptop.
- **Searchable catalogue** — debounced search, device filters, sorting, pagination, and responsive product cards.
- **Precision artwork** — 300 DPI PNG artwork with vector cut outlines for maker workflows.
- **Secure checkout** — Lemon Squeezy handles payment processing and order events.
- **Personal vault** — authenticated customers can view purchases, download files, and bookmark designs.
- **Admin workspace** — role-based admin views for users, sales, earnings, products, and platform activity.
- **Dark, tactile visual system** — maroon-to-gold accents, calm surfaces, responsive layouts, and motion used with restraint.

## Product flow

```text
Choose a device
      ↓
Explore compatible artwork
      ↓
Open a product and review the cut details
      ↓
Checkout with Lemon Squeezy
      ↓
Download from your Stickify dashboard
```

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router with Turbopack |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| Motion | Motion, GSAP, Lenis, OGL, React Three Fiber |
| Authentication | Better Auth with email/password and admin roles |
| Data | MongoDB Atlas with MongoDB driver and Mongoose |
| Payments | Lemon Squeezy checkout and signed webhooks |
| State | Redux Toolkit and React Redux |
| Icons | Lucide React, Hugeicons, React Icons |
| Quality | ESLint 9 and TypeScript |

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB deployment, such as MongoDB Atlas
- Lemon Squeezy credentials for checkout and webhook testing

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Database
MONGO_URI="mongodb+srv://<user>:<password>@<cluster>/<database>"
MONGODB_DB_NAME="stickify"

# Application and authentication
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:3000"

# Lemon Squeezy
LEMONSQUEEZY_API_KEY="your-api-key"
LEMONSQUEEZY_STORE_ID="your-store-id"
LEMONSQUEEZY_VARIANT_ID="your-variant-id"
LEMONSQUEEZY_WEBHOOK_SECRET="your-webhook-secret"
```

Keep all secrets server-side. Do not commit `.env.local` or paste real credentials into issues, pull requests, or documentation.

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Optional: seed dashboard data

The seed script expects an existing MongoDB connection and product/user records:

```bash
node scripts/seed-dashboard.js
```

Use the script only with a development database. It assigns roles and inserts sample dashboard records when the relevant collections are empty.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `node scripts/seed-dashboard.js` | Seed development dashboard data |
| `node scripts/sync-orders.js` | Synchronize selected order records during development |

## Project map

```text
app/
├── (auth)/                 Sign-in and registration pages
├── api/                    Auth, products, dashboard, checkout, and webhook routes
├── dashboard/              Collector and admin experiences
├── products/               Catalogue and product detail pages
├── globals.css             Global tokens and Tailwind theme
└── layout.tsx              Root layout and metadata

components/
├── features/               Auth, catalogue, and dashboard feature components
├── layout/                 Navigation, footer, and smooth scrolling
├── motion/                 Reveal and ambient motion primitives
└── ui/                     Reusable controls, cards, badges, and inputs

lib/
├── auth/                   Better Auth server/client configuration
├── db/                     MongoDB and Mongoose connections
├── models/                 Product, user, bookmark, and transaction models
├── redux/                  Application state
└── services/               Auth, catalogue, checkout, purchase, and dashboard logic
```

## Routes at a glance

| Route | Description |
| --- | --- |
| `/` | Marketing homepage with hero, device selector, and how-it-works sections |
| `/products` | Searchable and filterable product catalogue |
| `/products/[slug]` | Product detail and checkout entry point |
| `/login` | Existing-user authentication |
| `/register` | New-user registration |
| `/dashboard` | Customer purchase vault and account dashboard |
| `/dashboard/settings` | Profile, email, and password settings |
| `/dashboard/admin` | Admin overview and management tools |
| `/api/webhooks/lemonsqueezy` | Lemon Squeezy order event receiver |

## Design direction

Stickify keeps the interface quiet so the artwork can carry the energy:

- dark-first ink surfaces with vivid maroon, orange, and gold accents;
- rounded, tactile surfaces with clear focus states;
- calm typography and short, scannable content blocks;
- responsive layouts for mobile makers and desktop shoppers;
- motion that supports hierarchy without slowing down the buying flow.

## Contributing

1. Create a focused branch from the current development branch.
2. Keep changes scoped to one feature or fix.
3. Use existing components and semantic design tokens before introducing new primitives.
4. Run the smallest relevant checks before opening a pull request:

   ```bash
   npm run lint
   npm run build
   ```

5. Never include secrets, production customer data, or real payment credentials in a change.

## License

Stickify is currently a private, proprietary project. Source code, artwork, product data, and brand assets are not licensed for redistribution.

---

<div align="center">

Built for makers who care about the cut.

</div>
