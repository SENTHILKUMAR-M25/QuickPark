import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as service from "../services/user.service.js";
import { uploadToCloudinary } from "../services/file.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await service.getProfile(req.auth.authId);
  return res.json(new ApiResponse(200, profile, "Profile fetched."));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await service.updateProfile(req.auth.authId, req.body);
  return res.json(new ApiResponse(200, profile, "Profile updated."));
});

export const updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(422).json(new ApiResponse(422, null, "No image uploaded."));
  }
  const url = await uploadToCloudinary(req.file.path);
  const profile = await service.updateProfileImage(req.auth.authId, url);
  return res.json(new ApiResponse(200, profile, "Profile image updated."));
});

export const addVehicle = asyncHandler(async (req, res) => {
  const vehicles = await service.addVehicle(req.auth.authId, req.body);
  return res.status(201).json(new ApiResponse(201, vehicles, "Vehicle added."));
});

export const listVehicles = asyncHandler(async (req, res) => {
  const vehicles = await service.listVehicles(req.auth.authId);
  return res.json(new ApiResponse(200, vehicles, "Vehicles fetched."));
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  await service.deleteVehicle(req.auth.authId, req.params.id);
  return res.json(new ApiResponse(200, null, "Vehicle removed."));
});

export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await service.getDashboard(req.auth.authId);
  return res.json(new ApiResponse(200, dashboard, "Dashboard fetched."));
});

function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  return { page, limit };
}

export const listParking = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = await service.listParking({
    page,
    limit,
    search: req.query.search,
    city: req.query.city,
    parkingType: req.query.parkingType,
    vehicleType: req.query.vehicleType,
    minPrice: req.query.minPrice !== undefined ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : undefined,
    sort: req.query.sort,
    latitude: req.query.latitude !== undefined ? Number(req.query.latitude) : undefined,
    longitude: req.query.longitude !== undefined ? Number(req.query.longitude) : undefined,
    radiusKm: req.query.radius !== undefined ? Number(req.query.radius) : undefined,
  });
  return res.json(new ApiResponse(200, data, "Parking spaces fetched."));
});

export const getParking = asyncHandler(async (req, res) => {
  const space = await service.getParking(req.auth.authId, req.params.id);
  return res.json(new ApiResponse(200, space, "Parking space fetched."));
});

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await service.createBooking(req.auth.authId, req.body);
  return res.status(201).json(new ApiResponse(201, booking, "Booking created."));
});

export const listFavorites = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = await service.listFavorites(req.auth.authId, { page, limit });
  return res.json(new ApiResponse(200, data, "Favorites fetched."));
});

export const addFavorite = asyncHandler(async (req, res) => {
  const data = await service.addFavorite(req.auth.authId, req.params.id);
  return res.json(new ApiResponse(200, data, "Added to favorites."));
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const data = await service.removeFavorite(req.auth.authId, req.params.id);
  return res.json(new ApiResponse(200, data, "Removed from favorites."));
});

export const getWallet = asyncHandler(async (req, res) => {
  const wallet = await service.getWallet(req.auth.authId);
  return res.json(new ApiResponse(200, wallet, "Wallet fetched."));
});

export const listBookings = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const data = await service.listBookings(req.auth.authId, {
    page,
    limit,
    status: req.query.status,
  });
  return res.json(new ApiResponse(200, data, "Bookings fetched."));
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await service.cancelBooking(req.auth.authId, req.params.id);
  return res.json(new ApiResponse(200, booking, "Booking cancelled."));
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await service.deleteAccount(req.auth.authId);
  return res.json(new ApiResponse(200, null, "Account deleted."));
});

export const userController = {
  getProfile,
  updateProfile,
  updateProfileImage,
  addVehicle,
  listVehicles,
  deleteVehicle,
  getDashboard,
  listParking,
  getParking,
  createBooking,
  listFavorites,
  addFavorite,
  removeFavorite,
  getWallet,
  listBookings,
  cancelBooking,
  deleteAccount,
};

export default userController;
