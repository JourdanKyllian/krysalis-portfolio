"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Ambient from "@/components/Ambient";
import Logo from "@/components/Logo";
import { InstagramIcon, FacebookIcon, TiktokIcon, LinkedinIcon, YoutubeIcon } from "./SocialIcons";

interface FooterProps {
  socials?: {
    linkedin: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
  }
}

export default function Footer({ socials }: FooterProps) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) return null;

  // On mappe dynamiquement les liens renseignés en base de données
  const socialLinks = [
    { id: "instagram", label: "Instagram", Icon: InstagramIcon, href: socials?.instagram },
    { id: "facebook", label: "Facebook", Icon: FacebookIcon, href: socials?.facebook },
    { id: "tiktok", label: "TikTok", Icon: TiktokIcon, href: socials?.tiktok },
    { id: "linkedin", label: "LinkedIn", Icon: LinkedinIcon, href: socials?.linkedin },
    { id: "youtube", label: "YouTube", Icon: YoutubeIcon, href: socials?.youtube },
  ].filter(social => social.href && social.href.trim() !== "");

  return (
    <footer className="relative w-full overflow-hidden bg-k-oak-2 z-10 pt-20 pb-8 border-t border-k-stone/5">
      <Ambient variant="dark" />
      <div className="relative z-10 max-w-295 mx-auto px-[6vw] flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div>
          <Link href="/" className="block mb-6" aria-label="Retour à l'accueil">
            <Logo className="h-14 md:h-16" variant="light" />
          </Link>
          <p className="text-k-stone/70 max-w-[32ch] text-sm leading-relaxed">
            Décoration & agencement intérieur sur mesure. Façonné avec soin dans le sud de la France.
          </p>
        </div>

        {socialLinks.length > 0 && (
          <div className="flex flex-col gap-4 md:items-end">
            <span className="block text-[0.65rem] tracking-[0.25em] uppercase text-k-gold/70 font-semibold mb-1">
              Suivez-nous
            </span>
            <ul className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
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
        )}
      </div>

      <div className="relative z-10 max-w-295 mx-auto px-[6vw] mt-16 pt-6 border-t border-k-stone/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.65rem] text-k-stone/40 uppercase tracking-widest">
        <span>
          <Link href="/admin/login" className="cursor-default" title="Accès Atelier">©</Link> 2024-{currentYear} Krysalis Studio — Tous droits réservés
        </span>
        <Link href="/mentions-legales" className="hover:text-k-gold transition-colors duration-300">
          Mentions légales
        </Link>
      </div>
    </footer>
  );
}
