import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CardNav from "@/components/layout/CardNav";
import Footer from "@/components/layout/Footer";
import { getProductBySlug, getProducts } from "@/lib/services/product.service";
import ProductDetailView from "@/components/features/products/ProductDetailView";
import ProductCard from "@/components/features/products/ProductCard";
import { ArrowRight } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
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

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch a few other products for the related items section
  const { products: allProducts } = await getProducts({ limit: 5 });
  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <main className="relative min-h-screen text-fg font-sans antialiased selection:bg-gold selection:text-ink-950">
      {/* Sticky Global Navigation */}
      <CardNav />

      {/* Main Content */}
      <div className="relative z-10 pt-24 sm:pt-32 pb-24">
        {/* Product Detail Interactive View */}
        <ProductDetailView product={product} />

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
