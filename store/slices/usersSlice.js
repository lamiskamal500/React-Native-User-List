import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.data = action.payload;
    },
    initializeUsers: (state, action) => {
      state.data = action.payload || [];
    },
  },
});

export const { setUsers, initializeUsers } = usersSlice.actions;

export default usersSlice.reducer;
