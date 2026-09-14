export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 tex-travertine">
      <div className="relative flex flex-col items-center space-y-6 text-center z-10">
        <div className="relative w-16 h-16">
          {/* Cercle de fond */}
          <div className="absolute inset-0 border-[1.5px] border-k-ink/10 rounded-full"></div>
          {/* Cercle qui tourne */}
          <div className="absolute inset-0 border-[1.5px] border-k-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-k-ink font-semibold uppercase tracking-[0.25em] text-[0.7rem] animate-pulse">
          Chargement de l'espace
        </p>
      </div>
    </main>
  );
}
