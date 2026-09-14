"use client";

import { useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Ambient from "@/components/Ambient";
import WaveButton from "@/components/WaveButton";
import Logo from "@/components/Logo";

interface HeroProps {
  categoriesCount: number;
  yearsOfExperience: number;
}

function HeroBlob() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !pathRef.current) return;
    const size = 400, cx = size / 2, cy = size / 2, baseR = size * 0.34, points = 10;
    let raf: number, t = 0, lastY = window.scrollY, boost = 0;

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      boost = Math.min(boost + delta * 0.6, 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const build = (time: number, amp: number) => {
      const pts = [];
      for (let i = 0; i < points; i++) {
        const angle = (Math.PI * 2 * i) / points;
        const n = Math.sin(angle * 3 + time) * 0.5 + Math.sin(angle * 5 - time * 1.3) * 0.3 + Math.sin(angle * 2 + time * 0.6) * 0.2;
        const r = baseR + n * amp;
        pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
      }
      let d = `M ${pts[0][0]} ${pts[0][1]} `;
      for (let i = 0; i < points; i++) {
        const p0 = pts[i], p1 = pts[(i + 1) % points];
        d += `Q ${p0[0]} ${p0[1]} ${(p0[0] + p1[0]) / 2} ${(p0[1] + p1[1]) / 2} `;
      }
      return d + "Z";
    };

    const tick = () => {
      t += 0.0032 + boost * 0.00025;
      boost *= 0.94;
      if (pathRef.current) pathRef.current.setAttribute("d", build(t, size * 0.05 + boost * 0.9));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <svg viewBox="0 0 400 400" className="w-[min(85vw,720px)] h-[min(85vw,720px)] opacity-85">
      <defs>
        <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d964" />
          <stop offset="55%" stopColor="#efca5e" />
          <stop offset="100%" stopColor="#02044d" />
        </linearGradient>
      </defs>
      <path ref={pathRef} fill="url(#blobGradient)" />
    </svg>
  );
}

const heroContainer: Variants = {
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } }
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function Hero({ categoriesCount, yearsOfExperience }: HeroProps) {
  return (
    <header className="relative min-h-[95vh] flex flex-col items-center justify-between px-4 pt-32 pb-12 tex-travertine z-10 overflow-hidden">
      <Ambient variant="light" />

      <motion.div variants={heroContainer} initial="hidden" animate="visible" className="w-full flex justify-center mt-4 mb-8 shrink-0 relative z-20">
        <motion.div variants={heroItem}>
          <Logo className="h-20 sm:h-28 md:h-40 drop-shadow-sm" variant="dark" />
        </motion.div>
      </motion.div>

      <motion.div variants={heroContainer} initial="hidden" animate="visible" className="relative flex flex-col items-center justify-center flex-1 w-full max-w-4xl z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center -z-10 pointer-events-none w-full h-full">
          <div className="absolute w-[75vw] h-[75vw] max-w-200 max-h-200 bg-[radial-gradient(circle,rgba(244,217,100,0.45),transparent_65%)] blur-3xl" />
          <HeroBlob />
        </div>

        <motion.div variants={heroItem} className="flex items-center gap-2 text-[0.65rem] md:text-[0.72rem] tracking-[0.25em] uppercase text-k-indigo font-semibold mb-6">
          <span className="w-5 h-px bg-k-gold-deep" />
          Décoration & agencement intérieur sur mesure
          <span className="w-5 h-px bg-k-gold-deep" />
        </motion.div>

        <motion.h1 variants={heroItem} className="text-[clamp(2.5rem,6vw,4.5rem)] max-w-[16ch] leading-none mb-6 text-center drop-shadow-sm">
          Des intérieurs qui respirent
        </motion.h1>

        <motion.p variants={heroItem} className="max-w-[48ch] text-[1.08rem] text-k-ink/75 mt-2 leading-relaxed text-center">
          Nous imaginons des espaces vivants, façonnés dans la matière et la lumière du sud. Chaque projet est une métamorphose, jamais un copier-coller.
        </motion.p>

        <motion.div variants={heroItem} className="flex flex-wrap justify-center gap-4 mt-10">
          <Link href="/projets">
            <WaveButton>Voir les réalisations</WaveButton>
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 text-[0.85rem] font-semibold tracking-wider text-k-ink border-[1.5px] border-k-ink/30 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/30 hover:border-k-ink hover:-translate-y-1 transition-all duration-300">
            Prendre rendez-vous <ArrowRight size={15} />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div variants={heroContainer} initial="hidden" animate="visible" className="w-full flex justify-center mt-12 shrink-0 relative z-20">
        <motion.div variants={heroItem} className="flex flex-wrap justify-center gap-10 md:gap-20 pt-8 border-t border-k-ink/15 w-full max-w-4xl">
          <div className="text-center">
            <div className="font-display text-3xl md:text-4xl text-k-ink">60+</div>
            <div className="text-[0.66rem] tracking-widest uppercase text-k-ink/60 mt-1.5">Intérieurs transformés</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl md:text-4xl text-k-ink">{yearsOfExperience}</div>
            <div className="text-[0.66rem] tracking-widest uppercase text-k-ink/60 mt-1.5">Années d'expérience</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl md:text-4xl text-k-ink">{categoriesCount}</div>
            <div className="text-[0.66rem] tracking-widest uppercase text-k-ink/60 mt-1.5">Univers créatifs</div>
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
}
