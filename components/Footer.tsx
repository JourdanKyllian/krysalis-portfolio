import Link from "next/link";
import Ambient from "@/components/Ambient";
import Logo from "@/components/Logo";

const NAV_ITEMS = [
  { id: "/", label: "Accueil" },
  { id: "/projets", label: "Projets" },
  { id: "/a-propos", label: "À propos" },
  { id: "/contact", label: "Contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full pt-12 pb-6 px-4 md:px-8">
      <footer className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-k-oak-2 shadow-[0_20px_60px_rgba(24,12,4,0.4)] z-10 pt-20 pb-8">
        
        <div className="absolute top-0 inset-x-0 h-[2px] bg-[linear-gradient(90deg,transparent,var(--color-k-gold),transparent)] opacity-60" />
        
        <Ambient variant="dark" />

        <div className="relative z-10 max-w-295 mx-auto px-[6vw] flex flex-col md:flex-row justify-between items-end gap-12">
          
          <div>
            {/* Intégration du composant SVG Logo (variante claire pour le fond sombre) */}
            <Link href="/" className="block mb-6" aria-label="Retour à l'accueil">
              <Logo className="h-14 md:h-16" variant="light" />
            </Link>
            
            <p className="text-k-stone/70 max-w-[32ch] text-sm leading-relaxed">
              Décoration & agencement intérieur sur mesure. Façonné avec soin dans le sud de la France.
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-10 gap-y-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link 
                  href={item.id} 
                  className="text-sm font-medium tracking-wide text-k-stone/75 hover:text-k-gold transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 max-w-295 mx-auto px-[6vw] mt-20 pt-6 border-t border-k-stone/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.65rem] text-k-stone/40 uppercase tracking-widest">
          <span>© {currentYear} Krysalis Studio — Tous droits réservés</span>
          <span className="flex items-center gap-1">
            Développement Full Stack <span className="text-k-gold ml-1">sur-mesure</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
