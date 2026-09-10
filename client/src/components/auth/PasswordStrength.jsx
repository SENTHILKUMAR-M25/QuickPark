import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { passwordRules, passwordScore } from "../../lib/validators";
import { cn } from "../../lib/utils";

const LEVEL_TEXT = ["", "text-red-500", "text-ember-500", "text-amber-500", "text-brand-500", "text-mint-500"];

export function PasswordStrength({ password = "" }) {
 const score = passwordScore(password);

 return (
 <div className="mt-2 w-full space-y-2" aria-live="polite">
 <div className="flex h-1.5 w-full gap-1">
 {passwordRules.map((_, i) => (
 <span
 key={i}
 className={cn(
 "h-full flex-1 rounded-full transition-colors duration-200",
 i < score ? `bg-current ${LEVEL_TEXT[score]}` : "bg-slate-200"
 )}
 />
 ))}
 </div>

 <motion.ul layout className="grid gap-1.5 sm:grid-cols-2">
 {passwordRules.map((rule) => {
 const pass = rule.test(password || "");
 return (
 <motion.li
 key={rule.label}
 initial={{ opacity: 0, x: -6 }}
 animate={{ opacity: 1, x: 0 }}
 className="flex items-center gap-1.5 text-xs"
 >
 <span
 className={cn(
 "grid h-4 w-4 shrink-0 place-items-center rounded-full transition-colors",
 pass
 ? "bg-mint-100 text-mint-600"
 : "bg-slate-100 text-slate-400"
 )}
 >
 {pass ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
 </span>
 <span
 className={cn(
 pass ? "text-mint-600" : "text-slate-500"
 )}
 >
 {rule.label}
 </span>
 </motion.li>
 );
 })}
 </motion.ul>
 </div>
 );
}