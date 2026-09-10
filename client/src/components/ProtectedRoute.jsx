import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardFor, ROLES } from "../lib/auth.meta";
import AuthLoader from "./AuthLoader";

/**
 * Route guard. Redirects guests to login and wrong-role users to their own
 * dashboard. `roles` (optional) restricts which roles may view the route.
 */
export default function ProtectedRoute({ children, roles = [], fallbackPath }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoader />;
  if (!isAuthenticated) {
    const login = role === ROLES.PROVIDER ? "/provider/login" : "/login";
    return <Navigate to={fallbackPath || login} replace state={{ from: location.pathname }} />;
  }
  if (roles.length && !roles.includes(role)) {
    return <Navigate to={dashboardFor(role)} replace />;
  }
  return children;
}
