import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { uploadProviderDocs } from "../services/file.service.js";
import * as ctrl from "../controllers/auth.controller.js";
import {
  registerUserSchema,
  registerProviderSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register/user", authLimiter, validate(registerUserSchema), ctrl.registerUser);
router.post(
  "/register/provider",
  authLimiter,
  (req, res, next) => uploadProviderDocs(req, res, (err) => {
    if (err) return next(err);
    next();
  }),
  validate(registerProviderSchema),
  ctrl.registerProvider
);

router.post("/login", authLimiter, validate(loginSchema), ctrl.login);
router.get("/me", authenticate, ctrl.getMe);
router.post("/logout", ctrl.logout);
router.post("/refresh", ctrl.refresh);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), ctrl.forgotPassword);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), ctrl.resetPassword);
router.post("/verify-email", authLimiter, validate(verifyEmailSchema), ctrl.verifyEmail);
router.post("/send-otp", authLimiter, validate(sendOtpSchema), ctrl.sendOtp);
router.post("/verify-otp", authLimiter, validate(verifyOtpSchema), ctrl.verifyOtpRoute);

export default router;