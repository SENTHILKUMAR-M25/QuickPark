import React, { memo } from "react";
import { Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

function MoonIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

/**
 * Animated day/night toggle. Uses `variant` to adapt to light/dark navbar
 * containers or auth shells.
 */
function ThemeToggle({ className = "", compact = false }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-full border transition-colors",
        compact ? "h-9 w-9" : "h-10 w-10",
        "border-slate-200 bg-white/70 text-ink hover:bg-slate-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:bg-ink-800",
        className
      )}
    >
      <Sun
        size={compact ? 17 : 18}
        strokeWidth={2.2}
        className="transition-all duration-300 dark:scale-0 dark:opacity-0"
      />
      <MoonIcon
        size={compact ? 16 : 17}
        className="absolute transition-all duration-300 scale-0 opacity-0 dark:scale-100 dark:opacity-100"
      />
    </button>
  );
}

export default memo(ThemeToggle);