"use client";

import { useState } from "react";
import Ambient from "@/components/Ambient";
import Reveal from "@/components/Reveal";
import WaveButton from "@/components/WaveButton";
import { MapPin, Mail, Phone, Calendar } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  // Simulation d'envoi pour le front-end
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="relative min-h-screen pt-36 pb-24 tex-travertine">
      <Ambient variant="light" />
      
      <div className="max-w-295 mx-auto px-[6vw]">
        <Reveal className="text-center max-w-160 mx-auto mb-16 relative z-10">
          <span className="flex justify-center items-center gap-2 text-[0.7rem] tracking-[0.25em] uppercase text-k-gold-deep font-bold mb-4">
            <span className="w-5 h-px bg-k-gold-deep" /> Parlons-en <span className="w-5 h-px bg-k-gold-deep" />
          </span>
          <h1 className="text-[clamp(2.2rem,4.6vw,3.4rem)]">Racontez-nous votre projet</h1>
          <p className="text-[1.02rem] text-k-ink/70 mt-4 leading-relaxed">
            Une villa à transformer, un appartement à réinventer, un atelier à agencer : chaque échange commence par vos envies.
          </p>
        </Reveal>

        <Reveal className="relative overflow-hidden rounded-[28px_44px_28px_44px] p-[clamp(1.8rem,4.5vw,3.2rem)] shadow-[0_40px_70px_-30px_rgba(2,4,77,0.35)] tex-oak">
          <Ambient variant="dark" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-[0.7rem] tracking-widest uppercase font-semibold text-k-stone">Nom & prénom</label>
                <input id="name" type="text" placeholder="Votre nom" className="w-full px-5 py-3.5 bg-k-cream/5 border-[1.5px] border-k-gold/25 rounded-2xl text-k-stone placeholder:text-k-stone/40 focus:outline-none focus:border-k-gold focus:rounded-[26px] transition-all duration-500 ease-[--ease]" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[0.7rem] tracking-widest uppercase font-semibold text-k-stone">E-mail</label>
                <input id="email" type="email" placeholder="vous@exemple.com" className="w-full px-5 py-3.5 bg-k-cream/5 border-[1.5px] border-k-gold/25 rounded-2xl text-k-stone placeholder:text-k-stone/40 focus:outline-none focus:border-k-gold focus:rounded-[26px] transition-all duration-500 ease-[--ease]" />
              </div>
              <div className="space-y-2">
                <label htmlFor="type" className="block text-[0.7rem] tracking-widest uppercase font-semibold text-k-stone">Type de projet</label>
                <input id="type" type="text" placeholder="Villa, appartement, atelier..." className="w-full px-5 py-3.5 bg-k-cream/5 border-[1.5px] border-k-gold/25 rounded-2xl text-k-stone placeholder:text-k-stone/40 focus:outline-none focus:border-k-gold focus:rounded-[26px] transition-all duration-500 ease-[--ease]" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="block text-[0.7rem] tracking-widest uppercase font-semibold text-k-stone">Votre projet en quelques mots</label>
                <textarea id="message" placeholder="Décrivez l'espace, vos envies, vos délais..." rows={4} className="w-full px-5 py-3.5 bg-k-cream/5 border-[1.5px] border-k-gold/25 rounded-2xl text-k-stone placeholder:text-k-stone/40 focus:outline-none focus:border-k-gold focus:rounded-[26px] transition-all duration-500 ease-[--ease] resize-y min-h-32.5"></textarea>
              </div>
              
              <div className="pt-2">
                <WaveButton>
                  {sent ? "Message envoyé ✓" : "Envoyer le message"}
                </WaveButton>
              </div>
            </form>

            {/* Informations de contact */}
            <div className="flex flex-col gap-8 md:pt-4">
              <div className="flex items-start gap-4 group">
                <MapPin size={22} className="text-k-gold group-hover:-translate-y-1 transition-transform" />
                <div>
                  <span className="block text-[0.66rem] tracking-[0.14em] uppercase text-k-gold mb-1">Atelier</span>
                  <span className="font-display text-xl text-k-stone">Aix-en-Provence & environs</span>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <Mail size={22} className="text-k-gold group-hover:-translate-y-1 transition-transform" />
                <div>
                  <span className="block text-[0.66rem] tracking-[0.14em] uppercase text-k-gold mb-1">E-mail</span>
                  <span className="font-display text-xl text-k-stone">bonjour@krysalis-studio.fr</span>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <Phone size={22} className="text-k-gold group-hover:-translate-y-1 transition-transform" />
                <div>
                  <span className="block text-[0.66rem] tracking-[0.14em] uppercase text-k-gold mb-1">Téléphone</span>
                  <span className="font-display text-xl text-k-stone">06 00 00 00 00</span>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <Calendar size={22} className="text-k-gold group-hover:-translate-y-1 transition-transform" />
                <div>
                  <span className="block text-[0.66rem] tracking-[0.14em] uppercase text-k-gold mb-1">Disponibilité</span>
                  <span className="font-display text-xl text-k-stone">Sur rendez-vous, du mardi au samedi</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
