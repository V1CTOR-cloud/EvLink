
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff, TriangleAlert, User } from "lucide-react";

import { updateAdminUserRole, updateAdminUserStatus } from "@/services/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Profile } from "@/types";

type AccountManagementProps = {
  userId: string;
  role: Profile["role"];
  status: Profile["status"];
};

export function AccountManagement({
  userId,
  role,
  status,
}: AccountManagementProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [password, setPassword] = useState("");

  const isActive = status === "active";
  const isAdmin = role === "admin";

  const nextRole = isAdmin ? "driver" : "admin";
  const nextRoleLabel =
    nextRole === "admin" ? "Administrador" : "Conductor";

  function handleStatusChange() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("status", isActive ? "inactive" : "active");

      const result = await updateAdminUserStatus(userId, {}, formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        isActive
          ? "Cuenta desactivada correctamente."
          : "Cuenta reactivada correctamente.",
      );

      router.refresh();
    });
  }

  function handleRoleChange() {
    if (!password.trim()) {
      toast.error("Introduce tu contraseña para continuar.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("role", nextRole);
      formData.set("password", password);

      const result = await updateAdminUserRole(userId, {}, formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success ?? "Rol actualizado correctamente.");

      setPassword("");
      setIsRoleDialogOpen(false);
      router.refresh();
    });
  }

  function handleDialogOpenChange(open: boolean) {
    if (isPending) return;

    setIsRoleDialogOpen(open);

    if (!open) {
      setPassword("");
    }
  }

  const StatusIcon = isActive ? ShieldCheck : ShieldOff;
  const RoleIcon = isAdmin ? ShieldCheck : User;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <RoleIcon className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">Rol del usuario</p>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  isAdmin
                    ? "bg-green-500/10 text-green-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <RoleIcon aria-hidden="true" className="size-3.5" />
                {isAdmin ? "Administrador" : "Conductor"}
              </span>
            </div>

            <p className="max-w-md text-sm leading-5 text-muted-foreground">
              {isAdmin
                ? "Este usuario tiene permisos de administración."
                : "Este usuario tiene permisos de conductor."}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => setIsRoleDialogOpen(true)}
          className="shrink-0"
        >
          {isAdmin ? "Cambiar a conductor" : "Hacer administrador"}
        </Button>
      </section>

      <section className="flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <StatusIcon className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">Acceso a la plataforma</p>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  isActive
                    ? "bg-green-500/10 text-green-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <StatusIcon aria-hidden="true" className="size-3.5" />
                {isActive ? "Activo" : "Desactivado"}
              </span>
            </div>

            <p className="max-w-md text-sm leading-5 text-muted-foreground">
              {isActive
                ? "La cuenta puede acceder a la plataforma."
                : "La cuenta tiene el acceso desactivado."}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={handleStatusChange}
          className={
            isActive
              ? "shrink-0 border-destructive/30 text-muted-foreground hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
              : "shrink-0 border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15"
          }
        >
          {isPending
            ? "Guardando..."
            : isActive
              ? "Desactivar acceso"
              : "Restaurar acceso"}
        </Button>
      </section>

      <Dialog
        open={isRoleDialogOpen}
        onOpenChange={handleDialogOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <TriangleAlert
                aria-hidden="true"
                className="size-5 text-foreground"
              />
            </div>
            <DialogTitle className="text-sm font-semibold">
              Confirmar cambio de rol
            </DialogTitle>

            <DialogDescription>
              Vas a cambiar el rol de este usuario a{" "}
              <strong>{nextRoleLabel}</strong>. Por seguridad, introduce la
              contraseña de tu cuenta de administrador para confirmar la
              operación.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleRoleChange();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="admin-password">
                Contraseña del administrador
              </Label>

              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Introduce tu contraseña"
                disabled={isPending}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => handleDialogOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isPending || !password.trim()}
                variant="outline"
                className="border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15"
              >
                {isPending ? "Verificando..." : "Confirmar cambio"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
