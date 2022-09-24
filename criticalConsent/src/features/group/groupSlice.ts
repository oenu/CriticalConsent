import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { GroupType } from "./../../types.d";
import { supabase } from "./../../utils/supabaseClient";
export interface GroupState {
  // Group Information
  id: string | null;
  name: string | null;
  mature_content: boolean | null;
  share_code: string | null;

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
  share_code: null,

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
    clearGroup: (state) => {
      state.id = null;
      state.name = null;
      state.mature_content = null;
      state.share_code = null;

      state.graphic_content = null;
      state.offensive_content = null;
      state.phobic_content = null;
      state.sexual_content = null;

      state.status = "idle";
      state.error = null;
      state.group_id_valid = null;
    },
  },
  extraReducers(builder) {
    // Update the group status to Loading, meaning the group is being fetched and a loading element should be displayed
    builder.addCase(fetchGroupAsync.pending, (state, action) => {
      state.status = "loading";
    });

    // Update the group status to Succeeded, meaning the group has been fetched and the group information should be set
    builder.addCase(fetchGroupAsync.fulfilled, (state, action) => {
      // Check if the group exists
      if (action.payload === undefined) {
        state.group_id_valid = false;
        state.status = "not_found";
        console.warn("Unknown Group ID");
      } else {
        // Group Information
        state.status = "succeeded";
        state.id = action.payload.uuid;
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
    builder.addCase(fetchGroupAsync.rejected, (state, action) => {
      state.status = "failed";
      console.debug("fetchGroupAsync.rejected", action.error);
      state.error = action.error.message || "Something went wrong";
    });
  },
});

// Fetch group async thunk
export const fetchGroupAsync = createAsyncThunk(
  "group/fetchGroupAsync",
  async (group: {
    group_id?: string;
    share_code?: string;
  }): Promise<GroupType> => {
    const { group_id, share_code } = group;

    if (group_id) {
      // Get the group from the database using the group_id
      try {
        console.debug("Fetching group with uuid...");
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
    } else if (share_code) {
      // Get the group from the database using the share_code
      try {
        console.debug("Fetching group with share code...");
        const { data, error } = await supabase
          .from("groups")
          .select("*")
          .eq("share_code", share_code);
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
    } else {
      console.warn("No group_id or share_code provided");
      throw new Error("No group_id or share_code provided");
    }
  }
);

// Export const equal to the group_id
export const selectGroupId = (state: RootState) => state.group.id;

// Export const equal to the group_name
export const selectGroupName = (state: RootState) => state.group.name;

// Export whether the group is unknown
export const selectGroupIdValid = (state: RootState) =>
  state.group.group_id_valid;

// Export whether the group accepts mature content at all
export const selectShowMatureContent = (state: RootState) =>
  state.group.mature_content;

// Export array of question categories accepted by the group
export const selectGroupCategories = (
  state: RootState
): { [key: string]: boolean } => {
  return {
    general: true,
    graphic: state.group.graphic_content || false,
    offensive: state.group.offensive_content || false,
    phobic: state.group.phobic_content || false,
    sexual: state.group.sexual_content || false,
  };
};

// Thunk status selector
export const selectGroupStatus = (state: RootState) => state.group.status;

// Export reducer actions
export const { clearGroup } = groupSlice.actions;

// Export the reducer
export default groupSlice.reducer;
