"use client";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { getInitials } from "@/lib/utils/image";
import { IconEdit } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isLoading, error } = useProfile();

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
      {/* Header du profil */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
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

            {/* Informations du profil */}
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
                Type d&apos;utilisateur
              </h3>
              <p className="text-gray-600 capitalize">{profile.userType}</p>
            </div>
            {profile.phone && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Téléphone</h3>
                <p className="text-gray-600">{profile.phone}</p>
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Membre depuis</h3>
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
      </div>
    </div>
  );
}
