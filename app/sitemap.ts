import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

/**
 * Génère dynamiquement le fichier sitemap.xml pour le SEO.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://krysalis-studio.fr'; // À adapter avec le vrai domaine

  const { data: projets } = await supabase
    .from('projet')
    .select('slug')
    .eq('en_ligne', true)
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);

  const projetUrls = (projets as { slug: string }[] || [])
    .filter((p) => p.slug && p.slug.trim() !== '')
    .map((p) => ({
      url: `${baseUrl}/projets/${encodeURIComponent(p.slug.trim())}`,
      lastModified: new Date(),
    }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/projets`, lastModified: new Date() },
    { url: `${baseUrl}/a-propos`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date() },
    ...projetUrls,
  ];
}
