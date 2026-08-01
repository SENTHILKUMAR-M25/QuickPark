import React from "react";
import { motion } from "framer-motion";
import { QrCode, Navigation, Wallet, Bell, Sparkles, ShieldCheck } from "lucide-react";
import Phone from "./AppPreview";
import { SectionHeading } from "./ui/Primitives";
import { EASE } from "../lib/motion";

function PhoneFloat({ variant, className = "", delay = 0, rotate = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotate }}
        className="drop-shadow-[0_40px_60px_rgba(17,24,39,0.25)]"
      >
        <Phone variant={variant} className="w-full" />
      </motion.div>
    </motion.div>
  );
}

export default function AppShowcase() {
  return (
    <section id="app" className="relative overflow-hidden bg-[#f6f7fb] py-20 lg:py-28">
      <div aria-hidden className="absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-1/3 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-200/50 via-mint-100/40 to-ember-100/40 blur-3xl" />
        <div className="absolute inset-0 bg-dots opacity-30" />
      </div>

      <div className="container-x relative">
        <SectionHeading
          tag="The app"
          title={
            <>
              Beautifully simple. <span className="text-gradient">Powerfully smart.</span>
            </>
          }
          description="Every screen designed for one thing — getting you parked, or getting you paid, with the least possible friction."
        />

        <div className="mt-16 flex items-end justify-center gap-5 lg:gap-10">
          {/* Left small phone */}
          <PhoneFloat variant="home" className="hidden w-44 -rotate-6 sm:block md:w-56 lg:-translate-y-4" delay={0.15} />

          {/* Center featured phone */}
          <div className="relative z-10">
            <div aria-hidden className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-brand-300/40 via-mint-300/30 to-ember-300/30 blur-3xl" />
            <PhoneFloat variant="search" className="relative w-60 sm:w-72 lg:w-80" delay={0} rotate={0} />
          </div>

          {/* Right small phone */}
          <PhoneFloat variant="navigation" className="hidden w-44 rotate-6 sm:block md:w-56 lg:translate-y-2" delay={0.3} />
        </div>

        {/* Floating interaction chips */}
        <div className="relative mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: QrCode, label: "QR Check-in", tone: "bg-brand-50 text-brand-600" },
            { icon: Navigation, label: "Turn-by-turn", tone: "bg-mint-50 text-mint-600" },
            { icon: Wallet, label: "Wallet & cashback", tone: "bg-ember-50 text-ember-600" },
            { icon: Bell, label: "Instant alerts", tone: "bg-violet-50 text-violet-600" },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: EASE }}
              whileHover={{ y: -4 }}
              className="glass flex items-center gap-3 rounded-2xl p-4 shadow-card"
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${c.tone}`}>
                <c.icon size={18} />
              </span>
              <span className="text-sm font-semibold text-ink">{c.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-mint-500" /> SOC2-ready security</span>
          <span className="flex items-center gap-2"><Sparkles size={14} className="text-brand-500" /> 4.9 App Store rating</span>
          <span className="flex items-center gap-2"><Wallet size={14} className="text-ember-500" /> 60s onboarding</span>
        </motion.div>
      </div>
    </section>
  );
}
