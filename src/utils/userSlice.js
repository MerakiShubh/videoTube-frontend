import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    accessToken: null,
  },

  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.accessToken = action.payload.accessToken;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.accessToken = null;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
