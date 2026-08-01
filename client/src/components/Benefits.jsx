import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Fuel,
  FileCheck2,
  CalendarCheck,
  Leaf,
  Coins,
  CalendarRange,
  LayoutDashboard,
  ClipboardList,
  Lock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { SectionHeading } from "./ui/Primitives";
import { IsoCarSolo } from "./illustrations/Isometric";
import { EASE } from "../lib/motion";

const DRIVER_BENEFITS = [
  { icon: Clock, title: "Save Time", desc: "Guaranteed spots, zero circling." },
  { icon: Fuel, title: "Save Fuel", desc: "Less idling, lower emissions." },
  { icon: FileCheck2, title: "Avoid Fines", desc: "Valid, verified parking every time." },
  { icon: CalendarCheck, title: "Easy Booking", desc: "Reserve in under 30 seconds." },
  { icon: Leaf, title: "Stress-Free Parking", desc: "Know your spot before you leave." },
];

const OWNER_BENEFITS = [
  { icon: Coins, title: "Passive Income", desc: "Earn while your space sits idle." },
  { icon: CalendarRange, title: "Flexible Schedule", desc: "List only the hours you choose." },
  { icon: LayoutDashboard, title: "Easy Dashboard", desc: "Track earnings and bookings at a glance." },
  { icon: ClipboardList, title: "Booking Management", desc: "Accept or decline with one tap." },
  { icon: Lock, title: "Secure Payments", desc: "Auto-transferred, protected payouts." },
];

function BenefitItem({ b, tone }) {
  const tones = {
    drivers: "bg-brand-50 text-brand-600",
    owners: "bg-mint-50 text-mint-600",
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: EASE }}
      className="flex items-start gap-4"
    >
      <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}>
        <b.icon size={19} strokeWidth={2.2} />
      </span>
      <div>
        <h4 className="font-display text-base font-bold text-ink">{b.title}</h4>
        <p className="mt-0.5 text-sm text-slate-500">{b.desc}</p>
      </div>
    </motion.div>
  );
}

export default function Benefits() {
  return (
    <section id="benefits" className="relative overflow-hidden py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          tag="Benefits"
          title={
            <>
              Built for drivers. <span className="text-gradient">Loved by owners.</span>
            </>
          }
          description="Whether you park or provide parking, Quick Park makes every day easier — and better for your wallet."
        />

        {/* Drivers */}
        <div className="mt-14 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="order-2 lg:order-1"
          >
            <div className="space-y-5">
              {DRIVER_BENEFITS.map((b) => (
                <BenefitItem key={b.title} b={b} tone="drivers" />
              ))}
            </div>
            <a
              href="#cta"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform duration-300 hover:scale-[1.03]"
            >
              Find Parking
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative mx-auto max-w-md rounded-[36px] bg-gradient-to-br from-brand-50 via-white to-mint-50 p-3 shadow-lift ring-1 ring-white/70">
              <div className="overflow-hidden rounded-[28px] bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Trip summary</p>
                    <p className="font-display text-lg font-bold text-ink">Central Plaza → Office</p>
                  </div>
                  <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-bold text-mint-700">✓ Booked</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[11px] font-medium text-slate-400">Arrival</p>
                    <p className="font-display text-base font-bold text-ink">9:12 AM</p>
                    <p className="text-xs text-mint-600">on time · saved 18 min</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[11px] font-medium text-slate-400">Cost</p>
                    <p className="font-display text-base font-bold text-ink">₹80</p>
                    <p className="text-xs text-brand-600">25% cheaper</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-mint-50 to-emerald-50 p-3">
                  <span className="text-xs font-semibold text-mint-700">CO₂ saved this week</span>
                  <span className="flex items-center gap-1 font-display text-base font-extrabold text-mint-600">
                    <Leaf size={15} /> 2.4 kg
                  </span>
                </div>
              </div>
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-brand-200/50 blur-2xl" aria-hidden />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-8 -left-4 hidden sm:block"
              >
                <IsoCarSolo className="w-44" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Owners */}
        <div id="owners" className="mt-24 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md rounded-[36px] bg-gradient-to-br from-mint-50 via-white to-brand-50 p-3 shadow-lift ring-1 ring-white/70">
              <div className="overflow-hidden rounded-[28px] bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Owner dashboard</p>
                    <p className="font-display text-lg font-bold text-ink">This month's earnings</p>
                  </div>
                  <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-bold text-mint-700">
                    <TrendingUp size={12} className="mr-1 inline" />+32%
                  </span>
                </div>
                <p className="mt-3 font-display text-4xl font-extrabold text-ink">
                  ₹8,450
                </p>
                <div className="mt-4 flex h-24 items-end gap-1.5" aria-hidden>
                  {[34, 52, 40, 64, 48, 72, 60, 86, 74, 96, 82, 100].map((h, i) => (
                    <motion.span
                      key={i}
                      initial={{ height: 6 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-mint-500 to-emerald-400"
                    />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <p className="font-display text-lg font-extrabold text-ink">42</p>
                    <p className="text-[11px] font-medium text-slate-400">bookings</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <p className="font-display text-lg font-extrabold text-ink">18h</p>
                    <p className="text-[11px] font-medium text-slate-400">listed / week</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <p className="font-display text-lg font-extrabold text-mint-600">4.9★</p>
                    <p className="text-[11px] font-medium text-slate-400">owner rating</p>
                  </div>
                </div>
              </div>
              <div className="absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-mint-200/50 blur-2xl" aria-hidden />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity }}
                className="absolute -right-4 -top-8 hidden sm:block"
              >
                <div className="glass-dark flex items-center gap-2 rounded-2xl p-3 shadow-lift">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint-100 text-mint-600">
                    <Coins size={18} />
                  </span>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">New booking</p>
                    <p className="text-xs font-bold text-ink">+₹120 earned</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="space-y-5">
            {OWNER_BENEFITS.map((b) => (
              <BenefitItem key={b.title} b={b} tone="owners" />
            ))}
            <a
              href="#cta"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mint-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-glow-mint transition-transform duration-300 hover:scale-[1.03]"
            >
              Become a Parking Partner
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
