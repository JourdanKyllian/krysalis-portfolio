"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Save, Image as ImageIcon, Link2, FileText, ToggleLeft, ToggleRight, 
  Plus, Trash2, Video, HardDrive, ListOrdered, Edit3
} from 'lucide-react';
import Link from 'next/link';
import { Categorie, Projet, SousProjet } from '@/types';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Alert from '@/components/ui/Alert';
import { purgeCache } from '@/app/actions/revalidate';

export default function EditProjetPage() {
  const router = useRouter();
  const params = useParams();
  const projetId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

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

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [sousProjets, setSousProjets] = useState<SousProjet[]>([]);

  const [showSpForm, setShowSpForm] = useState(false);
  const [editingSpId, setEditingSpId] = useState<number | null>(null); 
  const [spTitre, setSpTitre] = useState('');
  const [spDescription, setSpDescription] = useState('');
  const [spYoutube, setSpYoutube] = useState('');
  const [spDrive, setSpDrive] = useState('');
  const [spOrdre, setSpOrdre] = useState(1);
  const [spError, setSpError] = useState<string | null>(null);

  const [deleteSpTarget, setDeleteSpTarget] = useState<{ id: number, titre: string } | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    const { data: catData } = await supabase
      .from('categorie')
      .select('*')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .order('name');
    if (catData) setCategories(catData as Categorie[]);

    const { data: projetData, error } = await supabase
      .from('projet')
      .select('*, sousprojet(*)')
      .eq('id', projetId)
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .single();

    if (error || !projetData) {
      router.push('/admin/dashboard');
      return;
    }

    const p = projetData as Projet;
    setTitre(p.titre || '');
    setSlug(p.slug || '');
    setCategorieId(p.categorie_id ? p.categorie_id.toString() : '');
    setDescription(p.description || '');
    setEnLigne(p.en_ligne || false);
    setMiniatureUrl(p.miniature_url || '');
    setLinkInstagram(p.link_instagram || '');
    setLinkYoutube(p.link_youtube || '');
    setLinkTiktok(p.link_tiktok || '');
    setLinkFacebook(p.link_facebook || '');
    
    const sp = p.sousprojet ? p.sousprojet.sort((a, b) => a.ordre - b.ordre) : [];
    setSousProjets(sp);
    setSpOrdre(sp.length + 1); 

    setIsLoading(false);
  }, [projetId, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateProjet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const safeTitre = titre.replace(/"/g, '""');
    const { data: existingData } = await supabase
      .from('projet')
      .select('id')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .neq('id', projetId) 
      .or(`titre.eq."${safeTitre}",slug.eq."${slug}"`);

    if (existingData && existingData.length > 0) {
      setMessage({ text: "Impossible d'enregistrer : un autre projet avec ce titre ou ce slug existe déjà.", type: 'error' });
      setIsSubmitting(false);
      return; 
    }

    const updatedProjet = {
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
    };

    const { error } = await supabase
      .from('projet')
      .update(updatedProjet)
      .eq('id', projetId)
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);

    if (error) {
      setMessage({ text: "Erreur lors de la sauvegarde : " + error.message, type: 'error' });
    } else {
      await purgeCache();
      setMessage({ text: "Projet mis à jour avec succès !", type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    }
    setIsSubmitting(false);
  };
  
  const resetSpForm = () => {
    setSpTitre('');
    setSpDescription('');
    setSpYoutube('');
    setSpDrive('');
    setSpOrdre(sousProjets.length + 1);
    setEditingSpId(null);
    setShowSpForm(false);
    setSpError(null);
  };

  const handleEditClick = (sp: SousProjet) => {
    setSpTitre(sp.titre);
    setSpDescription(sp.description || '');
    setSpYoutube(sp.youtube_url || '');
    setSpDrive(sp.drive_url || '');
    setSpOrdre(sp.ordre);
    setEditingSpId(sp.id); 
    setShowSpForm(true); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleSaveSousProjet = async () => {
    if (!spTitre) return;
    setSpError(null);
    
    const spData = {
      titre: spTitre,
      description: spDescription || null,
      youtube_url: spYoutube || null,
      drive_url: spDrive || null,
      ordre: spOrdre,
      projet_id: parseInt(projetId)
    };

    if (editingSpId) {
      const { error } = await supabase
        .from('sousprojet')
        .update(spData)
        .eq('id', editingSpId);

      if (!error) {
        await purgeCache();
        setSousProjets(sousProjets.map(sp => 
          sp.id === editingSpId ? { ...sp, ...spData, id: editingSpId } : sp
        ).sort((a, b) => a.ordre - b.ordre));
        resetSpForm();
      } else {
        setSpError(error.message);
      }
    } else {
      const { data, error } = await supabase
        .from('sousprojet')
        .insert([spData])
        .select()
        .single();

      if (!error && data) {
        await purgeCache();
        setSousProjets([...sousProjets, data as SousProjet].sort((a, b) => a.ordre - b.ordre));
        resetSpForm();
      } else {
        setSpError(error?.message || "Erreur d'insertion");
      }
    }
  };

  const requestDeleteSp = (id: number, titre: string) => {
    const skipUntil = localStorage.getItem('skipDeleteConfirmUntil');
    if (skipUntil && parseInt(skipUntil) > new Date().getTime()) {
      executeDeleteSp(id);
    } else {
      setDeleteSpTarget({ id, titre });
    }
  };

  const executeDeleteSp = async (id: number) => {
    setDeleteSpTarget(null);
    const { error } = await supabase
      .from('sousprojet')
      .delete()
      .eq('id', id);

    if (!error) {
      await purgeCache();
      setSousProjets(sousProjets.filter(sp => sp.id !== id));
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center text-k-gold-deep h-full min-h-[50vh] text-xs font-bold uppercase tracking-widest animate-pulse">Chargement de l'atelier...</div>;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
        
        {/* --- COLONNE GAUCHE : ÉDITION DU PROJET --- */}
        <div className="xl:col-span-2 space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-k-ink hover:border-gray-300 shadow-sm transition-all">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-k-ink truncate max-w-50 sm:max-w-sm">
                  {titre}
                </h1>
                <p className="font-body text-sm text-gray-500 mt-1">Édition du projet</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleUpdateProjet}
              disabled={isSubmitting}
              className="bg-k-ink text-k-cream px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-md hover:-translate-y-0.5 hover:bg-k-indigo transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <Save size={16} /> {isSubmitting ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </header>

          {message && (
            <div className="mb-6">
              <Alert type={message.type}>{message.text}</Alert>
            </div>
          )}

          <form onSubmit={handleUpdateProjet} className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="font-sub text-[0.65rem] font-bold uppercase tracking-[0.2em] text-k-gold-deep mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <FileText size={16} /> Informations Générales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Titre</label>
                  <input required type="text" value={titre} onChange={(e) => {setTitre(e.target.value); setMessage(null);}} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Slug (URL)</label>
                  <input required type="text" value={slug} onChange={(e) => {setSlug(e.target.value); setMessage(null);}} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-500 focus:border-k-indigo focus:bg-white focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Catégorie</label>
                  <select value={categorieId} onChange={(e) => setCategorieId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none transition-colors appearance-none">
                    <option value="">-- Sans catégorie --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2 flex flex-col justify-center">
                  <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1 mb-2">Visibilité sur le site</label>
                  <button type="button" onClick={() => setEnLigne(!enLigne)} className={`flex items-center justify-center gap-3 w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-[0.7rem] uppercase tracking-widest transition-colors ${enLigne ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100'}`}>
                    {enLigne ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    {enLigne ? 'Public (En ligne)' : 'Brouillon (Masqué)'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Description courte (Concept)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none transition-colors resize-none" placeholder="Résumé des choix de décoration..." />
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="font-sub text-[0.65rem] font-bold uppercase tracking-[0.2em] text-k-gold-deep mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <ImageIcon size={16} /> Média Principal
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none transition-colors placeholder:text-gray-400" 
                  placeholder="https://drive.google.com/uc?id=1A2b3C4d..." 
                />
                <p className="text-[0.65rem] text-gray-500 ml-1 mt-1.5 leading-relaxed">
                  Pour une intégration parfaite, le lien doit utiliser <code className="text-k-indigo font-bold bg-indigo-50/50 px-1 py-0.5 rounded border border-indigo-100/50 mx-0.5">/uc?id=</code> au lieu de <code className="text-red-600 bg-red-50 px-1 rounded mx-0.5">/view</code>.
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

        {/* --- COLONNE DROITE : GESTION DES SOUS-PROJETS --- */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-sub text-[0.65rem] uppercase tracking-[0.2em] font-bold text-k-ink flex items-center gap-2">
                <Video size={16} className="text-k-indigo" /> Détails du projet
              </h2>
              <span className="px-2.5 py-1 bg-indigo-50 text-k-indigo rounded-md text-[0.65rem] font-bold border border-indigo-100">
                {sousProjets.length}
              </span>
            </div>

            {/* LISTE DES SOUS-PROJETS */}
            <div className="space-y-3 mb-6 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
              {sousProjets.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">Aucun détail ajouté pour le moment.</p>
              ) : (
                sousProjets.map(sp => (
                  <div key={sp.id} className={`bg-gray-50 border rounded-xl p-4 group transition-colors ${editingSpId === sp.id ? 'border-k-indigo shadow-[0_0_15px_rgba(1,7,119,0.08)] bg-white' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-semibold text-k-ink mb-1">{sp.titre}</h4>
                        <div className="flex items-center gap-3 text-gray-400">
                            <span className="flex items-center gap-1 text-[0.65rem] font-bold uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                                <ListOrdered size={12}/> Ordre : {sp.ordre}
                            </span>
                            {sp.youtube_url && (
                                <span title="Vidéo YouTube associée" className="flex items-center text-red-500/70">
                                  <Video size={14} />
                                </span>
                            )}
                            {sp.drive_url && (
                                <span title="Lien Drive associé" className="flex items-center text-k-indigo/70">
                                  <HardDrive size={14} />
                                </span>
                            )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => handleEditClick(sp)} className="text-gray-400 hover:text-k-indigo p-1.5 transition-colors">
                          <Edit3 size={14} />
                        </button>
                        <div className="w-px h-4 bg-gray-100"></div>
                        <button 
                          type="button" 
                          onClick={() => requestDeleteSp(sp.id, sp.titre)}
                          className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* BOUTON / FORMULAIRE D'AJOUT OU MODIFICATION */}
            {!showSpForm ? (
              <button 
                type="button"
                onClick={() => { resetSpForm(); setShowSpForm(true); }}
                className="w-full py-4 border border-dashed border-gray-300 text-gray-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-k-indigo hover:text-k-indigo hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Ajouter une étape / un espace
              </button>
            ) : (
              <div className="bg-gray-50 border border-k-indigo/20 rounded-xl p-5 space-y-5 shadow-inner">
                <h4 className="text-[0.65rem] font-bold text-k-indigo uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-k-indigo"></div>
                  {editingSpId ? 'Modifier les détails' : 'Nouveau bloc de détails'}
                </h4>
                
                {spError && (
                  <div className="mb-2">
                    <Alert type="error">{spError}</Alert>
                  </div>
                )}

                <div className="space-y-2">
                  <input type="text" placeholder="Titre (ex: Le Salon, Avant/Après)*" value={spTitre} onChange={e => setSpTitre(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-k-ink focus:border-k-indigo focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <textarea placeholder="Description optionnelle de cet espace..." value={spDescription} onChange={e => setSpDescription(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-k-ink focus:border-k-indigo focus:outline-none resize-none" rows={3} />
                </div>
                <div className="space-y-2">
                  <input type="url" placeholder="Lien YouTube (optionnel)" value={spYoutube} onChange={e => setSpYoutube(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-k-ink focus:border-k-indigo focus:outline-none" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[0.55rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Dossier images (Drive)</label>
                  </div>
                  <input 
                    type="url" 
                    placeholder="https://drive.google.com/uc?id=..." 
                    value={spDrive} 
                    onChange={e => setSpDrive(e.target.value)} 
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-k-ink focus:border-k-indigo focus:outline-none placeholder:text-gray-300" 
                  />
                  <p className="text-[0.6rem] text-gray-500 ml-1 leading-relaxed">
                    Utilisez <code className="text-k-indigo font-bold bg-indigo-50/50 px-1 py-0.5 rounded border border-indigo-100/50 mx-0.5">/uc?id=</code> au lieu de <code className="text-red-600 bg-red-50 px-1 rounded mx-0.5">/view</code>.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[0.6rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Ordre d'affichage</label>
                  <input type="number" min="1" value={spOrdre} onChange={e => setSpOrdre(parseInt(e.target.value))} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-k-ink focus:border-k-indigo focus:outline-none" />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={handleSaveSousProjet} disabled={!spTitre} className="flex-1 bg-k-ink text-k-cream py-2.5 rounded-lg text-xs font-bold tracking-widest hover:bg-k-indigo transition-colors disabled:opacity-50">
                    {editingSpId ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                  <button type="button" onClick={resetSpForm} className="flex-1 bg-white border border-gray-200 text-gray-600 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-50 hover:text-k-ink transition-colors">
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteSpTarget !== null}
        title={deleteSpTarget?.titre || ''}
        onConfirm={() => deleteSpTarget && executeDeleteSp(deleteSpTarget.id)}
        onCancel={() => setDeleteSpTarget(null)}
      />
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}} />
    </>
  );
}
