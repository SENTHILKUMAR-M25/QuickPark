import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
 LayoutDashboard,
 Building2,
 CalendarCheck2,
 Wallet,
 ShieldCheck,
 LogOut,
 Menu,
 X,
 RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { providerService } from "../../services/provider.service";
import { extractErrorMessage } from "../../services/api";
import AuthLoader from "../../components/AuthLoader";
import useDebounced from "../../hooks/useDebounced";
import { Badge } from "../admin/ui";
import { VERIFICATION_BADGE } from "../admin/meta";
import OverviewTab from "./provider/OverviewTab";
import MyParkingTab from "./provider/parking/MyParkingTab";
import BookingsTab from "./provider/BookingsTab";
import WalletTab from "./provider/WalletTab";
import VerificationTab from "./provider/VerificationTab";

const TABS = [
 { id: "overview", label: "Overview", icon: LayoutDashboard },
 { id: "parking", label: "My Parking", icon: Building2 },
 { id: "bookings", label: "Bookings", icon: CalendarCheck2 },
 { id: "wallet", label: "Wallet", icon: Wallet },
 { id: "verification", label: "Verification", icon: ShieldCheck },
];

export default function ProviderDashboard() {
 const { loading, isProvider, user, updateUser, logout } = useAuth();
 const navigate = useNavigate();

 const [tab, setTab] = useState("overview");
 const [navOpen, setNavOpen] = useState(false);

  const [dash, setDash] = useState(null);
  const [dashError, setDashError] = useState("");
  const [dashLoading, setDashLoading] = useState(true);

  const [parking, setParking] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);

  const [parkingQuery, setParkingQuery] = useState({
    search: "",
    parkingType: "",
    status: "",
    vehicleType: "",
    price: "",
    sort: "",
    page: 1,
  });
  const [bookingQuery, setBookingQuery] = useState({ status: "" });

 const [busyId, setBusyId] = useState(null);
 const [formBusy, setFormBusy] = useState(false);
 const [uploading, setUploading] = useState(false);

  const loadDash = useCallback(() => {
    setDashLoading(true);
    setDashError("");
    providerService
      .getDashboard()
      .then(({ data }) => setDash(data?.data))
      .catch((e) => setDashError(extractErrorMessage(e, "Could not load dashboard.")))
      .finally(() => setDashLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && isProvider) loadDash();
  }, [loading, isProvider, loadDash]);

 const loadParking = useCallback(
 (params) => {
 const [minPrice, maxPrice] = (params.price || "")
 .split("-")
 .map((x) => (x === "" ? undefined : Number(x)));
 return providerService
 .listParking({
 page: params.page || 1,
 limit: 9,
 search: params.search || undefined,
 parkingType: params.parkingType || undefined,
 status: params.status || undefined,
 vehicleType: params.vehicleType || undefined,
 minPrice: minPrice || undefined,
 maxPrice: maxPrice || undefined,
 sort: params.sort || undefined,
 })
 .then(({ data }) => setParking(data?.data));
 },
 []
 );

 const loadBookings = useCallback(
 (params) => providerService.listBookings(params).then(({ data }) => setBookings(data?.data)),
 []
 );

 const loadWallet = useCallback(() => {
 setWalletLoading(true);
 providerService
 .getWallet()
 .then(({ data }) => setWallet(data?.data))
 .catch((e) => toast.error(extractErrorMessage(e)))
 .finally(() => setWalletLoading(false));
 }, []);

 const fetchList = useCallback(
 (tabName, params) => {
 const list = { parking: loadParking, bookings: loadBookings }[tabName];
 if (!list) return;
 list(params).catch((e) => toast.error(extractErrorMessage(e)));
 },
 [loadParking, loadBookings]
 );

 const debouncedParkingQuery = useDebounced(parkingQuery, 400);
 const debouncedBookingQuery = useDebounced(bookingQuery, 400);

  useEffect(() => {
    if (!loading && isProvider && tab === "parking") fetchList("parking", debouncedParkingQuery);
  }, [tab, loading, isProvider, debouncedParkingQuery, fetchList]);

  useEffect(() => {
    if (!loading && isProvider && tab === "bookings") fetchList("bookings", debouncedBookingQuery);
  }, [tab, loading, isProvider, debouncedBookingQuery, fetchList]);

 useEffect(() => {
 if (tab === "wallet") loadWallet();
 }, [tab, loadWallet]);

 async function refreshAll() {
 await loadDash();
 if (tab === "parking") fetchList("parking", debouncedParkingQuery);
 if (tab === "bookings") fetchList("bookings", debouncedBookingQuery);
 if (tab === "wallet") loadWallet();
 toast.success("Refreshed.");
 }

 // ── Parking actions ───────────────────────────────────────
 async function handleSetParkingStatus(id, status) {
 setBusyId(id);
 try {
 await providerService.setParkingStatus(id, status);
 toast.success(status === "ACTIVE" ? "Parking space activated." : "Parking space deactivated.");
 fetchList("parking", debouncedParkingQuery);
 loadDash();
 } catch (e) {
 toast.error(extractErrorMessage(e));
 } finally {
 setBusyId(null);
 }
 }

 async function handleDeleteParking(id) {
 if (!window.confirm("Delete this parking space? This cannot be undone.")) return;
 setBusyId(id);
 try {
 await providerService.deleteParking(id);
 toast.success("Parking space removed.");
 fetchList("parking", debouncedParkingQuery);
 loadDash();
 } catch (e) {
 toast.error(extractErrorMessage(e));
 } finally {
 setBusyId(null);
 }
 }

 // ── Booking actions ───────────────────────────────────────
 async function handleBookingStatus(id, status) {
 setBusyId(id);
 try {
 await providerService.updateBookingStatus(id, status);
 toast.success(`Booking marked as ${status.replace(/_/g, " ").toLowerCase()}.`);
 fetchList("bookings", debouncedBookingQuery);
 loadDash();
 } catch (e) {
 toast.error(extractErrorMessage(e));
 } finally {
 setBusyId(null);
 }
 }

 // ── Profile / payout / docs ───────────────────────────────
 async function handleSaveProfile(payload) {
 setFormBusy(true);
 try {
 const { data } = await providerService.updateProfile(payload);
 updateUser(data?.data);
 toast.success("Business profile updated.");
 } catch (e) {
 toast.error(extractErrorMessage(e));
 } finally {
 setFormBusy(false);
 }
 }

 async function handleSaveBank(payload) {
 setFormBusy(true);
 try {
 const { data } = await providerService.bankDetails(payload);
 updateUser(data?.data);
 toast.success("Payout details saved.");
 } catch (e) {
 toast.error(extractErrorMessage(e));
 } finally {
 setFormBusy(false);
 }
 }

 async function handleUploadDocs(formData) {
 setUploading(true);
 try {
 const { data } = await providerService.uploadDocuments(formData);
 updateUser(data?.data);
 toast.success("Documents uploaded.");
 loadDash();
 } catch (e) {
 toast.error(extractErrorMessage(e));
 } finally {
 setUploading(false);
 }
 }

 if (loading) return <AuthLoader />;
 if (!isProvider) return <Navigate to="/" replace />;

 async function handleLogout() {
 await logout();
 navigate("/");
 }

 const changeTab = (id) => {
 setTab(id);
 setNavOpen(false);
 };

 const profile = user?.profile || {};
 const active = TABS.find((t) => t.id === tab);
 const verificationStatus = profile.verificationStatus || "PENDING";

 const NavLinks = () => (
 <nav className="space-y-1">
 {TABS.map((tb) => {
 const isActive = tab === tb.id;
 return (
 <button
 key={tb.id}
 onClick={() => changeTab(tb.id)}
 className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
 isActive
 ? "bg-ink text-white shadow-soft"
 : "text-slate-500 hover:bg-slate-100:bg-ink-800"
 }`}
 >
 <tb.icon size={17} />
 {tb.label}
 </button>
 );
 })}
 </nav>
 );

 return (
 <div className="min-h-screen bg-[#fbfcfe]">
 <aside
 className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
 navOpen ? "translate-x-0" : "-translate-x-full"
 }`}
 >
 <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-5">
 <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-mint-500 to-emerald-700 text-white shadow-glow-mint">
 <ShieldCheck size={20} />
 </span>
 <div className="min-w-0 flex-1">
 <p className="font-display text-base font-bold text-ink">QuickPark</p>
 <p className="text-xs text-slate-400">Provider Console</p>
 </div>
 <button
 onClick={() => setNavOpen(false)}
 className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100:bg-ink-800 lg:hidden"
 aria-label="Close navigation"
 >
 <X size={16} />
 </button>
 </div>

 <div className="flex-1 overflow-y-auto px-4 py-6">
 <NavLinks />
 <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3">
 <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
 Verification
 </p>
 <div className="mt-2">
 <Badge tone={VERIFICATION_BADGE[verificationStatus] || VERIFICATION_BADGE.PENDING}>
 {verificationStatus.replace("_", " ")}
 </Badge>
 </div>
 </div>
 </div>

 <div className="border-t border-slate-100 p-4">
 <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3.5 py-3">
 <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-mint-500 text-sm font-bold text-white">
 {(profile.businessName || user?.name || "P").charAt(0).toUpperCase()}
 </span>
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-bold text-ink">
 {profile.businessName || user?.name || "Provider"}
 </p>
 <p className="truncate text-xs text-slate-400">{user?.email}</p>
 </div>
 <button
 onClick={handleLogout}
 title="Logout"
 className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500:bg-red-500/10"
 >
 <LogOut size={16} />
 </button>
 </div>
 </div>
 </aside>

 {navOpen && (
 <div className="fixed inset-0 z-30 bg-ink-950/50 backdrop-blur-sm lg:hidden" onClick={() => setNavOpen(false)} />
 )}

 <div className="lg:pl-64">
 <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur">
 <div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8">
 <div className="flex items-center gap-3">
 <button
 onClick={() => setNavOpen(true)}
 className="grid h-9 w-9 place-items-center rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50:bg-ink-800 lg:hidden"
 aria-label="Open navigation"
 >
 <Menu size={17} />
 </button>
 <div>
 <h2 className="font-display text-sm font-bold text-ink">
 {active?.label || "Overview"}
 </h2>
 <p className="hidden text-xs text-slate-400 sm:block">
 {profile.businessName || "Welcome back"}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <button
 onClick={refreshAll}
 className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50:bg-ink-800"
 >
 <RefreshCw size={14} /> Refresh
 </button>
 </div>
 </div>
 </header>

 <main className="px-5 py-8 sm:px-8">
 <motion.div
 key={tab}
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
 >
 {dashError && (
 <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
 {dashError}
 </div>
 )}

 {tab === "overview" && <OverviewTab overview={dash} loading={dashLoading} profile={profile} />}
  {tab === "parking" && (
  <MyParkingTab
  data={parking}
  query={parkingQuery}
  setQuery={setParkingQuery}
  onPage={(page) => fetchList("parking", { ...parkingQuery, page })}
  busyId={busyId}
  onSetStatus={handleSetParkingStatus}
  onDelete={handleDeleteParking}
  onChanged={() => {
  fetchList("parking", debouncedParkingQuery);
  loadDash();
  }}
  />
  )}
 {tab === "bookings" && (
 <BookingsTab
 data={bookings}
 query={bookingQuery}
 setQuery={setBookingQuery}
 onPage={(page) => fetchList("bookings", { ...bookingQuery, page })}
 busyId={busyId}
 onStatus={handleBookingStatus}
 />
 )}
 {tab === "wallet" && (
 <WalletTab
 wallet={wallet}
 loading={walletLoading}
 profile={profile}
 onSaveBank={handleSaveBank}
 saving={formBusy}
 />
 )}
 {tab === "verification" && (
 <VerificationTab
 profile={profile}
 onSaveProfile={handleSaveProfile}
 onUploadDocs={handleUploadDocs}
 saving={formBusy}
 uploading={uploading}
 />
 )}
 </motion.div>
 </main>
 </div>
 </div>
 );
}
