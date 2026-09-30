import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface BookmarkItem {
  _id: string;
  userId?: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  productImage: string;
  productPrice: number;
  compatibleDevices?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ToggleBookmarkPayload {
  productId: string;
  productTitle?: string;
  productSlug?: string;
  productImage?: string;
  productPrice?: number;
  compatibleDevices?: string[];
}

export interface RejectPayload {
  message: string;
  unauthorized?: boolean;
  productId?: string;
}

export interface BookmarksState {
  items: BookmarkItem[];
  bookmarkedIds: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  initialized: boolean;
  loadingProductIds: string[];
}

const initialState: BookmarksState = {
  items: [],
  bookmarkedIds: [],
  status: "idle",
  error: null,
  initialized: false,
  loadingProductIds: [],
};

/**
 * Fetch all bookmarks for current user session
 */
export const fetchBookmarks = createAsyncThunk(
  "bookmarks/fetchBookmarks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/dashboard/bookmarks", {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Unauthenticated user - silent empty list
          return { bookmarks: [], bookmarkedIds: [] };
        }
        const data = await res.json();
        return rejectWithValue(data.error || "Failed to fetch bookmarks");
      }

      const data = await res.json();
      return {
        bookmarks: (data.bookmarks || []) as BookmarkItem[],
        bookmarkedIds: (data.bookmarkedIds || []) as string[],
      };
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Network error fetching bookmarks");
    }
  }
);

/**
 * Toggle bookmark action with optimistic state management
 */
export const toggleBookmark = createAsyncThunk<
  {
    action: "added" | "removed";
    productId: string;
    bookmark?: BookmarkItem;
    fallbackItem?: BookmarkItem;
  },
  ToggleBookmarkPayload,
  { rejectValue: RejectPayload }
>(
  "bookmarks/toggleBookmark",
  async (payload: ToggleBookmarkPayload, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const isCurrentlyBookmarked = state.bookmarks.bookmarkedIds.includes(
      payload.productId
    );

    try {
      if (isCurrentlyBookmarked) {
        const res = await fetch(
          `/api/dashboard/bookmarks?productId=${payload.productId}`,
          {
            method: "DELETE",
          }
        );

        if (res.status === 401) {
          return rejectWithValue({
            message: "Please sign in to manage bookmarks",
            unauthorized: true,
            productId: payload.productId,
          });
        }

        if (!res.ok) {
          const data = await res.json();
          return rejectWithValue({
            message: data.error || "Failed to remove bookmark",
            productId: payload.productId,
          });
        }

        return {
          action: "removed",
          productId: payload.productId,
        };
      } else {
        const res = await fetch("/api/dashboard/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: payload.productId }),
        });

        if (res.status === 401) {
          return rejectWithValue({
            message: "Please sign in to bookmark items",
            unauthorized: true,
            productId: payload.productId,
          });
        }

        if (!res.ok) {
          const data = await res.json();
          return rejectWithValue({
            message: data.error || "Failed to add bookmark",
            productId: payload.productId,
          });
        }

        const data = await res.json();
        return {
          action: "added",
          productId: payload.productId,
          bookmark: data.bookmark as BookmarkItem | undefined,
          fallbackItem: {
            _id: data.bookmark?._id || `temp-${payload.productId}`,
            productId: payload.productId,
            productTitle: payload.productTitle || "Precision Skin Cut",
            productSlug: payload.productSlug || payload.productId,
            productImage: payload.productImage || "",
            productPrice: payload.productPrice || 0,
            compatibleDevices: payload.compatibleDevices || [],
          },
        };
      }
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue({
        message: error.message || "Failed to update bookmark",
        productId: payload.productId,
      });
    }
  }
);

export const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    setInitialBookmarks: (
      state,
      action: PayloadAction<{ bookmarks: BookmarkItem[] }>
    ) => {
      state.items = action.payload.bookmarks;
      state.bookmarkedIds = action.payload.bookmarks.map((b) => b.productId);
      state.initialized = true;
      state.status = "succeeded";
    },
    clearBookmarkError: (state) => {
      state.error = null;
    },
    clearAllBookmarks: (state) => {
      state.items = [];
      state.bookmarkedIds = [];
      state.status = "idle";
      state.initialized = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchBookmarks
    builder.addCase(fetchBookmarks.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchBookmarks.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload.bookmarks;
      state.bookmarkedIds = action.payload.bookmarkedIds;
      state.initialized = true;
    });
    builder.addCase(fetchBookmarks.rejected, (state, action) => {
      state.status = "failed";
      state.error = (action.payload as string) || "Failed to load bookmarks";
      state.initialized = true;
    });

    // toggleBookmark pending
    builder.addCase(toggleBookmark.pending, (state, action) => {
      const { productId } = action.meta.arg;
      if (!state.loadingProductIds.includes(productId)) {
        state.loadingProductIds.push(productId);
      }
      state.error = null;
    });

    // toggleBookmark fulfilled
    builder.addCase(toggleBookmark.fulfilled, (state, action) => {
      const { action: toggleAction, productId } = action.payload;
      state.loadingProductIds = state.loadingProductIds.filter(
        (id) => id !== productId
      );

      if (toggleAction === "added") {
        if (!state.bookmarkedIds.includes(productId)) {
          state.bookmarkedIds.push(productId);
        }
        const newBookmark =
          action.payload.bookmark || action.payload.fallbackItem;
        if (newBookmark && !state.items.some((b) => b.productId === productId)) {
          state.items.unshift(newBookmark);
        }
      } else {
        state.bookmarkedIds = state.bookmarkedIds.filter((id) => id !== productId);
        state.items = state.items.filter(
          (b) => b.productId !== productId && b._id !== productId
        );
      }
    });

    // toggleBookmark rejected
    builder.addCase(toggleBookmark.rejected, (state, action) => {
      const payload = action.payload;
      const productId = payload?.productId || action.meta.arg.productId;
      state.loadingProductIds = state.loadingProductIds.filter(
        (id) => id !== productId
      );
      state.error = payload?.message || "Failed to update bookmark";
    });
  },
});

export const { setInitialBookmarks, clearBookmarkError, clearAllBookmarks } =
  bookmarksSlice.actions;

// Selectors
export const selectBookmarksState = (state: RootState) => state.bookmarks;
export const selectAllBookmarks = (state: RootState) => state.bookmarks.items;
export const selectBookmarkedIds = (state: RootState) =>
  state.bookmarks.bookmarkedIds;
export const selectBookmarksStatus = (state: RootState) =>
  state.bookmarks.status;
export const selectBookmarksError = (state: RootState) =>
  state.bookmarks.error;
export const selectBookmarksCount = (state: RootState) =>
  state.bookmarks.bookmarkedIds.length;
export const selectIsBookmarksInitialized = (state: RootState) =>
  state.bookmarks.initialized;

export const selectIsProductLoading = createSelector(
  [
    (state: RootState) => state.bookmarks.loadingProductIds,
    (_: RootState, productId: string) => productId,
  ],
  (loadingIds, productId) => loadingIds.includes(productId)
);

export const selectIsProductBookmarked = createSelector(
  [
    (state: RootState) => state.bookmarks.bookmarkedIds,
    (_: RootState, productId: string) => productId,
  ],
  (ids, productId) => ids.includes(productId)
);

export default bookmarksSlice.reducer;
