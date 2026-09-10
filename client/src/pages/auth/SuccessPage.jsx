import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthShell } from "../../components/auth/BrandLayout";
import { SubmitButton } from "../../components/auth/ActionButtons";

const CONTENT = {
 register: {
 title: "Account created",
 message: "Your Quick Park account has been created successfully. Verify your email to get started.",
 },
 provider: {
 title: "Partner account created",
 message: "Your provider account was created. Our team will verify your documents shortly.",
 },
 reset: {
 title: "Password updated",
 message: "Your password has been updated successfully.",
 },
 otp: {
 title: "Verified",
 message: "Your verification was completed successfully.",
 },
};

export default function SuccessPage() {
 const navigate = useNavigate();
 const [params] = useSearchParams();
 const type = params.get("type") || "register";
 const config = CONTENT[type] || CONTENT.register;

 return (
 <AuthShell backTo="/" panel={{ headline: "You're all set.", subline: "Welcome to the Quick Park family." }}>
 <div className="flex flex-col items-center text-center">
 <motion.div
 initial={{ scale: 0, rotate: -30 }}
 animate={{ scale: 1, rotate: 0 }}
 transition={{ type: "spring", stiffness: 260, damping: 18 }}
 className="relative mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-mint-400 to-mint-600 text-white shadow-glow-mint"
 >
 <motion.span
 initial={{ scale: 0, opacity: 0 }}
 animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 1] }}
 transition={{ delay: 0.15, duration: 0.5 }}
 className="grid h-20 w-20 place-items-center"
 >
 <Check size={40} strokeWidth={3} />
 </motion.span>
 </motion.div>

 <motion.h1
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="font-display text-3xl font-bold tracking-tight text-ink"
 >
 {config.title}
 </motion.h1>
 <motion.p
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="mt-3 text-sm leading-relaxed text-slate-500"
 >
 {config.message}
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 }}
 className="mt-8 w-full"
 >
 <SubmitButton type="button" onClick={() => navigate("/login")}>
 Go to Login
 </SubmitButton>
 </motion.div>
 </div>
 </AuthShell>
 );
}