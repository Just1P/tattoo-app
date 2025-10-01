import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(2000, "La description ne peut pas dépasser 2000 caractères"),
  images: z.array(z.string().min(1, "URL d'image invalide")).optional(),
  tags: z.array(z.string().min(1, "Un tag ne peut pas être vide")).optional(),
  category: z.enum(["tattoo", "flash", "inspiration", "other"]),
  isPublic: z.boolean(),
  location: z
    .string()
    .min(2, "La localisation doit contenir au moins 2 caractères")
    .max(100, "La localisation ne peut pas dépasser 100 caractères")
    .optional(),
  price: z
    .number()
    .min(0, "Le prix ne peut pas être négatif")
    .max(99999.99, "Le prix ne peut pas dépasser 99999.99")
    .optional(),
  status: z.enum(["available", "booked", "completed"]),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial();

export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
