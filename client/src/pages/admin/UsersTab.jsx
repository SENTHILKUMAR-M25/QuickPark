import { UserX, UserCheck, Users } from "lucide-react";
import { Card, Table, Pagination, SearchBox, Badge, Avatar, EmptyState, TableSkeleton, fmtDate, fmtNum } from "./ui";
import { STATUS_BADGE } from "./meta";

const FILTERS = [
 { value: "", label: "All statuses" },
 { value: "ACTIVE", label: "Active" },
 { value: "BLOCKED", label: "Blocked" },
];

export default function UsersTab({ data, query, setQuery, busyId, onAction, reload, onPage }) {
 const list = data?.users || [];
 const loading = !data;
 const total = data?.total || 0;

 return (
 <div className="space-y-5">
 <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
 <div className="flex-1">
 <SearchBox
 value={query.search}
 onChange={(v) => setQuery((q) => ({ ...q, search: v }))}
 placeholder="Search by name, email or phone…"
 disabled={loading}
 />
 </div>
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
 <p className="text-sm font-semibold text-slate-600">
 Registered accounts
 </p>
 <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">
 {loading ? "…" : fmtNum(total)}
 </span>
 </div>

 {loading ? (
 <TableSkeleton cols={5} rows={6} />
 ) : list.length === 0 ? (
 <EmptyState
 icon={Users}
 title="No users found"
 description="Try a different search term or clear the status filter."
 />
 ) : (
 <>
 <Table head={["User", "Contact", "Joined", "Status", ""]}>
 {list.map((u) => (
 <tr key={u.id} className="text-sm transition hover:bg-slate-50/60:bg-ink-800/40">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <Avatar name={u.fullName} image={u.profileImage} />
 <span className="font-bold text-ink">{u.fullName}</span>
 </div>
 </td>
 <td className="px-6 py-4 text-slate-500">
 <p>{u.email}</p>
 <p className="text-xs">{u.phone || "—"}</p>
 </td>
 <td className="px-6 py-4 text-slate-500">{fmtDate(u.createdAt)}</td>
 <td className="px-6 py-4">
 <Badge tone={STATUS_BADGE[u.accountStatus] || STATUS_BADGE.ACTIVE}>{u.accountStatus}</Badge>
 </td>
 <td className="px-6 py-4 text-right">
 <button
 onClick={() => onAction(u.id, u.accountStatus === "BLOCKED" ? "ACTIVE" : "BLOCKED", reload)}
 disabled={busyId === u.id}
 className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
 u.accountStatus === "BLOCKED"
 ? "bg-mint-50 text-mint-600 hover:bg-mint-100"
 : "bg-red-50 text-red-600 hover:bg-red-100"
 }`}
 >
 {u.accountStatus === "BLOCKED" ? <><UserCheck size={13} /> Activate</> : <><UserX size={13} /> Block</>}
 </button>
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
