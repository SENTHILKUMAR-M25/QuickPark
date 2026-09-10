import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as service from "../services/admin.service.js";

function pagination(query, fallbackLimit = 20) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || fallbackLimit));
  return { page, limit };
}

export const getOverview = asyncHandler(async (req, res) => {
  const data = await service.getOverview();
  return res.json(new ApiResponse(200, data, "Admin overview fetched."));
});

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit } = pagination(req.query, 20);
  const { search, status } = req.query;
  const data = await service.listUsers({ page, limit, search, status });
  return res.json(new ApiResponse(200, data, "Users fetched."));
});

export const listProviders = asyncHandler(async (req, res) => {
  const { page, limit } = pagination(req.query, 20);
  const { search, verification } = req.query;
  const data = await service.listProviders({ page, limit, search, verification });
  return res.json(new ApiResponse(200, data, "Providers fetched."));
});

export const listParkingSpaces = asyncHandler(async (req, res) => {
  const { page, limit } = pagination(req.query, 20);
  const { search } = req.query;
  const data = await service.listParkingSpaces({ page, limit, search });
  return res.json(new ApiResponse(200, data, "Parking spaces fetched."));
});

export const listBookings = asyncHandler(async (req, res) => {
  const { page, limit } = pagination(req.query, 20);
  const { status } = req.query;
  const data = await service.listBookings({ page, limit, status });
  return res.json(new ApiResponse(200, data, "Bookings fetched."));
});

export const updateAccountStatus = asyncHandler(async (req, res) => {
  const data = await service.setAccountStatus(req.params.id, req.body.status);
  return res.json(new ApiResponse(200, data, "Account status updated."));
});

export const updateProviderVerification = asyncHandler(async (req, res) => {
  const data = await service.setProviderVerification(req.params.id, req.body.verificationStatus);
  return res.json(new ApiResponse(200, data, "Provider verification updated."));
});

export const adminController = {
  getOverview,
  listUsers,
  listProviders,
  listParkingSpaces,
  listBookings,
  updateAccountStatus,
  updateProviderVerification,
};

export default adminController;
