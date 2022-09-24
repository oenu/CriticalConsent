import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { supabase } from "./../../utils/supabaseClient";

import randomWords from "random-words";

export interface RegistrationResponse {
  // This is the response from the server on successful registration
  id: number;
  created_at: string;
  mature: boolean;
  name: string;
  graphic_content: boolean;
  offensive_content: boolean;
  phobic_content: boolean;
  sexual_content: boolean;
  password_protected: boolean;
  password: string | null;
  disclaimers_accepted: boolean;
  uuid: string;
  share_code: string;
}

export interface RegisterState {
  // Group name
  group_name: string | null;
  // Whether to show a warning that the group name has not been set
  group_name_warning: boolean;
  share_code: string | null;

  // Group password
  password_protected: boolean;
  password: string | null;
  // Whether to show a warning that the group password has not been set
  password_warning: boolean;

  // Whether the user has selected categories to be included in the survey
  graphic_content: boolean;
  offensive_content: boolean;
  phobic_content: boolean;
  sexual_content: boolean;

  // Whether the survey should include any mature content at all, overrides content categories
  mature_content: boolean;

  // Whether the user has accepted the terms of the survey
  disclaimers_accepted: boolean;
  disclaimer_warning: boolean;
  disclaimer_modal: boolean;

  // Register Error Message
  upload_error: string | null;
  upload_status: "loading" | "failed" | "success" | "idle";
  upload_response: RegistrationResponse | null;

  // Upload Content Validation - Whether the content to be uploaded is valid
  upload_content_valid: boolean | null;
}

const initialState: RegisterState = {
  group_name: null,
  group_name_warning: false,
  share_code: null,

  password_protected: false,
  password: null,
  password_warning: false,

  mature_content: false,
  graphic_content: false,
  offensive_content: false,
  phobic_content: false,
  sexual_content: false,

  disclaimers_accepted: false,
  disclaimer_warning: false,
  disclaimer_modal: false,

  upload_error: null,
  upload_status: "idle",
  upload_response: null,

  upload_content_valid: null,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    // Set the group name in the registration process
    setGroupName: (state, action) => {
      console.debug("setGroupName", action.payload);
      state.group_name = action.payload;
      console.log("state.group_name", state.group_name);
    },
    // Set Group name warning
    setGroupNameWarning: (state, action) => {
      console.debug("setGroupNameWarning", action.payload);
      state.group_name_warning = action.payload;
    },

    // Enable or disable password protection in the registration process
    setPasswordProtected: (state, action) => {
      console.debug("setPasswordProtected", action.payload);
      state.password_protected = action.payload;
    },

    // Set whether the password warning should be shown
    setPasswordWarning: (state, action) => {
      console.debug("setPasswordWarning", action.payload);
      state.password_warning = action.payload;
    },

    // Set the group password in the registration process
    setGroupPassword: (state, action) => {
      console.debug("setGroupPassword", action.payload);
      state.password = action.payload;
    },

    // Set the mature content flag in the registration process
    setMatureContent: (state, action) => {
      console.debug("setMatureContent", action.payload);
      state.mature_content = action.payload;

      // If the mature content flag is disabled, then all other content flags should be set to false
      if (!action.payload) {
        state.graphic_content = false;
        state.offensive_content = false;
        state.phobic_content = false;
        state.sexual_content = false;
      }
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

    // Set the disclaimer accepted flag in the registration process
    setDisclaimersAccepted: (state, action) => {
      console.debug("setDisclaimersAccepted", action.payload);
      state.disclaimers_accepted = action.payload;
    },

    // Set the disclaimer warning flag in the registration process
    setDisclaimerWarning: (state, action) => {
      console.debug("setDisclaimerWarning", action.payload);
      state.disclaimer_warning = action.payload;
    },

    // Set the disclaimer modal flag in the registration process
    setDisclaimerModalShown: (state, action) => {
      console.debug("setDisclaimerModal", action.payload);
      state.disclaimer_modal = action.payload;
    },

    // Upload the registration data to the server
    validateRegistration: (state) => {
      console.debug("Uploading new group");
      console.debug("Group name:", state.group_name);
      // Check if the user has set a group name
      if (state.group_name === null) {
        console.error("No group name set");
        state.group_name_warning = true;
        state.upload_content_valid = false;
        throw new Error("No group name set");
      }

      // If the user has not enabled a password, set the password field to null
      if (!state.password_protected) {
        state.password = null;
      }
      // Check if the user has enabled a password but not set one
      if (state.password_protected && state.password === null) {
        console.error("No group password set");
        state.password_warning = true;
        state.upload_content_valid = false;
        throw new Error("No group password set");
      }

      // Check if the user has enabled mature content, if not disable all content categories
      if (!state.mature_content) {
        state.graphic_content = false;
        state.offensive_content = false;
        state.phobic_content = false;
        state.sexual_content = false;
      }

      // Check if the user has accepted the disclaimers
      if (!state.disclaimers_accepted) {
        console.error("Disclaimers not accepted");
        state.disclaimer_warning = true;
        state.upload_content_valid = false;
        throw new Error("Disclaimers not accepted");
      }

      // If all checks pass, upload the registration to the database
      console.debug("Registration passed all checks");
      console.debug("Group name:", state.group_name);

      // Set the status to valid
      state.upload_content_valid = true;
    },
    // Reset the registration process
    clearRegistration: (state) => {
      console.debug("Clearing registration");
      state.group_name = null;
      state.group_name_warning = false;
      state.password_protected = false;
      state.password = null;
      state.password_warning = false;
      state.mature_content = false;
      state.graphic_content = false;
      state.offensive_content = false;
      state.phobic_content = false;
      state.sexual_content = false;
      state.disclaimers_accepted = false;
      state.disclaimer_warning = false;
      state.disclaimer_modal = false;
      state.upload_error = null;
      state.upload_status = "idle";
      state.upload_response = null;
      state.upload_content_valid = null;
      state.share_code = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadRegistrationAsync.pending, (state) => {
        state.upload_status = "loading";
        console.debug("uploadRegistrationAsync.pending");
      })
      .addCase(uploadRegistrationAsync.fulfilled, (state, action) => {
        state.upload_status = "success";

        console.debug("uploadRegistrationAsync.fulfilled", action.payload);
      })
      .addCase(uploadRegistrationAsync.rejected, (state, action) => {
        state.upload_status = "failed";
        state.upload_error = action.error.message || "Unknown error";
        console.debug("uploadRegistrationAsync.rejected", action.error);
      });
  },
});

