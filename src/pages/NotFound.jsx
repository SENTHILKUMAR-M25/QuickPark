import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card-strong p-10 text-center max-w-md w-full space-y-5 relative"
      >

        {/* 404 Title */}
        <h1 className="text-6xl font-bold text-primary">
          404
        </h1>

        <h2 className="text-xl font-semibold">
          Page Not Found
        </h2>

        <p className="text-muted-foreground text-sm">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3 pt-4">

          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>

          <Link to="/login">
            <Button>
              Login
            </Button>
          </Link>

        </div>

        {/* Route Info (optional dev info) */}
        <p className="text-xs text-muted-foreground mt-4">
          Path: {location.pathname}
        </p>

      </motion.div>
    </div>
  );
}