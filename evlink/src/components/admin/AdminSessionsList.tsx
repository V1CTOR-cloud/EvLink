"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  MapPin,
  Plug,
  RotateCcw,
  Search,
  SlidersHorizontal,
  UserRound,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  AdminSession,
  AdminSessionStatusFilter,
} from "@/services/admin-sessions";
import { ADMIN_SESSIONS_PAGE_SIZE } from "@/services/admin-sessions";

type AdminSessionsListProps = {
  sessions: AdminSession[];
  count: number;
  page: number;
  pageCount: number;
  search: string;
  status: AdminSessionStatusFilter;
};

type SessionHrefOptions = {
  q?: string;
  status?: AdminSessionStatusFilter;
  page?: number;
};

const SESSION_STATUSES: {
  value: AdminSessionStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "Todos los estados" },
  { value: "pending", label: "Pendientes" },
  { value: "charging", label: "Cargando" },
  { value: "completed", label: "Completadas" },
  { value: "cancelled", label: "Canceladas" },
  { value: "failed", label: "Fallidas" },
];

const statusLabels: Record<AdminSession["status"], string> = {
  pending: "Pendiente",
  charging: "Cargando",
  completed: "Completada",
  cancelled: "Cancelada",
  failed: "Fallida",
};

const statusClasses: Record<AdminSession["status"], string> = {
  pending:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  charging: "border-primary/20 bg-primary/10 text-primary",
  completed:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  cancelled: "border-border bg-muted/60 text-muted-foreground",
  failed: "border-destructive/20 bg-destructive/10 text-destructive",
};

const headerClasses =
  "px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground";

