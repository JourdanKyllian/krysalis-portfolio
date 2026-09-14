"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, FolderKanban, Tags, Settings } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifierHabilitation = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/admin/login');
        return;
      }

      if (session.user.id !== process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID) {
        console.warn("Intrusion bloquée : Tentative d'accès inter-tenant.");
        await supabase.auth.signOut();
        router.push('/admin/login');
        return;
      }

      setIsAuthorized(true);
    };

    verifierHabilitation();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const navLinks = [
    { href: '/admin/dashboard', icon: FolderKanban, label: 'Projets' },
    { href: '/admin/categories', icon: Tags, label: 'Catégories' },
    { href: '/admin/configuration', icon: Settings, label: 'Configuration' },
  ];

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-k-cream flex items-center justify-center">
        <span className="font-semibold text-xs text-k-gold-deep uppercase tracking-widest animate-pulse">
          Vérification des accréditations...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-body flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-k-ink border-b md:border-b-0 md:border-r border-k-indigo/50 p-6 flex flex-col z-20">
        <div className="mb-12">
          <Link href="/" className="block hover:opacity-80 transition-opacity">
            <Logo className="h-10" variant="light" />
          </Link>
          <p className="font-semibold text-[0.65rem] uppercase tracking-[0.25em] text-k-gold-deep mt-4">
            Atelier (Admin)
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            const Icon = link.icon;

            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive 
                    ? 'bg-white/10 text-white cursor-default' 
                    : 'text-k-stone/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={isActive ? "text-k-gold" : ""} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </aside>

      <main className="flex-1 bg-[#faf8f5] p-6 md:p-10 overflow-y-auto relative text-k-ink">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#02044d 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          {children} 
        </div>
      </main>
    </div>
  );
}
