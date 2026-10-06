import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .email("Introduce un email válido")
        .min(1, "El email es obligatorio"),

    password: z
        .string()
        .min(1, "La contraseña es obligatoria")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;