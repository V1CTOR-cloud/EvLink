
import { z } from "zod";

export const connectorTypeValues = [
  "type_2",
  "ccs2",
  "chademo",
] as const;

export const connectorTypeLabels: Record<
  (typeof connectorTypeValues)[number],
  string
> = {
  type_2: "Tipo 2",
  ccs2: "CCS2",
  chademo: "CHAdeMO",
};

export const connectorStatusValues = [
  "available",
  "occupied",
  "offline",
  "maintenance",
] as const;

export const connectorStatusLabels: Record<
  (typeof connectorStatusValues)[number],
  string
> = {
  available: "Disponible",
  occupied: "Ocupado",
  offline: "Fuera de servicio",
  maintenance: "Mantenimiento",
};

export const editableConnectorStatusValues = [
  "available",
  "offline",
  "maintenance",
] as const;

function parseNumber(value: unknown): unknown {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    return Number(value);
  }

  return Number.NaN;
}

const connectorTechnicalSchema = z.object({
  connector_type: z.enum(connectorTypeValues),
  power_kw: z.preprocess(
    parseNumber,
    z
      .number()
      .finite("Introduce una potencia válida")
      .gt(0, "La potencia debe ser mayor que cero"),
  ),
  price_per_kwh: z.preprocess(
    parseNumber,
    z
      .number()
      .finite("Introduce un precio válido")
      .min(0, "El precio no puede ser negativo"),
  ),
});

// Al crear, el conector comienza disponible.
// El estado de la estación también debe comprobarse
// antes de permitir una recarga.
export const createConnectorSchema = connectorTechnicalSchema;

// Al editar, el administrador puede cambiar el estado,
// excepto a "occupied", que depende de las sesiones.
export const updateConnectorSchema = connectorTechnicalSchema.extend({
  status: z.enum(editableConnectorStatusValues),
});

export const connectorSchema = connectorTechnicalSchema;

export type ConnectorInput = z.output<typeof connectorTechnicalSchema>;
export type CreateConnectorInput = z.output<typeof createConnectorSchema>;
export type UpdateConnectorInput = z.output<typeof updateConnectorSchema>;
