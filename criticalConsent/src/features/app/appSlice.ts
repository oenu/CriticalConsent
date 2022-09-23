import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";

// App Slice
// This slice is used to store the state of the app, such as the theme, language, and other app-wide settings

export interface AppState {
  darkMode: boolean;
  burgerMenuOpen: boolean;
}

const initialState: AppState = {
  darkMode: false,
  burgerMenuOpen: false,
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
  },
});

// Export whether dark mode is enabled
export const selectDarkMode = (state: RootState) => state.app.darkMode;

// Export whether the burger menu is open
export const selectBurgerMenuOpen = (state: RootState) =>
  state.app.burgerMenuOpen;

// Export reducer actions
export const { toggleDarkMode, toggleBurgerMenu, closeBurgerMenu } =
  appSlice.actions;

// Export the reducer
export default appSlice.reducer;
