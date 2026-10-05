"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useStartCharging } from "@/hooks/useStartCharging";
import { toast } from "sonner";

type StartChargingButtonProps = {
  connectorId: string;
  pricePerKwh: number;
  connectorStatus: "available" | "occupied" | "offline";
};

export function StartChargingButton({
  connectorId,
  pricePerKwh,
  connectorStatus,
}: StartChargingButtonProps) {
  const { user } = useAuth();
  const { startCharging, loading } = useStartCharging();

  const handleStart = async () => {
    if (!user) {
      return;
    }

    try {
      await startCharging(user.id, connectorId, pricePerKwh);

      toast.success("Carga iniciada correctamente");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo iniciar la carga",
      );
    }
  };

  return (
    <Button
      type="button"
      onClick={handleStart}
      disabled={loading || !user || connectorStatus !== "available"}
    >
      {loading ? "Iniciando..." : "Iniciar carga"}
    </Button>
  );
}
