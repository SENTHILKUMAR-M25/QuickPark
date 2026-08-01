import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Fuel,
  TrafficCone,
  FileWarning,
  ShieldAlert,
  Timer,
  ArrowRight,
} from "lucide-react";
import { Counter, Reveal } from "./ui/Primitives";
import { EASE } from "../lib/motion";

const PROBLEMS = [
  {
    icon: Search,
    title: "Endless searching",
    desc: "Circling block after block, wasting precious minutes hunting for a spot that may not exist.",
    stat: "~20 min",
    statLabel: "lost per trip",
    accent: "from-brand-500 to-blue-600",
    chip: "bg-brand-50 text-brand-600",
  },
  {
    icon: Fuel,
    title: "Fuel going up in smoke",
    desc: "Idling engines and slow loops burn fuel — and money — for zero distance travelled.",
    stat: "30%",
    statLabel: "more fuel burned",
    accent: "from-ember-500 to-orange-600",
    chip: "bg-ember-50 text-ember-600",
  },
  {
    icon: TrafficCone,
    title: "Traffic congestion",
    desc: "Parking seekers cause up to 30% of city traffic. Everyone behind you pays the price.",
    stat: "30%",
    statLabel: "of urban traffic",
    accent: "from-violet-500 to-indigo-600",
    chip: "bg-violet-50 text-violet-600",
  },
  {
    icon: FileWarning,
    title: "Parking fines",
    desc: "One unclear sign, one expired meter — and a fine lands in your pocket instead of your wallet.",
    stat: "₹500+",
    statLabel: "average fine",
    accent: "from-rose-500 to-red-600",
    chip: "bg-rose-50 text-rose-600",
  },
  {
    icon: ShieldAlert,
    title: "Unsafe & unverified spots",
    desc: "Dark alleys, shady lots, and unknown neighbourhoods. Your car's safety is a gamble.",
    stat: "42%",
    statLabel: "feel unsafe parking",
    accent: "from-amber-500 to-ember-600",
    chip: "bg-amber-50 text-amber-600",
  },
  {
    icon: Timer,
    title: "Time you can't get back",
    desc: "Hours every month, every year, spent hunting — time that belongs to your family and work.",
    stat: "6 days",
    statLabel: "lost every year",
    accent: "from-sky-500 to-cyan-600",
    chip: "bg-sky-50 text-sky-600",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="relative overflow-hidden py-20 lg:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-rose-100/60 blur-3xl" />
        <div className="absolute left-0 bottom-24 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />
      </div>

      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:items-start">
          {/* Narrative column */}
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
                The problem
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                Parking shouldn't be a{" "}
                <span className="relative">
                  daily battle
                  <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-rose-400 to-ember-400" />
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-base leading-relaxed text-slate-500 sm:text-lg">
                Every day, millions of drivers circle our cities hunting for parking.
                The result? Wasted fuel, jammed streets, parking fines, and stress —
                for everyone.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="relative mt-8 overflow-hidden rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-card backdrop-blur">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-100 blur-2xl" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  The hidden cost of searching
                </p>
                <div className="mt-3 flex items-end gap-1" aria-hidden>
                  {[30, 55, 38, 70, 45, 82, 58, 92, 64, 100].map((h, i) => (
                    <motion.span
                      key={i}
                      initial={{ height: 6, opacity: 0.4 }}
                      whileInView={{ height: h * 1.2, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.08, ease: EASE }}
                      className="w-3 rounded-full bg-gradient-to-t from-rose-300 to-ember-400"
                    />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-rose-50 p-3 text-center">
                    <p className="font-display text-2xl font-extrabold text-rose-600">
                      <Counter to={1.8} decimals={1} />
                    </p>
                    <p className="text-[11px] font-medium text-slate-500">Lakh litres fuel wasted / yr</p>
                  </div>
                  <div className="rounded-2xl bg-ember-50 p-3 text-center">
                    <p className="font-display text-2xl font-extrabold text-ember-600">₹50K</p>
                    <p className="text-[11px] font-medium text-slate-500">Avg. spent on fines / yr</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-3 text-center">
                    <p className="font-display text-2xl font-extrabold text-slate-700">6.3 hrs</p>
                    <p className="text-[11px] font-medium text-slate-500">searching / month</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <p className="mt-6 text-sm font-medium text-slate-400">
                Sound familiar? The old way of parking was never designed for modern cities.
              </p>
            </Reveal>
          </div>

          {/* Problem cards */}
          <div className="grid gap-5 sm:grid-cols-2">
            {PROBLEMS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: (i % 2) * 0.1 + Math.floor(i / 2) * 0.08, ease: EASE }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-lift"
              >
                <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${p.accent} opacity-[0.07] blur-xl transition-all duration-500 group-hover:opacity-[0.18] group-hover:blur-2xl`} aria-hidden />
                <div className="flex items-start justify-between">
                  <div className={`grid h-11 w-11 place-items-center rounded-2xl ${p.chip} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                    <p.icon size={21} strokeWidth={2.2} />
                  </div>
                  <div className="rounded-full bg-slate-50 px-3 py-1 text-right">
                    <p className="font-display text-sm font-extrabold text-ink">{p.stat}</p>
                    <p className="text-[10px] font-medium text-slate-400">{p.statLabel}</p>
                  </div>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.desc}</p>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-ink-950 to-brand-950 p-6 text-white shadow-lift sm:col-span-2"
            >
              <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.06]" />
              <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/40 blur-3xl" />
              <div aria-hidden className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-ember-500/30 blur-3xl" />
              <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">The smarter way</p>
                  <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                    What if parking was <span className="text-gradient">one tap away?</span>
                  </h3>
                </div>
                <a
                  href="#solution"
                  className="group/btn inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-lg transition-all duration-300 hover:scale-[1.03]"
                >
                  See the solution
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
