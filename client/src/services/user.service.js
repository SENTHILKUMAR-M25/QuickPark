import api from "./api";

export const userService = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (payload) => api.put("/user/profile", payload),
  uploadProfileImage: (formData) =>
    api.put("/user/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAccount: () => api.delete("/user/account"),

  getDashboard: () => api.get("/user/dashboard", { timeout: 60000 }),

  listVehicles: () => api.get("/user/vehicles", { timeout: 60000 }),
  addVehicle: (payload) => api.post("/user/vehicles", payload),
  deleteVehicle: (id) => api.delete(`/user/vehicles/${id}`),

  listBookings: (params) => api.get("/user/bookings", { params }),
  cancelBooking: (id) => api.patch(`/user/bookings/${id}/cancel`),

  listParking: (params) => api.get("/user/parking", { params, timeout: 60000 }),
  getParking: (id) => api.get(`/user/parking/${id}`, { timeout: 60000 }),
  createBooking: (payload) => api.post("/user/bookings", payload),

  listFavorites: (params) => api.get("/user/favorites", { params }),
  addFavorite: (id) => api.post(`/user/parking/${id}/favorite`),
  removeFavorite: (id) => api.delete(`/user/parking/${id}/favorite`),

  getWallet: () => api.get("/user/wallet", { timeout: 60000 }),
};

export default userService;
