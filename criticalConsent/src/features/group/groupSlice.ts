import { createSlice } from "@reduxjs/toolkit";

export interface GroupState {
  id: number | null;
  name: string | null;
  nsfw: boolean | null;
}

const initialState: GroupState = {
  id: null,
  name: null,
  nsfw: null,
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
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.nsfw = action.payload.nsfw;
    },
  },
});

// Export reducer actions
export const { registerGroup, setGroup } = groupSlice.actions;

// Export the reducer
export default groupSlice.reducer;
