import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import parkingReducer from "./slices/parkingSlice";
import bookingReducer from "./slices/bookingSlice";

 const store = configureStore({
  reducer: {
    auth: authReducer,
    parking: parkingReducer,
    booking: bookingReducer,
  },
});

export default store;