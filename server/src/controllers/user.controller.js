import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as service from "../services/user.service.js";
import { uploadToCloudinary } from "../services/file.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await service.getProfile(req.auth.id);
  return res.json(new ApiResponse(200, profile, "Profile fetched."));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await service.updateProfile(req.auth.id, req.body);
  return res.json(new ApiResponse(200, profile, "Profile updated."));
});

export const updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(422).json(new ApiResponse(422, null, "No image uploaded."));
  }
  const url = await uploadToCloudinary(req.file.path);
  const profile = await service.updateProfileImage(req.auth.id, url);
  return res.json(new ApiResponse(200, profile, "Profile image updated."));
});

export const addVehicle = asyncHandler(async (req, res) => {
  const vehicles = await service.addVehicle(req.auth.id, req.body);
  return res.status(201).json(new ApiResponse(201, vehicles, "Vehicle added."));
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await service.deleteAccount(req.auth.id);
  return res.json(new ApiResponse(200, null, "Account deleted."));
});

export const userController = {
  getProfile,
  updateProfile,
  updateProfileImage,
  addVehicle,
  deleteAccount,
};

export default userController;