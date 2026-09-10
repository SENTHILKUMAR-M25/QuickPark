import { useState } from "react";
import { Car, Plus, Trash2, X, Save } from "lucide-react";
import { Card, Badge, EmptyState, Skeleton, fmtNum, fmtDate } from "../../admin/ui";
import { humanLabel } from "../../admin/meta";

const inputCls =
 "w-full rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50";

const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400";

const VEHICLE_TYPES = ["CAR", "BIKE", "SUV", "VAN", "TRUCK", "EV", "OTHER"];

const EMPTY_FORM = { regNumber: "", make: "", model: "", color: "", type: "" };

export default function VehiclesTab({ data, loading, busyId, saving, onAdd, onDelete }) {
 const vehicles = data || [];
 const [open, setOpen] = useState(false);
 const [form, setForm] = useState(EMPTY_FORM);

 const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

 const submit = async (e) => {
 e.preventDefault();
 const ok = await onAdd({
 regNumber: form.regNumber.trim().toUpperCase(),
 make: form.make.trim(),
 model: form.model.trim(),
 color: form.color.trim() || undefined,
 type: form.type || undefined,
 });
 if (ok) {
 setOpen(false);
 setForm(EMPTY_FORM);
 }
 };

 return (
 <div className="space-y-5">
 <div className="flex items-center justify-between">
 <p className="text-sm text-slate-500">
 {loading ? "…" : fmtNum(vehicles.length)} registered vehicle{vehicles.length === 1 ? "" : "s"}
 </p>
 <button
 onClick={() => setOpen(true)}
 disabled={loading}
 className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
 >
 <Plus size={16} /> Add vehicle
 </button>
 </div>

 {open && (
 <Card className="p-6">
 <div className="mb-5 flex items-center justify-between">
 <div>
 <h3 className="font-display text-base font-bold text-ink">Add a vehicle</h3>
 <p className="mt-0.5 text-xs text-slate-500">Faster check-in with a saved vehicle.</p>
 </div>
 <button
 onClick={() => setOpen(false)}
 className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100:bg-ink-800"
 aria-label="Close form"
 >
 <X size={16} />
 </button>
 </div>

 <form onSubmit={submit} className="space-y-4">
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label className={labelCls}>Registration number *</label>
 <input className={inputCls} value={form.regNumber} onChange={set("regNumber")} required placeholder="TN 01 AB 1234" />
 </div>
 <div>
 <label className={labelCls}>Type</label>
 <select className={inputCls} value={form.type} onChange={set("type")}>
 <option value="">Select type</option>
 {VEHICLE_TYPES.map((t) => (
 <option key={t} value={t}>{t}</option>
 ))}
 </select>
 </div>
 </div>
 <div className="grid gap-4 sm:grid-cols-3">
 <div>
 <label className={labelCls}>Make *</label>
 <input className={inputCls} value={form.make} onChange={set("make")} required placeholder="e.g. Hyundai" />
 </div>
 <div>
 <label className={labelCls}>Model *</label>
 <input className={inputCls} value={form.model} onChange={set("model")} required placeholder="e.g. i20" />
 </div>
 <div>
 <label className={labelCls}>Color</label>
 <input className={inputCls} value={form.color} onChange={set("color")} placeholder="e.g. White" />
 </div>
 </div>
 <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
 <button
 type="button"
 onClick={() => setOpen(false)}
 className="rounded-xl border border-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50:bg-ink-800"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={saving}
 className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
 >
 <Save size={15} /> {saving ? "Saving…" : "Save vehicle"}
 </button>
 </div>
 </form>
 </Card>
 )}

 {loading ? (
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {Array.from({ length: 3 }).map((_, i) => (
 <Card key={i} className="p-6">
 <Skeleton className="h-11 w-11 rounded-2xl" />
 <Skeleton className="mt-4 h-5 w-32" />
 <Skeleton className="mt-2 h-4 w-24" />
 </Card>
 ))}
 </div>
 ) : vehicles.length === 0 ? (
 <Card className="overflow-hidden">
 <EmptyState
 icon={Car}
 title="No vehicles added"
 description="Add your first vehicle for faster check-in when you book."
 />
 </Card>
 ) : (
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {vehicles.map((v) => (
 <Card key={v.id} className="p-6">
 <div className="flex items-start justify-between">
 <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
 <Car size={20} />
 </span>
 <div className="flex items-center gap-2">
 {v.isDefault && <Badge tone="bg-brand-50 text-brand-600 border-brand-100">Default</Badge>}
 <button
 onClick={() => onDelete(v.id)}
 disabled={busyId === v.id}
 title="Remove vehicle"
 className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50:bg-red-500/10"
 >
 <Trash2 size={15} />
 </button>
 </div>
 </div>
 <p className="mt-5 font-display text-lg font-extrabold tracking-tight text-ink">
 {v.regNumber}
 </p>
 <p className="mt-1 text-sm text-slate-500">
 {v.make} {v.model} {v.color ? `· ${v.color}` : ""}
 </p>
 <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
 {v.type ? humanLabel(v.type) : "Vehicle"} · added {fmtDate(v.createdAt)}
 </p>
 </Card>
 ))}
 </div>
 )}
 </div>
 );
}
