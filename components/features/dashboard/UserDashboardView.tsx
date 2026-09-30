"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download,
  Bookmark,
  Receipt,
  Sparkles,
  Mail,
  ExternalLink,
  CheckCircle2,
  RotateCw,
} from "lucide-react";
import { UserDashboardData } from "@/lib/services/dashboard.service";
import { SpotlightCard } from "@/components/motion/react-bits/SpotlightCard";
import { CountUp } from "@/components/motion/react-bits/CountUp";
import { Badge } from "@/components/ui/badge";
import { PurchasedSkinCard } from "./PurchasedSkinCard";
import { BookmarkedSkinCard } from "./BookmarkedSkinCard";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  selectAllBookmarks,
  selectBookmarksCount,
  setInitialBookmarks,
  toggleBookmark,
} from "@/lib/redux/slices/bookmarksSlice";
import { setInitialPurchases } from "@/lib/redux/slices/purchasesSlice";

interface UserDashboardViewProps {
  initialData: UserDashboardData;
}

export function UserDashboardView({ initialData }: UserDashboardViewProps) {
  const dispatch = useAppDispatch();
  const reduxBookmarks = useAppSelector(selectAllBookmarks);
  const reduxBookmarksCount = useAppSelector(selectBookmarksCount);

  const [data, setData] = useState<UserDashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"purchases" | "bookmarks" | "transactions">(
    "purchases"
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize state whenever initialData changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const json = await res.json();
        if (json.userData) {
          setData(json.userData);
          if (json.userData.transactions) {
            dispatch(setInitialPurchases({ transactions: json.userData.transactions }));
          }
          setToastMessage("Vault synchronized with Lemon Squeezy!");
          setTimeout(() => setToastMessage(null), 3500);
        }
      }
    } catch (err) {
      console.error("Dashboard refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sync initial purchases and bookmarks to Redux if present
  React.useEffect(() => {
    if (initialData.transactions && initialData.transactions.length > 0) {
      dispatch(
        setInitialPurchases({
          transactions: initialData.transactions,
        })
      );
    }

    if (initialData.bookmarks && initialData.bookmarks.length > 0) {
      dispatch(
        setInitialBookmarks({
          bookmarks: initialData.bookmarks.map((b) => ({
            _id: b._id,
            userId: b.userId,
            productId: b.productId.toString(),
            productTitle: b.productTitle,
            productSlug: b.productSlug,
            productImage: b.productImage,
            productPrice: b.productPrice,
            compatibleDevices: b.compatibleDevices,
            createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : undefined,
            updatedAt: b.updatedAt ? new Date(b.updatedAt).toISOString() : undefined,
          })),
        })
      );
    }
  }, [dispatch, initialData.transactions, initialData.bookmarks]);

  const displayedBookmarks =
    reduxBookmarks.length > 0 || initialData.bookmarks.length === 0
      ? reduxBookmarks
      : initialData.bookmarks;

  const handleUnbookmark = async (productId: string) => {
    try {
      const result = await dispatch(toggleBookmark({ productId }));
      if (toggleBookmark.fulfilled.match(result)) {
        setToastMessage("Skin removed from bookmarks.");
      } else {
        setToastMessage("Could not remove bookmark.");
      }
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: unknown) {
      console.error(err);
      setToastMessage("Error removing bookmark. Please try again.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-ink-900 border border-gold/40 text-xs font-sans text-fg flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[10px] font-mono text-fg-muted hover:text-fg uppercase"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Collector Profile Card */}
      <SpotlightCard className="p-6 sm:p-8 bg-bg-elevated border-border/80 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-border/70 pb-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-ink-950 font-bold text-2xl shadow-lg shadow-orange/20 shrink-0">
              {(data.user.name || data.user.email || "C").charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="font-sans text-2xl font-bold text-fg">
                  {data.user.name}
                </h2>
                <Badge
                  variant={data.user.role === "admin" ? "gold" : "brand"}
                  size="sm"
                >
                  {data.user.role === "admin" ? "ADMIN OPERATOR" : "VERIFIED COLLECTOR"}
                </Badge>
              </div>
              <p className="font-sans text-xs text-fg-muted flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                <span>{data.user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold bg-bg border border-border/80 text-fg-muted hover:text-fg hover:border-gold/40 transition-all cursor-pointer disabled:opacity-50"
              title="Synchronize purchases with Lemon Squeezy"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-gold" : "text-fg-muted"}`} />
              <span>{isRefreshing ? "Syncing..." : "Sync Vault"}</span>
            </button>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-semibold bg-accent/15 border border-accent/30 text-orange hover:bg-accent/25 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Browse New Drops</span>
            </Link>
          </div>
        </div>

        {/* Quick Collector Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Owned Skins */}
          <div className="rounded-xl border border-border/80 bg-ink-900/60 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-medium text-fg-muted uppercase tracking-wider">
                Owned Cut Files
              </span>
              <Download className="h-4 w-4 text-orange" />
            </div>
            <div className="font-mono text-2xl font-bold text-fg">
              <CountUp to={data.stats.totalPurchased} duration={1.2} />
            </div>
            <p className="text-[11px] font-sans text-fg-muted">
              Lossless 300 DPI vector assets in vault
            </p>
          </div>

          {/* Saved Bookmarks */}
          <div className="rounded-xl border border-border/80 bg-ink-900/60 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-medium text-fg-muted uppercase tracking-wider">
                Bookmarked Skins
              </span>
              <Bookmark className="h-4 w-4 text-gold" />
            </div>
            <div className="font-mono text-2xl font-bold text-gold">
              <CountUp to={reduxBookmarksCount} duration={1.0} />
            </div>
            <p className="text-[11px] font-sans text-fg-muted">
              Saved for custom vinyl cutting
            </p>
          </div>

          {/* Total Invested */}
          <div className="rounded-xl border border-border/80 bg-ink-900/60 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-medium text-fg-muted uppercase tracking-wider">
                Total Spent
              </span>
              <Receipt className="h-4 w-4 text-accent-soft" />
            </div>
            <div className="font-mono text-2xl font-bold text-fg flex items-baseline">
              <span>$</span>
              <CountUp to={data.stats.totalSpent} duration={1.5} />
            </div>
            <p className="text-[11px] font-sans text-fg-muted">
              Lifetime license transactions
            </p>
          </div>
        </div>
      </SpotlightCard>

      {/* Navigation Tab Buttons */}
      <div className="flex items-center gap-2 p-1.5 bg-bg-elevated border border-border/80 rounded-2xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("purchases")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "purchases"
              ? "bg-accent/20 text-orange border border-accent/40 shadow-sm"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          <Download className="h-4 w-4" />
          <span>Purchased Cut Files ({data.transactions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bookmarks")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "bookmarks"
              ? "bg-accent/20 text-orange border border-accent/40 shadow-sm"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>Bookmarked Skins ({reduxBookmarksCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("transactions")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "transactions"
              ? "bg-accent/20 text-orange border border-accent/40 shadow-sm"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>Transactions & Invoices</span>
        </button>
      </div>

      {/* Tab 1: Purchased Cut Files */}
      {activeTab === "purchases" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-lg text-fg">
              Your Purchased Vinyl Skins & Outlines
            </h3>
            <span className="font-mono text-xs text-fg-muted">
              {data.transactions.length} production assets ready
            </span>
          </div>

          {data.transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-bg-elevated/40 p-12 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-ink-900 border border-border mx-auto flex items-center justify-center text-fg-muted">
                <Download className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-semibold text-base text-fg">
                  No Purchased Skins Yet
                </h4>
                <p className="font-sans text-xs text-fg-muted max-w-sm mx-auto">
                  Browse our catalogue to explore 0.05mm precision-mapped digital artworks for phones, tablets, and laptops.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-sans font-semibold bg-orange text-ink-950 hover:bg-gold transition-colors shadow-md shadow-orange/20"
              >
                Explore Catalogue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.transactions.map((txn) => (
                <PurchasedSkinCard key={txn._id} transaction={txn} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Bookmarked Skins */}
      {activeTab === "bookmarks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-lg text-fg">
              Your Bookmarked Skins
            </h3>
            <span className="font-mono text-xs text-fg-muted">
              {displayedBookmarks.length} saved artworks
            </span>
          </div>

          {displayedBookmarks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-bg-elevated/40 p-12 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-ink-900 border border-border mx-auto flex items-center justify-center text-fg-muted">
                <Bookmark className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-semibold text-base text-fg">
                  Your Bookmarks List is Empty
                </h4>
                <p className="font-sans text-xs text-fg-muted max-w-sm mx-auto">
                  Save designs while browsing the catalogue so you can review and download them later.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-sans font-semibold bg-orange text-ink-950 hover:bg-gold transition-colors shadow-md shadow-orange/20"
              >
                Browse Sticker Catalogue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBookmarks.map((bm) => (
                <BookmarkedSkinCard
                  key={bm._id?.toString() || bm.productId?.toString()}
                  bookmark={bm}
                  onUnbookmark={handleUnbookmark}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Transactions & Invoices */}
      {activeTab === "transactions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-lg text-fg">
              Purchase Receipts & Download Licences
            </h3>
            <span className="font-mono text-xs text-fg-muted">
              {data.transactions.length} records verified
            </span>
          </div>

          {data.transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-bg-elevated/40 p-8 text-center text-xs text-fg-muted">
              No transactions recorded for this account.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border/80 bg-bg-elevated shadow-lg">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="border-b border-border/80 bg-ink-950/60 text-fg-muted font-mono uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 sm:px-6 font-semibold">Transaction ID</th>
                    <th className="py-3.5 px-4 font-semibold">Skin Item</th>
                    <th className="py-3.5 px-4 font-semibold">Price</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-fg">
                  {data.transactions.map((txn) => (
                    <tr
                      key={txn._id}
                      className="hover:bg-ink-900/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-orange">
                        {txn.transactionId}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/products/${txn.productSlug}`}
                          className="font-bold text-fg hover:text-gold transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>{txn.productTitle}</span>
                          <ExternalLink className="h-3 w-3 text-fg-muted" />
                        </Link>
                        <div className="text-[10px] font-mono text-fg-muted">
                          {txn.licenseType}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-gold">
                        ${txn.price.toFixed(2)} {txn.currency}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 border border-accent/30 px-2 py-0.5 text-[10px] font-mono font-semibold text-orange uppercase">
                          <CheckCircle2 className="h-3 w-3" />
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-[11px] text-fg-muted">
                        {txn.createdAt
                          ? new Date(txn.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboardView;
