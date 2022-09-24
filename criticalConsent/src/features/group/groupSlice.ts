import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { GroupType } from "./../../types.d";
import { supabase } from "./../../utils/supabaseClient";
export interface GroupState {
  // Group Information
  id: string | null;
  name: string | null;
  mature_content: boolean | null;
  word_code: string | null;

  // Question Categories Accepted by the Group
  graphic_content: boolean | null;
  offensive_content: boolean | null;
  phobic_content: boolean | null;
  sexual_content: boolean | null;

  // Group Thunk State
  status: "idle" | "loading" | "succeeded" | "failed" | "not_found";
  error: string | null;

  // Group Validation
  group_id_valid: boolean | null;
}

const initialState: GroupState = {
  id: null,
  name: null,
  mature_content: null,
  word_code: null,

  graphic_content: null,
  offensive_content: null,
  phobic_content: null,
  sexual_content: null,

  status: "idle",
  error: null,
  group_id_valid: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    // Set the question categories accepted by the group
  },
  extraReducers(builder) {
    // Update the group status to Loading, meaning the group is being fetched and a loading element should be displayed
    builder.addCase(fetchGroupByIdAsync.pending, (state, action) => {
      state.status = "loading";
    });

    // Update the group status to Succeeded, meaning the group has been fetched and the group information should be set
    builder.addCase(fetchGroupByIdAsync.fulfilled, (state, action) => {
      // Check if the group exists
      if (action.payload === undefined) {
        state.group_id_valid = false;
        state.status = "not_found";
        console.warn("Unknown Group ID");
      } else {
        // Group Information
        state.status = "succeeded";
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.mature_content = action.payload.mature_content;
        state.group_id_valid = true;

        // Question Categories Accepted by the Group
        state.graphic_content = action.payload.graphic_content;
        state.offensive_content = action.payload.offensive_content;
        state.phobic_content = action.payload.phobic_content;
        state.sexual_content = action.payload.sexual_content;
      }
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
  async (group_id: string): Promise<GroupType> => {
    try {
      console.debug("Fetching group...");
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("uuid", group_id);
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

// Export const equal to the group_id
export const getGroupId = (state: RootState) => state.group.id;

// Export const equal to the group_name
export const getGroupName = (state: RootState) => state.group.name;

// Export whether the group is unknown
export const getGroupIdValid = (state: RootState) => state.group.group_id_valid;

// Export whether the group accepts mature content at all
export const getShowMatureContent = (state: RootState) =>
  state.group.mature_content;

// Export array of question categories accepted by the group
export const getGroupCategories = (
  state: RootState
): {
  general: boolean;
  graphic: boolean;
  offensive: boolean;
  phobic: boolean;
  sexual: boolean;
} => {
  return {
    general: true,
    graphic: state.group.graphic_content || false,
    offensive: state.group.offensive_content || false,
    phobic: state.group.phobic_content || false,
    sexual: state.group.sexual_content || false,
  };
};

// Thunk status selector
export const getGroupStatus = (state: RootState) => state.group.status;

// Export the reducer
export default groupSlice.reducer;
