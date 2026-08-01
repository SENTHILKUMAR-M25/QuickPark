import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  KeyRound,
  MapPin,
  CheckCircle2,
  Sparkles,
  Star,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import Phone from "./AppPreview";
import { MagneticButton, Counter } from "./ui/Primitives";
import { EASE } from "../lib/motion";

function FloatBadge({ className = "", delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="glass flex items-center gap-2 rounded-2xl p-3.5 shadow-lift"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const TRUST_ROWS = [
  { icon: CheckCircle2, text: "Free to list · No hidden fees" },
  { icon: ShieldCheck, text: "Verified spaces & secure payments" },
  { icon: Star, text: "4.9 average rating across 12K+ reviews" },
];

export default function FinalCTA() {
  return (
    <section id="cta" className="relative overflow-hidden py-20 lg:py-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[44px] bg-gradient-to-br from-ink-950 via-brand-950 to-ink-950 px-6 py-16 shadow-[0_60px_140px_-30px_rgba(37,99,235,0.5)] sm:px-12 lg:px-20 lg:py-24">
          {/* decorative layers */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-grid opacity-[0.07]" />
            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-mint-500/25 blur-3xl" />
            <div className="absolute right-1/4 top-0 h-48 w-48 rounded-full bg-ember-500/20 blur-3xl" />
            {/* animated gradient orb */}
            <motion.div
              animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-500/40 to-mint-500/30 blur-[100px]"
            />
            {/* noise */}
            <div className="noise" />
          </div>

          <div className="relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-mint-300 backdrop-blur"
              >
                <Sparkles size={14} />
                Join 25,000+ early users
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
                className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]"
              >
                Ready to <span className="text-gradient">Park Smarter?</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
                className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg lg:mx-0"
              >
                Whether you're tired of circling the block or want your unused space to work
                for you — your smarter parking life starts with one tap.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, delay: 0.28, ease: EASE }}
                className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
              >
                <MagneticButton className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-7 py-4 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_24px_60px_-12px_rgba(37,99,235,0.8)] transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.25),0_30px_70px_-12px_rgba(37,99,235,0.9)] sm:w-auto">
                  Find Parking
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </MagneticButton>
                <MagneticButton className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-7 py-4 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:border-mint-400/50 hover:bg-white/[0.14] sm:w-auto">
                  <KeyRound size={18} className="text-mint-400" />
                  Become a Parking Partner
                </MagneticButton>
              </motion.div>

              <motion.ul
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.4 }}
                className="mt-8 flex flex-col items-center gap-2.5 text-sm text-white/60 sm:items-start"
              >
                {TRUST_ROWS.map((r) => (
                  <li key={r.text} className="flex items-center gap-2.5">
                    <r.icon size={16} className="text-mint-400" />
                    {r.text}
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* Phone visual */}
            <div className="relative mx-auto w-full max-w-[340px]">
              <div aria-hidden className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-brand-500/40 via-mint-500/25 to-ember-500/25 blur-2xl" />

              <motion.div
                initial={{ opacity: 0, y: 60, rotate: -4 }}
                whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1, ease: EASE }}
              >
                <Phone variant="booking" className="w-full" />
              </motion.div>

              <FloatBadge className="-left-6 top-16 hidden sm:block" delay={0.4}>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint-100 text-mint-600">
                  <CheckCircle2 size={17} />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">Booking confirmed</p>
                  <p className="text-[10px] text-slate-400">Central Plaza · A12</p>
                </div>
              </FloatBadge>

              <FloatBadge className="-right-4 bottom-24 hidden sm:block" delay={0.7}>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-ember-100 text-ember-600">
                  <Wallet size={17} />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">
                    <Counter to={8400} prefix="₹" /> earned
                  </p>
                  <p className="text-[10px] text-slate-400">this month</p>
                </div>
              </FloatBadge>

              <FloatBadge className="-right-2 top-6 hidden md:block" delay={1}>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-100 text-brand-600">
                  <MapPin size={17} />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">124 spots live</p>
                  <p className="text-[10px] text-slate-400">near you right now</p>
                </div>
              </FloatBadge>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2"
              >
                <motion.div
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink shadow-lift"
                >
                  <Sparkles size={13} className="text-brand-600" /> Free for the first 6 months
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
