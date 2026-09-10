import { Search, ChevronLeft, ChevronRight, SearchX } from "lucide-react";

// ── Formatters ─────────────────────────────────────────────
export const fmtINR = (n) =>
 new Intl.NumberFormat("en-IN", {
 style: "currency",
 currency: "INR",
 maximumFractionDigits: 0,
 }).format(Number(n || 0));

export const fmtNum = (n) => new Intl.NumberFormat("en-IN").format(Number(n || 0));

export const fmtDate = (d) =>
 new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const fmtDateTime = (d) =>
 new Date(d).toLocaleString("en-IN", {
 day: "numeric",
 month: "short",
 hour: "2-digit",
 minute: "2-digit",
 });

export const initials = (name) =>
 (name || "?")
 .split(" ")
 .filter(Boolean)
 .slice(0, 2)
 .map((p) => p[0])
 .join("")
 .toUpperCase();

// ── Avatar ─────────────────────────────────────────────────
export function Avatar({ name, image, size = "h-9 w-9 text-xs" }) {
 return image ? (
 <img src={image} alt={name} className={`${size} rounded-full object-cover ring-1 ring-slate-100`} />
 ) : (
 <span className={`grid ${size} shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-mint-500 font-bold text-white`}>
 {initials(name)}
 </span>
 );
}

