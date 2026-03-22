import { createSlice } from "@reduxjs/toolkit";
import { mockBookings } from "../../utils/mockData";

const initialState = {
  bookings: mockBookings,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
    },

    cancelBooking: (state, action) => {
      const booking = state.bookings.find((b) => b.id === action.payload);
      if (booking) booking.status = "cancelled";
    },
  },
});

export const { addBooking, cancelBooking } = bookingSlice.actions;
export default bookingSlice.reducer;