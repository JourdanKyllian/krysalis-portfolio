"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Ambient from "@/components/Ambient";
import Reveal from "@/components/Reveal";
import WaveButton from "@/components/WaveButton";
import { MapPin, Mail, Phone, Calendar } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="relative min-h-screen pt-36 pb-24 tex-travertine z-10">
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

        <Reveal className="relative overflow-hidden rounded-[28px_44px_28px_44px] p-[clamp(1.8rem,4.5vw,3.2rem)] bg-k-ink shadow-[0_40px_80px_rgba(2,4,77,0.35)] border border-k-gold/10 group">
          
          {/* --- LES LIGNES DE CONTOUR ORGANIQUES (Vivacité & Formes) --- */}
          
          {/* Ligne fluide 1 */}
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute top-[-50%] left-[-20%] w-[120%] h-[120%] text-k-gold/15 pointer-events-none z-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <path 
              fill="none" stroke="currentColor" strokeWidth="0.5" 
              d="M39.6,-61.6C52.3,-54.1,64,-44.2,71.2,-31.2C78.4,-18.2,81.1,-2.2,78.5,12.8C75.9,27.8,68,41.8,55.9,51C43.8,60.2,27.6,64.6,11.8,67.6C-4,70.6,-19.4,72.2,-32.9,67C-46.4,61.8,-58,49.8,-66.2,35.7C-74.4,21.6,-79.2,5.3,-76.3,-9.4C-73.4,-24.1,-62.8,-37.2,-50.2,-45.5C-37.6,-53.8,-23.1,-57.3,-8.9,-59.8C5.3,-62.3,16.5,-63.8,26.9,-69.1C37.3,-74.4,26.9,-69.1,39.6,-61.6Z" 
              transform="translate(100 100)" 
            />
          </motion.svg>

          {/* Ligne fluide 2 (Tourne dans le sens inverse) */}
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute bottom-[-60%] right-[-20%] w-[140%] h-[140%] text-k-gold/20 pointer-events-none z-0"
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          >
            <path 
              fill="none" stroke="currentColor" strokeWidth="0.5" 
              d="M44.7,-76.4C58.3,-69.2,70,-56.1,78.2,-41.2C86.4,-26.3,91.1,-9.6,88.4,6.2C85.7,21.9,75.6,36.8,63.9,49.2C52.2,61.6,38.9,71.5,24.1,77.7C9.3,83.9,-7.1,86.4,-22.7,83.5C-38.3,80.5,-53.1,72,-63.5,59.5C-73.9,47,-79.9,30.5,-83.4,13.6C-86.9,-3.3,-87.9,-20.6,-81.1,-35.1C-74.3,-49.6,-59.7,-61.3,-44.6,-68.1C-29.5,-74.9,-14.7,-76.8,0.9,-78.1C16.5,-79.3,31,-73.6,44.7,-76.4Z" 
              transform="translate(100 100)" 
            />
          </motion.svg>

          {/* Lumières volumétriques pour donner de la profondeur */}
          <motion.div
            animate={{ scale: [1, 1.1, 0.9, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[20%] w-[40%] h-[50%] bg-k-indigo rounded-full blur-[80px] pointer-events-none z-0"
          />
          <motion.div
            animate={{ scale: [1, 0.9, 1.1, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[10%] right-[10%] w-[50%] h-[60%] bg-k-gold-deep rounded-full blur-[90px] pointer-events-none z-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
            {/* Formulaire Glassmorphism */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-[0.7rem] tracking-widest uppercase font-semibold text-k-gold/90 ml-2">Nom & prénom</label>
                <input 
                  id="name" type="text" placeholder="Votre nom" 
                  className="w-full px-5 py-3.5 bg-white/4 backdrop-blur-md border-[1.5px] border-white/10 rounded-2xl text-k-cream placeholder:text-k-cream/30 focus:outline-none focus:border-k-gold/50 focus:bg-white/8 transition-all duration-500 ease-[--ease]" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[0.7rem] tracking-widest uppercase font-semibold text-k-gold/90 ml-2">E-mail</label>
                <input 
                  id="email" type="email" placeholder="vous@exemple.com" 
                  className="w-full px-5 py-3.5 bg-white/4 backdrop-blur-md border-[1.5px] border-white/10 rounded-2xl text-k-cream placeholder:text-k-cream/30 focus:outline-none focus:border-k-gold/50 focus:bg-white/8 transition-all duration-500 ease-[--ease]" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="type" className="block text-[0.7rem] tracking-widest uppercase font-semibold text-k-gold/90 ml-2">Type de projet</label>
                <input 
                  id="type" type="text" placeholder="Villa, appartement, atelier..." 
                  className="w-full px-5 py-3.5 bg-white/4 backdrop-blur-md border-[1.5px] border-white/10 rounded-2xl text-k-cream placeholder:text-k-cream/30 focus:outline-none focus:border-k-gold/50 focus:bg-white/8 transition-all duration-500 ease-[--ease]" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="block text-[0.7rem] tracking-widest uppercase font-semibold text-k-gold/90 ml-2">Votre projet en quelques mots</label>
                <textarea 
                  id="message" placeholder="Décrivez l'espace, vos envies, vos délais..." rows={4} 
                  className="w-full px-5 py-3.5 bg-white/4 backdrop-blur-md border-[1.5px] border-white/10 rounded-2xl text-k-cream placeholder:text-k-cream/30 focus:outline-none focus:border-k-gold/50 focus:bg-white/8 transition-all duration-500 ease-[--ease] resize-y min-h-32.5"
                ></textarea>
              </div>
              
              <div className="pt-4">
                <WaveButton colorTheme="gold">
                  {sent ? "Message envoyé ✓" : "Envoyer le message"}
                </WaveButton>
              </div>
            </form>

            {/* Informations de contact */}
            <div className="flex flex-col gap-9 md:pt-6">
              <div className="flex items-start gap-5 group cursor-default">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-k-gold group-hover:-translate-y-1 group-hover:bg-k-gold/10 group-hover:border-k-gold/30 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                  <MapPin size={20} />
                </div>
                <div className="pt-1">
                  <span className="block text-[0.66rem] tracking-[0.14em] uppercase text-k-gold/70 mb-1.5">Atelier</span>
                  <span className="font-display text-xl text-k-cream group-hover:text-white transition-colors">Aix-en-Provence & environs</span>
                </div>
              </div>
              <div className="flex items-start gap-5 group cursor-default">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-k-gold group-hover:-translate-y-1 group-hover:bg-k-gold/10 group-hover:border-k-gold/30 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                  <Mail size={20} />
                </div>
                <div className="pt-1">
                  <span className="block text-[0.66rem] tracking-[0.14em] uppercase text-k-gold/70 mb-1.5">E-mail</span>
                  <span className="font-display text-xl text-k-cream group-hover:text-white transition-colors">bonjour@krysalis-studio.fr</span>
                </div>
              </div>
              <div className="flex items-start gap-5 group cursor-default">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-k-gold group-hover:-translate-y-1 group-hover:bg-k-gold/10 group-hover:border-k-gold/30 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                  <Phone size={20} />
                </div>
                <div className="pt-1">
                  <span className="block text-[0.66rem] tracking-[0.14em] uppercase text-k-gold/70 mb-1.5">Téléphone</span>
                  <span className="font-display text-xl text-k-cream group-hover:text-white transition-colors">06 00 00 00 00</span>
                </div>
              </div>
              <div className="flex items-start gap-5 group cursor-default">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-k-gold group-hover:-translate-y-1 group-hover:bg-k-gold/10 group-hover:border-k-gold/30 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                  <Calendar size={20} />
                </div>
                <div className="pt-1">
                  <span className="block text-[0.66rem] tracking-[0.14em] uppercase text-k-gold/70 mb-1.5">Disponibilité</span>
                  <span className="font-display text-xl text-k-cream group-hover:text-white transition-colors">Sur rendez-vous, du mardi au samedi</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
