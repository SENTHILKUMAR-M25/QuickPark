import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
 Mail,
 User,
 Building2,
 UserRound,
 X,
 ShieldCheck,
 IdCard,
 ScrollText,
 ArrowLeft,
 ArrowRight,
 Check,
 Car,
 Store,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { AuthShell } from "../../components/auth/BrandLayout";
import { AuthHeader, AuthFooter, Logo } from "../../components/auth/PageHeader";
import { Input, PasswordInput, Checkbox, Select } from "../../components/auth/FormControls";
import { PasswordStrength } from "../../components/auth/PasswordStrength";
import { SubmitButton, SocialButton, Divider } from "../../components/auth/ActionButtons";
import { FileUpload } from "../../components/auth/FileUpload";
import { userRegisterSchema, providerRegisterSchema } from "../../lib/validators";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { extractErrorMessage } from "../../services/api";

const USER_STATS = [
 { value: "5000+", label: "Parking spots" },
 { value: "45 sec", label: "Avg booking time" },
 { value: "4.9★", label: "Rating" },
];

const PROVIDER_STATS = [
 { value: "₹3,20,000", label: "Avg. yearly earnings" },
 { value: "10k+", label: "Active parking owners" },
 { value: "24 hrs", label: "First payout" },
];

const PROVIDER_TYPES = [
 "HOUSE",
 "APARTMENT",
 "COMMERCIAL",
 "HOTEL",
 "HOSPITAL",
 "MALL",
 "OFFICE",
 "SCHOOL",
];

const TYPE_LABELS = {
 HOUSE: "Individual House",
 APARTMENT: "Apartment",
 COMMERCIAL: "Commercial Parking",
 HOTEL: "Hotel",
 HOSPITAL: "Hospital",
 MALL: "Mall",
 OFFICE: "Office",
 SCHOOL: "School",
};

const STEPS = [
 { title: "Account", icon: UserRound },
 { title: "Verification", icon: ShieldCheck },
 { title: "Terms", icon: ScrollText },
];

const ROLE_OPTIONS = [
 { value: "USER", label: "Driver", caption: "Find & book parking", icon: Car },
 { value: "PROVIDER", label: "Provider", caption: "Earn from your space", icon: Store },
];

export default function RegisterPage({ initialRole = "USER" }) {
 const navigate = useNavigate();
 const { applyAuth } = useAuth();
 const [role, setRole] = useState(initialRole === "PROVIDER" ? "PROVIDER" : "USER");

 const isProvider = role === "PROVIDER";

 const switchRole = (next) => {
 if (next === role) return;
 setRole(next);
 };

 const panel = isProvider
 ? {
 headline: (
 <>
 Turn an empty space into <span className="text-mint-300">monthly income</span>.
 </>
 ),
 subline:
 "List your parking space once — we handle discovery, booking and payouts.",
 statItems: PROVIDER_STATS,
 }
 : {
 headline: (
 <>
 Find a spot, <span className="text-mint-300">park</span> it, and go.
 </>
 ),
 subline:
 "Join thousands of drivers who book better parking spots in seconds.",
 statItems: USER_STATS,
 };

 return (
 <AuthShell backTo="/" role={role} panel={panel}>
 <Logo />
 <AuthHeader
 title={isProvider ? "Become a parking partner" : "Create your account"}
 subtitle={
 isProvider
 ? "Earn money by listing your parking space."
 : "Find and book parking in seconds."
 }
 />

 <RoleToggle role={role} onChange={switchRole} />

 <div className="mt-6">
 {isProvider ? (
 <ProviderForm applyAuth={applyAuth} navigate={navigate} onSwitchRole={() => switchRole("USER")} />
 ) : (
 <UserForm applyAuth={applyAuth} navigate={navigate} onSwitchRole={() => switchRole("PROVIDER")} />
 )}
 </div>
 </AuthShell>
 );
}

