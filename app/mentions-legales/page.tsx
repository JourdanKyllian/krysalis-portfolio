import { Metadata } from 'next';
import { Scale, ShieldCheck, EyeOff, FileText } from 'lucide-react';
import Ambient from "@/components/Ambient";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: 'Mentions Légales | Krysalis Studio',
  description: 'Conformité, mentions légales et politique de confidentialité de Krysalis Studio.',
};

export default function MentionsLegalesPage() {
  return (
    <main className="relative min-h-screen pt-36 pb-24 tex-travertine z-10">
      {/* Halo lumineux décoratif en arrière-plan */}
      <Ambient variant="light" />

      <div className="max-w-4xl mx-auto px-[6vw]">
        
        {/* En-tête de la page */}
        <Reveal className="text-center mb-16 relative z-10">
          <span className="flex justify-center items-center gap-2 text-[0.7rem] tracking-[0.25em] uppercase text-k-gold-deep font-bold mb-4">
            <span className="w-5 h-px bg-k-gold-deep" /> Transparence <span className="w-5 h-px bg-k-gold-deep" />
          </span>
          <h1 className="text-[clamp(2.2rem,4vw,3rem)] text-k-ink">
            Conformité & Mentions Légales
          </h1>
        </Reveal>

        {/* Conteneur principal (Glassmorphism léger et élégant) */}
        <Reveal delay={0.1} className="relative z-10 bg-white/40 backdrop-blur-xl border border-white/50 p-8 sm:p-12 md:p-16 rounded-4xl shadow-[0_20px_60px_rgba(2,4,77,0.05)]">
          
          <div className="space-y-12 font-body text-sm md:text-base text-k-ink/75 leading-relaxed">
            
            {/* 1. Édition du site */}
            <section className="space-y-4">
              <h2 className="font-display text-2xl text-k-ink flex items-center gap-3 border-b border-k-ink/10 pb-4 mb-6">
                <FileText size={24} className="text-k-gold-deep" />
                1. Édition du site
              </h2>
              <p>
                En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-k-ink/70 marker:text-k-gold">
                <li><strong className="text-k-ink font-semibold">Propriétaire & Éditeur :</strong> Océane Gosset — Krysalis Studio</li>
                <li><strong className="text-k-ink font-semibold">Statut juridique :</strong> [Statut juridique, ex: Auto-entreprise] — SIRET : [Numéro SIRET]</li>
                <li><strong className="text-k-ink font-semibold">Siège social :</strong> Aix-en-Provence & environs</li>
                <li><strong className="text-k-ink font-semibold">Contact :</strong> bonjour@krysalis-studio.fr</li>
                <li><strong className="text-k-ink font-semibold">Directeur de la publication :</strong> Océane Gosset</li>
                <li><strong className="text-k-ink font-semibold">Conception & Développement Web :</strong> Kyllian Jourdan</li>
              </ul>
            </section>

            {/* 2. Hébergement */}
            <section className="space-y-4">
              <h2 className="font-display text-2xl text-k-ink flex items-center gap-3 border-b border-k-ink/10 pb-4 mb-6">
                <Scale size={24} className="text-k-gold-deep" />
                2. Hébergement
              </h2>
              <p>
                Le site est hébergé par la société <strong className="text-k-ink font-semibold">Vercel Inc.</strong>, située au 950 Tower Lane, Suite 2200, Foster City, CA 94404, États-Unis. Ce réseau de diffusion de contenu est sécurisé et respectueux des infrastructures européennes. Contact technique : https://vercel.com.
              </p>
            </section>

            {/* 3. RGPD */}
            <section className="space-y-4">
              <h2 className="font-display text-2xl text-k-ink flex items-center gap-3 border-b border-k-ink/10 pb-4 mb-6">
                <ShieldCheck size={24} className="text-k-gold-deep" />
                3. Protection des Données (RGPD)
              </h2>
              <p>
                Krysalis Studio s'engage à ce que la collecte et le traitement de vos données, effectués à partir de notre formulaire de contact, soient conformes au règlement général sur la protection des données (RGPD).
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-k-ink/70 marker:text-k-gold">
                <li><strong className="text-k-ink font-semibold">Données collectées :</strong> Nom, adresse e-mail, type de projet et contenu du message.</li>
                <li><strong className="text-k-ink font-semibold">Finalité :</strong> Les données d'identité et de message sont traitées exclusivement à des fins de gestion de la relation commerciale (réponses aux demandes de devis, organisation de rendez-vous). Aucune donnée n'est cédée ou revendue à des tiers.</li>
                <li><strong className="text-k-ink font-semibold">Durée de conservation :</strong> Les données relatives aux demandes de projets sont stockées pendant une durée maximale de 3 ans après le dernier échange commercial.</li>
                <li><strong className="text-k-ink font-semibold">Vos droits :</strong> Vous disposez d'un droit d'accès, de rectification, de limitation et de suppression de vos données. Pour exercer ce droit, écrivez directement à : <a href="mailto:bonjour@krysalis-studio.fr" className="text-k-indigo hover:text-k-gold transition-colors">bonjour@krysalis-studio.fr</a>.</li>
              </ul>
            </section>

            {/* 4. Cookies */}
            <section className="space-y-4">
              <h2 className="font-display text-2xl text-k-ink flex items-center gap-3 border-b border-k-ink/10 pb-4 mb-6">
                <EyeOff size={24} className="text-k-gold-deep" />
                4. Politique relative aux Cookies
              </h2>
              <p>
                Ce site n'utilise <strong className="text-k-ink font-semibold">aucun cookie tiers publicitaire, marketing ou de ciblage comportemental</strong>. Aucun bandeau d'acceptation intrusif n'est donc requis à l'écran, car notre architecture protège nativement votre vie privée dès votre arrivée.
              </p>
            </section>

            {/* 5. Propriété intellectuelle */}
            <section className="space-y-4">
              <h2 className="font-display text-2xl text-k-ink flex items-center gap-3 border-b border-k-ink/10 pb-4 mb-6">
                <span className="font-display text-k-gold-deep text-3xl leading-none pt-1">©</span>
                5. Propriété intellectuelle
              </h2>
              <p>
                L'ensemble des contenus présents sur ce site (croquis, plans, modélisations 3D, photographies de réalisations, textes, logo Krysalis) est protégé au titre du droit d'auteur et de la propriété intellectuelle. Toute reproduction numérique, distribution ou modification sans l'accord écrit préalable de Krysalis Studio est strictement interdite et constitue un délit de contrefaçon.
              </p>
            </section>

          </div>
        </Reveal>
      </div>
    </main>
  );
}
