# Guide de Migration - Tattoo App Backend

## 🔄 Migration de la Base de Données Existante vers le Nouveau Système Sécurisé

Si vous avez déjà des données avec l'ancien système (synchronize: true), voici comment migrer :

### Option 1 : Migration Propre (Recommandé pour Dev)

```bash
# 1. Sauvegarder vos données actuelles si nécessaire
pg_dump -h localhost -p 5433 -U postgres tattoo_app > backup.sql

# 2. Supprimer la base existante
docker-compose down -v  # Supprime aussi les volumes

# 3. Recréer la base propre
docker-compose up -d postgres

# 4. Compiler le backend
pnpm run build

# 5. Exécuter les migrations
pnpm run migration:run

# 6. Démarrer l'application
pnpm run start:dev
```

### Option 2 : Migration avec Données Existantes

```bash
# 1. Sauvegarder OBLIGATOIRE
pg_dump -h localhost -p 5433 -U postgres tattoo_app > backup_$(date +%Y%m%d).sql

# 2. Vérifier l'état actuel de la DB
psql -h localhost -p 5433 -U postgres tattoo_app
\dt  # Voir les tables

# 3. Créer la table de migrations manuellement
CREATE TABLE IF NOT EXISTS "migrations" (
  "id" SERIAL PRIMARY KEY,
  "timestamp" BIGINT NOT NULL,
  "name" VARCHAR NOT NULL
);

# 4. Vérifier les différences de schéma
# Comparer votre schéma actuel avec celui dans InitialMigration.ts

# 5. Si le schéma correspond déjà :
# Marquer la migration initiale comme exécutée sans l'exécuter
INSERT INTO migrations (timestamp, name)
VALUES (1738800000000, 'InitialMigration1738800000000');

# 6. Build et démarrer
pnpm run build
pnpm run start:dev
```

### Option 3 : Créer une Table Likes sans Perdre les Posts

Si vous avez des posts avec des likes existants mais pas de table `likes` :

```sql
-- 1. Se connecter à la DB
psql -h localhost -p 5433 -U postgres tattoo_app

-- 2. Créer la table likes
CREATE TABLE "likes" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL,
  "postId" uuid NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_likes" PRIMARY KEY ("id")
);

-- 3. Créer les index
CREATE INDEX "IDX_like_userId" ON "likes" ("userId");
CREATE INDEX "IDX_like_postId" ON "likes" ("postId");
CREATE UNIQUE INDEX "IDX_like_userId_postId" ON "likes" ("userId", "postId");

-- 4. Ajouter les contraintes
ALTER TABLE "likes"
ADD CONSTRAINT "FK_like_user"
FOREIGN KEY ("userId")
REFERENCES "users"("id")
ON DELETE CASCADE;

ALTER TABLE "likes"
ADD CONSTRAINT "FK_like_post"
FOREIGN KEY ("postId")
REFERENCES "posts"("id")
ON DELETE CASCADE;

-- 5. IMPORTANT : Vous perdrez l'historique des likes individuels
-- mais le compteur likesCount sur les posts sera préservé
-- Les nouveaux likes seront trackés correctement
```

## 🆕 Futures Migrations

### Créer une Nouvelle Migration

Quand vous modifiez une entité :

```bash
# 1. Modifier votre entité (User, Post, Like, etc.)

# 2. Build
pnpm run build

# 3. Générer la migration automatiquement
pnpm run migration:generate src/database/migrations/VotreNomDeMigration

# Exemple : Ajouter un champ 'verified' à User
pnpm run migration:generate src/database/migrations/AddVerifiedToUser

# 4. Vérifier la migration générée
cat src/database/migrations/TIMESTAMP-AddVerifiedToUser.ts

# 5. Build à nouveau
pnpm run build

# 6. Exécuter la migration
pnpm run migration:run
```

### Créer une Migration Manuelle

```bash
# 1. Créer le fichier
pnpm run migration:create src/database/migrations/VotreNom

# 2. Éditer le fichier créé
# Implémenter up() et down()

# 3. Build
pnpm run build

# 4. Exécuter
pnpm run migration:run
```

### Annuler une Migration

```bash
# Annuler la dernière migration exécutée
pnpm run migration:revert

# Voir l'état
pnpm run migration:show
```

