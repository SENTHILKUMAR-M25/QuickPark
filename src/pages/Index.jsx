import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card-strong p-10 text-center max-w-xl mx-auto space-y-5 relative"
      >
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Welcome to <span className="text-primary">QuickPark</span>
        </h1>

        <p className="text-muted-foreground text-lg">
          Find, book, and manage parking spaces effortlessly.
          Smart parking for modern cities 🚗
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link to="/login">
            <Button variant="outline">
              Login
            </Button>
          </Link>

          <Link to="/register">
            <Button>
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

    </div>
  );
};

export default Index;