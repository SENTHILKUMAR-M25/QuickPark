import React from "react";
import { motion } from "framer-motion";
import logo from "../../public/logo.jpeg";

/** Full-height bootstrap skeleton shown while authentication is being resolved. */
export default function AuthLoader({ label = "Preparing your experience…" }) {
  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-[#fbfcfe]">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6"
      >
        <motion.span
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(37,99,235,0.35)",
              "0 0 0 18px rgba(37,99,235,0)",
            ],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          className="block h-16 w-16 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 ring-1 ring-white"
        >
          <img src={logo} alt="Quick Park" className="h-full w-full object-cover opacity-90" />
        </motion.span>

        <div className="flex flex-col items-center gap-2">
          <p className="font-display text-base font-bold text-ink">
            Quick<span className="text-gradient">Park</span>
          </p>
          <p className="text-xs text-slate-400">{label}</p>
        </div>

        <div className="flex space-x-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
              className="h-2 w-2 rounded-full bg-brand-500"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}