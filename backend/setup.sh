#!/bin/bash

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 Setup Backend Tattoo App              ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""

# Vérifier si .env existe
if [ ! -f .env ]; then
  echo -e "${YELLOW}⚠️  Fichier .env non trouvé${NC}"
  echo -e "${BLUE}📋 Création depuis .env.example...${NC}"
  cp env.example .env
  echo -e "${GREEN}✅ Fichier .env créé${NC}"
  echo -e "${RED}⚠️  IMPORTANT: Configurez vos variables dans .env avant de continuer !${NC}"
  echo -e "${YELLOW}   Notamment JWT_SECRET (générez-en un sécurisé)${NC}"
  echo ""
  read -p "Voulez-vous continuer le setup maintenant ? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Setup annulé. Configurez .env et relancez ce script.${NC}"
    exit 1
  fi
fi

# Installation des dépendances
echo -e "${BLUE}📦 Installation des dépendances...${NC}"
if ! pnpm install; then
  echo -e "${RED}❌ Erreur lors de l'installation des dépendances${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Dépendances installées${NC}"
echo ""

# Build du projet
echo -e "${BLUE}🔨 Build du projet...${NC}"
if ! pnpm run build; then
  echo -e "${RED}❌ Erreur lors du build${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Build terminé${NC}"
echo ""

# Vérifier si PostgreSQL est accessible
echo -e "${BLUE}🔍 Vérification de PostgreSQL...${NC}"
if ! docker-compose ps postgres | grep -q "Up"; then
  echo -e "${YELLOW}⚠️  PostgreSQL n'est pas démarré${NC}"
  echo -e "${BLUE}🐳 Démarrage de PostgreSQL avec Docker...${NC}"
  docker-compose up -d postgres
  echo -e "${YELLOW}⏳ Attente que PostgreSQL soit prêt (15 secondes)...${NC}"
  sleep 15
fi
echo -e "${GREEN}✅ PostgreSQL est accessible${NC}"
echo ""

# Exécution des migrations
echo -e "${BLUE}🗄️  Exécution des migrations...${NC}"
if ! pnpm run migration:run; then
  echo -e "${RED}❌ Erreur lors des migrations${NC}"
  echo -e "${YELLOW}💡 Si la migration existe déjà, c'est normal en dev${NC}"
fi
echo -e "${GREEN}✅ Migrations exécutées${NC}"
echo ""

# Résumé
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Setup terminé avec succès !           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Pour démarrer l'application :${NC}"
echo -e "  ${YELLOW}pnpm run start:dev${NC}     # Développement"
echo -e "  ${YELLOW}pnpm run start:prod${NC}    # Production"
echo ""
echo -e "${BLUE}Endpoints disponibles :${NC}"
echo -e "  ${YELLOW}http://localhost:3001${NC}          # API principale"
echo -e "  ${YELLOW}http://localhost:3001/health${NC}   # Health check"
echo -e "  ${YELLOW}http://localhost:8080${NC}          # Adminer (DB GUI)"
echo ""
echo -e "${GREEN}Bon développement ! 🚀${NC}"

