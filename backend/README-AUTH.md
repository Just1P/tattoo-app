

- ✅ **Inscription** d'utilisateurs avec validation
- ✅ **Connexion** avec JWT
- ✅ **Protection des routes** avec Guards
- ✅ **Hachage sécurisé** des mots de passe (bcrypt)
- ✅ **Validation des données** avec class-validator
- ✅ **Base de données** PostgreSQL avec TypeORM


1. **PostgreSQL** installé et démarré
2. **Node.js** (version 18+)
3. **pnpm** installé


1. **Installer les dépendances :**

   ```bash
   pnpm install
   ```

2. **Configurer l'environnement :**

   ```bash
   cp env.example .env
   ```

3. **Démarrer PostgreSQL :**

   ```bash
   ./start-db.sh

   docker-compose up -d postgres
   ```

4. **Démarrer l'application :**
   ```bash
   pnpm run start:dev
   ```



```bash
./start-db.sh
docker-compose up -d postgres
```


```bash
./stop-db.sh
docker-compose down
```


```bash
docker-compose logs postgres
```


```bash
docker-compose exec postgres psql -U postgres -d tatoo_app
```



```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+33123456789" // optionnel
}
```


```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse :**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+33123456789"
  }
}
```


```http
GET /auth/profile
Authorization: Bearer <access_token>
```


- **JWT** avec expiration de 24h
- **Mots de passe** hachés avec bcrypt (salt rounds: 10)
- **Validation** stricte des données d'entrée
- **CORS** activé pour les requêtes cross-origin



**Inscription :**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Connexion :**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Profil (avec token) :**

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```


```
src/
├── auth/
│   ├── dto/                 # DTOs de validation
│   ├── guards/              # Guards d'authentification
│   ├── strategies/          # Stratégies Passport
│   ├── auth.controller.ts   # Contrôleur des endpoints
│   ├── auth.service.ts      # Logique métier
│   └── auth.module.ts       # Module d'auth
├── users/
│   ├── entities/            # Entités TypeORM
│   ├── users.service.ts     # Service utilisateurs
│   └── users.module.ts      # Module utilisateurs
└── app.module.ts            # Module principal
```


Les variables d'environnement sont dans le fichier `.env` :

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=tatoo_app
JWT_SECRET=votre-secret-jwt-super-securise
NODE_ENV=development
```


- Changez le `JWT_SECRET` en production
- Désactivez `synchronize: true` en production
- Utilisez des migrations TypeORM pour la production
- Ajoutez un système de refresh tokens pour plus de sécurité
