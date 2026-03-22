import { createSlice } from "@reduxjs/toolkit";
import { mockParkings } from "../../utils/mockData";

const initialState = {
  parkings: mockParkings,
  selectedParking: null,
  searchQuery: "",
  searchCity: "",
};

const parkingSlice = createSlice({
  name: "parking",
  initialState,
  reducers: {
    setSelectedParking: (state, action) => {
      state.selectedParking = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setSearchCity: (state, action) => {
      state.searchCity = action.payload;
    },

    addParking: (state, action) => {
      state.parkings.push(action.payload);
    },

    removeParking: (state, action) => {
      state.parkings = state.parkings.filter((p) => p.id !== action.payload);
    },

    updateSlotStatus: (state, action) => {
      const { parkingId, slotId, status } = action.payload;
      const parking = state.parkings.find((p) => p.id === parkingId);
      if (parking) {
        const slot = parking.slots.find((s) => s.id === slotId);
        if (slot) slot.status = status;
      }
    },
  },
});

export const {
  setSelectedParking,
  setSearchQuery,
  setSearchCity,
  addParking,
  removeParking,
  updateSlotStatus,
} = parkingSlice.actions;

export default parkingSlice.reducer;