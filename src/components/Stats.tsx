import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

type StatProps = { target: number; label: string };

function Stat({ target, label }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1800;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <div className="font-serif text-6xl md:text-7xl text-rust leading-none mb-2">
        {value.toLocaleString('pl-PL').replace(/,/g, ' ')}
      </div>
      <div className="text-xs tracking-[0.2em] uppercase text-ink-soft">{label}</div>
    </motion.div>
  );
}

export default function Stats({ countries, days, km }: { countries: number; days: number; km: number }) {
  return (
    <section className="bg-bg-2 py-20 px-6 border-y border-ink/10 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
        <Stat target={countries} label="kraje" />
        <Stat target={days} label="dni w drodze" />
        <Stat target={km} label="przebytych km" />
      </div>
    </section>
  );
}
