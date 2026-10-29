import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface VerificationState {
  rejectedTabs: string[];
}

const initialState: VerificationState = {
  rejectedTabs: [],
};

export const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    addRejectedTab: (state, action: PayloadAction<string>) => {
      if (!state.rejectedTabs.includes(action.payload)) {
        state.rejectedTabs.push(action.payload);
      }
    },
    removeRejectedTab: (state, action: PayloadAction<string>) => {
      state.rejectedTabs = state.rejectedTabs.filter((tab) => tab !== action.payload);
    },
    clearRejectedTabs: (state) => {
      state.rejectedTabs = [];
    },
  },
});

export const { addRejectedTab, removeRejectedTab, clearRejectedTabs } = verificationSlice.actions;

export const selectRejectedTabs = (state: any) => state.verification.rejectedTabs;

export default verificationSlice.reducer;
