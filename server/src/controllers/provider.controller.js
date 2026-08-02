import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as service from "../services/provider.service.js";
import { uploadToCloudinary } from "../services/file.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await service.getProfile(req.auth.id);
  return res.json(new ApiResponse(200, profile, "Profile fetched."));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await service.updateProfile(req.auth.id, req.body);
  return res.json(new ApiResponse(200, profile, "Profile updated."));
});

export const updateDocuments = asyncHandler(async (req, res) => {
  const files = req.files || {};
  const pick = (f) => (f && f[0] ? f[0] : null);

  const [profile, govt, license] = await Promise.all([
    pick(files.profilePhoto) ? uploadToCloudinary(pick(files.profilePhoto).path) : Promise.resolve(null),
    pick(files.governmentId) ? uploadToCloudinary(pick(files.governmentId).path) : Promise.resolve(null),
    pick(files.businessLicense) ? uploadToCloudinary(pick(files.businessLicense).path) : Promise.resolve(null),
  ]);

  const profileData = await service.updateDocuments(req.auth.id, {
    governmentId: govt,
    businessLicense: license,
    profilePhoto: profile,
  });
  return res.json(new ApiResponse(200, profileData, "Documents updated."));
});

export const updateBank = asyncHandler(async (req, res) => {
  const profile = await service.updateBankDetails(req.auth.id, req.body);
  return res.json(new ApiResponse(200, profile, "Bank details saved."));
});

export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await service.getDashboard(req.auth.id);
  return res.json(new ApiResponse(200, dashboard, "Dashboard fetched."));
});

export const providerController = {
  getProfile,
  updateProfile,
  updateDocuments,
  updateBank,
  getDashboard,
};

export default providerController;