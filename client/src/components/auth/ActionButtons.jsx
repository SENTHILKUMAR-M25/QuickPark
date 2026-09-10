import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

export function SubmitButton({
 children,
 loading = false,
 loadingText = "Please wait…",
 type = "submit",
 className,
 disabled,
 ...props
}) {
 return (
 <motion.button
 type={type}
 whileHover={!loading && !disabled ? { scale: 1.015 } : undefined}
 whileTap={!loading && !disabled ? { scale: 0.98 } : undefined}
 disabled={loading || disabled}
 className={cn(
 "group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-300",
 "hover:shadow-glow hover:brightness-105",
 "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100 disabled:hover:shadow-glow",
 className
 )}
 {...props}
 >
 {loading ? (
 <>
 <Loader2 size={17} className="animate-spin" />
 <span>{loadingText}</span>
 </>
 ) : (
 <>
 <span>{children}</span>
 <ArrowRight
 size={16}
 className="transition-transform duration-300 group-hover:translate-x-0.5"
 />
 </>
 )}
 </motion.button>
 );
}

export function SocialButton({ children, icon: Icon, onClick, disabled }) {
 return (
 <motion.button
 type="button"
 whileHover={!disabled ? { scale: 1.01 } : undefined}
 whileTap={!disabled ? { scale: 0.98 } : undefined}
 onClick={onClick}
 disabled={disabled}
 className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-ink-700 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60:bg-ink-800"
 >
 {Icon && <Icon size={18} />}
 <span className="flex items-center gap-1.5">
 {children}
 <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
 Soon
 </span>
 </span>
 </motion.button>
 );
}

export function Divider({ label = "or continue with" }) {
 return (
 <div className="relative my-6">
 <div className="absolute inset-0 flex items-center">
 <span className="w-full border-t border-slate-200" />
 </div>
 <div className="relative flex justify-center">
 <span className="bg-[#fbfcfe] px-4 text-xs font-medium uppercase tracking-wider text-slate-400">
 {label}
 </span>
 </div>
 </div>
 );
}