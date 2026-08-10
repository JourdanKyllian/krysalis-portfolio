import Link from "next/link";
import Ambient from "@/components/Ambient";
import Logo from "@/components/Logo";
import { InstagramIcon, FacebookIcon, TiktokIcon, LinkedinIcon } from "./SocialIcons";

const SOCIALS = [
  { id: "instagram", label: "Instagram", Icon: InstagramIcon, href: "#" },
  { id: "facebook", label: "Facebook", Icon: FacebookIcon, href: "#" },
  { id: "tiktok", label: "TikTok", Icon: TiktokIcon, href: "#" },
  { id: "linkedin", label: "LinkedIn", Icon: LinkedinIcon, href: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full pt-12 pb-6 px-4 md:px-8">
      <footer className="relative overflow-hidden rounded-4xl md:rounded-[3rem] bg-k-oak-2 shadow-[0_20px_60px_rgba(24,12,4,0.4)] z-10 pt-20 pb-8">
        
        <div className="absolute top-0 inset-x-0 h-0.5 bg-[linear-gradient(90deg,transparent,var(--color-k-gold),transparent)] opacity-60" />
        
        <Ambient variant="dark" />

        <div className="relative z-10 max-w-295 mx-auto px-[6vw] flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          
          {/* Identité et Description */}
          <div>
            <Link href="/" className="block mb-6" aria-label="Retour à l'accueil">
              <Logo className="h-14 md:h-16" variant="light" />
            </Link>
            
            <p className="text-k-stone/70 max-w-[32ch] text-sm leading-relaxed">
              Décoration & agencement intérieur sur mesure. Façonné avec soin dans le sud de la France.
            </p>
          </div>

          {/* Réseaux Sociaux */}
          <div className="flex flex-col gap-4 md:items-end">
            <span className="block text-[0.65rem] tracking-[0.25em] uppercase text-k-gold/70 font-semibold mb-1">
              Suivez-nous
            </span>
            <ul className="flex flex-wrap gap-4">
              {SOCIALS.map((social) => (
                <li key={social.id}>
                  <a 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center justify-center w-11 h-11 rounded-full border border-k-stone/15 text-k-stone/75 hover:text-k-ink hover:bg-k-gold hover:border-k-gold transition-all duration-300 ease-[--ease]"
                  >
                    <social.Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ligne du bas : Copyright & Mentions légales */}
        <div className="relative z-10 max-w-295 mx-auto px-[6vw] mt-16 pt-6 border-t border-k-stone/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.65rem] text-k-stone/40 uppercase tracking-widest">
          {/* Affichage de l'année de création + l'année dynamique en cours */}
          <span>© 2018-{currentYear} Krysalis Studio — Tous droits réservés</span>
          
          <Link href="/mentions-legales" className="hover:text-k-gold transition-colors duration-300">
            Mentions légales
          </Link>
        </div>
      </footer>
    </div>
  );
}
