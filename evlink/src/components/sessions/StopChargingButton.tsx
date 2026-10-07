"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useStopCharging } from "@/hooks/useStopCharging";
import type { ChargingSession } from "@/types";

type StopChargingButtonProps = {
  sessionId: string;
  onSessionUpdated: (session: ChargingSession) => void;
};

export function StopChargingButton({
  sessionId,
  onSessionUpdated,
}: StopChargingButtonProps) {
  const [open, setOpen] = useState(false);
  const [energyKwh, setEnergyKwh] = useState("");

  const { finishCharging, loading } = useStopCharging();

  const handleStop = async () => {
    const energy = Number(energyKwh);

    if (!energyKwh || Number.isNaN(energy) || energy < 0) {
      toast.error("Introduce una cantidad de energía válida");
      return;
    }

    try {
      const session = await finishCharging(sessionId, energy);

      onSessionUpdated(session);

      setEnergyKwh("");
      setOpen(false);

      toast.success("Carga finalizada correctamente");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo finalizar la carga",
      );
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (loading) {
      return;
    }

    setOpen(value);

    if (!value) {
      setEnergyKwh("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            Finalizar carga
          </Button>
        }
      />

      <DialogContent
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>Finalizar carga</DialogTitle>

          <DialogDescription>
            Introduce la energía consumida durante esta sesión para finalizarla.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label htmlFor="energy-kwh" className="text-sm font-medium">
            Energía consumida
          </label>

          <div className="flex items-center gap-3">
            <Input
              id="energy-kwh"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={energyKwh}
              onChange={(event) => setEnergyKwh(event.target.value)}
              disabled={loading}
              autoFocus
            />

            <span className="shrink-0 text-sm font-medium text-muted-foreground">
              kWh
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
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
