"use client";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
}

export default function Logo({ className = "h-10", variant = "dark" }: LogoProps) {
  const isLight = variant === "light";

  // Couleur du texte principal
  const textColor = isLight ? "var(--color-k-cream)" : "var(--color-k-ink)";
  // Couleur dorée des repères d'architecture et du papillon
  const goldColor = "var(--color-k-gold-deep)";

  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        viewBox="0 0 520 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-full overflow-visible"
      >
        {/* --- 1. LIGNES DE CONSTRUCTION ARCHITECTURALES (DORÉES) --- */}
        <g stroke={goldColor} strokeWidth="1" opacity="0.85">
          {/* Ligne diagonale passant par le K */}
          <line x1="80" y1="150" x2="220" y2="40" />
          {/* Croix repères */}
          <line x1="80" y1="140" x2="80" y2="160" />
          <line x1="70" y1="150" x2="90" y2="150" />
          
          <line x1="220" y1="30" x2="220" y2="50" />
          <line x1="210" y1="40" x2="230" y2="40" />

          {/* Ligne horizontale sous le haut du K */}
          <line x1="85" y1="65" x2="220" y2="65" strokeDasharray="3 3" />
          {/* Ligne horizontale de base */}
          <line x1="45" y1="135" x2="175" y2="135" strokeDasharray="3 3" />
        </g>

        {/* --- 2. TYPOGRAPHIE "Krysalis" --- */}
        <text
          x="90"
          y="132"
          fill={textColor}
          fontFamily="var(--font-display), Georgia, serif"
          fontSize="92"
          fontWeight="500"
          letterSpacing="-1"
        >
          Krysalis
        </text>

        {/* --- 3. LE PAPILLON EN TRAIT FIN (LIGNE D'OR) --- */}
        <g transform="translate(410, 55) scale(0.65)" stroke={goldColor} strokeWidth="1.8" fill="none">
          {/* Aile supérieure droite */}
          <path d="M 12,25 C 22,5 38,2 42,15 C 46,28 32,38 20,38" />
          {/* Aile inférieure droite */}
          <path d="M 18,36 C 30,42 35,52 28,58 C 20,64 12,50 10,40" />
          {/* Aile supérieure gauche */}
          <path d="M 10,25 C 2,-5 18,0 12,22" />
          {/* Corps & Antennes */}
          <path d="M 10,20 C 12,28 12,38 10,45" strokeWidth="2.2" />
          <path d="M 10,20 C 6,12 2,8 0,6" />
          <path d="M 11,19 C 16,12 20,8 24,7" />
        </g>

        {/* --- 4. TYPOGRAPHIE "Studio" (DORÉE) --- */}
        <text
          x="235"
          y="180"
          fill={goldColor}
          fontFamily="var(--font-body), system-ui, sans-serif"
          fontSize="36"
          fontWeight="400"
          letterSpacing="1"
        >
          Studio
        </text>
      </svg>
    </div>
  );
}
