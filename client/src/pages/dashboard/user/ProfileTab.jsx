import { useState } from "react";
import { Save, Camera, AlertTriangle, User as UserIcon } from "lucide-react";
import { Card, Panel, Avatar } from "../../admin/ui";

const inputCls =
 "w-full rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50";

const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400";

const LANGUAGES = ["English", "தமிழ்", "हिन्दी", "తెలుగు", "ಕನ್ನಡ", "മലയാളം", "বাংলা", "मराठी", "Other"];

function toDateInput(v) {
 if (!v) return "";
 const d = new Date(v);
 if (Number.isNaN(d.getTime())) return "";
 const iso = d.toISOString();
 return iso.slice(0, 10);
}

export default function ProfileTab({ user, profile, onSaveProfile, onUploadImage, saving, uploading, onDeleteAccount }) {
 const [form, setForm] = useState(() => ({
 fullName: user?.name || "",
 gender: profile.gender || "",
 dateOfBirth: toDateInput(profile.dateOfBirth),
 address: profile.address || "",
 emergencyContact: profile.emergencyContact || "",
 preferredLanguage: profile.preferredLanguage || "English",
 notificationSettings: {
 email: profile.notificationSettings?.email !== false,
 sms: profile.notificationSettings?.sms !== false,
 push: profile.notificationSettings?.push !== false,
 },
 }));

 const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
 const toggleNotify = (key) => (e) =>
 setForm((f) => ({ ...f, notificationSettings: { ...f.notificationSettings, [key]: e.target.checked } }));

 const submit = (e) => {
 e.preventDefault();
 onSaveProfile({
 fullName: form.fullName.trim() || undefined,
 gender: form.gender.trim() || undefined,
 dateOfBirth: form.dateOfBirth || undefined,
 address: form.address.trim() || undefined,
 emergencyContact: form.emergencyContact.trim() || undefined,
 preferredLanguage: form.preferredLanguage.trim() || undefined,
 notificationSettings: form.notificationSettings,
 });
 };

 const onPhoto = (e) => {
 const file = e.target.files?.[0];
 if (!file) return;
 const fd = new FormData();
 fd.append("profilePhoto", file);
 onUploadImage(fd);
 e.target.value = "";
 };

 const handleDelete = () => {
 if (window.confirm("Permanently delete your QuickPark account? This cannot be undone.")) {
 onDeleteAccount();
 }
 };

 return (
 <div className="grid gap-5 lg:grid-cols-3">
 <Card className="h-fit p-6">
 <div className="flex flex-col items-center text-center">
 <div className="relative">
 <Avatar name={user?.name} image={user?.profileImage} size="h-24 w-24 text-2xl" />
 <label
 htmlFor="profile-photo"
 className="absolute -bottom-1 -right-1 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-ink text-white shadow-soft transition hover:opacity-90"
 title="Change photo"
 >
 <Camera size={15} />
 <input id="profile-photo" type="file" accept="image/*" className="hidden" onChange={onPhoto} disabled={uploading} />
 </label>
 </div>
 <p className="mt-4 font-display text-lg font-extrabold text-ink">{user?.name}</p>
 <p className="text-sm text-slate-500">{user?.email}</p>
 <p className="mt-1 text-xs text-slate-400">
 {user?.phone || ""} · {user?.role}
 </p>
 </div>
 </Card>

 <div className="space-y-5 lg:col-span-2">
 <Panel title="Personal information" subtitle="How we display your account" icon={UserIcon}>
 <form onSubmit={submit} className="space-y-4">
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label className={labelCls}>Full name</label>
 <input className={inputCls} value={form.fullName} onChange={set("fullName")} placeholder="Your name" />
 </div>
 <div>
 <label className={labelCls}>Gender</label>
 <select className={inputCls} value={form.gender} onChange={set("gender")}>
 <option value="">Prefer not to say</option>
 <option value="Male">Male</option>
 <option value="Female">Female</option>
 <option value="Other">Other</option>
 </select>
 </div>
 </div>
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label className={labelCls}>Date of birth</label>
 <input className={inputCls} value={form.dateOfBirth} onChange={set("dateOfBirth")} type="date" />
 </div>
 <div>
 <label className={labelCls}>Emergency contact</label>
 <input className={inputCls} value={form.emergencyContact} onChange={set("emergencyContact")} placeholder="+91 …" />
 </div>
 </div>
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label className={labelCls}>Address</label>
 <input className={inputCls} value={form.address} onChange={set("address")} placeholder="Street, city, state" />
 </div>
 <div>
 <label className={labelCls}>Preferred language</label>
 <select className={inputCls} value={form.preferredLanguage} onChange={set("preferredLanguage")}>
 {LANGUAGES.map((l) => (
 <option key={l} value={l}>{l}</option>
 ))}
 </select>
 </div>
 </div>

 <div className="rounded-2xl bg-slate-50 p-4">
 <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Notifications</p>
 <div className="mt-3 space-y-2.5">
 {[
 { key: "email", label: "Email notifications" },
 { key: "sms", label: "SMS alerts" },
 { key: "push", label: "Push notifications" },
 ].map((n) => (
 <label key={n.key} className="flex cursor-pointer items-center justify-between text-sm font-medium text-slate-600">
 {n.label}
 <input
 type="checkbox"
 checked={form.notificationSettings[n.key]}
 onChange={toggleNotify(n.key)}
 className="h-4 w-4 accent-brand-600"
 />
 </label>
 ))}
 </div>
 </div>

 <div className="flex justify-end border-t border-slate-100 pt-4">
 <button
 type="submit"
 disabled={saving}
 className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
 >
 <Save size={15} /> {saving ? "Saving…" : "Save profile"}
 </button>
 </div>
 </form>
 </Panel>

 <Card className="border-red-200 p-6">
 <div className="flex items-start gap-3">
 <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500">
 <AlertTriangle size={18} />
 </span>
 <div className="min-w-0 flex-1">
 <p className="text-sm font-bold text-ink">Danger zone</p>
 <p className="mt-0.5 text-xs text-slate-500">
 Deleting your account removes all bookings and personal data. This cannot be undone.
 </p>
 <button
 onClick={handleDelete}
 className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
 >
 <AlertTriangle size={14} /> Delete account
 </button>
 </div>
 </div>
 </Card>
 </div>
 </div>
 );
}
