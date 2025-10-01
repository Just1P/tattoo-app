# Tattoo App

Application complète de gestion de tatouages avec frontend et backend.

## Structure du projet

```
tattoo-app/
├── frontend/          # Application Next.js
├── backend/           # API NestJS
└── README.md
```

## Frontend (Next.js)

Le frontend est une application Next.js qui gère l'interface utilisateur.

### Installation

```bash
cd frontend
npm install
# ou
pnpm install
```

### Démarrage

```bash
npm run dev
# ou
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Backend (NestJS)

Le backend est une API NestJS qui gère la logique métier et la base de données.

### Installation

```bash
cd backend
npm install
# ou
pnpm install
```

### Démarrage

```bash
npm run start:dev
# ou
pnpm start:dev
```

L'API sera accessible sur [http://localhost:3001](http://localhost:3001)

## Technologies utilisées

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, Prisma (ou TypeORM)
- **Base de données**: PostgreSQL (ou autre selon votre configuration)

## Développement

Pour démarrer les deux applications en même temps, vous pouvez utiliser des outils comme `concurrently` ou simplement ouvrir deux terminaux.

## Licence

[MIT](LICENSE)
