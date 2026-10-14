#!/usr/bin/env bash
# Relance Claude Code en headless jusqu'à ce que le fichier DONE existe
MAX=60; i=0
while [ ! -f DONE ] && [ $i -lt $MAX ]; do
  i=$((i+1))
  echo "=== Itération $i ==="
  claude -p "$(cat PROMPT.md)" \
    --allowedTools "Read,Write,Edit,Bash,Glob,Grep" \
    2>&1 | tee -a loop.log
  sleep 2
done
