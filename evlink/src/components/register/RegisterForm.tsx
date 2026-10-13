"use client";

import type { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
    formState: { isSubmitting, errors },
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

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
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
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {errors.fullName.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {errors.password.message}
            </p>
          )}
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
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p
              id="confirmPassword-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {errors.confirmPassword.message}
            </p>
          )}
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
