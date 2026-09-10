export const PARKING_TYPES = [
  { value: "HOUSE", label: "Individual House" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "COMMERCIAL", label: "Commercial Parking" },
  { value: "MALL", label: "Mall" },
  { value: "HOTEL", label: "Hotel" },
  { value: "HOSPITAL", label: "Hospital" },
  { value: "OFFICE", label: "Office" },
  { value: "SCHOOL", label: "School" },
  { value: "EVENT", label: "Event Parking" },
];

export const PARKING_TYPE_LABEL = Object.fromEntries(PARKING_TYPES.map((t) => [t.value, t.label]));

export const SURFACES = [
  { value: "OPEN", label: "Open" },
  { value: "COVERED", label: "Covered" },
  { value: "BASEMENT", label: "Basement" },
  { value: "MULTI_LEVEL", label: "Multi-Level" },
];

export const SURFACE_LABEL = Object.fromEntries(SURFACES.map((s) => [s.value, s.label]));

export const VEHICLE_TYPES = [
  { value: "BIKE", label: "Bike" },
  { value: "CAR", label: "Car" },
  { value: "SUV", label: "SUV" },
  { value: "EV", label: "EV" },
];

export const VEHICLE_LABEL = Object.fromEntries(VEHICLE_TYPES.map((v) => [v.value, v.label]));

export const AMENITIES = [
  { value: "CCTV", label: "CCTV" },
  { value: "SECURITY_GUARD", label: "Security Guard" },
  { value: "COVERED_PARKING", label: "Covered Parking" },
  { value: "EV_CHARGING", label: "EV Charging" },
  { value: "CAR_WASH", label: "Car Wash" },
  { value: "RESTROOM", label: "Restroom" },
  { value: "WAITING_AREA", label: "Waiting Area" },
  { value: "LIGHTING", label: "Lighting" },
  { value: "DISABLED_PARKING", label: "Disabled Parking" },
  { value: "LIFT_ACCESS", label: "Lift Access" },
  { value: "VALET_PARKING", label: "Valet Parking" },
];

export const AMENITY_LABEL = Object.fromEntries(AMENITIES.map((a) => [a.value, a.label]));

export const DAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

export const DAY_LABEL = Object.fromEntries(DAYS.map((d) => [d.value, d.label]));

export const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

export const STATUS_BADGE = {
  DRAFT: "bg-amber-50 text-amber-600 border-amber-100",
  ACTIVE: "bg-mint-50 text-mint-600 border-mint-100",
  INACTIVE: "bg-slate-100 text-slate-500 border-slate-200",
};

export const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "revenue", label: "Revenue" },
  { value: "rating", label: "Rating" },
  { value: "mostBooked", label: "Most Booked" },
];

export const PRICE_RANGES = [
  { value: "", label: "Any price" },
  { value: "0-49", label: "Under ₹50 / hr" },
  { value: "50-99", label: "₹50 – ₹99 / hr" },
  { value: "100-199", label: "₹100 – ₹199 / hr" },
  { value: "200-100000", label: "₹200+ / hr" },
];

export const humanLabel = (v = "") =>
  v.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
