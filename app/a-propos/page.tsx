import { Metadata } from 'next';
import Reveal from "@/components/Reveal";
import Journey from "@/components/Journey";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "L'atelier et nos valeurs | Krysalis Studio",
  description: "Découvrez la philosophie de Krysalis Studio : de l'atelier de couture d'espaces à l'architecture d'intérieur. Des espaces pensés en mouvement.",
};

const VALUES = [
  { title: "Fluidité", text: "Des espaces pensés en mouvement, sans rigidité inutile." },
  { title: "Matière vraie", text: "Travertin, chêne, enduits naturels : on privilégie ce qui vieillit bien." },
  { title: "Sur mesure", text: "Chaque projet part d'une feuille blanche, jamais d'un modèle." },
];

export default function AProposPage() {
  return (
    <main>
      <Section theme="light" className="pt-36 pb-24 min-h-screen flex flex-col justify-center">
        <Reveal className="text-center max-w-160 mx-auto mb-20">
          <span className="flex justify-center items-center gap-2 text-[0.7rem] tracking-[0.25em] uppercase text-k-gold-deep font-bold mb-4">
            <span className="w-5 h-px bg-k-gold-deep" /> L'atelier <span className="w-5 h-px bg-k-gold-deep" />
          </span>
          <h1 className="text-[clamp(2.2rem,4.6vw,3.4rem)] text-k-ink">Une philosophie de la transformation</h1>
          <p className="text-[1.02rem] text-k-ink/70 mt-4 leading-relaxed">
            Krysalis puise son nom dans la chrysalide : cet état intermédiaire où la forme se réinvente. C'est exactement ce que nous cherchons à faire de vos espaces.
          </p>
        </Reveal>

        <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <span className="block text-[0.7rem] tracking-[0.25em] uppercase text-k-gold-deep font-bold mb-3">Notre parcours</span>
            <h3 className="text-[1.7rem] text-k-ink leading-tight mb-4">
              D'un atelier de couture d'espaces à un studio de décoration
            </h3>
            <p className="text-k-ink/75 leading-relaxed text-lg">
              Krysalis est né d'une conviction simple : un intérieur réussi ne se plaque pas, il se laisse pousser. Nous dessinons chaque projet comme une trajectoire, pas comme un catalogue figé.
            </p>
          </div>
          
          <Journey />
        </Reveal>
      </Section>

      <Section theme="dark">
        <Reveal className="max-w-160 mb-12">
          <span className="block text-[0.7rem] tracking-[0.25em] uppercase text-k-gold font-bold mb-3">Nos valeurs</span>
          <h2 className="text-[clamp(1.9rem,3.4vw,2.8rem)] text-k-stone">Ce qui guide chaque projet</h2>
        </Reveal>

        <Reveal delay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-9">
          {VALUES.map((v) => (
            <div key={v.title}>
              <h3 className="text-xl text-k-stone mb-3">{v.title}</h3>
              <p className="text-k-stone/70 text-sm leading-relaxed">{v.text}</p>
            </div>
          ))}
        </Reveal>
      </Section>
    </main>
  );
}
