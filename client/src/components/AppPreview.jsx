import React from "react";
import {
  MapPin,
  Search,
  Navigation,
  Wallet,
  History,
  Home,
  Star,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  Bell,
  Car,
  Bike,
  Truck,
} from "lucide-react";

function TopBar({ title, right }) {
  return (
    <div className="flex items-center justify-between px-4 pb-2 pt-3">
      <div className="flex items-center gap-2">
        <ChevronLeft size={16} className="text-slate-400" />
        <span className="text-[11px] font-bold text-ink">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {right === "bell" && <Bell size={13} className="text-slate-400" />}
        {right === "shield" && <ShieldCheck size={13} className="text-mint-500" />}
        <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[8px] font-bold text-white">A</span>
      </div>
    </div>
  );
}

function MiniMap({ route = true }) {
  return (
    <div className="relative h-20 overflow-hidden rounded-xl bg-gradient-to-br from-sky-50 to-mint-50 ring-1 ring-slate-100">
      <div className="absolute inset-0 bg-dots opacity-40" />
      {route && (
        <svg viewBox="0 0 200 80" className="absolute inset-0 h-full w-full">
          <path d="M0 68 C 60 20, 140 72, 200 26" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="1 7" strokeLinecap="round" />
          <circle cx="20" cy="64" r="6" fill="#2563eb" stroke="white" strokeWidth="2.5" />
          <circle cx="180" cy="30" r="6" fill="#f97316" stroke="white" strokeWidth="2.5" />
        </svg>
      )}
      {!route && (
        <>
          <circle cx="60" cy="30" r="8" fill="#2563eb" stroke="white" strokeWidth="2" />
          <circle cx="110" cy="50" r="8" fill="#10b981" stroke="white" strokeWidth="2" />
          <circle cx="150" cy="28" r="8" fill="#f97316" stroke="white" strokeWidth="2" />
          <circle cx="40" cy="55" r="8" fill="#a78bfa" stroke="white" strokeWidth="2" />
        </>
      )}
    </div>
  );
}

