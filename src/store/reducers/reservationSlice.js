// src/store/reservationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { reservations: [] };

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setReservations(state, action) {
      state.reservations = action.payload;
    },
    addReservation(state, action) {
      state.reservations.push(action.payload);
    },
    updateReservation(state, action) {
      const index = state.reservations.findIndex(
        (reservation) => reservation._id === action.payload._id
      );
      if (index !== -1) {
        state.reservations[index] = action.payload;
      }
    },
    deleteReservation(state, action) {
      state.reservations = state.reservations?.filter(
        (reservation) => reservation._id !== action.payload
      );
    },
  },
});

export const {
  setReservations,
  addReservation,
  updateReservation,
  deleteReservation,
} = reservationSlice.actions;

export default reservationSlice.reducer;
