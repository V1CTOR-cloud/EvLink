"use client";

import { Trash2, TriangleAlert } from "lucide-react";

import { useDeleteChargingStation } from "@/hooks/useDeleteChargingStation";
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

type ChargingStationDeleteActionProps = {
  stationId: string;
  stationName: string;
  connectorCount?: number;
  iconOnly?: boolean;
};

export function ChargingStationDeleteAction({
  stationId,
  stationName,
  connectorCount = 0,
  iconOnly = false,
}: ChargingStationDeleteActionProps) {
  const { open, handleOpenChange, isPending, remove } =
    useDeleteChargingStation(stationId);

  return (
    <AlertDialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant={iconOnly ? "ghost" : "destructive"}
            disabled={isPending}
            aria-label={iconOnly ? `Eliminar ${stationName}` : undefined}
            className={
              iconOnly
                ? "relative z-10 text-muted-foreground hover:text-destructive"
                : undefined
            }
          >
            <Trash2 />
            {!iconOnly && "Eliminar estación"}
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
            <TriangleAlert className="size-5 text-destructive" />
          </div>
          <AlertDialogTitle>¿Eliminar esta estación?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará “{stationName}” y sus {connectorCount}{" "}
            {connectorCount === 1 ? "conector asociado" : "conectores asociados"}.
            Si existe alguna sesión histórica vinculada a esos conectores, la
            operación se bloqueará para conservar la trazabilidad.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={remove}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending ? "Eliminando..." : "Eliminar estación"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
