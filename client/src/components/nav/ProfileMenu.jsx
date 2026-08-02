import React, { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { roleMeta } from "../../lib/auth.meta";
import { cn } from "../../lib/utils";

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function RoleBadge({ role }) {
  const styles = {
    USER: "bg-brand-50 text-brand-700 border-brand-100",
    PROVIDER: "bg-mint-50 text-mint-700 border-mint-100",
    ADMIN: "bg-ember-50 text-ember-600 border-ember-100",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        styles[role] || styles.USER
      )}
    >
      {roleMeta(role).badge}
    </span>
  );
}

function ProfileImage({ user, className }) {
  if (user?.profileImage) {
    return (
      <img src={user.profileImage} alt={user.name} className={`h-full w-full object-cover ${className || ""}`} />
    );
  }
  return <span className={className || ""}>{initials(user?.name)}</span>;
}

const ProfileMenu = memo(function ProfileMenu() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const meta = roleMeta(role);
  const dropdown = meta.dropdown || [];

  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        className="flex items-center gap-2 rounded-full p-1 pr-1.5 transition-colors hover:bg-white/60"
      >
        <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white ring-2 ring-white">
          <ProfileImage user={user} />
        </span>
        <ChevronDown
          size={16}
          className={cn("text-slate-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="menu"
            className="absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-slate-100 bg-white/95 p-2 shadow-lift backdrop-blur dark:border-ink-700 dark:bg-ink-900/95"
          >
            <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 px-3 py-3 dark:bg-ink-800/60">
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                <ProfileImage user={user} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink dark:text-white">{user?.name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-ink-400">{user?.email}</p>
              </div>
              <RoleBadge role={role} />
            </div>

            <nav className="mt-1.5 flex flex-col" aria-label="Account">
              {dropdown.map((item) => (
                <button
                  key={item.label}
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    navigate(item.to);
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-ink-200 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                >
                  <UserIcon size={16} className="text-slate-400 dark:text-ink-500" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="my-1.5 border-t border-slate-100 dark:border-ink-700/60" />

            <button
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ProfileMenu;