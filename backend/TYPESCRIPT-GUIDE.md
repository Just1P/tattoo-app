# Guide TypeScript - Éviter les erreurs "unsafe member"

## Problème

Les erreurs "unsafe member" apparaissent quand TypeScript ne peut pas garantir la sécurité des propriétés d'objets, notamment `req.user` dans les contrôleurs NestJS.

## Solution

### 1. Créer une interface UserRequest

```typescript
// src/auth/interfaces/user-request.interface.ts
import { User } from '../../users/entities/user.entity';

export interface UserRequest extends Request {
  user: User;
}
```

### 2. Utiliser l'interface dans les contrôleurs

```typescript
// ❌ Mauvais - erreur "unsafe member"
@Get('profile')
getProfile(@Request() req) {
  return req.user; // TypeScript ne sait pas que req.user existe
}

// ✅ Bon - typé correctement
@Get('profile')
getProfile(@Request() req: UserRequest) {
  return req.user; // TypeScript sait que req.user est de type User
}
```

### 3. Importer avec `import type`

```typescript
// ✅ Correct pour les types uniquement
import type { UserRequest } from '../auth/interfaces';
```

### 4. Exporter depuis un index

```typescript
// src/auth/interfaces/index.ts
export type { UserRequest } from './user-request.interface';
```

## Contrôleurs mis à jour

- ✅ `posts.controller.ts`
- ✅ `auth.controller.ts`
- ✅ `profile.controller.ts`

## Bonnes pratiques

1. **Toujours typer les paramètres `@Request()`** avec `UserRequest`
2. **Utiliser `import type`** pour les interfaces
3. **Créer des interfaces réutilisables** plutôt que de dupliquer les types
4. **Exporter depuis un index** pour faciliter les imports
