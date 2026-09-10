import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MapPin, Star, Heart, SearchX, Trash2, ChevronRight } from "lucide-react";
import { userService } from "../../services/user.service";
import { extractErrorMessage } from "../../services/api";
import { PARKING_TYPE_LABELS, priceLabel } from "../../lib/parking.meta";
import { Card, Badge, Skeleton } from "../admin/ui";

export default function FavoritesPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    userService
      .listFavorites({ limit: 50 })
      .then(({ data: res }) => setData(res?.data))
      .catch((e) => setError(extractErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRemove(id) {
    setBusyId(id);
    try {
      await userService.removeFavorite(id);
      toast.success("Removed from favorites.");
      load();
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  }

  const items = data?.items || [];

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-28">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ember-50 text-ember-600">
              <Heart size={20} />
            </span>
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Saved parking
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                {loading ? "Loading…" : `${data?.total || 0} saved space${(data?.total || 0) === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft">
                  <Skeleton className="h-44 w-full rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-3.5 w-1/2" />
                    <Skeleton className="h-7 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <Card className="mt-6">
              <div className="flex flex-col items-center px-6 py-16 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400">
                  <SearchX size={26} />
                </span>
                <p className="mt-4 font-display text-base font-bold text-ink">No saved spaces yet</p>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Tap the heart on any parking space to save it here for quick booking.
                </p>
                <Link
                  to="/search"
                  className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800"
                >
                  Find parking
                </Link>
              </div>
            </Card>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((space) => (
                <div
                  key={space.id}
                  className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <Link to={`/search/${space.id}`} className="relative block h-44">
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
                  </Link>
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
                      <p className="font-display text-lg font-extrabold text-ink">{priceLabel(space)}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemove(space.id)}
                          disabled={busyId === space.id}
                          title="Remove from favorites"
                          className="grid h-8 w-8 place-items-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                        <Link
                          to={`/search/${space.id}`}
                          className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white"
                        >
                          <ChevronRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
