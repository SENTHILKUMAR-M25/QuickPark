import { lazy, Suspense, memo } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import DashboardPreview from "./components/DashboardPreview";
import ProviderSummary from "./components/ProviderSummary";
import AuthLoader from "./components/AuthLoader";
import { useAuth } from "./context/AuthContext";

// Lazy-load below-the-fold / marketing sections to keep initial paint fast.
const Trust = lazy(() => import("./components/Trust"));
const HowItWorks = lazy(() => import("./components/HowItWorks"));
const Features = lazy(() => import("./components/Features"));
const Benefits = lazy(() => import("./components/Benefits"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const FAQ = lazy(() => import("./components/FAQ"));

function SectionFallback() {
  return <div className="h-40" />;
}

/** Wrapper that lazy-loads a marketing section with a suspense fallback. */
const Section = memo(function Section({ Comp }) {
  return (
    <Suspense fallback={<SectionFallback />}>
      <Comp />
    </Suspense>
  );
});

/** Which marketing sections render for each audience. */
const SECTION_MAP = {
  GUEST: [Trust, HowItWorks, Features, Benefits, Testimonials, FAQ],
  USER: [Trust, HowItWorks, Features, Testimonials, FAQ],
  PROVIDER: [Trust, HowItWorks, Testimonials, FAQ],
};

function LandingContent({ isUser, isProvider }) {
  const sections = SECTION_MAP[isUser ? "USER" : isProvider ? "PROVIDER" : "GUEST"];

  return (
    <>
      <Hero />
      {isUser && <DashboardPreview />}
      {isProvider && <ProviderSummary />}
      {sections.map((Comp, i) => (
        <Section key={i} Comp={Comp} />
      ))}
    </>
  );
}

export default function App() {
  const { loading, isAuthenticated, role, isAdmin } = useAuth();

  if (loading) return <AuthLoader />;

  // Admin gets pushed straight to their dashboard — no landing page.
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  const isUser = isAuthenticated && role === "USER";
  const isProvider = isAuthenticated && role === "PROVIDER";

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#fbfcfe] dark:bg-ink-950">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <LandingContent isUser={isUser} isProvider={isProvider} />
      </main>
      <Footer />
    </div>
  );
}