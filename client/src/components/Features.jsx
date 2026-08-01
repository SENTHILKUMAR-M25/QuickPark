import React from "react";
import { motion } from "framer-motion";
import {
  Radio,
  QrCode,
  KeyRound,
  History,
  Bell,
  Wallet,
  Heart,
  Star,
  MessageSquare,
  Clock3,
  Car,
  Sparkles,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { SectionHeading } from "./ui/Primitives";
import { EASE } from "../lib/motion";

const FEATURES = [
  {
    icon: Radio,
    title: "Live Availability",
    desc: "See free slots update in real time across the entire city.",
    tone: "bg-brand-50 text-brand-600",
    size: "lg:col-span-2",
    visual: "slots",
  },
  {
    icon: QrCode,
    title: "QR Check-in",
    desc: "Scan to open the barrier and confirm your booking.",
    tone: "bg-violet-50 text-violet-600",
    visual: "qr",
  },
  {
    icon: KeyRound,
    title: "OTP Verification",
    desc: "One-time passwords secure every check-in and handover.",
    tone: "bg-mint-50 text-mint-600",
    visual: "otp",
  },
  {
    icon: Wallet,
    title: "Quick Park Wallet",
    desc: "Preload, pay instantly, and earn cashback on every park.",
    tone: "bg-ember-50 text-ember-600",
    visual: "wallet",
  },
  {
    icon: MapPin,
    title: "Smart Map Navigation",
    desc: "Precise in-app navigation to your reserved bay.",
    tone: "bg-sky-50 text-sky-600",
    visual: "map",
    size: "lg:col-span-2",
  },
  {
    icon: Clock3,
    title: "24/7 Access",
    desc: "Round-the-clock parking across thousands of spaces.",
    tone: "bg-slate-100 text-slate-700",
    visual: "none",
  },
  {
    icon: Car,
    title: "Multiple Vehicle Types",
    desc: "Cars, bikes, EVs, SUVs — park any vehicle with ease.",
    tone: "bg-brand-50 text-brand-600",
    visual: "none",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Booking confirmations, reminders, and owner updates.",
    tone: "bg-amber-50 text-amber-600",
    visual: "none",
  },
  {
    icon: Heart,
    title: "Favorites",
    desc: "Save go-to spots for one-tap booking every time.",
    tone: "bg-rose-50 text-rose-600",
    visual: "none",
  },
  {
    icon: History,
    title: "Booking History",
    desc: "Every park, payment, and receipt in one clean timeline.",
    tone: "bg-cyan-50 text-cyan-600",
    visual: "history",
    size: "lg:col-span-2",
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    desc: "Transparent, community-driven quality for every space.",
    tone: "bg-yellow-50 text-yellow-600",
    visual: "stars",
  },
  {
    icon: Sparkles,
    title: "Smart Search",
    desc: "AI-ranked spots by price, safety, and walking distance.",
    tone: "bg-indigo-50 text-indigo-600",
    visual: "none",
  },
  {
    icon: MessageSquare,
    title: "Reviews",
    desc: "Verified drivers share honest experiences — so you park with confidence.",
    tone: "bg-fuchsia-50 text-fuchsia-600",
    visual: "none",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    desc: "Verified owners, encrypted payments, and 24/7 safety support.",
    tone: "bg-mint-50 text-mint-600",
    visual: "shield",
    size: "lg:col-span-2",
  },
];

function FeatureVisual({ type }) {
  if (type === "slots") {
    return (
      <div className="mt-5 grid grid-cols-6 gap-2">
        {[1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.04 }}
            className={`h-7 rounded-lg ${f ? "bg-gradient-to-br from-brand-500 to-brand-600 shadow-sm" : "bg-slate-100"}`}
          />
        ))}
      </div>
    );
  }
  if (type === "qr") {
    return (
      <div className="mt-5 grid w-24 grid-cols-3 gap-0.5 rounded-xl bg-white p-2 ring-1 ring-slate-200">
        {[1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1].map((b, i) => (
          <span key={i} className={`aspect-square rounded-[2px] ${b ? "bg-ink" : "bg-transparent"}`} />
        ))}
      </div>
    );
  }
  if (type === "otp") {
    return (
      <div className="mt-5 flex gap-2">
        {["4", "8", "2", "9"].map((d, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="grid h-10 w-10 place-items-center rounded-xl border border-mint-200 bg-mint-50 font-display text-base font-bold text-mint-700"
          >
            {d}
          </motion.span>
        ))}
        <span className="flex items-center text-sm font-semibold text-mint-600">✓ Verified</span>
      </div>
    );
  }
  if (type === "wallet") {
    return (
      <div className="mt-5 flex items-center gap-3">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-ember-500 to-ember-600 px-4 py-2.5 text-white shadow-glow-ember"
        >
          <Wallet size={16} />
          <span className="text-sm font-bold">₹2,450</span>
        </motion.div>
        <div className="flex items-center gap-1">
          <span className="rounded-full bg-ember-50 px-2.5 py-1 text-xs font-bold text-ember-600">+₹120</span>
          <span className="text-xs text-slate-400">cashback</span>
        </div>
      </div>
    );
  }
  if (type === "map") {
    return (
      <div className="relative mt-5 h-20 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-mint-50 ring-1 ring-slate-100">
        <svg viewBox="0 0 400 80" className="h-full w-full">
          <path d="M0 70 C 80 20, 180 90, 400 30" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="1 7" strokeLinecap="round" />
          <circle cx="30" cy="66" r="6" fill="#2563eb" stroke="white" strokeWidth="2.5" />
          <circle cx="370" cy="32" r="6" fill="#f97316" stroke="white" strokeWidth="2.5" />
        </svg>
        <span className="absolute right-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-ink backdrop-blur">5 min to bay</span>
      </div>
    );
  }
  if (type === "history") {
    return (
      <div className="mt-5 space-y-2">
        {[
          { label: "Central Plaza · Slot A12", time: "Today 10:40 AM", amt: "₹80", ok: true },
          { label: "Westside Mall · P2-09", time: "Yesterday 7:05 PM", amt: "₹120", ok: true },
          { label: "Airport T2 · Bay 14", time: "Mon 8:20 AM", amt: "₹240", ok: true },
        ].map((h, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-mint-100 text-mint-600">
              <ShieldCheck size={15} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{h.label}</p>
              <p className="text-xs text-slate-400">{h.time}</p>
            </div>
            <span className="ml-auto text-sm font-bold text-ink">{h.amt}</span>
          </motion.div>
        ))}
      </div>
    );
  }
  if (type === "stars") {
    return (
      <div className="mt-5 flex items-center gap-1.5">
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 260 }}
          >
            <Star size={18} className="fill-amber-400 text-amber-400" />
          </motion.span>
        ))}
        <span className="ml-1 text-xs font-bold text-ink">4.8</span>
        <span className="text-xs text-slate-400">· 12,400 reviews</span>
      </div>
    );
  }
  if (type === "shield") {
    return (
      <div className="mt-5 flex flex-wrap gap-2">
        {["Verified Owners", "Encrypted Payments", "ID Checks", "Safe Routes", "24/7 Support"].map((b, i) => (
          <motion.span
            key={b}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.07 }}
            className="flex items-center gap-1.5 rounded-full bg-mint-50 px-3 py-1.5 text-xs font-semibold text-mint-700"
          >
            <ShieldCheck size={12} /> {b}
          </motion.span>
        ))}
      </div>
    );
  }
  return null;
}

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-[#f6f7fb] py-20 lg:py-28">
      <div aria-hidden className="absolute inset-0 bg-dots opacity-40" />
      <div className="container-x relative">
        <SectionHeading
          tag="Features"
          title={
            <>
              Everything you need, <span className="text-gradient">built in.</span>
            </>
          }
          description="A complete parking ecosystem — from instant search to secure payments — designed to feel effortless at every step."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: EASE }}
              whileHover={{ y: -6 }}
              className={`group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-500 hover:shadow-lift ${f.size || ""}`}
            >
              <div aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-transparent blur-xl transition-all duration-500 group-hover:scale-150" />
              <div className="relative">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${f.tone} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                  <f.icon size={21} strokeWidth={2.2} />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-ink sm:text-lg">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.desc}</p>
                <FeatureVisual type={f.visual} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
