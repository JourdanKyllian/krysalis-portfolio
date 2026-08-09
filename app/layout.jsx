import { Poppins, Fraunces } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata = {
  title: "Krysalis Studio — Décoration & agencement intérieur sur mesure",
  description:
    "Krysalis Studio imagine des intérieurs sur mesure, entre matières brutes et courbes organiques.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${poppins.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
