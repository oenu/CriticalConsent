import { QuestionCategories, QuestionTypes } from "./../../types.d";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";

import { QuestionType, UploadType } from "../../types";
import { supabase } from "../../utils/supabaseClient";

// Define a type for the slice state
export interface QuestionState {
  questions: {
    [id: number]: QuestionType | null;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  highlightUnanswered: boolean;
  groupId: number;
  nsfw: boolean;
}

// Define the initial state using the QuestionState type
const initialState: QuestionState = {
  questions: [],
  status: "idle",
  error: null,
  highlightUnanswered: false,
  groupId: 1, // TODO: #1 change this to be based on link
  nsfw: false, // TODO: #2 Change this to be based on group
};

export interface QuestionResponse {
  id: number;
  selection: "low" | "mid" | "high";
}

export interface OptInResponse {
  id: number;
  opt_in: boolean;
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

        // Format the response to match the UploadType
        const formattedResponse = Object.values(state.questions).map(
          (question) => {
            if (question) {
              return {
                question_id: question.id,
                select_low: question.select_low,
                select_mid: question.select_mid,
                select_high: question.select_high,
                answered: question.answered,
                group_id: state.groupId,
              };
            }
          }
        );

        // Upload the response to the database
        supabase
          .from("responses")
          .insert(formattedResponse)
          .then((res) => {
            console.log("res", res);
          });
      } else {
        // Highlight the unanswered questions
        console.log("not all answered");
        state.highlightUnanswered = true;
      }
    },
    setOptIn(state, action: PayloadAction<OptInResponse>) {
      // Set the opt in value for the question
      console.log("setOptIn", action.payload);
      const question = state.questions[action.payload.id];
      if (question) {
        question.opt_in = action.payload.opt_in;
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
        // Check if the question is a select type, if so set the answered property to false.
        // This is because the other types of question are answered by default.
        if (question.type === QuestionTypes.select) {
          question.answered = false;
        }
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

// Export constants for selectors
export const selectAllQuestions = (state: RootState) =>
  state.questions.questions;
export const getQuestionsStatus = (state: RootState) => state.questions.status;
export const getQuestionsError = (state: RootState) => state.questions.error;
export const getHighlightUnanswered = (state: RootState) =>
  state.questions.highlightUnanswered;

// Export reducer actions
export const { selectResponse, uploadResponse, setOptIn } =
  questionSlice.actions;

// Export reducer
export default questionSlice.reducer;
