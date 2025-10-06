# 🎨 Tattoo App

Application complète de gestion de tatouages et portfolio pour artistes tatoueurs.

> **Note** : Cette application a été entièrement sécurisée et optimisée pour la production. Consultez [COMPLETE-SUMMARY.md](COMPLETE-SUMMARY.md) pour voir toutes les améliorations (score passé de 4.5/10 à 9.4/10 ! 🎉)

---

## 🚀 Démarrage Rapide

### Première Installation

```bash
# 1. Installer le backend et la base de données
cd backend
./setup.sh

# 2. Installer les dépendances frontend
cd ../frontend
pnpm install

# 3. Revenir à la racine
cd ..
```

### Lancer l'Application Complète

```bash
./start-app.sh
```

✅ **C'est tout !** L'application complète démarre avec :

- 📱 Frontend sur http://localhost:3000
- 🔧 Backend API sur http://localhost:3001
- 🗄️ Base de données PostgreSQL + Adminer sur http://localhost:8080
- 🔥 Hot-reload sur backend ET frontend

### Arrêter l'Application

```bash
./stop-app.sh
```

---

## 📚 Documentation

| Document                                                           | Description                                                 |
| ------------------------------------------------------------------ | ----------------------------------------------------------- |
| **[SCRIPTS-GUIDE.md](SCRIPTS-GUIDE.md)**                           | 🚀 Guide complet des scripts (quel script utiliser quand ?) |
| **[COMPLETE-SUMMARY.md](COMPLETE-SUMMARY.md)**                     | 📊 Résumé de toutes les améliorations apportées             |
| **[backend/QUICK-START.md](backend/QUICK-START.md)**               | ⚡ Guide rapide backend (commandes quotidiennes)            |
| **[backend/SECURITY.md](backend/SECURITY.md)**                     | 🔒 Guide de sécurité complet                                |
| **[backend/MIGRATION-GUIDE.md](backend/MIGRATION-GUIDE.md)**       | 🔄 Guide des migrations TypeORM                             |
| **[backend/CHANGELOG-SECURITY.md](backend/CHANGELOG-SECURITY.md)** | 📝 Détails des correctifs de sécurité                       |

---

## 📁 Structure du Projet

```
tattoo-app/
├── frontend/                # Application Next.js + React
│   ├── src/
│   │   ├── app/            # Pages Next.js (App Router)
│   │   ├── components/     # Composants React + shadcn/ui
│   │   ├── hooks/          # React hooks personnalisés
│   │   └── lib/            # Utilitaires et API client
│   └── package.json
│
├── backend/                 # API NestJS + TypeORM
│   ├── src/
│   │   ├── auth/           # Authentification JWT
│   │   ├── users/          # Gestion des utilisateurs
│   │   ├── posts/          # Gestion des posts (tatouages)
│   │   ├── profile/        # Profils utilisateurs
│   │   ├── config/         # Configuration et validation env
│   │   ├── common/         # Interceptors, filters, guards
│   │   └── database/       # Migrations TypeORM
│   ├── uploads/            # Fichiers uploadés (avatars, posts)
│   ├── setup.sh            # Script d'installation initiale
│   ├── dev.sh              # Script de développement backend
│   └── docker-compose.yml  # PostgreSQL + Adminer
│
├── start-app.sh            # 🚀 Lance l'application complète
├── stop-app.sh             # 🛑 Arrête tous les services
└── README.md               # 📖 Ce fichier
```

---

## 🛠️ Technologies

### Frontend

- **Framework** : Next.js 14 (App Router)
- **UI** : React, TypeScript, Tailwind CSS
- **Composants** : shadcn/ui
- **Icônes** : Tabler Icons (via lucide-react)
- **State** : React Context + Hooks personnalisés

### Backend

- **Framework** : NestJS
- **ORM** : TypeORM (avec migrations)
- **Base de données** : PostgreSQL
- **Authentification** : JWT + Passport
- **Sécurité** : Helmet, Rate Limiting (Throttler), Validation (class-validator)
- **Upload** : Multer

### DevOps

- **Containerisation** : Docker + Docker Compose
- **Hot-reload** : Activé sur backend et frontend
- **Scripts** : Bash (setup, dev, start, stop)

---

## 🔐 Sécurité

✅ **Production-Ready** avec :

- ✅ Variables d'environnement validées (`@nestjs/config`)
- ✅ Rate limiting (100 req/10min par IP)
- ✅ Headers sécurisés (Helmet)
- ✅ Hashing bcrypt (salt rounds: 10)
- ✅ JWT avec expiration configurable
- ✅ Soft delete (aucune perte de données)
- ✅ DTOs de réponse (pas de fuite de données sensibles)
- ✅ Guards sur toutes les routes sensibles
- ✅ CORS configuré proprement
- ✅ Migrations TypeORM (pas de `synchronize: true`)

