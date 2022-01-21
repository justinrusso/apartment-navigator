import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { Middleware } from "redux";

import propertiesReducer from "./properties";
import userReducer from "./user";

const isDev = process.env.NODE_ENV !== "production";

const rootReducer = combineReducers({
  user: userReducer,
  properties: propertiesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  devTools: isDev,
  middleware: (getDefaultMiddleware) => {
    if (isDev) {
      const logger = require("redux-logger").default;
      return getDefaultMiddleware().concat(
        logger as Middleware<any, RootState>
      );
    }
    return getDefaultMiddleware();
  },
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;

export default store;
