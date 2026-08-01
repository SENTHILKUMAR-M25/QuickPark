import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { fadeUp, viewport, EASE, stagger as staggerContainer } from "../../lib/motion";

export function Reveal({ children, delay = 0, className = "", as = "div" }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

export function Counter({ to, decimals = 0, suffix = "", prefix = "", duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function MagneticButton({ children, className = "", strength = 0.35, onClick, type = "button" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * strength);
    y.set(relY * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export function TiltCard({ children, className = "", max = 10, glare = true }) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });
  const glareX = useTransform(sry, [-max, max], [0, 100]);
  const glareY = useTransform(srx, [-max, max], [0, 100]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.55), transparent 42%)`
  );

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * max);
    rx.set(-py * max);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
      className={`perspective-1200 ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}

export function SectionTag({ children, icon: Icon, tone = "brand" }) {
  const tones = {
    brand: "text-brand-700 bg-brand-50 border-brand-100",
    mint: "text-mint-700 bg-mint-50 border-mint-100",
    ember: "text-ember-600 bg-ember-50 border-ember-100",
  };
  return (
    <motion.div
      variants={fadeUp}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${tones[tone]}`}
    >
      {Icon && <Icon size={14} strokeWidth={2.4} />}
      <span>{children}</span>
    </motion.div>
  );
}

export function SectionHeading({ tag, title, description, align = "center", tone = "brand" }) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={`flex flex-col gap-5 ${alignCls} ${align === "center" ? "mx-auto max-w-3xl" : "max-w-2xl"}`}
    >
      {tag && <SectionTag tone={tone}>{tag}</SectionTag>}
      <motion.h2
        variants={fadeUp}
        className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p variants={fadeUp} className="text-base leading-relaxed text-slate-500 sm:text-lg">
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
