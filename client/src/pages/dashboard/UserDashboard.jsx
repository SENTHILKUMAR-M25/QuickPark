import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
 LayoutDashboard,
 CalendarCheck2,
 Car,
 User as UserIcon,
 LogOut,
 Menu,
 X,
 RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/user.service";
import { extractErrorMessage } from "../../services/api";
import AuthLoader from "../../components/AuthLoader";
import useDebounced from "../../hooks/useDebounced";
import OverviewTab from "./user/OverviewTab";
import VehiclesTab from "./user/VehiclesTab";
import BookingsTab from "./user/BookingsTab";
import ProfileTab from "./user/ProfileTab";

const TABS = [
 { id: "overview", label: "Overview", icon: LayoutDashboard },
 { id: "bookings", label: "Bookings", icon: CalendarCheck2 },
 { id: "vehicles", label: "My Vehicles", icon: Car },
 { id: "profile", label: "Profile", icon: UserIcon },
];

export default function UserDashboard() {
  const { loading, isUser, user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState(location.state?.tab || "overview");
  const [navOpen, setNavOpen] = useState(false);

 const [dash, setDash] = useState(null);
 const [dashError, setDashError] = useState("");
 const [dashLoading, setDashLoading] = useState(true);

 const [vehicles, setVehicles] = useState(null);
 const [vehiclesLoading, setVehiclesLoading] = useState(false);

 const [bookings, setBookings] = useState(null);
 const [bookingQuery, setBookingQuery] = useState({ status: "" });

 const [busyId, setBusyId] = useState(null);
 const [formBusy, setFormBusy] = useState(false);
 const [uploading, setUploading] = useState(false);

  const loadDash = useCallback(() => {
    setDashLoading(true);
    setDashError("");
    userService
      .getDashboard()
      .then(({ data }) => setDash(data?.data))
      .catch((e) => setDashError(extractErrorMessage(e, "Could not load dashboard.")))
      .finally(() => setDashLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && isUser) loadDash();
  }, [loading, isUser, loadDash]);

 const loadVehicles = useCallback(() => {
 setVehiclesLoading(true);
 userService
 .listVehicles()
 .then(({ data }) => setVehicles(data?.data))
 .catch((e) => toast.error(extractErrorMessage(e)))
 .finally(() => setVehiclesLoading(false));
 }, []);

 const loadBookings = useCallback(
 (params) => userService.listBookings(params).then(({ data }) => setBookings(data?.data)),
 []
 );

 const debouncedBookingQuery = useDebounced(bookingQuery, 400);

  useEffect(() => {
    if (!loading && isUser && tab === "vehicles") loadVehicles();
  }, [tab, loading, isUser, loadVehicles]);

  useEffect(() => {
    if (!loading && isUser && tab === "bookings") {
      loadBookings(debouncedBookingQuery).catch((e) => toast.error(extractErrorMessage(e)));
    }
  }, [tab, loading, isUser, debouncedBookingQuery, loadBookings]);

 async function refreshAll() {
 await loadDash();
 if (tab === "bookings") loadBookings(debouncedBookingQuery).catch(() => {});
 if (tab === "vehicles") loadVehicles();
 toast.success("Refreshed.");
 }

 async function handleCancelBooking(id) {
 setBusyId(id);
 try {
 await userService.cancelBooking(id);
 toast.success("Booking cancelled.");
 loadBookings(debouncedBookingQuery).catch(() => {});
 loadDash();
 } catch (e) {
 toast.error(extractErrorMessage(e));
 } finally {
 setBusyId(null);
 }
 }

 async function handleAddVehicle(payload) {
 setFormBusy(true);
 try {
 const { data } = await userService.addVehicle(payload);
 setVehicles(data?.data);
 toast.success("Vehicle added.");
 return true;
 } catch (e) {
 toast.error(extractErrorMessage(e));
 return false;
 } finally {
 setFormBusy(false);
 }
 }

 async function handleDeleteVehicle(id) {
 if (!window.confirm("Remove this vehicle from your account?")) return;
 setBusyId(id);
 try {
 await userService.deleteVehicle(id);
 toast.success("Vehicle removed.");
 loadVehicles();
 } catch (e) {
 toast.error(extractErrorMessage(e));
 } finally {
 setBusyId(null);
 }
 }

 async function handleSaveProfile(payload) {
 setFormBusy(true);
 try {
 const { data } = await userService.updateProfile(payload);
 updateUser(data?.data);
 toast.success("Profile updated.");
 } catch (e) {
 toast.error(extractErrorMessage(e));
 } finally {
 setFormBusy(false);
 }
 }

 async function handleUploadImage(formData) {
 setUploading(true);
 try {
 const { data } = await userService.uploadProfileImage(formData);
 updateUser(data?.data);
 toast.success("Photo updated.");
 } catch (e) {
 toast.error(extractErrorMessage(e));
 } finally {
 setUploading(false);
 }
 }

 async function handleDeleteAccount() {
 try {
 await userService.deleteAccount();
 toast.success("Account deleted.");
 await logout();
 navigate("/");
 } catch (e) {
 toast.error(extractErrorMessage(e));
 }
 }

 if (loading) return <AuthLoader />;
 if (!isUser) return <Navigate to="/" replace />;

 async function handleLogout() {
 await logout();
 navigate("/");
 }

 const changeTab = (id) => {
 setTab(id);
 setNavOpen(false);
 };

 const active = TABS.find((t) => t.id === tab);

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
 <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
 <LayoutDashboard size={20} />
 </span>
 <div className="min-w-0 flex-1">
 <p className="font-display text-base font-bold text-ink">QuickPark</p>
 <p className="text-xs text-slate-400">Driver Console</p>
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
 </div>

 <div className="border-t border-slate-100 p-4">
 <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3.5 py-3">
 <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-mint-500 text-sm font-bold text-white">
 {(user?.name || "U").charAt(0).toUpperCase()}
 </span>
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-bold text-ink">{user?.name || "Driver"}</p>
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
 <p className="hidden text-xs text-slate-400 sm:block">Welcome back, {user?.name}</p>
 </div>
 </div>
 <button
 onClick={refreshAll}
 className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50:bg-ink-800"
 >
 <RefreshCw size={14} /> Refresh
 </button>
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

 {tab === "overview" && (
 <OverviewTab overview={dash} loading={dashLoading} user={user} onNavigate={changeTab} />
 )}
 {tab === "bookings" && (
 <BookingsTab
 data={bookings}
 query={bookingQuery}
 setQuery={setBookingQuery}
 onPage={(page) => loadBookings({ ...bookingQuery, page }).catch(() => {})}
 busyId={busyId}
 onCancel={handleCancelBooking}
 />
 )}
 {tab === "vehicles" && (
 <VehiclesTab
 data={vehicles}
 loading={vehiclesLoading}
 busyId={busyId}
 saving={formBusy}
 onAdd={handleAddVehicle}
 onDelete={handleDeleteVehicle}
 />
 )}
 {tab === "profile" && (
 <ProfileTab
 user={user}
 profile={user?.profile || {}}
 onSaveProfile={handleSaveProfile}
 onUploadImage={handleUploadImage}
 saving={formBusy}
 uploading={uploading}
 onDeleteAccount={handleDeleteAccount}
 />
 )}
 </motion.div>
 </main>
 </div>
 </div>
 );
}
