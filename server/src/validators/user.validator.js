import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  gender: z.string().trim().max(20).optional(),
  addressLine: z.string().trim().max(255).optional(),
  city: z.string().trim().max(120).optional(),
  state: z.string().trim().max(120).optional(),
  country: z.string().trim().max(120).optional(),
  postalCode: z.string().trim().max(20).optional(),
  dob: z.string().optional().refine((v) => !v || !Number.isNaN(Date.parse(v)), {
    message: "Invalid date",
  }),
});

export const vehicleSchema = z.object({
  regNumber: z.string().trim().min(2).max(20),
  make: z.string().trim().min(1).max(60),
  model: z.string().trim().min(1).max(60),
  color: z.string().trim().max(40).optional(),
  type: z.enum(["CAR", "BIKE", "SUV", "VAN", "TRUCK", "EV", "OTHER"]).optional(),
});