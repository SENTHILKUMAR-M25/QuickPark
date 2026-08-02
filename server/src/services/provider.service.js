import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/ApiError.js";

function selectProfile(includeExtras = false) {
  return {
    id: true, ownerName: true, businessName: true, providerType: true, email: true,
    phone: true, profilePhoto: true, governmentIdUrl: true, businessLicenseUrl: true,
    gstNumber: true, verificationStatus: true, onboardingStep: true,
    onboardingComplete: true, slug: true, isEmailVerified: true, isPhoneVerified: true,
    bankName: true, bankAccountName: true, bankIfsc: true, upiId: true,
    wallet: includeExtras ? { select: { balance: true, currency: true } } : undefined,
  };
}

export async function getProfile(providerId) {
  const provider = await prisma.provider.findFirst({
    where: { id: providerId, deletedAt: null },
    select: selectViewer(true),
  });
  if (!provider) throw new ApiError(404, "Provider not found.");
  return provider;
}

export async function updateProfile(providerId, data) {
  const clean = {};
  const allowed = ["ownerName", "businessName", "providerType"];
  for (const key of allowed) if (data[key] !== undefined) clean[key] = data[key];
  return prisma.provider.update({ where: { id: providerId }, data: clean, select: selectViewer() });
}

export async function updateDocuments(providerId, { governmentId, businessLicense, profilePhoto }) {
  const data = {};
  if (governmentId) data.governmentIdUrl = governmentId;
  if (businessLicense) data.businessLicenseUrl = businessLicense;
  if (profilePhoto) data.profilePhoto = profilePhoto;
  if (Object.keys(data).length) {
    await prisma.provider.update({ where: { id: providerId }, data });
  }
  return getProfile(providerId);
}

export async function updateBankDetails(providerId, { bankName, bankAccountName, bankAccountNumber, bankIfsc, upiId }) {
  await prisma.provider.update({
    where: { id: providerId },
    data: { bankName, bankAccountName, bankAccountNumber, bankIfsc, upiId: upiId || null },
  });
  return getProfile(providerId);
}

export async function getDashboard(providerId) {
  const [today, totalBookings, activeSpaces, wallet, recent] = await Promise.all([
    prisma.booking.aggregate({
      where: { providerId, startAt: { gte: startOfDay() } },
      _count: true,
      _sum: { totalAmount: true },
    }),
    prisma.booking.count({ where: { providerId, deletedAt: null } }),
    prisma.parkingSpace.count({ where: { providerId, deletedAt: null, isActive: true } }),
    prisma.wallet.findFirst({ where: { providerId } }),
    prisma.booking.findMany({ where: { providerId, deletedAt: null }, take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  return {
    todayBookings: today._count,
    todayRevenue: today._sum.totalAmount || 0,
    totalBookings,
    activeSpaces,
    walletBalance: wallet?.balance || 0,
    recent,
  };
}

function startOfDay() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const providerService = {
  getProfile, updateProfile, updateDocuments, updateBankDetails, getDashboard,
};

export default providerService;