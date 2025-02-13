// src/store/paymentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { payments: [] };

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPayments(state, action) {
      state.payments = action.payload;
    },
    addPayment(state, action) {
      state.payments.push(action.payload);
    },
    updatePayment(state, action) {
      const index = state.payments.findIndex(
        (payment) => payment._id === action.payload._id
      );
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
    deletePayment(state, action) {
      state.payments = state.payments?.filter(
        (payment) => payment._id !== action.payload
      );
    },
  },
});

export const { setPayments, addPayment, updatePayment, deletePayment } =
  paymentSlice.actions;

export default paymentSlice.reducer;
