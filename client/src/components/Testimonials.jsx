import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Car, Home, Briefcase } from "lucide-react";
import { SectionHeading } from "./ui/Primitives";
import { EASE } from "../lib/motion";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

const CATEGORIES = [
  { id: "all", label: "Everyone", icon: Quote },
  { id: "drivers", label: "Drivers", icon: Car },
  { id: "owners", label: "House Owners", icon: Home },
  { id: "business", label: "Businesses", icon: Briefcase },
];

const TESTIMONIALS = [
  {
    quote:
      "I used to leave for work 30 minutes early just to hunt for parking. Now I book my spot from bed, drive straight to it, and scan my way in. It genuinely feels like cheating the city.",
    name: "Ananya Sharma",
    role: "Product Manager · Bengaluru",
    category: "drivers",
    gradient: "from-brand-500 to-blue-600",
    initials: "AS",
    meta: "2,400+ bookings",
  },
  {
    quote:
      "My driveway sat empty eight hours a day. Quick Park turned it into ₹9,000 a month of passive income — with zero effort. I set my hours once and the app does everything else.",
    name: "Ramesh Iyer",
    role: "House Owner · Chennai",
    category: "owners",
    gradient: "from-mint-500 to-emerald-600",
    initials: "RI",
    meta: "Earns ₹9k / month",
  },
  {
    quote:
      "We listed our event venue's overflow lot for weddings and conferences. Guests now park stress-free, and we've recovered 22% of our running costs. It's a no-brainer for venues.",
    name: "Kavita Deshmukh",
    role: "Venue Director · Pune",
    category: "business",
    gradient: "from-ember-500 to-orange-600",
    initials: "KD",
    meta: "220+ event bookings",
  },
  {
    quote:
      "As a hospital, patient parking was our biggest complaint. Quick Park's priority bays mean families arrive calm instead of frantic. The admin dashboard is beautifully simple.",
    name: "Dr. Mohan Reddy",
    role: "Operations Head · Hospital",
    category: "business",
    gradient: "from-violet-500 to-indigo-600",
    initials: "MR",
    meta: "1.1K patient parks",
  },
  {
    quote:
      "The OTP and QR check-in give me total peace of mind. I've parked in four cities this quarter and every single space was exactly as verified and rated. Never once felt unsafe.",
    name: "Priya Menon",
    role: "Travel Consultant · Kochi",
    category: "drivers",
    gradient: "from-rose-500 to-red-600",
    initials: "PM",
    meta: "140+ trips",
  },
  {
    quote:
      "We partnered with Quick Park for our monthly corporate offsite parking. Setup took one call, billing is automatic, and our team's morning chaos simply disappeared.",
    name: "Arjun Nair",
    role: "Office Manager · Hyderabad",
    category: "business",
    gradient: "from-sky-500 to-cyan-600",
    initials: "AN",
    meta: "9 office locations",
  },
];

function Stars({ n = 5 }) {
  return (
    <div className="flex gap-1" aria-label={`${n} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 260, damping: 16 }}
        >
          <Star size={16} className="fill-amber-400 text-amber-400" />
        </motion.span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [cat, setCat] = useState("all");
  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const filtered = TESTIMONIALS.filter((t) => cat === "all" || t.category === cat);

  const go = useCallback(
    (dir) => {
      setIndex((i) => (i + dir + filtered.length) % filtered.length);
    },
    [filtered.length]
  );

  useEffect(() => {
    setIndex(0);
  }, [cat]);

  useEffect(() => {
    if (!isDesktop) {
      clearTimeout(timer.current);
      return;
    }
    timer.current = setTimeout(() => go(1), 7000);
    return () => clearTimeout(timer.current);
  }, [index, cat, go, isDesktop]);

  const t = filtered[index % filtered.length] || filtered[0];
  const category = CATEGORIES.find((c) => c.id === t?.category);

  if (!t) return null;

  return (
    <section id="testimonials" className="relative overflow-hidden py-20 lg:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-mint-100/50 blur-3xl" />
      </div>

      <div className="container-x">
        <SectionHeading
          tag="Testimonials"
          title={
            <>
              Trusted by the city. <span className="text-gradient">Loved by real people.</span>
            </>
          }
          description="Drivers, home owners, and businesses — here's what happens when parking finally works."
        />

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                cat === c.id ? "text-white" : "text-slate-500 hover:text-ink"
              }`}
            >
              {cat === c.id && (
                <motion.span
                  layoutId="testimonial-pill"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 shadow-glow"
                />
              )}
              <c.icon size={15} className="relative" />
              <span className="relative">{c.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Carousel */}
        <div className="relative mx-auto mt-12 max-w-4xl">
          <div className="perspective-1200">
            <AnimatePresence mode="wait" custom={index}>
              <motion.figure
                key={`${cat}-${index}`}
                initial={{ opacity: 0, y: 44, rotateX: -6 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -30, rotateX: 6 }}
                transition={{ duration: 0.65, ease: EASE }}
                className="relative overflow-hidden rounded-[36px] bg-white p-8 shadow-lift ring-1 ring-slate-100 sm:p-12"
              >
                {/* decorative blob */}
                <div aria-hidden className={`absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br ${t.gradient} opacity-[0.08] blur-2xl`} />
                <div aria-hidden className="absolute right-10 top-8 text-6xl text-brand-100">
                  <Quote size={64} strokeWidth={1} className="fill-brand-100 text-brand-100" />
                </div>

                <div className="relative">
                  <Stars />
                  <blockquote className="mt-5 font-display text-xl font-semibold leading-[1.45] tracking-tight text-ink sm:text-2xl">
                    “{t.quote}”
                  </blockquote>

                  <figcaption className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 260 }}
                        className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${t.gradient} font-display text-lg font-extrabold text-white shadow-soft`}
                      >
                        {t.initials}
                      </motion.div>
                      <div>
                        <p className="font-display font-bold text-ink">{t.name}</p>
                        <p className="text-sm text-slate-500">{t.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${category?.id === "drivers" ? "bg-brand-50 text-brand-700" : category?.id === "owners" ? "bg-mint-50 text-mint-700" : "bg-ember-50 text-ember-600"}`}>
                        <category.icon size={12} /> {category?.label}
                      </span>
                      <span className="hidden text-xs font-semibold text-slate-400 sm:block">{t.meta}</span>
                    </div>
                  </figcaption>
                </div>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-ink shadow-soft transition-all duration-300 hover:scale-105 hover:border-brand-300 hover:text-brand-600"
            >
              <ChevronLeft size={19} />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial navigation">
              {filtered.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-selected={i === index}
                  className="group p-1.5"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-8 bg-gradient-to-r from-brand-500 to-mint-500" : "w-3 bg-slate-200 group-hover:bg-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-ink shadow-soft transition-all duration-300 hover:scale-105 hover:border-brand-300 hover:text-brand-600"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
