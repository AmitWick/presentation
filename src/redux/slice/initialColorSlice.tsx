import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const defaultStrokeColor = {
  penColorOnImage: "#000000",
  laserColorOnImage: "#ff0000",
  penColorOnWhiteboard: "#000000",
  laserColorOnWhiteboard: "#ff0000",
  penColorOnBlackboard: "#ffffff",
  laserColorOnBlackboard: "#ff0000",
};

const defaultStrokeSize = {
  penStrokeSize: 4,
  laserStrokeSize: 10,
};

const initialValue = {
  strokeColor:
    JSON.parse(localStorage.getItem("initialColor") || "null") ||
    defaultStrokeColor,
  penColorSet: JSON.parse(localStorage.getItem("penColorSet") || "null") || [],
  strokeSize:
    JSON.parse(localStorage.getItem("strokeSize") || "null") ||
    defaultStrokeSize,
};

const initalColorSlice = createSlice({
  name: "initialColor",
  initialState: initialValue,

  reducers: {
    setInitialColor: (state, action) => {
      const updatedState = { ...state.strokeColor, ...action.payload };

      state.strokeColor = updatedState;
      localStorage.setItem("initialColor", JSON.stringify(updatedState));

      return state;
    },
    setPenColorSet: (state, action) => {
      const updatedSet = action.payload;

      localStorage.setItem("penColorSet", JSON.stringify(updatedSet));

      state.penColorSet = updatedSet;
      return state;
    },
    setStrokeSize: (state, action) => {
      const updatedSize = { ...state.strokeSize, ...action.payload };

      localStorage.setItem("strokeSize", JSON.stringify(updatedSize));

      state.strokeSize = updatedSize;

      return state;
    },
  },
});

export const { setInitialColor, setPenColorSet, setStrokeSize } =
  initalColorSlice.actions;
export const initialColorReducer = initalColorSlice.reducer;

export const initialColorState = (state: RootState) => state.initialColor;
