import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/ApiError.js";
import { ACCOUNT_STATUS, ROLES } from "../config/constants.js";
import { AUTH_BASE, AUTH_WITH_USER, AUTH_WITH_PROVIDER } from "../lib/auth.js";
import { serializeAccount } from "../lib/presenter.js";

function startOfDay() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function providerCounts() {
  const rows = await prisma.provider.groupBy({
    by: ["verificationStatus"],
    _count: { _all: true },
  });
  const counts = { PENDING: 0, UNDER_REVIEW: 0, VERIFIED: 0, REJECTED: 0 };
  for (const row of rows) counts[row.verificationStatus] = row._count._all;
  return counts;
}

async function statusCounts() {
  const rows = await prisma.auth.groupBy({
    by: ["accountStatus"],
    _count: { _all: true },
    where: { role: { in: [ROLES.USER, ROLES.PROVIDER] } },
  });
  const counts = { ACTIVE: 0, BLOCKED: 0, DELETED: 0 };
  for (const row of rows) counts[row.accountStatus] = row._count._all;
  return counts;
}

export async function getOverview() {
  // The Neon pooler exposes a single connection (connection_limit=1), so
  // queries MUST run sequentially — parallel Promise.all starves the pool.
  const roleCounts = await prisma.auth.groupBy({
    by: ["role"],
    _count: { _all: true },
    where: { role: { in: [ROLES.USER, ROLES.PROVIDER] } },
  });
  const bookingCounts = await prisma.booking.groupBy({
    by: ["status"],
    _count: { _all: true },
    where: { deletedAt: null },
  });
  const revenue = await prisma.booking.aggregate({
    where: { deletedAt: null, paymentStatus: "SUCCESS" },
    _sum: { totalAmount: true },
  });
  const activeSpaces = await prisma.parkingSpace.count({ where: { deletedAt: null, status: "ACTIVE" } });
  const verifications = await providerCounts();
  const statuses = await statusCounts();
  const todayBookings = await prisma.booking.count({ where: { deletedAt: null, startAt: { gte: startOfDay() } } });
  const monthRevenue = await prisma.booking.aggregate({
    where: { deletedAt: null, paymentStatus: "SUCCESS", createdAt: { gte: startOfMonth() } },
    _sum: { totalAmount: true },
  });
  const recentUsers = await prisma.auth.findMany({
    where: { role: { in: [ROLES.USER, ROLES.PROVIDER] } },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: AUTH_BASE,
  });

  const roles = { USER: 0, PROVIDER: 0 };
  for (const row of roleCounts) if (roles[row.role] !== undefined) roles[row.role] = row._count._all;

  const bookings = { PENDING: 0, CONFIRMED: 0, CANCELLED: 0, COMPLETED: 0, NO_SHOW: 0 };
  for (const row of bookingCounts) bookings[row.status] = row._count._all;

  return {
    totals: {
      users: roles.USER,
      providers: roles.PROVIDER,
      accounts: roles.USER + roles.PROVIDER,
      bookings: Object.values(bookings).reduce((a, b) => a + b, 0),
      revenue: revenue._sum.totalAmount || 0,
      monthRevenue: monthRevenue._sum.totalAmount || 0,
      activeSpaces,
      todayBookings,
    },
    breakdown: {
      roles,
      bookings,
      verifications,
      statuses,
    },
    recentUsers: recentUsers.map((u) => serializeAccount(u)),
  };
}

export async function listUsers({ page = 1, limit = 20, search, status }) {
  const where = {
    role: ROLES.USER,
    accountStatus: status || undefined,
  };
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }

  const total = await prisma.auth.count({ where });
  const rows = await prisma.auth.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    select: AUTH_WITH_USER,
  });

  return { page, limit, total, users: rows.map((u) => serializeAccount(u)) };
}

export async function listProviders({ page = 1, limit = 20, search, verification }) {
  const where = {
    role: ROLES.PROVIDER,
  };
  if (verification) where.provider = { is: { verificationStatus: verification } };
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { provider: { is: { businessName: { contains: search, mode: "insensitive" } } } },
    ];
  }

  const total = await prisma.auth.count({ where });
  const rows = await prisma.auth.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    select: AUTH_WITH_PROVIDER,
  });

  return { page, limit, total, providers: rows.map((u) => serializeAccount(u, { includeSensitive: true })) };
}

export async function listParkingSpaces({ page = 1, limit = 20, search }) {
  const where = { deletedAt: null };
  if (search) {
    where.OR = [
      { parkingName: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  const total = await prisma.parkingSpace.count({ where });
  const rows = await prisma.parkingSpace.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: { auth: { select: { fullName: true, email: true } } },
  });

  return {
    page,
    limit,
    total,
    spaces: rows.map((s) => ({
      id: s.id,
      parkingName: s.parkingName,
      parkingType: s.parkingType,
      city: s.city,
      state: s.state,
      address: s.address,
      coverImage: s.coverImage,
      totalCapacity: s.totalCapacity,
      availableSlots: s.availableSlots,
      pricePerHour: Number(s.pricePerHour),
      status: s.status,
      createdAt: s.createdAt,
      auth: s.auth,
    })),
  };
}

export async function listBookings({ page = 1, limit = 20, status }) {
  const where = { deletedAt: null, status: status || undefined };
  const total = await prisma.booking.count({ where });
  const rows = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      user: { select: { fullName: true, email: true } },
      provider: { select: { fullName: true, email: true } },
      space: { select: { parkingName: true, city: true } },
    },
  });

  return { page, limit, total, bookings: rows };
}

async function ensureAccount(id, label = "User") {
  const account = await prisma.auth.findUnique({ where: { id } });
  if (!account) throw new ApiError(404, `${label} not found.`);
  if (account.role === ROLES.ADMIN) throw new ApiError(403, "Admin accounts cannot be managed this way.");
  return account;
}

export async function setAccountStatus(authId, status) {
  if (!ACCOUNT_STATUS[status]) throw new ApiError(422, "Invalid account status.");
  await ensureAccount(authId, "Account");
  await prisma.auth.update({
    where: { id: authId },
    data: { accountStatus: status },
  });
  if (status === ACCOUNT_STATUS.BLOCKED) {
    await prisma.session.updateMany({
      where: { authId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  return { id: authId, status };
}

export async function setProviderVerification(authId, status) {
  const valid = ["PENDING", "UNDER_REVIEW", "VERIFIED", "REJECTED"];
  if (!valid.includes(status)) throw new ApiError(422, "Invalid verification status.");
  const account = await ensureAccount(authId, "Provider");
  if (account.role !== ROLES.PROVIDER) throw new ApiError(404, "Provider not found.");
  await prisma.provider.update({
    where: { authId },
    data: { verificationStatus: status },
  });
  return { id: authId, verificationStatus: status };
}

export const adminService = {
  getOverview,
  listUsers,
  listProviders,
  listParkingSpaces,
  listBookings,
  setAccountStatus,
  setProviderVerification,
};

export default adminService;
