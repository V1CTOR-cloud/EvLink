"use client";

import type { ComponentProps } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
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

import { registerSchema, type RegisterFormData } from "@/schemas/auth";
import Link from "next/link";

type RegisterFormProps = Omit<ComponentProps<"form">, "onSubmit"> & {
  onSubmit: (data: RegisterFormData) => Promise<void>;
};

export function RegisterForm({
  className,
  onSubmit,
  ...props
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleValidationError = (errors: FieldErrors<RegisterFormData>) => {
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error(String(firstError.message));
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit, handleValidationError)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Crear cuenta
          </h1>

          <p className="text-sm text-muted-foreground">
            Crea tu cuenta de EvLink
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="fullName">Nombre completo</FieldLabel>

          <Input
            id="fullName"
            type="text"
            placeholder="Víctor García"
            autoComplete="name"
            {...register("fullName")}
          />
        </Field>

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
            autoComplete="new-password"
            {...register("password")}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">
            Confirmar contraseña
          </FieldLabel>

          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
        </Field>

        <Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Ya tienes una cuenta? <Link href="/login">Login</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
