"use client";

import { FileText, ExternalLink } from 'lucide-react';

interface PdfPreviewProps {
  pdf: {
    id: string;
    name: string;
    previewUrl: string;
    thumbnailUrl: string;
  };
}

export default function PdfPreview({ pdf }: PdfPreviewProps) {
  return (
    <a 
      href={pdf.previewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-4/3 rounded-3xl overflow-hidden border border-white/10 bg-k-oak hover:border-k-gold/40 transition-all duration-500 shadow-lg block cursor-pointer"
    >
      <img 
        src={pdf.thumbnailUrl} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        alt={`Aperçu du document PDF : ${pdf.name}`} 
      />
      
      <div className="absolute inset-0 bg-k-ink/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-10 backdrop-blur-sm">
        <div className="w-12 h-12 bg-k-gold/20 rounded-full flex items-center justify-center border border-k-gold/40 text-k-gold">
          <ExternalLink size={18} />
        </div>
        <span className="text-white font-body text-[0.65rem] font-bold uppercase tracking-widest">
          Ouvrir le document
        </span>
      </div>

      <div className="absolute top-5 left-5 bg-white/90 text-k-ink font-body text-[0.6rem] font-bold px-3 py-1.5 rounded-md uppercase tracking-widest flex items-center gap-2 shadow-md backdrop-blur-md">
        <FileText size={12} />
        PDF
      </div>
    </a>
  );
}
