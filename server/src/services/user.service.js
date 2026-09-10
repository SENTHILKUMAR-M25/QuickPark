import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/ApiError.js";
import { ACCOUNT_STATUS } from "../config/constants.js";
import { getCurrentUser } from "../lib/auth.js";
import { serializeAccount } from "../lib/presenter.js";

async function loadProfile(authId) {
  const account = await getCurrentUser(authId, "USER");
  if (!account || account.accountStatus === ACCOUNT_STATUS.DELETED) {
    throw new ApiError(404, "User not found.");
  }
  return serializeAccount(account);
}

const PROFILE_FIELDS = [
  "gender",
  "dateOfBirth",
  "address",
  "emergencyContact",
  "preferredLanguage",
  "notificationSettings",
];

export async function getProfile(authId) {
  return loadProfile(authId);
}

export async function updateProfile(authId, data) {
  const clean = {};
  if (data.fullName !== undefined) {
    await prisma.auth.update({ where: { id: authId }, data: { fullName: data.fullName } });
  }
  for (const key of PROFILE_FIELDS) {
    if (data[key] !== undefined) clean[key] = data[key];
  }
  if (Object.keys(clean).length) {
    await prisma.user.update({
      where: { authId },
      data: {
        ...clean,
        dateOfBirth: clean.dateOfBirth ? new Date(clean.dateOfBirth) : undefined,
      },
    });
  }
  return loadProfile(authId);
}

export async function updateProfileImage(authId, secureUrl) {
  await prisma.auth.update({ where: { id: authId }, data: { profileImage: secureUrl } });
  return loadProfile(authId);
}

export async function addVehicle(authId, { regNumber, make, model, color, type }) {
  await prisma.vehicle.create({ data: { authId, regNumber, make, model, color, type } });
  return listVehicles(authId);
}

