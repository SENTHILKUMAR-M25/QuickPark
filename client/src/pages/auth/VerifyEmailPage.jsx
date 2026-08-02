import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { AuthShell } from "../../components/auth/BrandLayout";
import { AuthHeader, Logo } from "../../components/auth/PageHeader";
import { SubmitButton } from "../../components/auth/ActionButtons";
import { authService } from "../../services/auth.service";
import { extractErrorMessage } from "../../services/api";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const token = params.get("token") || "";
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Missing verification token.");
      return;
    }
    authService
      .verifyEmail({ token, email })
      .then(() => setStatus("success"))
      .catch((e) => {
        setError(extractErrorMessage(e, "Verification failed."));
        setStatus("error");
        toast.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthShell backTo="/" panel={{ headline: "Confirm your email.", subline: "You're one click away from parking." }}>
      <Logo />
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="text-sm text-slate-500 dark:text-ink-400">Verifying your email…</p>
        </div>
      )}

      {status === "error" && (
        <>
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
            <X size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
          <SubmitButton type="button" onClick={() => navigate("/login")}>
            Go to login
          </SubmitButton>
        </>
      )}

      {status === "success" && (
        <>
          <AuthHeader title="Email verified" subtitle="Your email has been verified successfully." />
          <SubmitButton type="button" onClick={() => navigate("/login")}>
            Continue
          </SubmitButton>
        </>
      )}
    </AuthShell>
  );
}