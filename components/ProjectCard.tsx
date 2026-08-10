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
  swatch: string; // La couleur/gradient de fond d'origine
}

const TYPE_META = {
  photo: { label: "Photos", Icon: Camera },
  plan: { label: "Plans", Icon: Ruler },
  "3d": { label: "Vue 3D", Icon: Box },
};

export default function ProjectCard({ project, index = 0 }: { project: ProjectData, index?: number }) {
  const meta = TYPE_META[project.type];
  
  // Décale l'animation pour que les bulles ne bougent pas toutes en synchronisation parfaite
  const delay = (index % 3) * -2; // Donne des délais de 0s, -2s, -4s

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative block w-full aspect-square text-left cursor-pointer group"
    >
      {/* 
        La bulle animée en CSS pur : 
        C'est elle qui gère la couleur d'origine et la déformation organique
      */}
      <div 
        className="absolute inset-0 overflow-hidden animate-morph shadow-[0_10px_30px_rgba(2,4,77,0.15)] transition-shadow duration-500 group-hover:shadow-[0_20px_40px_rgba(2,4,77,0.25)]"
        style={{ 
          background: project.swatch,
          animationDelay: `${delay}s` 
        }}
      >
        {/* 
          Overlay très léger (juste en bas) pour garantir la lisibilité du texte 
          sans masquer la belle couleur du projet au centre de la bulle.
        */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(2,4,77,0.85)_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Badge (Flottant en haut, centré) */}
      <div className="absolute top-8 inset-x-0 flex justify-center z-20">
        <div className="flex items-center gap-1.5 bg-k-ink/20 backdrop-blur-md text-k-cream text-[0.66rem] tracking-wider uppercase px-4 py-2 rounded-full border border-white/20 shadow-sm transition-transform duration-500 group-hover:-translate-y-1 group-hover:bg-k-ink/40">
          <meta.Icon size={14} /> {meta.label}
        </div>
      </div>

      {/* Contenu (Centré en bas) */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-8 flex flex-col items-center justify-end text-center h-full pb-10">
        <span className="block text-[0.64rem] tracking-[0.16em] uppercase text-k-gold/90 mb-2 transition-transform duration-500 group-hover:-translate-y-2">
          {project.place}
        </span>
        <h3 className="text-2xl text-k-cream m-0 drop-shadow-md transition-transform duration-500 group-hover:-translate-y-2">
          {project.title}
        </h3>
      </div>
    </motion.button>
  );
}
