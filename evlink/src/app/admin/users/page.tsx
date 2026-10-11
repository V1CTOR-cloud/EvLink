import { redirect } from "next/navigation";

import { AdminUsersList } from "@/components/admin/AdminUsersList";
import type { AdminUsersPeriodFilter } from "@/components/admin/AdminUserFilters";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  ADMIN_USERS_PAGE_SIZE,
  listAdminUsers,
  type AdminUsersRoleFilter,
  type AdminUsersSortOrder,
} from "@/services/admin-users";

type AdminUsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return typeof value === "string" ? value : undefined;
}

function getPageNumber(value: string | undefined): number {
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

function getRole(value: string | undefined): AdminUsersRoleFilter {
  return value === "driver" || value === "admin" ? value : "all";
}

function getPeriod(value: string | undefined): AdminUsersPeriodFilter {
  if (
    value === "7d" ||
    value === "30d" ||
    value === "3m" ||
    value === "custom"
  ) {
    return value;
  }

  return "all";
}

function getSortOrder(value: string | undefined): AdminUsersSortOrder {
  if (value === "oldest" || value === "name-asc" || value === "name-desc") {
    return value;
  }

  return "newest";
}

function parseDate(value: string | undefined): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function getDateBounds(
  period: AdminUsersPeriodFilter,
  startDate: string,
  endDate: string,
  now: Date,
): { createdAfter?: string; createdBefore?: string } {
  if (period === "all") {
    return {};
  }

  let start: Date | null = null;
  let endExclusive: Date | null = null;

  if (period === "custom") {
    start = parseDate(startDate);
    const end = parseDate(endDate);
    if ((startDate && !start) || (endDate && !end)) {
      return { createdAfter: "invalid", createdBefore: "invalid" };
    }
    if (end) {
      endExclusive = new Date(end);
      endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
    }

    if (start && end && start > end) {
      return { createdAfter: "invalid", createdBefore: "invalid" };
    }
  } else {
    start = new Date(now);
    if (period === "7d") {
      start.setUTCDate(start.getUTCDate() - 7);
    } else if (period === "30d") {
      start.setUTCDate(start.getUTCDate() - 30);
    } else {
      const dayOfMonth = start.getUTCDate();
      start.setUTCDate(1);
      start.setUTCMonth(start.getUTCMonth() - 3);
      const lastDayOfMonth = new Date(
        Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0),
      ).getUTCDate();
      start.setUTCDate(Math.min(dayOfMonth, lastDayOfMonth));
    }
  }

  return {
    ...(start ? { createdAfter: start.toISOString() } : {}),
    ...(endExclusive ? { createdBefore: endExclusive.toISOString() } : {}),
  };
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const search = getParam(params, "q")?.trim().slice(0, 100) ?? "";
  const page = getPageNumber(getParam(params, "page"));
  const role = getRole(getParam(params, "role"));
  const period = getPeriod(getParam(params, "period"));
  const startDate =
    period === "custom" ? (getParam(params, "startDate") ?? "") : "";
  const endDate =
    period === "custom" ? (getParam(params, "endDate") ?? "") : "";
  const sortOrder = getSortOrder(getParam(params, "sort"));
  const dateBounds = getDateBounds(period, startDate, endDate, new Date());

  if (
    dateBounds.createdAfter === "invalid" ||
    dateBounds.createdBefore === "invalid"
  ) {
    const query = new URLSearchParams();
    if (search) query.set("q", search);
    if (role !== "all") query.set("role", role);
    if (sortOrder !== "newest") query.set("sort", sortOrder);
    redirect(`/admin/users?${query.toString()}`);
  }

  const { users, count, roleCounts } = await listAdminUsers(supabase, {
    search,
    page,
    role,
    ...dateBounds,
    sortOrder,
  });
  const pageCount = Math.ceil(count / ADMIN_USERS_PAGE_SIZE);

  if (pageCount > 0 && page > pageCount) {
    const query = new URLSearchParams();
    query.set("page", String(pageCount));
    if (search) query.set("q", search);
    if (role !== "all") query.set("role", role);
    if (period !== "all") query.set("period", period);
    if (startDate) query.set("startDate", startDate);
    if (endDate) query.set("endDate", endDate);
    if (sortOrder !== "newest") query.set("sort", sortOrder);
    redirect(`/admin/users?${query.toString()}`);
  }

  return (
    <AdminUsersList
      key={`${search}-${page}-${role}-${period}-${startDate}-${endDate}-${sortOrder}`}
      users={users}
      count={count}
      roleCounts={roleCounts}
      search={search}
      page={page}
      pageCount={pageCount}
      role={role}
      period={period}
      startDate={startDate}
      endDate={endDate}
      sortOrder={sortOrder}
    />
  );
}
