"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Search, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AdminUserFilters,
  type AdminUsersPeriodFilter,
} from "@/components/admin/AdminUserFilters";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  AdminUser,
  AdminUsersRoleFilter,
  AdminUsersSortOrder,
} from "@/services/admin-users";
import { ADMIN_USERS_PAGE_SIZE } from "@/services/admin-users";
import AdminUserCard from "./AdminUserCard";
import { AdminUsersTable } from "./AdminUserTable";

type AdminUsersListProps = {
  users: AdminUser[];
  count: number;
  roleCounts: Record<AdminUsersRoleFilter, number>;
  search: string;
  page: number;
  pageCount: number;
  role: AdminUsersRoleFilter;
  period: AdminUsersPeriodFilter;
  startDate: string;
  endDate: string;
  sortOrder: AdminUsersSortOrder;
};

type AdminUsersFiltersState = {
  query: string;
  role: AdminUsersRoleFilter;
  period: AdminUsersPeriodFilter;
  startDate: string;
  endDate: string;
  sortOrder: AdminUsersSortOrder;
};

type UserListHrefOptions = {
  q?: string;
  role?: AdminUsersRoleFilter;
  period?: AdminUsersPeriodFilter;
  startDate?: string;
  endDate?: string;
  sortOrder?: AdminUsersSortOrder;
  page?: number;
};

