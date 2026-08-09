"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Mail, Phone, MapPin, Calendar, Camera, Ruler, Box } from "lucide-react";

/* ============================================================
   DONNÉES
   ============================================================ */

const NAV_ITEMS = [
  { id: "accueil", label: "Accueil" },
  { id: "projets", label: "Projets" },
  { id: "a-propos", label: "À propos" },
  { id: "contact", label: "Contact" },
];

// Pages dont la toute première section est sombre (fond chêne) : la nav,
// transparente tant qu'on n'a pas scrollé, doit y passer en texte clair
// pour rester lisible. Plus aucune page dans ce cas actuellement (la page
// Contact utilise désormais une carte sombre à l'intérieur d'une page claire).
const DARK_START_PAGES = new Set([]);

const PROJECTS = [
  { id: 1, title: "Villa Ocre", place: "Villa · Provence", category: "villa", type: "photo", swatch: "s1" },
  { id: 2, title: "Suite Marine", place: "Appartement · Marseille", category: "appartement", type: "3d", swatch: "s2" },
  { id: 3, title: "Atelier de Charme", place: "Atelier · Aix", category: "atelier", type: "plan", swatch: "s3" },
  { id: 4, title: "Mas des Lavandes", place: "Villa · Luberon", category: "villa", type: "3d", swatch: "s4" },
  { id: 5, title: "Éclat Bleu Nuit", place: "Appartement · Nice", category: "appartement", type: "photo", swatch: "s5" },
  { id: 6, title: "Le Cocon", place: "Cabinet · Avignon", category: "atelier", type: "plan", swatch: "s6" },
];

const TYPE_META = {
  photo: { label: "Photos", Icon: Camera },
  plan: { label: "Plans", Icon: Ruler },
  "3d": { label: "Vue 3D", Icon: Box },
};

const JOURNEY = [
  { year: "2018", title: "Premiers coups de crayon", text: "Naissance de l'atelier, autour de projets d'agencement pour des indépendants du sud de la France." },
  { year: "2021", title: "Vers le sur-mesure complet", text: "Élargissement à la décoration globale : mobilier, matières, lumière, jusqu'à la pose finale." },
  { year: "2024", title: "Naissance de Krysalis Studio", text: "Une nouvelle identité, pensée comme une métamorphose : celle de l'atelier, et celle de chaque intérieur confié." },
];

const VALUES = [
  { title: "Fluidité", text: "Des espaces pensés en mouvement, sans rigidité inutile." },
  { title: "Matière vraie", text: "Travertin, chêne, enduits naturels : on privilégie ce qui vieillit bien." },
  { title: "Sur mesure", text: "Chaque projet part d'une feuille blanche, jamais d'un modèle." },
];

// Variants du hero : le parent orchestre le décalage (staggerChildren), chaque
// enfant déclare seulement ses deux états ("hidden" / "visible") — il hérite
// du timing du parent sans le connaître.
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/* ============================================================
   STYLE GLOBAL
   ============================================================ */

