import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Zap,
  Radio,
  ShieldCheck,
  CreditCard,
  Navigation,
} from "lucide-react";
import { SectionHeading, TiltCard } from "./ui/Primitives";
import { IsoParking } from "./illustrations/Isometric";
import { EASE } from "../lib/motion";

const slotColors = ["bg-brand-500", "bg-mint-500", "bg-ember-500", "bg-slate-200", "bg-slate-200", "bg-brand-500", "bg-slate-200", "bg-mint-500"];

function CardShell({ children, className = "", glow = "group-hover:shadow-glow" }) {
  return (
    <TiltCard max={6} className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-card transition-shadow duration-500 sm:p-6 ${glow} ${className}`}
      >
        {children}
      </motion.div>
    </TiltCard>
  );
}

function MiniLabel({ children }) {
  return <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{children}</p>;
}

export default function Solution() {
  return (
    <section id="solution" className="relative overflow-hidden bg-[#f6f7fb] py-20 lg:py-28">
      <div aria-hidden className="absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-0 h-64 w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-100/80 to-mint-100/60 blur-3xl" />
      </div>

      <div className="container-x relative">
        <SectionHeading
          tag="The solution"
          title={
            <>
              One app. <span className="text-gradient">Every parking problem solved.</span>
            </>
          }
          description="Quick Park connects drivers with verified parking spaces in real time — and gives property owners a way to earn. Simple, secure, and built for modern cities."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Find nearby parking */}
          <CardShell className="lg:col-span-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Search size={21} strokeWidth={2.2} />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">Find nearby parking</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Live map of every available space around you — homes, apartments, malls, hospitals, and lots — sorted by distance and price.
            </p>
            <div className="mt-auto pt-5">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2.5">
                <Search size={16} className="ml-1 shrink-0 text-slate-400" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-400">
                  Where are you parked today?
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="ml-auto shrink-0 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-2 text-xs font-bold text-white shadow-glow"
                >
                  Search
                </motion.button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Central Plaza", "West Side", "Airport", "Station Rd"].map((s) => (
                  <span key={s} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 transition-colors hover:text-brand-600">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </CardShell>

          {/* Reserve instantly */}
          <CardShell>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-50 text-mint-600">
              <Zap size={21} strokeWidth={2.2} />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">Reserve instantly</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Lock your spot in seconds with a guaranteed booking. No hunting, no hoping, no double-booking.
            </p>
            <div className="mt-auto pt-5">
              <div className="rounded-2xl bg-mint-50 p-4">
                <MiniLabel>Slot A-12 · Central Plaza</MiniLabel>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-display text-lg font-extrabold text-ink">₹80<span className="text-sm font-semibold text-slate-400">/hr</span></span>
                  <motion.span
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="shrink-0 rounded-full bg-mint-500 px-3 py-1 text-xs font-bold text-white"
                  >
                    Reserved
                  </motion.span>
                </div>
              </div>
            </div>
          </CardShell>

          {/* Real-time availability */}
          <CardShell>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Radio size={21} strokeWidth={2.2} />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">Real-time availability</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              IoT sensors and live occupancy data — see exactly which slots are free, the moment they're free.
            </p>
            <div className="mt-auto pt-5">
              <MiniLabel>Live occupancy</MiniLabel>
              <div className="mt-2 grid grid-cols-8 gap-1.5">
                {slotColors.map((c, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className={`h-5 rounded-lg sm:h-6 ${c} ${c === "bg-slate-200" ? "opacity-40" : "shadow-sm"}`}
                  />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-mint-500" />6 free</span>
                <span className="font-bold text-ink">3 spots near you</span>
              </div>
            </div>
          </CardShell>

          {/* Secure payments */}
          <CardShell>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ember-50 text-ember-600">
              <CreditCard size={21} strokeWidth={2.2} />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">Secure payments</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Pay only for what you use. UPI, cards, and wallet — encrypted, protected, and instantly refundable.
            </p>
            <div className="mt-auto pt-5">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-ember-100 bg-ember-50/60 p-4">
                <div className="min-w-0">
                  <MiniLabel>Quick Pay</MiniLabel>
                  <p className="font-display text-lg font-extrabold text-ink">₹80.00</p>
                </div>
                <motion.span
                  whileTap={{ scale: 0.92 }}
                  className="shrink-0 cursor-pointer rounded-xl bg-ember-500 px-4 py-2 text-xs font-bold text-white shadow-glow-ember"
                >
                  Pay
                </motion.span>
              </div>
            </div>
          </CardShell>

          {/* GPS Navigation */}
          <CardShell>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <Navigation size={21} strokeWidth={2.2} />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">GPS navigation</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Turn-by-turn directions right to your reserved bay — not just the building, but the exact slot.
            </p>
            <div className="mt-auto pt-5">
              <div className="relative h-14 overflow-hidden rounded-2xl bg-ink-950">
                <svg viewBox="0 0 200 56" className="h-full w-full">
                  <path d="M-5 48 C 40 8, 120 52, 205 12" fill="none" stroke="#34d399" strokeWidth="2.5" strokeDasharray="1 8" strokeLinecap="round" />
                  <circle cx="16" cy="46" r="5" fill="#2563eb" stroke="white" strokeWidth="2" />
                  <circle cx="178" cy="16" r="5" fill="#f97316" stroke="white" strokeWidth="2" />
                </svg>
                <span className="absolute bottom-1.5 right-2 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                  1.2 km · 4 min
                </span>
              </div>
            </div>
          </CardShell>

          {/* Safe verified locations */}
          <CardShell className="lg:col-span-2">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-50 text-mint-600">
                  <ShieldCheck size={21} strokeWidth={2.2} />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">Safe, verified locations</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Every space is verified by our team. GPS-verified addresses, owner identity checks, community ratings, and 24/7 support keep your car — and your peace of mind — safe.
                </p>
              </div>
              <IsoParking className="w-full max-w-[260px] shrink-0 self-center sm:w-52 sm:self-auto md:w-56" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["GPS Verified", "Owner ID Check", "Community Rated", "24/7 Support", "CCTV Friendly"].map((b) => (
                <span key={b} className="flex items-center gap-1.5 rounded-full bg-mint-50 px-3 py-1.5 text-xs font-semibold text-mint-700">
                  <ShieldCheck size={13} /> {b}
                </span>
              ))}
            </div>
          </CardShell>
        </div>
      </div>
    </section>
  );
}
