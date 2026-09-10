import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client.js";
import { env } from "../config/env.js";
import {
  ROLES,
  ACCOUNT_STATUS,
  OTP_PURPOSES,
  PROVIDER_TYPES,
} from "../config/constants.js";
import { hashPassword, generateToken, hashCode, generateOtp } from "../utils/crypt.js";
import { createAndSendOtp, verifyOtp } from "./otp.service.js";
import { tokenService } from "./token.service.js";
import { emailService } from "./email.service.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { getCurrentUser, AUTH_WITH_USER, AUTH_WITH_PROVIDER } from "../lib/auth.js";
import { serializeAccount } from "../lib/presenter.js";

async function assertIdentifierFree(email, phone) {
  const existing = await prisma.auth.findFirst({
    where: { OR: [{ email }, { phone }] },
    select: { email: true },
  });
  if (existing) {
    throw new ApiError(409, existing.email === email ? "Email is already registered." : "Mobile number is already registered.");
  }
}

function createVerificationRecord(email, authId) {
  const token = generateToken(32);
  return prisma.emailVerification
    .create({
      data: {
        identifier: email,
        tokenHash: hashCode(token),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        authId,
      },
    })
    .then(() => token);
}

// ── Registration ───────────────────────────────────────────
// Step 1: insert into Auth (credentials only). Step 2: insert the
// 1:1 role profile referencing auth.id.
//
// NOTE: nested creates compile to a single atomic CTE statement on
// PostgreSQL, so NO interactive transaction is needed — this stays
// reliable through Neon's PgBouncer-compatible pooler.
export async function registerUser({ fullName, email, phone, password, userAgent, ip, remember = false }) {
  await assertIdentifierFree(email, phone);
  const passwordHash = await hashPassword(password);

  const auth = await prisma.auth.create({
    data: {
      fullName,
      email,
      phone,
      passwordHash,
      role: ROLES.USER,
      user: { create: {} },
      wallet: { create: { currency: "INR" } },
    },
    select: AUTH_WITH_USER,
  });

  createVerificationRecord(email, auth.id)
    .then((token) =>
      emailService
        .sendVerificationEmail({ to: email, name: auth.fullName, token })
        .catch((e) => logger.warn("Verification email could not be sent", e.message))
    )
    .catch((e) => logger.warn("Could not create verification token", e.message));

  const tokens = await tokenService.issueTokens({
    authId: auth.id,
    role: ROLES.USER,
    userAgent,
    ip,
    remember,
  });

  return { tokens, user: serializeAccount(auth) };
}

export async function registerProvider({
  fullName,
  businessName,
  providerType,
  email,
  phone,
  password,
  gstNumber,
  profileImage,
  governmentId,
  businessLicense,
  userAgent,
  ip,
  remember = false,
}) {
  if (!PROVIDER_TYPES[providerType]) {
    throw new ApiError(400, "Invalid provider type.");
  }
  await assertIdentifierFree(email, phone);
  const passwordHash = await hashPassword(password);

  const auth = await prisma.auth.create({
    data: {
      fullName,
      email,
      phone,
      passwordHash,
      role: ROLES.PROVIDER,
      profileImage: profileImage || null,
      provider: {
        create: {
          providerType,
          businessName: businessName || null,
          gstNumber: gstNumber || null,
          governmentId: governmentId || null,
          businessLicense: businessLicense || null,
        },
      },
      wallet: { create: { currency: "INR" } },
    },
    select: AUTH_WITH_PROVIDER,
  });

  createVerificationRecord(email, auth.id)
    .then((token) =>
      emailService
        .sendVerificationEmail({ to: email, name: auth.fullName, token })
        .catch((e) => logger.warn("Verification email could not be sent", e.message))
    )
    .catch((e) => logger.warn("Could not create verification token", e.message));

  const tokens = await tokenService.issueTokens({
    authId: auth.id,
    role: ROLES.PROVIDER,
    userAgent,
    ip,
    remember,
  });

  return { tokens, user: serializeAccount(auth, { includeSensitive: true }) };
}

// ── Login ──────────────────────────────────────────────────
// Single-source lookup: search ONLY the Auth table, verify bcrypt,
// load the role profile, and return a unified response.
export async function login({ identifier, password, remember = false, userAgent, ip }) {
  const record = await prisma.auth.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
    select: { id: true, passwordHash: true, role: true, accountStatus: true },
  });

  if (!record || record.accountStatus === ACCOUNT_STATUS.DELETED) {
    throw new ApiError(401, "Invalid credentials.");
  }
  if (record.accountStatus === ACCOUNT_STATUS.BLOCKED) {
    throw new ApiError(403, "This account has been blocked. Contact support.");
  }

  const match = await bcrypt.compare(password, record.passwordHash);
  if (!match) throw new ApiError(401, "Invalid credentials.");

  await prisma.auth.update({
    where: { id: record.id },
    data: { lastLogin: new Date() },
  });

  const account = await getCurrentUser(record.id, record.role);
  const tokens = await tokenService.issueTokens({
    authId: record.id,
    role: record.role,
    userAgent,
    ip,
    remember,
  });

  return { tokens, user: serializeAccount(account) };
}

// ── Email verification ─────────────────────────────────────
export async function verifyEmail({ token, identifier }) {
  const record = await prisma.emailVerification.findFirst({
    where: { tokenHash: hashCode(token), usedAt: null, expiresAt: { gt: new Date() } },
  });
  if (!record || !record.authId) {
    throw new ApiError(400, "Invalid or expired verification link.");
  }

  await prisma.auth.update({
    where: { id: record.authId },
    data: { isEmailVerified: true },
  });
  await prisma.emailVerification.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return identifier || record.identifier;
}

// ── Password reset ─────────────────────────────────────────
export async function requestPasswordReset({ identifier }) {
  const account = await prisma.auth.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
    select: { id: true },
  });

  const code = generateOtp(6);
  const purpose = OTP_PURPOSES.PASSWORD_RESET;
  await prisma.oTP.deleteMany({ where: { identifier, purpose, consumedAt: null } });
  await prisma.oTP.create({
    data: {
      identifier,
      purpose,
      codeHash: hashCode(code),
      expiresAt: new Date(Date.now() + env.otp.expiresMinutes * 60 * 1000),
      authId: account?.id || null,
    },
  });

  await emailService.sendPasswordResetOtp({ to: identifier, otp: code });
  return { expiresIn: env.otp.expiresMinutes * 60 };
}

export async function resetPassword({ identifier, otp, password }) {
  const ok = await verifyOtp({ identifier, purpose: OTP_PURPOSES.PASSWORD_RESET, code: otp });
  if (!ok) throw new ApiError(400, "Invalid or expired OTP.");

  const hash = await hashPassword(password);
  const accounts = await prisma.auth.findMany({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
    select: { id: true },
  });

  await prisma.auth.updateMany({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
    data: { passwordHash: hash },
  });
  await prisma.session.updateMany({
    where: { authId: { in: accounts.map((a) => a.id) }, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  return true;
}

export async function sendLoginOtp({ identifier, purpose, authId }) {
  return createAndSendOtp({ identifier, purpose, channel: "EMAIL", authId });
}

export default {
  registerUser,
  registerProvider,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  sendLoginOtp,
};
