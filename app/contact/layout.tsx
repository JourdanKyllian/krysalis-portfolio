import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Devis | Krysalis Studio',
  description: 'Un projet de rénovation, de décoration ou d\'aménagement sur mesure ? Prenez rendez-vous avec Krysalis Studio.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