const GlobalStyle = () => (
  <style>{`
    .krys-root {
      --k-ink:#02044d; --k-indigo:#010777; --k-cream:#fbefd0;
      --k-gold:#f4d964; --k-gold-deep:#efca5e; --k-stone:#f2e6c9;
      --k-oak:#241407; --k-oak-2:#180c04;
      --font-display: var(--font-fraunces), Georgia, serif;
      --font-body: var(--font-poppins), 'Segoe UI', sans-serif;
      --ease:cubic-bezier(0.22,1,0.36,1);
      --blob-1:42% 58% 63% 37% / 41% 44% 56% 59%;
      --blob-2:58% 42% 39% 61% / 55% 38% 62% 45%;
      --blob-3:50% 50% 38% 62% / 62% 42% 58% 38%;
      /* variantes plus douces : les valeurs ci-dessus, appliquées à une carte
         contenant du texte, rognaient le titre dans les coins (rayon trop
         profond par rapport au padding). Réservées aux cartes projets. */
      --blob-card-1:26% 22% 28% 20% / 22% 26% 20% 24%;
      --blob-card-2:22% 26% 20% 28% / 26% 20% 24% 22%;
      --blob-card-3:24% 20% 26% 22% / 20% 24% 22% 26%;
      font-family:var(--font-body); color:var(--k-ink); background:var(--k-cream);
      overflow-x:hidden;
    }
    .krys-root *{box-sizing:border-box;}
    .krys-root h1,.krys-root h2,.krys-root h3{font-family:var(--font-display); font-weight:500; line-height:1.06; margin:0 0 .5em; letter-spacing:-0.01em;}
    .krys-root p{line-height:1.7; margin:0 0 1em;}
    .krys-container{max-width:1180px; margin:0 auto; padding:0 6vw;}
    .krys-section{position:relative; padding:6.5rem 0; overflow:hidden;}

    @media (prefers-reduced-motion: reduce){ .krys-root *{animation-duration:.001ms !important; transition-duration:.001ms !important;} }

    /* --- textures --- */
    .tex-travertine{ background-color:var(--k-cream); background-image:
      radial-gradient(ellipse 60% 40% at 15% 20%, rgba(239,202,94,.16) 0%, transparent 60%),
      radial-gradient(ellipse 70% 50% at 60% 85%, rgba(244,217,100,.14) 0%, transparent 60%),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E"); }
    .tex-oak{ background-color:var(--k-oak); color:var(--k-stone); background-image:
      repeating-linear-gradient(100deg, rgba(244,217,100,.05) 0px, transparent 2px, transparent 14px, rgba(0,0,0,.15) 16px),
      linear-gradient(160deg, var(--k-oak) 0%, var(--k-oak-2) 100%),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012 0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E"); }

    /* --- fond organique animé --- */
    .ambient{ position:absolute; inset:0; overflow:hidden; z-index:-1; pointer-events:none; }
    .ambient span{ position:absolute; border-radius:50%; filter:blur(55px); }
    .ambient.on-light span{ mix-blend-mode:multiply; opacity:.55; }
    .ambient.on-dark span{ mix-blend-mode:screen; opacity:.5; }
    .ambient .b1{ width:38vw; height:38vw; left:-8%; top:-12%; background:var(--k-gold); }
    .ambient .b2{ width:30vw; height:30vw; right:-6%; top:20%; background:var(--k-indigo); }
    .ambient .b3{ width:26vw; height:26vw; left:20%; bottom:-14%; background:var(--k-gold-deep); }

    /* --- nav --- */
    .krys-nav{ position:fixed; top:0; left:0; right:0; z-index:999; padding:22px 0; transition:padding .4s var(--ease), background .4s var(--ease), box-shadow .4s var(--ease); }
    .krys-nav.scrolled{ padding:12px 0; background:rgba(251,239,208,.9); backdrop-filter:blur(10px); box-shadow:0 8px 30px -12px rgba(2,4,77,.15); }
    .krys-nav .krys-container{ display:flex; align-items:center; justify-content:space-between; }
    .nav-logo{ display:flex; align-items:baseline; gap:8px; background:none; border:none; cursor:pointer; padding:0; }
    .nav-logo .word{ font-family:var(--font-display); font-size:1.6rem; color:var(--k-ink); }
    .nav-logo .word em{ font-style:normal; color:var(--k-gold-deep); }
    .nav-logo .studio{ font-size:.62rem; letter-spacing:.3em; text-transform:uppercase; color:var(--k-gold-deep); font-weight:600; }
    .nav-links{ display:flex; gap:2.4rem; list-style:none; margin:0; padding:0; }
    .nav-links button{ background:none; border:none; cursor:pointer; font-family:var(--font-body); font-size:.8rem; font-weight:500; letter-spacing:.04em; color:var(--k-ink); padding:0 0 6px; position:relative; }
    .nav-links button svg.underline{ position:absolute; left:0; bottom:-3px; width:100%; height:8px; overflow:visible; }
    .nav-links button path{ fill:none; stroke:var(--k-gold-deep); stroke-width:2; stroke-linecap:round; stroke-dasharray:60; stroke-dashoffset:60; transition:stroke-dashoffset .5s var(--ease); }
    .nav-links button:hover path, .nav-links button.active path{ stroke-dashoffset:0; }
    .nav-links button.active{ color:var(--k-indigo); }
    .nav-cta{ font-size:.72rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; padding:.85em 1.6em; background:var(--k-ink); color:var(--k-cream); border:none; cursor:pointer; border-radius:var(--blob-1); transition:border-radius .6s var(--ease), transform .3s var(--ease), background .3s; }
    .nav-cta:hover{ border-radius:var(--blob-2); transform:translateY(-2px); background:var(--k-indigo); }
    .burger{ display:none; background:none; border:none; cursor:pointer; padding:8px; color:var(--k-ink); align-items:center; justify-content:center; }

    /* nav sur fond sombre (avant le scroll, ex. page Contact) : texte clair pour rester lisible */
    .krys-nav.on-dark .nav-logo .word{ color:var(--k-stone); }
    .krys-nav.on-dark .nav-links button{ color:var(--k-stone); }
    .krys-nav.on-dark .nav-links button.active{ color:var(--k-gold); }
    .krys-nav.on-dark .nav-cta{ background:var(--k-gold); color:var(--k-ink); }
    .krys-nav.on-dark .nav-cta:hover{ background:var(--k-gold-deep); }
    .krys-nav.on-dark .burger{ color:var(--k-stone); }

    @media (max-width:860px){
      .nav-links, .nav-cta.desktop{ display:none; }
      .burger{ display:flex; }
      .drawer{ position:fixed; inset:0; background:var(--k-cream); display:flex; flex-direction:column; justify-content:center; align-items:flex-start; padding:0 10vw; gap:1.5rem; z-index:998; transform:translateY(-100%); transition:transform .55s var(--ease); }
      .drawer.open{ transform:translateY(0); }
      .drawer button{ background:none; border:none; font-family:var(--font-display); font-size:2.4rem; color:var(--k-ink); cursor:pointer; }
    }

    /* --- hero (recentré) --- */
    .krys-hero{ position:relative; min-height:92vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:9rem 1rem 4rem; }
    .hero-eyebrow{ display:inline-flex; align-items:center; gap:.6em; font-size:.72rem; letter-spacing:.25em; text-transform:uppercase; color:var(--k-indigo); font-weight:600; margin-bottom:1.4rem; }
    .hero-eyebrow::before, .hero-eyebrow::after{ content:''; width:22px; height:1px; background:var(--k-gold-deep); }
    .krys-hero h1{ font-size:clamp(2.6rem,6vw,4.8rem); max-width:14ch; }
    .hero-lede{ max-width:46ch; font-size:1.08rem; color:rgba(2,4,77,.72); margin-top:1.1rem; }
    .hero-actions{ display:flex; gap:1rem; margin-top:2.2rem; flex-wrap:wrap; justify-content:center; }
    .btn{ display:inline-flex; align-items:center; gap:.6em; padding:1em 2.1em; font-size:.85rem; font-weight:600; letter-spacing:.03em; border-radius:var(--blob-1); transition:border-radius .7s var(--ease), transform .35s var(--ease), background .3s, color .3s; cursor:pointer; border:none; }
    .btn-primary{ background:var(--k-ink); color:var(--k-cream); }
    .btn-primary:hover{ border-radius:var(--blob-3); transform:translateY(-3px) rotate(-1deg); background:var(--k-indigo); }
    .btn-ghost{ background:transparent; color:var(--k-ink); border:1.5px solid rgba(2,4,77,.25); }
    .btn-ghost:hover{ border-radius:var(--blob-2); border-color:var(--k-ink); transform:translateY(-3px); }
    .hero-metrics{ display:flex; gap:2.4rem; margin-top:3rem; padding-top:1.6rem; border-top:1px solid rgba(2,4,77,.15); }
    .hero-metrics .num{ font-family:var(--font-display); font-size:1.8rem; }
    .hero-metrics .lbl{ font-size:.66rem; letter-spacing:.1em; text-transform:uppercase; color:rgba(2,4,77,.55); margin-top:.2rem; }
    .hero-blob-wrap{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:-1; pointer-events:none; }
    .hero-blob-wrap svg{ width:min(70vw,640px); height:min(70vw,640px); opacity:.85; }
    .hero-blob-glow{ position:absolute; width:60vw; height:60vw; max-width:700px; max-height:700px; background:radial-gradient(circle, rgba(244,217,100,.45), transparent 65%); filter:blur(40px); }

    /* --- section head --- */
    .eyebrow{ font-size:.7rem; letter-spacing:.25em; text-transform:uppercase; color:var(--k-gold-deep); font-weight:700; margin-bottom:.8rem; display:block; }
    .on-oak .eyebrow{ color:var(--k-gold); }
    .section-head{ max-width:640px; margin-bottom:3rem; position:relative; z-index:1; }
    .krys-section h2{ font-size:clamp(1.9rem,3.4vw,2.8rem); }

    /* --- grille / cartes --- */
    .grid{ display:grid; gap:2.2rem; position:relative; z-index:1; }
    .grid-3{ grid-template-columns:repeat(3,1fr); }
    .grid-2{ grid-template-columns:repeat(2,1fr); }
    @media (max-width:900px){ .grid-3,.grid-2{ grid-template-columns:1fr; } }

    .blob-card{ position:relative; overflow:hidden; border-radius:var(--blob-card-1); transition:border-radius .8s var(--ease), transform .5s var(--ease); aspect-ratio:4/5; display:flex; align-items:flex-end; cursor:pointer; border:none; padding:0; text-align:left; }
    .blob-card:nth-child(2n){ border-radius:var(--blob-card-2); }
    .blob-card:nth-child(3n){ border-radius:var(--blob-card-3); }
    .blob-card:hover{ border-radius:var(--blob-card-3); transform:translateY(-6px); }
    .blob-card .swatch{ position:absolute; inset:0; }
    .blob-card .tint{ position:absolute; inset:0; background:linear-gradient(0deg, rgba(2,4,77,.78) 0%, transparent 55%); }
    .blob-card .info{ position:relative; padding:1.2rem 1.9rem 2rem; color:var(--k-cream); width:100%; }
    .blob-card .type-badge{ position:absolute; top:1rem; right:1rem; display:flex; align-items:center; gap:.35em; background:rgba(2,4,77,.55); backdrop-filter:blur(4px); color:var(--k-cream); font-size:.66rem; letter-spacing:.08em; text-transform:uppercase; padding:.4em .7em; border-radius:999px; }
    .blob-card .tag{ font-size:.64rem; letter-spacing:.16em; text-transform:uppercase; color:var(--k-gold); display:block; margin-bottom:.3rem; }
    .blob-card h3{ font-size:1.3rem; margin:0; color:var(--k-cream); }

    .s1{ background:radial-gradient(circle at 30% 20%, #efca5e, #b98a2e 70%); }
    .s2{ background:radial-gradient(circle at 70% 30%, #4a5aa8, #02044d 75%); }
    .s3{ background:radial-gradient(circle at 40% 70%, #f4d964, #7a5a20 80%); }
    .s4{ background:radial-gradient(circle at 60% 40%, #3c2413, #150b04 80%); }
    .s5{ background:radial-gradient(circle at 50% 50%, #010777, #02044d 80%); }
    .s6{ background:radial-gradient(circle at 35% 65%, #fbefd0, #d9b877 85%); }

    /* --- filtres --- */
    .filters{ display:flex; flex-wrap:wrap; gap:.7rem; margin-bottom:2.6rem; position:relative; z-index:1; }
    .filter-pill{ padding:.6em 1.3em; font-size:.76rem; font-weight:500; border:1.5px solid rgba(2,4,77,.2); border-radius:999px; background:transparent; cursor:pointer; transition:all .35s var(--ease); }
    .filter-pill:hover{ border-color:var(--k-ink); }
    .filter-pill.active{ background:var(--k-ink); color:var(--k-cream); border-color:var(--k-ink); }

    /* --- timeline --- */
    .journey{ position:relative; padding-left:3.4rem; z-index:1; }
    .journey svg.path{ position:absolute; left:0; top:0; width:40px; height:100%; }
    .journey svg.path path{ fill:none; stroke:var(--k-gold-deep); stroke-width:2; stroke-dasharray:6 8; stroke-linecap:round; }
    .journey-step{ position:relative; padding-bottom:3.6rem; }
    .journey-step:last-child{ padding-bottom:0; }
    .journey-step .dot{ position:absolute; left:-3.4rem; top:.35rem; width:13px; height:13px; border-radius:50%; background:var(--k-gold); box-shadow:0 0 0 5px rgba(244,217,100,.25); }
    .journey-step .year{ font-family:var(--font-display); font-size:1.05rem; color:var(--k-indigo); display:block; margin-bottom:.25rem; }
    .journey-step h3{ font-size:1.2rem; margin-bottom:.35rem; }
    .journey-step p{ max-width:44ch; color:rgba(2,4,77,.7); }

    /* --- contact --- */
    .form-field{ margin-bottom:1.5rem; position:relative; z-index:1; }
    .form-field label{ display:block; font-size:.7rem; letter-spacing:.1em; text-transform:uppercase; font-weight:600; margin-bottom:.5rem; color:var(--k-stone); }
    .form-field input,.form-field textarea{ width:100%; padding:.85em 1.1em; font-family:var(--font-body); font-size:.94rem; background:rgba(251,239,208,.06); border:1.5px solid rgba(244,217,100,.25); border-radius:16px; color:var(--k-stone); transition:border-color .3s, border-radius .5s var(--ease); }
    .form-field input::placeholder,.form-field textarea::placeholder{ color:rgba(242,230,201,.4); }
    .form-field input:focus,.form-field textarea:focus{ outline:none; border-color:var(--k-gold); border-radius:26px; }
    .form-field textarea{ resize:vertical; min-height:130px; }
    .contact-info{ display:flex; flex-direction:column; gap:1.4rem; position:relative; z-index:1; }
    .contact-info .item{ display:flex; gap:.8em; align-items:flex-start; }
    .contact-info .item .k{ font-size:.66rem; letter-spacing:.14em; text-transform:uppercase; color:var(--k-gold); display:block; margin-bottom:.25rem; }
    .contact-info .item .v{ font-family:var(--font-display); font-size:1.2rem; color:var(--k-stone); }

    /* carte contact : le chêne sombre reste contenu dans une carte plutôt que
       toute la page, pour ne pas trancher trop fort avec le reste du site */
    .contact-card{ position:relative; overflow:hidden; border-radius:28px 44px 28px 44px; padding:clamp(1.8rem,4.5vw,3.2rem); box-shadow:0 40px 70px -30px rgba(2,4,77,.35); }

    /* --- page header générique --- */
    .page-header{ padding:9.5rem 0 3.5rem; position:relative; z-index:1; }
    .page-header h1{ font-size:clamp(2.2rem,4.6vw,3.4rem); }
    .page-header p{ max-width:52ch; font-size:1.02rem; color:rgba(2,4,77,.7); }
    .page-header.centered{ text-align:center; }
    .page-header.centered p{ margin-left:auto; margin-right:auto; }
    .page-header.centered .eyebrow{ display:flex; justify-content:center; align-items:center; gap:.6em; }
    .page-header.centered .eyebrow::before, .page-header.centered .eyebrow::after{ content:''; width:22px; height:1px; background:var(--k-gold-deep); }

    /* --- footer --- */
    .krys-footer{ padding:4rem 0 2.2rem; position:relative; z-index:1; }
    .krys-footer .krys-container{ display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:1.8rem; }
    .footer-word{ font-family:var(--font-display); font-size:2.2rem; color:var(--k-stone); }
    .footer-links{ display:flex; gap:1.5rem; list-style:none; padding:0; font-size:.8rem; }
    .footer-links button{ background:none; border:none; cursor:pointer; color:rgba(242,230,201,.75); font-family:var(--font-body); font-size:.8rem; }
    .footer-links button:hover{ color:var(--k-gold); }
    .footer-bottom{ margin-top:2.4rem; padding-top:1.4rem; border-top:1px solid rgba(244,217,100,.15); font-size:.7rem; color:rgba(242,230,201,.5); position:relative; z-index:1; }

    a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible{ outline:2.5px solid var(--k-indigo); outline-offset:3px; }
  `}</style>
);

