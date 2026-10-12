
"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  UserRound,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  AdminPayment,
  AdminPaymentStatusFilter,
} from "@/services/admin-payments";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription } from "../ui/dialog";

type AdminPaymentsListProps = {
  payments: AdminPayment[];
  count: number;
  page: number;
  pageCount: number;
  search: string;
  status: AdminPaymentStatusFilter;
};

type PaymentHrefOptions = {
  q?: string;
  status?: AdminPaymentStatusFilter;
  page?: number;
};

const PAYMENT_STATUSES: {
  value: AdminPaymentStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "Todos los estados" },
  { value: "pending", label: "Pendientes" },
  { value: "completed", label: "Completados" },
  { value: "failed", label: "Fallidos" },
  { value: "refunded", label: "Reembolsados" },
];

const statusLabels: Record<AdminPayment["status"], string> = {
  pending: "Pendiente",
  completed: "Completado",
  failed: "Fallido",
  refunded: "Reembolsado",
};

const statusClasses: Record<AdminPayment["status"], string> = {
  pending:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  completed:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  failed:
    "border-destructive/20 bg-destructive/10 text-destructive",
  refunded:
    "border-border bg-muted/60 text-muted-foreground",
};

const headerClasses =
  "px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground";

const selectClassName =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

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

  if (search.trim()) {
    params.set("q", search.trim());
  }

  if (status !== "all") {
    params.set("status", status);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return queryString
    ? `/admin/payments?${queryString}`
    : "/admin/payments";
}

function PaymentStatus({
  status,
}: {
  status: AdminPayment["status"];
}) {
  const StatusIcon =
    status === "completed"
      ? CheckCircle2
      : status === "failed"
        ? CircleAlert
        : Clock3;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium",
        statusClasses[status],
      )}
    >
      <StatusIcon className="size-3.5" />
      {statusLabels[status]}
    </span>
  );
}

