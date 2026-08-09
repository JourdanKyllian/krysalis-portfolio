"use client";

import { useState } from "react";
import Ambient from "@/components/Ambient";
import Reveal from "@/components/Reveal";
import ProjectCard, { ProjectData } from "@/components/ProjectCard";

const PROJECTS: ProjectData[] = [
  { id: 1, title: "Villa Ocre", place: "Villa · Provence", category: "villa", type: "photo", swatch: "radial-gradient(circle at 30% 20%, #efca5e, #b98a2e 70%)" },
  { id: 2, title: "Suite Marine", place: "Appartement · Marseille", category: "appartement", type: "3d", swatch: "radial-gradient(circle at 70% 30%, #4a5aa8, #02044d 75%)" },
  { id: 3, title: "Atelier de Charme", place: "Atelier · Aix", category: "atelier", type: "plan", swatch: "radial-gradient(circle at 40% 70%, #f4d964, #7a5a20 80%)" },
  { id: 4, title: "Mas des Lavandes", place: "Villa · Luberon", category: "villa", type: "3d", swatch: "radial-gradient(circle at 60% 40%, #3c2413, #150b04 80%)" },
  { id: 5, title: "Éclat Bleu Nuit", place: "Appartement · Nice", category: "appartement", type: "photo", swatch: "radial-gradient(circle at 50% 50%, #010777, #02044d 80%)" },
  { id: 6, title: "Le Cocon", place: "Cabinet · Avignon", category: "atelier", type: "plan", swatch: "radial-gradient(circle at 35% 65%, #fbefd0, #d9b877 85%)" },
];

const FILTERS = [
  { id: "all", label: "Tout voir" },
  { id: "villa", label: "Villas" },
  { id: "appartement", label: "Appartements" },
  { id: "atelier", label: "Ateliers & pros" }
];

export default function ProjetsPage() {
  const [filter, setFilter] = useState("all");
  const filteredProjects = PROJECTS.filter((p) => filter === "all" || p.category === filter);

  return (
    <main className="relative min-h-screen pt-36 pb-24 tex-travertine">
      <Ambient variant="light" />
      
      <div className="max-w-295 mx-auto px-[6vw]">
        <Reveal className="text-center max-w-160 mx-auto mb-12 relative z-10">
          <span className="flex justify-center items-center gap-2 text-[0.7rem] tracking-[0.25em] uppercase text-k-gold-deep font-bold mb-4">
            <span className="w-5 h-px bg-k-gold-deep" /> Portfolio <span className="w-5 h-px bg-k-gold-deep" />
          </span>
          <h1 className="text-[clamp(2.2rem,4.6vw,3.4rem)]">Des intérieurs en pleine mue</h1>
          <p className="text-[1.02rem] text-k-ink/70 mt-4 leading-relaxed">
            Photos, plans et modélisations 3D : chaque projet est documenté de l'esquisse à la réalisation. Filtrez par type d'espace pour explorer les réalisations.
          </p>
        </Reveal>

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

        <Reveal delay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 relative z-10">
          {filteredProjects.map((p, index) => (
            <ProjectCard key={p.id} project={p} index={index} />
          ))}
        </Reveal>
      </div>
    </main>
  );
}
