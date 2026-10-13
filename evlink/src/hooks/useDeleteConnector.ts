
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteConnector } from "@/services/actions/connector-actions";

export function useDeleteConnector() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function remove(connectorId: string) {
    if (pending) return;

    startTransition(async () => {
      try {
        const result = await deleteConnector(connectorId);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        toast.success(result.success ?? "Conector eliminado correctamente.");
        router.refresh();
      } catch (error) {
        console.error("Error deleting connector:", error);
        toast.error("Ha ocurrido un error inesperado al eliminar el conector.");
      }
    });
  }

  return {
    remove,
    pending,
  };
}
