import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  ArrowRight,
  Heart,
} from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: ["Find Parking", "List a Space", "Quick Park Wallet", "Pricing", "Mobile App", "Referral Program"],
  },
  {
    title: "Features",
    links: ["Live Availability", "QR Check-in", "GPS Navigation", "Secure Payments", "Owner Dashboard", "Smart Notifications"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press Kit", "Blog", "Partners", "Contact"],
  },
  {
    title: "Support",
    links: ["Help Center", "Safety & Trust", "FAQs", "Status", "Community", "Report an Issue"],
  },
];

const LEGAL = ["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy"];

const SOCIALS = [
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Facebook, label: "Facebook" },
  { icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 4000);
  }

  return (
    <footer className="relative overflow-hidden bg-ink-950 pt-20 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-mint-600/15 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
      </div>

      <div className="container-x relative">
        {/* Top: newsletter + brand */}
        <div className="grid gap-12 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <a href="#top" className="inline-flex items-center gap-2.5" aria-label="Quick Park home">
              <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow">
                <MapPin size={22} className="text-white" strokeWidth={2.4} />
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-ink-950 bg-mint-400" />
              </span>
              <span className="font-display text-2xl font-extrabold tracking-tight">
                Quick<span className="bg-gradient-to-r from-brand-400 to-mint-400 bg-clip-text text-transparent">Park</span>
              </span>
            </a>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">
              The smart parking marketplace. Find and reserve parking in seconds — or turn your
              unused space into income. Building calmer, cleaner cities, one parking space at a time.
            </p>

            <form onSubmit={submit} className="mt-7 max-w-md" aria-label="Newsletter signup">
              <label htmlFor="newsletter" className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                Get launch updates & perks
              </label>
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-2 backdrop-blur transition-colors duration-300 focus-within:border-brand-400/60">
                <Mail size={17} className="ml-2 shrink-0 text-white/40" />
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-white placeholder-white/35 outline-none"
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.94 }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(37,99,235,0.2),0_16px_40px_-10px_rgba(37,99,235,0.7)]"
                >
                  {done ? <CheckCircle2 size={16} /> : <Send size={15} />}
                  {done ? "Subscribed" : "Notify me"}
                </motion.button>
              </div>
              <p className="mt-2.5 text-xs text-white/35">
                {done
                  ? "You're on the list. Watch your inbox for a welcome surprise."
                  : "No spam. Unsubscribe anytime."}
              </p>
            </form>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#top"
                        className="group inline-flex items-center gap-1 text-sm text-white/60 transition-colors duration-300 hover:text-white"
                      >
                        {l}
                        <ArrowRight size={12} className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact strip */}
        <div className="grid gap-6 border-t border-white/10 py-8 sm:grid-cols-3">
          <a href="mailto:support@quickpark.app" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-mint-400 transition-colors duration-300 group-hover:bg-mint-500 group-hover:text-white">
              <Mail size={17} />
            </span>
            <span>
              <span className="block text-xs text-white/40">Email us</span>
              <span className="text-sm font-semibold text-white/80 group-hover:text-white">support@quickpark.app</span>
            </span>
          </a>
          <a href="tel:+919000000000" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-brand-400 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
              <Phone size={17} />
            </span>
            <span>
              <span className="block text-xs text-white/40">Call us</span>
              <span className="text-sm font-semibold text-white/80 group-hover:text-white">+91 90000 00000</span>
            </span>
          </a>
          <a href="#top" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-ember-400 transition-colors duration-300 group-hover:bg-ember-500 group-hover:text-white">
              <MapPin size={17} />
            </span>
            <span>
              <span className="block text-xs text-white/40">Headquarters</span>
              <span className="text-sm font-semibold text-white/80 group-hover:text-white">Bengaluru, India</span>
            </span>
          </a>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 py-8 lg:flex-row">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Quick Park. Crafted with{" "}
            <Heart size={13} className="inline fill-rose-500 text-rose-500" /> for calmer cities.
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l}>
                <a href="#top" className="text-xs text-white/40 transition-colors duration-300 hover:text-white">
                  {l}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#top"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] text-white/60 transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-brand-500 hover:to-brand-700 hover:text-white hover:shadow-glow"
              >
                <s.icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
