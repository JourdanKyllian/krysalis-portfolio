import type { Metadata } from "next";
import { Poppins, Fraunces } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["400"], variable: "--font-bely", display: "swap" });

export const metadata: Metadata = {
  title: "Krysalis Studio — Décoration & agencement intérieur sur mesure",
  description: "Krysalis Studio imagine des espaces vivants, façonnés dans la matière et la lumière du sud.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${poppins.variable} ${fraunces.variable} scroll-smooth`}>
      <body className="flex flex-col min-h-screen">
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
