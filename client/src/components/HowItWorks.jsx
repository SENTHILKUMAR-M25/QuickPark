import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  MousePointerClick,
  CalendarCheck,
  Navigation,
  Car,
  UserPlus,
  Plus,
  Clock,
  BellRing,
  Coins,
} from "lucide-react";
import { SectionHeading } from "./ui/Primitives";
import { EASE } from "../lib/motion";

const DRIVER_STEPS = [
  { icon: Search, title: "Search", desc: "Tell us where and when you need parking." },
  { icon: MousePointerClick, title: "Choose", desc: "Compare verified spots by price & distance." },
  { icon: CalendarCheck, title: "Book", desc: "Reserve instantly with a guaranteed slot." },
  { icon: Navigation, title: "Navigate", desc: "Follow GPS straight to your exact bay." },
  { icon: Car, title: "Park", desc: "QR check-in, park, and drive on stress-free." },
];

const OWNER_STEPS = [
  { icon: UserPlus, title: "Register", desc: "Create your owner profile in under 5 minutes." },
  { icon: Plus, title: "Add Parking", desc: "List your driveway, garage, or parking lot." },
  { icon: Clock, title: "Set Availability", desc: "Choose hours, rates, and vehicle types." },
  { icon: BellRing, title: "Receive Bookings", desc: "Get notified the moment a driver books." },
  { icon: Coins, title: "Earn Income", desc: "Withdraw earnings straight to your bank." },
];

function Timeline({ steps, tone, label, title, desc }) {
  const theme =
    tone === "drivers"
      ? {
          ring: "from-brand-500 to-blue-600",
          text: "text-brand-600",
          chip: "bg-brand-50 text-brand-600 border-brand-100",
          line: "bg-gradient-to-b from-brand-200 to-brand-50",
          bg: "bg-white",
          numBg: "bg-gradient-to-br from-brand-600 to-brand-700",
        }
      : {
          ring: "from-mint-500 to-emerald-600",
          text: "text-mint-600",
          chip: "bg-mint-50 text-mint-600 border-mint-100",
          line: "bg-gradient-to-b from-mint-200 to-mint-50",
          bg: "bg-white",
          numBg: "bg-gradient-to-br from-mint-500 to-emerald-600",
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`relative overflow-hidden rounded-[32px] border border-slate-100 p-6 shadow-card sm:p-9 ${theme.bg}`}
    >
      <div aria-hidden className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${theme.ring}`} />
      <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${theme.chip}`}>
        {label}
      </span>
      <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>

      <div className="mt-8 space-y-0">
        {steps.map((s, i) => (
          <div key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
            {i < steps.length - 1 && (
              <span aria-hidden className={`absolute left-[22px] top-14 h-[calc(100%-3.5rem)] w-px ${theme.line}`} />
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
              className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white shadow-soft ${theme.numBg}`}
            >
              <s.icon size={20} strokeWidth={2.2} />
              <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-ink text-[9px] font-extrabold text-white">
                {i + 1}
              </span>
            </motion.div>
            <div className="pt-1">
              <h4 className="font-display text-base font-bold text-ink">{s.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-20 lg:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-mint-100/60 blur-3xl" />
      </div>

      <div className="container-x">
        <SectionHeading
          tag="How it works"
          title={
            <>
              Two sides. <span className="text-gradient">One seamless flow.</span>
            </>
          }
          description="Whether you're parking or providing, the journey is effortless — from first tap to stress-free parking and steady income."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Timeline
            tone="drivers"
            label="For drivers"
            title="Park in minutes, not hours"
            desc="Find, book, and reach your spot without circling the block even once."
            steps={DRIVER_STEPS}
          />
          <Timeline
            tone="owners"
            label="For owners"
            title="Turn idle space into income"
            desc="Your driveway or lot works while you don't — on your own schedule."
            steps={OWNER_STEPS}
          />
        </div>
      </div>
    </section>
  );
}
