"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Palette, User } from "lucide-react";
import { useForm } from "react-hook-form";

import { ErrorMessage } from "@/components/common/ErrorMessage";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PasswordInput } from "@/components/common/PasswordInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function RegisterForm({
  onSubmit,
  isLoading,
  error,
}: RegisterFormProps) {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      userType: "client",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de compte</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-3">
                  <Card
                    className={`p-4 cursor-pointer transition-all hover:border-primary ${
                      field.value === "client"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => {
                      if (!isLoading) field.onChange("client");
                    }}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <User
                        className={`h-8 w-8 ${
                          field.value === "client"
                            ? "text-primary"
                            : "text-gray-500"
                        }`}
                      />
                      <div>
                        <p className="font-semibold">Client</p>
                        <p className="text-xs text-gray-500">
                          Je cherche un tatoueur
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className={`p-4 cursor-pointer transition-all hover:border-primary ${
                      field.value === "artist"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => {
                      if (!isLoading) field.onChange("artist");
                    }}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <Palette
                        className={`h-8 w-8 ${
                          field.value === "artist"
                            ? "text-primary"
                            : "text-gray-500"
                        }`}
                      />
                      <div>
                        <p className="font-semibold">Artiste</p>
                        <p className="text-xs text-gray-500">
                          Je suis tatoueur
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </FormControl>
              <FormDescription>
                Sélectionnez le type de compte qui vous correspond
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <PasswordInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <FormControl>
                <PasswordInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Confirmez votre mot de passe"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ErrorMessage message={error || ""} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
          S&apos;inscrire
        </Button>
      </form>
    </Form>
  );
}
