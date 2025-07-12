#!/bin/sh

set -e

cd /app

if [ ! -d "node_modules" ]; then
  echo "Der Ordner 'node_modules' wurde nicht gefunden. Führe 'npm install' aus..."
  npm install
fi

echo "Starte die Anwendung..."
exec "$@"
