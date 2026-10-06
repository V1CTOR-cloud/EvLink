"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

import {
  profileSchema,
  type ProfileFormData,
} from "@/schemas/profile";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, error, update } = useProfile(user?.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.full_name,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await update(data.fullName);

      toast.success("Perfil actualizado");
    } catch {
      toast.error("No se pudo actualizar el perfil");
    }
  };

  if (loading) {
    return (
      <main className="p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-muted-foreground">
            Cargando perfil...
          </p>
        </div>
      </main>
    );
  }

  if (error || !profile || !user) {
    return (
      <main className="p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-destructive">
            No se pudo cargar el perfil.
          </p>
        </div>
      </main>
    );
  }

  const name = profile.full_name || "Usuario";
  const email = user.email ?? "";

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const roleLabel =
    profile.role === "admin"
      ? "Administrador"
      : "Conductor";

  return (
    <main className="p-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Perfil
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona tu cuenta y tu información personal.
          </p>
        </div>

        <section className="border-b border-border pb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar className="size-20 shrink-0">
              <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold tracking-tight">
                {name}
              </h2>

              <div className="mt-1 flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {email}
                </span>

                <span className="hidden text-border sm:block">
                  •
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                    <ShieldCheck className="size-3 text-primary" />
                  </span>

                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold">
              Información personal
            </h3>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Actualiza la información asociada a tu cuenta.
            </p>
          </div>

          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="full-name">
                    Nombre completo
                  </Label>

                  <Input
                    id="full-name"
                    placeholder="Tu nombre completo"
                    {...register("fullName")}
                  />

                  {errors.fullName && (
                    <p className="text-xs text-destructive">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">
                    Email
                  </Label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="email"
                      value={email}
                      readOnly
                      disabled
                      className="bg-muted/40 pl-9"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    El email está asociado a tu cuenta de
                    autenticación.
                  </p>
                </div>
              </div>

              <div className="flex justify-end border-t border-border pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Guardando..."
                    : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}