function RoleToggle({ role, onChange }) {
 return (
 <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white/60 p-1.5">
 {ROLE_OPTIONS.map((opt) => {
 const Icon = opt.icon;
 const active = role === opt.value;
 return (
 <button
 key={opt.value}
 type="button"
 onClick={() => onChange(opt.value)}
 aria-pressed={active}
 className={cn(
 "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left transition-all duration-200",
 active
 ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-glow"
 : "text-slate-500 hover:bg-slate-50:bg-ink-800"
 )}
 >
 <span
 className={cn(
 "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
 active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-400"
 )}
 >
 <Icon size={18} />
 </span>
 <span className="min-w-0">
 <span className="block text-sm font-semibold leading-tight">{opt.label}</span>
 <span className={cn("block truncate text-[11px]", active ? "text-white/80" : "text-slate-400")}>
 {opt.caption}
 </span>
 </span>
 {active && <Check size={15} className="ml-auto shrink-0" strokeWidth={3} />}
 </button>
 );
 })}
 </div>
 );
}

function ErrorBanner({ message }) {
 if (!message) return null;
 return (
 <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
 <X size={16} className="mt-0.5 shrink-0" />
 <span>{message}</span>
 </div>
 );
}

function UserForm({ applyAuth, navigate, onSwitchRole }) {
 const [serverError, setServerError] = useState("");
 const [password, setPassword] = useState("");

 const {
 register,
 handleSubmit,
 watch,
 formState: { errors, isSubmitting },
 } = useForm({
 resolver: zodResolver(userRegisterSchema),
 defaultValues: { acceptTerms: false },
 mode: "onChange",
 });

 const watchPassword = watch("password", "");

 const onSubmit = async (values) => {
 setServerError("");
 try {
 const payload = {
 fullName: values.fullName,
 email: values.email,
 phone: values.phone,
 password: values.password,
 };
 const { data } = await authService.registerUser(payload);
 applyAuth(data.data);
 toast.success("Account created! Check your email to verify.");
 navigate("/user/dashboard", { replace: true });
 } catch (err) {
 const msg = extractErrorMessage(err, "Could not create account.");
 setServerError(msg);
 toast.error(msg);
 }
 };

 return (
 <>
 <ErrorBanner message={serverError} />
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
 <Input
 label="Full name"
 id="fullName"
 placeholder="Alex Carter"
 icon={User}
 autoComplete="name"
 error={errors.fullName?.message}
 {...register("fullName")}
 />

 <Input
 label="Email address"
 id="email"
 type="email"
 placeholder="you@example.com"
 icon={Mail}
 autoComplete="email"
 error={errors.email?.message}
 {...register("email")}
 />

 <Input
 label="Mobile number"
 id="phone"
 type="tel"
 placeholder="98765 43210"
 icon={PhoneIcon}
 autoComplete="tel"
 error={errors.phone?.message}
 {...register("phone")}
 />

 <div>
 <PasswordInput
 label="Password"
 id="password"
 placeholder="Create a strong password"
 autoComplete="new-password"
 error={errors.password?.message}
 {...register("password", { onChange: (e) => setPassword(e.target.value) })}
 />
 <PasswordStrength password={watchPassword || password} />
 </div>

 <PasswordInput
 label="Confirm password"
 id="confirmPassword"
 placeholder="Re-enter your password"
 autoComplete="new-password"
 error={errors.confirmPassword?.message}
 {...register("confirmPassword")}
 />

 <Checkbox
 id="acceptTerms"
 label={
 <>
 I agree to the{" "}
 <a href="/terms" className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700">
 Terms &amp; Conditions
 </a>{" "}
 and{" "}
 <a href="/privacy" className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700">
 Privacy Policy
 </a>
 </>
 }
 error={errors.acceptTerms?.message}
 {...register("acceptTerms")}
 />

 <SubmitButton type="submit" loading={isSubmitting} loadingText="Creating account…">
 Create Account
 </SubmitButton>
 </form>

 <Divider />
 <SocialButton icon={GoogleIcon}>Continue with Google</SocialButton>

 <AuthFooter
 message="Already have an account?"
 linkText="Sign in"
 onToggle={() => navigate("/login")}
 />
 <p className="mt-3 text-center text-sm text-slate-500">
 Own a parking space?{" "}
 <button
 type="button"
 onClick={onSwitchRole}
 className="font-semibold text-brand-600 hover:text-brand-700:text-brand-300"
 >
 Sign up as a Provider
 </button>
 </p>
 </>
 );
}

