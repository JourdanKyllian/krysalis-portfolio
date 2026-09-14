"use client";

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, onConfirm, onCancel }: ConfirmModalProps) {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (dontAskAgain) {
      const expiry = Date.now() + 15 * 60 * 1000;
      localStorage.setItem('skipDeleteConfirmUntil', expiry.toString());
    }
    setDontAskAgain(false);
    onConfirm();
  };

  const handleCancel = () => {
    setDontAskAgain(false);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-k-ink/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={18} />
            <h3 className="font-sub text-xs uppercase tracking-widest font-bold">Confirmation requise</h3>
          </div>
          <button onClick={handleCancel} className="text-gray-400 hover:text-k-ink transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm font-body text-k-ink">
            Êtes-vous sûr de vouloir supprimer <strong className="font-semibold">"{title}"</strong> ?
          </p>
          <p className="text-xs text-gray-500 italic">
            Cette action est irréversible et supprimera également toutes les données qui y sont liées.
          </p>

          <label className="flex items-center gap-2 mt-4 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={dontAskAgain}
              onChange={(e) => setDontAskAgain(e.target.checked)}
              className="rounded border-gray-300 text-k-indigo focus:ring-k-indigo"
            />
            <span className="text-xs text-gray-500 group-hover:text-k-ink transition-colors">
              Ne plus demander d'autorisation pendant 15 minutes
            </span>
          </label>
        </div>

        <div className="flex gap-3 p-5 bg-gray-50/50 border-t border-gray-100">
          <button 
            onClick={handleCancel} 
            className="flex-1 bg-white border border-gray-200 text-k-ink py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleConfirm} 
            className="flex-1 bg-red-50 text-red-600 border border-red-100 py-2.5 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-colors"
          >
            Oui, Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
