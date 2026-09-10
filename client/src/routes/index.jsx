import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Landing from "../App";
import AuthLoader from "../components/AuthLoader";
import ProtectedRoute from "../components/ProtectedRoute";

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const lazyPage = (loader) => {
  const Comp = lazy(loader);
  return function LazyPage(props) {
    return (
      <Suspense fallback={<AuthLoader />}>
        <PageTransition>
          <Comp {...props} />
        </PageTransition>
      </Suspense>
    );
  };
};

const LoginPage = lazyPage(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazyPage(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazyPage(() => import("../pages/auth/ForgotPasswordPage"));
const VerifyOtpPage = lazyPage(() => import("../pages/auth/VerifyOtpPage"));
const ResetPasswordPage = lazyPage(() => import("../pages/auth/ResetPasswordPage"));
const VerifyEmailPage = lazyPage(() => import("../pages/auth/VerifyEmailPage"));
const SuccessPage = lazyPage(() => import("../pages/auth/SuccessPage"));
const NotFoundPage = lazyPage(() => import("../pages/auth/NotFoundPage"));
const AdminDashboard = lazyPage(() => import("../pages/AdminDashboard"));
const UserDashboard = lazyPage(() => import("../pages/dashboard/UserDashboard"));
const ProviderDashboard = lazyPage(() => import("../pages/dashboard/ProviderDashboard"));
const SearchPage = lazyPage(() => import("../pages/search/SearchPage"));
const SpaceDetailPage = lazyPage(() => import("../pages/search/SpaceDetailPage"));
const FavoritesPage = lazyPage(() => import("../pages/search/FavoritesPage"));
const TermsPage = lazyPage(() => import("../pages/legal/TermsPage"));

const ROLES = {
  USER: "USER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <LoginPage role="USER" />,
  },
  {
    path: "/provider/login",
    element: <LoginPage role="PROVIDER" />,
  },
  {
    path: "/admin/login",
    element: <LoginPage role="ADMIN" />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/provider/register",
    element: <RegisterPage initialRole="PROVIDER" />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtpPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/success",
    element: <SuccessPage />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute roles={[ROLES.ADMIN]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/dashboard",
    element: (
      <ProtectedRoute roles={[ROLES.USER]}>
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/provider/dashboard",
    element: (
      <ProtectedRoute roles={[ROLES.PROVIDER]}>
        <ProviderDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/search",
    element: (
      <ProtectedRoute roles={[ROLES.USER]}>
        <SearchPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/search/:id",
    element: (
      <ProtectedRoute roles={[ROLES.USER]}>
        <SpaceDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/favorites",
    element: (
      <ProtectedRoute roles={[ROLES.USER]}>
        <FavoritesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/terms",
    element: <TermsPage />,
  },
  {
    path: "/find-parking",
    element: <Navigate to="/search" replace />,
  },
  {
    path: "/bookings",
    element: <Navigate to="/user/dashboard" replace />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);