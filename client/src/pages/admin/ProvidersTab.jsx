import { Check, X, Eye, Clock, Building2 } from "lucide-react";
import { Card, Table, Pagination, SearchBox, Badge, Avatar, EmptyState, TableSkeleton, fmtNum, fmtINR } from "./ui";
import { VERIFICATION_BADGE, humanLabel } from "./meta";

const FILTERS = [
 { value: "", label: "All statuses" },
 { value: "PENDING", label: "Pending" },
 { value: "UNDER_REVIEW", label: "Under review" },
 { value: "VERIFIED", label: "Verified" },
 { value: "REJECTED", label: "Rejected" },
];

export default function ProvidersTab({ data, query, setQuery, busyId, onVerify, onPage }) {
 const list = data?.providers || [];
 const loading = !data;
 const total = data?.total || 0;

 return (
 <div className="space-y-5">
 <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
 <div className="flex-1">
 <SearchBox
 value={query.search}
 onChange={(v) => setQuery((q) => ({ ...q, search: v }))}
 placeholder="Search providers…"
 disabled={loading}
 />
 </div>
 <select
 value={query.verification}
 onChange={(e) => setQuery((q) => ({ ...q, verification: e.target.value }))}
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
 <p className="text-sm font-semibold text-slate-600">Business verification queue</p>
 <span className="rounded-full bg-mint-50 px-2.5 py-1 text-xs font-bold text-mint-600">
 {loading ? "…" : fmtNum(total)}
 </span>
 </div>

 {loading ? (
 <TableSkeleton cols={5} rows={6} />
 ) : list.length === 0 ? (
 <EmptyState
 icon={Building2}
 title="No providers found"
 description="Try a different search term or clear the verification filter."
 />
 ) : (
 <>
 <Table head={["Business", "Owner", "Type", "Verification", "Actions"]}>
 {list.map((p) => (
 <tr key={p.id} className="text-sm transition hover:bg-slate-50/60:bg-ink-800/40">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <Avatar name={p.profile?.businessName || p.fullName} image={p.profileImage} />
 <div>
 <p className="font-bold text-ink">{p.profile?.businessName || "—"}</p>
 <p className="text-xs text-slate-400">
 {fmtINR(p.profile?.totalRevenue || 0)} revenue · ★ {(p.profile?.rating || 0).toFixed(1)}
 </p>
 </div>
 </div>
 </td>
 <td className="px-6 py-4 text-slate-500">
 <p>{p.fullName}</p>
 <p className="text-xs">{p.email}</p>
 </td>
 <td className="px-6 py-4">
 <span className="text-slate-500">{humanLabel(p.profile?.providerType)}</span>
 </td>
 <td className="px-6 py-4">
 <Badge tone={VERIFICATION_BADGE[p.profile?.verificationStatus] || VERIFICATION_BADGE.PENDING}>
 {humanLabel(p.profile?.verificationStatus)}
 </Badge>
 </td>
 <td className="px-6 py-4">
 <div className="flex flex-wrap items-center gap-2">
 {p.profile?.verificationStatus !== "VERIFIED" && (
 <button
 onClick={() => onVerify(p.id, "VERIFIED")}
 disabled={busyId === p.id}
 className="inline-flex items-center gap-1 rounded-full bg-mint-50 px-3 py-1.5 text-xs font-bold text-mint-600 transition hover:bg-mint-100 disabled:opacity-50"
 >
 <Check size={13} /> Approve
 </button>
 )}
 {p.profile?.verificationStatus !== "REJECTED" && (
 <button
 onClick={() => onVerify(p.id, "REJECTED")}
 disabled={busyId === p.id}
 className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
 >
 <X size={13} /> Reject
 </button>
 )}
 {p.profile?.verificationStatus !== "UNDER_REVIEW" && (
 <button
 onClick={() => onVerify(p.id, "UNDER_REVIEW")}
 disabled={busyId === p.id}
 className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
 >
 <Eye size={13} /> Review
 </button>
 )}
 {p.profile?.verificationStatus !== "PENDING" && (
 <button
 onClick={() => onVerify(p.id, "PENDING")}
 disabled={busyId === p.id}
 className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
 >
 <Clock size={13} /> Reset
 </button>
 )}
 </div>
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
