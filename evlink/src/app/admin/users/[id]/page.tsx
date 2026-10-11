import { ArrowLeft, ShieldCheck, TriangleAlert, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { AdminUserDeleteAction } from "@/components/admin/AdminDeleteAction";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getInitials } from "@/lib/utils";
import { getAdminUser } from "@/services/admin-users";
import { UserProfileForm } from "./UserProfileForm";
import { AccountManagement } from "@/components/admin/AccountManagement";

type AdminUserDetailPageProps = {
  params: Promise<{ id: string }>;
};

const userIdSchema = z.uuid();

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  if (!userIdSchema.safeParse(id).success) {
    notFound();
  }

  const user = await getAdminUser(supabase, id);

  if (!user) {
    notFound();
  }

  const name = user.full_name || "Sin nombre";
  const isAdmin = user.role === "admin";
  const roleLabel = isAdmin ? "Administrador" : "Conductor";
  const RoleIcon = isAdmin ? ShieldCheck : User;

  const details = [
    {
      label: "Identificador",
      value: <span className="break-all font-mono text-xs">{user.id}</span>,
    },
    { label: "Rol", value: roleLabel },
    { label: "Fecha de registro", value: formatDate(user.created_at) },
    {
      label: "Última actualización",
      value: user.updated_at ? formatDate(user.updated_at) : "Sin actualizar",
    },
  ];

  return (
    <section className="p-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-4">
          <Link
            href="/admin/users"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Usuarios
          </Link>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Perfil de usuario
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Consulta y actualiza los datos del perfil.
            </p>
          </div>
        </div>

        <div className="border-b border-border pb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar className="size-20 shrink-0">
              <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold tracking-tight">
                {name}
              </h2>

              <div className="mt-1 flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                    <RoleIcon className="size-3 text-primary" />
                  </span>

                  {roleLabel}
                </span>

                <span className="hidden text-border sm:block">•</span>

                <span title={user.id} className="font-mono text-xs">
                  {user.id.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold">Datos de la cuenta</h3>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Información de solo lectura asociada a este usuario.
            </p>
          </div>

          <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
            {details.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <dt className="shrink-0 text-xs text-muted-foreground">
                  {item.label}
                </dt>

                <dd className="min-w-0 text-sm font-medium sm:text-right">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold">Información personal</h3>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Actualiza el nombre asociado al perfil de este usuario.
            </p>
          </div>

          <div className="lg:col-span-2">
            <UserProfileForm fullName={user.full_name} userId={user.id} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 border-t border-border pt-10 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold">Gestión de la cuenta</h3>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Consulta el estado y controla el acceso de este usuario.
            </p>
          </div>

          <div className="lg:col-span-2">
            <AccountManagement
              userId={user.id}
              role={user.role}
              status={user.status}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 border-t border-border pt-10 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold">Zona de peligro</h3>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Acciones irreversibles sobre esta cuenta.
            </p>
          </div>

          <div className="space-y-3 lg:col-span-2">
            <div className="flex flex-col gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-destructive/10">
                  <TriangleAlert className="size-4 text-destructive" />
                </div>

                <div>
                  <p className="text-sm font-medium">Eliminar cuenta</p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Se solicita la eliminación de la cuenta y no se puede
                    deshacer. Disponible cuando terminen las pruebas de
                    seguridad.
                  </p>
                </div>
              </div>

              <AdminUserDeleteAction
                user={user}
                variant="button"
                redirectTo="/admin/users"
              />
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