export async function listVehicles(authId) {
  return prisma.vehicle.findMany({
    where: { authId, deletedAt: null },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function deleteVehicle(authId, id) {
  const vehicle = await prisma.vehicle.findFirst({ where: { id, authId, deletedAt: null } });
  if (!vehicle) throw new ApiError(404, "Vehicle not found.");
  return prisma.vehicle.update({ where: { id }, data: { deletedAt: new Date() } });
}

// ── Dashboard ───────────────────────────────────────────────
const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export async function getDashboard(authId) {
  // Sequential queries: Neon pooler runs with connection_limit=1.
  const totalBookings = await prisma.booking.count({ where: { userId: authId, deletedAt: null } });
  const upcomingBookings = await prisma.booking.count({
    where: { userId: authId, startAt: { gte: new Date() }, status: { in: ["PENDING", "CONFIRMED"] }, deletedAt: null },
  });
  const completedBookings = await prisma.booking.count({
    where: { userId: authId, status: "COMPLETED", deletedAt: null },
  });
  const favoritesCount = await prisma.favorite.count({ where: { authId, deletedAt: null } });
  const vehiclesCount = await prisma.vehicle.count({ where: { authId, deletedAt: null } });
  const wallet = await prisma.wallet.findFirst({ where: { ownerId: authId } });
  const breakdownRows = await prisma.booking.groupBy({
    by: ["status"],
    where: { userId: authId, deletedAt: null },
    _count: { _all: true },
  });
  const recentBookings = await prisma.booking.findMany({
    where: { userId: authId, deletedAt: null },
    take: 5,
    orderBy: { startAt: "desc" },
    include: {
      space: { select: { parkingName: true, city: true } },
      provider: { select: { fullName: true } },
    },
  });

  const breakdown = {};
  for (const s of BOOKING_STATUSES) breakdown[s] = 0;
  for (const row of breakdownRows) breakdown[row.status] = row._count._all;

  return {
    totalBookings,
    upcomingBookings,
    completedBookings,
    cancelledBookings: breakdown.CANCELLED,
    favoritesCount,
    vehiclesCount,
    walletBalance: wallet?.balance || 0,
    breakdown,
    recentBookings: recentBookings.map((r) => ({
      id: r.id,
      status: r.status,
      totalAmount: r.totalAmount,
      startAt: r.startAt,
      createdAt: r.createdAt,
      space: r.space,
      provider: r.provider,
    })),
  };
}

// ── Parking search ──────────────────────────────────────────
function serializePublicSpace(space, extra = {}) {
  return {
    id: space.id,
    parkingName: space.parkingName,
    parkingType: space.parkingType,
    description: space.description,
    address: space.address,
    area: space.area,
    landmark: space.landmark,
    city: space.city,
    state: space.state,
    country: space.country,
    pincode: space.pincode,
    latitude: space.latitude,
    longitude: space.longitude,
    totalCapacity: space.totalCapacity,
    availableSlots: space.availableSlots,
    slotNumbering: space.slotNumbering,
    vehicleTypes: space.vehicleTypes,
    surfaceType: space.surfaceType,
    pricePerHour: Number(space.pricePerHour),
    pricePerDay: space.pricePerDay != null ? Number(space.pricePerDay) : null,
    pricePerMonth: space.pricePerMonth != null ? Number(space.pricePerMonth) : null,
    weekendPricing: space.weekendPricing,
    festivalPricing: space.festivalPricing,
    openTime: space.openTime,
    closeTime: space.closeTime,
    open24Hours: space.open24Hours,
    availableDays: space.availableDays,
    amenities: space.amenities,
    rules: space.rules,
    coverImage: space.coverImage,
    images: space.images,
    averageRating: space.averageRating != null ? Number(space.averageRating) : null,
    totalBookings: space.totalBookings,
    createdAt: space.createdAt,
    updatedAt: space.updatedAt,
    ...extra,
  };
}

function distanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const PUBLIC_PARKING_ORDER = {
  latest: { createdAt: "desc" },
  rating: { averageRating: "desc" },
  mostBooked: { totalBookings: "desc" },
  priceLow: { pricePerHour: "asc" },
  priceHigh: { pricePerHour: "desc" },
};

export async function listParking({ page, limit, search, city, parkingType, vehicleType, minPrice, maxPrice, sort, latitude, longitude, radiusKm }) {
  const where = { deletedAt: null, status: "ACTIVE" };
  if (search) {
    where.OR = [
      { parkingName: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { area: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (parkingType) where.parkingType = parkingType;
  if (vehicleType) where.vehicleTypes = { has: vehicleType };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.pricePerHour = {};
    if (minPrice !== undefined) where.pricePerHour.gte = minPrice;
    if (maxPrice !== undefined) where.pricePerHour.lte = maxPrice;
  }
  if (latitude != null && longitude != null && radiusKm) {
    const latDelta = radiusKm / 111.0;
    const lngDelta = radiusKm / (111.0 * Math.max(0.2, Math.cos((latitude * Math.PI) / 180)));
    where.latitude = { gte: latitude - latDelta, lte: latitude + latDelta };
    where.longitude = { gte: longitude - lngDelta, lte: longitude + lngDelta };
  }

  const total = await prisma.parkingSpace.count({ where });
  const spaces = await prisma.parkingSpace.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: PUBLIC_PARKING_ORDER[sort] || PUBLIC_PARKING_ORDER.mostBooked,
  });

  let items = spaces.map((s) =>
    serializePublicSpace(s, {
      distanceKm: distanceKm(latitude, longitude, s.latitude, s.longitude),
    })
  );
  if (sort === "nearby") {
    items = items.sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9));
  }

  return { page, limit, total, items };
}

export async function getParking(authId, id) {
  const space = await prisma.parkingSpace.findFirst({
    where: { id, deletedAt: null, status: "ACTIVE" },
    include: {
      auth: {
        select: {
          fullName: true,
          profileImage: true,
          provider: { select: { businessName: true, verificationStatus: true } },
        },
      },
      favorites: { where: { authId, deletedAt: null }, take: 1 },
      _count: { select: { favorites: true } },
      reviews: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { user: { select: { fullName: true, profileImage: true } } },
      },
    },
  });
  if (!space) throw new ApiError(404, "Parking space not found.");

  const liveBookings = await prisma.booking.count({
    where: { spaceId: id, status: { in: ["PENDING", "CONFIRMED"] }, deletedAt: null },
  });
  const reviewsAgg = await prisma.review.aggregate({
    where: { spaceId: id, deletedAt: null },
    _avg: { rating: true },
    _count: true,
  });

  return serializePublicSpace(space, {
    provider: space.auth,
    isFavorite: space.favorites.length > 0,
    favoritesCount: space._count.favorites,
    liveBookings,
    rating: reviewsAgg._avg.rating != null ? Number(reviewsAgg._avg.rating) : null,
    reviewsCount: reviewsAgg._count,
    reviews: space.reviews,
  });
}

// ── Booking creation ────────────────────────────────────────
const DAY_NAMES = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

function timeToMinutes(value) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + (Number.isFinite(m) ? m : 0);
}

