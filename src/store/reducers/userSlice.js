import { createSlice } from "@reduxjs/toolkit";

const initialState = { users: [] };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    addUser(state, action) {
      state.users.push(action.payload);
    },
    updateUser(state, action) {
      const index = state.users.findIndex(
        (user) => user._id === action.payload._id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser(state, action) {
      state.users = state.users?.filter((user) => user._id !== action.payload);
    },
  },
});

export const { setUsers, addUser, updateUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
