import { z } from "zod";

export const updateProviderProfileSchema = z.object({
  ownerName: z.string().trim().min(2).max(120).optional(),
  businessName: z.string().trim().max(160).optional(),
  providerType: z
    .enum(["HOUSE", "APARTMENT", "COMMERCIAL", "HOTEL", "HOSPITAL", "MALL", "OFFICE", "SCHOOL"])
    .optional(),
});

export const bankDetailsSchema = z.object({
  bankName: z.string().trim().min(2).max(120),
  bankAccountName: z.string().trim().min(2).max(160),
  bankAccountNumber: z
    .string()
    .trim()
    .min(6)
    .max(20)
    .regex(/^\d+$/, "Invalid account number"),
  bankIfsc: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  upiId: z.string().trim().regex(/^[\w.-]+@[\w]+$/).optional().or(z.literal("")),
});