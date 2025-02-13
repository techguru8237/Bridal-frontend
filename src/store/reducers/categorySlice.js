// src/store/categorySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { categories: [] };

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
    addCategory(state, action) {
      state.categories.push(action.payload);
    },
    updateCategory(state, action) {
      const index = state.categories.findIndex(
        (category) => category._id === action.payload._id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory(state, action) {
      state.categories = state.categories?.filter(
        (category) => category._id !== action.payload
      );
    },
  },
});

export const { setCategories, addCategory, updateCategory, deleteCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
