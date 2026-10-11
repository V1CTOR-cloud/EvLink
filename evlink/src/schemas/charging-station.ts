import { z } from "zod";

export const stationStatusValues = [
  "available",
  "occupied",
  "offline",
  "maintenance",
] as const;

export const stationStatusLabels: Record<
  (typeof stationStatusValues)[number],
  string
> = {
  available: "Disponible",
  occupied: "Ocupada",
  offline: "Fuera de servicio",
  maintenance: "Mantenimiento",
};

function parseCoordinate(value: unknown): unknown {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    return Number(value);
  }

  return Number.NaN;
}

export const chargingStationSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  description: z
    .union([z.string().trim(), z.null()])
    .transform((value) => (typeof value === "string" && value ? value : null)),
  address: z.string().trim().min(1, "La dirección es obligatoria"),
  city: z.string().trim().min(1, "La ciudad es obligatoria"),
  latitude: z.preprocess(
    parseCoordinate,
    z
      .number()
      .finite("Introduce una latitud válida")
      .min(-90, "La latitud debe ser igual o mayor que -90")
      .max(90, "La latitud debe ser igual o menor que 90"),
  ),
  longitude: z.preprocess(
    parseCoordinate,
    z
      .number()
      .finite("Introduce una longitud válida")
      .min(-180, "La longitud debe ser igual o mayor que -180")
      .max(180, "La longitud debe ser igual o menor que 180"),
  ),
  status: z.enum(stationStatusValues),
});

export type ChargingStationInput = z.output<typeof chargingStationSchema>;
