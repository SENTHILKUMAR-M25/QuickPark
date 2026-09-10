import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Clock,
  SearchX,
  Filter,
  ChevronRight,
  Car,
} from "lucide-react";
import { userService } from "../../services/user.service";
import { extractErrorMessage } from "../../services/api";
import {
  PARKING_TYPE_LABELS,
  VEHICLE_TYPE_LABELS,
  SORT_OPTIONS,
  priceLabel,
} from "../../lib/parking.meta";
import useDebounced from "../../hooks/useDebounced";
import { Card, Badge, Skeleton, fmtINR } from "../admin/ui";

function SpaceCard({ space }) {
  return (
    <Link
      to={`/search/${space.id}`}
      className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative h-44">
        <img
          src={space.coverImage || space.images?.[0]}
          alt={space.parkingName}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          <Badge tone="bg-white/85 text-brand-700 border-white/60 backdrop-blur">
            {PARKING_TYPE_LABELS[space.parkingType] || space.parkingType}
          </Badge>
          {space.averageRating != null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {Number(space.averageRating).toFixed(1)}
            </span>
          )}
        </div>
        {space.availableSlots > 0 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-mint-500 px-2.5 py-1 text-[11px] font-bold text-white">
            {space.availableSlots} slots left
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-base font-bold text-ink group-hover:text-brand-700">
          {space.parkingName}
        </h3>
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-500">
          <MapPin size={13} className="mt-0.5 shrink-0 text-slate-400" />
          <span className="line-clamp-1">
            {[space.area, space.landmark, space.city].filter(Boolean).join(" · ")}
          </span>
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="font-display text-lg font-extrabold text-ink">
              {priceLabel(space)}
            </p>
            {space.pricePerDay != null && (
              <p className="text-[11px] text-slate-400">or {fmtINR(space.pricePerDay)}/day</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            {space.distanceKm != null && <span>{space.distanceKm.toFixed(1)} km</span>}
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
              <ChevronRight size={15} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3.5 w-1/2" />
        <div className="flex items-center justify-between border-t border-slate-50 pt-4">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [parkingType, setParkingType] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("mostBooked");
  const [page, setPage] = useState(1);

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounced(query, 500);
  const debouncedCity = useDebounced(city, 500);

  const params = useMemo(
    () => ({
      page,
      limit: 9,
      sort,
      search: debouncedSearch || undefined,
      city: debouncedCity || undefined,
      parkingType: parkingType || undefined,
      vehicleType: vehicleType || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }),
    [page, sort, debouncedSearch, debouncedCity, parkingType, vehicleType, minPrice, maxPrice]
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    userService
      .listParking(params)
      .then(({ data: res }) => {
        if (alive) setData(res?.data);
      })
      .catch((e) => {
        if (alive) setError(extractErrorMessage(e));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [params]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedCity, parkingType, vehicleType, minPrice, maxPrice, sort]);

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / (data?.limit || 9)));

  const selectCls =
    "rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-sm font-medium text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15";

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-28">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-3xl">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Find your parking spot
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Search by location, filter by price and vehicle, then book in seconds.
            </p>
          </div>

          <Card className="mt-6 p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <MapPin size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search parking name, area or address…"
                  className="w-full rounded-xl border border-slate-100 bg-white py-3 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15"
                />
              </div>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (e.g. Bengaluru)"
                className="rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15 lg:w-56"
              />
              <button
                onClick={() => {
                  setQuery("");
                  setCity("");
                  setParkingType("");
                  setVehicleType("");
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Filter size={15} /> Reset
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <select value={parkingType} onChange={(e) => setParkingType(e.target.value)} className={selectCls}>
                <option value="">All types</option>
                {Object.entries(PARKING_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className={selectCls}>
                <option value="">Any vehicle</option>
                {Object.entries(VEHICLE_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                type="number"
                min="0"
                placeholder="Min ₹/hr"
                className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15"
              />
              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                type="number"
                min="0"
                placeholder="Max ₹/hr"
                className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15"
              />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${selectCls} col-span-2 sm:col-span-1`}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </Card>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {loading ? "Searching…" : `${total} space${total === 1 ? "" : "s"} found`}
            </p>
            {!loading && items.length > 0 && (
              <span className="hidden items-center gap-1.5 text-xs font-semibold text-slate-400 sm:flex">
                <Clock size={13} /> Live availability
              </span>
            )}
          </div>

          {loading ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <Card className="mt-4">
              <div className="flex flex-col items-center px-6 py-16 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400">
                  <SearchX size={26} />
                </span>
                <p className="mt-4 font-display text-base font-bold text-ink">No parking spaces found</p>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Try clearing your filters or searching a different area.
                </p>
              </div>
            </Card>
          ) : (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-3 text-sm font-semibold text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Car size={15} /> Tip: try searching just a city name
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
