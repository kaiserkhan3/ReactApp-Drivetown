import { configureStore } from "@reduxjs/toolkit";
import { searchSlice } from "./search-slice";
import { modalSlice } from "./modal-slice";
import { commonDataSlice } from "./master-data-slice";

export const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
    modal: modalSlice.reducer,
    commonData: commonDataSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
