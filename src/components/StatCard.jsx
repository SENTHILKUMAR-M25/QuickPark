import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = "up", 
  subtitle,
  loading = false,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative stat-card overflow-hidden ${className}`}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 opacity-0 hover:opacity-100 transition duration-300" />

      <div className="flex items-start justify-between relative z-10">
        {/* Left */}
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          {/* Value / Skeleton */}
          {loading ? (
            <div className="h-6 w-20 bg-muted animate-pulse rounded mt-2" />
          ) : (
            <p className="text-2xl font-display font-bold mt-1">
              {value}
            </p>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}

          {/* Trend */}
          {trend && !loading && (
            <div
              className={`flex items-center gap-1 text-xs mt-1 ${
                trendType === "up"
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              {trendType === "up" ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {trend}
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}