import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
 ShieldCheck,
 LogOut,
 Users,
 MapPin,
 Building2,
 CalendarCheck2,
 LayoutDashboard,
 Menu,
 X,
 RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { adminService } from "../services/admin.service";
import { extractErrorMessage } from "../services/api";
import AuthLoader from "../components/AuthLoader";
import useDebounced from "../hooks/useDebounced";
import OverviewTab from "./admin/OverviewTab";
import UsersTab from "./admin/UsersTab";
import ProvidersTab from "./admin/ProvidersTab";
import SpacesTab from "./admin/SpacesTab";
import BookingsTab from "./admin/BookingsTab";

const TABS = [
 { id: "overview", label: "Overview", icon: LayoutDashboard },
 { id: "users", label: "Users", icon: Users },
 { id: "providers", label: "Providers", icon: Building2 },
 { id: "spaces", label: "Parking Spaces", icon: MapPin },
 { id: "bookings", label: "Bookings", icon: CalendarCheck2 },
];

export default function AdminDashboard() {
 const { loading, isAdmin, user, logout } = useAuth();
 const navigate = useNavigate();

 const [tab, setTab] = useState("overview");
 const [navOpen, setNavOpen] = useState(false);
 const [overview, setOverview] = useState(null);
 const [dashError, setDashError] = useState("");
 const [dashLoading, setDashLoading] = useState(true);

 const [users, setUsers] = useState(null);
 const [providers, setProviders] = useState(null);
 const [spaces, setSpaces] = useState(null);
 const [bookings, setBookings] = useState(null);

 const [userQuery, setUserQuery] = useState({ search: "", status: "" });
 const [providerQuery, setProviderQuery] = useState({ search: "", verification: "" });
 const [spaceQuery, setSpaceQuery] = useState({ search: "" });
 const [bookingQuery, setBookingQuery] = useState({ status: "" });

 const [busyId, setBusyId] = useState(null);

 useEffect(() => {
 let active = true;
 adminService
 .getOverview()
 .then(({ data }) => active && setOverview(data?.data))
 .catch((e) => active && setDashError(extractErrorMessage(e, "Could not load admin data.")))
 .finally(() => active && setDashLoading(false));
 return () => {
 active = false;
 };
 }, []);

 const loadUsers = useCallback(
 (params) => adminService.listUsers(params).then(({ data }) => setUsers(data?.data)),
 []
 );

 const loadProviders = useCallback(
 (params) => adminService.listProviders(params).then(({ data }) => setProviders(data?.data)),
 []
 );

 const loadSpaces = useCallback(
 (params) => adminService.listParkingSpaces(params).then(({ data }) => setSpaces(data?.data)),
 []
 );

 const loadBookings = useCallback(
 (params) => adminService.listBookings(params).then(({ data }) => setBookings(data?.data)),
 []
 );

 const fetchList = useCallback(
 (tabName, params) => {
 const list = {
 users: loadUsers,
 providers: loadProviders,
 spaces: loadSpaces,
 bookings: loadBookings,
 }[tabName];
 if (!list) return;
 list(params).catch((e) => toast.error(extractErrorMessage(e)));
 },
 [loadUsers, loadProviders, loadSpaces, loadBookings]
 );

 const debouncedUserQuery = useDebounced(userQuery, 400);
 const debouncedProviderQuery = useDebounced(providerQuery, 400);
 const debouncedSpaceQuery = useDebounced(spaceQuery, 400);
 const debouncedBookingQuery = useDebounced(bookingQuery, 400);

 useEffect(() => {
 if (tab === "users") fetchList("users", debouncedUserQuery);
 }, [tab, debouncedUserQuery, fetchList]);

 useEffect(() => {
 if (tab === "providers") fetchList("providers", debouncedProviderQuery);
 }, [tab, debouncedProviderQuery, fetchList]);

 useEffect(() => {
 if (tab === "spaces") fetchList("spaces", debouncedSpaceQuery);
 }, [tab, debouncedSpaceQuery, fetchList]);

 useEffect(() => {
 if (tab === "bookings") fetchList("bookings", debouncedBookingQuery);
 }, [tab, debouncedBookingQuery, fetchList]);

 async function handleStatus(id, status, reload) {
 setBusyId(id);
 try {
 await adminService.updateAccountStatus(id, status);
 toast.success(status === "BLOCKED" ? "Account blocked." : "Account activated.");
 reload?.();
 } catch (e) {
 toast.error(extractErrorMessage(e));
 } finally {
 setBusyId(null);
 }
 }

 async function handleVerification(id, status) {
 setBusyId(id);
 try {
 await adminService.updateProviderVerification(id, status);
 toast.success(`Verification set to ${status.replace(/_/g, " ").toLowerCase()}.`);
 loadProviders(debouncedProviderQuery).catch(() => {});
 adminService.getOverview().then(({ data }) => setOverview(data?.data)).catch(() => {});
 } catch (e) {
 toast.error(extractErrorMessage(e));
 } finally {
 setBusyId(null);
 }
 }

 async function refreshOverview() {
 try {
 await adminService.getOverview().then(({ data }) => setOverview(data?.data));
 toast.success("Refreshed.");
 } catch (e) {
 toast.error(extractErrorMessage(e));
 }
 }

 if (loading) return <AuthLoader />;
 if (!isAdmin) return <Navigate to="/" replace />;

 async function handleLogout() {
 await logout();
 navigate("/");
 }

 const changeTab = (id) => {
 setTab(id);
 setNavOpen(false);
 };

 const active = TABS.find((t) => t.id === tab);

 const NavLinks = ({ onNavigate }) => (
 <nav className="space-y-1">
 {TABS.map((tb) => {
 const isActive = tab === tb.id;
 return (
 <button
 key={tb.id}
 onClick={() => onNavigate?.(tb.id) || setTab(tb.id)}
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
 <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-ember-500 to-ember-700 text-white shadow-glow-ember">
 <ShieldCheck size={20} />
 </span>
 <div className="min-w-0 flex-1">
 <p className="font-display text-base font-bold text-ink">QuickPark</p>
 <p className="text-xs text-slate-400">Admin Console</p>
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
 <NavLinks onNavigate={changeTab} />
 </div>

 <div className="border-t border-slate-100 p-4">
 <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3.5 py-3">
 <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-mint-500 text-sm font-bold text-white">
 {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
 </span>
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-bold text-ink">{user?.name || "Admin"}</p>
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
 <div
 className="fixed inset-0 z-30 bg-ink-950/50 backdrop-blur-sm lg:hidden"
 onClick={() => setNavOpen(false)}
 />
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
 Welcome back, {user?.name || "Admin"}
 </p>
 </div>
 </div>
 <button
 onClick={refreshOverview}
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

 {tab === "overview" && <OverviewTab overview={overview} loading={dashLoading} />}
 {tab === "users" && (
 <UsersTab
 data={users}
 query={userQuery}
 setQuery={setUserQuery}
 busyId={busyId}
 onAction={handleStatus}
 reload={() => fetchList("users", debouncedUserQuery)}
 onPage={(page) => fetchList("users", { ...userQuery, page })}
 />
 )}
 {tab === "providers" && (
 <ProvidersTab
 data={providers}
 query={providerQuery}
 setQuery={setProviderQuery}
 busyId={busyId}
 onVerify={handleVerification}
 onPage={(page) => fetchList("providers", { ...providerQuery, page })}
 />
 )}
 {tab === "spaces" && (
 <SpacesTab
 data={spaces}
 query={spaceQuery}
 setQuery={setSpaceQuery}
 onPage={(page) => fetchList("spaces", { ...spaceQuery, page })}
 />
 )}
 {tab === "bookings" && (
 <BookingsTab
 data={bookings}
 query={bookingQuery}
 setQuery={setBookingQuery}
 onPage={(page) => fetchList("bookings", { ...bookingQuery, page })}
 />
 )}
 </motion.div>
 </main>
 </div>
 </div>
 );
}
