import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { supabase } from "@/lib/supabase";
import { Projet, Categorie } from "@/types";
import GalleryClient from "./GalleryClient";

export const revalidate = 3600;

export default async function ProjetsPage() {
  // 1. Récupérer tous les projets en ligne
  const { data: projets } = await supabase
    .from('projet')
    .select('*, categorie(*), sousprojet(*)')
    .eq('en_ligne', true)
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
    .order('created_at', { ascending: false });

  // 2. Récupérer les catégories actives pour les filtres
  const { data: categories } = await supabase
    .from('categorie')
    .select('*')
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
    .order('name');

  return (
    <main>
      <Section theme="light" className="pt-36 pb-24 min-h-screen">
        <Reveal className="text-center max-w-160 mx-auto mb-12">
          <span className="flex justify-center items-center gap-2 text-[0.7rem] tracking-[0.25em] uppercase text-k-gold-deep font-bold mb-4">
            <span className="w-5 h-px bg-k-gold-deep" /> Portfolio <span className="w-5 h-px bg-k-gold-deep" />
          </span>
          <h1 className="text-[clamp(2.2rem,4.6vw,3.4rem)] text-k-ink">Des intérieurs en pleine mue</h1>
          <p className="text-[1.02rem] text-k-ink/70 mt-4 leading-relaxed">
            Photos, plans et modélisations 3D : chaque projet est documenté de l'esquisse à la réalisation. Filtrez par type d'espace pour explorer les réalisations.
          </p>
        </Reveal>

        {/* Instanciation du composant Client avec la nomenclature harmonisée Zénith */}
        <GalleryClient 
          initialProjets={(projets as unknown as Projet[]) || []} 
          toutesLesCategories={(categories as Categorie[]) || []} 
        />
      </Section>
    </main>
  );
}
