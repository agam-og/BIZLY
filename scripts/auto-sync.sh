#!/bin/bash

cd "$(dirname "$0")/.."

while true; do
  if [[ -n "$(git status --porcelain)" ]]; then
    git add .
    git commit -m "chore: auto-sync changes"
    git push origin main
  fi

  sleep 20
done