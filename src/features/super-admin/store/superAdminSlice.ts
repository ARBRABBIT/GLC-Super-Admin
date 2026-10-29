import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SuperAdminState {
  salesPeriod: string;
  subscriberPeriod: string;
}

const initialState: SuperAdminState = {
  salesPeriod: "Week",
  subscriberPeriod: "Week",
};

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState,
  reducers: {
    setSalesPeriod(state, action: PayloadAction<string>) {
      state.salesPeriod = action.payload;
    },
    setSubscriberPeriod(state, action: PayloadAction<string>) {
      state.subscriberPeriod = action.payload;
    },
  },
});

export const { setSalesPeriod, setSubscriberPeriod } = superAdminSlice.actions;
export default superAdminSlice.reducer;
