"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const NAV_ITEMS = [
  { id: "/", label: "Accueil" },
  { id: "/projets", label: "Projets" },
  { id: "/a-propos", label: "À propos" },
  { id: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- LA VRAIE LOGIQUE ZÉNITH EST ICI ---
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-[--ease] ${
        scrolled ? "py-3 bg-k-cream/90 backdrop-blur-md shadow-[0_8px_30px_-12px_rgba(2,4,77,0.15)]" : "py-6"
      }`}>
        <div className="max-w-295 mx-auto px-[6vw] flex items-center justify-between">
          
          <Link href="/" className="flex items-center" aria-label="Retour à l'accueil">
            <Logo className="h-10 md:h-14" variant="dark" />
          </Link>

          <ul className="hidden md:flex gap-10">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.id;
              
              return (
                <li key={item.id}>
                  <Link 
                    href={item.id} 
                    className={`relative pb-1.5 text-sm font-medium tracking-wide group transition-colors duration-300 ${
                      isActive 
                        ? "text-k-gold-deep" 
                        : "text-k-ink hover:text-k-indigo"
                    }`}
                  >
                    {item.label}
                    <svg className="absolute left-0 -bottom-1 w-full h-2 overflow-visible" viewBox="0 0 60 8">
                      <path 
                        d="M2 5 Q 15 1 30 5 T 58 5" 
                        className={`fill-none stroke-2 rounded-full transition-all duration-500 ease-[--ease] [stroke-dasharray:60] ${
                          isActive 
                            ? "stroke-k-gold-deep [stroke-dashoffset:0]"
                            : "stroke-k-indigo [stroke-dashoffset:60] group-hover:[stroke-dashoffset:0]"
                        }`} 
                      />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link href="/contact" className="hidden md:inline-flex text-[0.72rem] font-semibold tracking-wider uppercase px-6 py-3 bg-k-ink text-k-cream rounded-(--blob-1) hover:rounded-(--blob-2) hover:-translate-y-0.5 hover:bg-k-indigo transition-all duration-500 ease-[--ease]">
            Démarrer un projet
          </Link>

          <button className="md:hidden p-2 text-k-ink" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Menu Mobile */}
      <div className={`fixed inset-0 bg-k-cream z-40 flex flex-col justify-center items-start px-[10vw] gap-6 transition-transform duration-500 ease-[--ease] md:hidden ${open ? "translate-y-0" : "-translate-y-full"}`}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.id;
          
          return (
            <Link 
              key={item.id} 
              href={item.id} 
              onClick={() => setOpen(false)} 
              className={`font-display text-4xl transition-colors duration-300 ${
                isActive 
                  ? "text-k-gold-deep" 
                  : "text-k-ink hover:text-k-indigo"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
