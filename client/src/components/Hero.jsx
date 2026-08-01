import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Wallet,
  Navigation,
  Star,
  ShieldCheck,
  Clock,
} from "lucide-react";
import CityMap from "./illustrations/CityMap";
import { MagneticButton } from "./ui/Primitives";
import { EASE } from "../lib/motion";

const AVATARS = [
  { init: "A", color: "from-brand-500 to-brand-700" },
  { init: "S", color: "from-mint-500 to-emerald-600" },
  { init: "R", color: "from-ember-500 to-orange-600" },
  { init: "K", color: "from-violet-500 to-indigo-600" },
];

function FloatCard({ className = "", delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, delay, repeat: Infinity, ease: "easeInOut" }}
        className="glass-dark rounded-2xl p-4 shadow-lift"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24">
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-200 via-brand-100 to-mint-100 blur-3xl opacity-70" />
        <div className="absolute top-40 -left-32 h-96 w-96 rounded-full bg-mint-100 blur-3xl opacity-60" />
        <div className="absolute top-64 -right-24 h-80 w-80 rounded-full bg-ember-100 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#fbfcfe]" />
      </div>

      <div className="container-x">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          {/* Copy */}
          <div className="relative z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-soft backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-500" />
              </span>
              Launching soon in 15+ cities
              <span className="ml-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-600">
                Waitlist open
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="mt-6 font-display text-[2.75rem] font-extrabold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[4.4rem]"
            >
              Find Parking.
              <br />
              <span className="text-gradient">Earn</span> from Parking.
              <br />
              Park <span className="relative inline-block">
                Without Stress.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" aria-hidden>
                  <motion.path
                    d="M3 9 C 45 3, 130 3, 197 8"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg lg:mx-0"
            >
              Quick Park is the smart parking marketplace. Reserve a guaranteed spot in
              seconds — or turn your unused driveway, garage, and parking lot into
              income. Real-time availability. Verified spaces. Zero circling.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.34, ease: EASE }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <MagneticButton className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-7 py-4 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(37,99,235,0.12),0_24px_60px_-12px_rgba(37,99,235,0.5)] sm:w-auto">
                Find Parking
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-7 py-4 text-sm font-semibold text-ink shadow-soft backdrop-blur transition-all duration-300 hover:border-mint-300 hover:shadow-glow-mint sm:w-auto">
                <KeyRound size={18} className="text-mint-500" />
                List Your Parking
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <div className="flex -space-x-2.5">
                {AVATARS.map((a) => (
                  <div
                    key={a.init}
                    className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${a.color} text-xs font-bold text-white ring-2 ring-white`}
                  >
                    {a.init}
                  </div>
                ))}
                <div className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[10px] font-bold text-white ring-2 ring-white">
                  25K+
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center justify-center gap-1 lg:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 font-bold text-ink">4.9</span>
                </div>
                <p className="mt-0.5 text-slate-500">Loved by 25,000+ drivers & parking owners</p>
              </div>
            </motion.div>
          </div>

          {/* Visual */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
              className="relative mx-auto max-w-[560px]"
            >
              {/* glow behind map */}
              <div className="absolute -inset-6 -z-10 rounded-[44px] bg-gradient-to-br from-brand-300/40 via-mint-200/40 to-ember-200/40 blur-2xl" />

              <div className="rounded-[36px] p-2 shadow-[0_40px_100px_-20px_rgba(37,99,235,0.35)] ring-1 ring-white/80">
                <CityMap className="aspect-[7/6]" />
              </div>

              {/* Floating cards */}
              <FloatCard className="-left-3 top-10 hidden sm:block lg:-left-8" delay={0.5}>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <MapPin size={19} strokeWidth={2.4} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Nearby Parking</p>
                    <p className="text-sm font-bold text-ink">24 spots · 120m</p>
                  </div>
                </div>
              </FloatCard>

              <FloatCard className="-right-2 top-24 hidden sm:block lg:-right-8" delay={0.7}>
                <div className="flex items-center gap-3">
                  <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-mint-50 text-mint-600">
                    <CheckCircle2 size={19} strokeWidth={2.4} />
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-mint-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Booking Success</p>
                    <p className="text-sm font-bold text-ink">Slot reserved for you</p>
                  </div>
                </div>
              </FloatCard>

              <FloatCard className="-bottom-4 left-6 sm:left-2 lg:-left-6" delay={0.9}>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-ember-50 text-ember-600">
                    <Wallet size={19} strokeWidth={2.4} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Revenue Earned</p>
                    <p className="text-sm font-bold text-ink">
                      ₹8,400 <span className="font-semibold text-mint-600">+₹1,250</span>
                    </p>
                  </div>
                  <div className="ml-2 flex items-end gap-0.5" aria-hidden>
                    {[38, 55, 42, 70, 58, 84, 96].map((h, i) => (
                      <motion.span
                        key={i}
                        initial={{ height: 4 }}
                        animate={{ height: h }}
                        transition={{ duration: 0.9, delay: 1.2 + i * 0.08, ease: EASE }}
                        className="w-1.5 rounded-full bg-gradient-to-t from-brand-500 to-mint-400"
                      />
                    ))}
                  </div>
                </div>
              </FloatCard>

              <FloatCard className="-right-3 bottom-16 hidden md:block lg:-right-10" delay={1.1}>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white">
                    <Navigation size={19} strokeWidth={2.4} className="text-mint-300" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Available Slots</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                        <motion.span
                          initial={{ width: 0 }}
                          animate={{ width: "72%" }}
                          transition={{ duration: 1.2, delay: 1.4, ease: EASE }}
                          className="block h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-400"
                        />
                      </span>
                      <span className="text-xs font-bold text-ink">72%</span>
                    </div>
                  </div>
                </div>
              </FloatCard>

              {/* Floating trust chips */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.6, ease: EASE }}
                className="absolute -top-4 right-6"
              >
                <motion.div
                  animate={{ rotate: [0, 8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="glass-dark flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink shadow-soft"
                >
                  <ShieldCheck size={14} className="text-mint-500" /> Verified
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6, ease: EASE }}
                className="absolute -bottom-5 right-8"
              >
                <motion.div
                  animate={{ rotate: [0, -8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="glass-dark flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink shadow-soft"
                >
                  <Clock size={14} className="text-brand-600" /> 24/7 Access
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
