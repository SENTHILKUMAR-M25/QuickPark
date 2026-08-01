import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle, Headset } from "lucide-react";
import { SectionHeading } from "./ui/Primitives";
import { EASE } from "../lib/motion";

const FAQS = [
  {
    q: "How does Quick Park actually work?",
    a: "Open the app, search for a destination, and you'll see verified parking spots nearby with live availability and prices. Pick one, book it in seconds, pay securely, and follow in-app navigation straight to your reserved bay. Your QR or OTP opens the barrier — that's it.",
  },
  {
    q: "How much can I earn by listing my parking space?",
    a: "It depends on your location, hours, and vehicle types you accept. Most house owners earn between ₹4,000 and ₹12,000 a month for a single driveway in a busy neighbourhood. Commercial owners with 10+ slots routinely cross ₹60,000 monthly. There are no listing fees — Quick Park only takes a small commission per completed booking.",
  },
  {
    q: "Is it safe to park and to host?",
    a: "Every space is verified by our team with GPS-mapped addresses and owner identity checks. Drivers are verified with phone + documents, payments are encrypted and held securely, and both sides can rate each other. 24/7 support is available if anything ever feels off.",
  },
  {
    q: "What if I book a spot but something changes?",
    a: "Life happens. You can cancel a booking up to 15 minutes before your slot time and get an instant full refund. If your booking can't be honoured for any reason, Quick Park refunds you and helps find an alternative immediately.",
  },
  {
    q: "How does the owner set pricing and availability?",
    a: "You're in full control. Set hourly or daily rates, choose specific hours or only weekends, block out personal use times, and pick which vehicle types fit. The app even suggests a smart rate based on demand in your area — but the final call is always yours.",
  },
  {
    q: "How do I pay, and what payment methods are supported?",
    a: "Pay through UPI, credit/debit cards, net banking, or your Quick Park Wallet. Preloading your wallet unlocks cashback on every park. Money is taken only when a booking is confirmed and refunds flow back to the same method within minutes.",
  },
  {
    q: "Which cities is Quick Park available in?",
    a: "We're live across 15+ cities and expanding every month. If your city isn't listed yet, join the waitlist and we'll notify you the moment we open — plus early users get founder perks and discounted rates for the first year.",
  },
  {
    q: "Can hotels, hospitals, malls, and offices really join?",
    a: "Absolutely — they're the backbone of the network. Businesses and institutions get a dedicated onboarding team, custom white-label portals, bulk-booking dashboards, and priority integrations. Many recover thousands a month from space they already own.",
  },
  {
    q: "Is there a minimum time I have to list my space?",
    a: "No commitment, ever. Publish your space today, unpublish tomorrow. You only earn while your space is available, and you can change your schedule at any time from the owner dashboard.",
  },
  {
    q: "What makes Quick Park different from just finding street parking?",
    a: "Street parking means guessing, circling, and gambling. Quick Park gives you a guaranteed, verified, reserved spot before you leave home — with live availability, fixed pricing, secure payment, and navigation to the exact bay. For owners, it turns dead space into predictable income.",
  },
];

function FaqItem({ item, i, open, onToggle }) {
  const isOpen = open === i;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: EASE }}
      className={`overflow-hidden rounded-2xl border transition-all duration-500 ${
        isOpen ? "border-brand-100 bg-white shadow-card" : "border-slate-100 bg-white/70 hover:border-slate-200 hover:bg-white"
      }`}
    >
      <button
        onClick={() => onToggle(i)}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${i}`}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-base font-semibold text-ink sm:text-lg">
          <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-brand-50 text-xs font-extrabold text-brand-600">
            {i + 1}
          </span>
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
            isOpen ? "bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-glow" : "bg-slate-100 text-slate-500"
          }`}
        >
          <Plus size={17} strokeWidth={2.4} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${i}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-sm leading-relaxed text-slate-500 sm:pl-[3.25rem] sm:text-base">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-[#f6f7fb] py-20 lg:py-28">
      <div aria-hidden className="absolute inset-0 -z-0">
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-mint-100/60 blur-3xl" />
        <div className="absolute bottom-20 left-0 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" />
      </div>

      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:gap-16">
          {/* Sticky intro */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              align="left"
              tag="FAQ"
              title={
                <>
                  Questions? <span className="text-gradient">Answered.</span>
                </>
              }
              description="Everything you need to know about parking smarter and earning from your space. Can't find your answer? Our team replies in minutes."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a
                href="mailto:support@quickpark.app"
                className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110">
                  <MessageCircle size={19} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">Chat with us</p>
                  <p className="text-xs text-slate-400">Avg. reply 2 min</p>
                </div>
              </a>
              <a
                href="mailto:support@quickpark.app"
                className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint-50 text-mint-600 transition-transform duration-300 group-hover:scale-110">
                  <Headset size={19} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">24/7 Support</p>
                  <p className="text-xs text-slate-400">We never sleep</p>
                </div>
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-50 to-mint-50 p-4 ring-1 ring-brand-100/60">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-mint-500" />
              </span>
              <p className="text-sm font-medium text-ink">
                Still curious? <a href="#cta" className="font-semibold text-brand-600 hover:underline">Join the waitlist</a> — we'll personally answer.
              </p>
            </div>
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} item={f} i={i} open={open} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
