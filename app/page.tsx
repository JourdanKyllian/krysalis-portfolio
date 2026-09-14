import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import { supabase } from "@/lib/supabase";
import { Projet } from "@/types";

export const revalidate = 3600;

export default async function Home() {
  // Récupération des 3 derniers projets en ligne du locataire actuel
  const { data: highlights } = await supabase
    .from('projet')
    .select('*, categorie(*), sousprojet(*)')
    .eq('en_ligne', true)
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
    .order('created_at', { ascending: false })
    .limit(3);

  const projets = (highlights as unknown as Projet[]) || [];

  return (
    <main>
      <Hero />

      <Section theme="dark">
        <Reveal className="max-w-160 mb-12">
          <span className="block text-[0.7rem] tracking-[0.25em] uppercase text-k-gold font-bold mb-3">Notre approche</span>
          <h2 className="text-[clamp(1.9rem,3.4vw,2.8rem)] text-k-stone">Du croquis au geste, une transformation continue</h2>
          <p className="text-k-stone/75 mt-4 leading-relaxed">Comme une chrysalide, chaque pièce traverse plusieurs états avant de trouver sa forme définitive. Nous accompagnons cette mue, de l'esquisse à la pose finale.</p>
        </Reveal>

        <Reveal delay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-9">
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
      </Section>

      <Section theme="light">
        <Reveal className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-160">
            <span className="block text-[0.7rem] tracking-[0.25em] uppercase text-k-gold-deep font-bold mb-3">Réalisations récentes</span>
            <h2 className="text-[clamp(1.9rem,3.4vw,2.8rem)] text-k-ink">Intérieurs en métamorphose</h2>
          </div>
          <Link href="/projets" className="inline-flex items-center gap-2 text-[0.75rem] font-semibold tracking-wider text-k-indigo uppercase hover:text-k-ink transition-colors">
            Tout explorer <ArrowRight size={14} />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-9">
          {projets.map((p, index) => (
            <ProjectCard key={p.id} project={p} index={index} />
          ))}
        </Reveal>
      </Section>
    </main>
  );
}
