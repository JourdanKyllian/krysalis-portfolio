"use client";

import { motion } from "framer-motion";
import { Camera, Ruler, Box } from "lucide-react";

export type ProjectType = "photo" | "plan" | "3d";

export interface ProjectData {
  id: number;
  title: string;
  place: string;
  category: string;
  type: ProjectType;
  swatch: string; // La couleur/gradient de fond
}

const TYPE_META = {
  photo: { label: "Photos", Icon: Camera },
  plan: { label: "Plans", Icon: Ruler },
  "3d": { label: "Vue 3D", Icon: Box },
};

export default function ProjectCard({ project, index = 0 }: { project: ProjectData, index?: number }) {
  const meta = TYPE_META[project.type];
  
  // Rotation des formes de blobs comme dans le prototype (nth-child)
  const blobClass = index % 3 === 0 
    ? "rounded-(--blob-card-3)" 
    : index % 2 === 0 
      ? "rounded-(--blob-card-2)" 
      : "rounded-(--blob-card-1)";

  return (
    <motion.button
      initial="initial"
      whileHover="hover"
      className={`relative overflow-hidden w-full aspect-4/5 flex items-end text-left cursor-pointer transition-transform duration-500 hover:-translate-y-2 group ${blobClass}`}
    >
      {/* Fond coloré (Swatch) */}
      <div className="absolute inset-0" style={{ background: project.swatch }} />

      {/* Masque liquide (Vague montante) */}
      <motion.div
        variants={{
          initial: { y: "100%" },
          hover: { y: "0%" },
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-k-indigo/95 z-0"
      >
        <motion.svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          className="absolute bottom-full left-0 w-[200%] h-12 text-k-indigo/95 origin-bottom -mb-px"
          variants={{ initial: { x: "0%" }, hover: { x: "-50%" } }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 3, ease: "linear" } }}
        >
          <path fill="currentColor" d="M0 20 V 10 C 15 10, 25 20, 50 15 C 75 10, 85 20, 100 20 Z" />
        </motion.svg>
      </motion.div>

      {/* Overlay sombre statique pour la lisibilité du texte */}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(2,4,77,0.78)_0%,transparent_55%)] z-10 transition-opacity duration-500 group-hover:opacity-0" />

      {/* Badge Type (en haut à droite) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-k-ink/55 backdrop-blur-md text-k-cream text-[0.66rem] tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/10">
        <meta.Icon size={12} /> {meta.label}
      </div>

      {/* Informations (en bas) */}
      <div className="relative z-20 p-6 md:p-8 w-full transition-transform duration-500 group-hover:-translate-y-2">
        <span className="block text-[0.64rem] tracking-[0.16em] uppercase text-k-gold mb-2">
          {project.place}
        </span>
        <h3 className="text-xl text-k-cream m-0 drop-shadow-md">
          {project.title}
        </h3>
      </div>
    </motion.button>
  );
}