function ProviderForm({ applyAuth, navigate, onSwitchRole }) {
 const [step, setStep] = useState(0);
 const [serverError, setServerError] = useState("");
 const [files, setFiles] = useState({ profile: null, id: null, license: null });

 const {
 register,
 handleSubmit,
 trigger,
 watch,
 formState: { errors },
 } = useForm({
 resolver: zodResolver(providerRegisterSchema),
 defaultValues: { acceptTerms: false, providerType: "" },
 mode: "onChange",
 });

 const watchPassword = watch("password", "");
 const watchType = watch("providerType", "");

 const canContinue = (index) => {
 if (index === 0) {
 return (
 !errors.ownerName &&
 !errors.businessName &&
 !errors.email &&
 !errors.phone &&
 !errors.password &&
 !errors.confirmPassword &&
 Boolean(watch("ownerName")) &&
 Boolean(watch("email")) &&
 Boolean(watch("phone")) &&
 Boolean(watch("password")) &&
 watch("password") === watch("confirmPassword") &&
 Boolean(watchType)
 );
 }
 if (index === 1) {
 return Boolean(files.profile) && Boolean(files.id);
 }
 return true;
 };

 async function next() {
 const ok = await trigger(["ownerName", "email", "phone", "password", "confirmPassword", "providerType"]);
 if (!ok) return;
 if (step < STEPS.length - 1) setStep((s) => s + 1);
 }

 const onSubmit = async (values) => {
 setServerError("");
 try {
 const fd = new FormData();
 fd.append("fullName", values.ownerName);
 fd.append("businessName", values.businessName || "");
 fd.append("providerType", values.providerType);
 fd.append("email", values.email);
 fd.append("phone", values.phone);
 fd.append("password", values.password);
 fd.append("gstNumber", values.gstNumber || "");
 if (files.profile) fd.append("profilePhoto", files.profile);
 if (files.id) fd.append("governmentId", files.id);
 if (files.license) fd.append("businessLicense", files.license);

 const { data } = await authService.registerProvider(fd);
 applyAuth(data.data);
 toast.success("Provider account created!");
 navigate("/provider/dashboard", { replace: true });
 } catch (err) {
 const msg = extractErrorMessage(err, "Registration failed. Please try again.");
 setServerError(msg);
 toast.error(msg);
 }
 };

 return (
 <>
 {/* Progress */}
 <div className="mb-6 grid grid-cols-3 gap-2">
 {STEPS.map((s, i) => {
 const Icon = s.icon;
 const done = i < step;
 const active = i === step;
 const state = done
 ? "bg-mint-500/15 text-mint-600"
 : active
 ? "bg-brand-600 text-white shadow-glow"
 : "bg-slate-100 text-slate-400";
 return (
 <div
 key={s.title}
 className={`flex flex-col items-center gap-1.5 rounded-2xl border py-3 ${
 active ? "border-brand-200" : "border-slate-100"
 }`}
 >
 <span className={`grid h-10 w-10 place-items-center rounded-2xl transition-colors ${state}`}>
 {done ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
 </span>
 <span className="text-[11px] font-medium text-slate-500">{s.title}</span>
 </div>
 );
 })}
 </div>

 <ErrorBanner message={serverError} />

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
 {step === 0 && (
 <>
 <Input
 label="Owner name"
 id="ownerName"
 placeholder="Full legal name"
 icon={UserRound}
 error={errors.ownerName?.message}
 {...register("ownerName")}
 />
 <Input
 label="Business name"
 hint="Optional"
 id="businessName"
 placeholder="e.g. ABC Parking"
 icon={Building2}
 error={errors.businessName?.message}
 {...register("businessName")}
 />
 <Select
 label="Provider type"
 id="providerType"
 error={errors.providerType?.message}
 {...register("providerType")}
 >
 <option value="">Select a type</option>
 {PROVIDER_TYPES.map((t) => (
 <option key={t} value={t}>
 {TYPE_LABELS[t]}
 </option>
 ))}
 </Select>
 <div className="grid gap-4 sm:grid-cols-2">
 <Input
 label="Email"
 id="p-email"
 type="email"
 placeholder="you@example.com"
 icon={Mail}
 error={errors.email?.message}
 {...register("email")}
 />
 <Input
 label="Mobile number"
 id="p-phone"
 type="tel"
 placeholder="98765 43210"
 icon={PhoneIcon}
 error={errors.phone?.message}
 {...register("phone")}
 />
 </div>
 <div>
 <PasswordInput
 label="Password"
 id="p-password"
 placeholder="Create a strong password"
 error={errors.password?.message}
 {...register("password")}
 />
 <PasswordStrength password={watchPassword} />
 </div>
 <PasswordInput
 label="Confirm password"
 id="p-confirm"
 placeholder="Re-enter password"
 error={errors.confirmPassword?.message}
 {...register("confirmPassword")}
 />
 </>
 )}

 {step === 1 && (
 <div className="space-y-4">
 <FileUpload
 type="image"
 label="Profile photo"
 hint="JPG/PNG up to 5 MB"
 id="p-upload-profile"
 file={files.profile}
 onChange={(f) => setFiles((s) => ({ ...s, profile: f }))}
 error={!files.profile ? "Profile photo is required" : undefined}
 />
 <FileUpload
 type="doc"
 label="Government ID"
 hint="Passport, Aadhaar or Driver's license"
 id="p-upload-id"
 file={files.id}
 onChange={(f) => setFiles((s) => ({ ...s, id: f }))}
 error={!files.id ? "Government ID is required" : undefined}
 />
 <FileUpload
 type="doc"
 label="Business license"
 hint="Optional"
 id="p-upload-license"
 file={files.license}
 onChange={(f) => setFiles((s) => ({ ...s, license: f }))}
 />
 <Input
 label="GST number"
 hint="Optional"
 id="gstNumber"
 placeholder="22AAAAA0000A1Z5"
 icon={IdCard}
 error={errors.gstNumber?.message}
 {...register("gstNumber")}
 />
 </div>
 )}

 {step === 2 && (
 <>
 <Checkbox
 id="p-accept-terms"
 label={
 <>
 I agree to the{" "}
 <a href="/terms" className="font-medium text-brand-600 underline underline-offset-2">
 Terms &amp; Conditions
 </a>{" "}
 and{" "}
 <a href="/privacy" className="font-medium text-brand-600 underline underline-offset-2">
 Privacy Policy
 </a>, and confirm the documents I uploaded are genuine.
 </>
 }
 error={errors.acceptTerms?.message}
 {...register("acceptTerms")}
 />
 <div className="rounded-xl border border-mint-200 bg-mint-50/60 p-4 text-sm text-mint-800">
 Your documents are verified by our team before your parking space goes live.
 </div>
 </>
 )}

 <div className="mt-6 flex gap-3">
 {step > 0 && (
 <button
 type="button"
 onClick={() => setStep((s) => s - 1)}
 className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-3.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-slate-50:bg-ink-800"
 >
 <ArrowLeft size={16} />
 Back
 </button>
 )}

 {step < STEPS.length - 1 ? (
 <button
 type="button"
 onClick={next}
 disabled={!canContinue(step)}
 className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
 >
 Continue
 <ArrowRight size={16} />
 </button>
 ) : (
 <SubmitButton type="submit" className="flex-1" loadingText="Creating provider…">
 Create Provider Account
 </SubmitButton>
 )}
 </div>
 </form>

 <p className="mt-8 text-center text-sm text-slate-500">
 Already a partner?{" "}
 <a
 href="/provider/login"
 className="font-semibold text-brand-600 hover:text-brand-700"
 >
 Sign in
 </a>
 </p>
 <p className="mt-3 text-center text-sm text-slate-500">
 Just looking for parking?{" "}
 <button
 type="button"
 onClick={onSwitchRole}
 className="font-semibold text-brand-600 hover:text-brand-700:text-brand-300"
 >
 Sign up as a Driver
 </button>
 </p>
 </>
 );
}

function PhoneIcon({ size }) {
 return (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
 <path d="M12 18h.01" />
 </svg>
 );
}

export function GoogleIcon() {
 return (
 <svg width="18" height="18" viewBox="0 0 48 48">
 <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
 <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
 <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z" />
 <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2C37.5 40.6 44 34.9 44 24c0-1.3-.1-2.6-.4-3.9z" />
 </svg>
 );
}