## 📊 Vérifier l'État de la Base

### Voir les Tables

```sql
psql -h localhost -p 5433 -U postgres tattoo_app

-- Lister les tables
\dt

-- Voir la structure d'une table
\d users
\d posts
\d likes

-- Voir les migrations exécutées
SELECT * FROM migrations ORDER BY timestamp;
```

### Compter les Enregistrements

```sql
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_posts FROM posts;
SELECT COUNT(*) as total_likes FROM likes;

-- Vérifier les likes
SELECT
  p.id,
  p.title,
  p."likesCount",
  COUNT(l.id) as actual_likes
FROM posts p
LEFT JOIN likes l ON l."postId" = p.id
GROUP BY p.id
HAVING p."likesCount" != COUNT(l.id);
-- Si cette requête retourne des lignes, il y a une incohérence
```

## 🐛 Dépannage

### Erreur: "migration has already been executed"

```bash
# Voir l'état
pnpm run migration:show

# Option 1: Annuler
pnpm run migration:revert

# Option 2: Supprimer de la table migrations manuellement
psql -h localhost -p 5433 -U postgres tattoo_app
DELETE FROM migrations WHERE name = 'NomDeLaMigration';
```

### Erreur: "relation already exists"

Votre schéma existe déjà. Options :

1. **Recommandé** : Marquer la migration comme exécutée

```sql
INSERT INTO migrations (timestamp, name)
VALUES (1738800000000, 'InitialMigration1738800000000');
```

2. **Alternative** : Tout nettoyer et recommencer

```bash
docker-compose down -v
docker-compose up -d postgres
pnpm run migration:run
```

### La migration ne trouve pas les fichiers

```bash
# 1. Vérifier que le build est à jour
pnpm run build

# 2. Vérifier que les migrations sont compilées
ls -la dist/database/migrations/

# 3. Si vide, rebuilder
rm -rf dist
pnpm run build
```

### Synchronize vs Migrations

**JAMAIS les deux en même temps !**

```typescript
// ❌ MAUVAIS
synchronize: true,

// ✅ BON
synchronize: false,
```

Si vous avez besoin de tester rapidement un changement de schéma :

1. Utilisez une DB de dev séparée
2. Activez temporairement synchronize UNIQUEMENT en dev local
3. Générez la migration basée sur les changements
4. Désactivez synchronize
5. Testez la migration

## 📝 Exemple Complet : Ajouter un Champ

### 1. Modifier l'Entité

```typescript
// src/users/entities/user.entity.ts
@Column({ default: false })
verified: boolean;
```

### 2. Générer la Migration

```bash
pnpm run build
pnpm run migration:generate src/database/migrations/AddVerifiedToUser
```

### 3. Vérifier la Migration Générée

```typescript
// dist/database/migrations/TIMESTAMP-AddVerifiedToUser.ts
export class AddVerifiedToUser1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD "verified" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "verified"
    `);
  }
}
```

### 4. Exécuter

```bash
pnpm run build
pnpm run migration:run
```

### 5. Vérifier

```sql
\d users
-- Doit montrer la colonne 'verified'
```

## ⚠️ Checklist Avant Production

- [ ] Toutes les migrations testées en staging
- [ ] Backup de la base de production fait
- [ ] Plan de rollback préparé
- [ ] synchronize: false confirmé
- [ ] Migrations exécutées avec succès en staging
- [ ] Tests E2E passent avec le nouveau schéma
- [ ] Temps d'arrêt planifié si nécessaire
- [ ] Équipe avertie

## 🚀 Déploiement Production

```bash
# 1. Backup OBLIGATOIRE
pg_dump -h <prod-host> -U <user> <database> > backup_prod_$(date +%Y%m%d_%H%M%S).sql

# 2. Mettre l'app en mode maintenance (optionnel)

# 3. Pull du nouveau code
git pull origin main

# 4. Install dependencies
pnpm install

# 5. Build
pnpm run build

# 6. Exécuter les migrations
pnpm run migration:run

# 7. Redémarrer l'application
pm2 restart tattoo-backend

# 8. Vérifier
curl https://api.votredomaine.com/health

# 9. En cas de problème : ROLLBACK
pnpm run migration:revert
pm2 restart tattoo-backend
```
