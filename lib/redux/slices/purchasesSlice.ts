import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { ITransaction } from "@/lib/models/transaction.model";

export interface PurchasesState {
  items: ITransaction[];
  ownedSlugs: string[];
  ownedProductIds: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  initialized: boolean;
}

const initialState: PurchasesState = {
  items: [],
  ownedSlugs: [],
  ownedProductIds: [],
  status: "idle",
  error: null,
  initialized: false,
};

/**
 * Fetch all verified purchases for current authenticated user
 */
export const fetchPurchases = createAsyncThunk(
  "purchases/fetchPurchases",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/dashboard/purchases", {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401) {
          return { transactions: [], ownedSlugs: [], ownedProductIds: [] };
        }
        const data = await res.json();
        return rejectWithValue(data.error || "Failed to fetch purchases");
      }

      const data = await res.json();
      return {
        transactions: (data.transactions || []) as ITransaction[],
        ownedSlugs: (data.ownedSlugs || []) as string[],
        ownedProductIds: (data.ownedProductIds || []) as string[],
      };
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Network error fetching purchases");
    }
  }
);

/**
 * Confirm and record a purchase (e.g. after checkout redirect or simulation)
 */
export const confirmPurchase = createAsyncThunk(
  "purchases/confirmPurchase",
  async (
    payload: { productSlug: string; transactionId?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/dashboard/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        return rejectWithValue(data.error || "Failed to confirm purchase");
      }

      const data = await res.json();
      return data.transaction as ITransaction;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Network error confirming purchase");
    }
  }
);

export const purchasesSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {
    setInitialPurchases: (
      state,
      action: PayloadAction<{ transactions: ITransaction[] }>
    ) => {
      state.items = action.payload.transactions;
      const slugs: string[] = [];
      const productIds: string[] = [];

      for (const t of action.payload.transactions) {
        if (t.productSlug && !slugs.includes(t.productSlug)) {
          slugs.push(t.productSlug);
        }
        const pId = typeof t.productId === "string" ? t.productId : String(t.productId);
        if (pId && !productIds.includes(pId)) {
          productIds.push(pId);
        }
      }

      state.ownedSlugs = slugs;
      state.ownedProductIds = productIds;
      state.initialized = true;
      state.status = "succeeded";
    },
    addPurchasedSkin: (state, action: PayloadAction<ITransaction>) => {
      const txn = action.payload;
      if (!state.items.some((item) => item.transactionId === txn.transactionId || item._id === txn._id)) {
        state.items.unshift(txn);
      }
      if (txn.productSlug && !state.ownedSlugs.includes(txn.productSlug)) {
        state.ownedSlugs.push(txn.productSlug);
      }
      const pId = typeof txn.productId === "string" ? txn.productId : String(txn.productId);
      if (pId && !state.ownedProductIds.includes(pId)) {
        state.ownedProductIds.push(pId);
      }
      state.initialized = true;
    },
    clearPurchases: (state) => {
      state.items = [];
      state.ownedSlugs = [];
      state.ownedProductIds = [];
      state.status = "idle";
      state.initialized = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchPurchases
    builder.addCase(fetchPurchases.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchPurchases.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload.transactions;
      state.ownedSlugs = action.payload.ownedSlugs;
      state.ownedProductIds = action.payload.ownedProductIds;
      state.initialized = true;
    });
    builder.addCase(fetchPurchases.rejected, (state, action) => {
      state.status = "failed";
      state.error = (action.payload as string) || "Failed to load purchases";
      state.initialized = true;
    });

    // confirmPurchase
    builder.addCase(confirmPurchase.fulfilled, (state, action) => {
      const txn = action.payload;
      if (txn) {
        if (!state.items.some((item) => item.transactionId === txn.transactionId || item._id === txn._id)) {
          state.items.unshift(txn);
        }
        if (txn.productSlug && !state.ownedSlugs.includes(txn.productSlug)) {
          state.ownedSlugs.push(txn.productSlug);
        }
        const pId = typeof txn.productId === "string" ? txn.productId : String(txn.productId);
        if (pId && !state.ownedProductIds.includes(pId)) {
          state.ownedProductIds.push(pId);
        }
      }
    });
  },
});

export const { setInitialPurchases, addPurchasedSkin, clearPurchases } =
  purchasesSlice.actions;

// Selectors
export const selectPurchasesState = (state: RootState) => state.purchases;
export const selectAllPurchases = (state: RootState) => state.purchases.items;
export const selectOwnedSlugs = (state: RootState) => state.purchases.ownedSlugs;
export const selectOwnedProductIds = (state: RootState) => state.purchases.ownedProductIds;
export const selectPurchasesStatus = (state: RootState) => state.purchases.status;
export const selectPurchasesCount = (state: RootState) => state.purchases.items.length;
export const selectIsPurchasesInitialized = (state: RootState) => state.purchases.initialized;

export const selectIsSkinOwned = createSelector(
  [
    (state: RootState) => state.purchases.ownedSlugs,
    (state: RootState) => state.purchases.ownedProductIds,
    (_: RootState, slugOrId?: string) => slugOrId,
  ],
  (ownedSlugs, ownedProductIds, slugOrId) => {
    if (!slugOrId) return false;
    return ownedSlugs.includes(slugOrId) || ownedProductIds.includes(slugOrId);
  }
);

export default purchasesSlice.reducer;
