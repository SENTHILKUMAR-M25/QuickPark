import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Mail, X } from "lucide-react";
import { AuthShell } from "../../components/auth/BrandLayout";
import { AuthHeader, Logo } from "../../components/auth/PageHeader";
import { Input } from "../../components/auth/FormControls";
import { SubmitButton } from "../../components/auth/ActionButtons";
import { forgotPasswordSchema } from "../../lib/validators";
import { authService } from "../../services/auth.service";
import { extractErrorMessage } from "../../services/api";

export default function ForgotPasswordPage() {
 const navigate = useNavigate();
 const [serverError, setServerError] = useState("");

 const {
 register,
 handleSubmit,
 formState: { errors, isSubmitting },
 } = useForm({ resolver: zodResolver(forgotPasswordSchema), mode: "onChange" });

 const onSubmit = async (values) => {
 setServerError("");
 try {
 await authService.forgotPassword({ email: values.email });
 toast.success("OTP sent to your email");
 navigate(`/verify-otp?email=${encodeURIComponent(values.email)}&purpose=reset`);
 } catch (err) {
 const msg = extractErrorMessage(err, "Could not send OTP. Try again.");
 setServerError(msg);
 toast.error(msg);
 }
 };

 return (
 <AuthShell
 backTo="/login"
 panel={{
 role: "USER",
 headline: "We'll get you back in quickly.",
 subline: "Enter your account email and we'll send a one-time-passcode to reset your password.",
 }}
 >
 <Logo />
 <AuthHeader
 title="Forgot password?"
 subtitle="No worries. Enter your email and we'll send you an OTP to reset it."
 />

 {serverError && (
 <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
 <X size={16} className="mt-0.5 shrink-0" />
 <span>{serverError}</span>
 </div>
 )}

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
 <Input
 label="Email address"
 id="fp-email"
 type="email"
 placeholder="you@example.com"
 icon={Mail}
 autoComplete="email"
 error={errors.email?.message}
 {...register("email")}
 />
 <SubmitButton type="submit" loading={isSubmitting} loadingText="Sending OTP…">
 Send OTP
 </SubmitButton>
 </form>

 <p className="mt-8 text-center text-sm text-slate-500">
 Remembered it?{" "}
 <button
 onClick={() => navigate("/login")}
 className="font-semibold text-brand-600 hover:text-brand-700"
 >
 Back to sign in
 </button>
 </p>
 </AuthShell>
 );
}