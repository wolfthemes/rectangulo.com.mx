# PROGRESS
Validation « statique » = `npx eslint <fichiers>` + `npx sass --no-source-map <scss> /dev/null` (voir D002). Capture Playwright : voir D003.

## Setup / design system
- [x] T001 — Tokens : rouge institutionnel, noir, blanc, typo condensée MAJ dans styles/_css-variables.scss + _tokens.scss (Dossier p.1-8) — eslint/sass OK, variables --wpe--color--red présentes
- [x] T002 — Utilitaire grain/noise (overlay CSS, SVG feTurbulence inline) dans styles/_utilities.scss (HOME p.5, WORK p.2) — classe `.grain` compile
- [x] T003 — Logo : vérifier public/images/logo.svg (lettres étirées RECTANGULO), sinon placeholder + BLOCKED `[À FOURNIR : logo SVG]` (Dossier p.1)
- [ ] T004 — Données sociales/contact centralisées dans constants/ (IG/VI/YT/IN, contacto@rectangulofilms.com, +52 3323881333, Guadalajara) (HOME p.10, Dossier p.8)

## Global
- [ ] T005 — Header : nav WORK/SERVICES/PROJECTS + sociaux, logo réduit (HOME p.4)
- [ ] T006 — Footer : contact + sociaux IG/VI/YT/IN + légal (privacy, cookies, © année) (HOME p.10, SERVICES p.10)
- [ ] T007 — Composant CTA partagé « Let's work together / Start a project → » réutilisé HOME/SERVICES/WORK (HOME p.10, SERVICES p.10, WORK p.10)
- [ ] T008 — Pages légales Privacy/Cookies : pages/ route + placeholder `[À FOURNIR : texte légal]` + BLOCKED (HOME p.10)
- [ ] T009 — Transition cinéma : rideau/bande rouge + grain dans PageTransition, utilisée HOME→SERVICES (SERVICES p.2, CLAUDE.md)

## HOME
- [ ] T010 — HomeIntro : logo animé (draw/reveal) + interaction « Enter » (HOME p.3)
- [ ] T011 — HomeHero : audit 3 états scroll, menu+IG/YT/VI/IN à l'état 2, statement état 3 (HOME p.4)
- [ ] T012 — Lightbox Showreel (modal vidéo) branchée sur onViewShowreel ; URL démo `[À FOURNIR]` (HOME p.4)
- [ ] T013 — HomeExplore : WORK/SERVICES/PROJECTS typo surdimensionnée, fond uni+grain, liens (HOME p.5)
- [ ] T014 — Route /projects (Rectángulo-owned: Aahh! La Brava…) placeholder structuré (HOME p.2, p.5)
- [ ] T015 — HomeFeaturedWork : numérotation 01–05 + catégorie, hover preview vidéo/loop (HOME p.6-8)
- [ ] T016 — ProjectViewer (composant modal partagé) : infos + crédits (champs vides masqués), vidéo, CLOSE, restauration du scroll (HOME p.9, WORK p.7-8)
- [ ] T017 — Brancher ProjectViewer sur HomeFeaturedWork (clic = overlay, plus de navigation) + lien VIEW ALL WORK → (HOME p.8)

## SERVICES
- [ ] T018 — ClientLogosCarousel : boucle continue lente, pause reduced-motion, logos Dossier p.6 (placeholders `[À FOURNIR : logos SVG]`) (SERVICES p.3)
- [ ] T019 — Hover/tap BTS sur logo : collage de photos/loops (médias `[À FOURNIR]`) (SERVICES p.3)
- [ ] T020 — ServicesCapabilities : 6 sections scroll-driven avec textes exacts (03.1–03.6) (SERVICES p.4-7)
- [ ] T021 — CTA « VIEW RENTAL EQUIPMENT → » + route /rental placeholder (SERVICES p.7)
- [ ] T022 — ServicesStage : reveal au scroll plan filaire → dimensions 192 m³ 8×6×4 → liste → photos + lien Explore Offscreen Studio (SERVICES p.8)
- [ ] T023 — ServicesTeam : fond rouge+grain, colonne de noms, hover/clic portrait+rôle+bio (Josh Sándre, Román Hernández, Karla Suárez ; bios `[À FOURNIR]`) (SERVICES p.9)
- [ ] T024 — ServicesCTA + footer conformes (SERVICES p.10)

## WORK
- [ ] T025 — Filtres horizontaux (7 catégories), état actif, filtrage client sans reload, swipe mobile (WORK p.3)
- [ ] T026 — Filmstrip horizontal épinglé (scroll vertical→horizontal, desktop only, natif en mobile) (WORK p.4, p.9)
- [ ] T027 — Tuiles : loops muets via IntersectionObserver (play/stop), hover titre/catégorie/année/VIEW PROJECT (WORK p.5)
- [ ] T028 — Index 01/02… + compteur « 07 / 32 » sur résultat filtré (WORK p.6)
- [ ] T029 — Popup WORK : layout gauche infos/crédits fixes + vidéo 70-75 % droite, PREVIOUS/NEXT, restauration position horizontale (WORK p.7-9)
- [ ] T030 — Fin du filmstrip : libération du pin + CTA « Have a project in mind? » + footer (WORK p.10)
- [ ] T031 — Champs crédits WPGraphQL (client, agency, director, … location) : fragments + mapping, alignés sur le backend (WORK p.8)

## Finitions / QA
- [ ] T032 — Page About/Contact alignées sur Dossier (carte Mexique « Sin límites geográficos », contact p.8)
- [ ] T033 — A11y/perf : prefers-reduced-motion partout, focus-trap modals, aria, `next/image`/lazy vidéos
- [ ] T034 — Responsive mobile : HOME, SERVICES, WORK (pas de scroll-jacking mobile)
- [ ] T035 — QA globale + REPORT.md + DONE
