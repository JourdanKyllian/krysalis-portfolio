"use client";

import { useState } from "react";
import Ambient from "@/components/Ambient";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import { PROJECTS, FILTERS } from "@/lib/data";

export default function ProjetsPage() {
  const [filter, setFilter] = useState("all");
  const filteredProjects = PROJECTS.filter((p) => filter === "all" || p.category === filter);

  return (
    <main className="relative min-h-screen pt-36 pb-24 tex-travertine z-10">
      <Ambient variant="light" />
      
      <div className="max-w-295 mx-auto px-[6vw]">
        
        {/* En-tête */}
        <Reveal className="text-center max-w-160 mx-auto mb-12 relative z-10">
          <span className="flex justify-center items-center gap-2 text-[0.7rem] tracking-[0.25em] uppercase text-k-gold-deep font-bold mb-4">
            <span className="w-5 h-px bg-k-gold-deep" /> Portfolio <span className="w-5 h-px bg-k-gold-deep" />
          </span>
          <h1 className="text-[clamp(2.2rem,4.6vw,3.4rem)]">Des intérieurs en pleine mue</h1>
          <p className="text-[1.02rem] text-k-ink/70 mt-4 leading-relaxed">
            Photos, plans et modélisations 3D : chaque projet est documenté de l'esquisse à la réalisation. Filtrez par type d'espace pour explorer les réalisations.
          </p>
        </Reveal>

        {/* Filtres */}
        <Reveal className="flex flex-wrap justify-center gap-3 mb-12 relative z-10">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2.5 text-[0.76rem] font-medium rounded-full border-[1.5px] transition-all duration-300 ease-[--ease] cursor-pointer ${
                filter === f.id 
                  ? "bg-k-ink text-k-cream border-k-ink shadow-lg" 
                  : "bg-transparent text-k-ink border-k-ink/20 hover:border-k-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        {/* Grille de Projets (2 colonnes sur mobile) */}
        <Reveal delay={0.1} className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-9 relative z-10">
          {filteredProjects.map((p, index) => (
            <ProjectCard key={p.id} project={p} index={index} />
          ))}
        </Reveal>

      </div>
    </main>
  );
}
