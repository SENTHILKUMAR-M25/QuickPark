import { useId } from "react";

export function Field({ label, required, error, hint, className = "", children }) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
          {required && <span className="ml-0.5 text-red-400">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

export function Chip({ active, onClick, children, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
        active
          ? "border-brand-600 bg-brand-600 text-white shadow-soft"
          : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
      }`}
    >
      {children}
    </button>
  );
}

export function ChipGroup({ options, value, onChange, multi = true, disabled }) {
  const list = multi ? value : [value];
  const toggle = (v) => {
    if (!multi) {
      onChange(v);
      return;
    }
    onChange(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Chip key={opt.value} active={list.includes(opt.value)} onClick={() => toggle(opt.value)} disabled={disabled}>
          {opt.label}
        </Chip>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label, description, disabled }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        {label && <p className="text-sm font-semibold text-ink">{label}</p>}
        {description && <p className="mt-0.5 text-xs text-slate-400">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50 ${
          checked ? "bg-brand-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-300 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50";
export const selectCls = inputCls;

export function fileToUrl(file) {
  if (!file) return null;
  if (typeof file === "string") return file;
  return URL.createObjectURL(file);
}
