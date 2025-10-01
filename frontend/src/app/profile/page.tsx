"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { profileApi, type ProfileData } from "@/lib/api/profile";
import { IconEdit } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<"profile">("profile");
  const router = useRouter();

  const loadUserProfile = useCallback(async () => {
    try {
      const userData = await profileApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth");
      return;
    }

    loadUserProfile();
  }, [router, loadUserProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Profil non trouvé
          </h2>
          <Button onClick={() => router.push("/auth")}>Se connecter</Button>
        </div>
      </div>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header du profil */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24">
                {user.avatar && (
                  <AvatarImage
                    src={user.avatar.replace(
                      "localhost:3000",
                      "localhost:3001"
                    )}
                    alt={user.email}
                  />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Informations du profil */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email}
              </h1>

              {user.bio && (
                <p className="text-gray-600 mb-4 max-w-2xl">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                {user.location && <span>📍 {user.location}</span>}
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    🌐 Site web
                  </a>
                )}
                {user.instagram && (
                  <a
                    href={`https://instagram.com/${user.instagram.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    📷 {user.instagram}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu du profil */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">À propos</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Type d'utilisateur
              </h3>
              <p className="text-gray-600 capitalize">{user.userType}</p>
            </div>
            {user.phone && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Téléphone</h3>
                <p className="text-gray-600">{user.phone}</p>
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Membre depuis</h3>
              <p className="text-gray-600">
                {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
