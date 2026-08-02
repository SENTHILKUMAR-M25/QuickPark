import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Mail, X } from "lucide-react";
import { AuthShell } from "../../components/auth/BrandLayout";
import { AuthHeader, AuthFooter, Logo } from "../../components/auth/PageHeader";
import { Input, PasswordInput, Checkbox } from "../../components/auth/FormControls";
import { SubmitButton, SocialButton, Divider } from "../../components/auth/ActionButtons";
import { loginSchema } from "../../lib/validators";
import { useAuth } from "../../context/AuthContext";
import { extractErrorMessage } from "../../services/api";

const LOGIN_STATS = [
  { value: "5000+", label: "Parking spots" },
  { value: "48", label: "Cities" },
  { value: "120k", label: "Drivers" },
];

const PROVIDER_LOGIN_STATS = [
  { value: "₹3,20,000", label: "Avg. yearly earnings" },
  { value: "10k+", label: "Active parking owners" },
  { value: "24 hrs", label: "First payout" },
];

const VARIANTS = {
  USER: {
    role: "USER",
    header: { title: "Welcome back", subtitle: "Sign in to manage your parking bookings." },
    panel: {
      headline: (
        <>
          Never run late
          <br />
          for a <span className="text-mint-300">parking spot</span> again.
        </>
      ),
      subline: "Search, compare and book parking spaces in seconds across your city — all from one app.",
      statItems: LOGIN_STATS,
    },
    home: "/dashboard",
    registerTo: "/register",
    forgotTo: "/forgot-password",
  },
  PROVIDER: {
    role: "PROVIDER",
    header: { title: "Partner sign in", subtitle: "Manage your parking spaces and track earnings." },
    panel: {
      headline: (
        <>
          Your space.
          <br />
          Our platform. <span className="text-mint-300">Their income.</span>
        </>
      ),
      subline: "Sign in to manage your listings, bookings and payouts in one place.",
      statItems: PROVIDER_LOGIN_STATS,
    },
    home: "/provider/dashboard",
    footerTo: "/provider/register",
    backTo: "/",
  },
};

export default function LoginPage({ role = "USER" }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const meta = VARIANTS[role] || VARIANTS.USER;
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", rememberMe: false },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await login(values, role);
      toast.success("Welcome back to Quick Park!");
      navigate(meta.home);
    } catch (err) {
      const msg = extractErrorMessage(err, "Invalid credentials. Please try again.");
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <AuthShell
      backTo={meta.backTo || "/"}
      role={meta.role}
      panel={meta.panel}
    >
      <Logo />
      <AuthHeader title={meta.header.title} subtitle={meta.header.subtitle} />

      {serverError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
          <X size={16} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email or Mobile number"
          id="identifier"
          placeholder="you@example.com or 98765 43210"
          icon={Mail}
          error={errors.identifier?.message}
          {...register("identifier")}
        />

        <PasswordInput
          label="Password"
          id="login-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            id="remember-me"
            {...register("rememberMe")}
          />
          <a
            href={meta.forgotTo || "/forgot-password"}
            className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Forgot password?
          </a>
        </div>

        <SubmitButton type="submit" loading={isSubmitting} loadingText="Signing in…">
          Sign In
        </SubmitButton>
      </form>

      <Divider />

      <SocialButton icon={GoogleIcon}>Continue with Google</SocialButton>

      <AuthFooter
        message="Don't have an account?"
        linkText={role === "PROVIDER" ? "Become a partner" : "Create account"}
        onToggle={() => navigate(meta.footerTo || "/register")}
      />
    </AuthShell>
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