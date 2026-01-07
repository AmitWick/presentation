import { configureStore } from "@reduxjs/toolkit";
import { initialColorReducer } from "./slice/initialColorSlice";

export const store = configureStore({
  reducer: {
    initialColor: initialColorReducer,
  },
});

// Define and export RootState type
export type RootState = ReturnType<typeof store.getState>;