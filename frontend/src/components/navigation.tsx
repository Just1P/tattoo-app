"use client";

import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api/auth";
import Link from "next/link";

export function Navigation() {
  const handleLogout = async () => {
    try {
      await authApi.logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("access_token");

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Tattoo App
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost">Connexion</Button>
                </Link>
                <Link href="/auth">
                  <Button>Inscription</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
