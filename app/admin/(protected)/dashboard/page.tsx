"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  FolderKanban, 
  Edit3, 
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { Projet } from '@/types/index';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function DashboardPage() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- ÉTATS POUR LA MODALE DE SUPPRESSION ---
  const [deleteTarget, setDeleteTarget] = useState<{ id: number, titre: string } | null>(null);

  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('projet')
      .select('*, categorie(*)')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjets(data as unknown as Projet[]);
    } else {
      console.error("Erreur lors de la récupération des projets :", error);
    }
    setIsLoading(false);
  };

  const requestDelete = (id: number, titre: string) => {
    const skipUntil = localStorage.getItem('skipDeleteConfirmUntil');
    if (skipUntil && parseInt(skipUntil) > Date.now()) {
      executeDelete(id);
    } else {
      setDeleteTarget({ id, titre });
    }
  };

  const executeDelete = async (id: number) => {
    setDeleteTarget(null);
    setIsLoading(true);
    const { error } = await supabase
      .from('projet')
      .delete()
      .eq('id', id);

    if (!error) {
      setProjets(projets.filter(p => p.id !== id));
    } else {
      console.error("Erreur lors de la suppression :", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-k-ink">
            Gestion des Projets
          </h1>
          <p className="font-body text-sm text-k-ink/60 mt-1">
            Gérez les réalisations visibles sur le portfolio public.
          </p>
        </div>
        <Link 
          href="/admin/dashboard/projet/nouveau"
          className="bg-k-ink text-k-cream hover:bg-k-indigo px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-lg transition-all hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Nouveau Projet
        </Link>
      </header>

      {/* --- LISTE DES PROJETS --- */}
      <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden relative z-10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-sub text-[0.65rem] uppercase tracking-widest text-gray-500">
                <th className="p-5 font-bold">Projet</th>
                <th className="p-5 font-bold">Catégorie</th>
                <th className="p-5 font-bold">Statut</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {isLoading ? (
                /* --- SKELETON LOADER --- */
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white">
                    <td className="p-5">
                      <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-32 bg-gray-100 rounded"></div>
                    </td>
                    <td className="p-5">
                      <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
                    </td>
                    <td className="p-5">
                      <div className="h-5 w-20 bg-gray-100 rounded"></div>
                    </td>
                    <td className="p-5 text-right flex justify-end gap-2">
                      <div className="h-9 w-9 bg-gray-100 rounded-lg"></div>
                      <div className="h-9 w-9 bg-gray-100 rounded-lg"></div>
                    </td>
                  </tr>
                ))
              ) : projets.length === 0 ? (
                /* --- ÉTAT VIDE --- */
                <tr>
                  <td colSpan={4} className="p-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <FolderKanban size={24} className="text-gray-400" />
                    </div>
                    <p className="font-body font-medium text-k-ink mb-1">Aucun projet trouvé</p>
                    <p className="text-sm text-gray-500">Commencez par ajouter votre première réalisation.</p>
                  </td>
                </tr>
              ) : (
                /* --- DONNÉES RÉELLES --- */
                projets.map((projet) => (
                  <tr key={projet.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="font-display font-semibold text-lg tracking-wide text-k-ink group-hover:text-k-indigo transition-colors">
                        {projet.titre}
                      </div>
                      <div className="font-body text-xs text-gray-400 mt-0.5 truncate max-w-62.5">
                        /{projet.slug}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-[0.65rem] font-bold uppercase tracking-widest text-gray-600">
                        {projet.categorie?.name || 'Général'}
                      </span>
                    </td>
                    <td className="p-5">
                      {projet.en_ligne ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
                          <Eye size={14} /> Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
                          <EyeOff size={14} /> Masqué
                        </span>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/dashboard/projet/${projet.id}`}
                          className="p-2.5 text-gray-400 hover:text-k-indigo hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100" 
                          title="Modifier"
                        >
                          <Edit3 size={16} />
                        </Link>
                        
                        <button 
                          onClick={() => requestDelete(projet.id, projet.titre)}
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
        title={deleteTarget?.titre || ''}
        onConfirm={() => deleteTarget && executeDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
