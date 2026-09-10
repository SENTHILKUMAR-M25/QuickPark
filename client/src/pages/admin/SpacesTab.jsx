import { MapPin } from "lucide-react";
import { Card, Table, Pagination, SearchBox, Badge, EmptyState, TableSkeleton, fmtNum, fmtINR } from "./ui";
import { SPACE_BADGE } from "./meta";

const humanLabel = (v = "") => v.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

export default function SpacesTab({ data, query, setQuery, onPage }) {
 const list = data?.spaces || [];
 const loading = !data;
 const total = data?.total || 0;

 return (
 <div className="space-y-5">
 <SearchBox
 value={query.search}
 onChange={(v) => setQuery((q) => ({ ...q, search: v }))}
 placeholder="Search by name, city or address…"
 disabled={loading}
 />

 <Card className="overflow-hidden">
 <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
 <p className="text-sm font-semibold text-slate-600">Listed parking spaces</p>
 <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-600">
 {loading ? "…" : fmtNum(total)}
 </span>
 </div>

 {loading ? (
 <TableSkeleton cols={6} rows={6} />
 ) : list.length === 0 ? (
 <EmptyState
 icon={MapPin}
 title="No parking spaces found"
 description="Try a different search term."
 />
 ) : (
 <>
 <Table head={["Space", "Location", "Provider", "Slots", "Price", "Status"]}>
 {list.map((s) => (
 <tr key={s.id} className="text-sm transition hover:bg-slate-50/60:bg-ink-800/40">
 <td className="px-6 py-4">
 <p className="font-bold text-ink">{s.parkingName}</p>
 <p className="text-xs text-slate-400">{s.id.slice(0, 8)}</p>
 </td>
 <td className="px-6 py-4 text-slate-500">
 <p>{s.city}, {s.state}</p>
 <p className="text-xs">{s.address}</p>
 </td>
 <td className="px-6 py-4 text-slate-500">{s.auth?.fullName || "—"}</td>
 <td className="px-6 py-4 text-slate-500">
 <span className="font-semibold text-ink">{s.availableSlots}</span>
 <span className="text-slate-400">/{s.totalCapacity}</span>
 </td>
 <td className="px-6 py-4 font-bold text-ink">
 {fmtINR(s.pricePerHour)}
 <span className="text-xs font-medium text-slate-400">/hr</span>
 </td>
 <td className="px-6 py-4">
 <Badge tone={SPACE_BADGE[s.status] || SPACE_BADGE.DRAFT}>{humanLabel(s.status)}</Badge>
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
