# Guide de Sécurité - Tattoo App Backend

## 🔒 Correctifs de Sécurité Implémentés

### 1. ✅ Gestion des Variables d'Environnement

- **@nestjs/config** avec validation stricte
- Toutes les variables sont validées au démarrage
- Fichier `src/config/env.validation.ts` pour la validation
- L'application refuse de démarrer si les variables sont manquantes ou invalides

### 2. ✅ Migrations TypeORM

- **synchronize: false** en permanence
- Migrations dans `src/database/migrations/`
- Scripts npm pour gérer les migrations :
  ```bash
  pnpm run migration:run      # Exécuter les migrations
  pnpm run migration:revert   # Annuler la dernière migration
  pnpm run migration:show     # Voir l'état des migrations
  pnpm run migration:generate # Générer une migration
  ```

### 3. ✅ Protection des Mots de Passe

- `@Exclude()` sur le champ password de l'entité User
- `select: false` sur la colonne password
- Méthodes dédiées `findByEmailWithPassword()` et `findByIdWithPassword()`
- Le password n'est JAMAIS retourné dans les API responses

### 4. ✅ Système de Likes Sécurisé

- Table `likes` dédiée avec relation User-Post
- Authentification obligatoire pour liker/unliker
- Index unique sur (userId, postId) - un user ne peut liker qu'une fois
- Protection contre les likes multiples

### 5. ✅ Protection Injection SQL

- Validation stricte avec enums dans les DTOs
- `sortBy` et `sortOrder` validés par `@IsEnum()`
- Limite max de 100 items par page
- Tous les paramètres de query sont validés

### 6. ✅ Rate Limiting

- @nestjs/throttler configuré globalement
- Limite: 100 requêtes par minute
- Protège contre le brute force et DDoS
- Peut être surchargé par route avec `@Throttle()`

### 7. ✅ Global Exception Filter

- Gestion centralisée des erreurs
- Stack traces cachées en production
- Logging approprié selon l'environnement
- Format d'erreur standardisé

### 8. ✅ CORS Sécurisé

- Configuré via variable d'environnement `ALLOWED_ORIGINS`
- Séparation par virgule pour plusieurs origines
- Headers autorisés limités
- Credentials activés de manière contrôlée

### 9. ✅ Helmet - Headers HTTP Sécurisés

- Protection XSS
- Protection Clickjacking
- MIME Type Sniffing désactivé
- Configuration adaptée pour les uploads

### 10. ✅ Autres Sécurités

- **Validation globale** avec class-validator
- **ClassSerializerInterceptor** pour exclure les données sensibles
- **Graceful Shutdown** pour terminer proprement
- **Logging approprié** selon l'environnement
- **URLs dynamiques** via variables d'environnement

## 🚀 Démarrage Sécurisé

### 1. Configuration Initiale

```bash
# Copier le fichier d'exemple
cp .env.example .env

# IMPORTANT: Changer les valeurs sensibles
# - JWT_SECRET doit être une chaîne aléatoire longue
# - DB_PASSWORD en production
```

### 2. Générer un JWT Secret Sécurisé

```bash
# Node
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64
```

### 3. Exécuter les Migrations

```bash
# Build du projet
pnpm run build

# Exécuter les migrations
pnpm run migration:run
```

### 4. Démarrer l'Application

```bash
# Développement
pnpm run start:dev

# Production
pnpm run start:prod
```

## 📋 Checklist Production

Avant de déployer en production :

- [ ] Générer un JWT_SECRET unique et fort
- [ ] Configurer DB_PASSWORD sécurisé
- [ ] Définir ALLOWED_ORIGINS avec les domaines de production
- [ ] NODE_ENV=production
- [ ] Tester les migrations sur une DB de staging
- [ ] Vérifier que synchronize=false
- [ ] Configurer HTTPS (reverse proxy)
- [ ] Activer les logs en production (Winston/Pino)
- [ ] Configurer des limites de fichiers appropriées
- [ ] Mettre en place un monitoring
- [ ] Backup automatique de la base de données

## 🔐 Variables d'Environnement Requises

### Développement

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=tattoo_app
JWT_SECRET=<générer-un-secret-fort>
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Production

```env
NODE_ENV=production
PORT=3001
DB_HOST=<votre-db-host>
DB_PORT=5432
DB_USERNAME=<user-db>
DB_PASSWORD=<password-fort>
DB_NAME=tattoo_app
JWT_SECRET=<secret-64-chars-minimum>
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://votre-domaine.com
BACKEND_URL=https://api.votre-domaine.com
ALLOWED_ORIGINS=https://votre-domaine.com
```

## 🛡️ Bonnes Pratiques

### Authentification

- Les tokens JWT expirent après 24h
- Utiliser HTTPS en production
- Stocker les tokens de manière sécurisée (httpOnly cookies recommandé)

### Base de Données

- Toujours utiliser les migrations
- Jamais de `synchronize: true` en production
- Backup réguliers
- Utilisateur DB avec privilèges minimaux

### API

- Rate limiting actif sur toutes les routes
- Validation stricte des inputs
- Pas de données sensibles dans les logs
- CORS restrictif

### Fichiers

- Limite de 10MB par image
- Types autorisés : jpg, jpeg, png, gif, webp
- Stockage sécurisé avec noms uniques
- Validation MIME type côté serveur

## 📞 En Cas de Problème

### L'application ne démarre pas

1. Vérifier que toutes les variables d'environnement sont définies
2. Vérifier les logs : l'erreur sera explicite
3. Vérifier que la DB est accessible

### Erreur de migration

```bash
# Voir l'état
pnpm run migration:show

# Annuler la dernière
pnpm run migration:revert

# Réexécuter
pnpm run migration:run
```

### Rate Limit dépassé

- Limite normale : 100 req/min
- Pour augmenter : modifier `ThrottlerModule` dans `app.module.ts`
- Par route : utiliser `@Throttle()` decorator

## 🔄 Mises à Jour

Lors de changements du schéma :

```bash
# 1. Modifier vos entités
# 2. Générer la migration
pnpm run migration:generate src/database/migrations/NomDeLaMigration

# 3. Build
pnpm run build

# 4. Exécuter
pnpm run migration:run
```

## ⚠️ Avertissements

- **JAMAIS** exposer le fichier `.env`
- **JAMAIS** committer `.env` dans Git
- **TOUJOURS** utiliser des secrets différents entre dev/staging/prod
- **TOUJOURS** tester les migrations sur staging avant prod
