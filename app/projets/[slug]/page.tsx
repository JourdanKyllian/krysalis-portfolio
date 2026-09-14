import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getProjectAssetsFromDrive, DriveAssets } from '@/lib/googleDrive';
import { SousProjet, Projet } from '@/types';
import ProjectMediaContent from '@/components/ProjectMediaContent';
import Section from '@/components/Section';
import Reveal from '@/components/Reveal';

export const revalidate = 3600;

// --- LOGIQUE ZÉNITH : PRÉ-GÉNÉRATION STATIQUE ---
export async function generateStaticParams() {
  const { data: projets } = await supabase
    .from('projet')
    .select('slug')
    .eq('en_ligne', true)
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);

  if (!projets) return [];

  return projets.map((projet) => ({
    slug: projet.slug,
  }));
}

interface ProcessedSousProjet extends SousProjet {
  finalYoutubeUrl: string | null;
  driveImages: string[];
  pdf: {
    id: string;
    name: string;
    previewUrl: string;
    thumbnailUrl: string;
  } | null;
  driveVideoUrl: string | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data } = await supabase
    .from('projet')
    .select('*, categorie(*)')
    .eq('slug', slug)
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
    .single();

  if (!data) {
    return { title: 'Projet — Krysalis Studio' };
  }

  const project = data as unknown as Projet;
  const categoryName = project.categorie?.name || 'Général';

  return {
    title: `${project.titre} — ${categoryName} | Krysalis Studio`,
  };
}

function getDriveFileId(urlOrId: string | null | undefined): string | null {
  if (!urlOrId) return null;
  if (!urlOrId.includes('/')) return urlOrId;
  const fileDMatch = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileDMatch) return fileDMatch[1];
  const idParamMatch = urlOrId.match(/id=([a-zA-Z0-9-_]+)/);
  if (idParamMatch) return idParamMatch[1];
  const driveViewerMatch = urlOrId.match(/\/drive-viewer\/([a-zA-Z0-9-_]+)/);
  if (driveViewerMatch) return driveViewerMatch[1];
  return null;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // --- LOGIQUE ZÉNITH : FETCH DES DONNÉES ---
  const { data } = await supabase
    .from('projet')
    .select('*, categorie(*), sousprojet(*)')
    .eq('slug', slug)
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
    .single();

  if (!data) return notFound();

  const project = data as unknown as Projet;

  const sousProjets: SousProjet[] = (project.sousprojet || [])
    .sort((a: SousProjet, b: SousProjet) => (a.ordre || 0) - (b.ordre || 0));

  const sousProjetsAvecMedias: ProcessedSousProjet[] = await Promise.all(
    sousProjets.map(async (sp) => {
      const driveAssets: DriveAssets = sp.drive_url 
        ? await getProjectAssetsFromDrive(sp.drive_url)
        : { images: [], youtubeUrl: null, pdf: null, videoUrl: null }; 
      
      return {
        ...sp,
        finalYoutubeUrl: driveAssets.youtubeUrl || sp.youtube_url,
        driveImages: driveAssets.images,
        pdf: driveAssets.pdf,
        driveVideoUrl: driveAssets.videoUrl
      };
    })
  );

  const miniatureUrl = project.miniature_url;
  let coverImageUrl = "";

  if (miniatureUrl) {
    if (miniatureUrl.startsWith('http') && !miniatureUrl.includes('drive.google.com')) {
      coverImageUrl = miniatureUrl;
    } else {
      const driveImageId = getDriveFileId(miniatureUrl);
      coverImageUrl = driveImageId 
        ? `https://drive.google.com/thumbnail?id=${driveImageId}&sz=w2048`
        : miniatureUrl;
    }
  } else {
    coverImageUrl = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2048&auto=format&fit=cover";
  }

  // --- HABILLAGE KRYSALIS ---
  return (
    <main>
      <Section theme="light" className="pt-40 pb-12 min-h-[60vh] flex flex-col justify-end">
        <Reveal>
          <Link href="/projets" className="inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-widest uppercase text-k-ink/50 hover:text-k-gold-deep transition-colors mb-8">
            <ArrowLeft size={14} /> Retour au portfolio
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[0.65rem] tracking-[0.25em] uppercase text-k-gold-deep font-bold border border-k-gold-deep/30 px-3 py-1 rounded-full">
              {project.categorie?.name || 'Projet'}
            </span>
            <span className="text-[0.65rem] tracking-[0.25em] uppercase text-k-ink/40 font-bold">
              {new Date(project.created_at).getFullYear()}
            </span>
          </div>

          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] text-k-ink max-w-[15ch] leading-[1.05]">
            {project.titre}
          </h1>
        </Reveal>
      </Section>

      <Section theme="dark" className="py-24">
        {/* L'image Hero du projet */}
        <Reveal className="w-full aspect-video md:aspect-21/9 rounded-3xl bg-k-oak-2 border border-white/10 mb-20 overflow-hidden relative shadow-2xl">
          <img 
            src={coverImageUrl} 
            alt={project.titre} 
            className="w-full h-full object-cover opacity-90"
            loading="eager" 
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_70%,rgba(36,20,7,0.8)_100%)]" />
        </Reveal>

        {/* Le Concept (Description) */}
        {project.description && (
          <Reveal className="mb-24 max-w-4xl">
            <h2 className="text-2xl text-k-gold mb-6">Le concept</h2>
            <p className="text-k-stone/80 leading-relaxed text-lg whitespace-pre-wrap">
              {project.description}
            </p>
          </Reveal>
        )}

        {/* Moteur d'affichage des médias (Client Component) */}
        <ProjectMediaContent 
          sousProjets={sousProjetsAvecMedias} 
          projectTitle={project.titre} 
        />
      </Section>
    </main>
  );
}
