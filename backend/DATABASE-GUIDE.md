```bash
./start-all.sh

./stop-all.sh
```

- **URL** : http://localhost:8081
- **Système** : PostgreSQL
- **Serveur** : `postgres`
- **Utilisateur** : `postgres`
- **Mot de passe** : `password`
- **Base de données** : `tattoo-app`

- Interface minimaliste et rapide
- Thème sombre disponible
- Éditeur SQL simple et efficace
- Visualisation des tables et données
- Gestion des utilisateurs et permissions
- Export/Import de données

1. Ouvrez http://localhost:8081
2. Sélectionnez "PostgreSQL"
3. Remplissez les champs :
   - Serveur: `postgres`
   - Utilisateur: `postgres`
   - Mot de passe: `password`
   - Base de données: `tattoo-app`

- **Tables** : Voir toutes vos tables
- **Données** : Parcourir les enregistrements
- **SQL** : Exécuter des requêtes personnalisées
- **Structure** : Voir la structure des tables

- **Recherche** : Rechercher dans les données
- **Tri** : Trier les colonnes
- **Filtres** : Filtrer les résultats
- **Export** : Exporter en CSV, SQL, etc.

```sql
-- Voir tous les utilisateurs
SELECT * FROM users;

-- Compter les utilisateurs
SELECT COUNT(*) FROM users;

-- Voir les utilisateurs actifs
SELECT * FROM users WHERE "isActive" = true;

-- Voir les utilisateurs créés aujourd'hui
SELECT * FROM users WHERE "createdAt" >= CURRENT_DATE;

-- Voir la structure de la table users
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users';
```

```bash
docker-compose logs postgres

docker-compose logs adminer
```

```bash
docker-compose restart postgres

docker-compose restart adminer
```

- ✅ **Léger** : Démarrage rapide
- ✅ **Simple** : Interface intuitive
- ✅ **Moderne** : Thème sombre disponible
- ✅ **Efficace** : Parfait pour le développement
- ✅ **Sécurisé** : Gestion des permissions
- ✅ **Polyvalent** : Supporte plusieurs SGBD