/* ============================================================
   FOND ORGANIQUE ANIMÉ — Framer Motion, mouvement continu en boucle
   ============================================================ */
const AMBIENT_BLOBS = [
  { cls: "b1", x: [0, 70, -40, 0], y: [0, -55, 35, 0], scale: [1, 1.15, 0.94, 1], duration: 20 },
  { cls: "b2", x: [0, -80, 50, 0], y: [0, 45, -60, 0], scale: [1, 0.9, 1.12, 1], duration: 25 },
  { cls: "b3", x: [0, 55, -65, 0], y: [0, -45, 30, 0], scale: [1, 1.2, 0.92, 1], duration: 17 },
];

function Ambient({ variant = "light" }) {
  return (
    <div className={`ambient ${variant === "dark" ? "on-dark" : "on-light"}`} aria-hidden="true">
      {AMBIENT_BLOBS.map((b) => (
        <motion.span
          key={b.cls}
          className={b.cls}
          animate={{ x: b.x, y: b.y, scale: b.scale }}
          transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   REVEAL — apparition douce au scroll (whileInView)
   ============================================================ */
function Reveal({ children, delay = 0, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   BLOB GÉNÉRATIF DU HERO (SVG + rAF, sans librairie)
   ============================================================ */
function HeroBlob() {
  const pathRef = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !pathRef.current) return;
    const size = 400, cx = size / 2, cy = size / 2, baseR = size * 0.34, points = 10;
    let raf, t = 0, lastY = window.scrollY, boost = 0;

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      boost = Math.min(boost + delta * 0.6, 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const build = (time, amp) => {
      const pts = [];
      for (let i = 0; i < points; i++) {
        const angle = (Math.PI * 2 * i) / points;
        const n = Math.sin(angle * 3 + time) * 0.5 + Math.sin(angle * 5 - time * 1.3) * 0.3 + Math.sin(angle * 2 + time * 0.6) * 0.2;
        const r = baseR + n * amp;
        pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
      }
      let d = `M ${pts[0][0]} ${pts[0][1]} `;
      for (let i = 0; i < points; i++) {
        const p0 = pts[i], p1 = pts[(i + 1) % points];
        d += `Q ${p0[0]} ${p0[1]} ${(p0[0] + p1[0]) / 2} ${(p0[1] + p1[1]) / 2} `;
      }
      return d + "Z";
    };

    const tick = () => {
      t += 0.0032 + boost * 0.00025;
      boost *= 0.94;
      if (pathRef.current) pathRef.current.setAttribute("d", build(t, size * 0.05 + boost * 0.9));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <svg viewBox="0 0 400 400">
      <defs>
        <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d964" />
          <stop offset="55%" stopColor="#efca5e" />
          <stop offset="100%" stopColor="#02044d" />
        </linearGradient>
      </defs>
      <path ref={pathRef} fill="url(#blobGradient)" />
    </svg>
  );
}

/* ============================================================
   FRISE "PARCOURS" (à propos) — chemin sinueux entre les étapes
   ============================================================ */
function Journey() {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);

  const draw = useCallback(() => {
    const wrap = wrapRef.current, svg = svgRef.current;
    if (!wrap || !svg) return;
    const height = wrap.offsetHeight;
    svg.setAttribute("viewBox", `0 0 40 ${height}`);
    let d = "M 20 8", y = 8;
    const segment = height / JOURNEY.length;
    JOURNEY.forEach((_, i) => {
      const nextY = segment * (i + 1) - segment * 0.25;
      const wiggle = i % 2 === 0 ? 32 : 8;
      d += ` C ${wiggle} ${y + segment * 0.3}, ${wiggle} ${nextY - segment * 0.3}, 20 ${nextY}`;
      y = nextY;
    });
    let path = svg.querySelector("path");
    if (!path) { path = document.createElementNS("http://www.w3.org/2000/svg", "path"); svg.appendChild(path); }
    path.setAttribute("d", d);
  }, []);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  return (
    <div className="journey" ref={wrapRef}>
      <svg className="path" ref={svgRef} preserveAspectRatio="none"><path /></svg>
      {JOURNEY.map((step) => (
        <div className="journey-step" key={step.year}>
          <span className="dot" />
          <span className="year">{step.year}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function Nav({ page, goTo }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const handleGo = (id) => { goTo(id); setOpen(false); };
  const onDark = !scrolled && DARK_START_PAGES.has(page);

  return (
    <>
      <nav className={`krys-nav ${scrolled ? "scrolled" : ""} ${onDark ? "on-dark" : ""}`}>
        <div className="krys-container">
          <button className="nav-logo" onClick={() => handleGo("accueil")}>
            <span className="word">Kry<em>s</em>alis</span>
            <span className="studio">Studio</span>
          </button>
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button className={page === item.id ? "active" : ""} onClick={() => handleGo(item.id)}>
                  {item.label}
                  <svg className="underline" viewBox="0 0 60 8"><path d="M2 5 Q 15 1 30 5 T 58 5" /></svg>
                </button>
              </li>
            ))}
          </ul>
          <button className="nav-cta desktop" onClick={() => handleGo("contact")}>Démarrer un projet</button>
          <button className="burger" aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>
      <div className={`drawer ${open ? "open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <button key={item.id} onClick={() => handleGo(item.id)}>{item.label}</button>
        ))}
      </div>
    </>
  );
}

/* ============================================================
   PAGES
   ============================================================ */
function AccueilPage({ goTo }) {
  return (
    <>
      <header className="krys-hero tex-travertine">
        <Ambient variant="light" />
        <div className="hero-blob-wrap"><div className="hero-blob-glow" /><HeroBlob /></div>
        <motion.div variants={heroContainer} initial="hidden" animate="visible" style={{ display: "contents" }}>
          <motion.span variants={heroItem} className="hero-eyebrow">Décoration & agencement intérieur sur mesure</motion.span>
          <motion.h1 variants={heroItem}>Des intérieurs qui respirent</motion.h1>
          <motion.p variants={heroItem} className="hero-lede">Krysalis Studio imagine des espaces vivants, façonnés dans la matière et la lumière du sud. Chaque projet est une métamorphose, jamais un copier-coller.</motion.p>
          <motion.div variants={heroItem} className="hero-actions">
            <button className="btn btn-primary" onClick={() => goTo("projets")}>Voir les réalisations</button>
            <button className="btn btn-ghost" onClick={() => goTo("contact")}>Prendre rendez-vous <ArrowRight size={15} /></button>
          </motion.div>
          <motion.div variants={heroItem} className="hero-metrics">
            <div><div className="num">60+</div><div className="lbl">Intérieurs transformés</div></div>
            <div><div className="num">8</div><div className="lbl">Années d'expérience</div></div>
            <div><div className="num">100%</div><div className="lbl">Projets sur mesure</div></div>
          </motion.div>
        </motion.div>
      </header>

      <section className="krys-section on-oak tex-oak">
        <Ambient variant="dark" />
        <div className="krys-container">
          <Reveal className="section-head">
            <span className="eyebrow">Notre approche</span>
            <h2>Du croquis au geste, une transformation continue</h2>
            <p style={{ color: "rgba(242,230,201,.75)" }}>Comme une chrysalide, chaque pièce traverse plusieurs états avant de trouver sa forme définitive. Nous accompagnons cette mue, de l'esquisse à la pose finale.</p>
          </Reveal>
          <Reveal className="grid grid-3" delay={0.1}>
            <div><span className="eyebrow">01 · Écouter</span><h3 style={{ color: "var(--k-stone)", fontSize: "1.25rem" }}>L'usage avant tout</h3><p style={{ color: "rgba(242,230,201,.7)" }}>Chaque espace raconte une façon de vivre. On part de vos habitudes, jamais d'un catalogue.</p></div>
            <div><span className="eyebrow">02 · Dessiner</span><h3 style={{ color: "var(--k-stone)", fontSize: "1.25rem" }}>Des courbes qui respirent</h3><p style={{ color: "rgba(242,230,201,.7)" }}>Peu d'angles droits, beaucoup de mouvement : nos plans cherchent la fluidité du vivant.</p></div>
            <div><span className="eyebrow">03 · Matérialiser</span><h3 style={{ color: "var(--k-stone)", fontSize: "1.25rem" }}>Des matières vraies</h3><p style={{ color: "rgba(242,230,201,.7)" }}>Travertin, chêne massif, enduits à la chaux : des matériaux qui vieillissent avec caractère.</p></div>
          </Reveal>
        </div>
      </section>

      <section className="krys-section tex-travertine">
        <Ambient variant="light" />
        <div className="krys-container">
          <Reveal className="section-head">
            <span className="eyebrow">Réalisations récentes</span>
            <h2>Trois intérieurs, trois métamorphoses</h2>
          </Reveal>
          <Reveal className="grid grid-3" delay={0.1}>
            {PROJECTS.slice(0, 3).map((p) => <ProjectCard key={p.id} project={p} onClick={() => goTo("projets")} />)}
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ProjectCard({ project, onClick }) {
  const meta = TYPE_META[project.type];
  return (
    <button className="blob-card" onClick={onClick}>
      <div className={`swatch ${project.swatch}`} />
      <div className="tint" />
      <div className="type-badge"><meta.Icon size={12} /> {meta.label}</div>
      <div className="info"><span className="tag">{project.place}</span><h3>{project.title}</h3></div>
    </button>
  );
}

function ProjetsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = PROJECTS.filter((p) => filter === "all" || p.category === filter);

  return (
    <section className="krys-section tex-travertine" style={{ paddingTop: 0 }}>
      <Ambient variant="light" />
      <div className="krys-container">
        <div className="page-header centered" style={{ paddingBottom: "2.5rem" }}>
          <span className="eyebrow">Portfolio</span>
          <h1>Des intérieurs en pleine mue</h1>
          <p>Photos, plans et modélisations 3D : chaque projet est documenté de l'esquisse à la réalisation. Filtrez par type d'espace pour explorer les réalisations.</p>
        </div>
        <Reveal className="filters">
          {[{ id: "all", label: "Tout voir" }, { id: "villa", label: "Villas" }, { id: "appartement", label: "Appartements" }, { id: "atelier", label: "Ateliers & pros" }].map((f) => (
            <button key={f.id} className={`filter-pill ${filter === f.id ? "active" : ""}`} onClick={() => setFilter(f.id)}>{f.label}</button>
          ))}
        </Reveal>
        <Reveal className="grid grid-3" delay={0.1}>
          {filtered.map((p) => <ProjectCard key={p.id} project={p} onClick={() => {}} />)}
        </Reveal>
      </div>
    </section>
  );
}

function AProposPage() {
  return (
    <>
      <section className="krys-section tex-travertine">
        <Ambient variant="light" />
        <div className="krys-container">
          <div className="page-header centered" style={{ paddingBottom: "3rem" }}>
            <span className="eyebrow">L'atelier</span>
            <h1>Une philosophie de la transformation</h1>
            <p>Krysalis puise son nom dans la chrysalide : cet état intermédiaire où la forme se réinvente. C'est exactement ce que nous cherchons à faire de vos espaces.</p>
          </div>
          <Reveal className="grid grid-2" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow">Notre parcours</span>
              <h3 style={{ fontSize: "1.7rem" }}>D'un atelier de couture d'espaces à un studio de décoration</h3>
              <p>Krysalis est né d'une conviction simple : un intérieur réussi ne se plaque pas, il se laisse pousser. Nous dessinons chaque projet comme une trajectoire, pas comme un catalogue figé.</p>
            </div>
            <Journey />
          </Reveal>
        </div>
      </section>

      <section className="krys-section on-oak tex-oak">
        <Ambient variant="dark" />
        <div className="krys-container">
          <Reveal className="section-head">
            <span className="eyebrow">Nos valeurs</span>
            <h2>Ce qui guide chaque projet</h2>
          </Reveal>
          <Reveal className="grid grid-3" delay={0.1}>
            {VALUES.map((v) => (
              <div key={v.title}>
                <h3 style={{ color: "var(--k-stone)", fontSize: "1.25rem" }}>{v.title}</h3>
                <p style={{ color: "rgba(242,230,201,.7)" }}>{v.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <section className="krys-section tex-travertine">
      <Ambient variant="light" />
      <div className="krys-container">
        <div className="page-header centered" style={{ paddingBottom: "3rem" }}>
          <span className="eyebrow">Parlons-en</span>
          <h1>Racontez-nous votre projet</h1>
          <p>Une villa à transformer, un appartement à réinventer, un atelier à agencer : chaque échange commence par vos envies.</p>
        </div>

        <Reveal className="contact-card tex-oak">
          <Ambient variant="dark" />
          <div className="grid grid-2">
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="form-field"><label htmlFor="name">Nom & prénom</label><input id="name" type="text" placeholder="Votre nom" /></div>
              <div className="form-field"><label htmlFor="email">E-mail</label><input id="email" type="email" placeholder="vous@exemple.com" /></div>
              <div className="form-field"><label htmlFor="type">Type de projet</label><input id="type" type="text" placeholder="Villa, appartement, atelier..." /></div>
              <div className="form-field"><label htmlFor="message">Votre projet en quelques mots</label><textarea id="message" placeholder="Décrivez l'espace, vos envies, vos délais..." /></div>
              <button type="submit" className="btn btn-primary" style={{ background: "var(--k-gold)", color: "var(--k-ink)" }}>
                {sent ? "Message envoyé ✓" : "Envoyer le message"}
              </button>
            </form>
            <div className="contact-info">
              <div className="item"><MapPin size={18} color="#f4d964" /><div><span className="k">Atelier</span><span className="v">Aix-en-Provence & environs</span></div></div>
              <div className="item"><Mail size={18} color="#f4d964" /><div><span className="k">E-mail</span><span className="v">bonjour@krysalis-studio.fr</span></div></div>
              <div className="item"><Phone size={18} color="#f4d964" /><div><span className="k">Téléphone</span><span className="v">06 00 00 00 00</span></div></div>
              <div className="item"><Calendar size={18} color="#f4d964" /><div><span className="k">Disponibilité</span><span className="v">Sur rendez-vous, du mardi au samedi</span></div></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ goTo }) {
  return (
    <footer className="krys-footer tex-oak">
      <div className="krys-container">
        <div>
          <span className="footer-word">Krysalis</span>
          <p style={{ color: "rgba(242,230,201,.6)", maxWidth: "32ch", marginTop: ".7rem" }}>Décoration & agencement intérieur sur mesure.</p>
        </div>
        <ul className="footer-links">
          {NAV_ITEMS.map((item) => <li key={item.id}><button onClick={() => goTo(item.id)}>{item.label}</button></li>)}
        </ul>
      </div>
      <div className="krys-container footer-bottom">© 2026 Krysalis Studio — Tous droits réservés</div>
    </footer>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function KrysalisApp() {
  const [page, setPage] = useState("accueil");

  const goTo = (id) => {
    setPage(id);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="krys-root">
      <GlobalStyle />
      <Nav page={page} goTo={goTo} />
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {page === "accueil" && <AccueilPage goTo={goTo} />}
          {page === "projets" && <ProjetsPage />}
          {page === "a-propos" && <AProposPage />}
          {page === "contact" && <ContactPage />}
        </motion.div>
      </AnimatePresence>
      <Footer goTo={goTo} />
    </div>
  );
}
