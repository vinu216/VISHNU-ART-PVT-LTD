import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type AnimatedCounterProps = {
  value: number;
  label: string;
};

export function AnimatedCounter({ value, label }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.6, ease: "easeOut" });
    return () => controls.stop();
  }, [count, inView, value]);

  return (
    <div ref={ref} className="rounded-2xl border border-[#c5ac8c]/45 bg-[#ffffff12] p-5 backdrop-blur">
      <p className="text-3xl font-semibold sm:text-4xl">
        <motion.span>{rounded}</motion.span>
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-current/75">{label}</p>
    </div>
  );
}