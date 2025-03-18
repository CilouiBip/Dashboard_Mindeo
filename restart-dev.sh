#!/bin/bash

# Définir le port
PORT=7002

echo "🔍 Recherche des processus sur le port $PORT..."
# Trouver le PID qui utilise le port
PID=$(lsof -ti :$PORT)

if [ ! -z "$PID" ]; then
    echo "🔪 Arrêt du processus $PID qui utilise le port $PORT..."
    kill -9 $PID
    echo "✅ Processus arrêté"
else
    echo "✨ Aucun processus n'utilise le port $PORT"
fi

echo "🚀 Démarrage du serveur de développement..."
npm run dev
