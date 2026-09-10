export const VERIFICATION_BADGE = {
 PENDING: "bg-amber-50 text-amber-600 border-amber-100",
 UNDER_REVIEW: "bg-blue-50 text-blue-600 border-blue-100",
 VERIFIED: "bg-mint-50 text-mint-600 border-mint-100",
 REJECTED: "bg-red-50 text-red-600 border-red-100",
};

export const STATUS_BADGE = {
 ACTIVE: "bg-mint-50 text-mint-600 border-mint-100",
 BLOCKED: "bg-red-50 text-red-600 border-red-100",
 DELETED: "bg-slate-100 text-slate-500 border-slate-200",
};

export const BOOKING_BADGE = {
 PENDING: "bg-amber-50 text-amber-600 border-amber-100",
 CONFIRMED: "bg-brand-50 text-brand-600 border-brand-100",
 CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
 COMPLETED: "bg-mint-50 text-mint-600 border-mint-100",
 NO_SHOW: "bg-red-50 text-red-600 border-red-100",
};

export const PAYMENT_BADGE = {
 SUCCESS: "bg-mint-50 text-mint-600 border-mint-100",
 PENDING: "bg-amber-50 text-amber-600 border-amber-100",
 REFUNDED: "bg-slate-100 text-slate-500 border-slate-200",
};

export const ACTIVE_BADGE = "bg-mint-50 text-mint-600 border-mint-100";
export const INACTIVE_BADGE = "bg-slate-100 text-slate-500 border-slate-200";

export const SPACE_BADGE = {
 DRAFT: "bg-amber-50 text-amber-600 border-amber-100",
 ACTIVE: "bg-mint-50 text-mint-600 border-mint-100",
 INACTIVE: "bg-slate-100 text-slate-500 border-slate-200",
};

export const humanLabel = (v = "") => v.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
