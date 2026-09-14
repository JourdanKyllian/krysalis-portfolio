"use client";

import { motion } from "framer-motion";
import { Camera, Video, LayoutDashboard } from "lucide-react";
import { Projet } from "@/types";
import Link from "next/link";

// Utilitaires de Zénith pour résoudre les images Drive/YouTube
function getYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getDriveFileId(urlOrId: string | null | undefined): string | null {
  if (!urlOrId) return null;
  if (!urlOrId.includes('/')) return urlOrId;
  const fileDMatch = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileDMatch) return fileDMatch[1];
  const idParamMatch = urlOrId.match(/id=([a-zA-Z0-9-_]+)/);
  if (idParamMatch) return idParamMatch[1];
  return null;
}

export default function ProjectCard({ project, index = 0 }: { project: Projet, index?: number }) {
  const delay = (index % 3) * -2; 

  // Logique de résolution de la miniature
  let coverImageUrl = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=cover";
  if (project.miniature_url) {
    if (project.miniature_url.startsWith('http') && !project.miniature_url.includes('drive.google.com')) {
      coverImageUrl = project.miniature_url;
    } else {
      const driveImageId = getDriveFileId(project.miniature_url);
      if (driveImageId) coverImageUrl = `https://drive.google.com/thumbnail?id=${driveImageId}&sz=w800`;
    }
  } else if (project.sousprojet?.[0]?.youtube_url) {
    const youtubeId = getYoutubeId(project.sousprojet[0].youtube_url);
    if (youtubeId) coverImageUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }

  const hasVideo = project.sousprojet?.some(sp => sp.youtube_url || sp.drive_url);
  const Icon = hasVideo ? Video : Camera;

  return (
    <Link href={`/projets/${project.slug}`} className="block focus:outline-none">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative block w-full aspect-square text-left cursor-pointer group"
      >
        {/* La bulle liquide contenant l'image du projet */}
        <div 
          className="absolute inset-0 overflow-hidden animate-morph shadow-[0_10px_30px_rgba(2,4,77,0.15)] transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(244,217,100,0.25)] bg-k-oak"
          style={{ 
            backgroundImage: `url(${coverImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animationDelay: `${delay}s` 
          }}
        >
          {/* Overlay pour la lisibilité du texte */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(2,4,77,0.9)_100%)] opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
        </div>

        {/* Badge Catégorie */}
        <div className="absolute top-8 inset-x-0 flex justify-center z-20">
          <div className="flex items-center gap-1.5 bg-k-ink/40 backdrop-blur-md text-k-cream text-[0.66rem] tracking-wider uppercase px-4 py-2 rounded-full border border-white/20 shadow-sm transition-transform duration-500 group-hover:-translate-y-1">
            <Icon size={14} /> {project.categorie?.name || "Projet"}
          </div>
        </div>

        {/* Titre */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-8 flex flex-col items-center justify-end text-center h-full pb-10">
          <span className="block text-[0.64rem] tracking-[0.16em] uppercase text-k-gold/90 mb-2 transition-transform duration-500 group-hover:-translate-y-2">
            Découvrir l'espace
          </span>
          <h3 className="text-xl md:text-2xl text-k-cream m-0 drop-shadow-md transition-transform duration-500 group-hover:-translate-y-2">
            {project.titre}
          </h3>
        </div>
      </motion.div>
    </Link>
  );
}
