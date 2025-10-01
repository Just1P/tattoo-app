"use client";

import { profileApi } from "@/lib/api/profile";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  userType?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  instagram?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userData = await profileApi.getProfile();
      setUser({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar,
        userType: userData.userType,
        phone: userData.phone,
        bio: userData.bio,
        location: userData.location,
        website: userData.website,
        instagram: userData.instagram,
      });
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      setUser({
        email: "user@example.com",
        firstName: "Utilisateur",
        lastName: "Test",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
