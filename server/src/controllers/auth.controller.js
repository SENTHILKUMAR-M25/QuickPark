import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../prisma/client.js";
import { ROLES } from "../config/constants.js";
import {
  registerUser as svcRegisterUser,
  registerProvider as svcRegisterProvider,
  login as svcLogin,
  verifyEmail as svcVerifyEmail,
  requestPasswordReset,
  resetPassword as svcResetPassword,
} from "../services/auth.service.js";
import { createAndSendOtp, verifyOtp } from "../services/otp.service.js";
import { tokenService } from "../services/token.service.js";
import { uploadToCloudinary } from "../services/file.service.js";

const REFRESH_WINDOW = 7 * 24 * 60 * 60 * 1000;

function setRefreshCookie(res, token) {
  res.cookie(tokenService.refreshCookieName, token, {
    httpOnly: true,
    secure: tokenService.refreshCookieSecure,
    sameSite: "lax",
    maxAge: REFRESH_WINDOW,
    path: "/api/v1/auth",
  });
}

export const registerUser = asyncHandler(async (req, res) => {
  const user = await svcRegisterUser({ ...req.body, files: req.files });
  return res
    .status(201)
    .json(new ApiResponse(201, user, "Account created. Check your email to verify."));
});

export const registerProvider = asyncHandler(async (req, res) => {
  const files = req.files || {};
  const pick = (f) => (f && f[0] ? f[0] : null);

  const [profile, govt, license] = await Promise.all([
    pick(files.profilePhoto) ? uploadToCloudinary(pick(files.profilePhoto).path) : Promise.resolve(null),
    pick(files.governmentId) ? uploadToCloudinary(pick(files.governmentId).path) : Promise.resolve(null),
    pick(files.businessLicense) ? uploadToCloudinary(pick(files.businessLicense).path) : Promise.resolve(null),
  ]);

  const provider = await svcRegisterProvider({
    ...req.body,
    profilePhoto: profile,
    governmentId: govt,
    businessLicense: license,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, provider, "Provider account created. Our team will verify your documents."));
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password, rememberMe } = req.body;
  const role = req.body.role === "PROVIDER" ? "PROVIDER" : "USER";

  const { user } = await svcLogin({
    identifier,
    password,
    role,
    remember: rememberMe,
    userAgent: req.useragent || req.get("user-agent"),
    ip: req.ip,
  });

  const tokens = await tokenService.issueTokens({
    id: user.id,
    role,
    userAgent: req.get("user-agent"),
    ip: req.ip,
    remember: rememberMe,
  });

  setRefreshCookie(res, tokens.refreshToken);

  return res.json(
    new ApiResponse(200, { accessToken: tokens.accessToken, user }, "Login successful.")
  );
});

export const getMe = asyncHandler(async (req, res) => {
  const account = req.auth.account;
  const isProvider = req.auth.role === ROLES.PROVIDER;
  const isAdmin = req.auth.role === ROLES.ADMIN;

  if (isProvider) {
    return res.json(
      new ApiResponse(200, {
        id: account.id,
        name: account.businessName || account.ownerName,
        email: account.email,
        role: account.role,
        profileImage: account.profilePhoto || null,
      }, "Current user fetched.")
    );
  }

  if (isAdmin) {
    return res.json(
      new ApiResponse(200, {
        id: account.id,
        name: account.fullName || account.name || "Admin",
        email: account.email,
        role: ROLES.ADMIN,
        profileImage: account.avatar || account.profileImage || null,
      }, "Current user fetched.")
    );
  }

  return res.json(
    new ApiResponse(200, {
      id: account.id,
      name: account.fullName || account.email,
      email: account.email,
      role: account.role || ROLES.USER,
      profileImage: account.avatar || null,
    }, "Current user fetched.")
  );
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[tokenService.refreshCookieName];
  if (token) await tokenService.revokeSession(token);
  res.clearCookie(tokenService.refreshCookieName, { path: "/api/v1/auth" });
  return res.json(new ApiResponse(200, null, "Logged out."));
});

export const refresh = asyncHandler(async (req, res) => {
  const oldToken = req.cookies?.[tokenService.refreshCookieName];
  const tokens = await tokenService.rotateRefreshToken(oldToken, {
    userAgent: req.get("user-agent"),
    ip: req.ip,
  });
  setRefreshCookie(res, tokens.refreshToken);
  return res.json(new ApiResponse(200, { accessToken: tokens.accessToken }, "Token refreshed."));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const email = await svcVerifyEmail({ token: req.body.token, identifier: req.body.email });
  return res.json(new ApiResponse(200, { email }, "Email verified successfully."));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { expiresIn } = await requestPasswordReset({ identifier: req.body.email });
  return res.json(new ApiResponse(200, { expiresIn }, "OTP sent to your email."));
});

export const resetPassword = asyncHandler(async (req, res) => {
  await svcResetPassword({
    identifier: req.body.identifier,
    otp: req.body.otp,
    password: req.body.password,
  });
  return res.json(new ApiResponse(200, null, "Password updated successfully."));
});

export const sendOtp = asyncHandler(async (req, res) => {
  const { identifier, purpose, role } = req.body;
  const owner = role === "PROVIDER" ? "provider" : "user";
  let ownerId = null;

  const model = role === "PROVIDER" ? prisma.provider : prisma.user;
  const found = await model.findFirst({ where: { email: identifier } });

  const resp = await createAndSendOtp({
    identifier,
    purpose,
    owner,
    userId: role === "PROVIDER" ? null : found?.id,
    providerId: role === "PROVIDER" ? found?.id : null,
  });
  return res.json(new ApiResponse(200, resp, "OTP sent."));
});

export const verifyOtpRoute = asyncHandler(async (req, res) => {
  const ok = await verifyOtp({
    identifier: req.body.identifier,
    purpose: req.body.purpose,
    code: req.body.otp,
  });
  if (!ok) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid or expired OTP."));
  }
  return res.json(new ApiResponse(200, null, "OTP verified."));
});

export default {
  registerUser,
  registerProvider,
  login,
  logout,
  refresh,
  verifyEmail,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyOtpRoute,
};