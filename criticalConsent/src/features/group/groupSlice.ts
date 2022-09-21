import { GroupType } from "./../../types.d";
import { supabase } from "./../../utils/supabaseClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface GroupState {
  id: number | null;
  name: string | null;
  nsfw: boolean | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: GroupState = {
  id: null,
  name: null,
  nsfw: null,
  status: "idle",
  error: null,
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
  },
  extraReducers(builder) {
    builder.addCase(fetchGroupByIdAsync.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchGroupByIdAsync.fulfilled, (state, action) => {
      state.status = "succeeded";
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
  async (group_id: number): Promise<GroupType[]> => {
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
        return data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// Export reducer actions
export const { registerGroup, setGroup } = groupSlice.actions;

// Export the reducer
export default groupSlice.reducer;
