"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { profileApi, type ProfileData } from "@/lib/api/profile";
import { Edit, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await profileApi.getProfile();
      setUser(userData);
    } catch (err) {
      console.error("Erreur lors du chargement du profil:", err);
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/auth")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Bienvenue sur votre tableau de bord</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Mon Profil
                </CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles
                </CardDescription>
              </div>
              <Button onClick={() => router.push("/profile/edit")}>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                    Email
                  </h4>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                    Type d&apos;utilisateur
                  </h4>
                  <p className="text-lg capitalize">{user.userType}</p>
                </div>
                {user.firstName && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                      Prénom
                    </h4>
                    <p className="text-lg">{user.firstName}</p>
                  </div>
                )}
                {user.lastName && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                      Nom
                    </h4>
                    <p className="text-lg">{user.lastName}</p>
                  </div>
                )}
                {user.phone && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                      Téléphone
                    </h4>
                    <p className="text-lg">{user.phone}</p>
                  </div>
                )}
                {user.location && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                      Localisation
                    </h4>
                    <p className="text-lg">{user.location}</p>
                  </div>
                )}
                {user.bio && (
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                      Bio
                    </h4>
                    <p className="text-lg">{user.bio}</p>
                  </div>
                )}
                {user.website && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                      Site web
                    </h4>
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
                {user.instagram && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                      Instagram
                    </h4>
                    <a
                      href={`https://instagram.com/${user.instagram.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {user.instagram}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Aucune information de profil disponible
                </p>
                <Button onClick={() => router.push("/profile")}>
                  Créer mon profil
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push("/profile/edit")}
          >
            <CardContent className="p-6 text-center">
              <Edit className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Modifier le profil</h3>
              <p className="text-sm text-gray-500">
                Mettez à jour vos informations
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Mon compte</h3>
              <p className="text-sm text-gray-500">Gérez votre compte</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <LogOut className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Déconnexion</h3>
              <p className="text-sm text-gray-500">Se déconnecter</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
