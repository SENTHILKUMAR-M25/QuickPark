import { z } from "zod";

const dateField = z
  .string()
  .optional()
  .refine((v) => !v || !Number.isNaN(Date.parse(v)), {
    message: "Invalid date",
  });

const settingsField = z
  .object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    push: z.boolean().optional(),
  })
  .optional();

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  gender: z.string().trim().max(20).optional(),
  dateOfBirth: dateField,
  address: z.string().trim().max(255).optional(),
  emergencyContact: z.string().trim().max(20).optional(),
  preferredLanguage: z.string().trim().max(20).optional(),
  notificationSettings: settingsField,
});

export const vehicleSchema = z.object({
  regNumber: z.string().trim().min(2).max(20),
  make: z.string().trim().min(1).max(60),
  model: z.string().trim().min(1).max(60),
  color: z.string().trim().max(40).optional(),
  type: z.enum(["CAR", "BIKE", "SUV", "VAN", "TRUCK", "EV", "OTHER"]).optional(),
});

const dateTimeField = z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
  message: "Invalid date-time",
});

export const createBookingSchema = z.object({
  spaceId: z.string().min(1),
  startAt: dateTimeField,
  endAt: dateTimeField,
  vehicleId: z.string().min(1).optional().or(z.literal("")),
  slotLabel: z.string().trim().max(60).optional().or(z.literal("")),
  paymentMethod: z.enum(["WALLET", "PAY_AT_SPOT"]).default("PAY_AT_SPOT"),
});
