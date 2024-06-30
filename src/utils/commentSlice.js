import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comment: "",
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    updateCommentRedux: (state, action) => {
      state.comment = action.payload;
    },
    deleteCommentRedux: (state) => {
      state.comment = null;
    },
  },
});

export const { updateCommentRedux, deleteCommentRedux } = commentSlice.actions;
export default commentSlice.reducer;