function parseSlots(slotNumbering) {
  if (!slotNumbering) return [];
  try {
    const parsed = JSON.parse(slotNumbering);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* fall through */
  }
  return String(slotNumbering)
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function computeBookingAmount(space, startAt, endAt) {
  const hours = (endAt.getTime() - startAt.getTime()) / 3600000;
  if (!(hours > 0)) throw new ApiError(422, "End time must be after start time.");
  const hourly = Number(space.pricePerHour);
  let amount;
  if (hours <= 1) {
    amount = hourly;
  } else if (hours < 24) {
    amount = Math.ceil(hours) * hourly;
  } else {
    const dayRate = space.pricePerDay != null ? Number(space.pricePerDay) : hourly * 24;
    const fullDays = Math.floor(hours / 24);
    const remainingHours = hours - fullDays * 24;
    amount = fullDays * dayRate + (remainingHours > 0 ? Math.ceil(remainingHours) * hourly : 0);
  }
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

async function assertSlotAvailability(space, startAt, endAt, slotLabel) {
  if (!space.open24Hours && space.openTime && space.closeTime) {
    const openMin = timeToMinutes(space.openTime);
    const closeMin = timeToMinutes(space.closeTime);
    const startMin = startAt.getHours() * 60 + startAt.getMinutes();
    const endMin = endAt.getHours() * 60 + endAt.getMinutes();
    if (closeMin >= openMin) {
      let endShifted = endMin;
      if (endShifted < startMin) endShifted += 1440;
      if (startMin < openMin || startMin > closeMin || endShifted > closeMin) {
        throw new ApiError(400, `Outside operating hours (${space.openTime}–${space.closeTime}).`);
      }
    } else if (!(startMin >= openMin || endMin <= closeMin)) {
      throw new ApiError(400, "Selected time falls outside operating hours.");
    }
  }
  if (space.availableDays.length) {
    const day = DAY_NAMES[startAt.getDay()];
    if (!space.availableDays.includes(day)) {
      throw new ApiError(400, "This space does not operate on the selected day.");
    }
  }
  if (slotLabel && parseSlots(space.slotNumbering).length) {
    const slots = parseSlots(space.slotNumbering);
    if (!slots.includes(slotLabel)) {
      throw new ApiError(400, "Selected parking slot is not available at this space.");
    }
  }
}

export async function createBooking(authId, input) {
  const space = await prisma.parkingSpace.findFirst({
    where: { id: input.spaceId, deletedAt: null, status: "ACTIVE" },
  });
  if (!space) throw new ApiError(404, "Parking space not found.");

  const startAt = new Date(input.startAt);
  const endAt = new Date(input.endAt);
  if (startAt.getTime() < Date.now() - 5 * 60 * 1000) {
    throw new ApiError(400, "Start time must be in the future.");
  }
  if (space.availableSlots < 1) throw new ApiError(400, "No parking slots available right now.");

  let vehicle = null;
  if (input.vehicleId) {
    vehicle = await prisma.vehicle.findFirst({ where: { id: input.vehicleId, authId, deletedAt: null } });
    if (!vehicle) throw new ApiError(404, "Vehicle not found.");
    if (space.vehicleTypes.length && !space.vehicleTypes.includes(vehicle.type || "OTHER")) {
      throw new ApiError(400, "This space does not support the selected vehicle type.");
    }
  }

  await assertSlotAvailability(space, startAt, endAt, input.slotLabel);
  const amount = computeBookingAmount(space, startAt, endAt);
  const slotLabel = input.slotLabel || null;
  const payNow = input.paymentMethod === "WALLET";

  let paymentStatus = "PENDING";
  if (payNow) {
    const wallet = await prisma.wallet.findFirst({ where: { ownerId: authId } });
    if (!wallet) throw new ApiError(400, "No wallet linked to your account.");
    if (Number(wallet.balance) < amount) {
      throw new ApiError(400, "Insufficient wallet balance for this booking.");
    }
    const newBalance = Math.round((Number(wallet.balance) - amount) * 100) / 100;
    await prisma.wallet.update({ where: { id: wallet.id }, data: { balance: newBalance } });
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: "DEBIT",
        amount,
        description: `Booking payment · ${space.parkingName}`,
        balanceAfter: newBalance,
      },
    });
    paymentStatus = "SUCCESS";
  }

  const booking = await prisma.booking.create({
    data: {
      userId: authId,
      providerId: space.authId,
      spaceId: space.id,
      startAt,
      endAt,
      slotLabel,
      status: "PENDING",
      totalAmount: amount,
      paymentStatus,
    },
    include: {
      space: { select: { parkingName: true, city: true, address: true, coverImage: true } },
      provider: { select: { fullName: true } },
    },
  });

  if (payNow) {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        walletId: (await prisma.wallet.findFirst({ where: { ownerId: authId } })).id,
        payerId: authId,
        amount,
        method: "WALLET",
        status: "SUCCESS",
        paidAt: new Date(),
      },
    });
  }

  await prisma.parkingSpace.update({
    where: { id: space.id },
    data: { availableSlots: { decrement: 1 }, totalBookings: { increment: 1 } },
  });
  await prisma.provider.update({
    where: { authId: space.authId },
    data: { totalBookings: { increment: 1 } },
  });

  return booking;
}

