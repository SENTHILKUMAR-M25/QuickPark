import api from "./api";

export const adminService = {
  getOverview: () => api.get("/admin/overview", { timeout: 60000 }),
  listUsers: (params) => api.get("/admin/users", { params }),
  listProviders: (params) => api.get("/admin/providers", { params }),
  listParkingSpaces: (params) => api.get("/admin/parking-spaces", { params }),
  listBookings: (params) => api.get("/admin/bookings", { params }),
  updateAccountStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  updateProviderVerification: (id, verificationStatus) =>
    api.patch(`/admin/providers/${id}/verification`, { verificationStatus }),
};

export default adminService;
