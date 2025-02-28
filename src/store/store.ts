import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import classReducer from "./slices/classSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    class: classReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
