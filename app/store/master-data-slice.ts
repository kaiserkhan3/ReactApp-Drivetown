import { getMasterPageData } from "@/actions/inventory-actions";
import { MasterPageData } from "@/models/inventory/models";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MyThunkArg {
  id?: string;
}

interface MyThunkReturned {
  data: MasterPageData;
}

interface MyThunkRejectedValue {
  error: string;
}

export const getCommonData = createAsyncThunk(
  "CommonDataSlice/getCommonData",
  async () => {
    const response = await getMasterPageData();
    // if (!response) {
    //   return { rejectValue: "No data found" };
    // }
    return { data: response };
  }
);
const fetchData = createAsyncThunk<
  MyThunkReturned, // Type of the value returned when the promise is fulfilled
  MyThunkArg, // Type of the argument passed to the payload creator
  { rejectValue: MyThunkRejectedValue } // Type of the value returned when the promise is rejected with rejectWithValue
>(
  "mySlice/fetchData", // Action type prefix
  async (arg: MyThunkArg, { rejectWithValue, getState, dispatch }) => {
    try {
      // Perform asynchronous operation, e.g., API call
      const response = await getMasterPageData();
      if (!response) {
        // Handle non-OK responses and reject with a specific value
        return rejectWithValue({ error: "Failed to fetch data" });
      }
      return { data: response }; // Return the fulfilled value
    } catch (error) {
      // Handle errors during the asynchronous operation
      return rejectWithValue({ error: (error as Error).message });
    }
  }
);

const initialState: MasterPageData = {
  availableVehiclesCount: 0,
  appoinmentsCount: 0,
  todoListCount: 0,
  repairShopCount: 0,
  wholesaleCount: 0,
  onlineCount: 0,
  notOnlineCount: 0,
  inspectionCount: 0,
  registerationCount: 0,
  lessthan30DaysCount: 0,
  between3060daysCount: 0,
  moreThan60DaysCount: 0,
  monthlyProfit: 0,
};

export const commonDataSlice = createSlice({
  name: "commonData",
  initialState,
  reducers: {
    updateAppointmentCount(state) {
      state.appoinmentsCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCommonData.fulfilled, (state, action: any) => {
      state = action.payload.data;
      return state;
    });
  },
});

export const { updateAppointmentCount } = commonDataSlice.actions;
