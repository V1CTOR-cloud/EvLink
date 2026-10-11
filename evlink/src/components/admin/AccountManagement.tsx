"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff } from "lucide-react";

import { updateAdminUserStatus } from "@/services/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { Profile } from "@/types";

type AccountManagementProps = {
  userId: string;
  role: Profile["role"];
  status: Profile["status"];
};

export function AccountManagement({ userId, status }: AccountManagementProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isActive = status === "active";

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

  const StatusIcon = isActive ? ShieldCheck : ShieldOff;

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
          <StatusIcon className="size-5 text-muted-foreground" />
        </div>

        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">Acceso a la plataforma</p>

            <Badge variant={isActive ? "secondary" : "outline"}>
              {isActive ? "Activo" : "Desactivado"}
            </Badge>
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
        variant={isActive ? "outline" : "default"}
        disabled={isPending}
        onClick={handleStatusChange}
        className={
          isActive
            ? "shrink-0 border-amber-500/50 text-amber-700 hover:bg-amber-500/10 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
            : "shrink-0"
        }
      >
        {isPending
          ? "Guardando..."
          : isActive
            ? "Desactivar acceso"
            : "Restaurar acceso"}
      </Button>
    </div>
  );
}
