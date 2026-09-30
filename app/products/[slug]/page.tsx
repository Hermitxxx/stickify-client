import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CardNav from "@/components/layout/CardNav";
import Footer from "@/components/layout/Footer";
import { getProductBySlug, getProducts } from "@/lib/services/product.service";
import ProductDetailView from "@/components/features/products/ProductDetailView";
import ProductCard from "@/components/features/products/ProductCard";
import { ArrowRight } from "lucide-react";

import { getServerSession } from "@/lib/services/auth.service";
import {
  checkUserSkinOwnership,
  confirmUserPurchase,
} from "@/lib/services/purchase.service";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ purchased?: string; txn_id?: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Stickify",
      description: "The requested sticker artwork could not be found.",
    };
  }

  return {
    title: `${product.title} - Precision Sticker Artwork | Stickify`,
    description: product.description,
    openGraph: {
      title: `${product.title} | Stickify`,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isPurchasedRedirect = resolvedSearchParams.purchased === "true";

  // Check if current authenticated user owns this product
  const session = await getServerSession();
  let isOwned = false;
  if (session && session.user) {
    // If arriving from payment redirect, guarantee purchase is saved into MongoDB immediately
    if (isPurchasedRedirect) {
      try {
        await confirmUserPurchase({
          userId: session.user.id,
          userEmail: session.user.email || "",
          userName: session.user.name || "Collector",
          productSlug: product.slug,
          transactionId: resolvedSearchParams.txn_id,
        });
      } catch (confirmErr) {
        console.error("Failed to auto-confirm purchase on redirect:", confirmErr);
      }
    }

    const isAdmin =
      (session.user as any)?.role === "admin" ||
      session.user.email?.includes("admin");
    isOwned =
      isAdmin ||
      (await checkUserSkinOwnership(session.user.id, product._id, session.user.email)) ||
      (await checkUserSkinOwnership(session.user.id, product.slug, session.user.email));
  }

  // Fetch a few other products for the related items section
  const { products: allProducts } = await getProducts({ limit: 5 });
  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <main className="relative min-h-screen bg-bg text-fg font-sans antialiased selection:bg-gold selection:text-ink-950">
      {/* Sticky Global Navigation */}
      <CardNav />

      {/* Main Content */}
      <div className="relative z-10 pt-32 sm:pt-36 lg:pt-40 pb-24">
        {/* Product Detail Interactive View with Initial Ownership State */}
        <ProductDetailView product={product} initialIsOwned={isOwned} />

        {/* Related Sticker Artworks */}
        {relatedProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-border/60">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-orange font-semibold">
                  Curated Collection
                </span>
                <h2 className="font-sans font-bold text-2xl text-fg mt-1">
                  More Precision Sticker Artworks
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-medium text-fg-muted hover:text-gold transition-colors"
              >
                <span>View all artworks</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
