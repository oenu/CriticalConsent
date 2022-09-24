import {
  combineReducers,
  configureStore,
  PreloadedState,
} from "@reduxjs/toolkit";

// Redux reducers
import surveyReducer from "../features/survey/surveySlice";
import groupReducer from "../features/group/groupSlice";
import appReducer from "../features/app/appSlice";
import registerReducer from "../features/register/registerSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

// Combine reducers to create a root reducer
const rootReducer = combineReducers({
  survey: surveyReducer,
  group: groupReducer,
  app: appReducer,
  register: registerReducer,
  dashboard: dashboardReducer,
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
