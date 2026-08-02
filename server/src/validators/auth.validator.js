import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .email("Invalid email address")
  .max(255);

const phone = (field = "phone") =>
  z
    .string()
    .trim()
    .min(7, `${field} must be at least 7 digits`)
    .max(15, `${field} is too long`)
    .regex(/^\+?[0-9\s()-]{7,15}$/, "Invalid phone number");

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password too long")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

const identifier = z
  .string()
  .trim()
  .min(1, "Email or mobile number is required")
  .refine(
    (v) => /^\S+@\S+\.\S+$/.test(v) || /^\+?[0-9]{7,15}$/.test(v.replace(/[\s()-]/g, "")),
    { message: "Enter a valid email or mobile number" }
  );

export const emailsAndPhone = { email, phone, password, identifier };

export const registerUserSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(120),
  email,
  phone: phone("Mobile number"),
  password,
});

export const registerProviderSchema = z.object({
  ownerName: z.string().trim().min(2, "Owner name is required").max(120),
  businessName: z.string().trim().max(160).optional(),
  providerType: z.enum(["HOUSE", "APARTMENT", "COMMERCIAL", "HOTEL", "HOSPITAL", "MALL", "OFFICE", "SCHOOL"]),
  email,
  phone: phone("Mobile number"),
  password,
  gstNumber: z.string().trim().regex(/^[0-9A-Z]{15}$/).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  identifier,
  password: z.string().min(1, "Password is required"),
  role: z.enum(["USER", "PROVIDER"]).optional(),
  rememberMe: z.boolean().optional(),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(10, "Invalid token"),
  email: email.optional(),
});

export const forgotPasswordSchema = z.object({
  email,
});

export const sendOtpSchema = z.object({
  identifier: email.or(phone("Mobile number")),
  purpose: z.enum(["EMAIL_VERIFICATION", "PASSWORD_RESET", "LOGIN"]),
  role: z.enum(["USER", "PROVIDER"]).optional(),
});

export const verifyOtpSchema = z.object({
  identifier: email.or(phone("Mobile number")),
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d{6}$/),
  purpose: z.enum(["EMAIL_VERIFICATION", "PHONE_VERIFICATION", "PASSWORD_RESET", "LOGIN"]),
});

export const resetPasswordSchema = z.object({
  identifier: email.or(phone("Mobile number")),
  otp: z.string().regex(/^\d{6}$/, "Invalid OTP"),
  password,
});

export const refreshSchema = z.object({}).optional();