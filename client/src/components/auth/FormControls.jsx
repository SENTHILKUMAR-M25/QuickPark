import { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const fieldBase =
  "w-full rounded-xl border bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-slate-400 outline-none transition-all duration-200 dark:bg-ink-900/60 dark:text-ink-100 dark:placeholder:text-ink-500";

const states = {
  normal:
    "border-slate-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-ink-700 dark:focus:border-brand-500",
  error:
    "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:border-red-500/60",
};

function Label({ children, htmlFor, required, hint }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-center justify-between text-sm font-medium text-ink-700 dark:text-ink-200"
    >
      <span>
        {children}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {hint && <span className="text-xs font-normal text-slate-400">{hint}</span>}
    </label>
  );
}

function FieldError({ id, message }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500"
        >
          <AlertCircle size={13} className="shrink-0" />
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

export const Input = forwardRef(function Input(
  { label, error, hint, required, id, className, type = "text", icon: Icon, register, ...props },
  ref
) {
  const errorId = id ? `${id}-error` : undefined;
  return (
    <div className="w-full">
      {label && <Label htmlFor={id} required={required} hint={hint}>{label}</Label>}
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={18} />
          </span>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(fieldBase, Icon && "pl-11", error ? states.error : states.normal, className)}
          {...register}
          {...props}
        />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
});

export const PasswordInput = forwardRef(function PasswordInput(
  { label, error, hint, required, id, register, ...props },
  ref
) {
  const [visible, setVisible] = useState(false);
  const errorId = id ? `${id}-error` : undefined;
  return (
    <div className="w-full">
      {label && <Label htmlFor={id} required={required} hint={hint}>{label}</Label>}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(fieldBase, "pr-12", error ? states.error : states.normal)}
          {...register}
          {...props}
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-ink dark:hover:text-ink-100"
        >
          {visible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
});

export function Select({ label, error, hint, required, id, register, children, ...props }) {
  const errorId = id ? `${id}-error` : undefined;
  return (
    <div className="w-full">
      {label && <Label htmlFor={id} required={required} hint={hint}>{label}</Label>}
      <div className="relative">
        <select
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            fieldBase,
            "appearance-none pr-10 bg-no-repeat",
            error ? states.error : states.normal
          )}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundPosition: "right 0.9rem center",
          }}
          {...register}
          {...props}
        >
          {children}
        </select>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function Checkbox({ label, error, id, register, ...props }) {
  return (
    <div className="w-full">
      <label className="flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 flex shrink-0">
          <input
            type="checkbox"
            id={id}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition-all checked:border-brand-600 checked:bg-brand-600 dark:border-ink-700 dark:bg-ink-900"
            {...register}
            {...props}
          />
          <Check
            size={14}
            strokeWidth={3}
            className="pointer-events-none absolute inset-0 m-auto scale-0 text-white transition-transform duration-150 peer-checked:scale-100"
          />
        </span>
        {label && (
          <span className="text-sm leading-snug text-slate-600 dark:text-ink-300">{label}</span>
        )}
      </label>
      <FieldError id={id ? `${id}-error` : undefined} message={error} />
    </div>
  );
}