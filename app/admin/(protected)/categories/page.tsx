"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  Trash2, 
  FolderOpen,
  Save,
  Edit3,
  X,
  Tags
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Alert from '@/components/ui/Alert';

interface Categorie {
  id: string;
  name: string;
  slug: string;
  projet: { id: string }[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- ÉTATS DU FORMULAIRE ---
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  
  const [formMessage, setFormMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- ÉTATS POUR LA MODALE ---
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('categorie')
      .select('*, projet(id)')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .order('name', { ascending: true });

    if (!error && data) {
      setCategories(data as Categorie[]);
    } else {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setNewName('');
    setNewSlug('');
    setEditingId(null);
    setShowForm(false);
    setFormMessage(null);
  };

  const handleEditClick = (cat: Categorie) => {
    setNewName(cat.name);
    setNewSlug(cat.slug);
    setEditingId(cat.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewName(val);
    setFormMessage(null);
    setNewSlug(
      val
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
    );
  };

  const handleSaveCategorie = async () => {
    if (!newName || !newSlug) return;
    
    setIsSubmitting(true);
    setFormMessage(null);

    const safeName = newName.replace(/"/g, '""');
    
    let query = supabase
      .from('categorie')
      .select('id')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .or(`name.eq."${safeName}",slug.eq."${newSlug}"`);
      
    if (editingId) {
      query = query.neq('id', editingId);
    }

    const { data: existingData } = await query;

    if (existingData && existingData.length > 0) {
      setFormMessage({ text: "Cette catégorie (nom ou slug) existe déjà.", type: 'error' });
      setIsSubmitting(false);
      return; 
    }

    const catData = { 
      name: newName, 
      slug: newSlug, 
      user_id: process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID 
    };

    if (editingId) {
      const { error } = await supabase
        .from('categorie')
        .update(catData)
        .eq('id', editingId);

      if (!error) {
        setCategories(categories.map(c => c.id === editingId ? { ...c, ...catData } : c).sort((a, b) => a.name.localeCompare(b.name)));
        setFormMessage({ text: "Catégorie mise à jour avec succès !", type: 'success' });
        setTimeout(() => resetForm(), 1500);
      } else {
        setFormMessage({ text: error.message, type: 'error' });
      }
    } else {
      const { data, error } = await supabase
        .from('categorie')
        .insert([catData])
        .select('*, projet(id)')
        .single();

      if (!error && data) {
        setCategories([...categories, data as Categorie].sort((a, b) => a.name.localeCompare(b.name)));
        setFormMessage({ text: "Catégorie créée avec succès !", type: 'success' });
        setTimeout(() => resetForm(), 1500);
      } else {
        setFormMessage({ text: error?.message || "Erreur d'insertion", type: 'error' });
      }
    }
    
    setIsSubmitting(false);
  };

  const requestDelete = (id: string, name: string) => {
    const skipUntil = localStorage.getItem('skipDeleteConfirmUntil');
    if (skipUntil && parseInt(skipUntil) > Date.now()) {
      executeDelete(id);
    } else {
      setDeleteTarget({ id, name });
    }
  };

  const executeDelete = async (id: string) => {
    setDeleteTarget(null);
    const { error } = await supabase.from('categorie').delete().eq('id', id);
    if (!error) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-k-ink">
            Catégories
          </h1>
          <p className="font-body text-sm text-gray-500 mt-1">
            Organisez vos projets par type de prestation ou d'espace.
          </p>
        </div>
        {!showForm && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-k-ink text-k-cream hover:bg-k-indigo px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-md transition-all hover:-translate-y-0.5"
          >
            <Plus size={16} />
            Nouvelle Catégorie
          </button>
        )}
      </header>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm relative z-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h3 className="font-sub text-[0.65rem] font-bold uppercase tracking-[0.2em] text-k-gold-deep flex items-center gap-2">
              <Tags size={16} />
              {editingId ? 'Modifier la catégorie' : 'Créer une catégorie'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-k-ink transition-colors">
              <X size={18} />
            </button>
          </div>
          
          {formMessage && (
            <div className="mb-6">
              <Alert type={formMessage.type}>{formMessage.text}</Alert>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-5 items-end">
            <div className="flex-1 w-full space-y-2">
              <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Nom de la catégorie</label>
              <input 
                type="text" 
                value={newName} 
                onChange={handleNameChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none transition-colors" 
                placeholder="Ex: Appartements"
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Slug généré (URL)</label>
              <input 
                type="text" 
                value={newSlug} 
                onChange={(e) => { setNewSlug(e.target.value); setFormMessage(null); }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-400 focus:border-k-indigo focus:bg-white focus:outline-none transition-colors" 
              />
            </div>
            <button 
              onClick={handleSaveCategorie} 
              disabled={isSubmitting || !newName}
              className="bg-k-ink text-k-cream h-[46px] px-8 rounded-xl font-bold text-xs tracking-widest flex items-center gap-2 hover:bg-k-indigo hover:-translate-y-0.5 shadow-md transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <Save size={16} /> {isSubmitting ? '...' : (editingId ? 'Mettre à jour' : 'Enregistrer')}
            </button>
          </div>
        </div>
      )}

      <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden relative z-10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-sub text-[0.65rem] uppercase tracking-widest text-gray-500">
                <th className="p-5 font-bold">Nom de la Catégorie</th>
                <th className="p-5 font-bold">Slug (URL)</th>
                <th className="p-5 font-bold text-center">Projets liés</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white">
                    <td className="p-5"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
                    <td className="p-5"><div className="h-4 w-24 bg-gray-100 rounded"></div></td>
                    <td className="p-5"><div className="h-6 w-10 mx-auto bg-gray-200 rounded-md"></div></td>
                    <td className="p-5 text-right flex justify-end gap-2">
                      <div className="h-9 w-9 bg-gray-100 rounded-lg"></div>
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <FolderOpen size={24} className="text-gray-400" />
                    </div>
                    <p className="font-body font-medium text-k-ink mb-1">Aucune catégorie existante</p>
                    <p className="text-sm text-gray-500">Créez votre première catégorie pour organiser vos projets.</p>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5 font-display font-semibold text-lg tracking-wide text-k-ink group-hover:text-k-indigo transition-colors">
                      {cat.name}
                    </td>
                    <td className="p-5 font-body text-xs text-gray-400">
                      /{cat.slug}
                    </td>
                    <td className="p-5 text-center">
                      <span className="px-3 py-1.5 bg-indigo-50 text-k-indigo border border-indigo-100 rounded-md text-[0.65rem] font-bold">
                        {cat.projet?.length || 0}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(cat)}
                          className="p-2.5 text-gray-400 hover:text-k-indigo hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100" 
                          title="Modifier"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => requestDelete(cat.id, cat.name)}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" 
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmModal 
        isOpen={deleteTarget !== null}
        title={deleteTarget?.name || ''}
        onConfirm={() => deleteTarget && executeDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
