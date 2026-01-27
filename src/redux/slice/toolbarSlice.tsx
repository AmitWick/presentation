import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const initialState = {
  hideToolbar: false,
};

const toolbarSlice = createSlice({
  name: "toolbarSlice",
  initialState,
  reducers: {
    setHideToolbar: (state) => {
      state.hideToolbar = !state.hideToolbar;
      return state;
    },
  },
});

export const { setHideToolbar } = toolbarSlice.actions;

export const toolbarReducer = toolbarSlice.reducer;

export const toolbarState = (state: RootState) => state.toolbar;
