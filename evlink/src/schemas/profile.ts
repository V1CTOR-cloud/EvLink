import { z } from "zod";

export const profileSchema = z.object({
    fullName: z
        .string()
        .min(1, "El nombre es obligatorio")
        .min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;