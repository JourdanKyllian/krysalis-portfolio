"use client";

import { useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Ambient from "@/components/Ambient";
import Reveal from "@/components/Reveal";
import WaveButton from "@/components/WaveButton";

/* --- Le SVG Génératif (Blob du Hero) --- */
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
    <svg viewBox="0 0 400 400" className="w-[min(70vw,640px)] h-[min(70vw,640px)] opacity-85">
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

/* --- Variants Framer Motion typés --- */
const heroContainer: Variants = {
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } }
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function Home() {
  return (
    <>
      {/* SECTION HERO */}
      <header className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-36 pb-16 tex-travertine">
        <Ambient variant="light" />

        {/* Blob SVG Arrière-plan (Syntaxe Tailwind v4) */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
          <div className="absolute w-[60vw] h-[60vw] max-w-175 max-h-175 bg-[radial-gradient(circle,rgba(244,217,100,0.45),transparent_65%)] blur-2xl" />
          <HeroBlob />
        </div>

        <motion.div variants={heroContainer} initial="hidden" animate="visible" className="flex flex-col items-center">
          <motion.div variants={heroItem} className="flex items-center gap-2 text-[0.72rem] tracking-[0.25em] uppercase text-k-indigo font-semibold mb-6">
            <span className="w-5 h-px bg-k-gold-deep" />
            Décoration & agencement intérieur sur mesure
            <span className="w-5 h-px bg-k-gold-deep" />
          </motion.div>

          <motion.h1 variants={heroItem} className="text-[clamp(2.6rem,6vw,4.8rem)] max-w-[14ch]">
            Des intérieurs qui respirent
          </motion.h1>

          <motion.p variants={heroItem} className="max-w-[46ch] text-[1.08rem] text-k-ink/70 mt-4 leading-relaxed">
            Krysalis Studio imagine des espaces vivants, façonnés dans la matière et la lumière du sud. Chaque projet est une métamorphose, jamais un copier-coller.
          </motion.p>

          <motion.div variants={heroItem} className="flex flex-wrap justify-center gap-4 mt-9">
            <Link href="/projets">
              <WaveButton>Voir les réalisations</WaveButton>
            </Link>
            
            {/* Bouton secondaire avec la syntaxe v4 pour les variables CSS */}
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 text-[0.85rem] font-semibold tracking-wider text-k-ink border-[1.5px] border-k-ink/25 rounded-(--blob-1) hover:rounded-(--blob-2) hover:border-k-ink hover:-translate-y-1 transition-all duration-300">
              Prendre rendez-vous <ArrowRight size={15} />
            </Link>
          </motion.div>

          <motion.div variants={heroItem} className="flex gap-10 mt-12 pt-6 border-t border-k-ink/15">
            <div><div className="font-display text-3xl">60+</div><div className="text-[0.66rem] tracking-widest uppercase text-k-ink/55 mt-1">Intérieurs transformés</div></div>
            <div><div className="font-display text-3xl">8</div><div className="text-[0.66rem] tracking-widest uppercase text-k-ink/55 mt-1">Années d'expérience</div></div>
            <div><div className="font-display text-3xl">100%</div><div className="text-[0.66rem] tracking-widest uppercase text-k-ink/55 mt-1">Projets sur mesure</div></div>
          </motion.div>
        </motion.div>
      </header>

      {/* SECTION APPROCHE */}
      <section className="relative py-24 overflow-hidden tex-oak">
        <Ambient variant="dark" />
        
        {/* Syntaxe Tailwind v4 pour la largeur max */}
        <div className="max-w-295 mx-auto px-[6vw]">
          <Reveal className="max-w-160 mb-12 relative z-10">
            <span className="block text-[0.7rem] tracking-[0.25em] uppercase text-k-gold font-bold mb-3">Notre approche</span>
            <h2 className="text-[clamp(1.9rem,3.4vw,2.8rem)] text-k-stone">Du croquis au geste, une transformation continue</h2>
            <p className="text-k-stone/75 mt-4 leading-relaxed">Comme une chrysalide, chaque pièce traverse plusieurs états avant de trouver sa forme définitive. Nous accompagnons cette mue, de l'esquisse à la pose finale.</p>
          </Reveal>

          <Reveal delay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-9 relative z-10">
            <div>
              <span className="block text-[0.7rem] tracking-[0.25em] uppercase text-k-gold font-bold mb-3">01 · Écouter</span>
              <h3 className="text-xl text-k-stone">L'usage avant tout</h3>
              <p className="text-k-stone/70 mt-2 text-sm leading-relaxed">Chaque espace raconte une façon de vivre. On part de vos habitudes, jamais d'un catalogue.</p>
            </div>
            <div>
              <span className="block text-[0.7rem] tracking-[0.25em] uppercase text-k-gold font-bold mb-3">02 · Dessiner</span>
              <h3 className="text-xl text-k-stone">Des courbes qui respirent</h3>
              <p className="text-k-stone/70 mt-2 text-sm leading-relaxed">Peu d'angles droits, beaucoup de mouvement : nos plans cherchent la fluidité du vivant.</p>
            </div>
            <div>
              <span className="block text-[0.7rem] tracking-[0.25em] uppercase text-k-gold font-bold mb-3">03 · Matérialiser</span>
              <h3 className="text-xl text-k-stone">Des matières vraies</h3>
              <p className="text-k-stone/70 mt-2 text-sm leading-relaxed">Travertin, chêne massif, enduits à la chaux : des matériaux qui vieillissent avec caractère.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
