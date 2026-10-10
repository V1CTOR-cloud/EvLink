"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFinishCharging } from "@/hooks/useFinishCharging";
import type { ChargingSession } from "@/types";

type StopChargingDialogProps = {
  sessionId: string;
  onSessionUpdated: (session: ChargingSession) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StopChargingDialog({
  sessionId,
  onSessionUpdated,
  open,
  onOpenChange,
}: StopChargingDialogProps) {
  const { finish, loading } = useFinishCharging();

  const handleOpenChange = (value: boolean) => {
    if (loading) {
      return;
    }

    onOpenChange(value);
  };

  const handleStop = async () => {
    try {
      const session = await finish(sessionId);

      onSessionUpdated(session);

      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo finalizar la carga",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalizar carga</DialogTitle>

          <DialogDescription>
            ¿Quieres finalizar esta sesión?
            <br />
            El consumo y el importe final se calcularán al finalizar.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleStop}
            disabled={loading}
          >
            {loading ? "Finalizando..." : "Finalizar carga"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}