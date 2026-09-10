import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function OtpInput({ length = 6, value, onChange, error, disabled }) {
 const refs = useRef([]);

 function setValueAt(index, char) {
 const chars = value.split("");
 chars[index] = char;
 onChange(chars.join(""));
 }

 function handleKeyDown(index, e) {
 if (e.key === "Backspace") {
 e.preventDefault();
 if (value[index]) {
 setValueAt(index, "");
 } else if (index > 0) {
 refs.current[index - 1]?.focus();
 setValueAt(index - 1, "");
 }
 }
 if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
 if (e.key === "ArrowRight" && index < length - 1) refs.current[index + 1]?.focus();
 }

 function handleChange(index, e) {
 const digit = e.target.value.replace(/\D/g, "").slice(-1);
 setValueAt(index, digit);
 if (digit && index < length - 1) refs.current[index + 1]?.focus();
 }

 function handlePaste(e) {
 e.preventDefault();
 const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
 if (digits) {
 onChange(digits);
 refs.current[Math.min(digits.length, length - 1)]?.focus();
 }
 }

 const boxClass = () =>
 cn(
 "h-14 w-11 sm:h-16 sm:w-14 rounded-xl border text-center text-lg font-semibold outline-none transition-all duration-200",
 "border-slate-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10:border-brand-500",
 disabled && "cursor-not-allowed opacity-60",
 error && "border-red-300"
 );

 return (
 <div>
 <div className="flex w-full justify-center gap-2.5 sm:gap-3">
 {Array.from({ length }).map((_, i) => (
 <motion.input
 key={i}
 ref={(el) => (refs.current[i] = el)}
 inputMode="numeric"
 autoComplete={i === 0 ? "one-time-code" : "off"}
 maxLength={1}
 value={value[i] || ""}
 disabled={disabled}
 aria-label={`OTP digit ${i + 1}`}
 onKeyDown={(e) => handleKeyDown(i, e)}
 onChange={(e) => handleChange(i, e)}
 onPaste={i === 0 ? handlePaste : undefined}
 onFocus={(e) => e.target.select()}
 whileFocus={{ scale: 1.05 }}
 className={boxClass()}
 />
 ))}
 </div>
 {error && <p className="mt-2 text-center text-xs font-medium text-red-500">{error}</p>}
 </div>
 );
}