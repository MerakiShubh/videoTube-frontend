import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoOwnerInfo: null,
};
console.log("here is videoownerinfo", initialState.videoOwnerInfo);

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
  },
});

export const { setVideoOwnerInfo, clearVideoOwnerInfo } = videoSlice.actions;
export default videoSlice.reducer;
