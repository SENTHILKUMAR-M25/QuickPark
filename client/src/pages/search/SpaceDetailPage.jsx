import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Heart,
  ShieldCheck,
  Wallet,
  Car,
  CheckCircle2,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { userService } from "../../services/user.service";
import { extractErrorMessage } from "../../services/api";
import {
  PARKING_TYPE_LABELS,
  VEHICLE_TYPE_LABELS,
  SURFACE_LABELS,
  AMENITY_LABELS,
  DAY_LABELS,
  priceLabel,
  parseSlots,
  estimateAmount,
} from "../../lib/parking.meta";
import { Card, Badge, Skeleton, Avatar, fmtINR, fmtDate } from "../admin/ui";
import { BOOKING_BADGE, PAYMENT_BADGE, humanLabel } from "../admin/meta";

function pad(n) {
  return String(n).padStart(2, "0");
}

function toLocalInputValue(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultStart() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return d;
}

function SkeletonBlock() {
  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-28">
      <div className="container-x">
        <Skeleton className="h-5 w-40" />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Skeleton className="h-80 w-full rounded-3xl" />
            <Skeleton className="h-40 w-full rounded-3xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export default function SpaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageIdx, setImageIdx] = useState(0);

  const [vehicles, setVehicles] = useState([]);
  const [wallet, setWallet] = useState(null);

  const [start, setStart] = useState(toLocalInputValue(defaultStart()));
  const [end, setEnd] = useState(toLocalInputValue(new Date(defaultStart().getTime() + 2 * 3600000)));
  const [vehicleId, setVehicleId] = useState("");
  const [slotLabel, setSlotLabel] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("WALLET");
  const [bookingError, setBookingError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([userService.getParking(id), userService.listVehicles(), userService.getWallet()])
      .then(([sp, veh, wal]) => {
        setSpace(sp?.data?.data);
        setVehicles(veh?.data?.data || []);
        setWallet(wal?.data?.data || { balance: 0 });
        if (veh?.data?.data?.[0]) setVehicleId(veh.data.data[0].id);
      })
      .catch((e) => setError(extractErrorMessage(e, "Could not load this space.")))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const images = useMemo(
    () => [space?.coverImage, ...(space?.images || [])].filter(Boolean),
    [space]
  );

  const slots = useMemo(() => (space ? parseSlots(space.slotNumbering) : []), [space]);

  const amount = useMemo(
    () => estimateAmount(space, start, end),
    [space, start, end]
  );

  const durationHours = useMemo(() => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (!Number.isFinite(s) || !Number.isFinite(e)) return 0;
    return Math.round((((e - s) / 3600000) * 100) / 100);
  }, [start, end]);

  async function toggleFavorite() {
    if (!space) return;
    try {
      if (space.isFavorite) {
        await userService.removeFavorite(space.id);
        toast.success("Removed from favorites.");
        setSpace((s) => ({ ...s, isFavorite: false, favoritesCount: Math.max(0, (s.favoritesCount || 1) - 1) }));
      } else {
        await userService.addFavorite(space.id);
        toast.success("Saved to favorites.");
        setSpace((s) => ({ ...s, isFavorite: true, favoritesCount: (s.favoritesCount || 0) + 1 }));
      }
    } catch (e) {
      toast.error(extractErrorMessage(e));
    }
  }

  async function handleBook() {
    setBusy(true);
    setBookingError("");
    try {
      const { data } = await userService.createBooking({
        spaceId: space.id,
        startAt: new Date(start).toISOString(),
        endAt: new Date(end).toISOString(),
        vehicleId: vehicleId || undefined,
        slotLabel: slotLabel || undefined,
        paymentMethod,
      });
      setSuccess(data?.data);
    } catch (e) {
      setBookingError(extractErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <SkeletonBlock />;

  if (error || !space) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfcfe] px-6 pt-20">
        <Card className="max-w-md p-8 text-center">
          <p className="text-sm text-slate-500">{error || "Parking space not found."}</p>
          <Link to="/search" className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            <ArrowLeft size={15} /> Back to search
          </Link>
        </Card>
      </div>
    );
  }

  const rules = space.rules || {};
  const activeImg = images[Math.min(imageIdx, images.length - 1)];

  return (
    <div className="min-h-screen bg-[#fbfcfe] pt-28">
      <div className="container-x">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-ink"
        >
          <ArrowLeft size={16} /> Back to results
        </button>

        <motion.div
          key={space.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 grid gap-6 lg:grid-cols-3"
        >
          {/* ── Left column: media + details ── */}
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft">
              <div className="relative aspect-[16/9]">
                <img src={activeImg} alt={space.parkingName} className="h-full w-full object-cover" />
                <button
                  onClick={toggleFavorite}
                  className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full shadow-soft backdrop-blur transition ${
                    space.isFavorite ? "bg-red-500 text-white" : "bg-white/90 text-slate-500 hover:text-red-500"
                  }`}
                  aria-label="Toggle favorite"
                >
                  <Heart size={18} className={space.isFavorite ? "fill-white" : ""} />
                </button>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIdx(i)}
                      className={`h-16 w-24 overflow-hidden rounded-xl border-2 transition ${
                        i === imageIdx ? "border-brand-500" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="bg-brand-50 text-brand-600 border-brand-100">
                    {PARKING_TYPE_LABELS[space.parkingType] || space.parkingType}
                  </Badge>
                  <Badge tone="bg-slate-50 text-slate-600 border-slate-200">
                    {SURFACE_LABELS[space.surfaceType] || space.surfaceType}
                  </Badge>
                </div>
                <h1 className="mt-2.5 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                  {space.parkingName}
                </h1>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin size={15} className="text-slate-400" />
                  {[space.address, space.area, space.landmark, space.city, space.state, space.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-soft">
                <span className="flex items-center gap-1 font-display text-lg font-extrabold text-ink">
                  <Star size={17} className="fill-amber-400 text-amber-400" />
                  {space.rating != null ? Number(space.rating).toFixed(1) : "—"}
                </span>
                <div className="text-left text-xs text-slate-500">
                  <p className="font-semibold text-ink">{space.reviewsCount || 0} reviews</p>
                  <p>{space.liveBookings || 0} active bookings</p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Card className="p-5">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                  <Clock size={15} className="text-brand-500" /> Operating hours
                </h3>
                <p className="mt-3 text-sm font-semibold text-ink">
                  {space.open24Hours ? "Open 24 hours" : `${space.openTime} – ${space.closeTime}`}
                </p>
                {space.availableDays?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {space.availableDays.map((d) => (
                      <span key={d} className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                        {DAY_LABELS[d] || d}
                      </span>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-5">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                  <Car size={15} className="text-brand-500" /> Vehicles allowed
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(space.vehicleTypes?.length ? space.vehicleTypes : ["CAR"]).map((v) => (
                    <span key={v} className="rounded-md bg-mint-50 px-2 py-0.5 text-[11px] font-bold text-mint-600">
                      {VEHICLE_TYPE_LABELS[v] || v}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  {space.availableSlots} of {space.totalCapacity} slots available
                </p>
              </Card>
            </div>

            {space.amenities?.length > 0 && (
              <Card className="p-5">
                <h3 className="font-display text-sm font-bold text-ink">Amenities</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {space.amenities.map((a) => (
                    <span key={a} className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      <ShieldCheck size={13} className="text-mint-500" />
                      {AMENITY_LABELS[a] || a}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {space.description && (
              <Card className="p-5">
                <h3 className="font-display text-sm font-bold text-ink">About this space</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{space.description}</p>
              </Card>
            )}

            {Object.keys(rules).length > 0 && (
              <Card className="p-5">
                <h3 className="font-display text-sm font-bold text-ink">Parking rules</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {[
                    rules.maxHeight ? `Max vehicle height: ${rules.maxHeight}` : null,
                    rules.maxWeight ? `Max vehicle weight: ${rules.maxWeight}` : null,
                    rules.noOvernight ? "Overnight parking not allowed" : null,
                    rules.helmetRequired ? "Helmet required" : null,
                    rules.noHeavyVehicles ? "Heavy vehicles not allowed" : null,
                    ...(Array.isArray(rules.customRules) ? rules.customRules : []),
                  ]
                    .filter(Boolean)
                    .map((rule, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-brand-500" />
                        {rule}
                      </li>
                    ))}
                </ul>
              </Card>
            )}

            {space.reviews?.length > 0 && (
              <Card className="overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="font-display text-sm font-bold text-ink">Recent reviews</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {space.reviews.map((rev) => (
                    <div key={rev.id} className="flex items-start gap-3 px-6 py-4">
                      <Avatar name={rev.user?.fullName} image={rev.user?.profileImage} size="h-9 w-9 text-xs" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-ink">{rev.user?.fullName || "Driver"}</p>
                          <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            {rev.rating}
                          </span>
                        </div>
                        {rev.comment && <p className="mt-1 text-sm text-slate-600">{rev.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* ── Right column: booking panel ── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {success ? (
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-mint-500 to-mint-600 px-6 py-8 text-center text-white">
                  <CheckCircle2 size={40} className="mx-auto" />
                  <h2 className="mt-3 font-display text-xl font-extrabold">Booking confirmed!</h2>
                  <p className="mt-1 text-sm text-white/80">Your slot is reserved.</p>
                </div>
                <div className="space-y-3 p-6">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-500">Reference</span>
                    <span className="font-mono font-bold text-ink">{success.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-500">Space</span>
                    <span className="font-semibold text-ink">{space.parkingName}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-500">When</span>
                    <span className="font-semibold text-ink">
                      {fmtDate(success.startAt)} · {new Date(success.startAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-500">Amount</span>
                    <span className="font-bold text-ink">{fmtINR(success.totalAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-500">Payment</span>
                    <Badge tone={PAYMENT_BADGE[success.paymentStatus] || PAYMENT_BADGE.PENDING}>
                      {humanLabel(success.paymentStatus)}
                    </Badge>
                  </div>
                  <div className="pt-2">
                    <Badge tone={BOOKING_BADGE[success.status] || BOOKING_BADGE.PENDING} dot="bg-amber-400">
                      {humanLabel(success.status)}
                    </Badge>
                    <p className="mt-2 text-xs text-slate-400">
                      The provider will confirm shortly. Track it from your dashboard.
                    </p>
                  </div>
                  <div className="grid gap-2 pt-2">
                    <button
                      onClick={() => navigate("/user/dashboard", { state: { tab: "bookings" } })}
                      className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
                    >
                      View my bookings
                    </button>
                    <button
                      onClick={() => {
                        setSuccess(null);
                        setStart(toLocalInputValue(defaultStart()));
                        setEnd(toLocalInputValue(new Date(defaultStart().getTime() + 2 * 3600000)));
                        load();
                      }}
                      className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Book another spot
                    </button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <h3 className="font-display text-base font-bold text-ink">Book this space</h3>
                    <p className="text-xs text-slate-400">{priceLabel(space)} base rate</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      space.availableSlots > 0 ? "bg-mint-50 text-mint-600" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {space.availableSlots > 0 ? `${space.availableSlots} slots free` : "Sold out"}
                  </span>
                </div>

                <div className="space-y-4 p-6">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs font-semibold text-slate-500">Start</span>
                      <input
                        type="datetime-local"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-slate-500">End</span>
                      <input
                        type="datetime-local"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Car size={13} /> Vehicle
                    </span>
                    <select
                      value={vehicleId}
                      onChange={(e) => setVehicleId(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15"
                    >
                      <option value="">Walk-in / no vehicle</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.make} {v.model} · {v.regNumber}
                        </option>
                      ))}
                    </select>
                    {vehicles.length === 0 && (
                      <Link to="/user/dashboard" className="mt-1.5 block text-xs font-semibold text-brand-600 hover:underline">
                        No vehicles yet — add one in your dashboard
                      </Link>
                    )}
                  </label>

                  {slots.length > 0 && (
                    <label className="block">
                      <span className="text-xs font-semibold text-slate-500">Preferred slot</span>
                      <select
                        value={slotLabel}
                        onChange={(e) => setSlotLabel(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15"
                      >
                        <option value="">Any available slot</option>
                        {slots.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  )}

                  <div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Wallet size={13} /> Payment method
                    </span>
                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("WALLET")}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                          paymentMethod === "WALLET"
                            ? "border-brand-500 bg-brand-50 text-brand-700"
                            : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                        }`}
                      >
                        Pay from wallet
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("PAY_AT_SPOT")}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                          paymentMethod === "PAY_AT_SPOT"
                            ? "border-brand-500 bg-brand-50 text-brand-700"
                            : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                        }`}
                      >
                        Pay at spot
                      </button>
                    </div>
                    {paymentMethod === "WALLET" && (
                      <p className="mt-1.5 text-xs text-slate-400">
                        Wallet balance:{" "}
                        <span className="font-bold text-ink">{fmtINR(wallet?.balance)}</span>
                        {wallet?.balance != null && Number(wallet.balance) < amount && (
                          <span className="ml-1 text-red-500">— insufficient balance</span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Duration</span>
                      <span className="font-semibold text-ink">{durationHours} hr{durationHours === 1 ? "" : "s"}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                      <span className="text-sm font-bold text-ink">Total</span>
                      <span className="font-display text-2xl font-extrabold text-ink">{fmtINR(amount)}</span>
                    </div>
                  </div>

                  {bookingError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {bookingError}
                    </div>
                  )}

                  <button
                    onClick={handleBook}
                    disabled={busy || space.availableSlots < 1 || amount <= 0}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:shadow-[0_0_0_1px_rgba(37,99,235,0.12),0_24px_60px_-12px_rgba(37,99,235,0.5)] disabled:opacity-50"
                  >
                    {busy ? "Booking…" : "Confirm booking"} <ChevronRight size={16} />
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                    <ShieldCheck size={13} className="text-mint-500" />
                    Free cancellation before confirmation · Wallet refunds are instant
                  </p>
                </div>
              </Card>
            )}

            {space.provider && (
              <Card className="mt-5 p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={space.provider.fullName} image={space.provider.profileImage} size="h-10 w-10 text-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-sm font-bold text-ink">
                      {space.provider.provider?.businessName || space.provider.fullName}
                      {space.provider.provider?.verificationStatus === "VERIFIED" && (
                        <BadgeCheck size={14} className="text-brand-500" />
                      )}
                    </p>
                    <p className="truncate text-xs text-slate-400">{space.provider.fullName}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {space.averageRating != null ? Number(space.averageRating).toFixed(1) : "New"}
                  </span>
                </div>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
