import { useState } from "react";
import { Plus, Pencil, Trash2, Power, MapPin, BarChart3, Building2 } from "lucide-react";
import { Card, Pagination, SearchBox, Badge, EmptyState, fmtNum, fmtINR } from "../../../../pages/admin/ui";
import {
  PARKING_TYPES,
  PARKING_TYPE_LABEL,
  VEHICLE_TYPES,
  STATUS_OPTIONS,
  STATUS_BADGE,
  SORT_OPTIONS,
  PRICE_RANGES,
  AMENITY_LABEL,
  humanLabel,
} from "./meta";
import providerService from "../../../../services/provider.service";
import { extractErrorMessage } from "../../../../services/api";
import ParkingForm from "./ParkingForm";
import ParkingAnalytics from "./ParkingAnalytics";
import toast from "react-hot-toast";

const selectCls =
  "rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm font-semibold text-slate-600 outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15";

export default function MyParkingTab({ data, query, setQuery, onPage, busyId, onSetStatus, onDelete, onChanged }) {
  const list = data?.items || [];
  const loading = !data;
  const total = data?.total || 0;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [analyticsSpace, setAnalyticsSpace] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  const patchQuery = (patch) => setQuery((q) => ({ ...q, ...patch, page: 1 }));

  const startAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const startEdit = (space) => {
    setEditing(space);
    setFormOpen(true);
  };

  const openAnalytics = async (space) => {
    setAnalyticsData(null);
    setAnalyticsSpace(space);
    try {
      const { data: res } = await providerService.getParkingAnalytics(space.id);
      setAnalyticsData(res?.data);
    } catch (e) {
      toast.error(extractErrorMessage(e));
    }
  };

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <SearchBox
              value={query.search}
              onChange={(v) => patchQuery({ search: v })}
              placeholder="Search by name, city or address…"
              disabled={loading}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className={selectCls} value={query.parkingType} onChange={(e) => patchQuery({ parkingType: e.target.value })}>
              <option value="">All types</option>
              {PARKING_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select className={selectCls} value={query.status} onChange={(e) => patchQuery({ status: e.target.value })}>
              <option value="">All status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <select className={selectCls} value={query.vehicleType} onChange={(e) => patchQuery({ vehicleType: e.target.value })}>
              <option value="">All vehicles</option>
              {VEHICLE_TYPES.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
            <select className={selectCls} value={query.price} onChange={(e) => patchQuery({ price: e.target.value })}>
              {PRICE_RANGES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <select className={selectCls} value={query.sort} onChange={(e) => patchQuery({ sort: e.target.value })}>
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={startAdd}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-50"
            >
              <Plus size={16} /> Add parking
            </button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl border border-slate-100 bg-slate-100/60" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <Card>
          <EmptyState
            icon={Building2}
            title="No parking spaces yet"
            description={
              query.search
                ? "Try a different search or clear the filters."
                : "Add your first parking space to start accepting bookings."
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((s) => (
            <article
              key={s.id}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow-mint"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={s.coverImage || s.images?.[0]}
                  alt={s.parkingName}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3">
                  <Badge tone={STATUS_BADGE[s.status] || STATUS_BADGE.DRAFT}>{humanLabel(s.status)}</Badge>
                </div>
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-600 backdrop-blur">
                  {PARKING_TYPE_LABEL[s.parkingType] || humanLabel(s.parkingType)}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-display text-base font-bold leading-tight text-ink">{s.parkingName}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <MapPin size={12} className="shrink-0" />
                  <span className="truncate">
                    {s.city}, {s.state}
                    {s.area ? ` · ${s.area}` : ""}
                  </span>
                </p>

                {s.amenities?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                        {AMENITY_LABEL[a] || humanLabel(a)}
                      </span>
                    ))}
                    {s.amenities.length > 3 && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                        +{s.amenities.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-center">
                  <div>
                    <p className="font-display text-sm font-bold text-ink">{fmtINR(s.pricePerHour)}</p>
                    <p className="text-[10px] text-slate-400">per hour</p>
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-ink">
                      {s.availableSlots}/{s.totalCapacity}
                    </p>
                    <p className="text-[10px] text-slate-400">slots free</p>
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-ink">
                      {s.averageRating ? Number(s.averageRating).toFixed(1) : "—"}
                    </p>
                    <p className="text-[10px] text-slate-400">rating</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{fmtNum(s.liveBookings || 0)} bookings</span>
                  <span className="font-semibold text-mint-600">{fmtINR(s.monthlyRevenue || 0)} this month</span>
                </div>
              </div>

              <div className="flex items-center gap-1 border-t border-slate-100 p-2.5">
                <button
                  type="button"
                  onClick={() => startEdit(s)}
                  disabled={busyId === s.id}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => openAnalytics(s)}
                  disabled={busyId === s.id}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-mint-50 hover:text-mint-700 disabled:opacity-50"
                >
                  <BarChart3 size={13} /> Analytics
                </button>
                <span className="flex-1" />
                <button
                  type="button"
                  onClick={() => onSetStatus(s.id, s.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                  disabled={busyId === s.id}
                  title={s.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-ink disabled:opacity-50"
                >
                  <Power size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(s.id)}
                  disabled={busyId === s.id}
                  title="Delete"
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {total > (data?.limit || 9) && (
        <Card>
          <Pagination
            page={data?.page}
            totalPages={Math.ceil(total / (data?.limit || 9))}
            total={total}
            onPage={onPage}
            loading={loading}
          />
        </Card>
      )}

      {formOpen && (
        <ParkingForm
          space={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            onChanged?.();
          }}
        />
      )}

      {analyticsSpace && (
        <ParkingAnalytics space={analyticsSpace} analytics={analyticsData} onClose={() => setAnalyticsSpace(null)} />
      )}
    </div>
  );
}
