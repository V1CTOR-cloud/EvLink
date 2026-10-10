"use client";

import type { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { loginSchema, type LoginFormData } from "@/schemas/auth";
import Link from "next/link";

type LoginFormProps = Omit<ComponentProps<"form">, "onSubmit"> & {
  onSubmit: (data: LoginFormData) => Promise<void>;
};

export function LoginForm({ className, onSubmit, ...props }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleValidationError = (
    errors: Record<
      string,
      {
        message?: string;
      }
    >,
  ) => {
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit, handleValidationError)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Inicia sesión
          </h1>

          <p className="text-sm text-muted-foreground">
            Accede a tu cuenta de EvLink
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            {...register("email")}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
          />
        </Field>

        <Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            No tienes una cuenta? <Link href="/register">Registro</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
