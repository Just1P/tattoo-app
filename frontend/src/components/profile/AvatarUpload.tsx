"use client";

import { Camera, User } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ProfileData } from "@/lib/api/profile";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { compressImage, validateImageFile } from "@/lib/utils/image";

interface AvatarUploadProps {
  user: ProfileData | null;
  onAvatarChange: (file: File) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export function AvatarUpload({
  user,
  onAvatarChange,
  onError,
  isLoading = false,
}: AvatarUploadProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file, MAX_FILE_SIZE);
    if (validationError) {
      onError(validationError);
      return;
    }

    try {
      const compressed = await compressImage(file);
      setCompressedFile(compressed);
      onAvatarChange(compressed);

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(compressed);

      onError("");
    } catch (err) {
      console.error("Erreur lors de la compression:", err);
      onError("Erreur lors du traitement de l'image");
    }
  };

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar?.startsWith("http")) {
      return user.avatar.replace("localhost:3000", "localhost:3001");
    }
    if (user?.avatar) {
      return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${
        user.avatar
      }`;
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {getAvatarSrc() ? (
            <Image
              src={getAvatarSrc()!}
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
  );
}
