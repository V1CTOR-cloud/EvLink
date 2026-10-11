"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useChargingStationForm } from "@/hooks/useChargingStationForm";
import type { StationFormField } from "@/hooks/useChargingStationForm";
import {
  stationStatusLabels,
  stationStatusValues,
} from "@/schemas/charging-station";
import type { ChargingStation } from "@/types";

type ChargingStationFormProps = {
  station?: ChargingStation;
};

const fields: { name: StationFormField; label: string }[] = [
  { name: "name", label: "Nombre" },
  { name: "address", label: "Dirección" },
  { name: "city", label: "Ciudad" },
  { name: "latitude", label: "Latitud" },
  { name: "longitude", label: "Longitud" },
];

export function ChargingStationForm({ station }: ChargingStationFormProps) {
  const router = useRouter();
  const { fieldErrors, formError, isPending, submit } =
    useChargingStationForm(station);

  const isEditing = Boolean(station);
  const stationValues: Record<StationFormField, string> = {
    name: station?.name ?? "",
    description: station?.description ?? "",
    address: station?.address ?? "",
    city: station?.city ?? "",
    latitude: station ? String(station.latitude) : "",
    longitude: station ? String(station.longitude) : "",
    status: station?.status ?? "available",
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    submit(Object.fromEntries(formData.entries()));
  }

  function getFieldError(field: StationFormField) {
    return fieldErrors[field];
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.slice(0, 3).map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              defaultValue={stationValues[field.name]}
              required
              disabled={isPending}
              aria-invalid={Boolean(getFieldError(field.name))}
              aria-describedby={
                getFieldError(field.name) ? `${field.name}-error` : undefined
              }
            />
            {getFieldError(field.name) && (
              <p id={`${field.name}-error`} className="text-xs text-destructive">
                {getFieldError(field.name)}
              </p>
            )}
          </div>
        ))}

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Descripción (opcional)</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={station?.description ?? ""}
            disabled={isPending}
            aria-invalid={Boolean(getFieldError("description"))}
            aria-describedby={
              getFieldError("description") ? "description-error" : undefined
            }
          />
          {getFieldError("description") && (
            <p id="description-error" className="text-xs text-destructive">
              {getFieldError("description")}
            </p>
          )}
        </div>

        {fields.slice(3).map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              step="any"
              defaultValue={stationValues[field.name]}
              required
              disabled={isPending}
              aria-invalid={Boolean(getFieldError(field.name))}
              aria-describedby={
                getFieldError(field.name) ? `${field.name}-error` : undefined
              }
            />
            {getFieldError(field.name) && (
              <p id={`${field.name}-error`} className="text-xs text-destructive">
                {getFieldError(field.name)}
              </p>
            )}
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <select
            id="status"
            name="status"
            defaultValue={stationValues.status}
            disabled={isPending}
            aria-invalid={Boolean(getFieldError("status"))}
            aria-describedby={
              getFieldError("status") ? "status-error" : undefined
            }
            className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
          >
            {stationStatusValues.map((status) => (
              <option key={status} value={status}>
                {stationStatusLabels[status]}
              </option>
            ))}
          </select>
          {getFieldError("status") && (
            <p id="status-error" className="text-xs text-destructive">
              {getFieldError("status")}
            </p>
          )}
        </div>
      </div>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          variant="outline"
          className="border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15"
        >
          {isPending
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear estación"}
        </Button>
      </div>
    </form>
  );
}
