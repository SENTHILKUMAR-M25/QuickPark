import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client.js";
import { env } from "../config/env.js";
import { ROLES, OTP_PURPOSES, PROVIDER_TYPES } from "../config/constants.js";
import { hashPassword, generateToken, hashCode, generateOtp } from "../utils/crypt.js";
import { createAndSendOtp } from "./otp.service.js";
import { tokenService } from "./token.service.js";
import { emailService } from "./email.service.js";
import { generateSlug } from "../utils/slugify.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { verifyOtp } from "./otp.service.js";

const USER_FIELDS = {
  id: true, fullName: true, email: true, phone: true, avatar: true,
  gender: true, dob: true, isEmailVerified: true, isPhoneVerified: true, role: true,
};
const PROVIDER_FIELDS = {
  id: true, ownerName: true, businessName: true, providerType: true, email: true,
  phone: true, profilePhoto: true, governmentIdUrl: true, businessLicenseUrl: true,
  gstNumber: true, verificationStatus: true, onboardingStep: true,
  onboardingComplete: true, slug: true, isEmailVerified: true, role: true,
};

export async function registerUser({ fullName, email, phone, password }) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }], deletedAt: null },
  });
  if (existing) {
    throw new ApiError(409, existing.email === email ? "Email is already registered." : "Mobile number is already registered.");
  }

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      passwordHash: await hashPassword(password),
      wallet: { create: { currency: "INR" } },
    },
    select: USER_FIELDS,
  });

  const token = generateToken(32);
  await prisma.emailVerification.create({
    data: {
      identifier: email,
      tokenHash: hashCode(token),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: user.id,
    },
  });

  emailService.sendVerificationEmail({ to: email, name: user.fullName, token }).catch((e) => {
    logger.warn("Verification email could not be sent", e.message);
  });

  return user;
}

export async function registerProvider({
  ownerName, businessName, providerType, email, phone, password, gstNumber,
  profilePhoto, governmentId, businessLicense,
}) {
  if (!PROVIDER_TYPES[providerType]) {
    throw new ApiError(400, "Invalid provider type.");
  }

  const existing = await prisma.provider.findFirst({
    where: { OR: [{ email }, { phone }], deletedAt: null },
  });
  if (existing) {
    throw new ApiError(409, existing.email === email ? "Email is already registered." : "Mobile number is already registered.");
  }

  const provider = await prisma.provider.create({
    data: {
      ownerName,
      businessName: businessName || null,
      providerType,
      email,
      phone,
      passwordHash: await hashPassword(password),
      gstNumber: gstNumber || null,
      slug: generateUniqueSlug(businessName || ownerName),
      profilePhoto: profilePhoto || null,
      governmentIdUrl: governmentId || null,
      businessLicenseUrl: businessLicense || null,
      wallet: { create: { currency: "INR" } },
    },
    select: PROVIDER_FIELDS,
  });

  const token = createToken(32);
  await prisma.emailVerification.create({
    data: {
      identifier: email,
      tokenHash: hashCode(token),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      providerId: provider.id,
    },
  });

  emailService.sendVerificationEmail({ to: email, name: ownerName, token }).catch((e) => {
    logger.warn("Verification email could not be sent", e.message);
  });
  return provider;
}

export async function login({ identifier, password, role, remember = false, userAgent, ip }) {
  let record;
  if (role === ROLES.PROVIDER) {
    record = await prisma.provider.findFirst({
      where: {
        deletedAt: null,
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });
  } else {
    record = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });
  }

  if (!record) throw new ApiError(401, "Invalid credentials.");
  const match = await bcrypt.compare(password, record.passwordHash);
  if (!match) throw new ApiError(401, "Invalid credentials.");

  const model = role === ROLES.PROVIDER ? prisma.provider : prisma.user;
  await model.update({ where: { id: record.id }, data: { lastLoginAt: new Date() } });

  const publicUser =
    role === ROLES.PROVIDER
      ? { id: record.id, name: record.ownerName, email: record.email, phone: record.phone, role, provider: true }
      : { id: record.id, name: record.fullName, email: record.email, phone: record.phone, role, provider: false };

  return { user: publicUser };
}

