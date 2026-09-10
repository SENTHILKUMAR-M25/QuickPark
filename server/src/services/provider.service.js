import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/ApiError.js";
import { ACCOUNT_STATUS, ROLES } from "../config/constants.js";
import { getCurrentUser } from "../lib/auth.js";
import { serializeAccount } from "../lib/presenter.js";

async function loadProfile(authId) {
  const account = await getCurrentUser(authId, ROLES.PROVIDER);
  if (!account || account.accountStatus === ACCOUNT_STATUS.DELETED) {
    throw new ApiError(404, "Provider not found.");
  }
  // Owner-scoped call: allow their own sensitive documents.
  return serializeAccount(account, { includeSensitive: true });
}

const PROFILE_FIELDS = [
  "businessName",
  "businessRegistrationNumber",
  "gstNumber",
  "address",
  "location",
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
    await prisma.provider.update({ where: { authId }, data: clean });
  }
  return loadProfile(authId);
}

export async function updateDocuments(authId, { governmentId, businessLicense, profileImage }) {
  const data = {};
  if (governmentId) data.governmentId = governmentId;
  if (businessLicense) data.businessLicense = businessLicense;
  if (Object.keys(data).length) {
    await prisma.provider.update({ where: { authId }, data });
  }
  if (profileImage) {
    await prisma.auth.update({ where: { id: authId }, data: { profileImage } });
  }
  return loadProfile(authId);
}

export async function updateBankDetails(authId, { bankAccountName, bankAccountNumber, ifscCode, upiId }) {
  const data = {};
  if (bankAccountName !== undefined) data.bankAccountName = bankAccountName;
  if (bankAccountNumber !== undefined) data.bankAccountNumber = bankAccountNumber;
  if (ifscCode !== undefined) data.ifscCode = ifscCode;
  if (upiId !== undefined) data.upiId = upiId || null;
  if (Object.keys(data).length) {
    await prisma.provider.update({ where: { authId }, data });
  }
  return loadProfile(authId);
}

// ── Dashboard ───────────────────────────────────────────────
const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export async function getDashboard(authId) {
  // Sequential queries: Neon pooler runs with connection_limit=1.
  const todayAgg = await prisma.booking.aggregate({
    where: { providerId: authId, startAt: { gte: startOfDay() }, deletedAt: null },
    _count: true,
    _sum: { totalAmount: true },
  });
  const totalBookings = await prisma.booking.count({ where: { providerId: authId, deletedAt: null } });
  const activeSpaces = await prisma.parkingSpace.count({ where: { authId, deletedAt: null, status: "ACTIVE" } });
  const totalSpaces = await prisma.parkingSpace.count({ where: { authId, deletedAt: null } });
  const wallet = await prisma.wallet.findFirst({ where: { ownerId: authId } });
  const monthAgg = await prisma.booking.aggregate({
    where: {
      providerId: authId,
      startAt: { gte: startOfMonth() },
      status: { in: ["CONFIRMED", "COMPLETED"] },
      deletedAt: null,
    },
    _sum: { totalAmount: true },
  });
  const pendingBookings = await prisma.booking.count({
    where: { providerId: authId, status: "PENDING", deletedAt: null },
  });
  const upcomingBookings = await prisma.booking.count({
    where: { providerId: authId, startAt: { gte: new Date() }, status: { in: ["PENDING", "CONFIRMED"] }, deletedAt: null },
  });
  const reviews = await prisma.review.aggregate({
    where: { providerId: authId, deletedAt: null },
    _avg: { rating: true },
    _count: true,
  });
  const provider = await prisma.provider.findUnique({ where: { authId } });
  const breakdownRows = await prisma.booking.groupBy({
    by: ["status"],
    where: { providerId: authId, deletedAt: null },
    _count: { _all: true },
  });
  const recentBookings = await prisma.booking.findMany({
    where: { providerId: authId, deletedAt: null },
    take: 6,
    orderBy: { startAt: "desc" },
    include: {
      user: { select: { fullName: true, profileImage: true } },
      space: { select: { parkingName: true, city: true } },
    },
  });

  const breakdown = {};
  for (const s of BOOKING_STATUSES) breakdown[s] = 0;
  for (const row of breakdownRows) breakdown[row.status] = row._count._all;

  return {
    todayBookings: todayAgg._count,
    todayRevenue: todayAgg._sum.totalAmount || 0,
    monthRevenue: monthAgg._sum.totalAmount || 0,
    totalBookings,
    totalRevenue: provider?.totalRevenue || 0,
    activeSpaces,
    totalSpaces,
    pendingBookings,
    upcomingBookings,
    walletBalance: wallet?.balance || 0,
    rating: reviews._avg.rating || null,
    reviewsCount: reviews._count,
    verificationStatus: provider?.verificationStatus || "PENDING",
    breakdown,
    recentBookings: recentBookings.map((r) => ({
      id: r.id,
      status: r.status,
      totalAmount: r.totalAmount,
      startAt: r.startAt,
      createdAt: r.createdAt,
      user: r.user,
      space: r.space,
    })),
  };
}

