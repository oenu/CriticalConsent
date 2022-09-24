import { RootState } from "./../../redux/store";
import { createSlice } from "@reduxjs/toolkit";

export interface DashboardState {
  qr_modal_open: boolean;
}

const initialState: DashboardState = {
  qr_modal_open: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setQrModalOpen: (state, action) => {
      state.qr_modal_open = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const selectQrModalOpen = (state: RootState) =>
  state.dashboard.qr_modal_open;

export const { setQrModalOpen } = dashboardSlice.actions;

export default dashboardSlice.reducer;
