import api from "./api";

export const authService = {
  registerUser: (payload) => api.post("/auth/register/user", payload),
  registerProvider: (payload) => api.post("/auth/register/provider", payload),
  login: (payload) => api.post("/auth/login", payload),
  logout: () => api.post("/auth/logout"),
  refresh: () => api.post("/auth/refresh"),
  me: () => api.get("/auth/me"),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
  verifyEmail: (payload) => api.post("/auth/verify-email", payload),
  sendOtp: (payload) => api.post("/auth/send-otp", payload),
  verifyOtp: (payload) => api.post("/auth/verify-otp", payload),
};

export const userService = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (payload) => api.put("/user/profile", payload),
  uploadImage: (formData) =>
    api.put("/user/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAccount: () => api.delete("/user/account"),
};

export const providerService = {
  getProfile: () => api.get("/provider/profile"),
  updateProfile: (payload) => api.put("/provider/profile", payload),
  uploadDocuments: (formData) =>
    api.put("/provider/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  bankDetails: (payload) => api.put("/provider/bank", payload),
  getDashboard: () => api.get("/provider/dashboard"),
};