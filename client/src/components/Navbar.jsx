import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Menu, X, ArrowRight } from "lucide-react";
import { MagneticButton } from "./ui/Primitives";
import logo from "../../public/logo.jpeg"
const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "For Drivers", href: "#benefits" },
  { label: "For Owners", href: "#owners" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="container-x">
        <div
          className={`mt-4 flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-6 ${
            scrolled ? "glass-dark shadow-card" : "bg-transparent"
          }`}
        >
          <a href="#top" className="flex items-center gap-2.5" aria-label="Quick Park home">
            <img src={logo} className="relative grid h-12 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow" />
            
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Quick<span className="text-gradient">Park</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-ink"
              >
                {l.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-brand-500 to-mint-500 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="#faq"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-600"
            >
              Sign in
            </a>
            <MagneticButton className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-lift transition-shadow hover:shadow-xl">
              Join waitlist
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </MagneticButton>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white/70 text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="container-x lg:hidden"
          >
            <div className="mt-2 rounded-2xl glass-dark shadow-lift p-4">
              <nav className="flex flex-col" aria-label="Mobile">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
              <div className="mt-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white"
                >
                  Join the waitlist
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
