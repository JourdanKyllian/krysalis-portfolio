"use client";

import { motion } from "framer-motion";

interface WaveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  colorTheme?: "ink" | "gold";
  className?: string;
}

export default function WaveButton({ children, onClick, colorTheme = "ink", className = "" }: WaveButtonProps) {
  const isGold = colorTheme === "gold";

  // On retire les classes 'text-...' d'ici car Framer Motion va s'en charger
  const borderClass = isGold ? "border-k-gold" : "border-k-ink";
  const waveBgClass = isGold ? "bg-k-gold" : "bg-k-ink";
  const waveSvgClass = isGold ? "text-k-gold" : "text-k-ink";

  return (
    <motion.button
      onClick={onClick}
      initial="initial"
      whileHover="hover"
      // On a supprimé la classe 'group' de Tailwind qui causait le bug
      className={`relative overflow-hidden px-8 py-4 rounded-full border-[1.5px] ${borderClass} font-body font-semibold uppercase tracking-widest shadow-lg transition-transform duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* 
        CORRECTIF : Le texte est maintenant un élément <motion.span> animé.
        Sa couleur utilise les variables CSS natives de Tailwind v4.
        Il se synchronise obligatoirement avec la vague.
      */}
      <motion.span
        variants={{
          initial: { color: isGold ? "var(--color-k-gold)" : "var(--color-k-ink)" },
          hover: { color: isGold ? "var(--color-k-ink)" : "var(--color-k-cream)" }
        }}
        transition={{ duration: 0.5 }}
        className="relative z-10 block"
      >
        {children}
      </motion.span>

      {/* Fond liquide */}
      <motion.div
        variants={{
          initial: { y: "100%" },
          hover: { y: "0%" },
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute inset-0 ${waveBgClass} z-0`}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
          className="absolute bottom-full left-0 w-[200%] h-3 -mb-px"
        >
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={`w-full h-full ${waveSvgClass}`}>
            <path fill="currentColor" d="M0,15 c 12.5,0 12.5,-15 25,-15 c 12.5,0 12.5,15 25,15 c 12.5,0 12.5,-15 25,-15 c 12.5,0 12.5,15 25,15 v 15 h -100 z" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
