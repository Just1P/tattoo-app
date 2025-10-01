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

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<ProfileData | null>(null);
  const router = useRouter();

  const loadUserProfile = useCallback(async () => {
    try {
      const userData = await profileApi.getProfile();
      setUser(userData);

      if (userData && userData.userType) {
        router.push("/dashboard");
        return;
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Créer votre profil
            </CardTitle>
            <CardDescription className="text-lg">
              Complétez votre profil pour personnaliser votre expérience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} onProfileUpdate={loadUserProfile} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
