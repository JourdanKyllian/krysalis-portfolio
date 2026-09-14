"use client";

import { useState, useRef, useEffect } from "react";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { MapPin, Mail, Phone, Calendar, AlertCircle, CheckCircle2, Send } from "lucide-react";
import { sendEmail } from "@/app/actions/sendEmail";

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const mountedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  async function handleAction(formData: FormData) {
    setStatus('loading');
    setFeedbackMessage(null);

    formData.append('form_timestamp', mountedAt.current.toString());

    const result = await sendEmail(formData);

    if (result.success) {
      setStatus('success');
      formRef.current?.reset();
      mountedAt.current = Date.now();
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
      setFeedbackMessage(result.error || "Une erreur est survenue lors du traitement.");
    }
  }

  return (
    <main>
      <Section theme="light" className="pt-36 pb-24 min-h-screen">
        <Reveal className="text-center max-w-160 mx-auto mb-16">
          <span className="flex justify-center items-center gap-2 text-[0.7rem] tracking-[0.25em] uppercase text-k-gold-deep font-bold mb-4">
            <span className="w-5 h-px bg-k-gold-deep" /> Parlons-en <span className="w-5 h-px bg-k-gold-deep" />
          </span>
          <h1 className="text-[clamp(2.2rem,4.6vw,3.4rem)] text-k-ink">Racontez-nous votre projet</h1>
          <p className="text-[1.02rem] text-k-ink/70 mt-4 leading-relaxed">
            Une villa à transformer, un appartement à réinventer, un atelier à agencer : chaque échange commence par vos envies.
          </p>
        </Reveal>

        <Reveal className="relative overflow-hidden rounded-[28px_44px_28px_44px] p-[clamp(1.8rem,4.5vw,3.2rem)] bg-k-ink shadow-[0_40px_80px_rgba(2,4,77,0.35)] border border-k-gold/10 group">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
            <form action={handleAction} ref={formRef} className="space-y-6">
              
              <div className="absolute opacity-0 -z-10 h-0 w-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <label htmlFor="company_tax_id" tabIndex={-1}>Identifiant légal de l'entreprise :</label>
                <input type="text" id="company_tax_id" name="company_tax_id" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="block text-[0.7rem] tracking-widest uppercase font-semibold text-k-gold/90 ml-2">Nom & prénom</label>
                <input id="name" name="name" required type="text" placeholder="Votre nom" className="w-full px-5 py-3.5 bg-white/4 backdrop-blur-md border-[1.5px] border-white/10 rounded-2xl text-k-cream placeholder:text-k-cream/30 focus:outline-none focus:border-k-gold/50 focus:bg-white/8 transition-all duration-500" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[0.7rem] tracking-widest uppercase font-semibold text-k-gold/90 ml-2">E-mail</label>
                <input id="email" name="email" required type="email" placeholder="vous@exemple.com" className="w-full px-5 py-3.5 bg-white/4 backdrop-blur-md border-[1.5px] border-white/10 rounded-2xl text-k-cream placeholder:text-k-cream/30 focus:outline-none focus:border-k-gold/50 focus:bg-white/8 transition-all duration-500" />
              </div>
              <div className="space-y-2">
                <label htmlFor="type" className="block text-[0.7rem] tracking-widest uppercase font-semibold text-k-gold/90 ml-2">Type de projet</label>
                <input id="type" name="type" type="text" placeholder="Villa, appartement, atelier..." className="w-full px-5 py-3.5 bg-white/4 backdrop-blur-md border-[1.5px] border-white/10 rounded-2xl text-k-cream placeholder:text-k-cream/30 focus:outline-none focus:border-k-gold/50 focus:bg-white/8 transition-all duration-500" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="block text-[0.7rem] tracking-widest uppercase font-semibold text-k-gold/90 ml-2">Votre projet en quelques mots</label>
                <textarea id="message" name="message" required placeholder="Décrivez l'espace, vos envies, vos délais..." rows={4} className="w-full px-5 py-3.5 bg-white/4 backdrop-blur-md border-[1.5px] border-white/10 rounded-2xl text-k-cream placeholder:text-k-cream/30 focus:outline-none focus:border-k-gold/50 focus:bg-white/8 transition-all duration-500 resize-y min-h-32.5"></textarea>
              </div>
              
              {status === 'error' && feedbackMessage && (
                <div className="flex items-start gap-2.5 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs font-semibold leading-relaxed">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{feedbackMessage}</span>
                </div>
              )}

              <div className="pt-4">
                <button type="submit" disabled={status === 'loading' || status === 'success'} className="relative overflow-hidden px-8 py-4 rounded-full border-[1.5px] border-k-gold bg-k-gold text-k-ink font-body font-semibold uppercase tracking-widest text-[0.8rem] shadow-lg transition-transform duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 w-full flex items-center justify-center gap-3">
                  {status === 'loading' ? 'Envoi en cours...' : status === 'success' ? <><CheckCircle2 size={16} /> Envoyé !</> : <><Send size={16} /> Envoyer le message</>}
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-9 md:pt-6">
              <div className="flex items-start gap-5 group cursor-default">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-k-gold shadow-sm"><MapPin size={20} /></div>
                <div className="pt-1">
                  <span className="block text-[0.66rem] tracking-[0.14em] uppercase text-k-gold/70 mb-1.5">Atelier</span>
                  <span className="font-display text-xl text-k-cream">Aix-en-Provence & environs</span>
                </div>
              </div>
              <div className="flex items-start gap-5 group cursor-default">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-k-gold shadow-sm"><Mail size={20} /></div>
                <div className="pt-1">
                  <span className="block text-[0.66rem] tracking-[0.14em] uppercase text-k-gold/70 mb-1.5">E-mail</span>
                  <span className="font-display text-xl text-k-cream">bonjour@krysalis-studio.fr</span>
                </div>
              </div>
              <div className="flex items-start gap-5 group cursor-default">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-k-gold shadow-sm"><Phone size={20} /></div>
                <div className="pt-1">
                  <span className="block text-[0.66rem] tracking-[0.14em] uppercase text-k-gold/70 mb-1.5">Téléphone</span>
                  <span className="font-display text-xl text-k-cream">06 00 00 00 00</span>
                </div>
              </div>
              <div className="flex items-start gap-5 group cursor-default">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-k-gold shadow-sm"><Calendar size={20} /></div>
                <div className="pt-1">
                  <span className="block text-[0.66rem] tracking-[0.14em] uppercase text-k-gold/70 mb-1.5">Disponibilité</span>
                  <span className="font-display text-xl text-k-cream">Sur rendez-vous, du mardi au samedi</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}
