import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Mail,
  Building2,
  UserRound,
  X,
  ShieldCheck,
  IdCard,
  ScrollText,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { AuthShell } from "../../components/auth/BrandLayout";
import { AuthHeader, Logo } from "../../components/auth/PageHeader";
import { Input, PasswordInput, Checkbox, Select } from "../../components/auth/FormControls";
import { PasswordStrength } from "../../components/auth/PasswordStrength";
import { SubmitButton } from "../../components/auth/ActionButtons";
import { FileUpload } from "../../components/auth/FileUpload";
import { providerRegisterSchema } from "../../lib/validators";
import { authService } from "../../services/auth.service";
import { extractErrorMessage } from "../../services/api";

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

const PROVIDER_STATS = [
  { value: "₹3,20,000", label: "Avg. yearly earnings" },
  { value: "10k+", label: "Active parking owners" },
  { value: "24 hrs", label: "First payout" },
];

export default function ProviderRegisterPage() {
  const navigate = useNavigate();
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
      return !errors.ownerName &&
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
        Boolean(watchType);
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
      fd.append("ownerName", values.ownerName);
      fd.append("businessName", values.businessName || "");
      fd.append("providerType", values.providerType);
      fd.append("email", values.email);
      fd.append("phone", values.phone);
      fd.append("password", values.password);
      fd.append("gstNumber", values.gstNumber || "");
      if (files.profile) fd.append("profilePhoto", files.profile);
      if (files.id) fd.append("governmentId", files.id);
      if (files.license) fd.append("businessLicense", files.license);

      await authService.registerProvider(fd);
      toast.success("Provider account created!");
      navigate("/success?type=provider");
    } catch (err) {
      const msg = extractErrorMessage(err, "Registration failed. Please try again.");
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <AuthShell
      backTo="/provider/login"
      role="PROVIDER"
      panel={{
        headline: (
          <>
            Turn an empty space into <span className="text-mint-300">monthly income</span>.
          </>
        ),
        subline:
          "List your parking space once — we handle discovery, booking and payouts.",
        statItems: PROVIDER_STATS,
      }}
    >
      <Logo />
      <AuthHeader
        title="Become a parking partner"
        subtitle="Earn money by listing your parking space."
      />

      {/* Progress */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          const state = done
            ? "bg-mint-500/15 text-mint-600 dark:bg-mint-500/15 dark:text-mint-400"
            : active
              ? "bg-brand-600 text-white shadow-glow"
              : "bg-slate-100 text-slate-400 dark:bg-ink-800 dark:text-ink-500";
          return (
            <div
              key={s.title}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border py-3 ${
                active ? "border-brand-200 dark:border-brand-500/40" : "border-slate-100 dark:border-ink-800"
              }`}
            >
              <span className={`grid h-10 w-10 place-items-center rounded-2xl transition-colors ${state}`}>
                {done ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-ink-400">{s.title}</span>
            </div>
          );
        })}
      </div>

      {serverError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
          <X size={16} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

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
            <div className="rounded-xl border border-mint-200 bg-mint-50/60 p-4 text-sm text-mint-800 dark:border-mint-500/20 dark:bg-mint-500/10 dark:text-mint-200">
              Your documents are verified by our team before your parking space goes live.
            </div>
          </>
        )}

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-3.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-slate-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:bg-ink-800"
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

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-ink-400">
        Already a partner?{" "}
        <a
          href="/provider/login"
          className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Sign in
        </a>
      </p>
    </AuthShell>
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