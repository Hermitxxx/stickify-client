import { configureStore } from "@reduxjs/toolkit";
import bookmarksReducer from "./slices/bookmarksSlice";
import purchasesReducer from "./slices/purchasesSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      bookmarks: bookmarksReducer,
      purchases: purchasesReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

