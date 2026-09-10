import { useMemo, useState } from "react";
import { X, CalendarDays, IndianRupee, Star, ListChecks, TrendingUp } from "lucide-react";
import { fmtINR, fmtNum, fmtDate } from "../../../../pages/admin/ui";
import { STATUS_BADGE, DAY_LABEL, PARKING_TYPE_LABEL, humanLabel } from "./meta";

function StatCard({ icon: Icon, label, value, sub, accent = "brand" }) {
  const tones = {
    brand: "from-brand-500 to-brand-700 text-white",
    mint: "from-mint-500 to-emerald-700 text-white",
    ember: "from-ember-500 to-ember-700 text-white",
    ink: "from-slate-700 to-slate-900 text-white",
  };
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
        <span className={`grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br ${tones[accent]} shadow-soft`}>
          <Icon size={15} />
        </span>
      </div>
      <p className="mt-2 font-display text-xl font-bold text-ink">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

export default function ParkingAnalytics({ space, analytics, onClose }) {
  const [metric, setMetric] = useState("bookings");

  const bars = useMemo(() => {
    if (!analytics?.daily?.length) return [];
    const values = analytics.daily.map((d) => d[metric]);
    const max = Math.max(...values, 1);
    return analytics.daily.map((d) => ({
      ...d,
      label: fmtDate(d.date),
      value: d[metric],
      height: Math.round((d[metric] / max) * 100),
    }));
  }, [analytics, metric]);

  const breakdown = analytics?.breakdown || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-ink">{space?.parkingName}</h2>
            <p className="text-xs text-slate-400">
              {PARKING_TYPE_LABEL[space?.parkingType]} · {space?.city}, {space?.state}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {!analytics ? (
            <div className="grid place-items-center py-20 text-sm text-slate-400">Loading analytics…</div>
          ) : (
            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <StatCard icon={TrendingUp} label="This month" value={fmtNum(analytics.month.bookings)} sub="bookings" accent="brand" />
                <StatCard icon={IndianRupee} label="This month" value={fmtINR(analytics.month.revenue)} sub="revenue" accent="mint" />
                <StatCard icon={CalendarDays} label="Lifetime" value={fmtNum(analytics.lifetime.bookings)} sub={`${fmtINR(analytics.lifetime.revenue)} earned`} accent="ink" />
                <StatCard icon={Star} label="Rating" value={analytics.rating != null ? `${Number(analytics.rating).toFixed(1)}★` : "—"} sub={`${analytics.reviewsCount} reviews`} accent="ember" />
                <StatCard icon={IndianRupee} label="Avg / booking" value={analytics.lifetime.bookings ? fmtINR(Math.round(analytics.lifetime.revenue / analytics.lifetime.bookings)) : "—"} sub="lifetime" accent="mint" />
                <StatCard icon={ListChecks} label="Open days" value={space?.availableDays?.length ? space.availableDays.map((d) => DAY_LABEL[d]?.slice(0, 3)).join(", ") : "All days"} sub="availability" accent="brand" />
              </div>

              <div className="rounded-2xl border border-slate-100 p-4 sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-ink">Last 30 days</p>
                  <div className="flex rounded-full bg-slate-100 p-0.5 text-xs font-semibold">
                    {[
                      { id: "bookings", label: "Bookings" },
                      { id: "revenue", label: "Revenue" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMetric(m.id)}
                        className={`rounded-full px-3.5 py-1.5 transition ${
                          metric === m.id ? "bg-white text-brand-700 shadow-soft" : "text-slate-500"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                {bars.length ? (
                  <div className="flex h-40 items-end gap-[3px] overflow-x-auto pb-1">
                    {bars.map((b) => (
                      <div
                        key={b.date}
                        title={`${b.label} — ${metric === "revenue" ? fmtINR(b.value) : `${b.value} booking${b.value === 1 ? "" : "s"}`}`}
                        className="group relative min-w-[10px] flex-1 rounded-t-md transition-colors"
                        style={{ height: `${Math.max(b.height, b.value ? 4 : 2)}%`, backgroundColor: b.value ? "#0891b2" : "#e2e8f0" }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="grid h-40 place-items-center text-sm text-slate-400">No activity in the last 30 days.</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-100 p-4 sm:p-5">
                <p className="mb-3 text-sm font-bold text-ink">Booking status breakdown</p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                  {Object.entries(breakdown).map(([status, count]) => (
                    <div key={status} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_BADGE[status] || STATUS_BADGE.DRAFT}`}>
                        {humanLabel(status)}
                      </span>
                      <p className="mt-1.5 font-display text-lg font-bold text-ink">{fmtNum(count)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
