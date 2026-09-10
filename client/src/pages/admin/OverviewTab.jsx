import { Users, Building2, Wallet, MapPin, CalendarCheck2, TrendingUp, ShieldCheck } from "lucide-react";
import { Card, StatCard, Panel, Donut, Skeleton, Badge, Avatar, fmtNum, fmtINR, fmtDate } from "./ui";

const BOOKING_COLORS = {
 COMPLETED: "#10b981",
 CONFIRMED: "#2563eb",
 PENDING: "#f59e0b",
 CANCELLED: "#94a3b8",
 NO_SHOW: "#ef4444",
};

const VERIFICATION_TONES = {
 VERIFIED: "bg-mint-50 text-mint-600",
 PENDING: "bg-amber-50 text-amber-600",
 UNDER_REVIEW: "bg-blue-50 text-blue-600",
 REJECTED: "bg-red-50 text-red-600",
};

const STATUS_TONES = {
 ACTIVE: "bg-mint-50 text-mint-600",
 BLOCKED: "bg-red-50 text-red-600",
 DELETED: "bg-slate-100 text-slate-500",
};

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

export default function OverviewTab({ overview, loading }) {
 if (loading) {
 return (
 <div className="mt-8 space-y-8">
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
 {Array.from({ length: 4 }).map((_, i) => (
 <Card key={i} className="p-6">
 <Skeleton className="h-11 w-11 rounded-2xl" />
 <Skeleton className="mt-5 h-8 w-28" />
 <Skeleton className="mt-2 h-4 w-20" />
 </Card>
 ))}
 </div>
 <div className="grid gap-4 lg:grid-cols-5">
 <Card className="p-6 lg:col-span-3">
 <Skeleton className="h-5 w-40" />
 <Skeleton className="mt-6 h-12 w-52" />
 <Skeleton className="mt-4 h-4 w-full" />
 <Skeleton className="mt-2 h-4 w-full" />
 </Card>
 <Card className="p-6 lg:col-span-2">
 <Skeleton className="mx-auto h-40 w-40 rounded-full" />
 </Card>
 </div>
 </div>
 );
 }

 if (!overview) return null;

 const t = overview.totals || {};
 const b = overview.breakdown || {};
 const verifications = b.verifications || {};
 const statuses = b.statuses || {};

 const bookings = b.bookings || {};
 const totalBookings = Object.values(bookings).reduce((a, c) => a + c, 0);
 const bookingData = Object.entries(BOOKING_COLORS)
 .map(([key, color]) => ({ key, color, value: bookings[key] || 0 }))
 .filter((d) => d.value > 0);

 const roleData = [
 { key: "Users", color: "#2563eb", value: b.roles?.USER || 0 },
 { key: "Providers", color: "#10b981", value: b.roles?.PROVIDER || 0 },
 ].filter((d) => d.value > 0);
 const totalRoles = roleData.reduce((a, d) => a + d.value, 0);

 const monthShare = t.revenue ? Math.round((t.monthRevenue / t.revenue) * 100) : 0;

 return (
 <div className="mt-8 space-y-6">
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
 <StatCard
 icon={Users}
 label="Total Users"
 value={fmtNum(t.users)}
 iconTone="bg-brand-50 text-brand-600"
 sub={`${statuses.ACTIVE || 0} active · ${statuses.BLOCKED || 0} blocked`}
 />
 <StatCard
 icon={Building2}
 label="Providers"
 value={fmtNum(t.providers)}
 iconTone="bg-mint-50 text-mint-600"
 sub={`${verifications.VERIFIED || 0} verified · ${verifications.PENDING || 0} pending`}
 />
 <StatCard
 icon={Wallet}
 label="Total Revenue"
 value={fmtINR(t.revenue)}
 iconTone="bg-ember-50 text-ember-600"
 pill={`${monthShare}% this month`}
 sub={`${fmtINR(t.monthRevenue)} this month`}
 />
 <StatCard
 icon={MapPin}
 label="Active Spaces"
 value={fmtNum(t.activeSpaces)}
 iconTone="bg-violet-50 text-violet-600"
 sub={`${fmtNum(t.todayBookings)} bookings today`}
 />
 </div>

 <div className="grid gap-5 lg:grid-cols-5">
 <Panel
 title="Revenue overview"
 subtitle="Lifetime vs this month"
 icon={TrendingUp}
 className="lg:col-span-3"
 >
 <div className="flex flex-wrap items-end justify-between gap-4">
 <div>
 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
 Lifetime revenue
 </p>
 <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-ink">
 {fmtINR(t.revenue)}
 </p>
 </div>
 <div className="text-right">
 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
 This month
 </p>
 <p className="mt-1 font-display text-2xl font-extrabold text-mint-600">
 {fmtINR(t.monthRevenue)}
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
 <MetricChip label="Bookings today" value={fmtNum(t.todayBookings)} />
 <MetricChip label="Active spaces" value={fmtNum(t.activeSpaces)} />
 <MetricChip label="Total bookings" value={fmtNum(t.bookings)} />
 <MetricChip label="Verified providers" value={fmtNum(verifications.VERIFIED || 0)} />
 </div>
 </Panel>

 <Panel
 title="Bookings by status"
 subtitle="Distribution across all bookings"
 icon={CalendarCheck2}
 className="lg:col-span-2"
 >
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

 <div className="grid gap-5 md:grid-cols-3">
 <Panel title="Provider verification" subtitle="Onboarding pipeline" icon={ShieldCheck}>
 <div className="grid grid-cols-2 gap-3">
 {Object.entries(VERIFICATION_TONES).map(([key, tone]) => (
 <div key={key} className={`rounded-2xl px-4 py-3 ${tone}`}>
 <p className="font-display text-xl font-extrabold">{verifications[key] || 0}</p>
 <p className="text-xs font-semibold opacity-80">{key.replace("_", " ")}</p>
 </div>
 ))}
 </div>
 <p className="mt-4 text-sm text-slate-500">
 {(verifications.PENDING || 0) + (verifications.UNDER_REVIEW || 0)} provider
 {(verifications.PENDING || 0) + (verifications.UNDER_REVIEW || 0) === 1 ? "" : "s"} in the review queue.
 </p>
 </Panel>

 <Panel title="Account status" subtitle="Health of all accounts" icon={ShieldCheck}>
 <div className="grid grid-cols-3 gap-3">
 {Object.entries(STATUS_TONES).map(([key, tone]) => (
 <div key={key} className={`rounded-2xl px-4 py-3 text-center ${tone}`}>
 <p className="font-display text-xl font-extrabold">{statuses[key] || 0}</p>
 <p className="text-xs font-semibold opacity-80">{key}</p>
 </div>
 ))}
 </div>
 <p className="mt-4 text-sm text-slate-500">
 {statuses.ACTIVE || 0} active accounts across the marketplace.
 </p>
 </Panel>

 <Panel title="Role distribution" subtitle="Users vs providers" icon={Users}>
 <div className="flex flex-col items-center gap-5">
 <Donut
 data={roleData.map((d) => ({ value: d.value, color: d.color }))}
 center={
 <div className="text-center">
 <p className="font-display text-3xl font-extrabold text-ink">{fmtNum(totalRoles)}</p>
 <p className="text-xs text-slate-400">accounts</p>
 </div>
 }
 />
 <div className="w-full space-y-3">
 {roleData.map((d) => (
 <LegendRow key={d.key} color={d.color} label={d.key} value={d.value} total={totalRoles} />
 ))}
 </div>
 </div>
 </Panel>
 </div>

 <Panel title="Recent signups" subtitle="Latest accounts created" icon={Users} className="overflow-hidden">
 {overview.recentUsers?.length ? (
 <div className="divide-y divide-slate-50">
 {overview.recentUsers.map((u) => (
 <div key={u.id} className="flex items-center gap-4 px-1 py-3.5">
 <Avatar name={u.fullName} image={u.profileImage} size="h-10 w-10 text-xs" />
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-bold text-ink">{u.fullName}</p>
 <p className="truncate text-xs text-slate-500">{u.email}</p>
 </div>
 <Badge
 tone={u.role === "PROVIDER" ? "bg-mint-50 text-mint-600 border-mint-100" : "bg-brand-50 text-brand-600 border-brand-100"}
 >
 {u.role}
 </Badge>
 <span className="hidden w-32 text-right text-xs text-slate-400 sm:block">
 {fmtDate(u.createdAt)}
 </span>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-sm text-slate-500">No signups yet.</p>
 )}
 </Panel>
 </div>
 );
}
