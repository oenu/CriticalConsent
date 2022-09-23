import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { GroupType, QuestionCategories } from "./../../types.d";
import { supabase } from "./../../utils/supabaseClient";
export interface GroupState {
  // Group Information
  id: number | null;
  name: string | null;
  nsfw: boolean | null;

  // Question Categories Accepted by the Group
  graphic_content: boolean | null;
  offensive_content: boolean | null;
  phobic_content: boolean | null;
  sexual_content: boolean | null;

  // Group Thunk State
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: GroupState = {
  id: null,
  name: null,
  nsfw: null,

  graphic_content: null,
  offensive_content: null,
  phobic_content: null,
  sexual_content: null,

  status: "idle",
  error: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    // Set the question categories accepted by the group
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
        case "clear":
          state.graphic_content = null;
          state.offensive_content = null;
          state.phobic_content = null;
          state.sexual_content = null;
          break;
      }
    },
  },
  extraReducers(builder) {
    // Update the group status to Loading, meaning the group is being fetched and a loading element should be displayed
    builder.addCase(fetchGroupByIdAsync.pending, (state, action) => {
      state.status = "loading";
    });

    // Update the group status to Succeeded, meaning the group has been fetched and the group information should be set
    builder.addCase(fetchGroupByIdAsync.fulfilled, (state, action) => {
      state.status = "succeeded";
      // Group Information
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.nsfw = action.payload.nsfw;

      // Question Categories Accepted by the Group
      state.graphic_content = action.payload.graphic_content;
      state.offensive_content = action.payload.offensive_content;
      state.phobic_content = action.payload.phobic_content;
      state.sexual_content = action.payload.sexual_content;
    });

    // Update the group status to Failed, meaning the group has failed to be fetched and an error message should be displayed
    builder.addCase(fetchGroupByIdAsync.rejected, (state, action) => {
      state.status = "failed";
      console.debug("fetchGroupByIdAsync.rejected", action.error);
      state.error = action.error.message || "Something went wrong";
    });
  },
});

// Fetch group async thunk
export const fetchGroupByIdAsync = createAsyncThunk(
  "group/fetchGroupByIdAsync",
  async (group_id: number): Promise<GroupType> => {
    try {
      console.debug("Fetching group...");
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", group_id);
      if (error) {
        console.warn("error fetching group!", error);
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
export const { setGroupQuestionCategories } = groupSlice.actions;

// Export const equal to the group_id
export const getGroupId = (state: RootState) => state.group.id;

// Export whether the group accepts adult content at all
export const getShowAdultContent = (state: RootState) => state.group.nsfw;

// Export array of question categories accepted by the group
export const getGroupCategories = (
  state: RootState
): {
  general_content: boolean;
  graphic_content: boolean;
  offensive_content: boolean;
  phobic_content: boolean;
  sexual_content: boolean;
} => {
  return {
    general_content: true,
    graphic_content: state.group.graphic_content || false,
    offensive_content: state.group.offensive_content || false,
    phobic_content: state.group.phobic_content || false,
    sexual_content: state.group.sexual_content || false,
  };
};

// Thunk status selector
export const getGroupStatus = (state: RootState) => state.group.status;

// Export the reducer
export default groupSlice.reducer;
