import { z } from "zod";

export const profileSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(120, "El nombre no puede tener más de 120 caracteres"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;