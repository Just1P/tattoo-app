#!/bin/bash

# Script de démarrage rapide pour l'application
# Usage: ./quick-start.sh

# Définir le répertoire racine du projet
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "🚀 Démarrage rapide de l'application Tattoo..."

# Démarrer Docker Compose en arrière-plan
echo "Démarrage de Docker Compose..."
cd "$BACKEND_DIR"
docker-compose up -d 2>/dev/null || docker compose up -d 2>/dev/null
cd "$PROJECT_ROOT"

# Attendre un peu que PostgreSQL démarre
echo "Attente du démarrage de PostgreSQL..."
sleep 5

# Démarrer le backend en arrière-plan
echo "Démarrage du backend..."
cd "$BACKEND_DIR"
export DB_HOST=localhost
export DB_PORT=5433
export DB_USERNAME=postgres
export DB_PASSWORD=password
export DB_NAME=tattoo-app
export JWT_SECRET=votre-secret-jwt-super-securise-changez-moi
export NODE_ENV=development

if command -v pnpm &> /dev/null; then
    pnpm run start:dev > "$PROJECT_ROOT/backend.log" 2>&1 &
else
    npm run start:dev > "$PROJECT_ROOT/backend.log" 2>&1 &
fi
cd "$PROJECT_ROOT"

# Démarrer le frontend en arrière-plan
echo "Démarrage du frontend..."
cd "$FRONTEND_DIR"
if command -v pnpm &> /dev/null; then
    pnpm run dev > "$PROJECT_ROOT/frontend.log" 2>&1 &
else
    npm run dev > "$PROJECT_ROOT/frontend.log" 2>&1 &
fi
cd "$PROJECT_ROOT"

echo ""
echo "✅ Application démarrée !"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3001"
echo "Adminer: http://localhost:8080"
echo ""
echo "Pour arrêter: ./stop-app.sh"
echo "Logs: tail -f backend.log ou tail -f frontend.log"