export function AdminUsersList({
  users,
  count,
  roleCounts,
  search,
  page,
  pageCount,
  role,
  period,
  startDate,
  endDate,
  sortOrder,
}: AdminUsersListProps) {
  const router = useRouter();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<AdminUsersFiltersState>({
    query: search,
    role,
    period,
    startDate,
    endDate,
    sortOrder,
  });

  const {
    query,
    role: selectedRole,
    period: selectedPeriod,
    startDate: selectedStartDate,
    endDate: selectedEndDate,
    sortOrder: selectedSortOrder,
  } = filters;

  const dateRangeInvalid =
    selectedPeriod === "custom" &&
    Boolean(
      selectedStartDate &&
      selectedEndDate &&
      selectedStartDate > selectedEndDate,
    );

  const activeFilterCount =
    Number(selectedRole !== "all") +
    Number(selectedPeriod !== "all") +
    Number(selectedSortOrder !== "newest");

  const canClear =
    query.trim() !== "" ||
    selectedRole !== "all" ||
    selectedPeriod !== "all" ||
    selectedStartDate !== "" ||
    selectedEndDate !== "" ||
    selectedSortOrder !== "newest";

  const visibleUsers = dateRangeInvalid ? [] : users;
  const visibleCount = dateRangeInvalid ? 0 : count;
  const visiblePageCount = dateRangeInvalid ? 0 : pageCount;

  const createHref = useCallback(
    (overrides: UserListHrefOptions = {}) => {
      const params = new URLSearchParams();

      const next = {
        q: filters.query.trim(),
        role: filters.role,
        period: filters.period,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortOrder: filters.sortOrder,
        page: 1,
        ...overrides,
      };

      if (next.q) {
        params.set("q", next.q);
      }

      if (next.role !== "all") {
        params.set("role", next.role);
      }

      if (next.period !== "all") {
        params.set("period", next.period);
      }

      if (next.period === "custom" && next.startDate) {
        params.set("startDate", next.startDate);
      }

      if (next.period === "custom" && next.endDate) {
        params.set("endDate", next.endDate);
      }

      if (next.sortOrder !== "newest") {
        params.set("sort", next.sortOrder);
      }

      if (next.page > 1) {
        params.set("page", String(next.page));
      }

      const queryString = params.toString();

      return queryString ? `/admin/users?${queryString}` : "/admin/users";
    },
    [filters],
  );

  // Búsqueda automática con debounce.
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

  function clearFilters() {
    setFilters({
      query: "",
      role: "all",
      period: "all",
      startDate: "",
      endDate: "",
      sortOrder: "newest",
    });

    router.replace("/admin/users");
  }

  function updateStartDate(value: string) {
    const nextFilters: AdminUsersFiltersState = {
      ...filters,
      period: "custom",
      startDate: value,
    };

    setFilters(nextFilters);

    if (!nextFilters.endDate || value <= nextFilters.endDate) {
      router.replace(
        createHref({
          period: "custom",
          startDate: value,
        }),
      );
    }
  }

  function updateEndDate(value: string) {
    const nextFilters: AdminUsersFiltersState = {
      ...filters,
      period: "custom",
      endDate: value,
    };

    setFilters(nextFilters);

    if (!nextFilters.startDate || value >= nextFilters.startDate) {
      router.replace(
        createHref({
          period: "custom",
          endDate: value,
        }),
      );
    }
  }

  const firstResult =
    visibleCount === 0 ? 0 : (page - 1) * ADMIN_USERS_PAGE_SIZE + 1;

  const lastResult = Math.min(page * ADMIN_USERS_PAGE_SIZE, visibleCount);

  return (
    <section className="space-y-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulta y gestiona los perfiles registrados.
          </p>
        </div>

        <p className="text-sm text-muted-foreground" aria-live="polite">
          <span className="font-semibold tabular-nums text-foreground">
            {visibleCount}
          </span>{" "}
          {visibleCount === 1 ? "usuario" : "usuarios"}
        </p>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row">
        <form
          className="flex min-w-0 flex-1 gap-2"
          onSubmit={handleSearch}
          role="search"
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Buscar usuario por nombre</span>

            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              type="search"
              value={filters.query}
              maxLength={100}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  query: event.target.value,
                }))
              }
              placeholder="Buscar usuario..."
              className="h-9 pl-9"
            />
          </label>

          <Button type="submit" variant="outline">
            Buscar
          </Button>
        </form>

        <div className="flex items-center justify-end gap-2">
          <AdminUserFilters
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            role={filters.role}
            onRoleChange={(nextRole) => {
              setFilters((current) => ({
                ...current,
                role: nextRole,
              }));

              router.replace(createHref({ role: nextRole }));
            }}
            roleCounts={roleCounts}
            period={filters.period}
            onPeriodChange={(nextPeriod) => {
              setFilters((current) => ({
                ...current,
                period: nextPeriod,
              }));

              router.replace(
                createHref({
                  period: nextPeriod,
                  startDate: nextPeriod === "custom" ? filters.startDate : "",
                  endDate: nextPeriod === "custom" ? filters.endDate : "",
                }),
              );
            }}
            startDate={filters.startDate}
            onStartDateChange={updateStartDate}
            endDate={filters.endDate}
            onEndDateChange={updateEndDate}
            sortOrder={filters.sortOrder}
            onSortOrderChange={(nextSortOrder) => {
              setFilters((current) => ({
                ...current,
                sortOrder: nextSortOrder,
              }));

              router.replace(createHref({ sortOrder: nextSortOrder }));
            }}
            dateRangeInvalid={dateRangeInvalid}
            activeFilterCount={activeFilterCount}
            canClear={canClear}
            onClear={clearFilters}
          />
        </div>
      </div>

      {visibleUsers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
          <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-md bg-muted">
            <Users
              aria-hidden="true"
              className="size-5 text-muted-foreground"
            />
          </div>
          <p className="text-sm font-medium">
            {roleCounts.all === 0 && !dateRangeInvalid
              ? "Todavía no hay usuarios."
              : "No se encontraron usuarios."}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {roleCounts.all === 0 && !dateRangeInvalid
              ? "Los perfiles aparecerán aquí cuando se registren."
              : dateRangeInvalid
                ? "Corrige el intervalo de fechas para mostrar los resultados."
                : "Prueba a cambiar la búsqueda o los filtros seleccionados."}
          </p>

          {canClear && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {visibleUsers.map((user) => (
              <AdminUserCard key={user.id} user={user} />
            ))}
          </div>
          <div className="hidden md:block">
            <AdminUsersTable users={visibleUsers} />
          </div>
        </>
      )}

      {visiblePageCount > 1 && (
        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            Mostrando {firstResult}–{lastResult} de {visibleCount}
          </p>

          <nav
            aria-label="Paginación de usuarios"
            className="flex items-center gap-2"
          >
            {page > 1 ? (
              <Link
                className={buttonVariants({
                  size: "sm",
                  variant: "outline",
                })}
                href={createHref({ page: page - 1 })}
              >
                Anterior
              </Link>
            ) : (
              <Button disabled size="sm" variant="outline">
                Anterior
              </Button>
            )}

            <span aria-current="page" className="text-muted-foreground">
              Página {page} de {visiblePageCount}
            </span>

            {page < visiblePageCount ? (
              <Link
                className={buttonVariants({
                  size: "sm",
                  variant: "outline",
                })}
                href={createHref({ page: page + 1 })}
              >
                Siguiente
              </Link>
            ) : (
              <Button disabled size="sm" variant="outline">
                Siguiente
              </Button>
            )}
          </nav>
        </div>
      )}
    </section>
  );
}
