"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { profileApi, type ProfileData } from "@/lib/api/profile";
import { profileSchema, type ProfileFormData } from "@/lib/validations/profile";

interface ProfileFormProps {
  user: ProfileData | null;
  onProfileUpdate: () => void;
}

export function ProfileForm({ user, onProfileUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      instagram: user?.instagram || "",
      userType: user?.userType || "client",
    },
  });

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Impossible de créer le contexte canvas"));
            return;
          }

          const MAX_SIZE = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = (height * MAX_SIZE) / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = (width * MAX_SIZE) / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });

                const originalKB = (file.size / 1024).toFixed(2);
                const compressedKB = (compressedFile.size / 1024).toFixed(2);
                const reduction = (
                  ((file.size - compressedFile.size) / file.size) *
                  100
                ).toFixed(1);

                console.log(`✅ Image compressée:`, {
                  original: `${originalKB} KB`,
                  compressé: `${compressedKB} KB`,
                  réduction: `${reduction}%`,
                  dimensions: `${width}x${height}px`,
                });

                resolve(compressedFile);
              } else {
                reject(new Error("Erreur lors de la compression"));
              }
            },
            "image/jpeg",
            0.8
          );
        };

        img.onerror = () => {
          reject(new Error("Erreur lors du chargement de l'image"));
        };
      };

      reader.onerror = () => {
        reject(new Error("Erreur lors de la lecture du fichier"));
      };
    });
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const sizeInBytes = file.size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
      console.log(`📸 Image originale ajoutée:`, {
        nom: file.name,
        type: file.type,
        poids: `${sizeInBytes} octets`,
        poidsKB: `${sizeInKB} KB`,
        poidsMB: `${sizeInMB} MB`,
      });

      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne peut pas dépasser 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner une image valide");
        return;
      }

      try {
        const compressed = await compressImage(file);
        setCompressedFile(compressed);

        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(compressed);

        setError(null);
      } catch (err) {
        console.error("Erreur lors de la compression:", err);
        setError("Erreur lors du traitement de l'image");
      }
    }
  };

  const uploadAvatarIfNeeded = async (): Promise<string | undefined> => {
    if (!compressedFile) return undefined;

    try {
      const result = await profileApi.uploadAvatar(compressedFile);
      return result.avatarUrl;
    } catch (err) {
      console.error("Erreur lors de l'upload de l'avatar:", err);
      throw new Error("Erreur lors de l'upload de l'avatar");
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const avatarUrl = await uploadAvatarIfNeeded();

      const profileData = avatarUrl ? { ...data, avatar: avatarUrl } : data;
      await profileApi.updateProfile(profileData);

      await onProfileUpdate();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {avatarPreview || user?.avatar ? (
              <Image
                src={avatarPreview || user?.avatar || ""}
                alt="Avatar"
                fill
                className="object-cover rounded-full"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <Button
            type="button"
            size="sm"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type d&apos;utilisateur *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="artist">Artiste</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+33 6 12 34 56 78" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation</FormLabel>
                  <FormControl>
                    <Input placeholder="Paris, France" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Parlez-nous de vous..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <Input placeholder="https://votresite.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="@votrecompte" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {user ? "Mettre à jour le profil" : "Créer le profil"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              disabled={isLoading}
            >
              Passer pour l&apos;instant
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
