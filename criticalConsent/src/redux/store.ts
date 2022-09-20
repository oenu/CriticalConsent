import {
  combineReducers,
  configureStore,
  PreloadedState,
} from "@reduxjs/toolkit";
import questionReducer from "../features/question/questionSlice";

// Combine reducers to create a root reducer
const rootReducer = combineReducers({
  questions: questionReducer,
});

// Use the root reducer to create a store
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

// Export a typed version of the store
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
