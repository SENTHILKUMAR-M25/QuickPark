import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Sun, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";
import { EASE } from "../../lib/motion";

export function BrandPanel({ role, statItems, headline, subline }) {
  const isProvider = role === "PROVIDER";
  return (
    <div className="relative hidden overflow-hidden lg:flex lg:w-[46%]">
      {/* backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-900 to-ink-950" />
      <div className="absolute -left-24 top-[-15%] h-[40rem] w-[40rem] rounded-full bg-mint-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-16 h-[34rem] w-[34rem] rounded-full bg-brand-400/30 blur-3xl" />
      <div className="noise absolute inset-0" />

      <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white backdrop-blur">
            <MapPin size={22} strokeWidth={2.4} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Quick<span className="text-mint-300">Park</span>
          </span>
        </Link>

        <div className="my-auto max-w-md py-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-mint-200 backdrop-blur"
          >
            <Sparkles size={13} />
            {isProvider ? "Partner earnings made simple" : "Smart parking, effortless"}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-white xl:text-5xl"
          >
            {headline}
          </motion.h1>
          {subline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="mt-4 text-base leading-relaxed text-brand-100/80"
            >
              {subline}
            </motion.p>
          )}

          {/* floating parking card */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
            className="mt-10 max-w-sm rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-brand-100/70">Upcoming booking</p>
                <p className="mt-0.5 font-display text-lg font-bold text-white">
                  City Center Mall
                </p>
              </div>
              <ShieldCheck className="text-mint-300" size={26} />
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-brand-50">Slot B · 2 hrs</span>
              <span className="font-semibold text-mint-300">₹120</span>
            </div>
            <div className="mt-4 flex h-2.5 w-full gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "flex-1 rounded-full",
                    i < 5 ? "bg-mint-400" : "bg-white/15"
                  )}
                />
              ))}
            </div>
          </motion.div>

          {statItems && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              {statItems.map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
                  <p className="font-display text-xl font-bold text-white">{s.value}</p>
                  <p className="text-[11px] text-brand-100/70">{s.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <p className="text-xs text-white/50">
          Secure &amp; encrypted · {new Date().getFullYear()} Quick Park
        </p>
      </div>
    </div>
  );
}

export function AuthShell({ children, backTo, role = "USER", panel }) {
  const { theme, toggle } = useTheme();
  return (
    <div className="flex min-h-screen bg-[#fbfcfe] dark:bg-ink-950">
      <BrandPanel
        role={role}
        {...panel}
      />

      <div className="relative flex w-full flex-col lg:w-[54%]">
        {/* top bar */}
        <header className="flex w-full items-center justify-between p-5 lg:p-8">
          <Link
            to={backTo || "/"}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-ink dark:text-ink-400 dark:hover:text-ink-100"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white/70 text-ink transition-colors hover:bg-slate-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:bg-ink-800"
          >
            {theme === "dark" ? <Sun size={18} /> : <MoonIcon size={18} />}
          </button>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 pb-16 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function MoonIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}