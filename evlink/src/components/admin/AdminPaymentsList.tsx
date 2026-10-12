import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
} from "lucide-react";

import type {
  AdminPayment,
  AdminPaymentStatusFilter,
} from "@/services/admin-payments";

type AdminPaymentsListProps = {
  payments: AdminPayment[];
  count: number;
  page: number;
  pageCount: number;
  search: string;
  status: AdminPaymentStatusFilter;
};

const statusLabels: Record<AdminPayment["status"], string> = {
  pending: "Pendiente",
  completed: "Completado",
  failed: "Fallido",
  refunded: "Reembolsado",
};

const statusClasses: Record<AdminPayment["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  completed: "bg-green-500/10 text-green-600",
  failed: "bg-destructive/10 text-destructive",
  refunded: "bg-muted text-muted-foreground",
};

const selectClassName =
  "h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amount);
}

function buildPageUrl(
  page: number,
  search: string,
  status: AdminPaymentStatusFilter,
) {
  const params = new URLSearchParams();

  if (search) params.set("q", search);
  if (status !== "all") params.set("status", status);
  params.set("page", String(page));

  return `/admin/payments?${params.toString()}`;
}

export function AdminPaymentsList({
  payments,
  count,
  page,
  pageCount,
  search,
  status,
}: AdminPaymentsListProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <form
          action="/admin/payments"
          method="get"
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              name="q"
              defaultValue={search}
              maxLength={100}
              placeholder="Buscar por nombre de usuario..."
              aria-label="Buscar pagos por nombre de usuario"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <select
            name="status"
            defaultValue={status}
            aria-label="Filtrar pagos por estado"
            className={selectClassName}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completados</option>
            <option value="failed">Fallidos</option>
            <option value="refunded">Reembolsados</option>
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
          {count} {count === 1 ? "pago encontrado" : "pagos encontrados"}
        </p>
        <p>
          Página {page} de {pageCount}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-sm">
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
                <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Importe
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Estado
                </th>
                <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Sesión
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/70">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <CalendarDays
                        aria-hidden="true"
                        className="size-4 shrink-0 text-muted-foreground"
                      />
                      {formatDate(payment.created_at)}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="max-w-48 truncate font-medium">
                      {payment.user.full_name || "Usuario sin nombre"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      ID: {payment.user.id.slice(0, 8)}…
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <MapPin
                        aria-hidden="true"
                        className="size-4 shrink-0 text-primary"
                      />
                      <div>
                        <p className="font-medium">
                          {payment.session.station.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {payment.session.station.city}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right font-medium tabular-nums">
                    {formatAmount(payment.amount, payment.currency)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClasses[payment.status]}`}
                    >
                      {statusLabels[payment.status]}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <Link
                      href={`/admin/sessions/${payment.session_id}`}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Ver sesión
                    </Link>
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-muted-foreground"
                  >
                    No se encontraron pagos con estos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <nav
        aria-label="Paginación de pagos"
        className="flex items-center justify-between gap-3"
      >
        <Link
          href={buildPageUrl(Math.max(1, page - 1), search, status)}
          aria-disabled={page <= 1}
          tabIndex={page <= 1 ? -1 : undefined}
          className={`inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm ${
            page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-muted"
          }`}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
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
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      </nav>
    </div>
  );
}
