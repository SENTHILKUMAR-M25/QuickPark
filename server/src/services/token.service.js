import { prisma } from "../prisma/client.js";
import { env } from "../config/env.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import { ACCOUNT_STATUS } from "../config/constants.js";

/**
 * Issue an access + refresh token pair and persist the refresh session
 * against the single Auth identity (authId).
 */
export async function issueTokens({ authId, role, userAgent, ip, remember }) {
  const payload = { sub: authId, role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const expiresInMs = 1000 * (remember ? 30 : 7) * 24 * 60 * 60; // 30d / 7d

  await prisma.session.create({
    data: {
      authId,
      refreshToken,
      userAgent: userAgent || null,
      ip: ip || null,
      expiresAt: new Date(Date.now() + expiresInMs),
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
    include: { auth: { select: { accountStatus: true } } },
  });

  if (!session) {
    throw new ApiError(401, "Session not found or revoked.");
  }
  if (session.auth.accountStatus !== ACCOUNT_STATUS.ACTIVE) {
    throw new ApiError(403, "Account is not active.");
  }

  const authId = session.authId;
  const role = payload.role;

  await prisma.session.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });

  return issueTokens({ authId, role, userAgent, ip, remember: true });
}

export async function revokeSession(refreshToken) {
  await prisma.session.updateMany({
    where: { refreshToken },
    data: { revokedAt: new Date() },
  });
}

export const tokenService = {
  issueTokens,
  rotateRefreshToken,
  revokeSession,
  refreshCookieName: env.jwt.refreshCookieName,
  refreshCookieSecure: env.jwt.refreshCookieSecure,
};

export default tokenService;
