import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Home,
  Briefcase,
  Cross,
  Hotel,
  ShoppingBag,
  GraduationCap,
  HeartHandshake,
  PartyPopper,
} from "lucide-react";
import { SectionHeading } from "./ui/Primitives";
import { EASE } from "../lib/motion";

const CASES = [
  { icon: Building2, title: "Apartment Parking", desc: "Rent out unoccupied resident slots.", stat: "1.2K+ spaces", gradient: "from-brand-500 to-blue-600" },
  { icon: Home, title: "Independent House", desc: "Turn your driveway into income.", stat: "500+ houses", gradient: "from-mint-500 to-emerald-600" },
  { icon: Briefcase, title: "Offices", desc: "Flexible parking for employees & guests.", stat: "220+ offices", gradient: "from-violet-500 to-indigo-600" },
  { icon: Cross, title: "Hospitals", desc: "Priority, near-entry parking for patients.", stat: "60+ hospitals", gradient: "from-rose-500 to-red-600" },
  { icon: Hotel, title: "Hotels", desc: "Valet-quality bays for every guest.", stat: "140+ hotels", gradient: "from-amber-500 to-ember-600" },
  { icon: ShoppingBag, title: "Shopping Malls", desc: "Pre-booked slots for shopping days.", stat: "85+ malls", gradient: "from-fuchsia-500 to-purple-600" },
  { icon: GraduationCap, title: "Schools & Colleges", desc: "Safe drop-off and pickup parking.", stat: "95+ campuses", gradient: "from-sky-500 to-cyan-600" },
  { icon: HeartHandshake, title: "Wedding Halls", desc: "Guests park effortlessly, you relax.", stat: "150+ venues", gradient: "from-pink-500 to-rose-600" },
  { icon: PartyPopper, title: "Events & Stadiums", desc: "One-time or recurring event parking.", stat: "40+ events / yr", gradient: "from-lime-500 to-green-600" },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="relative overflow-hidden bg-[#f6f7fb] py-20 lg:py-28">
      <div aria-hidden className="absolute inset-0 -z-0">
        <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" />
      </div>

      <div className="container-x relative">
        <SectionHeading
          tag="Use cases"
          title={
            <>
              Every space counts. <span className="text-gradient">Every place connects.</span>
            </>
          }
          description="From apartment complexes to event venues — Quick Park works with every kind of space owner to build smarter cities."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 + Math.floor(i / 3) * 0.06, ease: EASE }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-500 hover:shadow-lift"
            >
              <div aria-hidden className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${c.gradient} opacity-[0.08] blur-2xl transition-opacity duration-500 group-hover:opacity-25`} />
              <div className="relative">
                <div className={`inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                  <c.icon size={22} strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{c.desc}</p>
                <span className="mt-4 inline-block rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors duration-300 group-hover:bg-brand-50 group-hover:text-brand-600">
                  {c.stat}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
