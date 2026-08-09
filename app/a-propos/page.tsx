import Ambient from "@/components/Ambient";
import Reveal from "@/components/Reveal";
import Journey from "@/components/Journey";

const VALUES = [
  { title: "Fluidité", text: "Des espaces pensés en mouvement, sans rigidité inutile." },
  { title: "Matière vraie", text: "Travertin, chêne, enduits naturels : on privilégie ce qui vieillit bien." },
  { title: "Sur mesure", text: "Chaque projet part d'une feuille blanche, jamais d'un modèle." },
];

export default function AProposPage() {
  return (
    <main>
      {/* SECTION HAUT : L'atelier & Parcours */}
      <section className="relative pt-36 pb-24 tex-travertine min-h-screen flex flex-col justify-center">
        <Ambient variant="light" />
        
        <div className="max-w-295 mx-auto px-[6vw] w-full">
          {/* En-tête de page */}
          <Reveal className="text-center max-w-160 mx-auto mb-20 relative z-10">
            <span className="flex justify-center items-center gap-2 text-[0.7rem] tracking-[0.25em] uppercase text-k-gold-deep font-bold mb-4">
              <span className="w-5 h-px bg-k-gold-deep" /> L'atelier <span className="w-5 h-px bg-k-gold-deep" />
            </span>
            <h1 className="text-[clamp(2.2rem,4.6vw,3.4rem)]">Une philosophie de la transformation</h1>
            <p className="text-[1.02rem] text-k-ink/70 mt-4 leading-relaxed">
              Krysalis puise son nom dans la chrysalide : cet état intermédiaire où la forme se réinvente. C'est exactement ce que nous cherchons à faire de vos espaces.
            </p>
          </Reveal>

          {/* Grille : Texte + Frise */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
            <div>
              <span className="block text-[0.7rem] tracking-[0.25em] uppercase text-k-gold-deep font-bold mb-3">Notre parcours</span>
              <h3 className="text-[1.7rem] text-k-ink leading-tight mb-4">
                D'un atelier de couture d'espaces à un studio de décoration
              </h3>
              <p className="text-k-ink/75 leading-relaxed text-lg">
                Krysalis est né d'une conviction simple : un intérieur réussi ne se plaque pas, il se laisse pousser. Nous dessinons chaque projet comme une trajectoire, pas comme un catalogue figé.
              </p>
            </div>
            
            {/* Composant de la frise SVG */}
            <Journey />
          </Reveal>
        </div>
      </section>

      {/* SECTION BAS : Nos valeurs (Fond Chêne sombre) */}
      <section className="relative py-24 overflow-hidden tex-oak">
        <Ambient variant="dark" />
        
        <div className="max-w-295 mx-auto px-[6vw]">
          <Reveal className="max-w-160 mb-12 relative z-10">
            <span className="block text-[0.7rem] tracking-[0.25em] uppercase text-k-gold font-bold mb-3">Nos valeurs</span>
            <h2 className="text-[clamp(1.9rem,3.4vw,2.8rem)] text-k-stone">Ce qui guide chaque projet</h2>
          </Reveal>

          <Reveal delay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-9 relative z-10">
            {VALUES.map((v) => (
              <div key={v.title}>
                <h3 className="text-xl text-k-stone mb-3">{v.title}</h3>
                <p className="text-k-stone/70 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
