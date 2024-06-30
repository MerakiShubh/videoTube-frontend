import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoOwnerInfo: null,
  videoInfo: null,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideoOwnerInfo: (state, action) => {
      state.videoOwnerInfo = action.payload;
    },
    clearVideoOwnerInfo: (state) => {
      state.videoOwnerInfo = null;
    },
    setVideoInfo: (state, action) => {
      state.videoInfo = action.payload;
    },
    clearVideoInfo: (state) => {
      state.videoInfo = null;
    },
  },
});

export const {
  setVideoOwnerInfo,
  clearVideoOwnerInfo,
  setVideoInfo,
  clearVideoInfo,
} = videoSlice.actions;
export default videoSlice.reducer;
