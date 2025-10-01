"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { profileApi } from "@/lib/api/profile";
import {
  IconLayoutDashboard,
  IconLogout,
  IconPaint,
  IconUser,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        setIsLoggedIn(true);
        try {
          // Récupérer les vraies données de l'utilisateur depuis l'API
          const userData = await profileApi.getProfile();
          setUser({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatar: userData.avatar,
          });
        } catch (error) {
          console.error("Erreur lors du chargement du profil:", error);
          // En cas d'erreur, utiliser des données par défaut
          setUser({
            email: "user@example.com",
            firstName: "Utilisateur",
            lastName: "Test",
          });
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/auth");
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  if (pathname.startsWith("/auth")) {
    return null; // Ne pas afficher la navigation sur les pages d'authentification
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <IconPaint size={24} className="text-gray-800" />
          <span className="text-xl font-bold text-gray-900">Tattoo App</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" onClick={() => router.push("/")}>
            Accueil
          </Button>
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => router.push("/profile")}>
            Profil
          </Button>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    {user?.avatar && (
                      <AvatarImage
                        src={user.avatar}
                        alt={user?.email || "Avatar"}
                      />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      {getInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <IconUser className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <IconLayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <IconLogout className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push("/auth")}>Se connecter</Button>
          )}
        </div>
      </div>
    </nav>
  );
}
