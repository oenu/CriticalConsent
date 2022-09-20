import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";

import { QuestionType } from "../../types";
import { supabase } from "../../utils/supabaseClient";

// Define a type for the slice state
export interface QuestionState {
  questions: {
    [id: number]: QuestionType | null;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  highlightUnanswered: boolean;
}

// Define the initial state using the QuestionState type
const initialState: QuestionState = {
  questions: [],
  status: "idle",
  error: null,
  highlightUnanswered: false,
};

export interface QuestionResponse {
  id: number;
  selection: "low" | "mid" | "high";
}

// Import initial state and create a thunk to fetch data from the API
const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    selectResponse: (state, action: PayloadAction<QuestionResponse>) => {
      // Update the store with the selected response and remove other responses
      console.log("selectResponse", action.payload);
      // Update the question in the store with the selected response
      const question = state.questions[action.payload.id];
      if (question) {
        question.select_low = action.payload.selection === "low";
        question.select_mid = action.payload.selection === "mid";
        question.select_high = action.payload.selection === "high";
        question.answered = true;
      }
    },
    uploadResponse: (state) => {
      // Check if all questions have been answered
      const allAnswered = Object.values(state.questions).every(
        (question) => question?.answered
      );
      if (allAnswered) {
        // Upload the responses to the database
        console.log("all answered");
        state.highlightUnanswered = false;
      } else {
        // Highlight the unanswered questions
        console.log("not all answered");
        state.highlightUnanswered = true;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchQuestionsAsync.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchQuestionsAsync.fulfilled, (state, action) => {
      // Add any fetched questions to the mapped questions object
      action.payload.forEach((question) => {
        state.questions[question.id] = question;
      });
      // Set the status to succeeded
      state.status = "succeeded";
    });
    builder.addCase(fetchQuestionsAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Something went wrong";
    });
  },
});

// Fetch questions
export const fetchQuestionsAsync = createAsyncThunk(
  "questions/fetchQuestions",
  async (): Promise<QuestionType[]> => {
    try {
      console.debug("fetching questions");
      const { data, error } = await supabase.from("questions");
      if (error) {
        console.warn("error fetching questions", error);
        throw error;
      } else {
        console.debug("fetched questions", data);
        return data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// Export constants for use in components
export const selectAllQuestions = (state: RootState) =>
  state.questions.questions;
export const getQuestionsStatus = (state: RootState) => state.questions.status;
export const getQuestionsError = (state: RootState) => state.questions.error;
export const getHighlightUnanswered = (state: RootState) =>
  state.questions.highlightUnanswered;

// Export reducer actions
export const { selectResponse, uploadResponse } = questionSlice.actions;

// Export reducer
export default questionSlice.reducer;