Consultez [backend/SECURITY.md](backend/SECURITY.md) pour plus de détails.

---

## 📊 Services et Ports

| Service          | Port | URL                          | Description                                   |
| ---------------- | ---- | ---------------------------- | --------------------------------------------- |
| **Frontend**     | 3000 | http://localhost:3000        | Interface utilisateur Next.js                 |
| **Backend API**  | 3001 | http://localhost:3001        | API NestJS                                    |
| **Health Check** | 3001 | http://localhost:3001/health | Monitoring de santé                           |
| **PostgreSQL**   | 5433 | localhost:5433               | Base de données                               |
| **Adminer**      | 8080 | http://localhost:8080        | Interface DB (user: postgres, pass: password) |

---

## 🧪 Tests et Qualité

### Lancer les Tests

```bash
# Tests backend
cd backend
pnpm test

# Tests E2E backend
pnpm test:e2e

# Couverture
pnpm test:cov
```

### Linting

```bash
# Backend
cd backend
pnpm lint

# Frontend
cd frontend
pnpm lint
```

---

## 📈 Fonctionnalités

### Authentification

- ✅ Inscription / Connexion
- ✅ JWT avec refresh tokens
- ✅ Profils utilisateurs (client / artiste)
- ✅ Upload d'avatar

### Gestion des Posts

- ✅ Création de posts (tatouages, flash, inspiration)
- ✅ Upload multiple d'images
- ✅ Tags et catégories
- ✅ Filtres et recherche
- ✅ Pagination
- ✅ Système de likes (avec authentification)
- ✅ Soft delete (récupération possible)

### UX

- ✅ Hot-reload sur backend et frontend
- ✅ Redirection intelligente pour utilisateurs non connectés
- ✅ Feedback visuel sur les interactions
- ✅ Interface moderne avec shadcn/ui

---

## 🔄 Workflows de Développement

### Développement Full-Stack (recommandé)

```bash
./start-app.sh
# Éditer backend ou frontend
# Hot-reload automatique ✨
# Ctrl+C pour arrêter tout
```

### Développement Backend Seulement

```bash
cd backend
./dev.sh
# Éditer le backend
# Tester l'API avec Postman/Thunder Client
```

### Développement Frontend Seulement

```bash
# Terminal 1 : Lancer le backend
cd backend && ./dev.sh

# Terminal 2 : Lancer le frontend
cd frontend && pnpm run dev
```

Consultez [SCRIPTS-GUIDE.md](SCRIPTS-GUIDE.md) pour plus de détails.

---

## 🐛 Dépannage

### PostgreSQL ne démarre pas

```bash
docker ps  # Vérifier que tattoo-postgres tourne
docker logs tattoo-postgres  # Voir les logs
```

### Erreur de migration

```bash
cd backend
pnpm run migration:run  # Relancer les migrations
```

### Ports déjà utilisés

```bash
./stop-app.sh  # Tout arrêter
lsof -i :3000  # Vérifier quel process utilise le port
```

---

## 📝 Commandes Utiles

```bash
# Créer une nouvelle migration
cd backend
pnpm run migration:generate -- src/database/migrations/NomDeLaMigration

# Voir l'état de la base de données
docker exec tattoo-postgres psql -U postgres -d tattoo-app -c "\dt"

# Accéder à la base de données
docker exec -it tattoo-postgres psql -U postgres -d tattoo-app

# Voir les logs en temps réel
tail -f backend.log   # Backend
tail -f frontend.log  # Frontend
docker logs -f tattoo-postgres  # PostgreSQL
```

---

## 🎯 Prochaines Étapes

- [ ] Tests E2E avec coverage 80%+
- [ ] Monitoring APM en production (Sentry, DataDog)
- [ ] CI/CD (GitHub Actions)
- [ ] Docker multi-stage pour production
- [ ] CDN pour les images

---

## 📞 Support

Pour toute question ou problème :

1. Consultez [SCRIPTS-GUIDE.md](SCRIPTS-GUIDE.md) pour les scripts
2. Consultez [backend/QUICK-START.md](backend/QUICK-START.md) pour le backend
3. Consultez [COMPLETE-SUMMARY.md](COMPLETE-SUMMARY.md) pour voir toutes les améliorations

---

## 📄 Licence

MIT

---

**Enjoy coding! 🎨✨**
