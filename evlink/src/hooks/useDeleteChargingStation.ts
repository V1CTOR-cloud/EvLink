"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteChargingStation } from "@/services/charging-station-actions";

export function useDeleteChargingStation(stationId: string) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    if (!isPending) {
      setOpen(nextOpen);
    }
  }

  function remove() {
    if (isPending) return;

    startTransition(async () => {
      try {
        const result = await deleteChargingStation(stationId);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        toast.success(result.success ?? "Estación eliminada correctamente.");
        setOpen(false);
        router.push("/admin/stations");
        router.refresh();
      } catch {
        toast.error("No se ha podido eliminar la estación.");
      }
    });
  }

  return {
    open,
    isPending,
    handleOpenChange,
    remove,
  };
}
