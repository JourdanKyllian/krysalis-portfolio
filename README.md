# Krysalis Studio — prototype Next.js

Projet Next.js (App Router) minimal, prêt à déployer sur Vercel pour montrer le
rendu à la cliente sur une vraie URL.

## Tester en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000

## Déployer sur Vercel

**Option A — en une commande (le plus rapide) :**

```bash
npm install -g vercel
vercel
```

Répondre aux questions (créer un nouveau projet), Vercel détecte Next.js
automatiquement. À la fin, une URL de preview est générée immédiatement
(ex. `krysalis-studio-xxxx.vercel.app`) — c'est ce lien qu'on envoie à la
cliente. Pour republier après des modifications :

```bash
vercel --prod
```

**Option B — via GitHub :**

1. `git init && git add . && git commit -m "Prototype Krysalis"`
2. Créer un repo sur GitHub et y pousser (`git remote add origin ... && git push`)
3. Sur vercel.com → "Add New Project" → importer ce repo → Deploy
   (aucune configuration à toucher, Next.js est reconnu automatiquement)

Chaque futur `git push` republie automatiquement une nouvelle preview.

## Structure

```
app/
  layout.jsx      → layout racine (métadonnées, police)
  page.jsx         → monte le composant principal
  globals.css      → reset minimal
components/
  KrysalisApp.jsx  → tout le site (nav, pages, animations organiques)
```

Actuellement une seule route (`/`) qui gère "Accueil / Projets / À propos /
Contact" par état React (`useState`), comme dans le prototype précédent. Pour
de vraies URLs par page (meilleur pour le SEO), il suffira de découper
`KrysalisApp.jsx` en plusieurs fichiers `app/projets/page.jsx`,
`app/a-propos/page.jsx`, `app/contact/page.jsx` — la logique interne de
chaque page n'aura pas besoin de changer.

## Dépendances clés

- **framer-motion** — animations (transitions de page, apparitions au scroll,
  fond organique). Installée automatiquement par `npm install`.
- **next/font/google** — Poppins et Fraunces sont auto-hébergées et compilées
  au build par Next.js (pas d'appel réseau à Google Fonts au chargement, donc
  pas de flash de contenu non stylé).
- **lucide-react** — icônes.
