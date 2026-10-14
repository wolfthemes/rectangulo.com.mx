# DECISIONS
D001 — global — Le dépôt est un frontend Next.js/FaustWP headless (pas un thème WP/child theme) ; on construit dans components/, pages/, wp-templates/ — c'est le code existant du projet.
D002 — global — `npm run lint/build/dev` NON exécutés depuis cette session (mémoire utilisateur : il compile sous Windows). Vérification statique : `npx eslint`, `npx sass`. — préférence utilisateur explicite, prime sur la consigne générique de la boucle.
D003 — global — Capture Playwright impossible depuis cette session (pas de rendu PDF/serveur vérifiable ; dev server côté Windows). Comparaison visuelle différée à « à valider par le client/dev » dans REPORT.md.
D004 — global — PDF lus via Ghostscript (txtwrite + png) car pdftoppm absent ; le Dossier est image-seule, analysé visuellement (basse résolution).
