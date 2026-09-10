export const ROLES = Object.freeze({
  USER: "USER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
});

export const ACCOUNT_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED",
});

export const PROVIDER_TYPES = Object.freeze({
  HOUSE: "HOUSE",
  APARTMENT: "APARTMENT",
  COMMERCIAL: "COMMERCIAL",
  HOTEL: "HOTEL",
  HOSPITAL: "HOSPITAL",
  MALL: "MALL",
  OFFICE: "OFFICE",
  SCHOOL: "SCHOOL",
});

export const OTP_PURPOSES = Object.freeze({
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  PHONE_VERIFICATION: "PHONE_VERIFICATION",
  PASSWORD_RESET: "PASSWORD_RESET",
  LOGIN: "LOGIN",
});

export const OTP_CHANNELS = Object.freeze({
  EMAIL: "EMAIL",
  PHONE: "PHONE",
});

export const PARKING_TYPES = Object.freeze({
  HOUSE: "HOUSE",
  APARTMENT: "APARTMENT",
  COMMERCIAL: "COMMERCIAL",
  MALL: "MALL",
  HOTEL: "HOTEL",
  HOSPITAL: "HOSPITAL",
  OFFICE: "OFFICE",
  SCHOOL: "SCHOOL",
  EVENT: "EVENT",
});

export const PARKING_TYPE_LABELS = Object.freeze({
  HOUSE: "Individual House",
  APARTMENT: "Apartment",
  COMMERCIAL: "Commercial Parking",
  MALL: "Mall",
  HOTEL: "Hotel",
  HOSPITAL: "Hospital",
  OFFICE: "Office",
  SCHOOL: "School",
  EVENT: "Event Parking",
});

export const PARKING_SURFACES = Object.freeze({
  OPEN: "OPEN",
  COVERED: "COVERED",
  BASEMENT: "BASEMENT",
  MULTI_LEVEL: "MULTI_LEVEL",
});

export const PARKING_SURFACE_LABELS = Object.freeze({
  OPEN: "Open",
  COVERED: "Covered",
  BASEMENT: "Basement",
  MULTI_LEVEL: "Multi-Level",
});

export const SPACE_STATUSES = Object.freeze({
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
});

export const SPACE_STATUS_LABELS = Object.freeze({
  DRAFT: "Draft",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
});

export const PARKING_VEHICLE_TYPES = Object.freeze({
  BIKE: "BIKE",
  CAR: "CAR",
  SUV: "SUV",
  EV: "EV",
});

export const PARKING_AMENITIES = Object.freeze([
  "CCTV",
  "SECURITY_GUARD",
  "COVERED_PARKING",
  "EV_CHARGING",
  "CAR_WASH",
  "RESTROOM",
  "WAITING_AREA",
  "LIGHTING",
  "DISABLED_PARKING",
  "LIFT_ACCESS",
  "VALET_PARKING",
]);

export const PARKING_AMENITY_LABELS = Object.freeze({
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
});

export const PARKING_DAYS = Object.freeze([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);