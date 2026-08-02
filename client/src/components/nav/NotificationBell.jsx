import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

/**
 * Authenticated-only notification bell with an unread badge.
 * The count is intentionally driven by a single prop so it is trivial to
 * swap in a live feed endpoint later (polling / WebSocket).
 */
function NotificationBell({ unread = 0, to = "/notifications" }) {
  return (
    <Link
      to={to}
      aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
      className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/70 text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-600"
    >
      <Bell size={19} strokeWidth={2.2} />
      {unread > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-gradient-to-r from-brand-500 to-brand-700 px-1 text-[10px] font-bold text-white ring-2 ring-white h-4.5">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
}

export default memo(NotificationBell);