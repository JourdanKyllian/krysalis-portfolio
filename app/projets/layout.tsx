import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio & Réalisations | Krysalis Studio',
  description: 'Explorez le portfolio de Krysalis Studio. Photos de chantiers, plans et modélisations 3D pour des intérieurs sur-mesure.',
};

export default function ProjetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
