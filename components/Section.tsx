import { ReactNode } from "react";
import Ambient from "@/components/Ambient";

interface SectionProps {
  children: ReactNode;
  theme?: "light" | "dark";
  className?: string; // Pour les espacements (ex: pt-36 pb-24 min-h-screen)
  containerClassName?: string; // Pour le comportement interne (ex: grid, flex)
  id?: string;
}

export default function Section({ children, theme = "light", className = "py-24", containerClassName = "", id }: SectionProps) {
  const bgClass = theme === "dark" ? "tex-oak" : "tex-travertine";

  return (
    <section id={id} className={`relative overflow-visible z-10 ${bgClass} ${className}`}>
      {/* La lumière est gérée en arrière-plan de manière autonome */}
      <Ambient variant={theme} />
      
      {/* Le conteneur de contenu reste bien au-dessus de la lumière (z-10) */}
      <div className={`relative z-10 max-w-295 mx-auto px-[6vw] w-full ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
