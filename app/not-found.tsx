"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wreck-root">
      <style>{`
        nav, footer { display: none !important; }
        
        .wreck-root{
          --k-ink:#02044d; --k-indigo:#010777; --k-cream:#fbefd0;
          --k-gold:#f4d964; --k-gold-deep:#efca5e; --k-stone:#f2e6c9;
          --font-display: var(--font-fraunces), Georgia, serif;
          --font-body: var(--font-poppins), 'Segoe UI', sans-serif;
          position:relative; min-height:100vh;
          background: linear-gradient(180deg, #02044d 0%, #171d63 45%, #232d78 68%, #010777 100%);
          color:var(--k-stone); font-family:var(--font-body);
          display:flex; flex-direction:column;
        }
        .wreck-root *{ box-sizing:border-box; }

        .wreck-copy{
          flex:1 1 auto; position:relative; z-index:2;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          text-align:center; padding:2rem; max-width:640px; margin:0 auto;
        }
        .wreck-eyebrow{
          display:inline-flex; align-items:center; gap:.6em;
          font-size:.72rem; letter-spacing:.25em; text-transform:uppercase;
          color:var(--k-gold); font-weight:600; margin-bottom:1.2rem;
        }
        .wreck-eyebrow::before, .wreck-eyebrow::after{ content:''; width:22px; height:1px; background:var(--k-gold-deep); }
        .wreck-copy h1{
          font-family:var(--font-display); font-weight:500; line-height:1.1;
          font-size:clamp(2rem, 5vw, 3.1rem); margin:0 0 .55em; color:var(--k-stone);
        }
        .wreck-copy p{
          max-width:40ch; color:rgba(242,230,201,.8); font-size:1.02rem;
          line-height:1.7; margin:0 0 2rem;
        }
        .wreck-btn{
          display:inline-flex; align-items:center; gap:.6em;
          padding:1em 2.1em; font-size:.85rem; font-weight:600; letter-spacing:.03em;
          background:var(--k-gold); color:var(--k-ink); text-decoration:none;
          border-radius:42% 58% 63% 37% / 41% 44% 56% 59%;
          transition:border-radius .7s cubic-bezier(0.22,1,0.36,1), transform .35s cubic-bezier(0.22,1,0.36,1), background .3s;
        }
        .wreck-btn:hover{ border-radius:50% 50% 38% 62% / 62% 42% 58% 38%; transform:translateY(-3px) rotate(-1deg); background:var(--k-gold-deep); }

        /* --- bande illustration, toujours SOUS le texte, jamais en superposition --- */
        .wreck-scene{ position:relative; width:100%; height:clamp(200px, 36vh, 380px); flex:0 0 auto; }
        .wreck-scene svg{ position:absolute; inset:0; width:100%; height:100%; display:block; }
      `}</style>

      <div className="wreck-copy">
        <motion.span
          className="wreck-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          Erreur 404
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.75, ease: [0.22, 1, 0.36, 1] }}
        >
          Cette page a fait naufrage
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Il ne reste ici que du sable et une coque échouée. Le reste du site, lui, navigue très bien.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/" className="wreck-btn">Retour à bon port</Link>
        </motion.div>
      </div>

      <div className="wreck-scene">
        <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#efca5e" />
              <stop offset="100%" stopColor="#a97c2a" />
            </linearGradient>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff6d8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#f4d964" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a56c4" stopOpacity="0" />
              <stop offset="20%" stopColor="#3a56c4" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#3a56c4" stopOpacity="0.72" />
            </linearGradient>
          </defs>

          {/* lune */}
          <circle cx="190" cy="55" r="26" fill="#fbefd0" opacity="0.9" />
          <circle cx="190" cy="55" r="55" fill="url(#glow)" opacity="0.5" />
          {/* oiseaux */}
          <path d="M330,60 Q336,54 342,60 Q348,54 354,60" fill="none" stroke="#fbefd0" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
          <path d="M370,90 Q375,85 380,90 Q385,85 390,90" fill="none" stroke="#fbefd0" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />

          {/* mer : lignes de houle, chacune respire à son propre rythme */}
          <motion.path
            d="M0,70 Q200,55 400,70 T800,68 T1200,64"
            fill="none" stroke="#4a5aa8" strokeOpacity="0.6" strokeWidth="2.5"
            animate={{ y: [0, -7, 0, 7, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,95 Q220,82 440,95 T880,92 T1200,90"
            fill="none" stroke="#4a5aa8" strokeOpacity="0.4" strokeWidth="2"
            animate={{ y: [0, 6, 0, -6, 0] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />

          {/* plage */}
          <path d="M0,120 Q260,88 540,116 Q840,146 1200,102 L1200,400 L0,400 Z" fill="url(#sand)" />

          {/* ressac : une nappe d'eau bleue, uniquement côté mer (jamais sur le sable)... */}
          <motion.path
            d="M0,120 Q260,88 540,116 Q840,146 1200,102 L1200,72 Q840,116 540,86 Q260,58 0,90 Z"
            fill="url(#waterFill)"
            style={{ filter: "blur(2px)" }}
            animate={{ y: [-10, 6, 22, 6, -10], opacity: [0, 0.7, 0.8, 0.45, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* ...suivie de sa crête d'écume, pile à la limite du sable, même rythme */}
          <motion.path
            d="M0,120 Q260,88 540,116 Q840,146 1200,102"
            fill="none" stroke="#fbefd0" strokeWidth="7" strokeLinecap="round"
            style={{ filter: "blur(1.5px)" }}
            animate={{ y: [-10, 6, 22, 6, -10], opacity: [0, 0.85, 1, 0.55, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* bateau échoué */}
          <g transform="translate(830,190) rotate(-9) scale(0.82)">
            <path
              d="M-165,8 Q-158,42 -108,48 L108,48 Q152,45 165,10 Q118,-10 0,-12 Q-118,-10 -165,8 Z"
              fill="#02044d" stroke="#efca5e" strokeWidth="2.5"
            />
            <path d="M-150,18 Q0,4 150,18" fill="none" stroke="#f4d964" strokeOpacity="0.5" strokeWidth="2" />
            <line x1="-10" y1="-12" x2="-28" y2="-118" stroke="#02044d" strokeWidth="5" strokeLinecap="round" />
            <path d="M-28,-118 Q34,-96 22,-48 Q0,-70 -20,-52 Q-30,-84 -28,-118 Z" fill="#fbefd0" fillOpacity="0.88" />

            <motion.g
              style={{ transformOrigin: "-20px 20px" }}
              initial={{ scaleY: 0.03, opacity: 0.3 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <path d="M-32,0 L-18,11 L-30,22 L-14,34 L-26,44" fill="none" stroke="url(#glow)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M-32,0 L-18,11 L-30,22 L-14,34 L-26,44" fill="none" stroke="#f4d964" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.g>
          </g>
        </svg>
      </div>
    </div>
  );
}
