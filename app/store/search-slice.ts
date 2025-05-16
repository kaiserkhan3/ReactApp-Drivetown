import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type displayType = "grid" | "list";

type searchItem = {
  searchText: string | undefined;
  make: string | undefined;
  year: string | undefined;
  status: string | undefined;
  displayType: displayType;
};

const initialState: searchItem = {
  searchText: undefined,
  make: undefined,
  year: undefined,
  status: "Available",
  displayType: "grid",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    updateStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    updateYear(state, action: PayloadAction<string | undefined>) {
      state.year = action.payload;
    },
    updateSearchText(state, action: PayloadAction<string | undefined>) {
      state.searchText = action.payload;
    },
    updateMake(state, action: PayloadAction<string | undefined>) {
      state.make = action.payload;
    },
    updateDisplayType(state, action: PayloadAction<displayType>) {
      state.displayType = action.payload;
    },
  },
});

export const {
  updateMake,
  updateSearchText,
  updateStatus,
  updateYear,
  updateDisplayType,
} = searchSlice.actions;