// ── Parking spaces ──────────────────────────────────────────
async function getOwnedSpace(authId, id) {
  const space = await prisma.parkingSpace.findFirst({ where: { id, authId, deletedAt: null } });
  if (!space) throw new ApiError(404, "Parking space not found.");
  return space;
}

const PARKING_ORDER = {
  latest: { createdAt: "desc" },
  rating: { averageRating: "desc" },
  mostBooked: { totalBookings: "desc" },
};

function serializeSpace(space, extra = {}) {
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
    propertyProof: space.propertyProof,
    parkingLicense: space.parkingLicense,
    status: space.status,
    averageRating: space.averageRating != null ? Number(space.averageRating) : null,
    totalBookings: space.totalBookings,
    createdAt: space.createdAt,
    updatedAt: space.updatedAt,
    ...extra,
  };
}

async function spaceStats(ids) {
  const monthStart = startOfMonth();
  const monthAgg = await prisma.booking.groupBy({
    by: ["spaceId"],
    where: {
      spaceId: { in: ids },
      startAt: { gte: monthStart },
      status: { in: ["CONFIRMED", "COMPLETED"] },
      deletedAt: null,
    },
    _sum: { totalAmount: true },
    _count: true,
  });
  const totalAgg = await prisma.booking.groupBy({
    by: ["spaceId"],
    where: { spaceId: { in: ids }, deletedAt: null },
    _count: true,
  });
  const monthly = {};
  for (const r of monthAgg) monthly[r.spaceId] = Number(r._sum.totalAmount || 0);
  const total = {};
  for (const r of totalAgg) total[r.spaceId] = r._count;
  return { monthly, total };
}

export async function listParking(authId, { page, limit, search, parkingType, status, vehicleType, minPrice, maxPrice, sort }) {
  const where = { authId, deletedAt: null };
  if (search) {
    where.OR = [
      { parkingName: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { area: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }
  if (parkingType) where.parkingType = parkingType;
  if (status) where.status = status;
  if (vehicleType) where.vehicleTypes = { has: vehicleType };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.pricePerHour = {};
    if (minPrice !== undefined) where.pricePerHour.gte = minPrice;
    if (maxPrice !== undefined) where.pricePerHour.lte = maxPrice;
  }

  const total = await prisma.parkingSpace.count({ where });
  const spaces = await prisma.parkingSpace.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: PARKING_ORDER[sort] || PARKING_ORDER.latest,
  });

  const stats = spaces.length ? await spaceStats(spaces.map((s) => s.id)) : { monthly: {}, total: {} };
  let items = spaces.map((s) =>
    serializeSpace(s, {
      monthlyRevenue: stats.monthly[s.id] || 0,
      liveBookings: stats.total[s.id] || 0,
    })
  );

  if (sort === "revenue") {
    items = items.sort((a, b) => b.monthlyRevenue - a.monthlyRevenue);
  }

  return { page, limit, total, items };
}

export async function getParking(authId, id) {
  const space = await getOwnedSpace(authId, id);
  const stats = await spaceStats([id]);
  return serializeSpace(space, {
    monthlyRevenue: stats.monthly[id] || 0,
    liveBookings: stats.total[id] || 0,
  });
}

