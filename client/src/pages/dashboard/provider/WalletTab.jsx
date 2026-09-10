import { useState } from "react";
import { Wallet, ArrowDownLeft, ArrowUpRight, Save, Landmark } from "lucide-react";
import { Card, Panel, Skeleton, Badge, fmtINR, fmtDateTime } from "../../admin/ui";

const inputCls =
 "w-full rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50";

const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400";

export default function WalletTab({ wallet, loading, profile, onSaveBank, saving }) {
 const [bank, setBank] = useState(() => ({
 bankAccountName: profile?.bankAccountName || "",
 bankAccountNumber: profile?.bankAccountNumber || "",
 ifscCode: profile?.ifscCode || "",
 upiId: profile?.upiId || "",
 }));

 const set = (key) => (e) => setBank((b) => ({ ...b, [key]: e.target.value }));

 const submit = (e) => {
 e.preventDefault();
 onSaveBank({
 ...bank,
 upiId: bank.upiId.trim(),
 bankAccountNumber: bank.bankAccountNumber.trim(),
 });
 };

 const transactions = wallet?.transactions || [];

 return (
 <div className="grid gap-5 lg:grid-cols-5">
 <div className="space-y-5 lg:col-span-2">
 <Card className="overflow-hidden">
 <div className="bg-gradient-to-br from-brand-600 via-brand-500 to-mint-500 p-6 text-white">
 <div className="flex items-center justify-between">
 <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 backdrop-blur">
 <Wallet size={20} />
 </span>
 <Badge tone="bg-white/15 text-white border-white/20">INR</Badge>
 </div>
 <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-white/70">Available balance</p>
 {loading ? (
 <Skeleton className="mt-2 h-10 w-40 bg-white/20" />
 ) : (
 <p className="mt-1 font-display text-4xl font-extrabold tracking-tight">{fmtINR(wallet?.balance)}</p>
 )}
 <p className="mt-4 text-sm text-white/70">Payouts are credited to your linked bank account.</p>
 </div>
 </Card>

 <Panel title="Payout details" subtitle="Where your earnings go" icon={Landmark}>
 <form onSubmit={submit} className="space-y-4">
 <div>
 <label className={labelCls}>Account holder name *</label>
 <input className={inputCls} value={bank.bankAccountName} onChange={set("bankAccountName")} required placeholder="As per bank records" />
 </div>
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label className={labelCls}>Account number *</label>
 <input className={inputCls} value={bank.bankAccountNumber} onChange={set("bankAccountNumber")} required inputMode="numeric" placeholder="123456789012" />
 </div>
 <div>
 <label className={labelCls}>IFSC code *</label>
 <input className={inputCls} value={bank.ifscCode} onChange={set("ifscCode")} required placeholder="HDFC0001234" />
 </div>
 </div>
 <div>
 <label className={labelCls}>UPI ID</label>
 <input className={inputCls} value={bank.upiId} onChange={set("upiId")} placeholder="yourname@okbank" />
 </div>
 <button
 type="submit"
 disabled={saving}
 className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
 >
 <Save size={15} /> {saving ? "Saving…" : "Save payout details"}
 </button>
 </form>
 </Panel>
 </div>

 <Card className="overflow-hidden lg:col-span-3">
 <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
 <div>
 <h3 className="font-display text-base font-bold text-ink">Transactions</h3>
 <p className="mt-0.5 text-xs text-slate-500">Your latest wallet activity</p>
 </div>
 </div>

 {loading ? (
 <div className="space-y-5 p-6">
 {Array.from({ length: 5 }).map((_, i) => (
 <Skeleton key={i} className="h-12 w-full rounded-xl" />
 ))}
 </div>
 ) : transactions.length === 0 ? (
 <p className="px-6 py-16 text-center text-sm text-slate-500">No transactions yet.</p>
 ) : (
 <div className="divide-y divide-slate-50">
 {transactions.map((tx) => {
 const credit = tx.type === "CREDIT";
 return (
 <div key={tx.id} className="flex items-center gap-4 px-6 py-4">
 <span
 className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
 credit
 ? "bg-mint-50 text-mint-600"
 : "bg-red-50 text-red-500"
 }`}
 >
 {credit ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
 </span>
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-bold text-ink">{tx.description}</p>
 <p className="text-xs text-slate-400">
 {fmtDateTime(tx.createdAt)} · balance {fmtINR(tx.balanceAfter)}
 </p>
 </div>
 <p className={`font-bold ${credit ? "text-mint-600" : "text-red-500"}`}>
 {credit ? "+" : "−"}{fmtINR(tx.amount)}
 </p>
 </div>
 );
 })}
 </div>
 )}
 </Card>
 </div>
 );
}
