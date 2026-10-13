
"use client";

import { useState } from "react";
import { Activity, Euro, Gauge, Plug } from "lucide-react";

import type { Connector } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  connectorStatusLabels,
  connectorStatusValues,
  connectorTypeLabels,
  connectorTypeValues,
} from "@/schemas/connector";
import { useConnectorForm } from "@/hooks/useConnectorForm";

type ConnectorFormValues = {
  connector_type: Connector["connector_type"];
  power_kw: number;
  price_per_kwh: number;
  status: Connector["status"];
};

type ConnectorFormProps = {
  stationId: string;
  connectorId?: string;
  initialValues?: ConnectorFormValues;
  onSuccess?: () => void;
};

export function ConnectorForm({
  stationId,
  connectorId,
  initialValues,
  onSuccess,
}: ConnectorFormProps) {
  const [connectorType, setConnectorType] = useState<
    Connector["connector_type"]
  >(initialValues?.connector_type ?? "type_2");

  const [powerKw, setPowerKw] = useState(
    String(initialValues?.power_kw ?? 22),
  );

  const [pricePerKwh, setPricePerKwh] = useState(
    String(initialValues?.price_per_kwh ?? 0.39),
  );

  const [status, setStatus] = useState<Connector["status"]>(
    initialValues?.status ?? "available",
  );

  const { pending, fieldErrors, formError, submit } = useConnectorForm({
    stationId,
    connectorId,
    onSuccess,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void submit({
      connector_type: connectorType,
      power_kw: powerKw,
      price_per_kwh: pricePerKwh,
      status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7 py-1">
      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <Plug className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Configuración técnica</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="connector_type">Tipo de conector</Label>

          <Select
            value={connectorType}
            onValueChange={(value) => {
              if (
                value &&
                connectorTypeValues.includes(
                  value as Connector["connector_type"],
                )
              ) {
                setConnectorType(value as Connector["connector_type"]);
              }
            }}
            disabled={pending}
          >
            <SelectTrigger id="connector_type" className="h-11 w-full">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>

            <SelectContent>
              {connectorTypeValues.map((type) => (
                <SelectItem key={type} value={type}>
                  {connectorTypeLabels[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.connector_type?.[0] && (
            <p className="text-sm text-destructive">
              {fieldErrors.connector_type[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="power_kw">Potencia máxima</Label>
          <div className="relative">
            <Gauge className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="power_kw"
              type="number"
              min="0.01"
              step="any"
              className="h-11 pl-9 pr-12"
              value={powerKw}
              onChange={(event) => setPowerKw(event.target.value)}
              disabled={pending}
              required
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              kW
            </span>
          </div>
          {fieldErrors.power_kw?.[0] && (
            <p className="text-sm text-destructive">
              {fieldErrors.power_kw[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price_per_kwh">Precio de recarga</Label>
          <div className="relative">
            <Euro className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="price_per_kwh"
              type="number"
              min="0"
              step="any"
              className="h-11 pl-9 pr-16"
              value={pricePerKwh}
              onChange={(event) => setPricePerKwh(event.target.value)}
              disabled={pending}
              required
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              €/kWh
            </span>
          </div>
          {fieldErrors.price_per_kwh?.[0] && (
            <p className="text-sm text-destructive">
              {fieldErrors.price_per_kwh[0]}
            </p>
          )}
        </div>
      </section>

      {connectorId && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Activity className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Estado operativo</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="connector_status">Estado</Label>

            <Select
              value={status}
              onValueChange={(value) => {
                if (
                  value &&
                  connectorStatusValues.includes(
                    value as Connector["status"],
                  )
                ) {
                  setStatus(value as Connector["status"]);
                }
              }}
              disabled={pending}
            >
              <SelectTrigger id="connector_status" className="h-11 w-full">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>

              <SelectContent>
                {connectorStatusValues
                  .filter((value) => value !== "occupied")
                  .map((value) => (
                    <SelectItem key={value} value={value}>
                      {connectorStatusLabels[value]}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <p className="text-xs leading-relaxed text-muted-foreground">
              El estado ocupado se gestiona automáticamente mediante las
              sesiones de recarga.
            </p>
          </div>
        </section>
      )}

      <div className="flex justify-end border-t pt-5">
        <Button type="submit" disabled={pending} className="min-w-36">
          {pending
            ? "Guardando..."
            : connectorId
              ? "Guardar cambios"
              : "Crear conector"}
        </Button>
      </div>
    </form>
  );
}
