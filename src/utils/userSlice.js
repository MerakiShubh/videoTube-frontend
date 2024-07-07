import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  userInfo: null,
  accessToken: Cookies.get("accessToken") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.accessToken = action.payload.accessToken;
      Cookies.set("accessToken", action.payload.accessToken);
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
