"use client";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PostCard } from "@/components/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePosts } from "@/hooks/usePosts";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { useState } from "react";

type PostCategory = "tattoo" | "flash" | "inspiration" | "other";

const CATEGORIES = [
  { value: "tattoo" as const, label: "Tatouage" },
  { value: "flash" as const, label: "Flash" },
  { value: "inspiration" as const, label: "Inspiration" },
  { value: "other" as const, label: "Autre" },
];

export default function GalleryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PostCategory | "">("");
  const [showFilters, setShowFilters] = useState(false);

  const { posts, isLoading, error, likePost, unlikePost } = usePosts({
    search: search || undefined,
    category: (category || undefined) as PostCategory | undefined,
    limit: 50,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setCategory("");
    } else {
      setCategory(value as PostCategory);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec recherche */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Découvrir</h1>
              <p className="text-gray-500 text-sm">
                Explorez les créations des artistes tatoueurs
              </p>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              {/* Barre de recherche */}
              <div className="relative flex-1 md:w-80">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un style, artiste..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Bouton filtres */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <IconFilter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Catégorie
                  </label>
                  <Select
                    value={category || "all"}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex items-end">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearch("");
                      setCategory("");
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun post trouvé{search && ` pour "${search}"`}
            </p>
            {(search || category) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory("");
                }}
                className="mt-4"
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showActions
                onLike={likePost}
                onUnlike={unlikePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
