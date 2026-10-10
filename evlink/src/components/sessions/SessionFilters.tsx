"use client";

import { CalendarDays, RotateCcw, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { sessionStatusLabels } from "@/lib/session-utils";
import type { ChargingSession } from "@/types";

export type SessionStatusFilter =
  | "all"
  | "active"
  | ChargingSession["status"];

export type SessionPeriodFilter = "all" | "7d" | "30d" | "3m" | "custom";

export type SessionSortOrder =
  | "newest"
  | "oldest"
  | "energy-desc"
  | "energy-asc"
  | "cost-desc"
  | "cost-asc";

type SessionFiltersProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: SessionStatusFilter;
  onStatusChange: (status: SessionStatusFilter) => void;
  statusCounts: Record<SessionStatusFilter, number>;
  period: SessionPeriodFilter;
  onPeriodChange: (period: SessionPeriodFilter) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  sortOrder: SessionSortOrder;
  onSortOrderChange: (order: SessionSortOrder) => void;
  dateRangeInvalid: boolean;
  activeFilterCount: number;
  canClear: boolean;
  onClear: () => void;
};

const statusFilters: { value: SessionStatusFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "active", label: "Activas" },
  { value: "pending", label: sessionStatusLabels.pending },
  { value: "completed", label: sessionStatusLabels.completed },
  { value: "failed", label: sessionStatusLabels.failed },
  { value: "cancelled", label: sessionStatusLabels.cancelled },
];

const selectClassName =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function SessionFilters({
  open,
  onOpenChange,
  status,
  onStatusChange,
  statusCounts,
  period,
  onPeriodChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  sortOrder,
  onSortOrderChange,
  dateRangeInvalid,
  activeFilterCount,
  canClear,
  onClear,
}: SessionFiltersProps) {
  return (
    <>
      <Button
        type="button"
        variant={activeFilterCount > 0 ? "secondary" : "outline"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => onOpenChange(true)}
        className="h-10 gap-2"
      >
        <SlidersHorizontal className="size-4" />
        Filtros
        {activeFilterCount > 0 && (
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {activeFilterCount}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[min(90dvh,44rem)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Filtros de sesiones</DialogTitle>
            <DialogDescription>
              Los resultados se actualizan al cambiar los filtros.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Estado</legend>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => {
                  const selected = status === filter.value;
                  const count =
                    filter.value === "all"
                      ? statusCounts.all
                      : filter.value === "active"
                        ? statusCounts.active
                        : statusCounts[filter.value];

                  return (
                    <button
                      key={filter.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onStatusChange(filter.value)}
                      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {filter.label}
                      <span
                        className={
                          selected
                            ? "rounded-full bg-primary-foreground/15 px-1.5 tabular-nums"
                            : "rounded-full bg-muted px-1.5 tabular-nums"
                        }
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="space-y-2">
              <label
                htmlFor="session-period"
                className="text-sm font-medium"
              >
                Periodo
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="session-period"
                  value={period}
                  onChange={(event) =>
                    onPeriodChange(event.target.value as SessionPeriodFilter)
                  }
                  className={`${selectClassName} pl-9`}
                >
                  <option value="all">Todo el historial</option>
                  <option value="7d">Últimos 7 días</option>
                  <option value="30d">Últimos 30 días</option>
                  <option value="3m">Últimos 3 meses</option>
                  <option value="custom">Periodo personalizado</option>
                </select>
              </div>
            </div>

            {period === "custom" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-medium">
                  <span>Desde</span>
                  <Input
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(event) => onStartDateChange(event.target.value)}
                    aria-label="Fecha inicial del periodo"
                    aria-invalid={dateRangeInvalid}
                    aria-describedby={
                      dateRangeInvalid ? "session-date-error" : undefined
                    }
                  />
                </label>
                <label className="space-y-1.5 text-sm font-medium">
                  <span>Hasta</span>
                  <Input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(event) => onEndDateChange(event.target.value)}
                    aria-label="Fecha final del periodo"
                    aria-invalid={dateRangeInvalid}
                    aria-describedby={
                      dateRangeInvalid ? "session-date-error" : undefined
                    }
                  />
                </label>
                {dateRangeInvalid && (
                  <p
                    id="session-date-error"
                    role="alert"
                    className="text-xs text-destructive sm:col-span-2"
                  >
                    La fecha inicial no puede ser posterior a la fecha final.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="session-sort-order"
                className="text-sm font-medium"
              >
                Ordenar por
              </label>
              <select
                id="session-sort-order"
                value={sortOrder}
                onChange={(event) =>
                  onSortOrderChange(event.target.value as SessionSortOrder)
                }
                className={selectClassName}
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguas</option>
                <option value="energy-desc">Mayor consumo</option>
                <option value="energy-asc">Menor consumo</option>
                <option value="cost-desc">Mayor coste</option>
                <option value="cost-asc">Menor coste</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClear}
              disabled={!canClear}
            >
              <RotateCcw className="size-4" />
              Limpiar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
