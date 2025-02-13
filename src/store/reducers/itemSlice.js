// src/store/itemSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { items: [] };

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
    addItem(state, action) {
      state.items.push(action.payload);
    },
    updateItem(state, action) {
      const index = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem(state, action) {
      state.items = state.items?.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setItems, addItem, updateItem, deleteItem } = itemSlice.actions;

export default itemSlice.reducer;
