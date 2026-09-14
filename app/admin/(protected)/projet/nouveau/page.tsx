"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Image as ImageIcon, Link2, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';
import { Categorie } from '@/types/index';
import Alert from '@/components/ui/Alert';

export default function NouveauProjetPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [titre, setTitre] = useState('');
  const [slug, setSlug] = useState('');
  const [categorieId, setCategorieId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [enLigne, setEnLigne] = useState(false);
  const [miniatureUrl, setMiniatureUrl] = useState('');
  
  const [linkInstagram, setLinkInstagram] = useState('');
  const [linkYoutube, setLinkYoutube] = useState('');
  const [linkTiktok, setLinkTiktok] = useState('');
  const [linkFacebook, setLinkFacebook] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categorie')
        .select('*')
        .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
        .order('name');
      if (data) setCategories(data as Categorie[]);
    };
    fetchCategories();
  }, []);

  const handleTitreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitre(val);
    setErrorMessage(null);
    setSlug(
      val.toLowerCase()
         .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
         .replace(/[^a-z0-9\s-]/g, '')
         .trim()
         .replace(/\s+/g, '-')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const safeTitre = titre.replace(/"/g, '""');
    const { data: existingData } = await supabase
      .from('projet')
      .select('id')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .or(`titre.eq."${safeTitre}",slug.eq."${slug}"`);

    if (existingData && existingData.length > 0) {
      setErrorMessage("Impossible d'enregistrer : un projet avec ce titre ou ce slug existe déjà.");
      setIsSubmitting(false);
      return; 
    }

    const newProjet = {
      titre,
      slug,
      categorie_id: categorieId ? parseInt(categorieId) : null,
      description: description || null,
      en_ligne: enLigne,
      miniature_url: miniatureUrl || null,
      link_instagram: linkInstagram || null,
      link_youtube: linkYoutube || null,
      link_tiktok: linkTiktok || null,
      link_facebook: linkFacebook || null,
      user_id: process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID
    };

    const { data, error } = await supabase
      .from('projet')
      .insert([newProjet])
      .select('id') 
      .single();

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      setIsSubmitting(false);
    } else if (data) {
      router.push(`/admin/dashboard/projet/${data.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-k-ink hover:border-gray-300 shadow-sm transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-k-ink">Nouveau Projet</h1>
            <p className="font-body text-sm text-gray-500 mt-1">Créez la fiche principale du projet.</p>
          </div>
        </div>
        
        <button 
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-k-ink text-k-cream px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-md hover:-translate-y-0.5 hover:bg-k-indigo transition-all disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <Save size={16} />
          {isSubmitting ? 'Création en cours...' : 'Créer et continuer'}
        </button>
      </header>

      {errorMessage && (
        <div className="mb-8">
          <Alert type="error">{errorMessage}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="font-sub text-[0.65rem] font-bold uppercase tracking-[0.2em] text-k-gold-deep mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <FileText size={16} /> Informations Générales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Titre du projet *</label>
              <input required type="text" value={titre} onChange={handleTitreChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none transition-colors" placeholder="Ex: Rénovation Bastide" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Slug (URL générée) *</label>
              <input required type="text" value={slug} onChange={(e) => { setSlug(e.target.value); setErrorMessage(null); }} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-500 focus:border-k-indigo focus:bg-white focus:outline-none transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Catégorie</label>
              <select 
                value={categorieId} 
                onChange={(e) => setCategorieId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none transition-colors appearance-none"
              >
                <option value="">-- Sans catégorie --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 flex flex-col justify-center">
              <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1 mb-2">Visibilité sur le site</label>
              <button 
                type="button" 
                onClick={() => setEnLigne(!enLigne)}
                className={`flex items-center justify-center gap-3 w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-[0.7rem] uppercase tracking-widest transition-colors ${enLigne ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                {enLigne ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                {enLigne ? 'Public (En ligne)' : 'Brouillon (Masqué)'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Description courte (Concept)</label>
            <textarea 
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none transition-colors resize-none" 
              placeholder="Résumé des choix de décoration, matériaux utilisés..." 
            />
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="font-sub text-[0.65rem] font-bold uppercase tracking-[0.2em] text-k-gold-deep mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <ImageIcon size={16} /> Visuel Principal
          </h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">URL de la miniature</label>
              <span className="text-[0.6rem] text-k-indigo bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-semibold tracking-wider">Lien Drive Direct</span>
            </div>
            <input 
              type="url" 
              value={miniatureUrl} 
              onChange={(e) => setMiniatureUrl(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none transition-colors" 
              placeholder="https://drive.google.com/uc?id=1A2b3C4d..." 
            />
            <p className="text-[0.65rem] text-gray-500 ml-1 mt-1.5 leading-relaxed">
              Pour une intégration parfaite, le lien doit utiliser <code className="text-k-indigo font-bold bg-indigo-50/50 px-1 py-0.5 rounded border border-indigo-100/50 mx-0.5">/uc?id=</code>.
            </p>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="font-sub text-[0.65rem] font-bold uppercase tracking-[0.2em] text-k-gold-deep mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Link2 size={16} /> Réseaux liés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="url" value={linkInstagram} onChange={(e) => setLinkInstagram(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none" placeholder="Lien Instagram" />
            <input type="url" value={linkFacebook} onChange={(e) => setLinkFacebook(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none md:col-span-2" placeholder="Lien Facebook" />
            <input type="url" value={linkYoutube} onChange={(e) => setLinkYoutube(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none" placeholder="Lien YouTube" />
            <input type="url" value={linkTiktok} onChange={(e) => setLinkTiktok(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none" placeholder="Lien TikTok" />
          </div>
        </section>
      </form>
    </div>
  );
}
