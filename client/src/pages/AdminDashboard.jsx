import React from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, ShieldCheck, BarChart3, Users, MapPin, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLoader from "../components/AuthLoader";

const STATS = [
  { icon: Users, label: "Total Users", value: "1,24,320", accent: "bg-brand-50 text-brand-600" },
  { icon: MapPin, label: "Parking Spaces", value: "48,920", accent: "bg-mint-50 text-mint-600" },
  { icon: BarChart3, label: "Revenue", value: "₹2.4Cr", accent: "bg-ember-50 text-ember-600" },
  { icon: FileText, label: "Pending Reviews", value: "742", accent: "bg-violet-50 text-violet-600" },
];

export default function AdminDashboard() {
  const { loading, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <AuthLoader />;
  if (!isAdmin) return <Navigate to="/" replace />;

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="relative min-h-screen bg-[#fbfcfe] dark:bg-ink-950">
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur dark:border-ink-700 dark:bg-ink-900/80">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-ember-500 to-ember-700 text-white shadow-glow-ember">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="font-display text-base font-bold text-ink dark:text-white">Admin Console</p>
              <p className="text-xs text-slate-400 dark:text-ink-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-ink-950"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <main className="container-x py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white">
            Welcome, <span className="text-gradient">{user?.name}</span>
          </h1>
          <p className="mt-2 text-slate-500 dark:text-ink-400">Live overview of the Quick Park marketplace.</p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-ink-700 dark:bg-ink-900">
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${s.accent}`}>
                  <s.icon size={20} />
                </span>
                <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white">{s.value}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-ink-400">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-white/60 p-10 text-center dark:border-ink-700 dark:bg-ink-900/40">
            <p className="text-sm text-slate-500 dark:text-ink-400">
              The admin console is architecture-ready. Manage users, providers, listings & payouts here.
            </p>
            <Link to="/" className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
              ← Back to landing page
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}