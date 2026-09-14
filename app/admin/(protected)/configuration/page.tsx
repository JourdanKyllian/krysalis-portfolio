"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link as LinkIcon, Mail, ShieldCheck, User } from 'lucide-react';
import PasswordInput from '@/components/ui/PasswordInput';
import Alert from '@/components/ui/Alert';

export default function ConfigurationPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // ÉTATS GLOBAUX
  const [authEmail, setAuthEmail] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [globalMessage, setGlobalMessage] = useState<{ text: string, type: 'success' | 'error' | 'warning' } | null>(null);

  // ÉTATS MOT DE PASSE
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) setAuthEmail(authData.user.email || '');

    const { data: dbData } = await supabase.from('parametres').select('cv_url').eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID).single();
    if (dbData) setCvUrl(dbData.cv_url || '');
    setIsLoading(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setGlobalMessage(null);

    try {
      const { error: dbError } = await supabase.from('parametres').update({ cv_url: cvUrl }).eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);
      if (dbError) throw new Error(dbError.message);

      const { data: currentUser } = await supabase.auth.getUser();
      if (currentUser.user && currentUser.user.email !== authEmail) {
        const { error: authError } = await supabase.auth.updateUser({ email: authEmail });
        if (authError) throw new Error(authError.message);
        setGlobalMessage({ text: "Un mail de confirmation a été envoyé à la nouvelle adresse.", type: 'warning' });
      } else {
        setGlobalMessage({ text: "Informations enregistrées avec succès !", type: 'success' });
        setTimeout(() => setGlobalMessage(null), 3000);
      }
    } catch (error: any) {
      setGlobalMessage({ text: error.message, type: 'error' });
    }
    setIsSavingSettings(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (newPassword !== confirmPassword) return setPassMessage({ text: "Les mots de passe ne correspondent pas.", type: 'error' });
    if (newPassword.length < 6) return setPassMessage({ text: "Au moins 6 caractères requis.", type: 'error' });

    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPassMessage({ text: "Erreur : " + error.message, type: 'error' });
      setIsUpdatingPassword(false);
    } else {
      setPassMessage({ text: "Mot de passe mis à jour !", type: 'success' });
      setNewPassword(''); 
      setConfirmPassword('');
      setTimeout(() => setPassMessage(null), 3000);
    }
  };

  return (
    <>
      <header className="mb-10 relative z-10">
        <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-k-ink">Configuration</h1>
        <p className="font-body text-sm text-gray-500 mt-1">Gérez les identifiants de votre atelier.</p>
      </header>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* CARTE 1 : CONNEXION & CV */}
        <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-8 border-b border-gray-100 pb-4">
            <h2 className="font-sub text-[0.65rem] uppercase tracking-[0.2em] font-bold text-k-gold-deep mb-2 flex items-center gap-2">
              <User size={16} /> Connexion & Documents
            </h2>
            <p className="text-xs text-gray-500">Modifiez votre identifiant d'accès et votre CV public.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Email de connexion</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Mail size={16} /></div>
                <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[0.65rem] uppercase font-bold tracking-widest text-gray-500 ml-1">Lien du Book / CV (Drive PDF)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><LinkIcon size={16} /></div>
                <input type="url" value={cvUrl} onChange={(e) => setCvUrl(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-sm text-k-ink focus:border-k-indigo focus:bg-white focus:outline-none transition-colors placeholder:text-gray-300" placeholder="https://drive.google.com/..." />
              </div>
            </div>

            {globalMessage && (
              <div className="pt-2">
                <Alert type={globalMessage.type}>{globalMessage.text}</Alert>
              </div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={isSavingSettings} className="bg-k-ink text-k-cream px-6 py-3.5 rounded-xl text-xs font-bold tracking-widest shadow-md hover:-translate-y-0.5 hover:bg-k-indigo transition-all disabled:opacity-50 disabled:hover:translate-y-0 uppercase">
                {isSavingSettings ? 'Enregistrement...' : 'Enregistrer les infos'}
              </button>
            </div>
          </form>
        </section>

        {/* CARTE 2 : SÉCURITÉ DU COMPTE */}
        <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-8 border-b border-gray-100 pb-4">
            <h2 className="font-sub text-[0.65rem] uppercase tracking-[0.2em] font-bold text-k-gold-deep mb-2 flex items-center gap-2">
              <ShieldCheck size={16} /> Sécurité du compte
            </h2>
            <p className="text-xs text-gray-500">Modifiez votre mot de passe d'accès à l'administration.</p>
          </div>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <PasswordInput 
              label="Nouveau mot de passe" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              darkTheme={false} 
              required 
            />
            <PasswordInput 
              label="Confirmer le mot de passe" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              darkTheme={false} 
              required 
            />
            
            {passMessage && (
              <div className="pt-2">
                <Alert type={passMessage.type}>{passMessage.text}</Alert>
              </div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={isUpdatingPassword} className="bg-white border border-gray-200 text-gray-700 px-6 py-3.5 rounded-xl text-xs font-bold tracking-widest shadow-sm hover:bg-gray-50 hover:text-k-ink transition-all disabled:opacity-50 uppercase">
                {isUpdatingPassword ? 'Mise à jour...' : 'Modifier le mot de passe'}
              </button>
            </div>
          </form>
        </section>

      </div>
    </>
  );
}
