import { configureStore } from "@reduxjs/toolkit";
import { initialColorReducer } from "./slice/initialColorSlice";
import { toolbarReducer } from "./slice/toolbarSlice";

export const store = configureStore({
  reducer: {
    initialColor: initialColorReducer,
    toolbar: toolbarReducer,
  },
});

// Define and export RootState type
export type RootState = ReturnType<typeof store.getState>;