export async function verifyEmail({ token, identifier }) {
  const record = await prisma.emailVerification.findFirst({
    where: { tokenHash: hashCode(token), usedAt: null, expiresAt: { gt: new Date() } },
  });
  if (!record) throw new ApiError(400, "Invalid or expired verification link.");

  const tx = [];

  if (record.userId) {
    tx.push(prisma.user.update({ where: { id: record.userId }, data: { isEmailVerified: true } }));
  } else if (record.providerId) {
    tx.push(prisma.provider.update({ where: { id: record.providerId }, data: { isEmailVerified: true } }));
  }

  await Promise.all([...tx, prisma.emailVerification.update({ where: { id: record.id }, data: { usedAt: new Date() } })]);
  return identifier;
}

export async function requestPasswordReset({ identifier }) {
  const code = generateOtp(6);
  const purpose = OTP_PURPOSES.PASSWORD_RESET;
  await prisma.oTP.deleteMany({ where: { identifier, purpose, consumedAt: null } });
  await prisma.oTP.create({
    data: {
      identifier,
      purpose,
      codeHash: hashCode(code),
      expiresAt: new Date(Date.now() + env.otp.expiresMinutes * 60 * 1000),
    },
  });
  await emailService.sendPasswordResetOtp({ to: identifier, otp: code });
  return { expiresIn: env.otp.expiresMinutes * 60 };
}

export async function resetPassword({ identifier, otp, password }) {
  const ok = await verifyOtp({ identifier, purpose: OTP_PURPOSES.PASSWORD_RESET, code: otp });
  if (!ok) throw new ApiError(400, "Invalid or expired OTP.");

  const hash = await hashPassword(password);
  await Promise.all([
    prisma.user.updateMany({ where: { email: identifier }, data: { passwordHash: hash } }),
    prisma.provider.updateMany({ where: { email: identifier }, data: { passwordHash: hash } }),
  ]);
  // Revoke all refresh sessions linked to this identity via email.
  const users = await prisma.user.findMany({ where: { email: identifier }, select: { id: true } });
  const providers = await prisma.provider.findMany({ where: { email: identifier }, select: { id: true } });
  await prisma.session.updateMany({
    where: { OR: [{ userId: { in: users.map((u) => u.id) } }, { providerId: { in: providers.map((p) => p.id) } }] },
    data: { revokedAt: new Date() },
  });
  return true;
}

async function createOtpRecordForLogin({ identifier, purpose, owner, ownerId }) {
  const code = generateOtp(6);
  await prisma.oTP.deleteMany({ where: { identifier, purpose, consumedAt: null } });
  const data = { identifier, purpose, codeHash: hashCode(code), expiresAt: new Date(Date.now() + env.otp.expiresMinutes * 60 * 1000) };
  if (owner === "user") data.userId = ownerId;
  if (owner === "provider") data.providerId = ownerId;
  await prisma.oTP.create({ data });
  await emailService.sendOtpEmail({ to: identifier, otp: code });
  return { expiresIn: env.otp.expiresMinutes * 60 };
}

async function slugFor(name) {
  const base = generateSlug(name) || `partner-${Math.random().toString(36).slice(2, 8)}`;
  const count = await prisma.provider.count({ where: { slug: { startsWith: base } } });
  return count ? `${base}-${count + 1}` : base;
}

function createToken(len) {
  return generateToken(len);
}

async function generateUniqueSlug(name) {
  return slugFor(name);
}

export default {
  registerUser, registerProvider, login, verifyEmail,
  requestPasswordReset, resetPassword, sendLoginOtp: createOtpRecordForLogin,
};