'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Maximize2, Loader2 } from 'lucide-react';
import PdfPreview from '@/components/PdfPreview';
import Reveal from './Reveal';

interface DrivePdf {
  id: string;
  name: string;
  previewUrl: string;
  thumbnailUrl: string;
}

interface ExtendedSousProjet {
  id: number;
  projet_id: number;
  titre: string;
  description: string | null;
  drive_url: string | null;
  ordre: number;
  created_at: string;
  finalYoutubeUrl: string | null;
  driveImages: string[];
  pdf: DrivePdf | null;
  driveVideoUrl: string | null;
}

interface ProjectMediaContentProps {
  sousProjets: ExtendedSousProjet[];
  projectTitle: string;
}

function getYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function ProjectMediaContent({ sousProjets, projectTitle }: ProjectMediaContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const allImages = sousProjets.flatMap(sp => sp.driveImages);

  const getHdUrl = (url: string) => {
    return url.includes('drive.google.com/thumbnail')
      ? url.replace('sz=w1200', 'sz=w2048')
      : url;
  };

  const nextIndex = (currentIndex + 1) % allImages.length;
  const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;

  const handleNext = useCallback(() => {
    setIsImageLoading(true);
    setCurrentIndex(nextIndex);
  }, [nextIndex]);

  const handlePrev = useCallback(() => {
    setIsImageLoading(true);
    setCurrentIndex(prevIndex);
  }, [prevIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev]);

  const openLightbox = (url: string) => {
    const index = allImages.indexOf(url);
    if (index !== -1) {
      setIsImageLoading(true);
      setCurrentIndex(index);
      setIsOpen(true);
    }
  };

  if (sousProjets.length === 0) return null;

  return (
    <>
      <div className="space-y-24">
        {sousProjets.map((sp, idx) => {
          let embedYoutubeUrl = null;
          if (sp.finalYoutubeUrl) {
            const ytId = getYoutubeId(sp.finalYoutubeUrl);
            if (ytId) embedYoutubeUrl = `https://www.youtube.com/embed/${ytId}?rel=0`;
          }

          const seoDescription = `${sp.titre || 'Rendu visuel'} — Projet ${projectTitle} par Krysalis Studio`;

          return (
            <div key={sp.id || idx} className="space-y-10">
              
              {(sp.titre || sp.description) && (
                <Reveal className="border-l border-k-gold-deep/50 pl-6 py-1 max-w-4xl">
                  {sp.titre && <h4 className="font-display text-2xl text-k-stone">{sp.titre}</h4>}
                  {sp.description && (
                    <p className="font-body text-k-stone/70 mt-3 text-lg leading-relaxed">
                      {sp.description}
                    </p>
                  )}
                </Reveal>
              )}

              {embedYoutubeUrl && (
                <Reveal className="aspect-video bg-k-oak border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  <iframe 
                    width="100%" height="100%" 
                    src={embedYoutubeUrl} 
                    allowFullScreen 
                    className="border-none"
                    title={`Vidéo YouTube — ${sp.titre || projectTitle}`}
                  />
                </Reveal>
              )}

              {sp.driveVideoUrl && !embedYoutubeUrl && (
                <Reveal className="aspect-video bg-k-oak border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  <iframe 
                    width="100%" height="100%" 
                    src={sp.driveVideoUrl} 
                    allow="autoplay"
                    allowFullScreen 
                    className="border-none bg-black"
                    title={`Vidéo native — ${sp.titre || projectTitle}`}
                  />
                </Reveal>
              )}

              {(sp.driveImages.length > 0 || sp.pdf) && (
                <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sp.pdf && <PdfPreview pdf={sp.pdf} />}

                  {sp.driveImages.map((imgUrl: string, imgIndex: number) => (
                    <button 
                      key={imgIndex}
                      onClick={() => openLightbox(imgUrl)}
                      className="group relative aspect-4/3 rounded-3xl overflow-hidden border border-white/10 bg-k-oak hover:border-k-gold/40 transition-all duration-500 shadow-lg block cursor-zoom-in text-left w-full"
                    >
                      <Image 
                        src={imgUrl} 
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt={`${seoDescription} (${imgIndex + 1})`}
                        priority={idx === 0 && imgIndex < 2}
                      />
                      
                      <div className="absolute inset-0 bg-k-ink/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-10 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-k-gold/20 rounded-full flex items-center justify-center border border-k-gold/40 text-k-gold">
                          <Maximize2 size={18} />
                        </div>
                      </div>
                    </button>
                  ))}
                </Reveal>
              )}
            </div>
          );
        })}
      </div>

      {/* --- LIGHTBOX PLEIN ÉCRAN --- */}
      {isOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-2000 flex items-center justify-center bg-k-ink/98 backdrop-blur-md select-none animate-in fade-in duration-300">
          <div className="hidden" aria-hidden="true">
            <img src={getHdUrl(allImages[nextIndex])} alt="" />
            <img src={getHdUrl(allImages[prevIndex])} alt="" />
          </div>

          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-2001 p-3 text-k-stone/50 hover:text-k-gold transition-colors cursor-pointer focus:outline-none"
          >
            <X size={32} />
          </button>

          {allImages.length > 1 && (
            <button 
              onClick={handlePrev}
              className="absolute left-4 md:left-8 z-2001 p-4 text-k-stone hover:text-k-gold transition-all cursor-pointer group focus:outline-none"
            >
              <ChevronLeft size={40} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          )}

          <div className="relative max-w-6xl max-h-[85vh] p-4 flex flex-col items-center justify-center w-full">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 text-k-gold">
                <Loader2 size={40} className="animate-spin" />
              </div>
            )}

            <img 
              src={getHdUrl(allImages[currentIndex])} 
              alt={`Agrandissement plein écran numéro ${currentIndex + 1} — ${projectTitle}`}
              onLoad={() => setIsImageLoading(false)}
              className={`max-w-full max-h-[80vh] object-contain shadow-2xl transition-opacity duration-300 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
            />
            
            <div className="mt-8 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[0.65rem] font-bold uppercase tracking-widest text-k-stone/70">
              {currentIndex + 1} / {allImages.length}
            </div>
          </div>

          {allImages.length > 1 && (
            <button 
              onClick={handleNext}
              className="absolute right-4 md:right-8 z-2001 p-4 text-k-stone hover:text-k-gold transition-all cursor-pointer group focus:outline-none"
            >
              <ChevronRight size={40} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
