import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../prisma/client.js";
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
import { serializeAccount } from "../lib/presenter.js";

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

function requestMeta(req, remember) {
  return {
    userAgent: req.get("user-agent"),
    ip: req.ip,
    remember,
  };
}

export const registerUser = asyncHandler(async (req, res) => {
  const { rememberMe } = req.body;
  const { tokens, user } = await svcRegisterUser({
    ...req.body,
    ...requestMeta(req, rememberMe),
  });
  setRefreshCookie(res, tokens.refreshToken);
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { accessToken: tokens.accessToken, user },
        "Account created. Check your email to verify."
      )
    );
});

export const registerProvider = asyncHandler(async (req, res) => {
  const files = req.files || {};
  const pick = (f) => (f && f[0] ? f[0] : null);

  const [profile, govt, license] = await Promise.all([
    pick(files.profilePhoto) ? uploadToCloudinary(pick(files.profilePhoto).path) : Promise.resolve(null),
    pick(files.governmentId) ? uploadToCloudinary(pick(files.governmentId).path) : Promise.resolve(null),
    pick(files.businessLicense) ? uploadToCloudinary(pick(files.businessLicense).path) : Promise.resolve(null),
  ]);

  const { tokens, user } = await svcRegisterProvider({
    ...req.body,
    profileImage: profile,
    governmentId: govt,
    businessLicense: license,
    ...requestMeta(req, req.body.rememberMe),
  });
  setRefreshCookie(res, tokens.refreshToken);
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { accessToken: tokens.accessToken, user },
        "Provider account created. Our team will verify your documents."
      )
    );
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password, rememberMe } = req.body;

  const { tokens, user } = await svcLogin({
    identifier,
    password,
    remember: rememberMe,
    userAgent: req.get("user-agent"),
    ip: req.ip,
  });

  setRefreshCookie(res, tokens.refreshToken);

  return res.json(
    new ApiResponse(200, { accessToken: tokens.accessToken, user }, "Login successful.")
  );
});

export const getMe = asyncHandler(async (req, res) => {
  const account = req.auth.account;
  return res.json(
    new ApiResponse(200, serializeAccount(account), "Current user fetched.")
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
  const { identifier, purpose } = req.body;
  const account = await prisma.auth.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
    select: { id: true },
  });

  const resp = await createAndSendOtp({
    identifier,
    purpose,
    authId: account?.id || null,
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
