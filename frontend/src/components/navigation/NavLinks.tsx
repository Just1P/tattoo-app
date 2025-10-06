"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function NavLinks() {
  const router = useRouter();

  return (
    <div className="hidden md:flex items-center space-x-6">
      <Button variant="ghost" onClick={() => router.push("/")}>
        Accueil
      </Button>
      <Button variant="ghost" onClick={() => router.push("/gallery")}>
        Galerie
      </Button>
      <Button variant="ghost" onClick={() => router.push("/profile")}>
        Profil
      </Button>
    </div>
  );
}
