"use client";
import { motion } from "framer-motion";

const AMBIENT_BLOBS = [
  { cls: "w-[38vw] h-[38vw] -left-[8%] -top-[12%] bg-k-gold", x: [0, 70, -40, 0], y: [0, -55, 35, 0], scale: [1, 1.15, 0.94, 1], duration: 20 },
  { cls: "w-[30vw] h-[30vw] -right-[6%] top-[20%] bg-k-indigo", x: [0, -80, 50, 0], y: [0, 45, -60, 0], scale: [1, 0.9, 1.12, 1], duration: 25 },
  { cls: "w-[26vw] h-[26vw] left-[20%] -bottom-[14%] bg-k-gold-deep", x: [0, 55, -65, 0], y: [0, -45, 30, 0], scale: [1, 1.2, 0.92, 1], duration: 17 },
];

export default function Ambient({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isDark = variant === "dark";
  const blendClass = isDark ? "mix-blend-screen opacity-50" : "mix-blend-multiply opacity-55";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      /* 
        CORRECTION : On a supprimé 'overflow-hidden' ici.
        La lumière peut maintenant déborder et fusionner avec les sections voisines.
      */
      className="absolute inset-0 -z-10 pointer-events-none" 
      aria-hidden="true"
    >
      {AMBIENT_BLOBS.map((b, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full blur-[55px] ${blendClass} ${b.cls}`}
          animate={{ x: b.x, y: b.y, scale: b.scale }}
          transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}