// ── Badge ──────────────────────────────────────────────────
export function Badge({ tone = "bg-slate-100 text-slate-600 border-slate-200", dot, children }) {
 return (
 <span
 className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${tone}`}
 >
 {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
 {children}
 </span>
 );
}

// ── Card / Panel ───────────────────────────────────────────
export function Card({ className = "", children }) {
 return (
 <div
 className={`rounded-3xl border border-slate-100 bg-white shadow-soft ${className}`}
 >
 {children}
 </div>
 );
}

export function Panel({ title, subtitle, icon: Icon, actions, className = "", children }) {
 return (
 <Card className={className}>
 <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
 <div className="flex items-center gap-3">
 {Icon && (
 <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
 <Icon size={18} />
 </span>
 )}
 <div>
 <h3 className="font-display text-sm font-bold text-ink">{title}</h3>
 {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
 </div>
 </div>
 {actions}
 </div>
 <div className="p-6">{children}</div>
 </Card>
 );
}

// ── Stat card ──────────────────────────────────────────────
export function StatCard({ icon: Icon, label, value, accent, iconTone, sub, pill }) {
 return (
 <Card className="p-6">
 <div className="flex items-center justify-between">
 <span className={`grid h-11 w-11 place-items-center rounded-2xl ${iconTone || accent}`}>
 <Icon size={20} />
 </span>
 {pill && (
 <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-500">
 {pill}
 </span>
 )}
 </div>
 <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink">{value}</p>
 <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
 {sub && <p className="mt-2 text-xs text-slate-400">{sub}</p>}
 </Card>
 );
}

// ── Progress ───────────────────────────────────────────────
export function ProgressBar({ label, value, total, tone, showPercent = true }) {
 const pct = total ? Math.round((value / total) * 100) : 0;
 return (
 <div>
 <div className="flex items-center justify-between text-sm">
 <span className="font-medium text-slate-600">{label}</span>
 <span className="flex items-center gap-2">
 <span className="font-bold text-ink">{value}</span>
 {showPercent && <span className="text-xs text-slate-400">{pct}%</span>}
 </span>
 </div>
 <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
 <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
 </div>
 </div>
 );
}

// ── Donut chart ────────────────────────────────────────────
export function Donut({ data = [], size = 168, thickness = 20, center }) {
 const total = data.reduce((s, d) => s + (d.value || 0), 0);
 const radius = (size - thickness) / 2;
 const c = 2 * Math.PI * radius;
 let acc = 0;
 return (
 <div className="relative" style={{ width: size, height: size }}>
 <svg width={size} height={size} className="-rotate-90">
 <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={thickness} className="stroke-slate-100" />
 {total > 0 &&
 data.map((d, i) => {
 const len = (d.value / total) * c;
 const el = (
 <circle
 key={i}
 cx={size / 2}
 cy={size / 2}
 r={radius}
 fill="none"
 strokeWidth={thickness}
 stroke={d.color}
 strokeDasharray={`${len} ${c - len}`}
 strokeDashoffset={-acc}
 />
 );
 acc += len;
 return el;
 })}
 </svg>
 <div className="absolute inset-0 grid place-items-center">{center}</div>
 </div>
 );
}

// ── Skeleton ───────────────────────────────────────────────
export function Skeleton({ className = "" }) {
 return <div className={`animate-pulse rounded-lg bg-slate-100 ${className}`} />;
}

export function TableSkeleton({ cols = 6, rows = 5 }) {
 return (
 <div className="space-y-5 p-6">
 {Array.from({ length: rows }).map((_, i) => (
 <div key={i} className="flex items-center gap-6">
 <Skeleton className="h-9 w-9 rounded-full" />
 {Array.from({ length: cols - 1 }).map((_, j) => (
 <Skeleton key={j} className="h-4 flex-1" />
 ))}
 </div>
 ))}
 </div>
 );
}

// ── Empty state ────────────────────────────────────────────
export function EmptyState({ icon: Icon = SearchX, title = "Nothing here yet", description }) {
 return (
 <div className="flex flex-col items-center px-6 py-16 text-center">
 <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400">
 <Icon size={26} />
 </span>
 <p className="mt-4 font-display text-base font-bold text-ink">{title}</p>
 {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
 </div>
 );
}

// ── Search box ─────────────────────────────────────────────
export function SearchBox({ value, onChange, placeholder, disabled }) {
 return (
 <div className="relative">
 <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 value={value}
 onChange={(e) => onChange(e.target.value)}
 disabled={disabled}
 placeholder={placeholder}
 className="w-full rounded-xl border border-slate-100 bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50"
 />
 </div>
 );
}

// ── Table ──────────────────────────────────────────────────
export function Table({ head, children }) {
 return (
 <div className="overflow-x-auto">
 <table className="w-full min-w-[760px] text-left">
 <thead>
 <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
 {head.map((h) => (
 <th key={h} className="px-6 py-3.5">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">{children}</tbody>
 </table>
 </div>
 );
}

// ── Pagination ─────────────────────────────────────────────
export function Pagination({ page, totalPages, total, onPage, loading }) {
 if (!total) return null;
 const pages = Math.max(totalPages, 1);
 return (
 <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
 <p className="text-sm text-slate-500">
 Showing <span className="font-semibold text-ink">{fmtNum(total)}</span> records
 {pages > 1 && (
 <>
 {" "}· page <span className="font-semibold text-ink">{page}</span> of {fmtNum(pages)}
 </>
 )}
 </p>
 <div className="flex items-center gap-1.5">
 <button
 onClick={() => onPage(page - 1)}
 disabled={page <= 1 || loading}
 aria-label="Previous page"
 className="grid h-9 w-9 place-items-center rounded-xl border border-slate-100 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40:bg-ink-800"
 >
 <ChevronLeft size={16} />
 </button>
 <span className="px-2 text-sm font-semibold text-slate-500">
 {page} / {fmtNum(pages)}
 </span>
 <button
 onClick={() => onPage(page + 1)}
 disabled={page >= pages || loading}
 aria-label="Next page"
 className="grid h-9 w-9 place-items-center rounded-xl border border-slate-100 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40:bg-ink-800"
 >
 <ChevronRight size={16} />
 </button>
 </div>
 </div>
 );
}

// ── Page header ────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
 return (
 <div className="flex flex-wrap items-center justify-between gap-4">
 <div>
 <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
 {title}
 </h1>
 {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
 </div>
 {actions && <div className="flex items-center gap-2">{actions}</div>}
 </div>
 );
}
