#!/bin/bash

# Script pour lancer l'application complète
# Usage: ./start-app.sh

set -e  # Arrêter le script en cas d'erreur

# Définir le répertoire racine du projet
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "🚀 Démarrage de l'application Tattoo..."
echo "📁 Répertoire du projet: $PROJECT_ROOT"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
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

# Vérifier si Docker est installé et en cours d'exécution
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé ou n'est pas dans le PATH"
    exit 1
fi

if ! docker info &> /dev/null; then
    print_error "Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop"
    exit 1
fi

# Vérifier si Docker Compose est disponible
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose n'est pas installé"
    exit 1
fi

# Fonction pour nettoyer les processus en arrière-plan
cleanup() {
    print_warning "Arrêt des services..."
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    print_status "Arrêt de Docker Compose..."
    cd "$BACKEND_DIR"
    docker-compose down 2>/dev/null || docker compose down 2>/dev/null || true
    cd "$PROJECT_ROOT"
    print_success "Services arrêtés"
    exit 0
}

# Capturer Ctrl+C pour nettoyer
trap cleanup SIGINT SIGTERM

# Étape 1: Démarrer Docker Compose (Backend + PostgreSQL + Adminer)
print_status "Étape 1/2: Démarrage de Docker Compose (Backend + PostgreSQL + Adminer)..."
cd "$BACKEND_DIR"

# Utiliser docker-compose ou docker compose selon ce qui est disponible
if command -v docker-compose &> /dev/null; then
    docker-compose up -d
else
    docker compose up -d
fi

# Attendre que PostgreSQL soit prêt
print_status "Attente que PostgreSQL soit prêt..."
timeout=60
counter=0
while ! docker exec tattoo-postgres pg_isready -U postgres &> /dev/null; do
    if [ $counter -eq $timeout ]; then
        print_error "Timeout: PostgreSQL n'a pas démarré dans les temps"
        exit 1
    fi
    sleep 1
    counter=$((counter + 1))
done

print_success "PostgreSQL est prêt !"
print_success "Backend démarré via Docker !"
print_status "Adminer disponible sur http://localhost:8080"
cd "$PROJECT_ROOT"

# Étape 2: Démarrer le frontend
print_status "Étape 2/2: Démarrage du frontend Next.js..."
cd "$FRONTEND_DIR"

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    print_status "Installation des dépendances frontend..."
    if command -v pnpm &> /dev/null; then
        pnpm install
    elif command -v npm &> /dev/null; then
        npm install
    else
        print_error "Aucun gestionnaire de paquets trouvé (npm ou pnpm)"
        exit 1
    fi
fi

# Démarrer le frontend en arrière-plan
print_status "Démarrage du serveur frontend sur http://localhost:3000..."
if command -v pnpm &> /dev/null; then
    pnpm run dev > "$PROJECT_ROOT/frontend.log" 2>&1 &
else
    npm run dev > "$PROJECT_ROOT/frontend.log" 2>&1 &
fi
FRONTEND_PID=$!

# Attendre que le frontend soit prêt
print_status "Attente que le frontend soit prêt..."
timeout=30
counter=0
while ! curl -s http://localhost:3000 &> /dev/null; do
    if [ $counter -eq $timeout ]; then
        print_error "Timeout: Le frontend n'a pas démarré dans les temps"
        print_status "Vérifiez les logs: cat $PROJECT_ROOT/frontend.log"
        exit 1
    fi
    sleep 1
    counter=$((counter + 1))
done

print_success "Frontend prêt !"
cd "$PROJECT_ROOT"

# Afficher les informations finales
echo ""
print_success "🎉 Application démarrée avec succès !"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001 (Docker)"
echo "🗄️  Adminer (DB): http://localhost:8080"
echo ""
echo "📋 Logs disponibles:"
echo "   - Backend: docker logs -f tattoo-backend"
echo "   - Frontend: tail -f $PROJECT_ROOT/frontend.log"
echo ""
print_warning "Appuyez sur Ctrl+C pour arrêter tous les services"
echo ""

# Attendre indéfiniment (jusqu'à Ctrl+C)
while true; do
    sleep 1
done
