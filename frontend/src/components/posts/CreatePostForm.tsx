"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMyPosts } from "@/hooks/usePosts";
import { POST_CATEGORIES, POST_STATUS } from "@/lib/types/posts";
import { CreatePostFormData, createPostSchema } from "@/lib/validations/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ImageUpload } from "./ImageUpload";

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const { createPost } = useMyPosts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      category: "tattoo",
      isPublic: true,
      status: "available",
      tags: [],
      images: [],
    },
  });

  const watchedTags = watch("tags") || [];
  const watchedImages = watch("images") || [];

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue("tags", [...watchedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (data: CreatePostFormData) => {
    setIsSubmitting(true);
    try {
      await createPost(data);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Erreur lors de la création du post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Titre de votre post..."
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Décrivez votre post en détail..."
            rows={4}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={watch("category")}
              onValueChange={(value) =>
                setValue(
                  "category",
                  value as "tattoo" | "flash" | "inspiration" | "other"
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={POST_CATEGORIES.TATTOO}>Tatouage</SelectItem>
                <SelectItem value={POST_CATEGORIES.FLASH}>Flash</SelectItem>
                <SelectItem value={POST_CATEGORIES.INSPIRATION}>
                  Inspiration
                </SelectItem>
                <SelectItem value={POST_CATEGORIES.OTHER}>Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={watch("status")}
              onValueChange={(value) =>
                setValue(
                  "status",
                  value as "available" | "booked" | "completed"
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={POST_STATUS.AVAILABLE}>
                  Disponible
                </SelectItem>
                <SelectItem value={POST_STATUS.BOOKED}>Réservé</SelectItem>
                <SelectItem value={POST_STATUS.COMPLETED}>Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Ville, pays..."
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="text-sm text-red-500 mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price", { valueAsNumber: true })}
              placeholder="0.00"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-500 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Ajouter un tag..."
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {watchedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <ImageUpload
          images={watchedImages}
          onImagesChange={(images) => setValue("images", images)}
          maxImages={5}
        />

        <div className="flex items-center space-x-2">
          <Switch
            id="isPublic"
            checked={watch("isPublic")}
            onCheckedChange={(checked) => setValue("isPublic", checked)}
          />
          <Label htmlFor="isPublic">Post public</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Création..." : "Créer le post"}
        </Button>
      </div>
    </form>
  );
}
