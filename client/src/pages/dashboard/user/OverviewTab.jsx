import { CalendarCheck2, CalendarClock, CheckCircle2, Heart, Car, MapPin, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, StatCard, Panel, Donut, Skeleton, Badge, fmtNum, fmtINR, fmtDate } from "../../admin/ui";
import { BOOKING_BADGE } from "../../admin/meta";

const BOOKING_COLORS = {
 COMPLETED: "#10b981",
 CONFIRMED: "#2563eb",
 PENDING: "#f59e0b",
 CANCELLED: "#94a3b8",
 NO_SHOW: "#ef4444",
};

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

function QuickLink({ icon: Icon, label, hint, onClick }) {
 return (
 <button
 type="button"
 onClick={onClick}
 className="group rounded-3xl border border-slate-100 bg-white p-5 text-left shadow-soft transition hover:-translate-y-0.5"
 >
 <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-600">
 <Icon size={18} />
 </span>
 <p className="mt-4 text-sm font-bold text-ink">{label}</p>
 <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
 </button>
 );
}

export default function OverviewTab({ overview, loading, onNavigate }) {
 if (loading) {
 return (
 <div className="space-y-6">
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

 return (
 <div className="space-y-6">
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
 <StatCard
 icon={CalendarCheck2}
 label="Total Bookings"
 value={fmtNum(overview.totalBookings)}
 iconTone="bg-brand-50 text-brand-600"
 sub="all time"
 />
 <StatCard
 icon={CalendarClock}
 label="Upcoming"
 value={fmtNum(overview.upcomingBookings)}
 iconTone="bg-amber-50 text-amber-600"
 sub="pending & confirmed"
 />
 <StatCard
 icon={CheckCircle2}
 label="Completed"
 value={fmtNum(overview.completedBookings)}
 iconTone="bg-mint-50 text-mint-600"
 sub={`${fmtNum(overview.cancelledBookings)} cancelled`}
 />
 <StatCard
 icon={Heart}
 label="Saved Spaces"
 value={fmtNum(overview.favoritesCount)}
 iconTone="bg-ember-50 text-ember-600"
 sub={`${fmtNum(overview.vehiclesCount)} vehicles registered`}
 />
 </div>

 <div className="grid gap-5 lg:grid-cols-3">
 <Panel title="Bookings by status" subtitle="Your reservation history" icon={CalendarCheck2} className="lg:col-span-1">
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

 <Panel title="Recent bookings" subtitle="Your latest reservations" icon={CalendarCheck2} className="overflow-hidden lg:col-span-2">
 {overview.recentBookings?.length ? (
 <div className="divide-y divide-slate-50">
 {overview.recentBookings.map((bk) => (
 <div key={bk.id} className="flex items-center gap-4 px-1 py-3.5">
 <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
 <MapPin size={17} />
 </span>
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-bold text-ink">{bk.space?.parkingName || "Parking space"}</p>
 <p className="truncate text-xs text-slate-500">
 {bk.space?.city || ""} · {fmtDate(bk.startAt)}
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
 </div>

 <div>
 <h3 className="mb-4 font-display text-base font-bold text-ink">Quick actions</h3>
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <Link to="/search" className="group rounded-3xl border border-slate-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5">
 <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600">
 <MapPin size={18} />
 </span>
 <p className="mt-4 text-sm font-bold text-ink">Find Parking</p>
 <p className="mt-0.5 text-xs text-slate-500">Search spots near you</p>
 </Link>
 <QuickLink icon={CalendarCheck2} label="My Bookings" hint="Upcoming & past trips" onClick={() => onNavigate("bookings")} />
 <QuickLink icon={Car} label="My Vehicles" hint="Manage registered cars" onClick={() => onNavigate("vehicles")} />
 <QuickLink icon={UserIcon} label="Profile" hint="Edit your details" onClick={() => onNavigate("profile")} />
 </div>
 </div>
 </div>
 );
}
