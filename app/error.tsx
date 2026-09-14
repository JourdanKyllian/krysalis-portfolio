"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import WaveButton from "@/components/WaveButton";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  useEffect(() => {
    console.error("Erreur critique capturée :", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-4 tex-travertine relative overflow-hidden">
      <div className="z-10 flex flex-col items-center max-w-160">
        <AlertTriangle className="w-12 h-12 text-k-gold mb-6" />
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-k-ink mb-4 leading-tight">
          Une erreur de conception
        </h2>
        <p className="text-k-ink/70 text-lg mb-8 leading-relaxed">
          Nous n'avons pas pu charger cette partie de l'espace. Le fil s'est rompu.
        </p>
        <WaveButton onClick={() => reset()}>
          <span className="flex items-center gap-2"><RotateCcw size={16} /> Relancer le rendu</span>
        </WaveButton>
      </div>
    </main>
  );
}
