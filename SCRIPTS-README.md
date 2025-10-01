# Scripts de Démarrage de l'Application Tattoo

Ce dossier contient plusieurs scripts pour faciliter le démarrage et l'arrêt de votre application complète.

## Scripts Disponibles

### 1. `start-app.sh` - Démarrage Complet avec Vérifications

Script principal avec toutes les vérifications et messages détaillés.

**Utilisation :**

```bash
./start-app.sh
```

**Fonctionnalités :**

- ✅ Vérifie que Docker est installé et en cours d'exécution
- ✅ Vérifie que Docker Compose est disponible
- ✅ Démarre PostgreSQL et Adminer via Docker Compose
- ✅ Attend que PostgreSQL soit prêt avant de continuer
- ✅ Installe les dépendances si nécessaire (backend et frontend)
- ✅ Démarre le backend NestJS en mode développement
- ✅ Attend que le backend soit accessible
- ✅ Démarre le frontend Next.js en mode développement
- ✅ Attend que le frontend soit accessible
- ✅ Affiche les URLs d'accès
- ✅ Gère l'arrêt propre avec Ctrl+C

### 2. `quick-start.sh` - Démarrage Rapide

Version simplifiée pour un démarrage plus rapide.

**Utilisation :**

```bash
./quick-start.sh
```

**Fonctionnalités :**

- 🚀 Démarre tous les services sans vérifications détaillées
- ⚡ Plus rapide mais moins de feedback
- 📝 Crée les fichiers de logs

### 3. `stop-app.sh` - Arrêt de l'Application

Arrête tous les services et nettoie les processus.

**Utilisation :**

```bash
./stop-app.sh
```

**Fonctionnalités :**

- 🛑 Arrête tous les processus Node.js (backend et frontend)
- 🐳 Arrête Docker Compose (PostgreSQL et Adminer)
- 🧹 Nettoie les fichiers de logs
- ✅ Confirme l'arrêt de tous les services

## URLs d'Accès

Une fois l'application démarrée, vous pouvez accéder à :

- **Frontend (Next.js)** : http://localhost:3000
- **Backend API (NestJS)** : http://localhost:3001
- **Adminer (Base de données)** : http://localhost:8080

## Gestion des Logs

Les logs sont sauvegardés dans des fichiers séparés :

- **Backend** : `backend.log`
- **Frontend** : `frontend.log`

**Pour suivre les logs en temps réel :**

```bash
# Backend
tail -f backend.log

# Frontend
tail -f frontend.log

# Les deux en même temps
tail -f backend.log frontend.log
```

## Prérequis

- Docker et Docker Compose installés
- Node.js installé
- pnpm ou npm installé
- Ports 3000, 3001, 5433, et 8080 disponibles

## Dépannage

### Si le script ne démarre pas :

1. Vérifiez que Docker Desktop est en cours d'exécution
2. Vérifiez que les ports ne sont pas déjà utilisés
3. Consultez les logs pour plus d'informations

### Si PostgreSQL ne démarre pas :

```bash
cd backend
docker-compose down
docker-compose up -d
```

### Si les dépendances ne sont pas installées :

```bash
# Backend
cd backend
pnpm install  # ou npm install

# Frontend
cd frontend
pnpm install  # ou npm install
```

## Notes

- Le script `start-app.sh` est recommandé pour le développement
- Le script `quick-start.sh` est utile pour les tests rapides
- Utilisez `stop-app.sh` pour un arrêt propre de tous les services
- Les scripts gèrent automatiquement pnpm et npm
