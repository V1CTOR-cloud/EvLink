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
import type {
  AdminUsersRoleFilter,
  AdminUsersSortOrder,
} from "@/services/admin-users";

export type AdminUsersPeriodFilter = "all" | "7d" | "30d" | "3m" | "custom";

type AdminUserFiltersProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: AdminUsersRoleFilter;
  onRoleChange: (role: AdminUsersRoleFilter) => void;
  roleCounts: Record<AdminUsersRoleFilter, number>;
  period: AdminUsersPeriodFilter;
  onPeriodChange: (period: AdminUsersPeriodFilter) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  sortOrder: AdminUsersSortOrder;
  onSortOrderChange: (order: AdminUsersSortOrder) => void;
  dateRangeInvalid: boolean;
  activeFilterCount: number;
  canClear: boolean;
  onClear: () => void;
};

const roleFilters: { value: AdminUsersRoleFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "driver", label: "Conductores" },
  { value: "admin", label: "Administradores" },
];

const selectClassName =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function AdminUserFilters({
  open,
  onOpenChange,
  role,
  onRoleChange,
  roleCounts,
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
}: AdminUserFiltersProps) {
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
            <DialogTitle>Filtros de usuarios</DialogTitle>
            <DialogDescription>
              Filtra los perfiles por rol y fecha de registro.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Rol</legend>
              <div className="flex flex-wrap gap-2">
                {roleFilters.map((filter) => {
                  const selected = role === filter.value;

                  return (
                    <button
                      key={filter.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onRoleChange(filter.value)}
                      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        selected
                          ? "border-primary/30 bg-primary/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {filter.label}
                      <span
                        className={
                          selected
                            ? "rounded-full bg-primary/15 px-1.5 tabular-nums text-foreground"
                            : "rounded-full bg-muted px-1.5 tabular-nums"
                        }
                      >
                        {roleCounts[filter.value]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="space-y-2">
              <label htmlFor="user-period" className="text-sm font-medium">
                Periodo de registro
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="user-period"
                  value={period}
                  onChange={(event) =>
                    onPeriodChange(event.target.value as AdminUsersPeriodFilter)
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
                    aria-label="Fecha inicial del registro"
                    aria-invalid={dateRangeInvalid}
                    aria-describedby={
                      dateRangeInvalid ? "user-date-error" : undefined
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
                    aria-label="Fecha final del registro"
                    aria-invalid={dateRangeInvalid}
                    aria-describedby={
                      dateRangeInvalid ? "user-date-error" : undefined
                    }
                  />
                </label>
                {dateRangeInvalid && (
                  <p
                    id="user-date-error"
                    role="alert"
                    className="text-xs text-destructive sm:col-span-2"
                  >
                    La fecha inicial no puede ser posterior a la fecha final.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="user-sort-order" className="text-sm font-medium">
                Ordenar por
              </label>
              <select
                id="user-sort-order"
                value={sortOrder}
                onChange={(event) =>
                  onSortOrderChange(event.target.value as AdminUsersSortOrder)
                }
                className={selectClassName}
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="name-asc">Nombre (A–Z)</option>
                <option value="name-desc">Nombre (Z–A)</option>
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
