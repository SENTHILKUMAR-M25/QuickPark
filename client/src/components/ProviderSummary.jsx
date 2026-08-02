import React, { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Car,
  CalendarCheck2,
  Percent,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { stagger, fadeUp } from "../lib/motion";

const KPIS = [
  { icon: IndianRupee, label: "Today's Revenue", value: "₹2,480", delta: "+18%", accent: "text-mint-600 bg-mint-50" },
  { icon: Car, label: "Active Spaces", value: "12", delta: "of 15", accent: "text-brand-600 bg-brand-50" },
  { icon: CalendarCheck2, label: "Total Bookings", value: "328", delta: "+32", accent: "text-ember-600 bg-ember-50" },
  { icon: Percent, label: "Occupancy Rate", value: "76%", delta: "+6%", accent: "text-violet-600 bg-violet-50" },
];

const ProviderSummary = memo(function ProviderSummary() {
  const { user } = useAuth();

  return (
    <section id="provider-summary" className="relative py-14 lg:py-20">
      <div className="container-x">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 lg:grid-cols-4"
        >
          {KPIS.map((k) => (
<motion.div
              key={k.label}
              variants={fadeUp}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-ink-700 dark:bg-ink-900"
            >
              <div className="flex items-center justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${k.accent}`}>
                  <k.icon size={20} />
                </span>
                <span className="text-xs font-bold text-mint-600 dark:text-mint-400">{k.delta}</span>
              </div>
              <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white">
                {k.value}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-ink-400">{k.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-6 flex max-w-5xl flex-col items-center justify-between gap-5 rounded-3xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white p-6 shadow-soft sm:flex-row lg:px-8 dark:border-ink-700 dark:from-ink-900 dark:to-ink-900"
        >
          <div>
            <p className="text-sm text-slate-500 dark:text-ink-400">
              Good to see you, <span className="font-semibold text-ink dark:text-white">{user?.name?.split(" ")[0]}</span>. {`3`} new booking
              requests need your attention today.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/provider/bookings"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-lift transition-transform hover:-translate-y-0.5"
            >
              Review Bookings
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/provider/parking?new=1"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-mint-300 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100"
            >
              <Plus size={16} className="text-mint-500" />
              Add Parking Space
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default ProviderSummary;