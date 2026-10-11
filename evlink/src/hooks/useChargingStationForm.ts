"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { chargingStationSchema } from "@/schemas/charging-station";
import {
  createChargingStation,
  updateChargingStation,
} from "@/services/charging-station-actions";
import type { ChargingStation } from "@/types";

export type StationFormField =
  | "name"
  | "description"
  | "address"
  | "city"
  | "latitude"
  | "longitude"
  | "status";

const stationFieldNames = new Set<string>([
  "name",
  "description",
  "address",
  "city",
  "latitude",
  "longitude",
  "status",
]);

function isStationField(value: PropertyKey | undefined): value is StationFormField {
  return typeof value === "string" && stationFieldNames.has(value);
}

export function useChargingStationForm(station?: ChargingStation) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<StationFormField, string>>
  >({});
  const [formError, setFormError] = useState("");

  function submit(input: unknown) {
    setFieldErrors({});
    setFormError("");

    const parsed = chargingStationSchema.safeParse(input);

    if (!parsed.success) {
      const errors = parsed.error.issues.reduce<
        Partial<Record<StationFormField, string>>
      >((result, issue) => {
        const field = issue.path[0];
        if (isStationField(field)) {
          result[field] ??= issue.message;
        }
        return result;
      }, {});
      setFieldErrors(errors);
      setFormError("Revisa los campos indicados antes de guardar.");
      return;
    }

    startTransition(async () => {
      try {
        const result = station
          ? await updateChargingStation(station.id, parsed.data)
          : await createChargingStation(parsed.data);

        if (result.error) {
          const serverFieldErrors: Partial<
            Record<StationFormField, string>
          > = {};
          for (const [field, messages] of Object.entries(
            result.fieldErrors ?? {},
          )) {
            if (isStationField(field) && messages?.[0]) {
              serverFieldErrors[field] = messages[0];
            }
          }
          setFieldErrors(serverFieldErrors);
          setFormError(result.error);
          toast.error(result.error);
          return;
        }

        if (!station && !result.stationId) {
          const message =
            "La estación se guardó, pero no se pudo confirmar su identificador.";
          setFormError(message);
          toast.error(message);
          return;
        }

        toast.success(result.success ?? "Estación guardada correctamente.");
        router.push(`/admin/stations/${station?.id ?? result.stationId}`);
        router.refresh();
      } catch {
        const message =
          "No se ha podido contactar con el servidor. Inténtalo de nuevo.";
        setFormError(message);
        toast.error(message);
      }
    });
  }

  return {
    fieldErrors,
    formError,
    isPending,
    submit,
  };
}
