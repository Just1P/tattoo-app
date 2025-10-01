import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 2,
      "Le prénom doit contenir au moins 2 caractères"
    ),
  lastName: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 2,
      "Le nom doit contenir au moins 2 caractères"
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[\d\s\-\(\)]{10,}$/.test(val),
      "Format de téléphone invalide"
    ),
  bio: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 500,
      "La bio ne peut pas dépasser 500 caractères"
    ),
  location: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 2,
      "La localisation doit contenir au moins 2 caractères"
    ),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "L'URL doit commencer par http:// ou https://"
    ),
  instagram: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^@?[a-zA-Z0-9._]{1,30}$/.test(val),
      "Format Instagram invalide"
    ),
  userType: z.enum(["client", "artist"], {
    message: "Veuillez sélectionner un type d'utilisateur",
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
