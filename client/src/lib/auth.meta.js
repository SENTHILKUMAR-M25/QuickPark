export const APP_NAME = "Quick Park";
export const APP_TAGLINE = "A Smart Parking Marketplace";

export const ROLES = Object.freeze({
  USER: "USER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
});

export const PROVIDER_TYPES = [
  { value: "HOUSE", label: "Individual House", icon: "home" },
  { value: "APARTMENT", label: "Apartment", icon: "building2" },
  { value: "COMMERCIAL", label: "Commercial Parking", icon: "store" },
  { value: "HOTEL", label: "Hotel", icon: "bed" },
  { value: "HOSPITAL", label: "Hospital", icon: "cross" },
  { value: "MALL", label: "Mall", icon: "shoppingBag" },
  { value: "OFFICE", label: "Office", icon: "briefcase" },
  { value: "SCHOOL", label: "School", icon: "graduationCap" },
];

/**
 * Per-role config: label, badge tone, entry paths and the navigation links
 * surfaced in the navbar (desktop + mobile) and the profile dropdown.
 */
export const ROLE_META = {
  [ROLES.USER]: {
    label: "User",
    badge: "User",
    home: "/dashboard",
    login: "/login",
    register: "/register",
    nav: [
      { label: "Home", to: "/" },
      { label: "Find Parking", to: "/find-parking" },
      { label: "My Bookings", to: "/bookings" },
      { label: "Favorites", to: "/favorites" },
    ],
    mobileNav: [
      { label: "Home", to: "/" },
      { label: "Find Parking", to: "/find-parking" },
      { label: "My Bookings", to: "/bookings" },
      { label: "Notifications", to: "/notifications" },
    ],
    dropdown: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "My Bookings", to: "/bookings" },
      { label: "Saved Parking", to: "/favorites" },
      { label: "Notifications", to: "/notifications" },
      { label: "Profile", to: "/profile" },
      { label: "Settings", to: "/settings" },
    ],
  },
  [ROLES.PROVIDER]: {
    label: "Provider",
    badge: "Provider",
    home: "/provider/dashboard",
    login: "/provider/login",
    register: "/provider/register",
    nav: [
      { label: "Dashboard", to: "/provider/dashboard" },
      { label: "My Parking", to: "/provider/parking" },
      { label: "Bookings", to: "/provider/bookings" },
      { label: "Revenue", to: "/provider/revenue" },
    ],
    profileNav: [
      { label: "Dashboard", to: "/provider/dashboard" },
      { label: "My Parking", to: "/provider/parking" },
      { label: "Bookings", to: "/provider/bookings" },
      { label: "Wallet", to: "/provider/wallet" },
    ],
    dropdown: [
      { label: "Dashboard", to: "/provider/dashboard" },
      { label: "Parking Spaces", to: "/provider/parking" },
      { label: "Bookings", to: "/provider/bookings" },
      { label: "Wallet", to: "/provider/wallet" },
      { label: "Reviews", to: "/provider/reviews" },
      { label: "Documents", to: "/provider/documents" },
      { label: "Profile", to: "/provider/profile" },
      { label: "Settings", to: "/provider/settings" },
    ],
  },
  [ROLES.ADMIN]: {
    label: "Admin",
    badge: "Admin",
    home: "/admin/dashboard",
    login: "/admin/login",
    register: "/admin/register",
    nav: [{ label: "Dashboard", to: "/admin/dashboard" }],
    dropdown: [{ label: "Dashboard", to: "/admin/dashboard" }],
  },
};

export function roleMeta(role) {
  return ROLE_META[role] || ROLE_META[ROLES.USER];
}