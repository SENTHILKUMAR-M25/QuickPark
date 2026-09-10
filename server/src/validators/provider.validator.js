import { z } from "zod";
import {
  PARKING_TYPES,
  PARKING_SURFACES,
  SPACE_STATUSES,
} from "../config/constants.js";

export const updateProviderProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  businessName: z.string().trim().max(160).optional(),
  businessRegistrationNumber: z.string().trim().max(120).optional(),
  providerType: z
    .enum(["HOUSE", "APARTMENT", "COMMERCIAL", "HOTEL", "HOSPITAL", "MALL", "OFFICE", "SCHOOL"])
    .optional(),
  address: z.string().trim().max(255).optional(),
  location: z
    .object({
      latitude: z.number().min(-90).max(90).optional(),
      longitude: z.number().min(-180).max(180).optional(),
    })
    .optional(),
});

export const bankDetailsSchema = z.object({
  bankAccountName: z.string().trim().min(2).max(160),
  bankAccountNumber: z
    .string()
    .trim()
    .min(6)
    .max(20)
    .regex(/^\d+$/, "Invalid account number"),
  ifscCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  upiId: z.string().trim().regex(/^[\w.-]+@[\w]+$/).optional().or(z.literal("")),
});

// ── Parking space helpers ──────────────────────────────────
const emptyToUndefined = (v) => (v === "" || v === null || v === undefined ? undefined : v);

function toArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* fall through to comma-split */
    }
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return v;
}

function toJson(v) {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v === "object") return v;
  try {
    return JSON.parse(v);
  } catch {
    return undefined;
  }
}

function toBool(v) {
  if (typeof v === "boolean") return v;
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return undefined;
}

const stringArray = (min = 1) =>
  z.preprocess(toArray, z.array(z.string().trim().min(1))).refine((a) => a.length >= min);

const optionalNumber = z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(100000).optional());
const optionalJson = z.preprocess(toJson, z.record(z.any()).optional());

const parkingFields = z.object({
  // Basic information
  parkingName: z.string().trim().min(2, "Parking name is required").max(160),
  parkingType: z.enum(Object.keys(PARKING_TYPES)),
  description: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
  // Location
  address: z.string().trim().min(5, "Street address is required").max(255),
  area: z.preprocess(emptyToUndefined, z.string().trim().max(120).optional()),
  landmark: z.preprocess(emptyToUndefined, z.string().trim().max(120).optional()),
  city: z.string().trim().min(2, "City is required").max(120),
  state: z.string().trim().min(2, "State is required").max(120),
  country: z.preprocess(emptyToUndefined, z.string().trim().max(120).optional()),
  pincode: z.preprocess(emptyToUndefined, z.string().trim().max(20).optional()),
  latitude: z.preprocess(emptyToUndefined, z.coerce.number().min(-90).max(90).optional()),
  longitude: z.preprocess(emptyToUndefined, z.coerce.number().min(-180).max(180).optional()),
  // Parking details
  totalCapacity: z.coerce.number().int("Capacity must be a whole number").min(1, "Total capacity is required").max(10000),
  availableSlots: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(10000).optional()),
  slotNumbering: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
  vehicleTypes: stringArray(),
  surfaceType: z.enum(Object.keys(PARKING_SURFACES)),
  // Pricing
  pricePerHour: z.coerce.number().min(0, "Price per hour is required").max(100000),
  pricePerDay: optionalNumber,
  pricePerMonth: optionalNumber,
  weekendPricing: optionalJson,
  festivalPricing: optionalJson,
  // Working hours
  openTime: z
    .preprocess(emptyToUndefined, z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid open time").optional()),
  closeTime: z
    .preprocess(emptyToUndefined, z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid close time").optional()),
  open24Hours: z.preprocess(toBool, z.boolean().optional()),
  availableDays: stringArray(0),
  // Amenities & rules
  amenities: stringArray(0),
  rules: optionalJson,
  // Media
  coverImage: z.preprocess(emptyToUndefined, z.string().url().optional()),
  coverIndex: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).optional()),
  images: stringArray(0),
  propertyProof: z.preprocess(emptyToUndefined, z.string().url().optional()),
  parkingLicense: z.preprocess(emptyToUndefined, z.string().url().optional()),
  // Status
  status: z.enum(Object.keys(SPACE_STATUSES)),
});

export const createParkingSchema = parkingFields.required({
  parkingName: true,
  parkingType: true,
  address: true,
  city: true,
  state: true,
  totalCapacity: true,
  pricePerHour: true,
  surfaceType: true,
  vehicleTypes: true,
  status: true,
});

export const updateParkingSchema = parkingFields.partial();

export const parkingStatusSchema = z.object({
  status: z.enum(Object.keys(SPACE_STATUSES)),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]),
});
