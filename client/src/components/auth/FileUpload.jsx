import { useRef } from "react";
import { BadgeCheck, IdCard, ImageUp, FileUp, X } from "lucide-react";
import { cn } from "../../lib/utils";

export function FileUpload({
  label,
  hint,
  type = "image",
  file,
  error,
  onChange,
  id,
  accept = "image/*",
  preview,
}) {
  const inputRef = useRef(null);
  const hasUpload = Boolean(file) || Boolean(preview);

  return (
    <div className="w-full">
      <p className="mb-1.5 text-sm font-medium text-ink-700 dark:text-ink-200">{label}</p>
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl border-2 border-dashed p-4 text-center transition-all duration-200",
          error
            ? "border-red-300 bg-red-50/40 dark:border-red-500/50 dark:bg-red-500/5"
            : "border-slate-200 bg-white/50 hover:border-brand-400 hover:bg-brand-50/40 dark:border-ink-700 dark:bg-ink-900/40 dark:hover:border-brand-500"
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />

        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="mx-auto max-h-40 rounded-lg object-cover" />
            <RemoveButton
              onClick={() => {
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 py-2"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
              {type === "image" ? <ImageUp size={22} /> : <FileUp size={22} />}
            </span>
            <span className="text-sm font-semibold text-ink-700 dark:text-ink-200">
              {file ? file.name : `Upload ${label.toLowerCase()}`}
            </span>
            {hint && <span className="text-xs text-slate-400">{hint}</span>}
          </button>
        )}

        {hasUpload && !preview && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-1 text-xs font-medium text-brand-600 hover:underline"
          >
            {file ? `File: ${file.name}` : "Change file"}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

function RemoveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove file"
      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ink/70 text-white backdrop-blur transition-colors hover:bg-red-500"
    >
      <X size={16} />
    </button>
  );
}

export function DocumentListItem({ icon: Icon = IdCard, title, status = "Not uploaded" }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/60 p-3.5 dark:border-ink-700 dark:bg-ink-900/40">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10">
          <Icon size={20} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink-700 dark:text-ink-100">{title}</p>
          <p className="text-xs text-slate-400">{status}</p>
        </div>
      </div>
      {status === "Verified" ? (
        <BadgeCheck size={20} className="text-mint-500" />
      ) : status === "Uploaded" ? (
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/20">
          Pending
        </span>
      ) : (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-ink-800">
          {status}
        </span>
      )}
    </div>
  );
}