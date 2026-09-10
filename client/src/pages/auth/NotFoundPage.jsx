import { motion } from "framer-motion";
import { MapPin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthShell } from "../../components/auth/BrandLayout";

export default function NotFoundPage() {
 return (
 <AuthShell backTo="/" panel={{ headline: "You've taken a wrong turn.", subline: "Let's get you back to parking." }}>
 <div className="flex flex-col items-center text-center">
 <motion.div
 initial={{ scale: 0.6, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ type: "spring", stiffness: 200, damping: 16 }}
 className="mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow"
 >
 <MapPin size={36} />
 </motion.div>
 <p className="font-display text-6xl font-bold text-brand-600">404</p>
 <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
 Page not found
 </h1>
 <p className="mt-3 text-sm leading-relaxed text-slate-500">
 The page you're looking for doesn't exist or has moved.
 </p>
 <Link
 to="/"
 className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-105"
 >
 <ArrowLeft size={16} />
 Back to home
 </Link>
 </div>
 </AuthShell>
 );
}