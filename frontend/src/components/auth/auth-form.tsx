"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import type { LoginFormData, RegisterFormData } from "@/lib/validations/auth";
import { LoginForm, RegisterForm } from "./components";

type AuthMode = "login" | "register";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const { login, register, isLoading } = useAuth();

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
  };

  const handleLogin = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setError(null);
      await register(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  return (
    <Card className="w-full border-0 shadow-none lg:shadow-lg lg:border lg:bg-white bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {mode === "login" ? "Connexion" : "Inscription"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Entrez vos identifiants pour vous connecter à votre compte"
            : "Créez votre compte pour commencer à utiliser l&apos;application"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === "login" ? (
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />
        )}

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">
            {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
          </span>
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-primary hover:underline"
            onClick={toggleMode}
            disabled={isLoading}
          >
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
