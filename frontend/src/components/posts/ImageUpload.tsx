"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { postsApi } from "@/lib/api/posts";
import { cn } from "@/lib/utils";
import { IconPhoto, IconTrash } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        alert(`Vous ne pouvez ajouter que ${maxImages} images maximum`);
        return;
      }

      setIsUploading(true);
      try {
        // Upload réel des images
        const uploadPromises = acceptedFiles.map((file) =>
          postsApi.uploadImage(file)
        );
        const uploadedUrls = await Promise.all(uploadPromises);
        onImagesChange([...images, ...uploadedUrls]);
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        alert("Erreur lors de l'upload des images");
      } finally {
        setIsUploading(false);
      }
    },
    [images, onImagesChange, maxImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: true,
    disabled: isUploading || images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Label>
        Images ({images.length}/{maxImages})
      </Label>

      {/* Zone de drop */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-16 text-center cursor-pointer transition-colors min-h-[300px] flex items-center justify-center",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400",
          isUploading && "opacity-50 cursor-not-allowed",
          images.length >= maxImages && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          ) : (
            <IconPhoto className="h-8 w-8 text-gray-400" />
          )}
          <div className="text-sm text-gray-600">
            {isDragActive ? (
              <p>Déposez vos images ici...</p>
            ) : images.length >= maxImages ? (
              <p>Nombre maximum d'images atteint</p>
            ) : (
              <div>
                <p className="font-medium">
                  Glissez-déposez vos images ou{" "}
                  <span className="text-primary">
                    cliquez pour sélectionner
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF jusqu'à 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prévisualisation des images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="h-8 w-8 p-0"
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-2 right-2">
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
