"use client";

import { usePathname } from "next/navigation";

import { Logo } from "./navigation/Logo";
import { NavLinks } from "./navigation/NavLinks";
import { UserMenu } from "./navigation/UserMenu";

export default function Navigation() {
  const pathname = usePathname();

  if (pathname.startsWith("/auth")) {
    return null; // Ne pas afficher la navigation sur les pages d'authentification
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo />
        <NavLinks />
        <UserMenu />
      </div>
    </nav>
  );
}