// Registration Async Thunk
export const uploadRegistrationAsync = createAsyncThunk(
  "registration/registerGroup",
  async (arg_, { getState }): Promise<RegistrationResponse> => {
    const state = getState() as RootState;

    // Generate a random share code
    const share_code = randomWords({ exactly: 3, join: "-" });

    // Create a new group in the database
    console.debug("Uploading new group");
    const { data, error } = await supabase.from("groups").insert([
      {
        name: state.register.group_name,
        password_protected: state.register.password_protected,
        password: state.register.password,
        graphic_content: state.register.graphic_content,
        offensive_content: state.register.offensive_content,
        phobic_content: state.register.phobic_content,
        sexual_content: state.register.sexual_content,
        disclaimers_accepted: state.register.disclaimers_accepted,
        mature: state.register.mature_content,
        share_code,
      },
    ]);

    if (error) {
      console.error("Error uploading new group:", error);
      throw new Error(error.message);
    } else if (data) {
      console.debug("Group upload response:", data);
      return data[0];
    } else {
      console.error("Unknown error uploading new group");
      throw new Error("Unknown error uploading new group");
    }
  }
);

// Export reducer actions
export const {
  setGroupName,
  setGroupNameWarning,
  setGroupPassword,
  setPasswordProtected,
  setPasswordWarning,
  setCategories,
  setMatureContent,
  setDisclaimersAccepted,
  setDisclaimerWarning,
  setDisclaimerModalShown,
  validateRegistration,
  clearRegistration,
} = registerSlice.actions;

// Export Selectors
export const selectGroupName = (state: RootState) => ({
  group_name: state.register.group_name,
  group_name_warning: state.register.group_name_warning,
});

// Selector for if the upload content has been processed and validated
export const selectUploadContentValid = (state: RootState) =>
  state.register.upload_content_valid;

// Selector for register status
export const selectUploadStatus = (state: RootState) =>
  state.register.upload_status;

export const selectGroupPassword = (state: RootState) => ({
  password_protected: state.register.password_protected,
  password: state.register.password,
  password_warning: state.register.password_warning,
});

export const selectMatureContent = (state: RootState) =>
  state.register.mature_content;

export const selectContentCategories = (state: RootState) => ({
  graphic_content: state.register.graphic_content,
  offensive_content: state.register.offensive_content,
  phobic_content: state.register.phobic_content,
  sexual_content: state.register.sexual_content,
});

export const selectDisclaimers = (state: RootState) => ({
  disclaimers_accepted: state.register.disclaimers_accepted,
  disclaimer_warning: state.register.disclaimer_warning,
  disclaimer_modal: state.register.disclaimer_modal,
});

export default registerSlice.reducer;
