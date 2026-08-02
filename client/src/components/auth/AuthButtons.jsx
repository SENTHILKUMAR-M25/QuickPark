import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { roleMeta } from "../../lib/auth.meta";

/** Guest-only CTA cluster: Login / Register with role-aware targets. */
export default function AuthButtons({ role: currentRole = "USER", className = "" }) {
  const meta = roleMeta(currentRole);

  const registerTo = meta.register;
  const registerLabel =
    currentRole === "PROVIDER" ? "Become a partner" : "Register";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link
        to={meta.login}
        className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-600 dark:text-ink-300 dark:hover:text-brand-300"
      >
        Sign in
      </Link>
      <Link
        to={registerTo}
        className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-lift transition-shadow hover:shadow-xl"
      >
        {registerLabel}
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}