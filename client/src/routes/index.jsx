import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { motion } from "framer-motion";
import Landing from "../App";
import AuthLoader from "../components/AuthLoader";

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
const UserRegisterPage = lazyPage(() => import("../pages/auth/UserRegisterPage"));
const ProviderRegisterPage = lazyPage(() => import("../pages/auth/ProviderRegisterPage"));
const ForgotPasswordPage = lazyPage(() => import("../pages/auth/ForgotPasswordPage"));
const VerifyOtpPage = lazyPage(() => import("../pages/auth/VerifyOtpPage"));
const ResetPasswordPage = lazyPage(() => import("../pages/auth/ResetPasswordPage"));
const VerifyEmailPage = lazyPage(() => import("../pages/auth/VerifyEmailPage"));
const SuccessPage = lazyPage(() => import("../pages/auth/SuccessPage"));
const NotFoundPage = lazyPage(() => import("../pages/auth/NotFoundPage"));
const AdminDashboard = lazyPage(() => import("../pages/AdminDashboard"));

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
    path: "/register",
    element: <UserRegisterPage />,
  },
  {
    path: "/provider/register",
    element: <ProviderRegisterPage />,
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
    element: <AdminDashboard />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);