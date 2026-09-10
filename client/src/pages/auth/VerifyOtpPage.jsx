import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { X, ShieldCheck } from "lucide-react";
import { AuthShell } from "../../components/auth/BrandLayout";
import { AuthHeader, Logo } from "../../components/auth/PageHeader";
import { OtpInput } from "../../components/auth/OtpInput";
import { SubmitButton } from "../../components/auth/ActionButtons";
import { authService } from "../../services/auth.service";
import { extractErrorMessage } from "../../services/api";

const RESEND_SECONDS = 30;

export default function VerifyOtpPage() {
 const navigate = useNavigate();
 const [params] = useSearchParams();
 const email = params.get("email") || "";
 const purpose = params.get("purpose") || "reset";

 const [otp, setOtp] = useState("");
 const [serverError, setServerError] = useState("");
 const [timer, setTimer] = useState(RESEND_SECONDS);
 const [verifying, setVerifying] = useState(false);
 const [sendingAgain, setSendingAgain] = useState(false);

 useEffect(() => {
 if (timer <= 0) return;
 const t = setInterval(() => setTimer((v) => v - 1), 1000);
 return () => clearInterval(t);
 }, [timer]);

 const format = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

 async function verify() {
 if (otp.length !== 6) {
 toast.error("Please enter the 6-digit code");
 return;
 }
 setVerifying(true);
 setServerError("");
 try {
 await authService.verifyOtp({ email, otp, purpose });
 toast.success("Code verified!");
 if (purpose === "reset") {
 navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
 } else {
 navigate(`/success?type=otp`);
 }
 } catch (err) {
 const msg = extractErrorMessage(err, "Invalid OTP. Please try again.");
 setServerError(msg);
 toast.error(msg);
 } finally {
 setVerifying(false);
 }
 }

 async function resend() {
 setSendingAgain(true);
 try {
 await authService.sendOtp({ email, purpose });
 setOtp("");
 setTimer(RESEND_SECONDS);
 toast.success("OTP resent");
 } catch (err) {
 toast.error(extractErrorMessage(err, "Could not resend OTP"));
 } finally {
 setSendingAgain(false);
 }
 }

 return (
 <AuthShell
 backTo="/forgot-password"
 panel={{
 headline: "One last step.",
 subline: "Verify it's really you so we can keep your account safe.",
 }}
 >
 <Logo />
 <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
 <ShieldCheck size={26} />
 </div>
 <AuthHeader
 title="Enter verification code"
 subtitle={
 email ? (
 <>
 We sent a 6-digit code to{" "}
 <span className="font-semibold text-ink">{email}</span>
 </>
 ) : (
 "Enter the 6-digit code sent to your email."
 )
 }
 />

 {serverError && (
 <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
 <X size={16} className="mt-0.5 shrink-0" />
 <span>{serverError}</span>
 </div>
 )}

 <OtpInput length={6} value={otp} onChange={setOtp} error={undefined} />

 <div className="mt-4 text-center text-sm">
 {timer > 0 ? (
 <p className="text-slate-500">
 Resend in <span className="font-semibold tabular-nums text-ink">{format(timer)}</span>
 </p>
 ) : (
 <button
 onClick={resend}
 disabled={sendingAgain}
 className="font-semibold text-brand-600 transition-colors hover:text-brand-700 disabled:opacity-60"
 >
 {sendingAgain ? "Sending…" : "Resend OTP"}
 </button>
 )}
 </div>

 <div className="mt-6">
 <SubmitButton
 type="button"
 onClick={verify}
 loading={verifying}
 loadingText="Verifying…"
 disabled={otp.length !== 6}
 >
 Verify Code
 </SubmitButton>
 </div>
 </AuthShell>
 );
}