import React, { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Heart,
  Wallet,
  MapPin,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { stagger, fadeUp } from "../lib/motion";

const ACTIVITY = [
  { label: "Booked Central Plaza · A12", time: "2h ago" },
  { label: "Saved City Mall · Level 2", time: "Yesterday" },
  { label: "Added vehicle · KA 01 MH 1234", time: "2 days ago" },
];

const FAVORITES = [
  { name: "Central Plaza", area: "CBD · 120m", price: "₹60/hr" },
  { name: "City Mall Parking", area: "Max Area · 450m", price: "₹50/hr" },
];

const DashboardPreview = memo(function DashboardPreview() {
  const { user } = useAuth();

  return (
    <section id="dashboard-preview" className="relative py-14 lg:py-20">
      <div className="container-x">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 lg:grid-cols-3"
        >
          {/* Upcoming booking */}
          <motion.div
            variants={fadeUp}
            className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-glow"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <Clock size={13} /> Upcoming
              </span>
              <Link to="/bookings" className="text-xs font-semibold text-white/80 hover:text-white">
                View all →
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15">
                <MapPin size={20} className="text-white" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">Central Plaza · Slot A12</p>
                <p className="mt-0.5 text-xs text-white/70">
                  Today · 18:30 – 21:00
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-white/70">
              Hey {user?.name?.split(" ")[0]}, don't forget your reserved spot tonight.
            </p>
          </motion.div>

          {/* Recent activity */}
          <motion.div
            variants={fadeUp}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-ink-700 dark:bg-ink-900"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-ink dark:text-white">Recent Activity</h3>
              <LayoutDashboard size={18} className="text-slate-300 dark:text-ink-500" />
            </div>
            <ul className="mt-5 space-y-4">
              {ACTIVITY.map((a) => (
                <li key={a.label} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-ink-200">{a.label}</p>
                    <p className="text-xs text-slate-400 dark:text-ink-500">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Favorites + wallet */}
          <motion.div variants={fadeUp} className="flex flex-col gap-5">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-ink-700 dark:bg-ink-900">
              <div className="flex items-center gap-2">
                <Heart size={18} className="fill-rose-400 text-rose-400" />
                <h3 className="font-display text-base font-bold text-ink dark:text-white">Favorite Parking</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {FAVORITES.map((f) => (
                  <li key={f.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-ink-800/70">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-ink-100">{f.name}</p>
                      <p className="text-xs text-slate-400 dark:text-ink-500">{f.area}</p>
                    </div>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{f.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/dashboard"
              className="group flex items-center justify-between rounded-3xl bg-ink px-6 py-4 text-white shadow-lift transition-transform hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-3">
                <Wallet size={18} className="text-mint-300" />
                <span>
                  <span className="block text-xs font-medium text-white/60">Wallet Balance</span>
                  <span className="font-display text-lg font-bold">₹1,240</span>
                </span>
              </span>
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

export default DashboardPreview;