import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { GroupType, QuestionCategories } from "./../../types.d";
import { supabase } from "./../../utils/supabaseClient";

export interface RegisterState {
  // Group name
  group_name: string | null;
  // Whether to show a warning that the group name has not been set
  group_name_warning: boolean;

  // Group password
  password_protected: boolean;
  group_password: string | null;
  // Whether to show a warning that the group password has not been set
  group_password_warning: boolean;

  // Whether the user has selected categories to be included in the survey
  graphic_content: boolean;
  offensive_content: boolean;
  phobic_content: boolean;
  sexual_content: boolean;

  // Whether the survey should include any adult content at all, overrides content categories
  adult_content: boolean;

  // Whether the user has accepted the terms of the survey
  disclaimers_accepted: boolean;
  disclaimer_warning: boolean;

  // Register Error Message
  register_error: string | null;
}

const initialState: RegisterState = {
  group_name: null,
  group_name_warning: false,

  password_protected: false,
  group_password: null,
  group_password_warning: false,

  adult_content: false,
  graphic_content: false,
  offensive_content: false,
  phobic_content: false,
  sexual_content: false,

  disclaimers_accepted: false,
  disclaimer_warning: false,

  register_error: null,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    // Set the group name in the registration process
    setGroupName: (state, action) => {
      console.debug("setGroupName", action.payload);
      state.group_name = action.payload;
    },

    // Enable or disable password protection in the registration process
    setPasswordProtected: (state, action) => {
      console.debug("setPasswordProtected", action.payload);
      state.password_protected = action.payload;
    },

    // Set the group password in the registration process
    setGroupPassword: (state, action) => {
      console.debug("setGroupPassword", action.payload);
      state.group_password = action.payload;
    },

    // Set the adult content flag in the registration process
    setAdultContent: (state, action) => {
      console.debug("setAdultContent", action.payload);
      state.adult_content = action.payload;
    },

    // Set the question categories in the registration process
    setCategories: (state, action) => {
      console.debug("setCategories", action.payload);
      switch (action.payload.category) {
        case "graphic":
          state.graphic_content = action.payload.value;
          break;
        case "offensive":
          state.offensive_content = action.payload.value;
          break;
        case "phobic":
          state.phobic_content = action.payload.value;
          break;
        case "sexual":
          state.sexual_content = action.payload.value;
          break;
        case "clear":
          state.graphic_content = false;
          state.offensive_content = false;
          state.phobic_content = false;
          state.sexual_content = false;
          break;
      }
    },

    // Check if categories have been set and if disclaimers have been accepted
    uploadRegistration: (state, action) => {
      console.debug("uploadRegistration", action.payload);

      // Check if the user has set a group name
      if (state.group_name === null) {
        console.error("No group name set");
        state.group_name_warning = true;
        return;
      }

      // If the user has not enabled a password, set the password field to null
      if (!state.password_protected) {
        state.group_password = null;
      }
      // Check if the user has enabled a password but not set one
      if (state.password_protected && state.group_password === null) {
        console.error("No group password set");
        state.group_password_warning = true;
        return;
      }

      // Check if the user has enabled adult content, if not disable all content categories
      if (!state.adult_content) {
        state.graphic_content = false;
        state.offensive_content = false;
        state.phobic_content = false;
        state.sexual_content = false;
      }

      // Check if the user has accepted the disclaimers
      if (!state.disclaimers_accepted) {
        console.error("Disclaimers not accepted");
        return;
      }

      // If all checks pass, upload the registration to the database
      console.debug("Registration passed all checks");
      console.debug("Group name:", state.group_name);

      // Create a new group in the database
      console.debug("Uploading new group");
      supabase
        .from("groups")
        .insert([
          {
            name: state.group_name,
            password_protected: state.password_protected,
            password: state.group_password,
            graphic_content: state.graphic_content,
            offensive_content: state.offensive_content,
            phobic_content: state.phobic_content,
            sexual_content: state.sexual_content,
            disclaimers_accepted: state.disclaimers_accepted,
          },
        ])
        .then((response) => {
          console.debug("Response:", response);
          if (response.error) {
            state.register_error = response.error.message;
            console.error(response.error);
          }
        });
    },
  },
  // extraReducers(builder) {},
});

// Export reducer actions
export const {
  setCategories,
  setGroupName,
  setGroupPassword,
  setPasswordProtected,
  setAdultContent,
} = registerSlice.actions;

// Export Selectors
export const selectGroupName = (state: RootState) => ({
  group_name: state.register.group_name,
  group_name_warning: state.register.group_name_warning,
});

export const selectGroupPassword = (state: RootState) => ({
  password_protected: state.register.password_protected,
  group_password: state.register.group_password,
  group_password_warning: state.register.group_password_warning,
});

export const selectAdultContent = (state: RootState) =>
  state.register.adult_content;

export const selectContentCategories = (state: RootState) => ({
  graphic_content: state.register.graphic_content,
  offensive_content: state.register.offensive_content,
  phobic_content: state.register.phobic_content,
  sexual_content: state.register.sexual_content,
});

export const selectDisclaimers = (state: RootState) => ({
  disclaimers_accepted: state.register.disclaimers_accepted,
  disclaimer_warning: state.register.disclaimer_warning,
});

export default registerSlice.reducer;
