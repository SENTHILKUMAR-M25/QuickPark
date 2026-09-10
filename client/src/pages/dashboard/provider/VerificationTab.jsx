import { useState } from "react";
import { ShieldCheck, Save, UploadCloud, FileText, User as UserIcon, Building2 } from "lucide-react";
import { Card, Panel, Badge, fmtDate } from "../../admin/ui";
import { VERIFICATION_BADGE } from "../../admin/meta";
import { PROVIDER_TYPES } from "../../../lib/auth.meta";

const inputCls =
 "w-full rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50";

const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400";

const STEPS = [
 { key: "PENDING", label: "Submitted" },
 { key: "UNDER_REVIEW", label: "Under review" },
 { key: "VERIFIED", label: "Verified" },
];

function StepIndicator({ status }) {
 if (status === "REJECTED") {
 return (
 <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
 <p className="font-bold">Verification rejected</p>
 <p className="mt-0.5 opacity-90">Please review and resubmit your documents below.</p>
 </div>
 );
 }
 const idx = STEPS.findIndex((s) => s.key === status);
 return (
 <div className="flex items-center">
 {STEPS.map((s, i) => (
 <div key={s.key} className="flex items-center flex-1 last:flex-none">
 <div className="flex flex-col items-center gap-1.5">
 <span
 className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
 i <= idx
 ? "bg-mint-500 text-white"
 : "bg-slate-100 text-slate-400"
 }`}
 >
 {i + 1}
 </span>
 <span className={`text-[11px] font-semibold ${i <= idx ? "text-ink" : "text-slate-400"}`}>
 {s.label}
 </span>
 </div>
 {i < STEPS.length - 1 && (
 <div className={`mx-2 mb-6 h-0.5 flex-1 rounded ${i < idx ? "bg-mint-500" : "bg-slate-100"}`} />
 )}
 </div>
 ))}
 </div>
 );
}

export default function VerificationTab({ profile, onSaveProfile, onUploadDocs, saving, uploading }) {
 const status = profile?.verificationStatus || "PENDING";

 const [form, setForm] = useState(() => ({
 fullName: "",
 businessName: profile?.businessName || "",
 businessRegistrationNumber: profile?.businessRegistrationNumber || "",
 gstNumber: profile?.gstNumber || "",
 providerType: profile?.providerType || "",
 address: profile?.address || "",
 }));

 const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

 const submitProfile = (e) => {
 e.preventDefault();
 const payload = {
 fullName: form.fullName.trim() || undefined,
 businessName: form.businessName.trim() || undefined,
 businessRegistrationNumber: form.businessRegistrationNumber.trim() || undefined,
 gstNumber: form.gstNumber.trim() || undefined,
 providerType: form.providerType || undefined,
 address: form.address.trim() || undefined,
 };
 onSaveProfile(payload);
 };

 const [docs, setDocs] = useState({ governmentId: null, businessLicense: null, profilePhoto: null });

 const submitDocs = (e) => {
 e.preventDefault();
 const fd = new FormData();
 if (docs.governmentId) fd.append("governmentId", docs.governmentId);
 if (docs.businessLicense) fd.append("businessLicense", docs.businessLicense);
 if (docs.profilePhoto) fd.append("profilePhoto", docs.profilePhoto);
 onUploadDocs(fd);
 };

 const docsDone = profile?.governmentId && profile?.businessLicense;

 return (
 <div className="space-y-5">
 <Card className="p-6">
 <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
 <div className="flex items-center gap-3">
 <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
 <ShieldCheck size={18} />
 </span>
 <div>
 <h3 className="font-display text-base font-bold text-ink">Verification status</h3>
 <p className="text-xs text-slate-500">Complete these steps to go live</p>
 </div>
 </div>
 <Badge tone={VERIFICATION_BADGE[status] || VERIFICATION_BADGE.PENDING}>
 {status.replace("_", " ")}
 </Badge>
 </div>
 <StepIndicator status={status} />
 <div className="mt-5 grid gap-3 text-xs text-slate-500 sm:grid-cols-2">
 <p className="flex items-center gap-2">
 <FileText size={14} className="text-slate-400" />
 Govt ID {profile?.governmentId ? "uploaded" : "not uploaded"}
 </p>
 <p className="flex items-center gap-2">
 <FileText size={14} className="text-slate-400" />
 Business license {profile?.businessLicense ? "uploaded" : "not uploaded"}
 </p>
 </div>
 {status === "VERIFIED" && docsDone && (
 <p className="mt-4 rounded-xl bg-mint-50 px-4 py-3 text-sm font-semibold text-mint-700">
 You're fully verified. Your spaces are visible to drivers.
 </p>
 )}
 </Card>

 <div className="grid gap-5 lg:grid-cols-2">
 <Panel title="Business profile" subtitle="Shown on your listings" icon={Building2}>
 <form onSubmit={submitProfile} className="space-y-4">
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label className={labelCls}>Business name</label>
 <input className={inputCls} value={form.businessName} onChange={set("businessName")} placeholder="e.g. Quick Park City" />
 </div>
 <div>
 <label className={labelCls}>Provider type</label>
 <select className={inputCls} value={form.providerType} onChange={set("providerType")}>
 <option value="">Select type</option>
 {PROVIDER_TYPES.map((t) => (
 <option key={t.value} value={t.value}>{t.label}</option>
 ))}
 </select>
 </div>
 </div>
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label className={labelCls}>Business registration no.</label>
 <input className={inputCls} value={form.businessRegistrationNumber} onChange={set("businessRegistrationNumber")} placeholder="Optional" />
 </div>
 <div>
 <label className={labelCls}>GST number</label>
 <input className={inputCls} value={form.gstNumber} onChange={set("gstNumber")} placeholder="Optional" />
 </div>
 </div>
 <div>
 <label className={labelCls}>Business address</label>
 <input className={inputCls} value={form.address} onChange={set("address")} placeholder="Street, city, state" />
 </div>
 <button
 type="submit"
 disabled={saving}
 className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
 >
 <Save size={15} /> {saving ? "Saving…" : "Save business profile"}
 </button>
 </form>
 </Panel>

 <Panel title="Verification documents" subtitle="Re-submit to update" icon={UserIcon}>
 <form onSubmit={submitDocs} className="space-y-4">
 <div>
 <label className={labelCls}>Government ID</label>
 <input
 type="file"
 accept="image/*,application/pdf"
 onChange={(e) => setDocs((d) => ({ ...d, governmentId: e.target.files?.[0] || null }))}
 className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-slate-600 hover:file:bg-slate-200:bg-ink-800:text-ink-200"
 />
 </div>
 <div>
 <label className={labelCls}>Business license</label>
 <input
 type="file"
 accept="image/*,application/pdf"
 onChange={(e) => setDocs((d) => ({ ...d, businessLicense: e.target.files?.[0] || null }))}
 className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-slate-600 hover:file:bg-slate-200:bg-ink-800:text-ink-200"
 />
 </div>
 <div>
 <label className={labelCls}>Profile photo</label>
 <input
 type="file"
 accept="image/*"
 onChange={(e) => setDocs((d) => ({ ...d, profilePhoto: e.target.files?.[0] || null }))}
 className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-slate-600 hover:file:bg-slate-200:bg-ink-800:text-ink-200"
 />
 </div>
 <button
 type="submit"
 disabled={uploading || (!docs.governmentId && !docs.businessLicense && !docs.profilePhoto)}
 className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
 >
 <UploadCloud size={15} /> {uploading ? "Uploading…" : "Upload documents"}
 </button>
 {docsDone && <p className="text-xs text-slate-400">Uploaded on {fmtDate(profile.updatedAt)}</p>}
 </form>
 </Panel>
 </div>
 </div>
 );
}
