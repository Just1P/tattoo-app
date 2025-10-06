"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useProfile } from "@/hooks/useProfile";
import type { ProfileData, UpdateProfileData } from "@/lib/api/profile";
import { AvatarUpload, ProfileFormFields } from "./components";

interface ProfileFormProps {
  user: ProfileData | null;
  onProfileUpdate: () => void;
}

export function ProfileForm({ user, onProfileUpdate }: ProfileFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();
  const { updateProfile, uploadAvatar, isLoading } = useProfile();

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSubmit = async (
    data: Omit<UpdateProfileData, "userType" | "avatar">
  ) => {
    try {
      setError(null);

      let avatarUrl: string | undefined;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      const profileData: UpdateProfileData = {
        ...data,
        ...(avatarUrl && { avatar: avatarUrl }),
      };
      await updateProfile(profileData);
      await onProfileUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleCancel = () => {
    router.push("/gallery");
  };

  return (
    <div className="space-y-6">
      <AvatarUpload
        user={user}
        onAvatarChange={handleAvatarChange}
        onError={handleError}
        isLoading={isLoading}
      />

      <ProfileFormFields
        user={user}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
