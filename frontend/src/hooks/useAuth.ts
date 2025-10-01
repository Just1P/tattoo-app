"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { authApi } from "@/lib/api/auth";
import { useUser } from "@/lib/contexts/UserContext";
import type { LoginFormData, RegisterFormData } from "@/lib/validations/auth";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, refreshUser } = useUser();

  const isLoggedIn = !!user;

  const login = useCallback(
    async (data: LoginFormData) => {
      setIsLoading(true);
      try {
        const response = await authApi.login(data);
        localStorage.setItem("access_token", response.access_token);
        await refreshUser();
        router.push("/");
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshUser, router]
  );

  const register = useCallback(
    async (data: RegisterFormData) => {
      setIsLoading(true);
      try {
        const { confirmPassword, ...registerData } = data;
        void confirmPassword;
        const response = await authApi.register(registerData);
        localStorage.setItem("access_token", response.access_token);
        await refreshUser();
        router.push("/profile");
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshUser, router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
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
    refreshUser,
  };
}
