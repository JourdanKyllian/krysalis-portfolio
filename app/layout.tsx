import type { Metadata } from "next";
import { Poppins, Fraunces } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";
import { supabase } from "@/lib/supabase";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["400"], variable: "--font-bely", display: "swap" });

export const metadata: Metadata = {
  title: "Krysalis Studio — Décoration & agencement intérieur sur mesure",
  description: "Krysalis Studio imagine des espaces vivants, façonnés dans la matière et la lumière du sud.",
};

export const revalidate = 3600; 

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  // 1. Récupération des réseaux sociaux depuis Supabase (Logique Zénith)
  const { data: paramData } = await supabase
    .from('parametres')
    .select('linkedin_url, instagram_url, facebook_url, tiktok_url, youtube_url')
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
    .single();

  const socials = {
    linkedin: paramData?.linkedin_url || "",
    instagram: paramData?.instagram_url || "",
    facebook: paramData?.facebook_url || "",
    tiktok: paramData?.tiktok_url || "",
    youtube: paramData?.youtube_url || ""
  };

  return (
    <html lang="fr" className={`${poppins.variable} ${fraunces.variable} scroll-smooth`}>
      <body className="flex flex-col min-h-screen">
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        {/* On passe les liens dynamiques au Footer */}
        <Footer socials={socials} />
      </body>
    </html>
  );
}
