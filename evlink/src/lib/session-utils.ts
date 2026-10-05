import type { ChargingSession } from "@/types";

export function isSessionActive(
  status: ChargingSession["status"],
) {
  return status === "pending" || status === "charging";
}

export const sessionStatusLabels = {
  pending: "Pendiente",
  charging: "Cargando",
  completed: "Completada",
  cancelled: "Cancelada",
  failed: "Fallida",
} as const;

export const sessionStatusVariants = {
  pending: "outline",
  charging: "default",
  completed: "secondary",
  cancelled: "outline",
  failed: "destructive",
} as const;

export const connectorTypeLabels = {
  type_2: "Type 2",
  ccs2: "CCS2",
  chademo: "CHAdeMO",
} as const;