const selectClassName =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatEnergy(energy: number) {
  return `${energy.toFixed(2)} kWh`;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function buildStatusHref(
  page: number,
  search: string,
  status: AdminSessionStatusFilter,
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
  return queryString ? `/admin/sessions?${queryString}` : "/admin/sessions";
}

function SessionStatus({ status }: { status: AdminSession["status"] }) {
  const StatusIcon =
    status === "completed"
      ? CheckCircle2
      : status === "failed"
        ? CircleAlert
        : status === "charging"
          ? Zap
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

function AdminSessionCard({ session }: { session: AdminSession }) {
  return (
    <article className="group relative rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">
            {session.connector.station.name}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">
              {session.connector.station.city || "Ubicación no disponible"}
            </span>
          </p>
        </div>

        <SessionStatus status={session.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground">Energía</p>
          <p className="mt-1 font-medium tabular-nums">
            {formatEnergy(session.energy_kwh)}
          </p>
        </div>

        <div className="rounded-lg bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground">Importe</p>
          <p className="mt-1 font-medium tabular-nums">
            {formatAmount(session.total_amount)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <CalendarDays className="size-3.5 shrink-0" />
          {formatDate(session.started_at)}
        </p>

        <p className="flex items-center gap-2">
          <UserRound className="size-3.5 shrink-0" />
          <span className="truncate">
            {session.user.full_name || "Usuario sin nombre"}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <Plug className="size-3.5 shrink-0" />
          {session.connector.connector_type.toUpperCase()} ·{" "}
          {session.connector.power_kw} kW
        </p>
      </div>

      <p className="mt-3 truncate font-mono text-[11px] text-muted-foreground">
        {session.id}
      </p>

      <Link
        href={`/admin/sessions/${session.id}`}
        aria-label={`Ver sesión de ${session.user.full_name || "usuario sin nombre"}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <span className="sr-only">Ver sesión</span>
      </Link>
    </article>
  );
}

function AdminSessionFilters({
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
  status: AdminSessionStatusFilter;
  onStatusChange: (status: AdminSessionStatusFilter) => void;
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
            <DialogTitle>Filtros de sesiones</DialogTitle>
            <DialogDescription>
              Filtra las sesiones de carga por su estado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label htmlFor="session-status" className="text-sm font-medium">
              Estado de la sesión
            </label>

            <select
              id="session-status"
              value={status}
              onChange={(event) =>
                onStatusChange(event.target.value as AdminSessionStatusFilter)
              }
              className={selectClassName}
            >
              {SESSION_STATUSES.map((option) => (
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

export function AdminSessionsList({
  sessions,
  count,
  page,
  pageCount,
  search,
  status,
}: AdminSessionsListProps) {
  const router = useRouter();

  const [query, setQuery] = useState(search);
  const [selectedStatus, setSelectedStatus] =
    useState<AdminSessionStatusFilter>(status);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const createHref = useCallback(
    (overrides: SessionHrefOptions = {}) => {
      const next = {
        q: query.trim(),
        status: selectedStatus,
        page: 1,
        ...overrides,
      };

      return buildStatusHref(
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

  function changeStatus(nextStatus: AdminSessionStatusFilter) {
    setSelectedStatus(nextStatus);
    router.replace(buildStatusHref(1, query.trim(), nextStatus));
  }

  function clearFilters() {
    setQuery("");
    setSelectedStatus("all");
    setFiltersOpen(false);
    router.replace("/admin/sessions");
  }

  const activeFilterCount = selectedStatus === "all" ? 0 : 1;
  const canClear = query.trim() !== "" || activeFilterCount > 0;

  const firstResult =
    count === 0 ? 0 : (page - 1) * ADMIN_SESSIONS_PAGE_SIZE + 1;
  const lastResult = Math.min(page * ADMIN_SESSIONS_PAGE_SIZE, count);

  return (
    <section className="space-y-5 p-4 sm:p-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Sesiones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulta y supervisa las sesiones de carga de la plataforma.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          {count} {count === 1 ? "sesión" : "sesiones"}
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
              placeholder="Buscar por usuario, estación o ID..."
              aria-label="Buscar sesiones"
              className="h-10 pl-9"
            />
          </div>

          <Button type="submit" variant="outline" className="h-10 shrink-0">
            Buscar
          </Button>
        </form>

        <AdminSessionFilters
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          status={selectedStatus}
          onStatusChange={changeStatus}
          activeFilterCount={activeFilterCount}
          canClear={canClear}
          onClear={clearFilters}
        />
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-14 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-muted">
            <Zap className="size-5 text-muted-foreground" />
          </div>

          <h2 className="mt-4 font-medium">No se encontraron sesiones</h2>

          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            No hay sesiones que coincidan con los criterios de búsqueda
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
            {sessions.map((session) => (
              <AdminSessionCard key={session.id} session={session} />
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-250 text-sm">
                <caption className="sr-only">
                  Lista de sesiones de carga
                </caption>

                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className={headerClasses}>Sesión</th>
                    <th className={headerClasses}>Usuario</th>
                    <th className={headerClasses}>Conector</th>
                    <th className={headerClasses}>Energía</th>
                    <th className={headerClasses}>Importe</th>
                    <th className={headerClasses}>Estado</th>
                    <th className={cn(headerClasses, "w-12")}>
                      <span className="sr-only">Abrir sesión</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      className="group relative transition-colors hover:bg-muted/40"
                    >
                      <td className="px-5 py-3.5">
                        <div className="min-w-0">
                          <Link
                            href={`/admin/sessions/${session.id}`}
                            className="block truncate font-medium after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset"
                          >
                            {session.connector.station.name}
                          </Link>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="size-3.5 shrink-0" />
                            {formatDate(session.started_at)}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="size-3.5 shrink-0" />
                            {session.connector.station.city || "Sin ubicación"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <p className="font-medium">
                          {session.user.full_name || "Usuario sin nombre"}
                        </p>
                        <p
                          title={session.user_id}
                          className="mt-1 font-mono text-[11px] text-muted-foreground"
                        >
                          {session.user_id.slice(0, 8)}
                        </p>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Plug className="size-4" />
                          </div>

                          <div>
                            <p className="font-medium">
                              {session.connector.connector_type.toUpperCase()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {session.connector.power_kw} kW
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 tabular-nums">
                        {formatEnergy(session.energy_kwh)}
                      </td>

                      <td className="px-5 py-3.5 font-medium tabular-nums">
                        {formatAmount(session.total_amount)}
                      </td>

                      <td className="px-5 py-3.5">
                        <SessionStatus status={session.status} />
                      </td>

                      <td className="px-4 py-3.5">
                        <ArrowUpRight className="pointer-events-none ml-auto size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
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
            de <span className="font-medium text-foreground">{count}</span>{" "}
            sesiones
          </p>

          <nav
            aria-label="Paginación de sesiones"
            className="flex items-center gap-2"
          >
            <Link
              aria-label="Página anterior"
              aria-disabled={page <= 1}
              tabIndex={page <= 1 ? -1 : undefined}
              href={buildStatusHref(page - 1, search, status)}
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
              href={buildStatusHref(page + 1, search, status)}
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
