import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Mail, Lock, User, Phone, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
import { useAppDispatch } from "../redux/hook";
import { login } from "../redux/slices/authSlice";
import { useToast } from "../hooks/use-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const e = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      e.email = "Please enter a valid email address";
    }
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate network delay for premium feel
    setTimeout(() => {
      const user = {
        id: `new_${Date.now()}`,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        createdAt: new Date().toISOString().split("T")[0],
        status: form.role === "provider" ? "pending" : "active",
      };

      dispatch(login(user));

      toast({
        title: "Account Created Successfully!",
        description: `Welcome to QuickPark, ${user.name}`,
      });

      setIsSubmitting(false);
      navigate(form.role === "provider" ? "/provider/dashboard" : "/user/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-background tracking-tight">
      {/* Left Column: Branding & Features (Visible on Large Screens) */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#0A1F44] to-[#010B18] text-white p-12 flex-col justify-between overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#3A86FF_0%,_transparent_60%)]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00C897] rounded-full blur-[160px] opacity-10" />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3A86FF] to-[#00C897] flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider">QuickPark</span>
        </Link>

        <div className="relative z-10 max-w-lg space-y-6">
          <h2 className="text-4xl font-display font-bold leading-tight">
            Find the perfect parking space, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3A86FF] to-[#00C897]">
              intelligently.
            </span>
          </h2>
          
          <p className="text-muted-foreground text-lg">
            Join the futuristic network connecting drivers with premium, secure parking locations globally.
          </p>

          <ul className="space-y-4 pt-4">
            {[
              { icon: MapPin, text: "Real-time automated spot tracking" },
              { icon: ShieldCheck, text: "Contactless and secure digital payments" },
              { icon: CheckCircle2, text: "Monetize your unused driveway or garage" },
            ].map((item, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-center gap-3 text-sm text-gray-300"
              >
                <div className="p-1.5 rounded-md bg-white/5 border border-white/10 text-[#00C897]">
                  <item.icon className="w-4 h-4" />
                </div>
                {item.text}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} QuickPark Technologies Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-slate-50 dark:bg-[#040B16]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white dark:bg-[#0A1325] shadow-xl dark:shadow-2xl dark:shadow-black/40 border border-slate-100 dark:border-white/5 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign up to access premium parking hubs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">
                  <User className="w-4 h-4" />
                </span>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="John Doe"
                  className={`pl-10 h-11 bg-slate-50 dark:bg-[#0E1B31] border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.name ? "border-destructive focus:ring-destructive/20" : ""
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.name && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-destructive mt-1">
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                </span>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`pl-10 h-11 bg-slate-50 dark:bg-[#0E1B31] border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.email ? "border-destructive focus:ring-destructive/20" : ""
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-destructive mt-1">
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                </span>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="9876543210"
                  className={`pl-10 h-11 bg-slate-50 dark:bg-[#0E1B31] border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.phone ? "border-destructive focus:ring-destructive/20" : ""
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.phone && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-destructive mt-1">
                    {errors.phone}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </span>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="••••••••"
                  className={`pl-10 h-11 bg-slate-50 dark:bg-[#0E1B31] border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.password ? "border-destructive focus:ring-destructive/20" : ""
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-destructive mt-1">
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Account Role Segment Controls */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">I want to</Label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-50 dark:bg-[#0E1B31] border border-slate-100 dark:border-white/10 rounded-xl relative">
                {["user", "provider"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => update("role", role)}
                    className="relative py-2.5 rounded-lg text-sm font-medium z-10 transition-colors"
                  >
                    {form.role === role && (
                      <motion.div
                        layoutId="activeRole"
                        className="absolute inset-0 bg-primary rounded-lg shadow-md shadow-primary/20 -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className={form.role === role ? "text-primary-foreground" : "text-muted-foreground"}>
                      {role === "user" ? "Book Parking" : "List Parking"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full h-11 bg-gradient-to-r from-[#3A86FF] to-[#00C897] hover:shadow-lg hover:shadow-primary/25 font-medium transition-all"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}