export async function createParking(authId, data) {
  if (!data.images?.length) throw new ApiError(422, "At least one image is required.");
  const capacity = data.totalCapacity;
  const available = data.availableSlots !== undefined ? Math.min(data.availableSlots, capacity) : capacity;
  const space = await prisma.parkingSpace.create({
    data: {
      authId,
      parkingName: data.parkingName,
      parkingType: data.parkingType,
      description: data.description || null,
      address: data.address,
      area: data.area || null,
      landmark: data.landmark || null,
      city: data.city,
      state: data.state,
      country: data.country || "India",
      pincode: data.pincode || null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      totalCapacity: capacity,
      availableSlots: available,
      slotNumbering: data.slotNumbering || null,
      vehicleTypes: data.vehicleTypes,
      surfaceType: data.surfaceType || "OPEN",
      pricePerHour: data.pricePerHour,
      pricePerDay: data.pricePerDay ?? null,
      pricePerMonth: data.pricePerMonth ?? null,
      weekendPricing: data.weekendPricing ?? undefined,
      festivalPricing: data.festivalPricing ?? undefined,
      openTime: data.openTime || null,
      closeTime: data.closeTime || null,
      open24Hours: data.open24Hours || false,
      availableDays: data.availableDays || [],
      amenities: data.amenities || [],
      rules: data.rules ?? undefined,
      coverImage: data.coverImage || data.images[0] || null,
      images: data.images,
      propertyProof: data.propertyProof || null,
      parkingLicense: data.parkingLicense || null,
      status: data.status || "DRAFT",
    },
  });
  return serializeSpace(space);
}

const PARKING_UPDATE_FIELDS = [
  "parkingName",
  "parkingType",
  "description",
  "address",
  "area",
  "landmark",
  "city",
  "state",
  "country",
  "pincode",
  "latitude",
  "longitude",
  "slotNumbering",
  "surfaceType",
  "pricePerHour",
  "openTime",
  "closeTime",
  "open24Hours",
  "coverImage",
  "propertyProof",
  "parkingLicense",
  "status",
];

export async function updateParking(authId, id, data) {
  const existing = await getOwnedSpace(authId, id);
  const clean = {};

  for (const key of PARKING_UPDATE_FIELDS) {
    if (data[key] !== undefined) clean[key] = data[key];
  }
  for (const key of ["vehicleTypes", "availableDays", "amenities", "images"]) {
    if (data[key] !== undefined) clean[key] = data[key];
  }
  if (data.weekendPricing !== undefined) clean.weekendPricing = data.weekendPricing;
  if (data.festivalPricing !== undefined) clean.festivalPricing = data.festivalPricing;
  if (data.rules !== undefined) clean.rules = data.rules;

  if (data.totalCapacity !== undefined) {
    clean.totalCapacity = data.totalCapacity;
    const nextAvailable =
      data.availableSlots !== undefined ? data.availableSlots : existing.availableSlots;
    clean.availableSlots = Math.min(nextAvailable, data.totalCapacity);
  } else if (data.availableSlots !== undefined) {
    clean.availableSlots = Math.max(0, Math.min(data.availableSlots, existing.totalCapacity));
  }

  if (clean.images !== undefined) {
    if (!clean.images.length) throw new ApiError(422, "At least one image is required.");
    if (clean.coverImage === undefined && existing.coverImage && !clean.images.includes(existing.coverImage)) {
      clean.coverImage = clean.images[0] || null;
    }
  }

  if (!Object.keys(clean).length) return serializeSpace(existing);
  const space = await prisma.parkingSpace.update({ where: { id }, data: clean });
  return serializeSpace(space);
}

export async function setParkingStatus(authId, id, status) {
  await getOwnedSpace(authId, id);
  const space = await prisma.parkingSpace.update({ where: { id }, data: { status } });
  return serializeSpace(space);
}

export async function deleteParking(authId, id) {
  await getOwnedSpace(authId, id);
  await prisma.parkingSpace.update({
    where: { id },
    data: { deletedAt: new Date(), status: "INACTIVE" },
  });
  return true;
}

