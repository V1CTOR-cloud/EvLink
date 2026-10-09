"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List, RotateCcw, Search } from "lucide-react";

import { ErrorState } from "@/components/common/ErrorState";
import { SessionCard } from "@/components/sessions/SessionCard";
import { SessionsTable } from "@/components/sessions/SessionTable";
import {
  SessionFilters,
  type SessionPeriodFilter,
  type SessionSortOrder,
  type SessionStatusFilter,
} from "@/components/sessions/SessionFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useChargingSessions } from "@/hooks/useChargingSessions";
import { isSessionActive } from "@/lib/session-utils";
import type { ChargingSession } from "@/types";

type SessionView = "table" | "cards";

function startOfLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getPeriodStart(period: SessionPeriodFilter, now: Date) {
  const start = new Date(now);

  if (period === "7d") {
    start.setDate(start.getDate() - 7);
  } else if (period === "30d") {
    start.setDate(start.getDate() - 30);
  } else if (period === "3m") {
    const dayOfMonth = start.getDate();
    start.setDate(1);
    start.setMonth(start.getMonth() - 3);
    const lastDayOfMonth = new Date(
      start.getFullYear(),
      start.getMonth() + 1,
      0,
    ).getDate();
    start.setDate(Math.min(dayOfMonth, lastDayOfMonth));
  } else {
    return null;
  }

  return start;
}

function matchesPeriod(
  session: ChargingSession,
  period: SessionPeriodFilter,
  startDate: string,
  endDate: string,
  now: Date,
) {
  if (period === "all") {
    return true;
  }

  const createdAt = new Date(session.created_at);
  if (Number.isNaN(createdAt.getTime())) {
    return false;
  }

  if (period === "custom") {
    if (startDate && createdAt < startOfLocalDate(startDate)) {
      return false;
    }

    if (endDate) {
      const endExclusive = startOfLocalDate(endDate);
      endExclusive.setDate(endExclusive.getDate() + 1);
      if (createdAt >= endExclusive) {
        return false;
      }
    }

    return true;
  }

  const periodStart = getPeriodStart(period, now);
  return periodStart !== null && createdAt >= periodStart && createdAt <= now;
}

function compareNullableNumbers(
  left: number | null,
  right: number | null,
  direction: 1 | -1,
) {
  if (left === null || !Number.isFinite(left)) {
    return right === null || !Number.isFinite(right) ? 0 : 1;
  }

  if (right === null || !Number.isFinite(right)) {
    return -1;
  }

  return (left - right) * direction;
}

function compareCreatedAt(
  left: ChargingSession,
  right: ChargingSession,
  direction: 1 | -1,
) {
  const leftTime = new Date(left.created_at).getTime();
  const rightTime = new Date(right.created_at).getTime();
  const leftValid = Number.isFinite(leftTime);
  const rightValid = Number.isFinite(rightTime);

  if (!leftValid) {
    return rightValid ? 1 : 0;
  }

  if (!rightValid) {
    return -1;
  }

  return (leftTime - rightTime) * direction;
}

function sortSessions(sessions: ChargingSession[], order: SessionSortOrder) {
  return [...sessions].sort((left, right) => {
    switch (order) {
      case "oldest":
        return compareCreatedAt(left, right, 1);
      case "energy-desc":
        return compareNullableNumbers(left.energy_kwh, right.energy_kwh, -1);
      case "energy-asc":
        return compareNullableNumbers(left.energy_kwh, right.energy_kwh, 1);
      case "cost-desc":
        return compareNullableNumbers(left.total_amount, right.total_amount, -1);
      case "cost-asc":
        return compareNullableNumbers(left.total_amount, right.total_amount, 1);
      case "newest":
      default:
        return compareCreatedAt(left, right, -1);
    }
  });
}

function matchesStatus(
  session: ChargingSession,
  status: SessionStatusFilter,
) {
  if (status === "all") {
    return true;
  }

  if (status === "active") {
    return isSessionActive(session.status);
  }

  return session.status === status;
}

