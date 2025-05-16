import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type modalState = {
  modalVisible: boolean;
  isAddedCostModalVisible: boolean;
};

const initialState: modalState = {
  modalVisible: false,
  isAddedCostModalVisible: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    updateModalCloseState(
      state,
      actions: PayloadAction<{ modalVisible: boolean }>
    ) {
      state.modalVisible = actions.payload.modalVisible;
    },
    updateAddedCostModalCloseState(
      state,
      actions: PayloadAction<{ isAddedCostModalVisible: boolean }>
    ) {
      state.isAddedCostModalVisible = actions.payload.isAddedCostModalVisible;
    },
  },
});

export const { updateModalCloseState, updateAddedCostModalCloseState } =
  modalSlice.actions;