export async function getParkingAnalytics(authId, id) {
  const space = await getOwnedSpace(authId, id);
  const spaceId = space.id;

  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const recent = await prisma.booking.findMany({
    where: { spaceId, startAt: { gte: since }, deletedAt: null },
    select: { startAt: true, status: true, totalAmount: true },
  });

  const dailyMap = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = { date: key, bookings: 0, revenue: 0 };
  }
  for (const b of recent) {
    const key = b.startAt.toISOString().slice(0, 10);
    if (!dailyMap[key]) continue;
    dailyMap[key].bookings += 1;
    if (b.status === "CONFIRMED" || b.status === "COMPLETED") {
      dailyMap[key].revenue += Number(b.totalAmount || 0);
    }
  }
  const daily = Object.values(dailyMap);

  const breakdownRows = await prisma.booking.groupBy({
    by: ["status"],
    where: { spaceId, deletedAt: null },
    _count: { _all: true },
  });
  const breakdown = {};
  for (const s of BOOKING_STATUSES) breakdown[s] = 0;
  for (const row of breakdownRows) breakdown[row.status] = row._count._all;

  const lifetime = await prisma.booking.aggregate({
    where: { spaceId, deletedAt: null },
    _count: true,
    _sum: { totalAmount: true },
  });
  const monthAgg = await prisma.booking.aggregate({
    where: { spaceId, startAt: { gte: startOfMonth() }, status: { in: ["CONFIRMED", "COMPLETED"] }, deletedAt: null },
    _count: true,
    _sum: { totalAmount: true },
  });
  const reviews = await prisma.review.aggregate({
    where: { spaceId, deletedAt: null },
    _avg: { rating: true },
    _count: true,
  });

  return {
    space: serializeSpace(space),
    lifetime: { bookings: lifetime._count, revenue: Number(lifetime._sum.totalAmount || 0) },
    month: { bookings: monthAgg._count, revenue: Number(monthAgg._sum.totalAmount || 0) },
    daily,
    breakdown,
    rating: reviews._avg.rating != null ? Number(reviews._avg.rating) : null,
    reviewsCount: reviews._count,
  };
}

// ── Bookings ────────────────────────────────────────────────
export async function listBookings(authId, { page, limit, status }) {
  const where = { providerId: authId, deletedAt: null };
  if (status) where.status = status;
  const total = await prisma.booking.count({ where });
  const bookings = await prisma.booking.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { fullName: true, phone: true, profileImage: true } },
      space: { select: { parkingName: true, city: true, address: true } },
    },
  });
  return { page, limit, total, bookings };
}

const BOOKING_TRANSITIONS = {
  CONFIRMED: ["PENDING"],
  COMPLETED: ["CONFIRMED"],
  NO_SHOW: ["CONFIRMED"],
  CANCELLED: ["PENDING", "CONFIRMED"],
};

export async function updateBookingStatus(authId, id, status) {
  const booking = await prisma.booking.findFirst({ where: { id, providerId: authId, deletedAt: null } });
  if (!booking) throw new ApiError(404, "Booking not found.");
  if (!BOOKING_TRANSITIONS[status]?.includes(booking.status)) {
    throw new ApiError(400, `Cannot move a ${booking.status} booking to ${status}.`);
  }

  const data = { status };
  if (status === "CANCELLED") data.cancelledAt = new Date();

  const updated = await prisma.booking.update({
    where: { id },
    data,
    include: {
      user: { select: { fullName: true, phone: true, profileImage: true } },
      space: { select: { parkingName: true, city: true, address: true } },
    },
  });

  if (status === "CANCELLED") {
    await prisma.parkingSpace.update({
      where: { id: booking.spaceId },
      data: { availableSlots: { increment: 1 } },
    });
  }

  return updated;
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
  return { balance: wallet.balance, currency: wallet.currency, transactions };
}

function startOfDay() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(1);
  return d;
}

export const providerService = {
  getProfile,
  updateProfile,
  updateDocuments,
  updateBankDetails,
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

export default providerService;
