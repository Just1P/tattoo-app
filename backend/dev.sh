#!/bin/bash

# Script de développement rapide
# Usage: ./dev.sh

echo "🚀 Démarrage en mode développement..."
echo ""

# Vérifier que les dépendances sont installées
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances..."
  pnpm install
fi

# Vérifier que PostgreSQL tourne
if ! docker-compose ps postgres | grep -q "Up"; then
  echo "🐳 Démarrage de PostgreSQL..."
  docker-compose up -d postgres
  echo "⏳ Attente de PostgreSQL (10 secondes)..."
  sleep 10
fi

# Démarrer l'application
echo "🎯 Démarrage de l'application..."
pnpm run start:dev

