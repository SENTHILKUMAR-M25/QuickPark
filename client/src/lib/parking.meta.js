export const PARKING_TYPE_LABELS = {
  HOUSE: "Individual House",
  APARTMENT: "Apartment",
  COMMERCIAL: "Commercial Parking",
  MALL: "Mall",
  HOTEL: "Hotel",
  HOSPITAL: "Hospital",
  OFFICE: "Office",
  SCHOOL: "School",
  EVENT: "Event Parking",
};

export const PARKING_TYPES = Object.keys(PARKING_TYPE_LABELS);

export const VEHICLE_TYPE_LABELS = {
  CAR: "Car",
  BIKE: "Bike",
  SUV: "SUV",
  VAN: "Van",
  TRUCK: "Truck",
  EV: "EV",
  OTHER: "Other",
};

export const SURFACE_LABELS = {
  OPEN: "Open",
  COVERED: "Covered",
  BASEMENT: "Basement",
  MULTI_LEVEL: "Multi-Level",
};

export const AMENITY_LABELS = {
  CCTV: "CCTV",
  SECURITY_GUARD: "Security Guard",
  COVERED_PARKING: "Covered Parking",
  EV_CHARGING: "EV Charging",
  CAR_WASH: "Car Wash",
  RESTROOM: "Restroom",
  WAITING_AREA: "Waiting Area",
  LIGHTING: "Lighting",
  DISABLED_PARKING: "Disabled Parking",
  LIFT_ACCESS: "Lift Access",
  VALET_PARKING: "Valet Parking",
};

export const DAY_LABELS = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

export const SORT_OPTIONS = [
  { value: "mostBooked", label: "Most booked" },
  { value: "rating", label: "Top rated" },
  { value: "priceLow", label: "Price: low to high" },
  { value: "priceHigh", label: "Price: high to low" },
  { value: "latest", label: "Newest" },
  { value: "nearby", label: "Nearest" },
];

export const priceLabel = (space) => `₹${Math.round(Number(space.pricePerHour))}/hr`;

export function parseSlots(slotNumbering) {
  if (!slotNumbering) return [];
  try {
    const parsed = JSON.parse(slotNumbering);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* fall through */
  }
  return String(slotNumbering)
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Mirrors server-side pricing so the estimate matches the final charge. */
export function estimateAmount(space, start, end) {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return 0;
  const hours = (endMs - startMs) / 3600000;
  if (!(hours > 0)) return 0;
  const hourly = Number(space?.pricePerHour || 0);
  if (hours <= 1) return hourly;
  if (hours < 24) return Math.ceil(hours) * hourly;
  const dayRate = space?.pricePerDay != null ? Number(space.pricePerDay) : hourly * 24;
  const fullDays = Math.floor(hours / 24);
  const remaining = hours - fullDays * 24;
  return fullDays * dayRate + (remaining > 0 ? Math.ceil(remaining) * hourly : 0);
}
