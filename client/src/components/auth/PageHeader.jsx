import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function AuthHeader({ title, subtitle }) {
 return (
 <div className="mb-8">
 <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-[2.1rem]">
 {title}
 </h1>
 {subtitle && (
 <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>
 )}
 </div>
 );
}

export function AuthFooter({ message, linkText, to, onToggle }) {
 return (
 <p className="mt-8 text-center text-sm text-slate-500">
 {message}{" "}
 {onToggle ? (
 <button
 onClick={onToggle}
 className="inline-flex items-center gap-0.5 font-semibold text-brand-600 transition-colors hover:text-brand-700:text-brand-300"
 >
 {linkText}
 <ChevronRight size={14} />
 </button>
 ) : (
 <Link
 to={to}
 className="inline-flex items-center gap-0.5 font-semibold text-brand-600 transition-colors hover:text-brand-700:text-brand-300"
 >
 {linkText}
 <ChevronRight size={14} />
 </Link>
 )}
 </p>
 );
}

export function Logo() {
 return (
 <div className="mb-6 flex flex-col items-center gap-2 lg:hidden">
 <Link to="/" className="flex items-center gap-2">
 <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
 <circle cx="12" cy="10" r="3" />
 </svg>
 </span>
 <span className="font-display text-lg font-bold tracking-tight text-ink">
 Quick<span className="text-gradient">Park</span>
 </span>
 </Link>
 </div>
 );
}