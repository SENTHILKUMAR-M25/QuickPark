import { prisma } from "../prisma/client.js";
import { env } from "../config/env.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import { ROLES } from "../config/constants.js";

function modelForRole(role) {
  return role === ROLES.PROVIDER ? prisma.provider : prisma.user;
}

/**
 * Issue an access + refresh token pair and persist the refresh session.
 */
export async function issueTokens({ id, role, userAgent, ip, remember }) {
  const payload = { sub: id, role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const expiresInMs = 1000 * (remember ? 30 : 7) * 24 * 60 * 60; // 30d / 7d

  await prisma.session.create({
    data: {
      refreshToken,
      userAgent: userAgent || null,
      ip: ip || null,
      expiresAt: new Date(Date.now() + expiresInMs),
      ...(role === ROLES.PROVIDER ? { providerId: id } : { userId: id }),
    },
  });

  return { accessToken, refreshToken, expiresAt: new Date(Date.now() + expiresInMs) };
}

/**
 * Rotate refresh token: validate the old one, revoke it, issue a new pair.
 */
export async function rotateRefreshToken(refreshToken, { userAgent, ip }) {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing.");
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token.");
  }

  const session = await prisma.session.findFirst({
    where: { refreshToken, revokedAt: null, expiresAt: { gt: new Date() } },
  });

  if (!session) {
    throw new ApiError(401, "Session not found or revoked.");
  }

  const role = payload.role || (session.userId ? ROLES.USER : ROLES.PROVIDER);
  const id = session.userId || session.providerId;

  await prisma.session.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });

  return issueTokens({ id, role, userAgent, ip, remember: true });
}

export async function revokeSession(refreshToken) {
  await prisma.session.updateMany({
    where: { refreshToken },
    data: { revokedAt: new Date() },
  });
}

export async function getUser(id, role) {
  if (role === ROLES.PROVIDER) {
    return prisma.provider.findUnique({ where: { id } });
  }
  return prisma.user.findUnique({ where: { id } });
}

export const tokenService = {
  issueTokens,
  rotateRefreshToken,
  revokeSession,
  getUser,
  refreshCookieName: env.jwt.refreshCookieName,
  refreshCookieSecure: env.jwt.refreshCookieSecure,
};

export default tokenService;