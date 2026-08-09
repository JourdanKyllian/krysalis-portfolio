"use client";

import { useEffect, useRef, useState } from "react";

const JOURNEY = [
  { year: "2018", title: "Premiers coups de crayon", text: "Naissance de l'atelier, autour de projets d'agencement pour des indépendants du sud de la France." },
  { year: "2021", title: "Vers le sur-mesure complet", text: "Élargissement à la décoration globale : mobilier, matières, lumière, jusqu'à la pose finale." },
  { year: "2024", title: "Naissance de Krysalis Studio", text: "Une nouvelle identité, pensée comme une métamorphose : celle de l'atelier, et celle de chaque intérieur confié." },
];

export default function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const dotsYRef = useRef<number[]>([]); // Cache des positions Y exactes
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const newHeight = entries[0].contentRect.height;
      
      // On calcule la position Y physique et réelle de chaque bouton dans le DOM
      dotsYRef.current = JOURNEY.map((_, i) => {
        const dot = dotsRef.current[i];
        const wrapper = dot?.parentElement;
        if (!dot || !wrapper) return 8;
        
        // wrapper.offsetTop = distance depuis le haut du conteneur parent
        // dot.offsetTop = distance depuis le haut de son wrapper (le top-1.5 de Tailwind)
        // 6.5 = on rajoute la moitié de la hauteur du bouton (13px) pour cibler le centre exact
        return wrapper.offsetTop + dot.offsetTop + 6.5;
      });

      setHeight(newHeight);
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (height === 0 || !pathRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf: number;
    let time = 0;

    const animate = () => {
      time += 0.015; 
      let d = "";
      const dotsY = dotsYRef.current;

      if (dotsY.length === JOURNEY.length) {
        JOURNEY.forEach((_, i) => {
          const dotY = dotsY[i];
          // L'onde mathématique de la vague
          const waveOffset = Math.sin(time + i * 1.5) * 8;

          // Déplacement physique du bouton pour qu'il reste collé à la vague
          if (dotsRef.current[i]) {
            dotsRef.current[i]!.style.transform = `translateX(calc(13.5px + ${waveOffset}px))`;
          }

          if (i === 0) {
            // Le tout premier point de la ligne
            d = `M ${20 + waveOffset} ${dotY}`;
          } else {
            // Relier le point précédent au point actuel
            const prevDotY = dotsY[i - 1];
            const prevWaveOffset = Math.sin(time + (i - 1) * 1.5) * 8;

            // Oscillation de la courbe alternée (droite/gauche)
            const baseWiggle = (i - 1) % 2 === 0 ? 32 : 8;
            const wiggle = baseWiggle + (prevWaveOffset + waveOffset) / 2;
            
            // Différence de hauteur pour calculer la tension de la courbe de Bézier (30%)
            const dy = dotY - prevDotY;
            d += ` C ${wiggle} ${prevDotY + dy * 0.3}, ${wiggle} ${dotY - dy * 0.3}, ${20 + waveOffset} ${dotY}`;
          }
        });

        // Dessiner la fin de la ligne jusqu'en bas du conteneur
        const lastIdx = JOURNEY.length - 1;
        const lastDotY = dotsY[lastIdx];
        const bottomY = height;
        const lastWaveOffset = Math.sin(time + lastIdx * 1.5) * 8;
        const bottomWaveOffset = Math.sin(time + (lastIdx + 1) * 1.5) * 8;

        const baseWiggle = lastIdx % 2 === 0 ? 32 : 8;
        const wiggle = baseWiggle + (lastWaveOffset + bottomWaveOffset) / 2;
        const dy = bottomY - lastDotY;

        // On ne dessine le trait de fin que si le conteneur va au-delà du dernier point
        if (bottomY > lastDotY) {
          d += ` C ${wiggle} ${lastDotY + dy * 0.3}, ${wiggle} ${bottomY - dy * 0.3}, ${20 + bottomWaveOffset} ${bottomY}`;
        }
      }

      // Application des coordonnées directement dans le DOM pour des perfs à 60FPS
      if (pathRef.current && d) {
        pathRef.current.setAttribute("d", d);
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [height]);

  return (
    <div className="relative pl-[3.4rem] z-10" ref={containerRef}>
      <svg 
        className="absolute left-0 top-0 w-10 pointer-events-none drop-shadow-[0_0_8px_rgba(244,217,100,0.3)]" 
        style={{ height: height > 0 ? height : "100%" }}
        preserveAspectRatio="none" 
        viewBox={`0 0 40 ${height || 100}`}
      >
        <path 
          ref={pathRef}
          fill="none" 
          className="stroke-k-gold-deep" 
          strokeWidth="2" 
          strokeDasharray="6 8" 
          strokeLinecap="round" 
        />
      </svg>

      {JOURNEY.map((step, index) => (
        <div className="relative pb-14 last:pb-0" key={step.year}>
          {/* L'attribut will-change-transform force le GPU à prendre le relais pour la fluidité */}
          <span 
            ref={(el) => { dotsRef.current[index] = el; }}
            className="absolute left-[-3.4rem] top-1.5 w-3.25 h-3.25 rounded-full bg-k-gold shadow-[0_0_0_5px_rgba(244,217,100,0.25)] will-change-transform" 
          />
          
          <span className="block font-display text-[1.05rem] text-k-indigo mb-1">{step.year}</span>
          <h3 className="text-[1.2rem] mb-1.5 text-k-ink">{step.title}</h3>
          <p className="max-w-[44ch] text-k-ink/70 leading-relaxed text-sm md:text-base">{step.text}</p>
        </div>
      ))}
    </div>
  );
}
