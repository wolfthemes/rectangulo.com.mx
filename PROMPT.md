# Mission
Tu implémentes le site WordPress décrit dans les PDF de référence du client
situés dans `./specs/*.pdf`. Tu travailles en AUTONOMIE TOTALE : tu ne poses
jamais de question et tu ne t'arrêtes jamais pour demander une validation.

# Fichiers d'état (ta seule mémoire entre deux itérations)
- `specs/SPEC.md`      : transcription structurée des PDF (page par page)
- `PROGRESS.md`        : checklist des tâches `- [ ] T012 — … (PDF p.4)`
- `DECISIONS.md`       : hypothèses prises quand le PDF est ambigu
- `BLOCKED.md`         : tâches impossibles sans intervention humaine
- `LOG.md`             : une ligne par itération (date, tâche, résultat)

# Itération 0 (seulement si PROGRESS.md n'existe pas)
1. Lis chaque PDF en entier (texte + rendu visuel des pages avec maquettes).
2. Écris `specs/SPEC.md` : pour chaque page du PDF, contenus, sections,
   comportements, couleurs/typos repérées, avec la référence de page.
3. Découpe tout en tâches atomiques (≤ 30 min chacune), ordonnées par
   dépendance (setup → structure → templates → contenus → finitions → QA).
   Chaque tâche cite sa page PDF source et un critère de validation vérifiable.
4. Commit : `chore: spec + plan initial`. Puis passe à l'itération normale.

# Itération normale
1. Lis PROGRESS.md, DECISIONS.md, BLOCKED.md et les 20 dernières lignes de LOG.md.
2. Prends la PREMIÈRE tâche `- [ ]` qui n'est pas dans BLOCKED.md.
3. Relis la page PDF correspondante (pas seulement SPEC.md) avant de coder.
4. Implémente.
5. Vérifie :
   - `npm run lint` sans erreur
   - `npm run build` passe
   - capture Playwright sur http://localhost:3000/<page> (le serveur de dev
     tourne déjà, NE LE LANCE PAS), comparée à la maquette du PDF
6. Si OK : coche `- [x]`, commit `feat(T012): …`, ajoute une ligne à LOG.md.
7. Si échec après 3 tentatives : déplace la tâche dans BLOCKED.md avec la
   raison précise et ce qu'il faudrait pour débloquer, puis tâche suivante.
8. Enchaîne immédiatement sur la tâche suivante. Ne rédige pas de résumé
   entre les tâches.

# Ambiguïtés
Le PDF ne tranche pas ? Choisis l'option la plus standard / la plus proche
de la maquette, note-la dans DECISIONS.md (`D007 — T012 — hypothèse — raison`)
et continue. Ne t'arrête JAMAIS pour demander.

# Interdits
- Aucun déploiement en production, aucun push sur `main` distant
- Aucune suppression de base de données ou de médias existants
- Ne pas modifier le core WordPress ni les plugins tiers (child theme / plugin maison)
- Ne pas inventer de contenu client : placeholder `[À FOURNIR : …]` + entrée BLOCKED.md

# Condition d'arrêt
Quand il ne reste aucune tâche `- [ ]` hors BLOCKED.md :
1. Passe de QA globale (toutes les pages, mobile + desktop, console JS sans erreur).
2. Écris `REPORT.md` : fait / décisions prises / bloqué / à valider par le client.
3. Crée le fichier `DONE` à la racine et termine.
