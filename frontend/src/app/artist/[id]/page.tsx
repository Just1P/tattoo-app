"use client";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PostCard } from "@/components/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { postsApi } from "@/lib/api/posts";
import type { Post } from "@/lib/types/posts";
import { getInitials } from "@/lib/utils/image";
import { IconBrandInstagram, IconGlobe, IconMapPin } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PublicProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  instagram?: string;
  userType: "client" | "artist";
  avatar?: string;
  createdAt: string;
}

export default function ArtistPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params.id as string;

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLike = async (postId: string) => {
    try {
      const updatedPost = await postsApi.like(postId);
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? updatedPost : post))
      );
    } catch (err) {
      console.error("Erreur lors du like:", err);
    }
  };

  const handleUnlike = async (postId: string) => {
    try {
      const updatedPost = await postsApi.unlike(postId);
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? updatedPost : post))
      );
    } catch (err) {
      console.error("Erreur lors du unlike:", err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await fetch(
          `http://localhost:3001/profile/public/${artistId}`
        );

        if (!response.ok) {
          throw new Error("Profil non trouvé");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
      } finally {
        setIsLoadingProfile(false);
      }
    };

    const fetchPosts = async () => {
      try {
        setIsLoadingPosts(true);
        const data = await postsApi.findAll({
          authorId: artistId,
          limit: 50,
        });
        setPosts(data.posts);
      } catch (err) {
        console.error("Erreur lors du chargement des posts:", err);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchProfile();
    fetchPosts();
  }, [artistId]);

  if (isLoadingProfile) {
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
          <Button onClick={() => router.push("/gallery")}>
            Retour à la galerie
          </Button>
        </div>
      </div>
    );
  }

  const displayName =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.firstName || profile.lastName || "Artiste";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec profil */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              {profile.avatar && (
                <AvatarImage
                  src={profile.avatar.replace(
                    "localhost:3000",
                    "localhost:3001"
                  )}
                  alt={displayName}
                />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
                {getInitials(profile.firstName, profile.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {displayName}
              </h1>

              {profile.userType === "artist" && (
                <p className="text-primary font-medium mb-2">
                  Artiste Tatoueur
                </p>
              )}

              {profile.bio && (
                <p className="text-gray-600 mb-4 max-w-2xl">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                {profile.location && (
                  <div className="flex items-center text-gray-500">
                    <IconMapPin className="h-4 w-4 mr-1" />
                    {profile.location}
                  </div>
                )}

                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-primary/80"
                  >
                    <IconGlobe className="h-4 w-4 mr-1" />
                    Site web
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
                    className="flex items-center text-primary hover:text-primary/80"
                  >
                    <IconBrandInstagram className="h-4 w-4 mr-1" />
                    {profile.instagram}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Galerie de posts */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Portfolio ({posts.length})
        </h2>

        {isLoadingPosts ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">
                Cet artiste n&apos;a pas encore publié de posts
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showActions
                hideProfileButton
                onLike={handleLike}
                onUnlike={handleUnlike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
