"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { profileApi, type ProfileData } from "@/lib/api/profile";
import type { ProfileFormData } from "@/lib/validations/profile";

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await profileApi.getProfile();
      setProfile(userData);
    } catch (err) {
      console.error("Erreur lors du chargement du profil:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement du profil"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        setIsLoading(true);
        setError(null);
        await profileApi.updateProfile(data);
        await loadProfile();
        router.push("/dashboard");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la mise à jour"
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadProfile, router]
  );

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      const result = await profileApi.uploadAvatar(file);
      return result.avatarUrl;
    } catch (err) {
      console.error("Erreur lors de l'upload de l'avatar:", err);
      throw new Error("Erreur lors de l'upload de l'avatar");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth");
      return;
    }
    loadProfile();
  }, [loadProfile, router]);

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
