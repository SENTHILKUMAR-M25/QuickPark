import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Trust from "./components/Trust";
import Problem from "./components/Problem";
import Solution from "./components/Solution";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import UseCases from "./components/UseCases";
import AppShowcase from "./components/AppShowcase";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#fbfcfe]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Trust />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <Benefits />
        <UseCases />
        <AppShowcase />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
