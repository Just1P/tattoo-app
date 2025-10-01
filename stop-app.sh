#!/bin/bash

# Script pour arrêter l'application complète
# Usage: ./stop-app.sh

set -e

# Définir le répertoire racine du projet
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Arrêt de l'application Tattoo..."

# Arrêter les processus Node.js (backend et frontend)
print_status "Arrêt des processus Node.js..."
pkill -f "nest start" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "pnpm run start:dev" 2>/dev/null || true
pkill -f "npm run start:dev" 2>/dev/null || true
pkill -f "pnpm run dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Arrêter Docker Compose
print_status "Arrêt de Docker Compose..."
cd "$BACKEND_DIR"
if command -v docker-compose &> /dev/null; then
    docker-compose down 2>/dev/null || true
else
    docker compose down 2>/dev/null || true
fi
cd "$PROJECT_ROOT"

# Nettoyer les fichiers de logs
print_status "Nettoyage des fichiers de logs..."
rm -f "$PROJECT_ROOT/backend.log" "$PROJECT_ROOT/frontend.log"

print_success "✅ Application arrêtée avec succès !"
print_status "Tous les services ont été arrêtés et nettoyés."
