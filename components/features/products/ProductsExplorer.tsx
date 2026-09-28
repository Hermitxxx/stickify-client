"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  X,
  ArrowUpDown,
  Smartphone,
  Tablet,
  Laptop,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { IProduct } from "@/lib/models/product.model";
import { useDebounce } from "@/lib/hooks/useDebounce";
import ProductCard from "./ProductCard";

interface ProductsExplorerProps {
  initialProducts: IProduct[];
  initialTotal: number;
  availableDevices: string[];
}

type SortOption = "featured" | "price-asc" | "price-desc" | "title-asc" | "newest";

export function ProductsExplorer({
  initialProducts,
  initialTotal,
  availableDevices,
}: ProductsExplorerProps) {
  const searchParams = useSearchParams();

  // Read initial values from URL search params if present
  const urlDevice = searchParams.get("device") || "All";
  const urlSearch = searchParams.get("search") || "";
  const urlSort = (searchParams.get("sort") as SortOption) || "featured";

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedDevice, setSelectedDevice] = useState(urlDevice);
  const [selectedSort, setSelectedSort] = useState<SortOption>(urlSort);

  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [totalCount, setTotalCount] = useState<number>(initialTotal);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Debounced search query (350ms)
  const debouncedSearch = useDebounce(searchQuery, 350);

  // Synchronize with API when filters, debounced search, or sort change
  useEffect(() => {
    let isCancelled = false;

    async function fetchFilteredProducts() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (debouncedSearch.trim()) {
          queryParams.set("search", debouncedSearch.trim());
        }
        if (selectedDevice && selectedDevice !== "All") {
          queryParams.set("device", selectedDevice);
        }
        if (selectedSort && selectedSort !== "featured") {
          queryParams.set("sort", selectedSort);
        }

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();

        if (!isCancelled) {
          setProducts(data.products || []);
          setTotalCount(data.total || 0);
        }
      } catch (err) {
        console.error("Filter request error:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchFilteredProducts();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch, selectedDevice, selectedSort]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDevice("All");
    setSelectedSort("featured");
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedDevice !== "All" ||
    selectedSort !== "featured";

  // Device icon helper
  const getDeviceIcon = (dev: string) => {
    const lower = dev.toLowerCase();
    if (lower.includes("phone")) return <Smartphone className="h-4 w-4" />;
    if (lower.includes("tablet") || lower.includes("ipad"))
      return <Tablet className="h-4 w-4" />;
    if (lower.includes("laptop") || lower.includes("macbook"))
      return <Laptop className="h-4 w-4" />;
    return <Sparkles className="h-4 w-4" />;
  };

  const allDeviceOptions = useMemo(
    () => ["All", ...availableDevices],
    [availableDevices]
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Primary Device Filter Tabs & Discovery Bar */}
      <div className="space-y-4 mb-8">
        {/* Device Segmented Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {allDeviceOptions.map((dev) => {
            const isActive = selectedDevice.toLowerCase() === dev.toLowerCase();
            return (
              <button
                key={dev}
                type="button"
                onClick={() => setSelectedDevice(dev)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none shrink-0 focus-visible:outline-2 focus-visible:outline-accent ${
                  isActive
                    ? "bg-accent/15 text-orange border border-accent/40 shadow-sm shadow-accent/20 font-semibold"
                    : "border border-border/80 bg-bg-elevated/70 text-fg-muted hover:border-border-strong hover:text-fg hover:bg-ink-800"
                }`}
              >
                {dev !== "All" && getDeviceIcon(dev)}
                <span>{dev === "All" ? "All Devices" : `${dev} Skins`}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Tool Bar */}
        <div className="rounded-2xl border border-border/80 bg-bg-elevated/80 backdrop-blur-md p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Debounced Search Field */}
          <div className="flex-1 relative">
            <Input
              id="product-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cut files by title, pattern, or device..."
              leftIcon={<Search className="h-4 w-4 text-orange" />}
              className="h-11 bg-ink-950/80 border-border hover:border-border-strong focus-visible:border-accent text-sm"
              aria-label="Search cut files by title, device or description"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-fg-muted hover:text-fg rounded-lg transition-colors cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort Selector & Reset */}
          <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
            {/* Sort Selector */}
            <div className="relative flex items-center">
              <span className="hidden md:inline-flex text-xs font-mono font-medium text-fg-muted uppercase tracking-wider mr-2">
                Sort:
              </span>
              <div className="relative">
                <select
                  id="product-sort-select"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as SortOption)}
                  aria-label="Sort products by"
                  className="h-11 rounded-xl bg-ink-950/80 pl-3.5 pr-9 font-sans text-xs sm:text-sm font-medium text-fg border border-border hover:border-border-strong focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent outline-none cursor-pointer appearance-none transition-all"
                >
                  <option value="featured" className="bg-ink-900 text-fg">
                    Featured Cuts
                  </option>
                  <option value="price-asc" className="bg-ink-900 text-fg">
                    Price: Low to High
                  </option>
                  <option value="price-desc" className="bg-ink-900 text-fg">
                    Price: High to Low
                  </option>
                  <option value="title-asc" className="bg-ink-900 text-fg">
                    Name: A to Z
                  </option>
                  <option value="newest" className="bg-ink-900 text-fg">
                    Newest Releases
                  </option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-fg-muted">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-ink-900 text-fg-muted hover:text-fg hover:border-border-strong hover:bg-ink-800 transition-all cursor-pointer font-sans text-xs focus-visible:outline-2 focus-visible:outline-accent shrink-0"
                aria-label="Reset all search and filter options"
              >
                <RotateCcw className="h-3 w-3 text-orange shrink-0" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Status Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-fg-muted px-1">
          <div>
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 text-orange animate-pulse">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                Loading precision cuts...
              </span>
            ) : (
              <span>
                Showing <strong className="text-gold font-bold">{totalCount}</strong>{" "}
                {totalCount === 1 ? "cut file" : "cut files"}
                {selectedDevice !== "All" && ` for ${selectedDevice}`}
              </span>
            )}
          </div>
          <div className="text-[11px] text-fg-muted/70 hidden sm:block">
            Pre-calibrated 0.05mm laser contours
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {products.map((product, idx) => (
            <ProductCard
              key={product._id}
              product={product}
              priority={idx < 4}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-border bg-bg-elevated/40 backdrop-blur-md p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto space-y-4 my-8">
          <div className="h-14 w-14 rounded-2xl bg-ink-900 border border-border flex items-center justify-center text-orange shadow-lg">
            <Search className="h-6 w-6 text-orange/80" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-lg text-fg">
              No matching cut files
            </h3>
            <p className="font-sans text-xs text-fg-muted max-w-xs leading-relaxed">
              We couldn’t find any skin cuts matching your search query. Try
              adjusting keywords or selecting another device.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-ink-900 text-xs font-medium text-fg hover:border-border-strong hover:bg-ink-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-orange" />
            <span>Clear search & filters</span>
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductsExplorer;