function AdminPaymentCard({
  payment,
}: {
  payment: AdminPayment;
}) {
  return (
    <article className="group relative rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium">
              {payment.user.full_name || "Usuario sin nombre"}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {payment.session.station.name}
            </p>
          </div>
        </div>

        <PaymentStatus status={payment.status} />
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Importe</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {formatAmount(payment.amount, payment.currency)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">Fecha</p>
          <p className="mt-1 text-xs font-medium">
            {formatDate(payment.created_at)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">
            {payment.session.station.city || "Ubicación no disponible"}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <UserRound className="size-3.5 shrink-0" />
          <span className="truncate">
            Usuario · {payment.user.id.slice(0, 8)}…
          </span>
        </p>

        <p className="truncate font-mono">
          Pago · {payment.id.slice(0, 8)}…
        </p>
      </div>

      <Link
        href={`/admin/payments/${payment.id}`}
        aria-label={`Abrir la sesión asociada al pago de ${formatAmount(payment.amount, payment.currency)}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <span className="sr-only">Abrir sesión asociada</span>
      </Link>
    </article>
  );
}

function AdminPaymentFilters({
  open,
  onOpenChange,
  status,
  onStatusChange,
  activeFilterCount,
  canClear,
  onClear,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: AdminPaymentStatusFilter;
  onStatusChange: (status: AdminPaymentStatusFilter) => void;
  activeFilterCount: number;
  canClear: boolean;
  onClear: () => void;
}) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => onOpenChange(true)}
        className="h-10 gap-2"
      >
        <SlidersHorizontal className="size-4" />
        Filtros

        {activeFilterCount > 0 && (
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-foreground">
            {activeFilterCount}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[min(90dvh,44rem)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Filtros de pagos</DialogTitle>
            <DialogDescription>
              Filtra los pagos según su estado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="payment-status"
              className="text-sm font-medium"
            >
              Estado del pago
            </label>

            <select
              id="payment-status"
              value={status}
              onChange={(event) =>
                onStatusChange(
                  event.target.value as AdminPaymentStatusFilter,
                )
              }
              className={selectClassName}
            >
              {PAYMENT_STATUSES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClear}
              disabled={!canClear}
            >
              <RotateCcw className="size-4" />
              Limpiar filtros
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AdminPaymentsList({
  payments,
  count,
  page,
  pageCount,
  search,
  status,
}: AdminPaymentsListProps) {
  const router = useRouter();

  const [query, setQuery] = useState(search);
  const [selectedStatus, setSelectedStatus] =
    useState<AdminPaymentStatusFilter>(status);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

  const createHref = useCallback(
    (overrides: PaymentHrefOptions = {}) => {
      const next = {
        q: query.trim(),
        status: selectedStatus,
        page: 1,
        ...overrides,
      };

      return buildPageUrl(
        next.page ?? 1,
        next.q ?? "",
        next.status ?? "all",
      );
    },
    [query, selectedStatus],
  );

  useEffect(() => {
    if (query.trim() === search) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.replace(createHref({ q: query.trim() }));
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [createHref, query, router, search]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.replace(createHref({ q: query.trim() }));
  }

  function changeStatus(nextStatus: AdminPaymentStatusFilter) {
    setSelectedStatus(nextStatus);
    router.replace(
      buildPageUrl(1, query.trim(), nextStatus),
    );
  }

  function clearFilters() {
    setQuery("");
    setSelectedStatus("all");
    setFiltersOpen(false);
    router.replace("/admin/payments");
  }

  const activeFilterCount = selectedStatus === "all" ? 0 : 1;
  const canClear = query.trim() !== "" || activeFilterCount > 0;

  const firstResult =
    count === 0 ? 0 : (page - 1) * 10 + 1;
  const lastResult = Math.min(page * 10, count);

  return (
    <section className="space-y-5 p-4 sm:p-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Pagos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulta los pagos asociados a las sesiones de carga.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          {count} {count === 1 ? "pago" : "pagos"}
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          onSubmit={handleSearch}
          className="flex min-w-0 flex-1 items-center gap-2"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              maxLength={100}
              placeholder="Buscar por nombre de usuario..."
              aria-label="Buscar pagos por nombre de usuario"
              className="h-10 pl-9"
            />
          </div>

          <Button
            type="submit"
            variant="outline"
            className="h-10 shrink-0"
          >
            Buscar
          </Button>
        </form>

        <AdminPaymentFilters
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          status={selectedStatus}
          onStatusChange={changeStatus}
          activeFilterCount={activeFilterCount}
          canClear={canClear}
          onClear={clearFilters}
        />
      </div>

      {payments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-14 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-muted">
            <Wallet className="size-5 text-muted-foreground" />
          </div>

          <h2 className="mt-4 font-medium">
            No se encontraron pagos
          </h2>

          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            No hay pagos que coincidan con los criterios de búsqueda
            actuales. Prueba con otra búsqueda o limpia los filtros.
          </p>

          {canClear && (
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              <RotateCcw className="size-4" />
              Limpiar búsqueda y filtros
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {payments.map((payment) => (
              <AdminPaymentCard
                key={payment.id}
                payment={payment}
              />
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-sm">
                <caption className="sr-only">
                  Lista de pagos
                </caption>

                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className={headerClasses}>Fecha</th>
                    <th className={headerClasses}>Usuario</th>
                    <th className={headerClasses}>Estación</th>
                    <th className={cn(headerClasses, "text-right")}>
                      Importe
                    </th>
                    <th className={headerClasses}>Estado</th>
                    <th className={cn(headerClasses, "w-12")}>
                      <span className="sr-only">Abrir pago</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="group relative transition-colors hover:bg-muted/40"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center gap-2.5 text-muted-foreground">
                          <CalendarDays className="size-4 shrink-0" />
                          {formatDate(payment.created_at)}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <p className="font-medium">
                          {payment.user.full_name || "Usuario sin nombre"}
                        </p>
                        <p
                          title={payment.user.id}
                          className="mt-1 font-mono text-[11px] text-muted-foreground"
                        >
                          {payment.user.id.slice(0, 8)}…
                        </p>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <MapPin className="size-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {payment.session.station.name}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {payment.session.station.city || "Sin ubicación"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-3.5 text-right font-medium tabular-nums">
                        {formatAmount(payment.amount, payment.currency)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-3.5">
                        <PaymentStatus status={payment.status} />
                      </td>

                      <td className="px-4 py-3.5">
                        <ArrowUpRight className="pointer-events-none ml-auto size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                        <Link
                          href={`/admin/payments/${payment.id}`}
                          tabIndex={-1}
                          aria-hidden="true"
                          className="absolute inset-0 focus-visible:outline-none"
                        >
                          <span className="sr-only">Abrir sesión asociada</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {pageCount > 1 && (
        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando{" "}
            <span className="font-medium text-foreground">
              {firstResult}–{lastResult}
            </span>{" "}
            de{" "}
            <span className="font-medium text-foreground">{count}</span>{" "}
            pagos
          </p>

          <nav
            aria-label="Paginación de pagos"
            className="flex items-center gap-2"
          >
            <Link
              aria-label="Página anterior"
              aria-disabled={page <= 1}
              tabIndex={page <= 1 ? -1 : undefined}
              href={buildPageUrl(page - 1, search, status)}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                page <= 1 && "pointer-events-none opacity-50",
              )}
            >
              <ChevronLeft className="size-4" />
            </Link>

            <span className="min-w-24 text-center text-sm tabular-nums text-muted-foreground">
              Página {page} de {pageCount}
            </span>

            <Link
              aria-label="Página siguiente"
              aria-disabled={page >= pageCount}
              tabIndex={page >= pageCount ? -1 : undefined}
              href={buildPageUrl(page + 1, search, status)}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                page >= pageCount && "pointer-events-none opacity-50",
              )}
            >
              <ChevronRight className="size-4" />
            </Link>
          </nav>
        </div>
      )}
    </section>
  );
}
