
"use client";

import { useState, useTransition } from "react";
import { Trash2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { deleteAdminUser } from "@/services/actions/actions";
import type { AdminUser } from "@/services/admin-users";

type AdminUserDeleteTarget = Pick<
  AdminUser,
  "id" | "full_name" | "status"
>;

interface AdminUserDeleteActionProps {
  user: AdminUserDeleteTarget;
  enabled?: boolean;
  /** "icon" para tablas y tarjetas, "button" para la ficha de detalle. */
  variant?: "icon" | "button";
  /** Ruta a la que ir tras eliminar. */
  redirectTo?: string;
}

export function AdminUserDeleteAction({
  user,
  enabled = true,
  variant = "icon",
  redirectTo,
}: AdminUserDeleteActionProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const displayName = user.full_name || "este usuario";
  const canDelete = enabled && user.status === "inactive";

  const disabledReason = !enabled
    ? "La eliminación no está disponible."
    : "Desactiva primero esta cuenta para poder eliminarla.";

  function handleDelete() {
    if (!canDelete || isPending) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteAdminUser(user.id);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.success) {
          toast.success(result.success);
          setOpen(false);

          if (redirectTo) {
            router.push(redirectTo);
          } else {
            router.refresh();
          }
        }
      } catch {
        toast.error("No se ha podido eliminar la cuenta.");
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <AlertDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (isPending) return;
          if (nextOpen && !canDelete) return;

          setOpen(nextOpen);
        }}
      >
        <span
          className="relative z-10 inline-flex"
          onClick={(event) => event.stopPropagation()}
        >
          <AlertDialogTrigger
            render={
              variant === "icon" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={!canDelete || isPending}
                  title={
                    !canDelete
                      ? disabledReason
                      : `Eliminar cuenta de ${displayName}`
                  }
                  aria-label={`Eliminar cuenta de ${displayName}`}
                  className="size-8 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-40"
                >
                  <Trash2 className="size-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  disabled={!canDelete || isPending}
                  title={!canDelete ? disabledReason : undefined}
                  className="border-destructive/30 text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
                >
                  <Trash2 className="size-4" />
                  <span>Eliminar cuenta</span>
                </Button>
              )
            }
          />
        </span>

        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <TriangleAlert className="size-5 text-destructive" />
            </div>

            <AlertDialogTitle>¿Eliminar esta cuenta?</AlertDialogTitle>

            <AlertDialogDescription>
              Se eliminará la cuenta de autenticación y su perfil asociado.
              Esta acción es irreversible. No se permitirá eliminar usuarios
              con sesiones o pagos históricos, ni tu propia cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {getInitials(user.full_name)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{displayName}</p>

              <p
                title={user.id}
                className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground"
              >
                {user.id.slice(0, 8)}
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={!canDelete || isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isPending ? "Eliminando..." : "Eliminar cuenta"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!canDelete && variant === "button" && (
        <p className="max-w-xs text-xs text-muted-foreground">
          {disabledReason}
        </p>
      )}
    </div>
  );
}
