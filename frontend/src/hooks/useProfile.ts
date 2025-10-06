"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { profileApi, type ProfileData } from "@/lib/api/profile";
import { useUser } from "@/lib/contexts/UserContext";
import type { ProfileFormData } from "@/lib/validations/profile";

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, refreshUser } = useUser();

  const profile: ProfileData | null = user
    ? {
        id: "",
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        userType: (user.userType as "client" | "artist") || "client",
        phone: user.phone,
        bio: user.bio,
        location: user.location,
        website: user.website,
        instagram: user.instagram,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    : null;

  const loadProfile = useCallback(async () => {
    await refreshUser();
  }, [refreshUser]);

  const updateProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        setIsLoading(true);
        setError(null);
        await profileApi.updateProfile(data);
        await refreshUser();
        router.push("/gallery");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la mise à jour"
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshUser, router]
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      try {
        const result = await profileApi.uploadAvatar(file);
        await refreshUser();
        return result.avatarUrl;
      } catch (err) {
        console.error("Erreur lors de l'upload de l'avatar:", err);
        throw new Error("Erreur lors de l'upload de l'avatar");
      }
    },
    [refreshUser]
  );

  const getInitials = useCallback((firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "U";
  }, []);

  return {
    profile,
    isLoading,
    error,
    loadProfile,
    updateProfile,
    uploadAvatar,
    getInitials,
  };
}
