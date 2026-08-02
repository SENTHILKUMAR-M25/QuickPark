import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { AuthShell } from "../../components/auth/BrandLayout";
import { AuthHeader, Logo } from "../../components/auth/PageHeader";
import { PasswordInput } from "../../components/auth/FormControls";
import { PasswordStrength } from "../../components/auth/PasswordStrength";
import { SubmitButton } from "../../components/auth/ActionButtons";
import { resetPasswordSchema } from "../../lib/validators";
import { authService } from "../../services/auth.service";
import { extractErrorMessage } from "../../services/api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const otp = params.get("otp") || "";

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const watchPassword = watch("password", "");

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await authService.resetPassword({
        email,
        otp,
        password: values.password,
      });
      toast.success("Password updated successfully");
      navigate("/success?type=reset");
    } catch (err) {
      const msg = extractErrorMessage(err, "Could not reset password. Try again.");
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <AuthShell
      backTo="/verify-otp"
      panel={{
        headline: "Almost there.",
        subline: "Set a strong new password to secure your Quick Park account.",
      }}
    >
      <Logo />
      <AuthHeader title="Create a new password" subtitle="Use a strong password you don't use elsewhere." />

      {serverError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
          <X size={16} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <PasswordInput
            label="New password"
            id="rp-password"
            placeholder="Enter a strong password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrength password={watchPassword} />
        </div>
        <PasswordInput
          label="Confirm new password"
          id="rp-confirm"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <SubmitButton type="submit" loading={isSubmitting} loadingText="Updating…">
          Update Password
        </SubmitButton>
      </form>
    </AuthShell>
  );
}