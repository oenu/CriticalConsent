import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { GroupType, QuestionCategories } from "./../../types.d";
import { supabase } from "./../../utils/supabaseClient";
export interface GroupState {
  id: number | null;
  name: string | null;
  nsfw: boolean | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  graphic_content: boolean | null;
  offensive_content: boolean | null;
  phobic_content: boolean | null;
  sexual_content: boolean | null;
}

const initialState: GroupState = {
  id: null,
  name: null,
  nsfw: null,
  status: "idle",
  error: null,
  graphic_content: null,
  offensive_content: null,
  phobic_content: null,
  sexual_content: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    // Set the redux store with the group data
    setGroup: (state, action) => {
      console.debug("setGroup", action.payload);
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.nsfw = action.payload.nsfw;
    },

    // Register a new group in the database
    registerGroup: (state, action) => {
      console.debug("registerGroup", action.payload);
    },

    // Set Group Question Categories
    setGroupQuestionCategories: (state, action) => {
      console.debug("setGroupQuestionCategories", action.payload);
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
      }
    },
    setGroupAdultContent: (state, action) => {
      console.debug("setGroupAdultContent", action.payload);
      state.nsfw = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchGroupByIdAsync.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchGroupByIdAsync.fulfilled, (state, action) => {
      state.status = "succeeded";
      // Add fetched group to the state
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.nsfw = action.payload.nsfw;
      state.graphic_content = action.payload.graphic_content;
      state.offensive_content = action.payload.offensive_content;
      state.phobic_content = action.payload.phobic_content;
      state.sexual_content = action.payload.sexual_content;
    });
    builder.addCase(fetchGroupByIdAsync.rejected, (state, action) => {
      state.status = "failed";
      console.debug("fetchGroupByIdAsync.rejected", action.error);
      state.error = action.error.message || "Something went wrong";
    });
  },
});

// Fetch group
export const fetchGroupByIdAsync = createAsyncThunk(
  "group/fetchGroupByIdAsync",
  async (group_id: number): Promise<GroupType> => {
    try {
      console.debug("fetching group");
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", group_id);
      if (error) {
        console.warn("error fetching group", error);
        throw error;
      } else {
        console.debug("fetched group", data);
        return data[0];
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// Export reducer actions
export const { registerGroup, setGroup, setGroupQuestionCategories } =
  groupSlice.actions;

// Export constants for selectors
export const getGroupId = (state: RootState) => state.group.id;
export const getSelectedAdultCategories = (state: RootState) => {
  return {
    graphic_content: state.group.graphic_content || false,
    offensive_content: state.group.offensive_content || false,
    phobic_content: state.group.phobic_content || false,
    sexual_content: state.group.sexual_content || false,
  };
};
export const getShowAdultContent = (state: RootState) => state.group.nsfw;

export const getGroupStatus = (state: RootState) => state.group.status;
export const getGroupCategories = (state: RootState) => {
  let categories = [String(QuestionCategories.general)];
  if (state.group.graphic_content) {
    categories.push(String(QuestionCategories.graphic));
  }
  if (state.group.offensive_content) {
    categories.push(String(QuestionCategories.offensive));
  }
  if (state.group.phobic_content) {
    categories.push(String(QuestionCategories.phobic));
  }
  if (state.group.sexual_content) {
    categories.push(String(QuestionCategories.sexual));
  }
  return categories;
};

// Export the reducer
export default groupSlice.reducer;
