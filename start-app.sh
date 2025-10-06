#!/bin/bash

# Script pour lancer l'application complète en mode développement
# Usage: ./start-app.sh
# Lance Backend (local hot-reload) + Frontend + PostgreSQL/Adminer (Docker)

set -e  # Arrêter le script en cas d'erreur

# Définir le répertoire racine du projet
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "🚀 Démarrage de l'application Tattoo en mode développement..."
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

# Vérifier si pnpm est installé
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm n'est pas installé. Installez-le avec: npm install -g pnpm"
    exit 1
fi

# Fonction pour nettoyer les processus en arrière-plan
cleanup() {
    print_warning "Arrêt des services..."
    if [ ! -z "$BACKEND_PID" ]; then
        print_status "Arrêt du backend..."
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        print_status "Arrêt du frontend..."
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    print_status "Arrêt de Docker Compose (PostgreSQL + Adminer)..."
    cd "$BACKEND_DIR"
    docker-compose down 2>/dev/null || docker compose down 2>/dev/null || true
    cd "$PROJECT_ROOT"
    print_success "Services arrêtés"
    exit 0
}

# Capturer Ctrl+C pour nettoyer
trap cleanup SIGINT SIGTERM

# Étape 1: Démarrer PostgreSQL et Adminer via Docker (pas le backend)
print_status "Étape 1/3: Démarrage de PostgreSQL et Adminer via Docker..."
cd "$BACKEND_DIR"

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    print_warning "Fichier .env manquant. Création à partir de env.example..."
    cp env.example .env
    print_success "Fichier .env créé. Vérifiez la configuration si nécessaire."
fi

# Démarrer uniquement PostgreSQL et Adminer (pas le backend)
if command -v docker-compose &> /dev/null; then
    docker-compose up -d postgres adminer
else
    docker compose up -d postgres adminer
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
print_success "Adminer disponible sur http://localhost:8080"

# Vérifier si les dépendances backend sont installées
if [ ! -d "node_modules" ]; then
    print_status "Installation des dépendances backend..."
    pnpm install
fi

# Exécuter les migrations TypeORM
print_status "Exécution des migrations TypeORM..."
pnpm run migration:run || print_warning "Migrations déjà appliquées ou erreur mineure"

cd "$PROJECT_ROOT"

# Étape 2: Démarrer le backend en mode développement local (hot-reload)
print_status "Étape 2/3: Démarrage du backend NestJS en mode développement..."
cd "$BACKEND_DIR"

print_status "Démarrage du serveur backend sur http://localhost:3001..."
pnpm run start:dev > "$PROJECT_ROOT/backend.log" 2>&1 &
BACKEND_PID=$!

# Attendre que le backend soit prêt
print_status "Attente que le backend soit prêt..."
timeout=60
counter=0
while ! curl -s http://localhost:3001 &> /dev/null; do
    if [ $counter -eq $timeout ]; then
        print_error "Timeout: Le backend n'a pas démarré dans les temps"
        print_status "Vérifiez les logs: cat $PROJECT_ROOT/backend.log"
        exit 1
    fi
    sleep 1
    counter=$((counter + 1))
done

print_success "Backend prêt avec hot-reload !"
cd "$PROJECT_ROOT"

# Étape 3: Démarrer le frontend
print_status "Étape 3/3: Démarrage du frontend Next.js..."
cd "$FRONTEND_DIR"

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    print_status "Installation des dépendances frontend..."
    pnpm install
fi

# Démarrer le frontend en arrière-plan
print_status "Démarrage du serveur frontend sur http://localhost:3000..."
pnpm run dev > "$PROJECT_ROOT/frontend.log" 2>&1 &
FRONTEND_PID=$!

# Attendre que le frontend soit prêt
print_status "Attente que le frontend soit prêt..."
timeout=60
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
print_success "🎉 Application démarrée avec succès en mode développement !"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001 (local hot-reload ✨)"
echo "🗄️  Adminer (DB): http://localhost:8080"
echo "🏥 Health Check: http://localhost:3001/health"
echo ""
echo "📋 Logs disponibles:"
echo "   - Backend: tail -f $PROJECT_ROOT/backend.log"
echo "   - Frontend: tail -f $PROJECT_ROOT/frontend.log"
echo "   - PostgreSQL: docker logs -f tattoo-postgres"
echo ""
echo "💡 Tips:"
echo "   - Le backend se recharge automatiquement à chaque modification"
echo "   - Le frontend aussi (Next.js fast refresh)"
echo "   - Les migrations sont automatiquement appliquées"
echo ""
print_warning "Appuyez sur Ctrl+C pour arrêter tous les services"
echo ""

# Attendre indéfiniment (jusqu'à Ctrl+C)
while true; do
    sleep 1
done
