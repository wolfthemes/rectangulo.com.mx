# REPORT

## Fait
T001–T018, T020–T030, T032–T034 (voir PROGRESS.md / LOG.md) : design tokens + grain, header/footer, transitions cinéma, HOME (intro, hero, explore, featured work + ProjectViewer), SERVICES (logos, capacités sticky, stage reveal, team, CTA, /rental), WORK (filtres, filmstrip épinglé desktop, loops IO, compteur, popup prev/next, CTA), pages légales/projects placeholders, reduced-motion global.

## Décisions
Voir DECISIONS.md (D001–D009). Notamment : filtres WORK = noms de termes `workTypes` (D009), route WORK = /portfolio (D008).

## Bloqué (voir BLOCKED.md)
Showreel, textes légaux, projets propres, médias BTS (T019), inventaire location, médias Stage 01 / page Offscreen, portraits + bios équipe, champs crédits côté WPGraphQL (T031), URLs Vimeo/LinkedIn.

## QA — limites honnêtes
- Aucun `npm run lint/build` ni capture Playwright exécutés : le serveur dev tourne côté Windows (localhost:3000 renvoie 000 depuis cette session) et l'utilisateur compile lui-même (D002/D003). Contrôle de régression des routes non réalisable.
- Vérifié uniquement : `eslint .` (0 erreur, 12 warnings `<img>`) et compilation `sass` des fichiers modifiés.
- T035 (QA globale mobile/desktop, console JS) reste donc à faire par l'humain.

## À valider par le client / dev
Rendu visuel vs maquettes PDF de chaque page ; comportement du pin WORK (WorkFilmstrip) et des animations `animation-timeline` (Chrome/Edge) ; nommage des termes workTypes ; build Next.js.
