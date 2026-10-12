
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plug,
  Search,
} from "lucide-react";

import type {
  AdminSession,
  AdminSessionStatusFilter,
} from "@/services/admin-sessions";

type AdminSessionsListProps = {
  sessions: AdminSession[];
  count: number;
  page: number;
  pageCount: number;
  search: string;
  status: AdminSessionStatusFilter;
};

const statusLabels: Record<AdminSession["status"], string> = {
  pending: "Pendiente",
  charging: "Cargando",
  completed: "Completada",
  cancelled: "Cancelada",
  failed: "Fallida",
};

const statusClasses: Record<AdminSession["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  charging: "bg-primary/10 text-primary",
  completed: "bg-green-500/10 text-green-600",
  cancelled: "bg-muted text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
};

const selectClassName =
  "h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatEnergy(energy: number) {
  return `${energy.toFixed(2)} kWh`;
}

function formatAmount(amount: number) {
  return `${amount.toFixed(2)} €`;
}

function buildPageUrl(
  page: number,
  search: string,
  status: AdminSessionStatusFilter,
) {
  const params = new URLSearchParams();

  if (search) params.set("q", search);
  if (status !== "all") params.set("status", status);
  params.set("page", String(page));

  return `/admin/sessions?${params.toString()}`;
}

export function AdminSessionsList({
  sessions,
  count,
  page,
  pageCount,
  search,
  status,
}: AdminSessionsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center">
        <form
          action="/admin/sessions"
          method="get"
          className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="q"
              defaultValue={search}
              maxLength={100}
              placeholder="Buscar por nombre de usuario..."
              aria-label="Buscar sesiones por nombre de usuario"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <select
            name="status"
            defaultValue={status}
            aria-label="Filtrar por estado"
            className={selectClassName}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="charging">Cargando</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
            <option value="failed">Fallida</option>
          </select>

          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>
          {count} {count === 1 ? "sesión encontrada" : "sesiones encontradas"}
        </p>
        <p>
          Página {page} de {pageCount}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Fecha
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Usuario
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Estación
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Conector
                </th>
                <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Energía
                </th>
                <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Importe
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/70">
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                      {formatDate(session.created_at)}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="max-w-48 truncate font-medium">
                      {session.user.full_name}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      ID: {session.user.id.slice(0, 8)}…
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <MapPin className="size-4 shrink-0 text-primary" />
                      <div>
                        <p className="font-medium">
                          {session.connector.station.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {session.connector.station.city}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Plug className="size-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {session.connector.connector_type.toUpperCase()}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {session.connector.power_kw} kW
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right tabular-nums">
                    {formatEnergy(session.energy_kwh)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right font-medium tabular-nums">
                    {formatAmount(session.total_amount)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClasses[session.status]}`}
                    >
                      {session.status === "charging" && (
                        <span className="size-1.5 animate-pulse rounded-full bg-current" />
                      )}
                      {statusLabels[session.status]}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <Link
                      href={`/admin/sessions/${session.id}`}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}

              {sessions.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-muted-foreground"
                  >
                    No se encontraron sesiones con estos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <nav
        aria-label="Paginación de sesiones"
        className="flex items-center justify-between gap-3"
      >
        <Link
          href={buildPageUrl(Math.max(1, page - 1), search, status)}
          aria-disabled={page <= 1}
          tabIndex={page <= 1 ? -1 : undefined}
          className={`inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm ${
            page <= 1
              ? "pointer-events-none opacity-40"
              : "hover:bg-muted"
          }`}
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Link>

        <span className="text-sm text-muted-foreground">
          {count > 0
            ? `${(page - 1) * 10 + 1}–${Math.min(page * 10, count)} de ${count}`
            : "0 resultados"}
        </span>

        <Link
          href={buildPageUrl(Math.min(pageCount, page + 1), search, status)}
          aria-disabled={page >= pageCount}
          tabIndex={page >= pageCount ? -1 : undefined}
          className={`inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm ${
            page >= pageCount
              ? "pointer-events-none opacity-40"
              : "hover:bg-muted"
          }`}
        >
          Siguiente
          <ChevronRight className="size-4" />
        </Link>
      </nav>
    </div>
  );
}
