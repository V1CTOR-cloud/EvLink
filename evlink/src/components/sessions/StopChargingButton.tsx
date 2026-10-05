"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

      toast.success("Carga finalizada correctamente");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo finalizar la carga",
      );
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="number"
        min="0"
        step="0.01"
        placeholder="Energía consumida (kWh)"
        value={energyKwh}
        onChange={(event) => setEnergyKwh(event.target.value)}
      />

      <Button
        type="button"
        variant="destructive"
        onClick={handleStop}
        disabled={loading}
      >
        {loading ? "Finalizando..." : "Finalizar carga"}
      </Button>
    </div>
  );
}