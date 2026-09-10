import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { roleMeta } from "../lib/auth.meta";
import ProfileMenu from "./nav/ProfileMenu";
import NotificationBell from "./nav/NotificationBell";
import AuthButtons from "./auth/AuthButtons";

import logo from "../../public/logo.jpeg";

const GuestLinks = [
 { label: "Features", to: "/#features", anchor: "features" },
 { label: "How It Works", to: "/#how-it-works", anchor: "how-it-works" },
 { label: "Pricing", to: "/#pricing", anchor: "pricing" },
 { label: "FAQ", to: "/#faq", anchor: "faq" },
];

const UserLinks = [
  { label: "Find Parking", to: "/search" },
  { label: "My Bookings", to: "/user/dashboard" },
  { label: "Favorites", to: "/favorites" },
];

const ProviderLinks = [
 { label: "My Parking", to: "/provider/parking" },
 { label: "Bookings", to: "/provider/bookings" },
 { label: "Revenue", to: "/provider/revenue" },
];

/** IntersectionObserver scroll-spy so guest anchor links highlight the section in view. */
function useActiveSection(anchors) {
 const [active, setActive] = useState("");
 const key = anchors.join(",");
 useEffect(() => {
 const ids = anchors.filter(Boolean);
 if (!ids.length) return;
 const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
 if (!sections.length) return;
 const observer = new IntersectionObserver(
 (entries) => {
 const visible = entries
 .filter((e) => e.isIntersecting)
 .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
 if (visible[0]) setActive(visible[0].target.id);
 },
 { rootMargin: "-25% 0px -65% 0px", threshold: [0, 0.25, 0.5, 1] }
 );
 sections.forEach((s) => observer.observe(s));
 return () => observer.disconnect();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [key]);
 return active;
}

function DesktopLink({ link, activeAnchor }) {
 const isAnchor = link.anchor != null;
 if (isAnchor) {
 const isActive = activeAnchor === link.anchor;
 return (
 <a
 href={link.to}
 className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive ? "text-ink" : "text-slate-600 hover:text-ink:text-white"}`}
 >
 {link.label}
 <span className={`absolute inset-x-4 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-brand-500 to-mint-500 transition-transform duration-300 group-hover:scale-x-100 ${isActive ? "scale-x-100" : ""}`} />
 </a>
 );
 }
 return (
 <NavLink
 to={link.to}
 className={({ isActive }) =>
 `group relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive ? "text-ink" : "text-slate-600 hover:text-ink:text-white"}`
 }
 >
 {({ isActive }) => (
 <>
 {link.label}
 <span className={`absolute inset-x-4 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-brand-500 to-mint-500 transition-transform duration-300 group-hover:scale-x-100 ${isActive ? "scale-x-100" : ""}`} />
 </>
 )}
 </NavLink>
 );
}

export default function Navbar() {
 const { isAuthenticated, role, isProvider, logout } = useAuth();
 const navigate = useNavigate();
 const [scrolled, setScrolled] = useState(false);
 const [open, setOpen] = useState(false);

 useEffect(() => {
 const onScroll = () => setScrolled(window.scrollY > 24);
 onScroll();
 window.addEventListener("scroll", onScroll, { passive: true });
 return () => window.removeEventListener("scroll", onScroll);
 }, []);

 const meta = roleMeta(role);
 const links = !isAuthenticated
 ? GuestLinks
 : isProvider
 ? ProviderLinks
 : UserLinks;

 const anchorIds = !isAuthenticated ? GuestLinks.map((l) => l.anchor) : [];
 const activeAnchor = useActiveSection(anchorIds);

 const mobileLinks = !isAuthenticated
 ? [
 { label: "Home", to: "/" },
 { label: "Features", to: "/#features" },
 { label: "FAQ", to: "/#faq" },
 { label: "Login", to: meta.login },
 { label: "Register", to: meta.register },
 ]
 : isProvider
 ? [
 { label: "Dashboard", to: "/provider/dashboard" },
 { label: "Parking", to: "/provider/parking" },
 { label: "Bookings", to: "/provider/bookings" },
 { label: "Wallet", to: "/provider/wallet" },
 ]
  : [
  { label: "Home", to: "/" },
  { label: "Find Parking", to: "/search" },
  { label: "My Bookings", to: "/user/dashboard" },
  { label: "Notifications", to: "/notifications" },
  { label: "Dashboard", to: "/user/dashboard" },
  ];

 async function handleLogout() {
 setOpen(false);
 await logout();
 navigate("/");
 }

 return (
 <motion.header
 initial={{ y: -80, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
 className="fixed inset-x-0 top-0 z-50"
 >
 <div className="container-x">
 <div
 className={`mt-4 flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-6 ${
  scrolled ? "glass shadow-card" : "bg-transparent"
 }`}
 >
 <NavLink to="/" className="flex items-center gap-2.5" aria-label="Quick Park home">
 <img
 src={logo}
 alt=""
 className="h-12 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 object-cover shadow-glow"
 />
 <span className="font-display text-lg font-bold tracking-tight text-ink">
 Quick<span className="text-gradient">Park</span>
 </span>
 </NavLink>

 <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
 {links.map((l) => (
 <DesktopLink key={l.to} link={l} activeAnchor={activeAnchor} />
 ))}
 </nav>

  <div className="hidden items-center gap-3 lg:flex">
  {isAuthenticated ? (
 <>
 <NotificationBell
 unread={isProvider ? 5 : 3}
 to={isProvider ? "/provider/notifications" : "/notifications"}
 />
 <ProfileMenu />
 </>
 ) : (
 <AuthButtons role={role} />
 )}
 </div>

 <button
 onClick={() => setOpen(!open)}
 className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white/70 text-ink lg:hidden"
 aria-label={open ? "Close menu" : "Open menu"}
 aria-expanded={open}
 >
 {open ? <X size={20} /> : <Menu size={20} />}
 </button>
 </div>
 </div>

 <AnimatePresence>
 {open && (
 <motion.div
 initial={{ opacity: 0, y: -12 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -12 }}
 transition={{ duration: 0.25 }}
 className="container-x lg:hidden"
 >
 <div className="mt-2 rounded-2xl glass p-4 shadow-lift">
 <nav className="flex flex-col" aria-label="Mobile">
 {mobileLinks.map((l) => (
 <NavLink
 key={l.label}
 to={l.to}
 onClick={() => setOpen(false)}
 className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700:bg-brand-500/10:text-brand-300"
 >
 {l.label}
 </NavLink>
 ))}
 </nav>

 <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
 {isAuthenticated ? (
 <button
 onClick={handleLogout}
 className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white"
 >
 <LogOut size={16} /> Logout
 </button>
 ) : (
 <AuthButtons role={role} />
 )}
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.header>
 );
}