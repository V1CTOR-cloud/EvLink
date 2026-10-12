import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  Euro,
  Gauge,
  MapPin,
  Plug,
  UserRound,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { formatDate } from "@/lib/format-date";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminSessionById } from "@/services/admin-sessions";

type AdminSessionDetailPageProps = {
  params: Promise<{ id: string }>;
};

const sessionStatusLabels = {
  pending: "Pendiente",
  charging: "Cargando",
  completed: "Completada",
  cancelled: "Cancelada",
  failed: "Fallida",
} as const;

const sessionStatusClasses = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  charging: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  completed: "bg-green-500/10 text-green-700 dark:text-green-400",
  cancelled: "bg-muted text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
} as const;

const paymentStatusLabels = {
  pending: "Pendiente",
  completed: "Completado",
  failed: "Fallido",
  refunded: "Reembolsado",
} as const;

const paymentStatusClasses = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  completed: "bg-green-500/10 text-green-700 dark:text-green-400",
  failed: "bg-destructive/10 text-destructive",
  refunded: "bg-muted text-muted-foreground",
} as const;

function formatCurrency(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatDateTime(value: string | null) {
  if (!value) return "Sin fecha";
  return formatDate(value) ?? "Sin fecha";
}

function formatDuration(startedAt: string, endedAt: string | null) {
  if (!endedAt) return "En curso";

  const elapsed = Math.max(
    0,
    Math.round(
      (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 60_000,
    ),
  );

  const hours = Math.floor(elapsed / 60);
  const minutes = elapsed % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;

  return `${hours} h ${minutes} min`;
}

export default async function AdminSessionDetailPage({
  params,
}: AdminSessionDetailPageProps) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  const session = await getAdminSessionById(supabase, id);

  if (!session) {
    notFound();
  }

  return (
    <section className="p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-5">
          <Link
            href="/admin/sessions"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Sesiones
          </Link>

          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                <Zap className="size-5 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Detalle de sesión
                </h1>

                <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                  {session.id}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${sessionStatusClasses[session.status]}`}
            >
              {sessionStatusLabels[session.status]}
            </span>
          </header>
        </div>

        <section className="grid gap-6 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">Información de la sesión</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Estado, fechas y datos generales de la sesión de carga.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
            <dl className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-border px-5 py-4 sm:border-r">
                <dt className="text-xs text-muted-foreground">Estado</dt>
                <dd className="mt-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${sessionStatusClasses[session.status]}`}
                  >
                    {sessionStatusLabels[session.status]}
                  </span>
                </dd>
              </div>

              <div className="border-b border-border px-5 py-4">
                <dt className="text-xs text-muted-foreground">Creada</dt>
                <dd className="mt-2 flex items-center gap-2 text-sm">
                  <CalendarClock
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                  {formatDateTime(session.created_at)}
                </dd>
              </div>

              <div className="border-b border-border px-5 py-4 sm:border-r">
                <dt className="text-xs text-muted-foreground">
                  Inicio de carga
                </dt>
                <dd className="mt-1 text-sm">
                  {formatDateTime(session.started_at)}
                </dd>
              </div>

              <div className="border-b border-border px-5 py-4">
                <dt className="text-xs text-muted-foreground">Fin de carga</dt>
                <dd className="mt-1 text-sm">
                  {formatDateTime(session.ended_at)}
                </dd>
              </div>

              <div className="border-b border-border px-5 py-4 sm:border-r sm:border-b-0">
                <dt className="text-xs text-muted-foreground">Duración</dt>
                <dd className="mt-1 text-sm font-medium">
                  {formatDuration(session.started_at, session.ended_at)}
                </dd>
              </div>

              <div className="px-5 py-4">
                <dt className="text-xs text-muted-foreground">ID de usuario</dt>
                <dd className="mt-1 break-all font-mono text-xs">
                  {session.user_id}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">Usuario</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Perfil asociado a esta sesión.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <UserRound className="size-4 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {session.user.full_name || "Sin nombre"}
                </p>
                <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                  {session.user.id}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">Estación y conector</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Ubicación y características del punto de carga utilizado.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
            <dl className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-border px-5 py-4 sm:border-r">
                <dt className="text-xs text-muted-foreground">Estación</dt>
                <dd className="mt-2 flex items-start gap-2 text-sm font-medium">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  {session.connector.station.name}
                </dd>
              </div>

              <div className="border-b border-border px-5 py-4">
                <dt className="text-xs text-muted-foreground">Ciudad</dt>
                <dd className="mt-1 text-sm font-medium">
                  {session.connector.station.city || "Sin ciudad"}
                </dd>
              </div>

              <div className="border-b border-border px-5 py-4 sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Dirección</dt>
                <dd className="mt-1 wrap-break-word text-sm">
                  {session.connector.station.address || "Sin dirección"}
                </dd>
              </div>

              <div className="border-b border-border px-5 py-4 sm:border-r sm:border-b-0">
                <dt className="text-xs text-muted-foreground">
                  Tipo de conector
                </dt>
                <dd className="mt-2 flex items-center gap-2 text-sm font-medium">
                  <Plug className="size-4 text-muted-foreground" />
                  {session.connector.connector_type}
                </dd>
              </div>

              <div className="px-5 py-4">
                <dt className="text-xs text-muted-foreground">Potencia</dt>
                <dd className="mt-2 flex items-center gap-2 text-sm font-medium">
                  <Gauge className="size-4 text-muted-foreground" />
                  {session.connector.power_kw} kW
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">Consumo e importe</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Energía registrada y cálculo económico de la sesión.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
            <dl className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-border px-5 py-4 sm:border-r">
                <dt className="text-xs text-muted-foreground">
                  Energía consumida
                </dt>
                <dd className="mt-2 flex items-center gap-2 text-sm font-medium">
                  <Zap className="size-4 text-muted-foreground" />
                  {session.energy_kwh.toLocaleString("es-ES", {
                    maximumFractionDigits: 3,
                  })}{" "}
                  kWh
                </dd>
              </div>

              <div className="border-b border-border px-5 py-4">
                <dt className="text-xs text-muted-foreground">
                  Precio por kWh
                </dt>
                <dd className="mt-2 text-sm font-medium">
                  {formatCurrency(session.price_per_kwh)}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    / kWh
                  </span>
                </dd>
              </div>

              <div className="px-5 py-4 sm:col-span-2">
                <dt className="text-xs text-muted-foreground">
                  Importe total de la sesión
                </dt>
                <dd className="mt-1 flex items-center gap-2 text-lg font-semibold tracking-tight">
                  <Euro className="size-5 text-muted-foreground" />
                  {formatCurrency(session.total_amount)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="grid gap-6 border-t border-border pt-10 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="text-sm font-semibold">Pago asociado</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Estado y datos del pago. Esta sección es exclusivamente de
              consulta.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
            {!session.payment ? (
              <div className="flex items-start gap-3 p-5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                  <CreditCard className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sin pago registrado</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Esta sesión no tiene un pago asociado.
                  </p>
                </div>
              </div>
            ) : (
              <dl className="grid gap-0 sm:grid-cols-2">
                <div className="border-b border-border px-5 py-4 sm:border-r">
                  <dt className="text-xs text-muted-foreground">
                    Estado del pago
                  </dt>
                  <dd className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${paymentStatusClasses[session.payment.status]}`}
                    >
                      {paymentStatusLabels[session.payment.status]}
                    </span>
                  </dd>
                </div>

                <div className="border-b border-border px-5 py-4">
                  <dt className="text-xs text-muted-foreground">
                    Importe pagado o registrado
                  </dt>
                  <dd className="mt-1 text-sm font-medium">
                    {formatCurrency(
                      session.payment.amount,
                      session.payment.currency.replaceAll('"', ""),
                    )}
                  </dd>
                </div>

                <div className="border-b border-border px-5 py-4 sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">ID del pago</dt>
                  <dd className="mt-1 break-all font-mono text-xs">
                    {session.payment.id}
                  </dd>
                </div>

                <div className="px-5 py-4 sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">
                    Fecha de registro
                  </dt>
                  <dd className="mt-1 text-sm">
                    {formatDateTime(session.payment.created_at)}
                  </dd>
                </div>
              </dl>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
