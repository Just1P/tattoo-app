"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useProfile } from "@/hooks/useProfile";
import type { ProfileData, ProfileFormData } from "@/lib/api/profile";
import { AvatarUpload } from "./AvatarUpload";
import { ProfileFormFields } from "./ProfileFormFields";

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

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      setError(null);

      let avatarUrl: string | undefined;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      const profileData = avatarUrl ? { ...data, avatar: avatarUrl } : data;
      await updateProfile(profileData);
      await onProfileUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
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
