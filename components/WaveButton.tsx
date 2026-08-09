"use client";

import { motion } from "framer-motion";

interface WaveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function WaveButton({ children, onClick }: WaveButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial="initial"
      whileHover="hover"
      className="relative overflow-hidden px-8 py-4 rounded-full border border-k-ink text-k-ink font-body font-semibold uppercase tracking-widest shadow-lg transition-transform duration-300 hover:-translate-y-1 group"
    >
      {/* Texte au premier plan */}
      <span className="relative z-10 transition-colors duration-500 group-hover:text-k-cream">
        {children}
      </span>

      {/* Le fond liquide caché par défaut (positionné en bas) */}
      <motion.div
        variants={{
          initial: { y: "100%" },
          hover: { y: "0%" },
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-k-ink z-0"
      >
        {/* La forme de la vague en haut du fond liquide */}
        <motion.svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          className="absolute bottom-full left-0 w-[200%] h-8 text-k-ink origin-bottom -mb-[1px]"
          variants={{
            initial: { x: "0%" },
            hover: { x: "-50%" },
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 2,
              ease: "linear",
            },
          }}
        >
          <path
            fill="currentColor"
            d="M0 20 V 10 C 15 10, 25 20, 50 15 C 75 10, 85 20, 100 20 Z"
          />
        </motion.svg>
      </motion.div>
    </motion.button>
  );
}
