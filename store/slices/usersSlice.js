import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
  },
  reducers: {
    setUsers(state, action) {
      state.data = action.payload;
    },
    initializeUsers(state, action) {
      state.data = action.payload;
    },
    addUsers(state, action) {
      state.data = [...state.data, ...action.payload]; // Append new users
    },
  },
});

export const { setUsers, initializeUsers, addUsers } = usersSlice.actions;
export default usersSlice.reducer;
