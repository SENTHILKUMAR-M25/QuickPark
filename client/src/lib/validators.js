import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Mobile number is required")
  .regex(/^(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/, {
    message: "Enter a valid mobile number",
  })
  .max(15, "Mobile number is too long");

export const strongPassword = z
  .string()
  .min(8, "Minimum 8 characters required")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(/[0-9]/, "At least one number")
  .regex(/[^A-Za-z0-9]/, "At least one special character");

export const passwordRules = [
  { label: "Minimum 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function passwordScore(pw = "") {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or mobile number is required")
    .refine(
      (v) => /^\S+@\S+\.\S+$/.test(v) || /^\d{7,15}$/.test(v.replace(/[\s.-]/g, "")),
      "Enter a valid email or mobile number"
    ),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const userRegisterSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
    email: emailSchema,
    phone: phoneSchema,
    password: strongPassword,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the Terms & Conditions",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const providerRegisterSchema = z
  .object({
    ownerName: z.string().trim().min(2, "Owner name must be at least 2 characters"),
    businessName: z.string().trim().optional(),
    providerType: z.string().min(1, "Select a provider type"),
    email: emailSchema,
    phone: phoneSchema,
    password: strongPassword,
    confirmPassword: z.string(),
    gstNumber: z.string().trim().optional(),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the Terms & Conditions",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "Enter the 6-digit code")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

/**
 * Strict email schema reused by multiple schemas.
 * Reassigned here so validators stay self-contained.
 */
export { emailSchema, phoneSchema };