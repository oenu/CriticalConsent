import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";

export interface AppState {
  darkMode: boolean;
  burgerMenuOpen: boolean;
  showAdultContent: boolean;
  acceptAdultDisclaimer: boolean;
}

const initialState: AppState = {
  darkMode: false,
  burgerMenuOpen: false,
  showAdultContent: false,
  acceptAdultDisclaimer: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Toggle dark mode for the app
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    // Toggle burger menu open
    toggleBurgerMenu: (state) => {
      state.burgerMenuOpen = !state.burgerMenuOpen;
    },
    // Close burger menu
    closeBurgerMenu: (state) => {
      state.burgerMenuOpen = false;
    },
    // Toggle whether to show adult content in survey
    setShowAdultContent: (state, action: PayloadAction<boolean>) => {
      state.showAdultContent = action.payload;
    },
    // Toggle whether survey creator has accepted adult disclaimer
    setAcceptAdultContent: (state, action: PayloadAction<boolean>) => {
      state.acceptAdultDisclaimer = action.payload;
    },
  },
});

// Export whether dark mode is enabled
export const selectDarkMode = (state: RootState) => state.app.darkMode;

// Export whether the burger menu is open
export const selectBurgerMenuOpen = (state: RootState) =>
  state.app.burgerMenuOpen;

// Export whether to show adult content
export const selectShowAdultContent = (state: RootState) =>
  state.app.showAdultContent;

// Export whether the survey creator has accepted adult content disclaimer
export const selectAcceptAdultDisclaimer = (state: RootState) =>
  state.app.acceptAdultDisclaimer;

// Export reducer actions
export const {
  toggleDarkMode,
  toggleBurgerMenu,
  closeBurgerMenu,
  setAcceptAdultContent,
  setShowAdultContent,
} = appSlice.actions;

// Export the reducer
export default appSlice.reducer;
