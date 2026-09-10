import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as service from "../services/provider.service.js";
import { uploadToCloudinary, destroyCloudinary } from "../services/file.service.js";

function pagination(query, fallbackLimit = 10) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || fallbackLimit));
  return { page, limit };
}

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await service.getProfile(req.auth.authId);
  return res.json(new ApiResponse(200, profile, "Profile fetched."));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await service.updateProfile(req.auth.authId, req.body);
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

  const profileData = await service.updateDocuments(req.auth.authId, {
    governmentId: govt,
    businessLicense: license,
    profileImage: profile,
  });
  return res.json(new ApiResponse(200, profileData, "Documents updated."));
});

export const updateBank = asyncHandler(async (req, res) => {
  const profile = await service.updateBankDetails(req.auth.authId, req.body);
  return res.json(new ApiResponse(200, profile, "Bank details saved."));
});

export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await service.getDashboard(req.auth.authId);
  return res.json(new ApiResponse(200, dashboard, "Dashboard fetched."));
});

// ── Parking spaces ──────────────────────────────────────────
function toUrlArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* fall through */
    }
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

async function handleParkingUploads(files = {}) {
  const pick = (f) => (f && f[0] ? f[0] : null);
  const newImages = [];
  for (const f of files.files || []) {
    newImages.push(await uploadToCloudinary(f.path));
  }
  const prop = pick(files.propertyProof);
  const lic = pick(files.parkingLicense);
  return {
    images: newImages,
    propertyProof: prop ? await uploadToCloudinary(prop.path) : null,
    parkingLicense: lic ? await uploadToCloudinary(lic.path) : null,
  };
}

// Resolves the cover from the merged image list. The client sends `coverIndex`
// when the chosen cover is among newly uploaded files whose URL is unknown yet.
function resolveCover(body, mergedImages) {
  if (body.coverIndex !== undefined && body.coverIndex !== null && body.coverIndex !== "") {
    const idx = Number(body.coverIndex);
    if (Number.isInteger(idx) && mergedImages[idx]) return mergedImages[idx];
  }
  return body.coverImage || mergedImages[0] || null;
}

export const listParking = asyncHandler(async (req, res) => {
  const { page, limit } = pagination(req.query, 9);
  const data = await service.listParking(req.auth.authId, {
    page,
    limit,
    search: req.query.search,
    parkingType: req.query.parkingType || undefined,
    status: req.query.status || undefined,
    vehicleType: req.query.vehicleType || undefined,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    sort: req.query.sort || undefined,
  });
  return res.json(new ApiResponse(200, data, "Parking spaces fetched."));
});

export const getParking = asyncHandler(async (req, res) => {
  const space = await service.getParking(req.auth.authId, req.params.id);
  return res.json(new ApiResponse(200, space, "Parking space fetched."));
});

export const createParking = asyncHandler(async (req, res) => {
  const body = req.body;
  const uploaded = await handleParkingUploads(req.files);
  const images = [...toUrlArray(body.images), ...uploaded.images];
  const space = await service.createParking(req.auth.authId, {
    ...body,
    images,
    coverImage: resolveCover(body, images),
    propertyProof: uploaded.propertyProof || body.propertyProof || undefined,
    parkingLicense: uploaded.parkingLicense || body.parkingLicense || undefined,
  });
  return res.status(201).json(new ApiResponse(201, space, "Parking space created."));
});

export const updateParking = asyncHandler(async (req, res) => {
  const body = req.body;
  const uploaded = await handleParkingUploads(req.files);
  const existing = await service.getParking(req.auth.authId, req.params.id);
  const images = [...toUrlArray(body.images), ...uploaded.images];
  const propertyProof = uploaded.propertyProof || body.propertyProof || null;
  const parkingLicense = uploaded.parkingLicense || body.parkingLicense || null;

  const space = await service.updateParking(req.auth.authId, req.params.id, {
    ...body,
    images,
    coverImage: resolveCover(body, images),
    propertyProof,
    parkingLicense,
  });

  // Best-effort cleanup of Cloudinary assets no longer referenced.
  const removedImages = existing.images.filter((url) => !images.includes(url));
  removedImages.forEach((url) => destroyCloudinary(url));
  if (uploaded.propertyProof && existing.propertyProof && existing.propertyProof !== propertyProof) {
    destroyCloudinary(existing.propertyProof);
  }
  if (uploaded.parkingLicense && existing.parkingLicense && existing.parkingLicense !== parkingLicense) {
    destroyCloudinary(existing.parkingLicense);
  }

  return res.json(new ApiResponse(200, space, "Parking space updated."));
});

export const setParkingStatus = asyncHandler(async (req, res) => {
  const space = await service.setParkingStatus(req.auth.authId, req.params.id, req.body.status);
  return res.json(new ApiResponse(200, space, "Parking status updated."));
});

export const deleteParking = asyncHandler(async (req, res) => {
  await service.deleteParking(req.auth.authId, req.params.id);
  return res.json(new ApiResponse(200, null, "Parking space removed."));
});

export const getParkingAnalytics = asyncHandler(async (req, res) => {
  const data = await service.getParkingAnalytics(req.auth.authId, req.params.id);
  return res.json(new ApiResponse(200, data, "Parking analytics fetched."));
});

// ── Bookings ────────────────────────────────────────────────
export const listBookings = asyncHandler(async (req, res) => {
  const { page, limit } = pagination(req.query, 10);
  const data = await service.listBookings(req.auth.authId, { page, limit, status: req.query.status });
  return res.json(new ApiResponse(200, data, "Bookings fetched."));
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await service.updateBookingStatus(req.auth.authId, req.params.id, req.body.status);
  return res.json(new ApiResponse(200, booking, "Booking updated."));
});

// ── Wallet ──────────────────────────────────────────────────
export const getWallet = asyncHandler(async (req, res) => {
  const data = await service.getWallet(req.auth.authId);
  return res.json(new ApiResponse(200, data, "Wallet fetched."));
});

export const providerController = {
  getProfile,
  updateProfile,
  updateDocuments,
  updateBank,
  getDashboard,
  listParking,
  getParking,
  createParking,
  updateParking,
  setParkingStatus,
  deleteParking,
  getParkingAnalytics,
  listBookings,
  updateBookingStatus,
  getWallet,
};

export default providerController;
