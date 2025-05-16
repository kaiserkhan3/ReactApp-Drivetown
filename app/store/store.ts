import { configureStore } from "@reduxjs/toolkit";
import { searchSlice } from "./search-slice";
import { modalSlice } from "./modal-slice";

export const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
    modal: modalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