export function PhoneScreen({ variant }) {
  switch (variant) {
    case "home":
      return (
        <div className="flex h-full flex-col bg-[#f6f7fb]">
          <TopBar title="Good morning, Arjun" right="bell" />
          <div className="px-4">
            <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-100">
              <Search size={13} className="ml-1 text-slate-400" />
              <span className="text-[11px] text-slate-400">Where to park?</span>
            </div>
            <div className="mt-3 flex gap-2">
              {["Nearby", "Cheapest", "EV", "Safer"].map((t, i) => (
                <span key={t} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${i === 0 ? "bg-brand-600 text-white" : "bg-white text-slate-500 ring-1 ring-slate-100"}`}>{t}</span>
              ))}
            </div>
            <MiniMap route={false} />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-ink">Near you · 8 spots</span>
              <span className="text-[9px] text-brand-600">See all</span>
            </div>
          </div>
          <div className="mt-1 flex-1 space-y-2 px-4 pb-3">
            {[
              { name: "Central Plaza", dist: "120m", price: "₹80", color: "bg-brand-500" },
              { name: "Anand Residence", dist: "250m", price: "₹50", color: "bg-mint-500" },
              { name: "City Mall P2", dist: "400m", price: "₹120", color: "bg-ember-500" },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-100">
                <span className={`grid h-7 w-7 place-items-center rounded-lg text-white ${s.color}`}><MapPin size={13} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold text-ink">{s.name}</p>
                  <p className="text-[9px] text-slate-400">{s.dist} · {s.price}/hr</p>
                </div>
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span className="text-[9px] font-bold text-ink">4.8</span>
              </div>
            ))}
          </div>
          <div className="px-4 pb-3">
            <div className="flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 py-2.5 text-[11px] font-bold text-white">
              Find Parking <ArrowRight size={12} />
            </div>
          </div>
        </div>
      );
    case "search":
      return (
        <div className="flex h-full flex-col bg-[#f6f7fb]">
          <TopBar title="Search parking" />
          <div className="px-4">
            <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-100">
              <Search size={13} className="ml-1 text-slate-400" />
              <span className="text-[11px] text-slate-400">M.G. Road, Bengaluru</span>
            </div>
            <div className="mt-3 flex items-center gap-2 overflow-hidden rounded-xl">
              <div className="flex-1 rounded-l-xl bg-white p-2 text-center ring-1 ring-slate-100">
                <p className="text-[10px] font-bold text-ink">Today</p>
              </div>
              <div className="flex-1 bg-white p-2 text-center ring-1 ring-slate-100">
                <p className="text-[10px] font-bold text-ink">10:00</p>
              </div>
              <div className="flex-1 rounded-r-xl bg-white p-2 text-center ring-1 ring-slate-100">
                <p className="text-[10px] font-bold text-ink">4 hrs</p>
              </div>
            </div>
          </div>
          <div className="mt-3 px-4">
            <MiniMap />
          </div>
          <div className="mt-3 flex-1 space-y-2 px-4 pb-3">
            {[
              { name: "Phoenix Mall", d: "Free · 2 km", price: "₹100", hot: true },
              { name: "Park & Fly Lot", d: "Filled · 1.4 km", price: "₹60", hot: false },
              { name: "Lido Car Park", d: "Free · 800m", price: "₹90", hot: false },
            ].map((s) => (
              <div key={s.name} className="rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-ink">{s.name}</p>
                  {s.hot && <span className="rounded-full bg-mint-100 px-2 py-0.5 text-[8px] font-bold text-mint-700">LIVE</span>}
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400">{s.d}</span>
                  <span className="text-[11px] font-bold text-brand-600">{s.price}/hr</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "booking":
      return (
        <div className="flex h-full flex-col bg-[#f6f7fb]">
          <TopBar title="Confirm booking" right="shield" />
          <div className="px-4">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
              <MiniMap />
              <div className="p-3">
                <p className="text-[11px] font-bold text-ink">Central Plaza · Slot A12</p>
                <p className="text-[9px] text-slate-400">M.G. Road · Verified · 4.8★</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-50 p-2"><p className="text-[8px] text-slate-400">DATE</p><p className="text-[10px] font-bold text-ink">Today</p></div>
                  <div className="rounded-lg bg-slate-50 p-2"><p className="text-[8px] text-slate-400">TIME</p><p className="text-[10px] font-bold text-ink">10:00 – 2:00</p></div>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 rounded-xl bg-white p-3 text-[10px] shadow-sm ring-1 ring-slate-100">
              <div className="flex justify-between text-slate-500"><span>Base (4 hrs × ₹80)</span><span className="font-semibold text-ink">₹320</span></div>
              <div className="flex justify-between text-slate-500"><span>Early-bird discount</span><span className="font-semibold text-mint-600">−₹40</span></div>
              <div className="flex justify-between border-t border-slate-100 pt-1.5 font-bold text-ink"><span>Total</span><span>₹280</span></div>
            </div>
          </div>
          <div className="mt-auto px-4 pb-3">
            <div className="flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-mint-500 to-emerald-600 py-2.5 text-[11px] font-bold text-white">
              Book & Pay <ArrowRight size={12} />
            </div>
          </div>
        </div>
      );
    case "navigation":
      return (
        <div className="flex h-full flex-col bg-ink-950">
          <div className="p-4 text-white">
            <p className="text-[9px] uppercase tracking-wider text-white/50">Navigating to</p>
            <p className="text-[13px] font-bold">Central Plaza · Slot A12</p>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-ink-900 to-emerald-950" />
            <div className="absolute inset-0 bg-grid opacity-10" />
            <svg viewBox="0 0 200 160" className="absolute inset-0 h-full w-full">
              <path d="M0 150 C 50 90, 130 140, 200 60" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="1 8" strokeLinecap="round" />
              <circle cx="30" cy="140" r="7" fill="#2563eb" stroke="white" strokeWidth="3" />
              <circle cx="178" cy="62" r="7" fill="#f97316" stroke="white" strokeWidth="3" />
            </svg>
          </div>
          <div className="flex items-center justify-between bg-ink-900/90 p-4">
            <div className="flex items-center gap-2">
              <Navigation size={16} className="text-mint-400" />
              <div>
                <p className="text-[13px] font-bold text-white">1.2 km</p>
                <p className="text-[9px] text-white/50">Arrive in 4 min</p>
              </div>
            </div>
            <div className="rounded-full bg-mint-500 px-4 py-2 text-[10px] font-bold text-white">Next: left turn</div>
          </div>
        </div>
      );
    case "wallet":
      return (
        <div className="flex h-full flex-col bg-[#f6f7fb]">
          <TopBar title="Quick Park Wallet" right="shield" />
          <div className="px-4">
            <div className="rounded-xl bg-gradient-to-br from-ember-500 to-orange-600 p-4 text-white shadow-glow-ember">
              <p className="text-[9px] uppercase tracking-wider text-white/70">Available balance</p>
              <p className="mt-1 font-display text-2xl font-extrabold">₹2,450.00</p>
              <div className="mt-3 flex gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-[9px] font-bold">+ Add Money</span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-[9px] font-bold">Cashback 5%</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { l: "Today", v: "₹240", t: "+₹40" },
                { l: "This week", v: "₹1,120", t: "+₹120" },
                { l: "Cashback", v: "₹180", t: "earned" },
              ].map((w) => (
                <div key={w.l} className="rounded-xl bg-white p-2.5 text-center shadow-sm ring-1 ring-slate-100">
                  <p className="text-[8px] uppercase text-slate-400">{w.l}</p>
                  <p className="text-[12px] font-extrabold text-ink">{w.v}</p>
                  <p className="text-[8px] font-bold text-mint-600">{w.t}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex-1 px-4">
            <p className="text-[10px] font-bold text-ink">Recent transactions</p>
            <div className="mt-2 space-y-1.5">
              {[
                { l: "Central Plaza", v: "−₹80", c: "text-rose-500" },
                { l: "Cashback", v: "+₹4", c: "text-mint-600" },
                { l: "Westside Mall", v: "−₹120", c: "text-rose-500" },
              ].map((t) => (
                <div key={t.l} className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-100">
                  <span className="text-[10px] font-semibold text-ink">{t.l}</span>
                  <span className={`text-[10px] font-bold ${t.c}`}>{t.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-around border-t border-slate-100 bg-white py-2.5">
            <Wallet size={15} className="text-brand-600" />
            <Home size={15} className="text-slate-300" />
            <History size={15} className="text-slate-300" />
          </div>
        </div>
      );
    case "history":
      return (
        <div className="flex h-full flex-col bg-[#f6f7fb]">
          <TopBar title="Booking history" />
          <div className="px-4">
            <div className="flex gap-2">
              {["All", "Upcoming", "Completed"].map((t, i) => (
                <span key={t} className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${i === 0 ? "bg-brand-600 text-white" : "bg-white text-slate-500 ring-1 ring-slate-100"}`}>{t}</span>
              ))}
            </div>
          </div>
          <div className="mt-3 flex-1 space-y-2 overflow-hidden px-4 pb-3">
            {[
              { name: "Central Plaza · A12", time: "Today · 10:00 – 14:00", amt: "₹280", s: "completed", v: "text-mint-600 bg-mint-50" },
              { name: "Westside Mall · P2-09", time: "Yesterday · 18:00", amt: "₹120", s: "completed", v: "text-mint-600 bg-mint-50" },
              { name: "Airport T2 · Bay 14", time: "Sat · 08:00", amt: "₹240", s: "upcoming", v: "text-brand-600 bg-brand-50" },
              { name: "Phoenix Mall · B1-04", time: "Mon · 12:00", amt: "₹100", s: "completed", v: "text-mint-600 bg-mint-50" },
              { name: "Station Rd · Spot 9", time: "Wed · 09:30", amt: "₹60", s: "completed", v: "text-mint-600 bg-mint-50" },
            ].map((h) => (
              <div key={h.name} className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-100">
                <span className={`rounded-lg px-2 py-1 text-[8px] font-bold uppercase ${h.v}`}>{h.s}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-bold text-ink">{h.name}</p>
                  <p className="text-[8px] text-slate-400">{h.time}</p>
                </div>
                <span className="text-[10px] font-bold text-ink">{h.amt}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "vehicles":
      return (
        <div className="flex h-full flex-col bg-[#f6f7fb]">
          <TopBar title="My vehicles" />
          <div className="flex-1 space-y-2 px-4 pb-3">
            {[
              { icon: Car, name: "Maruti Swift · KL-07-AB-1234", type: "Car", size: "Standard", color: "bg-brand-100 text-brand-600" },
              { icon: Bike, name: "Activa 6G · KL-07-CD-5678", type: "Bike", size: "Two-wheeler", color: "bg-mint-100 text-mint-600" },
              { icon: Truck, name: "Tata Nexon EV · KL-07-EF-9101", type: "EV", size: "Compact SUV", color: "bg-ember-100 text-ember-600" },
            ].map((v) => (
              <div key={v.name} className="flex items-center gap-2.5 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${v.color}`}><v.icon size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-bold text-ink">{v.name}</p>
                  <p className="text-[8px] text-slate-400">{v.type} · {v.size}</p>
                </div>
                <span className="grid h-4 w-4 place-items-center rounded-full border border-mint-500"><span className="h-2 w-2 rounded-full bg-mint-500" /></span>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function Phone({ variant, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <div className="rounded-[2.4rem] border-[6px] border-ink-900 bg-ink-900 p-1.5 shadow-[0_40px_90px_-20px_rgba(17,24,39,0.5)]">
        <div className="overflow-hidden rounded-[2rem] bg-[#f6f7fb]" style={{ height: "460px" }}>
          <div className="mx-auto mt-2 mb-1 h-1.5 w-24 rounded-full bg-ink-900/90" />
          <div className="h-full overflow-hidden">
            <PhoneScreen variant={variant} />
          </div>
        </div>
      </div>
      <div aria-hidden className="absolute -right-2 top-6 h-12 w-1.5 rounded-full bg-ink-900" />
      <div aria-hidden className="absolute -left-2 top-24 h-6 w-1.5 rounded-full bg-ink-900" />
    </div>
  );
}
