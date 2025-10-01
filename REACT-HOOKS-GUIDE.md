# Guide React Hooks - Éviter les boucles infinies

## Problème identifié

L'application faisait des appels en boucle à l'endpoint `/posts/my-posts` causant l'erreur `ERR_INSUFFICIENT_RESOURCES`.

## Cause racine

Le problème venait du hook `useBasePosts` dans `useBasePosts.ts` :

```typescript
// ❌ Problématique - boucle infinie
const handleError = createErrorHandler(setError); // Recréé à chaque rendu

const fetchPosts = useCallback(
  async (queryParams?: QueryPostsParams) => {
    // ... logique
  },
  [fetchFunction, params, handleError] // handleError change à chaque rendu
);

useEffect(() => {
  fetchPosts();
}, [params, fetchPosts]); // fetchPosts change à chaque rendu
```

## Solution appliquée

### 1. Stabiliser `handleError`

```typescript
// ✅ Correct - stable
const handleError = useCallback((err: any, message: string) => {
  createErrorHandler(setError)(err, message);
}, []);
```

### 2. Ajouter une protection contre les appels multiples

```typescript
const fetchPosts = useCallback(
  async (queryParams?: QueryPostsParams) => {
    if (isLoading) return; // Éviter les appels multiples simultanés
    // ... logique
  },
  [fetchFunction, params, handleError, isLoading]
);
```

### 3. Ajouter un état de suivi

```typescript
const [hasFetched, setHasFetched] = useState(false);

useEffect(() => {
  if (!hasFetched) {
    fetchPosts();
  }
}, [fetchPosts, hasFetched]);
```

## Bonnes pratiques pour les hooks React

### 1. Stabiliser les dépendances

- Utiliser `useCallback` pour les fonctions
- Utiliser `useMemo` pour les objets complexes
- Éviter de recréer des fonctions à chaque rendu

### 2. Gérer les appels API

- Ajouter des protections contre les appels multiples
- Implémenter un système de cache/état de suivi
- Gérer correctement les états de chargement

### 3. Dépendances useEffect

- Inclure toutes les dépendances utilisées
- Éviter les dépendances qui changent à chaque rendu
- Utiliser des refs si nécessaire pour des valeurs stables

## Hooks mis à jour

- ✅ `useBasePosts` - Protection contre les boucles infinies
- ✅ `useMyPosts` - Exposition de la fonction refetch
- ✅ `usePosts` - Même protection appliquée
