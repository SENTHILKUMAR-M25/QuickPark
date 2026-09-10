import { CalendarCheck2, X } from "lucide-react";
import { Card, Table, Pagination, Badge, EmptyState, TableSkeleton, fmtNum, fmtINR, fmtDate } from "../../admin/ui";
import { BOOKING_BADGE, PAYMENT_BADGE, humanLabel } from "../../admin/meta";

const FILTERS = [
 { value: "", label: "All statuses" },
 { value: "PENDING", label: "Pending" },
 { value: "CONFIRMED", label: "Confirmed" },
 { value: "COMPLETED", label: "Completed" },
 { value: "CANCELLED", label: "Cancelled" },
 { value: "NO_SHOW", label: "No show" },
];

export default function BookingsTab({ data, query, setQuery, onPage, busyId, onCancel }) {
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
 <p className="text-sm font-semibold text-slate-600">Your reservations</p>
 <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">
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
 <Table head={["Space", "Provider", "When", "Amount", "Status", "Payment", ""]}>
 {list.map((bk) => (
 <tr key={bk.id} className="text-sm transition hover:bg-slate-50/60:bg-ink-800/40">
 <td className="px-6 py-4">
 <p className="font-bold text-ink">{bk.space?.parkingName || "—"}</p>
 <p className="text-xs text-slate-400">
 {bk.space?.city || ""}
 {bk.space?.address ? ` · ${bk.space.address}` : ""}
 </p>
 </td>
 <td className="px-6 py-4 text-slate-500">{bk.provider?.fullName || "—"}</td>
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
 <td className="px-6 py-4 text-right">
 {["PENDING", "CONFIRMED"].includes(bk.status) ? (
 <button
 onClick={() => onCancel(bk.id)}
 disabled={busyId === bk.id}
 className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
 >
 <X size={13} /> Cancel
 </button>
 ) : (
 <span className="text-xs text-slate-400">—</span>
 )}
 </td>
 </tr>
 ))}
 </Table>
 <div className="border-t border-slate-100">
 <Pagination
 page={data?.page}
 totalPages={Math.ceil(total / (data?.limit || 10))}
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
