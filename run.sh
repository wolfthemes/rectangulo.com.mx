#!/usr/bin/env bash
# Boucle Claude Code sur PROMPT.md jusqu'à ce que le fichier DONE existe.
# Usage : ./run.sh            (60 itérations max)
#         MAX=1 ./run.sh      (une seule itération)

unset ANTHROPIC_API_KEY          # force l'abonnement claude.ai au lieu de l'API
MAX=${MAX:-60}
i=0

command -v jq >/dev/null || { echo "jq manquant : sudo apt install jq"; exit 1; }
trap 'echo; echo "Arrêt demandé."; exit 130' INT

while [ ! -f DONE ] && [ "$i" -lt "$MAX" ]; do
  i=$((i+1))
  echo
  echo "=== Itération $i/$MAX — $(date +%H:%M:%S) ==="

  claude -p "$(cat PROMPT.md)" \
    --allowedTools "Read,Write,Edit,Bash,Glob,Grep" \
    --output-format stream-json --verbose 2>&1 \
  | tee -a loop.log \
  | jq -rR --unbuffered 'fromjson? | select(.type=="assistant") | .message.content[]?
      | if .type=="text" then .text
        elif .type=="tool_use" then "  → \(.name) \(.input.file_path // .input.command // .input.pattern // "")"
        else empty end'

  # Limite d'usage de l'abonnement : pause au lieu de boucler dans le vide
  if tail -n 20 loop.log | grep -qiE "usage limit|rate limit|limit reached"; then
    echo "⏸  Limite atteinte, pause 30 min ($(date +%H:%M))..."
    sleep 1800
  fi

  # Garde-fou : plus aucune tâche ouverte → on s'arrête
  if [ -f PROGRESS.md ] && ! grep -q -- '- \[ \]' PROGRESS.md; then
    echo "✅ Plus de tâche ouverte dans PROGRESS.md."
    break
  fi

  sleep 2
done

[ -f DONE ] && echo "🏁 DONE — voir REPORT.md"
