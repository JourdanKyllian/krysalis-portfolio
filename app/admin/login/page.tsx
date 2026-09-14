"use client";

import { useState } from 'react';
import { Lock, Mail, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PasswordInput from '@/components/ui/PasswordInput';
import Alert from '@/components/ui/Alert';
import Ambient from "@/components/Ambient";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage("Identifiants incorrects ou accès refusé.");
        setIsLoading(false);
        return;
      }

      if (data.session) {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error("Erreur d'authentification :", err);
      setErrorMessage("Une erreur critique est survenue.");
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage("Veuillez saisir votre adresse email ci-dessus pour la réinitialisation.");
      return;
    }
    
    setIsResetting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/configuration`,
    });

    if (error) {
      setErrorMessage("Erreur lors de l'envoi : " + error.message);
    } else {
      setSuccessMessage("Un email de réinitialisation vous a été envoyé.");
    }
    
    setIsResetting(false);
  };

  return (
    <main className="relative min-h-screen bg-k-oak-2 flex flex-col items-center justify-center p-6 overflow-hidden tex-oak z-10">
      <style>{`
        nav, footer { display: none !important; }
      `}</style>
      
      <Ambient variant="dark" />

      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20">
        <Link href="/" className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-widest uppercase text-k-stone/50 hover:text-k-gold transition-colors">
          <ArrowLeft size={14} /> Retour au site
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center flex flex-col items-center">
          <Logo className="h-12 mb-8 drop-shadow-lg" variant="light" />
          <div className="flex items-center gap-2 text-k-gold/80 mb-2">
            <ShieldCheck size={16} />
            <span className="text-[0.65rem] font-bold tracking-[0.25em] uppercase">Accès Restreint</span>
          </div>
          <h1 className="font-display text-3xl text-k-stone">Espace d'administration</h1>
        </div>

        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-4xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[0.65rem] font-bold tracking-widest uppercase text-k-stone/70 ml-1">
                Identifiant
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-k-stone/40 group-focus-within:text-k-gold transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-k-gold/50 focus:bg-white/10 transition-all duration-300 text-sm"
                  placeholder="admin@krysalis-studio.fr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <PasswordInput 
                label="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                darkTheme={true}
                required
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isResetting}
                  className="text-[0.65rem] text-k-stone/50 hover:text-k-gold transition-colors uppercase tracking-widest font-bold disabled:opacity-50"
                >
                  {isResetting ? 'Envoi...' : 'Mot de passe oublié ?'}
                </button>
              </div>
            </div>

            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
            {successMessage && <Alert type="success">{successMessage}</Alert>}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`relative overflow-hidden w-full px-8 py-4 rounded-xl border-[1.5px] border-k-gold bg-k-gold text-k-ink font-body font-semibold uppercase tracking-widest text-[0.8rem] shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  isLoading ? 'opacity-70 cursor-wait' : 'hover:-translate-y-1'
                }`}
              >
                {isLoading ? 'Authentification...' : 'Déverrouiller l\'atelier'}
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
