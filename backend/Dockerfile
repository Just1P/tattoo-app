# Étape 1: Image de base Node.js
FROM node:18-alpine

# Étape 2: Définir le répertoire de travail
WORKDIR /app

# Étape 3: Copier les fichiers de dépendances
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Étape 4: Installer pnpm et les dépendances
RUN npm install -g pnpm
RUN pnpm install

# Étape 5: Copier le code source
COPY . .

# Étape 6: Compiler l'application
RUN pnpm run build

# Étape 7: Exposer le port
EXPOSE 3000

# Étape 8: Commande de démarrage
CMD ["pnpm", "run", "start:prod"]
