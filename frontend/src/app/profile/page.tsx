"use client";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { CreatePostForm, PostCard } from "@/components/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyPosts } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
import { getInitials } from "@/lib/utils/image";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isLoading, error } = useProfile();
  const { posts, isLoading: postsLoading, refetchMyPosts } = useMyPosts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const firstPostRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Profil non trouvé"}
          </h2>
          <Button onClick={() => router.push("/auth")}>Se connecter</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {profile.avatar && (
                  <AvatarImage
                    src={profile.avatar.replace(
                      "localhost:3000",
                      "localhost:3001"
                    )}
                    alt={profile.email}
                  />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">
                  {getInitials(profile.firstName, profile.lastName)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.firstName && profile.lastName
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile.email}
              </h1>

              {profile.bio && (
                <p className="text-gray-600 mb-4 max-w-2xl">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                {profile.location && <span>📍 {profile.location}</span>}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    🌐 Site web
                  </a>
                )}
                {profile.instagram && (
                  <a
                    href={`https://instagram.com/${profile.instagram.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    📷 {profile.instagram}
                  </a>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline" asChild>
                  <a href="/profile/edit">
                    <IconEdit className="h-4 w-4 mr-2" />
                    Modifier le profil
                  </a>
                </Button>
                {profile.userType === "artist" && (
                  <Button onClick={() => setShowCreateForm(true)}>
                    <IconPlus className="h-4 w-4 mr-2" />
                    Créer un post
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {profile.userType === "artist" ? (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="about">À propos</TabsTrigger>
              <TabsTrigger value="posts">Mes posts</TabsTrigger>
            </TabsList>
          ) : (
            <TabsList className="w-full">
              <TabsTrigger value="about" className="flex-1">
                À propos
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="about">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                À propos
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Type d&apos;utilisateur
                  </h3>
                  <p className="text-gray-600 capitalize">{profile.userType}</p>
                </div>
                {profile.phone && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Téléphone
                    </h3>
                    <p className="text-gray-600">{profile.phone}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Membre depuis
                  </h3>
                  <p className="text-gray-600">
                    {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {profile.userType === "artist" && (
            <TabsContent value="posts">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Créer un post
                    </h2>
                    {!showCreateForm && (
                      <Button onClick={() => setShowCreateForm(true)}>
                        <IconPlus className="h-4 w-4 mr-2" />
                        Nouveau post
                      </Button>
                    )}
                  </div>

                  {showCreateForm && (
                    <div className="border-t pt-6">
                      <CreatePostForm
                        onSuccess={async () => {
                          setShowCreateForm(false);
                          setActiveTab("posts"); // Changer vers l'onglet posts
                          await refetchMyPosts(); // Rafraîchir la liste des posts

                          // Scroller vers le premier post (le dernier créé) après un court délai
                          setTimeout(() => {
                            firstPostRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }, 100);
                        }}
                        onCancel={() => setShowCreateForm(false)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Mes posts
                  </h2>

                  {postsLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Vous n&apos;avez pas encore créé de posts.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post, index) => (
                        <div
                          key={post.id}
                          ref={index === 0 ? firstPostRef : null}
                        >
                          <PostCard
                            post={post}
                            showActions={profile.userType === "artist"}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
