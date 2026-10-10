"use client";

import { Zap } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { useStartCharging } from "@/hooks/useStartCharging";
import type { Connector } from "@/types";
import { useRouter } from "next/navigation";

type ConnectorItemProps = {
  connector: Connector;
};

const connectorLabels = {
  type_2: "Type 2",
  ccs2: "CCS2",
  chademo: "CHAdeMO",
} as const;

export function ConnectorItem({ connector }: ConnectorItemProps) {
  const { user } = useAuth();
  const { startCharging, loading } = useStartCharging();

  const isAvailable = connector.status === "available";

  const router = useRouter();

  const handleStart = async () => {
    if (!user || !isAvailable || loading) {
      return;
    }

    try {
      const session = await startCharging(connector.id);

      toast.success("Carga iniciada correctamente");

      router.push(`/sessions/${session.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo iniciar la carga",
      );
    }
  };

  if (!isAvailable) {
    return (
      <div className="flex flex-1 items-center justify-between rounded-md bg-muted px-2.5 py-2">
        <div className="flex items-center gap-1.5">
          <Zap className="size-3 text-muted-foreground" />

          <span className="text-[10px] font-medium">
            {connectorLabels[connector.connector_type]}
          </span>

          <span className="text-[10px] text-muted-foreground">
            {connector.power_kw} kW
          </span>
        </div>

        <span className="text-[10px] text-muted-foreground">
          {connector.status === "occupied" ? "Ocupado" : "Fuera de servicio"}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleStart}
      disabled={!user || loading}
      className="flex min-h-11 flex-1 items-center justify-between gap-2 rounded-md bg-muted px-2.5 py-2 text-left transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="flex items-center gap-1.5">
        <Zap className="size-3 text-primary" />

        <span className="text-[10px] font-medium">
          {connectorLabels[connector.connector_type]}
        </span>

        <span className="text-[10px] text-muted-foreground">
          {connector.power_kw} kW
        </span>
      </div>

      <span className="text-[10px] font-medium">
        {loading
          ? "Iniciando..."
          : `${Number(connector.price_per_kwh).toFixed(2)} €/kWh`}
      </span>
    </button>
  );
}
