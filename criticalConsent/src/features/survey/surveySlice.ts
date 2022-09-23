import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { QuestionTypes } from "../../types.d";

import { QuestionType } from "../../types.d";
import { supabase } from "../../utils/supabaseClient";

// Define a type for the survey state
export interface SurveyState {
  questions: {
    [id: number]: QuestionType | null;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  highlightUnanswered: boolean;
  group_id: number | null;
}

// Define the initial state using the SurveyState type
const initialState: SurveyState = {
  questions: [],
  status: "idle",
  error: null,
  highlightUnanswered: false,
  group_id: null,
};

// Useful types for Question Response types in the survey
export interface QuestionResponse {
  id: number;
  selection: "low" | "mid" | "high";
}
export interface OptInResponse {
  id: number;
  opt_in: boolean;
}

// Import initial state and create a thunk to fetch data from the API
const surveySlice = createSlice({
  name: "survey",
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
                group_id: state.group_id,
                opt_in: question.opt_in,
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
    setQuestionGroupId(state, action: PayloadAction<number>) {
      // HACK: This is a hack to get the group id into the store as I am not sure how to access the group store here
      // Set the group id in question state
      state.group_id = action.payload;
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
        } else {
          question.answered = true;
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
export const selectAllQuestions = (state: RootState) => state.survey.questions;
export const getQuestionsStatus = (state: RootState) => state.survey.status;
export const getQuestionsError = (state: RootState) => state.survey.error;
export const getHighlightUnanswered = (state: RootState) =>
  state.survey.highlightUnanswered;

// Export reducer actions
export const { selectResponse, uploadResponse, setOptIn, setQuestionGroupId } =
  surveySlice.actions;

// Export reducer
export default surveySlice.reducer;