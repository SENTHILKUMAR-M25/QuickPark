import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Mail, User, X } from "lucide-react";
import { AuthShell } from "../../components/auth/BrandLayout";
import { AuthHeader, AuthFooter, Logo } from "../../components/auth/PageHeader";
import { Input, PasswordInput, Checkbox } from "../../components/auth/FormControls";
import { PasswordStrength } from "../../components/auth/PasswordStrength";
import { SubmitButton, SocialButton, Divider } from "../../components/auth/ActionButtons";
import { userRegisterSchema } from "../../lib/validators";
import { authService } from "../../services/auth.service";
import { extractErrorMessage } from "../../services/api";

const USER_STATS = [
  { value: "5000+", label: "Parking spots" },
  { value: "45 sec", label: "Avg booking time" },
  { value: "4.9★", label: "Rating" },
];

export default function UserRegisterPage() {
  const navigate = useNavigate();
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
      await authService.registerUser(payload);
      toast.success("Account created! Check your email to verify.");
      navigate("/verify-email?email=" + encodeURIComponent(values.email));
    } catch (err) {
      const msg = extractErrorMessage(err, "Could not create account.");
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <AuthShell
      backTo="/"
      role="USER"
      panel={{
        headline: (
          <>
            Find a spot, <span className="text-mint-300">park</span> it, and go.
          </>
        ),
        subline:
          "Join thousands of drivers who book better parking spots in seconds.",
        statItems: USER_STATS,
      }}
    >
      <Logo />
      <AuthHeader title="Create your account" subtitle="Find and book parking in seconds." />

      {serverError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
          <X size={16} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

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