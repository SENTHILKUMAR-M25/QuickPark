import { TrendingUp, CalendarCheck2, Building2, Wallet, Star, ShieldCheck, AlertTriangle } from "lucide-react";
import { Card, StatCard, Panel, Donut, Skeleton, Badge, Avatar, fmtNum, fmtINR, fmtDate } from "../../admin/ui";
import { VERIFICATION_BADGE, BOOKING_BADGE } from "../../admin/meta";

const BOOKING_COLORS = {
 COMPLETED: "#10b981",
 CONFIRMED: "#2563eb",
 PENDING: "#f59e0b",
 CANCELLED: "#94a3b8",
 NO_SHOW: "#ef4444",
};

const VERIFICATION_NOTES = {
 PENDING: "Your business documents are waiting to be reviewed. We'll notify you once they're verified.",
 UNDER_REVIEW: "Our team is reviewing your documents right now. This usually takes a few hours.",
 REJECTED: "Your verification was rejected. Please update your documents and resubmit.",
};

function VerificationBanner({ status }) {
 if (status === "VERIFIED") return null;
 const notes = VERIFICATION_NOTES[status] || VERIFICATION_NOTES.PENDING;
 const tones = {
 PENDING: "border-amber-200 bg-amber-50 text-amber-700",
 UNDER_REVIEW: "border-blue-200 bg-blue-50 text-blue-700",
 REJECTED: "border-red-200 bg-red-50 text-red-700",
 };
 return (
 <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm ${tones[status] || tones.PENDING}`}>
 <AlertTriangle size={17} className="mt-0.5 shrink-0" />
 <div>
 <p className="font-bold">
 {status === "REJECTED" ? "Verification rejected" : "Verification in progress"}
 </p>
 <p className="mt-0.5 opacity-90">{notes}</p>
 </div>
 </div>
 );
}

function MetricChip({ label, value }) {
 return (
 <div className="rounded-2xl bg-slate-50 px-4 py-3.5">
 <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
 <p className="mt-1 font-display text-2xl font-extrabold text-ink">{value}</p>
 </div>
 );
}

function LegendRow({ color, label, value, total }) {
 const pct = total ? Math.round((value / total) * 100) : 0;
 return (
 <div className="flex items-center justify-between gap-3 text-sm">
 <span className="flex items-center gap-2 font-medium text-slate-600">
 <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
 {label}
 </span>
 <span className="flex items-center gap-2">
 <span className="font-bold text-ink">{value}</span>
 <span className="w-9 text-right text-xs text-slate-400">{pct}%</span>
 </span>
 </div>
 );
}

export default function OverviewTab({ overview, loading, profile }) {
 const status = profile?.verificationStatus || "PENDING";

 if (loading) {
 return (
 <div className="space-y-6">
 <Skeleton className="h-16 w-full rounded-2xl" />
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
 {Array.from({ length: 4 }).map((_, i) => (
 <Card key={i} className="p-6">
 <Skeleton className="h-11 w-11 rounded-2xl" />
 <Skeleton className="mt-5 h-8 w-28" />
 <Skeleton className="mt-2 h-4 w-20" />
 </Card>
 ))}
 </div>
 </div>
 );
 }

 if (!overview) return null;

 const b = overview.breakdown || {};
 const totalBookings = Object.values(b).reduce((a, c) => a + c, 0);
 const bookingData = Object.entries(BOOKING_COLORS)
 .map(([key, color]) => ({ key, color, value: b[key] || 0 }))
 .filter((d) => d.value > 0);

 const monthShare = overview.totalRevenue ? Math.round((overview.monthRevenue / overview.totalRevenue) * 100) : 0;

 return (
 <div className="space-y-6">
 <VerificationBanner status={status} />

 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
 <StatCard
 icon={TrendingUp}
 label="Today's Revenue"
 value={fmtINR(overview.todayRevenue)}
 iconTone="bg-mint-50 text-mint-600"
 pill={`${overview.todayBookings} bookings`}
 sub="from bookings starting today"
 />
 <StatCard
 icon={CalendarCheck2}
 label="Total Bookings"
 value={fmtNum(overview.totalBookings)}
 iconTone="bg-brand-50 text-brand-600"
 pill={`${overview.pendingBookings} pending`}
 sub={`${overview.upcomingBookings} upcoming`}
 />
 <StatCard
 icon={Building2}
 label="Active Spaces"
 value={`${fmtNum(overview.activeSpaces)}/${fmtNum(overview.totalSpaces)}`}
 iconTone="bg-ember-50 text-ember-600"
 sub="of your listed spaces live"
 />
 <StatCard
 icon={Wallet}
 label="Wallet Balance"
 value={fmtINR(overview.walletBalance)}
 iconTone="bg-violet-50 text-violet-600"
 sub={`${fmtINR(overview.monthRevenue)} earned this month`}
 />
 </div>

 <div className="grid gap-5 lg:grid-cols-5">
 <Panel title="Revenue overview" subtitle="Today vs this month" icon={TrendingUp} className="lg:col-span-3">
 <div className="flex flex-wrap items-end justify-between gap-4">
 <div>
 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
 Lifetime revenue
 </p>
 <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-ink">
 {fmtINR(overview.totalRevenue)}
 </p>
 </div>
 <div className="text-right">
 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
 This month
 </p>
 <p className="mt-1 font-display text-2xl font-extrabold text-mint-600">
 {fmtINR(overview.monthRevenue)}
 </p>
 </div>
 </div>
 <div className="mt-6">
 <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
 <span>Month contribution</span>
 <span>{monthShare}%</span>
 </div>
 <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
 <div
 className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-500"
 style={{ width: `${Math.min(monthShare, 100)}%` }}
 />
 </div>
 </div>
 <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
 <MetricChip label="Today's bookings" value={fmtNum(overview.todayBookings)} />
 <MetricChip label="Pending" value={fmtNum(overview.pendingBookings)} />
 <MetricChip label="Upcoming" value={fmtNum(overview.upcomingBookings)} />
 <MetricChip label="Reviews" value={fmtNum(overview.reviewsCount)} />
 </div>
 </Panel>

 <Panel title="Bookings by status" subtitle="Across all your spaces" icon={CalendarCheck2} className="lg:col-span-2">
 <div className="flex flex-col items-center gap-6">
 <Donut
 data={bookingData.map((d) => ({ value: d.value, color: d.color }))}
 center={
 <div className="text-center">
 <p className="font-display text-3xl font-extrabold text-ink">{fmtNum(totalBookings)}</p>
 <p className="text-xs text-slate-400">bookings</p>
 </div>
 }
 />
 <div className="w-full space-y-3">
 {bookingData.length ? (
 bookingData.map((d) => (
 <LegendRow key={d.key} color={d.color} label={d.key} value={d.value} total={totalBookings} />
 ))
 ) : (
 <p className="text-center text-sm text-slate-400">No bookings yet.</p>
 )}
 </div>
 </div>
 </Panel>
 </div>

 <div className="grid gap-5 lg:grid-cols-3">
 <Panel title="Recent bookings" subtitle="Latest reservations" icon={CalendarCheck2} className="overflow-hidden lg:col-span-2">
 {overview.recentBookings?.length ? (
 <div className="divide-y divide-slate-50">
 {overview.recentBookings.map((bk) => (
 <div key={bk.id} className="flex items-center gap-4 px-1 py-3.5">
 <Avatar name={bk.user?.fullName} image={bk.user?.profileImage} size="h-10 w-10 text-xs" />
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-bold text-ink">{bk.user?.fullName || "Driver"}</p>
 <p className="truncate text-xs text-slate-500">
 {bk.space?.parkingName || "Parking space"} · {fmtDate(bk.startAt)}
 </p>
 </div>
 <span className="hidden text-sm font-bold text-ink sm:block">{fmtINR(bk.totalAmount)}</span>
 <Badge tone={BOOKING_BADGE[bk.status] || BOOKING_BADGE.PENDING}>{bk.status}</Badge>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-sm text-slate-500">No bookings yet.</p>
 )}
 </Panel>

 <div className="space-y-5">
 <Card className="p-6">
 <div className="flex items-center justify-between">
 <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-500">
 <Star size={20} />
 </span>
 <Badge tone={VERIFICATION_BADGE[status] || VERIFICATION_BADGE.PENDING}>
 <ShieldCheck size={12} /> {status.replace("_", " ")}
 </Badge>
 </div>
 <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink">
 {overview.rating ? `${Number(overview.rating).toFixed(1)}` : "—"}
 <span className="text-base font-medium text-slate-400"> / 5</span>
 </p>
 <p className="mt-1 text-sm text-slate-500">
 from {fmtNum(overview.reviewsCount)} review{overview.reviewsCount === 1 ? "" : "s"}
 </p>
 </Card>

 <Card className="p-6">
 <div className="flex items-center justify-between">
 <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
 <Wallet size={20} />
 </span>
 </div>
 <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink">
 {fmtINR(overview.walletBalance)}
 </p>
 <p className="mt-1 text-sm text-slate-500">Available payout balance</p>
 </Card>
 </div>
 </div>
 </div>
 );
}