export default function SessionsPage() {
  const { user } = useAuth();
  const { sessions, loading, error } = useChargingSessions(user?.id);
  const [view, setView] = useState<SessionView>("table");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SessionStatusFilter>("all");
  const [period, setPeriod] = useState<SessionPeriodFilter>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState<SessionSortOrder>("newest");

  const dateRangeInvalid =
    period === "custom" &&
    Boolean(startDate && endDate && startDate > endDate);

  const matchingSearchAndPeriod = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es-ES");
    const now = new Date();

    return sessions.filter((session) => {
      const station = session.connector.station;
      const searchableText = [
        station.name,
        station.address,
        station.city,
      ]
        .join(" ")
        .toLocaleLowerCase("es-ES");

      return (
        searchableText.includes(normalizedQuery) &&
        matchesPeriod(session, period, startDate, endDate, now)
      );
    });
  }, [endDate, period, query, sessions, startDate]);

  const statusCounts = useMemo(() => {
    const counts = {
      all: matchingSearchAndPeriod.length,
      active: 0,
      pending: 0,
      charging: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
    };

    for (const session of matchingSearchAndPeriod) {
      if (session.status === "pending" || session.status === "charging") {
        counts.active += 1;
      }

      counts[session.status] += 1;
    }

    return counts;
  }, [matchingSearchAndPeriod]);

  const filteredSessions = useMemo(() => {
    if (dateRangeInvalid) {
      return [];
    }

    return sortSessions(
      matchingSearchAndPeriod.filter((session) =>
        matchesStatus(session, status),
      ),
      sortOrder,
    );
  }, [dateRangeInvalid, matchingSearchAndPeriod, sortOrder, status]);

  const hasActiveFilters =
    query.trim() !== "" ||
    status !== "all" ||
    period !== "all" ||
    sortOrder !== "newest";
  const activeFilterCount =
    Number(status !== "all") +
    Number(period !== "all") +
    Number(sortOrder !== "newest");

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setPeriod("all");
    setStartDate("");
    setEndDate("");
    setSortOrder("newest");
  }

  if (loading) {
    return (
      <section className="p-6">
        <p className="text-muted-foreground">Cargando sesiones...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6">
        <ErrorState message="No se pudieron cargar las sesiones." />
      </section>
    );
  }

  return (
    <section className="space-y-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Mis sesiones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulta y gestiona tus cargas.
          </p>
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <span className="font-semibold tabular-nums text-foreground">
            {filteredSessions.length}
          </span>{" "}
          {filteredSessions.length === 1 ? "sesión" : "sesiones"}
        </p>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Buscar estación por nombre o ubicación</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar estación..."
            className="h-9 pl-9"
          />
        </label>
        <div className="flex items-center justify-end gap-2">
          <div
            className="inline-flex rounded-lg border border-border bg-card p-0.5"
            role="group"
            aria-label="Vista del historial de sesiones"
          >
            <Button
              type="button"
              variant={view === "table" ? "secondary" : "ghost"}
              size="icon-sm"
              aria-label="Vista de tabla"
              aria-pressed={view === "table"}
              onClick={() => setView("table")}
            >
              <List className="size-4" />
            </Button>
            <Button
              type="button"
              variant={view === "cards" ? "secondary" : "ghost"}
              size="icon-sm"
              aria-label="Vista de tarjetas"
              aria-pressed={view === "cards"}
              onClick={() => setView("cards")}
            >
              <LayoutGrid className="size-4" />
            </Button>
          </div>
          <SessionFilters
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            status={status}
            onStatusChange={setStatus}
            statusCounts={statusCounts}
            period={period}
            onPeriodChange={setPeriod}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            dateRangeInvalid={dateRangeInvalid}
            activeFilterCount={activeFilterCount}
            canClear={hasActiveFilters}
            onClear={clearFilters}
          />
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium">Todavía no tienes sesiones.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cuando realices una carga, aparecerá en tu historial.
          </p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium">No se encontraron sesiones.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Prueba a cambiar la búsqueda o los filtros seleccionados.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw className="size-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        view === "table" ? (
          <SessionsTable sessions={filteredSessions} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )
      )}
    </section>
  );
}
