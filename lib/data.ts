import { ProjectData } from "@/components/ProjectCard";

export const PROJECTS: ProjectData[] = [
  { id: 1, title: "Villa Ocre", place: "Villa · Provence", category: "villa", type: "photo", swatch: "radial-gradient(circle at 30% 20%, #efca5e, #b98a2e 70%)" },
  { id: 2, title: "Suite Marine", place: "Appartement · Marseille", category: "appartement", type: "3d", swatch: "radial-gradient(circle at 70% 30%, #4a5aa8, #02044d 75%)" },
  { id: 3, title: "Atelier de Charme", place: "Atelier · Aix", category: "atelier", type: "plan", swatch: "radial-gradient(circle at 40% 70%, #f4d964, #7a5a20 80%)" },
  { id: 4, title: "Mas des Lavandes", place: "Villa · Luberon", category: "villa", type: "3d", swatch: "radial-gradient(circle at 60% 40%, #3c2413, #150b04 80%)" },
  { id: 5, title: "Éclat Bleu Nuit", place: "Appartement · Nice", category: "appartement", type: "photo", swatch: "radial-gradient(circle at 50% 50%, #010777, #02044d 80%)" },
  { id: 6, title: "Le Cocon", place: "Cabinet · Avignon", category: "atelier", type: "plan", swatch: "radial-gradient(circle at 35% 65%, #fbefd0, #d9b877 85%)" },
];

export const FILTERS = [
  { id: "all", label: "Tout voir" },
  { id: "villa", label: "Villas" },
  { id: "appartement", label: "Appartements" },
  { id: "atelier", label: "Ateliers & pros" }
];
