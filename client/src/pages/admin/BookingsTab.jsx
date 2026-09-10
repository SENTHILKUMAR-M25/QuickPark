import { CalendarCheck2 } from "lucide-react";
import { Card, Table, Pagination, Badge, Avatar, EmptyState, TableSkeleton, fmtNum, fmtINR, fmtDate } from "./ui";
import { BOOKING_BADGE, PAYMENT_BADGE, humanLabel } from "./meta";

const FILTERS = [
 { value: "", label: "All statuses" },
 { value: "PENDING", label: "Pending" },
 { value: "CONFIRMED", label: "Confirmed" },
 { value: "COMPLETED", label: "Completed" },
 { value: "CANCELLED", label: "Cancelled" },
 { value: "NO_SHOW", label: "No show" },
];

export default function BookingsTab({ data, query, setQuery, onPage }) {
 const list = data?.bookings || [];
 const loading = !data;
 const total = data?.total || 0;

 return (
 <div className="space-y-5">
 <div className="flex justify-end">
 <select
 value={query.status}
 onChange={(e) => setQuery((q) => ({ ...q, status: e.target.value }))}
 disabled={loading}
 className="rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-semibold text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50"
 >
 {FILTERS.map((o) => (
 <option key={o.value} value={o.value}>{o.label}</option>
 ))}
 </select>
 </div>

 <Card className="overflow-hidden">
 <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
 <p className="text-sm font-semibold text-slate-600">Booking history</p>
 <span className="rounded-full bg-ember-50 px-2.5 py-1 text-xs font-bold text-ember-600">
 {loading ? "…" : fmtNum(total)}
 </span>
 </div>

 {loading ? (
 <TableSkeleton cols={6} rows={6} />
 ) : list.length === 0 ? (
 <EmptyState
 icon={CalendarCheck2}
 title="No bookings found"
 description="Try a different status filter."
 />
 ) : (
 <>
 <Table head={["Driver", "Space", "When", "Amount", "Status", "Payment"]}>
 {list.map((bk) => (
 <tr key={bk.id} className="text-sm transition hover:bg-slate-50/60:bg-ink-800/40">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <Avatar name={bk.user?.fullName} />
 <span className="font-bold text-ink">{bk.user?.fullName || "—"}</span>
 </div>
 </td>
 <td className="px-6 py-4 text-slate-500">
 <p>{bk.space?.parkingName || "—"}</p>
 <p className="text-xs">{bk.space?.city || ""}</p>
 </td>
 <td className="px-6 py-4 text-slate-500">
 <p>{fmtDate(bk.startAt)}</p>
 <p className="text-xs">
 {new Date(bk.startAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
 </p>
 </td>
 <td className="px-6 py-4 font-bold text-ink">{fmtINR(bk.totalAmount)}</td>
 <td className="px-6 py-4">
 <Badge tone={BOOKING_BADGE[bk.status] || BOOKING_BADGE.PENDING}>{humanLabel(bk.status)}</Badge>
 </td>
 <td className="px-6 py-4">
 <Badge tone={PAYMENT_BADGE[bk.paymentStatus] || PAYMENT_BADGE.PENDING}>{humanLabel(bk.paymentStatus)}</Badge>
 </td>
 </tr>
 ))}
 </Table>
 <div className="border-t border-slate-100">
 <Pagination
 page={data?.page}
 totalPages={Math.ceil(total / (data?.limit || 20))}
 total={total}
 onPage={onPage}
 loading={loading}
 />
 </div>
 </>
 )}
 </Card>
 </div>
 );
}
