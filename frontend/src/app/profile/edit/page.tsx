"use client";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ProfileForm } from "@/components/profile/profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

export default function EditProfilePage() {
  const { profile, isLoading, loadProfile } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
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
            <ProfileForm user={profile} onProfileUpdate={loadProfile} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
