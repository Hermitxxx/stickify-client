"use client";

import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import {
  fetchBookmarks,
  setInitialBookmarks,
  BookmarkItem,
} from "./slices/bookmarksSlice";
import {
  fetchPurchases,
  setInitialPurchases,
} from "./slices/purchasesSlice";
import { ITransaction } from "@/lib/models/transaction.model";

interface StoreProviderProps {
  children: React.ReactNode;
  initialBookmarks?: BookmarkItem[];
  initialPurchases?: ITransaction[];
}

export function StoreProvider({
  children,
  initialBookmarks,
  initialPurchases,
}: StoreProviderProps) {
  const [store] = useState(() => {
    const s = makeStore();
    if (initialBookmarks && initialBookmarks.length > 0) {
      s.dispatch(
        setInitialBookmarks({ bookmarks: initialBookmarks })
      );
    }
    if (initialPurchases && initialPurchases.length > 0) {
      s.dispatch(
        setInitialPurchases({ transactions: initialPurchases })
      );
    }
    return s;
  });

  useEffect(() => {
    if (!initialBookmarks || initialBookmarks.length === 0) {
      store.dispatch(fetchBookmarks());
    }
    if (!initialPurchases || initialPurchases.length === 0) {
      store.dispatch(fetchPurchases());
    }
  }, [store, initialBookmarks, initialPurchases]);

  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;

