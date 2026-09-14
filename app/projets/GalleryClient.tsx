"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import { Projet, Categorie } from "@/types";

// Interface harmonisée avec Zénith Production
interface GalleryClientProps {
  initialProjets: Projet[];
  toutesLesCategories: Categorie[];
}

export default function GalleryClient({ initialProjets, toutesLesCategories }: GalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredProjects = initialProjets.filter((p) => {
    if (activeFilter === "all") return true;
    return p.categorie?.slug === activeFilter;
  });

  return (
    <>
      <Reveal className="flex flex-wrap justify-center gap-3 mb-12">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-5 py-2.5 text-[0.76rem] font-medium rounded-full border-[1.5px] transition-all duration-300 ease-[--ease] cursor-pointer ${
            activeFilter === "all" 
              ? "bg-k-ink text-k-cream border-k-ink shadow-lg" 
              : "bg-transparent text-k-ink border-k-ink/20 hover:border-k-ink"
          }`}
        >
          Tout voir ({initialProjets.length})
        </button>

        {toutesLesCategories.map((cat) => {
          // On n'affiche que les catégories qui ont au moins un projet
          const count = initialProjets.filter(p => p.categorie?.slug === cat.slug).length;
          if (count === 0) return null;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.slug)}
              className={`px-5 py-2.5 text-[0.76rem] font-medium rounded-full border-[1.5px] transition-all duration-300 ease-[--ease] cursor-pointer ${
                activeFilter === cat.slug 
                  ? "bg-k-ink text-k-cream border-k-ink shadow-lg" 
                  : "bg-transparent text-k-ink border-k-ink/20 hover:border-k-ink"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </Reveal>

      {filteredProjects.length > 0 ? (
        <Reveal delay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-9">
          {filteredProjects.map((p, index) => (
            <ProjectCard key={p.id} project={p} index={index} />
          ))}
        </Reveal>
      ) : (
        <div className="text-center py-20 text-k-ink/50 font-body text-sm">
          Aucun projet ne correspond à ce filtre.
        </div>
      )}
    </>
  );
}
