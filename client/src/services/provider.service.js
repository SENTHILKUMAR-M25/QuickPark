import api from "./api";

const jsonHeader = { "Content-Type": "application/json" };

export const providerService = {
  getProfile: () => api.get("/provider/profile"),
  updateProfile: (payload) => api.put("/provider/profile", payload),
  uploadDocuments: (formData) =>
    api.put("/provider/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  bankDetails: (payload) => api.put("/provider/bank", payload),
  getDashboard: () => api.get("/provider/dashboard", { timeout: 60000 }),

  listParking: (params) => api.get("/provider/parking", { params }),
  getParking: (id) => api.get(`/provider/parking/${id}`),
  createParking: (formData) =>
    api.post("/provider/parking", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  updateParking: (id, formData) =>
    api.put(`/provider/parking/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  setParkingStatus: (id, status) =>
    api.patch(`/provider/parking/${id}/status`, { status }, { headers: jsonHeader }),
  deleteParking: (id) => api.delete(`/provider/parking/${id}`),
  getParkingAnalytics: (id) => api.get(`/provider/parking/${id}/analytics`),

  listBookings: (params) => api.get("/provider/bookings", { params }),
  updateBookingStatus: (id, status) => api.patch(`/provider/bookings/${id}/status`, { status }),

  getWallet: () => api.get("/provider/wallet", { timeout: 60000 }),
};

export default providerService;
