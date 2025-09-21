import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type modalState = {
  modalVisible: boolean;
  isAddedCostModalVisible: boolean;
  isDetailsView: boolean;
  isMarkAsSoldVisible: boolean;
  isAppointmentVisble: boolean;
  isAddTodoVisible: boolean;
  isViewAllTodosVisible: boolean;
};

const initialState: modalState = {
  modalVisible: false,
  isAddedCostModalVisible: false,
  isDetailsView: false,
  isMarkAsSoldVisible: false,
  isAppointmentVisble: false,
  isAddTodoVisible: false,
  isViewAllTodosVisible: false,
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
    updateIsDetailViewFlag(
      state,
      actions: PayloadAction<{ isDetailsView: boolean }>
    ) {
      state.isDetailsView = actions.payload.isDetailsView;
    },
    updateisMarkAsSoldVisibleFlag(
      state,
      actions: PayloadAction<{ isMarkAsSoldVisible: boolean }>
    ) {
      state.isMarkAsSoldVisible = actions.payload.isMarkAsSoldVisible;
    },
    updateIsAppointmentVisibleFlag(
      state,
      actions: PayloadAction<{ isAppointmentVisble: boolean }>
    ) {
      state.isAppointmentVisble = actions.payload.isAppointmentVisble;
    },
    updateIsAddTodoVisibleFlag(
      state,
      actions: PayloadAction<{ isAddTodoVisible: boolean }>
    ) {
      state.isAddTodoVisible = actions.payload.isAddTodoVisible;
    },
    updateIsViewAllTodosVisibleFlag(
      state,
      actions: PayloadAction<{ isViewAllTodosVisible: boolean }>
    ) {
      state.isViewAllTodosVisible = actions.payload.isViewAllTodosVisible;
    },
  },
});

export const {
  updateModalCloseState,
  updateAddedCostModalCloseState,
  updateIsDetailViewFlag,
  updateisMarkAsSoldVisibleFlag,
  updateIsAppointmentVisibleFlag,
  updateIsAddTodoVisibleFlag,
  updateIsViewAllTodosVisibleFlag,
} = modalSlice.actions;
