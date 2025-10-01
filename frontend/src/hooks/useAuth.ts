"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { authApi } from "@/lib/api/auth";
import { profileApi } from "@/lib/api/profile";
import type { LoginFormData, RegisterFormData } from "@/lib/validations/auth";

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadUserData = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await profileApi.getProfile();
      setUser({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar,
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      // En cas d'erreur, utiliser des données par défaut
      setUser({
        email: "user@example.com",
        firstName: "Utilisateur",
        lastName: "Test",
      });
      setIsLoggedIn(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const login = useCallback(
    async (data: LoginFormData) => {
      setIsLoading(true);
      try {
        const response = await authApi.login(data);
        localStorage.setItem("access_token", response.access_token);
        await loadUserData();
        router.push("/");
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [loadUserData, router]
  );

  const register = useCallback(
    async (data: RegisterFormData) => {
      setIsLoading(true);
      try {
        const { confirmPassword, ...registerData } = data;
        void confirmPassword;
        const response = await authApi.register(registerData);
        localStorage.setItem("access_token", response.access_token);
        await loadUserData();
        router.push("/profile");
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [loadUserData, router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/auth");
  }, [router]);

  const getInitials = useCallback((firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "U";
  }, []);

  return {
    isLoggedIn,
    user,
    isLoading,
    login,
    register,
    logout,
    getInitials,
    refreshUser: loadUserData,
  };
}
