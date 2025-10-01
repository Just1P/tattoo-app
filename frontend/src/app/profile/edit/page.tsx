"use client";

import { ProfileForm } from "@/components/profile/profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { profileApi, type ProfileData } from "@/lib/api/profile";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function EditProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<ProfileData | null>(null);
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

  const handleProfileUpdate = async () => {
    await loadUserProfile();
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
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Modifier votre profil
            </CardTitle>
            <CardDescription className="text-lg">
              Mettez à jour vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} onProfileUpdate={handleProfileUpdate} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
