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

export const registerSchema = z
    .object({
        fullName: z
            .string()
            .min(1, "El nombre es obligatorio")
            .min(2, "El nombre debe tener al menos 2 caracteres"),

        email: z
            .string()
            .min(1, "El email es obligatorio")
            .email("Introduce un email válido"),

        password: z
            .string()
            .min(1, "La contraseña es obligatoria")
            .min(6, "La contraseña debe tener al menos 6 caracteres"),

        confirmPassword: z
            .string()
            .min(1, "Confirma tu contraseña"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;