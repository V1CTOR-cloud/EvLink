"use client";

import { Plug, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { useStartCharging } from "@/hooks/useStartCharging";
import { connectorTypeLabels } from "@/lib/session-utils";
import { cn } from "@/lib/utils";
import type { Connector } from "@/types";

type ConnectorRowProps = {
  connector: Connector;
  canStartCharging?: boolean;
};

function getStatusPill(status: Connector["status"]) {
  if (status === "available") {
    return { label: "Libre", className: "bg-green-500/10 text-green-600" };
  }

  if (status === "occupied") {
    return {
      label: "Ocupado",
      className: "bg-yellow-500/10 text-yellow-600",
    };
  }

  return {
    label: "Fuera de servicio",
    className: "bg-muted text-muted-foreground",
  };
}

export function ConnectorRow({
  connector,
  canStartCharging = true,
}: ConnectorRowProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { startCharging, loading } = useStartCharging();

  const isAvailable = connector.status === "available";
  const pill = getStatusPill(connector.status);

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

  const power = Number(connector.power_kw).toLocaleString("es-ES", {
    maximumFractionDigits: 1,
  });

  const price = Number(connector.price_per_kwh).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  });

  const details = (
    <>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Plug
          className={cn(
            "size-4",
            isAvailable ? "text-muted-foreground" : "text-muted-foreground/60",
          )}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={cn(
              "text-sm font-medium",
              !isAvailable && "text-muted-foreground",
            )}
          >
            {connectorTypeLabels[connector.connector_type]}
          </span>

          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
              pill.className,
            )}
          >
            {pill.label}
          </span>
        </div>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {power} kW · {price} €/kWh
        </p>
      </div>
    </>
  );

  // Conector no disponible: información sin interacción (no es un botón).
  if (!isAvailable || !canStartCharging) {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5">
        {details}

        {!isAvailable && (
          <p className="hidden shrink-0 text-xs text-muted-foreground sm:block">
            No disponible ahora
          </p>
        )}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={handleStart}
      disabled={!user || loading}
      className="group/connector flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      {details}

      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium transition-colors group-hover/connector:border-primary/40 group-hover/connector:bg-primary/10">
        <Zap className="size-3.5" />
        {loading ? "Iniciando..." : "Iniciar carga"}
      </span>
    </button>
  );
}
