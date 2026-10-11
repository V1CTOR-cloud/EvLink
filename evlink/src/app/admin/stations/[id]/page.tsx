import {
  ArrowLeft,
  CalendarClock,
  MapPin,
  Pencil,
  TriangleAlert,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { ChargingStationDeleteAction } from "@/components/admin/ChargingStationDeleteAction";
import { StationStatusBadge } from "@/components/admin/StationStatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/require-admin";
import { formatDate } from "@/lib/format-date";
import { connectorTypeLabels } from "@/lib/session-utils";
import { stationStatusLabels } from "@/schemas/charging-station";
import { getChargingStationById } from "@/services/charging-stations";

type AdminStationDetailPageProps = {
  params: Promise<{ id: string }>;
};

const connectorStatusLabels = {
  available: "Disponible",
  occupied: "Ocupado",
  offline: "Fuera de servicio",
  maintenance: "Mantenimiento",
} as const;

export default async function AdminStationDetailPage({
  params,
}: AdminStationDetailPageProps) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  const station = await getChargingStationById(supabase, id);

  if (!station) {
    notFound();
  }

  return (
    <section className="p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-5">
          <Link
            href="/admin/stations"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Estaciones
          </Link>

          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                <MapPin className="size-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="break-words text-2xl font-semibold tracking-tight">
                  {station.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {station.address}, {station.city}
                </p>
              </div>
            </div>
            <Link
              href={`/admin/stations/${station.id}/edit`}
              className={buttonVariants({ variant: "outline" })}
            >
              <Pencil aria-hidden="true" />
              Editar estación
            </Link>
          </header>
        </div>

        <section className="grid gap-6 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">
              Información de la estación
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Ubicación, disponibilidad y datos de registro.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
            <dl className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-border px-5 py-4 sm:border-r">
                <dt className="text-xs text-muted-foreground">Estado</dt>
                <dd className="mt-2">
                  <StationStatusBadge
                    status={station.status}
                    label={stationStatusLabels[station.status]}
                  />
                </dd>
              </div>
              <div className="border-b border-border px-5 py-4">
                <dt className="text-xs text-muted-foreground">Dirección</dt>
                <dd className="mt-1 break-words text-sm font-medium">
                  {station.address}
                </dd>
              </div>
              <div className="border-b border-border px-5 py-4 sm:border-r">
                <dt className="text-xs text-muted-foreground">Ciudad</dt>
                <dd className="mt-1 text-sm font-medium">{station.city}</dd>
              </div>
              <div className="border-b border-border px-5 py-4">
                <dt className="text-xs text-muted-foreground">Coordenadas</dt>
                <dd className="mt-1 break-all font-mono text-sm">
                  {station.latitude}, {station.longitude}
                </dd>
              </div>
              {station.description && (
                <div className="border-b border-border px-5 py-4 sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">
                    Descripción
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm">
                    {station.description}
                  </dd>
                </div>
              )}
              <div className="border-b border-border px-5 py-4 sm:border-r sm:border-b-0">
                <dt className="text-xs text-muted-foreground">Creada</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm">
                  <CalendarClock
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                  {formatDate(station.created_at) ?? "Sin fecha"}
                </dd>
              </div>
              <div className="px-5 py-4">
                <dt className="text-xs text-muted-foreground">
                  Última actualización
                </dt>
                <dd className="mt-1 text-sm">
                  {formatDate(station.updated_at) ?? "Sin fecha"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">Conectores</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Tipo, potencia, precio y estado de cada conector asociado.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold">
                  {station.connectors.length}{" "}
                  {station.connectors.length === 1 ? "conector" : "conectores"}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Asociados a esta estación.
                </p>
              </div>
              <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                <Zap
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
              </div>
            </div>
            {station.connectors.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground">
                Esta estación todavía no tiene conectores.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {station.connectors.map((connector) => (
                  <div
                    key={connector.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {connectorTypeLabels[connector.connector_type]}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {connector.power_kw} kW ·{" "}
                        {Number(connector.price_per_kwh).toFixed(2)} €/kWh
                      </p>
                    </div>
                    <StationStatusBadge
                      status={connector.status}
                      label={connectorStatusLabels[connector.status]}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 border-t border-border pt-10 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">Zona de peligro</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Acciones irreversibles sobre esta estación.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 lg:col-span-2">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-destructive/10">
                <TriangleAlert
                  aria-hidden="true"
                  className="size-4 text-destructive"
                />
              </div>
              <div>
                <p className="text-sm font-medium">Eliminar estación</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Se eliminarán también sus {station.connectors.length}{" "}
                  {station.connectors.length === 1
                    ? "conector asociado"
                    : "conectores asociados"}
                  . No se permite si existen sesiones históricas.
                </p>
              </div>
            </div>
            <ChargingStationDeleteAction
              stationId={station.id}
              stationName={station.name}
              connectorCount={station.connectors.length}
            />
          </div>
        </section>
      </div>
    </section>
  );
}
