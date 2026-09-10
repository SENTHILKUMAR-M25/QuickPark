import prisma from "../prisma/client.js";
import { ROLES } from "../config/constants.js";

const AUTH_BASE = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  role: true,
  isEmailVerified: true,
  isPhoneVerified: true,
  accountStatus: true,
  profileImage: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
};

const AUTH_WITH_USER = {
  ...AUTH_BASE,
  user: {
    select: {
      id: true,
      gender: true,
      dateOfBirth: true,
      address: true,
      emergencyContact: true,
      preferredLanguage: true,
      notificationSettings: true,
    },
  },
};

const AUTH_WITH_PROVIDER = {
  ...AUTH_BASE,
  provider: {
    select: {
      id: true,
      providerType: true,
      businessName: true,
      businessRegistrationNumber: true,
      gstNumber: true,
      governmentId: true,
      businessLicense: true,
      verificationStatus: true,
      walletBalance: true,
      rating: true,
      totalBookings: true,
      totalRevenue: true,
      bankAccountName: true,
      bankAccountNumber: true,
      ifscCode: true,
      upiId: true,
      address: true,
      location: true,
    },
  },
};

/** Everything: used by login so the role profile can be serialized after lookup. */
const AUTH_FULL = {
  ...AUTH_BASE,
  user: AUTH_WITH_USER.user,
  provider: AUTH_WITH_PROVIDER.provider,
};

/** Load an Auth account by id with its role-specific profile attached. */
export async function getCurrentAccount(authId) {
  return prisma.auth.findUnique({
    where: { id: authId },
    select: AUTH_BASE,
  });
}

/** Load an Auth account + the 1:1 profile for its role. */
export async function getCurrentUser(id, role) {
  const select = role === ROLES.PROVIDER ? AUTH_WITH_PROVIDER : AUTH_WITH_USER;
  return prisma.auth.findUnique({ where: { id }, select });
}

export function hasRole(actual, allowed) {
  return allowed.includes(actual) || actual === ROLES.ADMIN;
}

export { AUTH_BASE, AUTH_WITH_USER, AUTH_WITH_PROVIDER, AUTH_FULL };
