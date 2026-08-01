import React from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Building2, TicketCheck, TrendingUp } from "lucide-react";
import { Counter } from "./ui/Primitives";

const STATS = [
  { icon: MapPin, value: 1000, suffix: "+", label: "Parking Spaces", tone: "text-brand-600 bg-brand-50", sub: "listed across cities" },
  { icon: Users, value: 25, suffix: "K+", label: "Happy Users", tone: "text-mint-600 bg-mint-50", sub: "drivers & owners" },
  { icon: Building2, value: 15, suffix: "+", label: "Cities Live", tone: "text-violet-600 bg-violet-50", sub: "and growing fast" },
  { icon: TicketCheck, value: 50, suffix: "K+", label: "Successful Bookings", tone: "text-ember-600 bg-ember-50", sub: "zero-fuss parking" },
];

const MARQUEE = [
  "Apartment Parking",
  "Independent Houses",
  "Offices",
  "Hospitals",
  "Hotels",
  "Shopping Malls",
  "Wedding Halls",
  "Event Spaces",
  "Schools & Colleges",
  "Commercial Lots",
];

export default function Trust() {
  return (
    <section className="relative py-16 lg:py-24" aria-label="Trusted by the community">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-ink-950 via-ink-900 to-brand-950 px-6 py-12 shadow-lift sm:px-10 lg:px-16 lg:py-16"
        >
          {/* decorative glows */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-mint-500/25 blur-3xl" />
            <div className="absolute right-1/3 top-0 h-40 w-40 rounded-full bg-ember-500/20 blur-3xl" />
            <div className="absolute inset-0 bg-grid opacity-[0.07]" />
          </div>

          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="group relative flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur transition-colors duration-300 hover:bg-white/[0.08] lg:items-start lg:text-left"
              >
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${s.tone} transition-transform duration-300 group-hover:scale-110`}>
                  <s.icon size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="font-display text-4xl font-extrabold tracking-tight text-white lg:text-[2.75rem]">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white/90">{s.label}</p>
                  <p className="text-xs text-white/50">{s.sub}</p>
                </div>
                {i < STATS.length - 1 && (
                  <div aria-hidden className="absolute right-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-white/10 lg:block" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="relative mt-10 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            <TrendingUp size={14} className="text-mint-400" />
            Powering parking for
          </div>
        </motion.div>

        {/* Marquee of space types */}
        <div className="mask-fade-x mt-10 overflow-hidden">
          <div className="flex w-max animate-marquee gap-3">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span
                key={i}
                className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-500 shadow-soft"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