// ── Favorites ───────────────────────────────────────────────
export async function addFavorite(authId, spaceId) {
  const space = await prisma.parkingSpace.findFirst({ where: { id: spaceId, deletedAt: null } });
  if (!space) throw new ApiError(404, "Parking space not found.");
  const existing = await prisma.favorite.findFirst({ where: { authId, spaceId } });
  if (existing) {
    if (existing.deletedAt) {
      await prisma.favorite.update({ where: { id: existing.id }, data: { deletedAt: null } });
    }
    return { isFavorite: true };
  }
  await prisma.favorite.create({ data: { authId, spaceId } });
  return { isFavorite: true };
}

export async function removeFavorite(authId, spaceId) {
  const favorite = await prisma.favorite.findFirst({ where: { authId, spaceId, deletedAt: null } });
  if (favorite) {
    await prisma.favorite.update({ where: { id: favorite.id }, data: { deletedAt: new Date() } });
  }
  return { isFavorite: false };
}

export async function listFavorites(authId, { page, limit }) {
  const where = { authId, deletedAt: null };
  const total = await prisma.favorite.count({ where });
  const favorites = await prisma.favorite.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { space: true },
  });
  return {
    page,
    limit,
    total,
    items: favorites.map((f) => serializePublicSpace(f.space, { favoriteId: f.id })),
  };
}

// ── Wallet ──────────────────────────────────────────────────
export async function getWallet(authId) {
  const wallet = await prisma.wallet.findFirst({ where: { ownerId: authId } });
  if (!wallet) return { balance: 0, currency: "INR", transactions: [] };
  const transactions = await prisma.transaction.findMany({
    where: { walletId: wallet.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 25,
  });
  return {
    balance: Number(wallet.balance),
    currency: wallet.currency,
    transactions: transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      description: t.description,
      balanceAfter: Number(t.balanceAfter),
      createdAt: t.createdAt,
    })),
  };
}

// ── Bookings ────────────────────────────────────────────────
export async function listBookings(authId, { page, limit, status }) {
  const where = { userId: authId, deletedAt: null };
  if (status) where.status = status;
  const total = await prisma.booking.count({ where });
  const bookings = await prisma.booking.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      space: { select: { parkingName: true, city: true, address: true, pricePerHour: true } },
      provider: { select: { fullName: true } },
    },
  });
  return { page, limit, total, bookings };
}

export async function cancelBooking(authId, id) {
  const booking = await prisma.booking.findFirst({ where: { id, userId: authId, deletedAt: null } });
  if (!booking) throw new ApiError(404, "Booking not found.");
  if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
    throw new ApiError(400, `A ${booking.status} booking cannot be cancelled.`);
  }

  const payment = await prisma.payment.findFirst({ where: { bookingId: id, deletedAt: null } });
  if (payment && payment.status === "SUCCESS" && payment.method === "WALLET") {
    const wallet = await prisma.wallet.findFirst({ where: { ownerId: authId } });
    if (wallet) {
      const newBalance = Math.round((Number(wallet.balance) + Number(payment.amount)) * 100) / 100;
      await prisma.wallet.update({ where: { id: wallet.id }, data: { balance: newBalance } });
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: "CREDIT",
          amount: payment.amount,
          description: `Refund · booking ${id}`,
          referenceId: id,
          balanceAfter: newBalance,
        },
      });
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "REFUNDED" } });
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
    include: {
      space: { select: { parkingName: true, city: true, address: true, pricePerHour: true } },
      provider: { select: { fullName: true } },
    },
  });
  await prisma.parkingSpace.update({
    where: { id: booking.spaceId },
    data: { availableSlots: { increment: 1 } },
  });
  return updated;
}

export async function deleteAccount(authId) {
  await prisma.auth.update({
    where: { id: authId },
    data: { accountStatus: ACCOUNT_STATUS.DELETED },
  });
  return true;
}

export const userService = {
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
  computeBookingAmount,
  listFavorites,
  addFavorite,
  removeFavorite,
  getWallet,
  listBookings,
  cancelBooking,
  deleteAccount,
};

export default userService;
