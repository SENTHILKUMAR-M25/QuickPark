import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { motion } from "framer-motion";
import { Car, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAppDispatch } from "../redux/hook";
import { login } from "../redux/slices/authSlice";
import { mockUsers, mockProviders } from "../utils/mockData";
import { useToast } from "../hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ Validation
  const validate = () => {
    const e = {};

    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      e.email = "Invalid email format";

    if (!password) e.password = "Password is required";
    else if (password.length < 4)
      e.password = "Password must be at least 4 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ✅ Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      const allUsers = [
        ...mockUsers,
        ...mockProviders,
        {
          id: "admin1",
          name: "Admin",
          email: "admin@parksmart.com",
          role: "admin",
        },
      ];

      const user = allUsers.find((u) => u.email === email);

      if (user) {
        dispatch(login(user));

        toast({
          title: "Welcome back 👋",
          description: `Logged in as ${user.name}`,
        });

        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "provider") navigate("/provider/dashboard");
        else navigate("/user/dashboard");
      } else {
        dispatch(login(mockUsers[0]));

        toast({
          title: "Demo Login",
          description: `Logged in as ${mockUsers[0].name}`,
        });

        navigate("/user/dashboard");
      }

      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-blue-50">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card-strong p-8 space-y-6">

          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>

            <h1 className="text-2xl font-display font-bold">
              Welcome Back
            </h1>

            <p className="text-sm text-muted-foreground">
              Sign in to your ParkSmart account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <Label>Email</Label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing In..." : "Sign In"}
            </Button>

          </form>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign Up
            </Link>
          </div>

          {/* Demo Accounts */}
          <div className="p-4 rounded-xl bg-accent/50 text-xs space-y-1">
            <p className="font-semibold text-foreground">
              Demo Accounts:
            </p>
            <p>User: rahul@example.com</p>
            <p>Provider: parkeasy@example.com</p>
            <p>Admin: admin@parksmart.com</p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}