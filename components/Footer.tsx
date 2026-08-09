import Link from "next/link";

const NAV_ITEMS = [
  { id: "/", label: "Accueil" },
  { id: "/projets", label: "Projets" },
  { id: "/a-propos", label: "À propos" },
  { id: "/contact", label: "Contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 tex-oak overflow-hidden z-10">
      <div className="max-w-295 mx-auto px-[6vw] flex flex-col md:flex-row justify-between items-end gap-7">
        
        {/* Identité */}
        <div>
          <span className="block font-display text-4xl text-k-stone mb-2">Krysalis</span>
          <p className="text-k-stone/60 max-w-[32ch] text-sm leading-relaxed">
            Décoration & agencement intérieur sur mesure.
          </p>
        </div>

        {/* Liens rapides */}
        <ul className="flex flex-wrap gap-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <Link 
                href={item.id} 
                className="text-sm font-medium text-k-stone/75 hover:text-k-gold transition-colors duration-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mentions légales & Signature */}
      <div className="max-w-295 mx-auto px-[6vw] mt-10 pt-6 border-t border-k-gold/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.7rem] text-k-stone/50 uppercase tracking-widest">
        <span>© {currentYear} Krysalis Studio — Tous droits réservés</span>
        <span>Développement Full Stack sur-mesure</span>
      </div>
    </footer>
  );
}
