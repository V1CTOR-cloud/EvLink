import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import {
  listAdminSessions,
  type AdminSessionStatusFilter,
} from "@/services/admin-sessions";
import { AdminSessionsList } from "@/components/admin/AdminSessionsList";

type AdminSessionsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const SESSION_STATUSES: AdminSessionStatusFilter[] = [
  "all",
  "pending",
  "charging",
  "completed",
  "cancelled",
  "failed",
];

function getSingleParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function getValidPage(value: string): number {
  const parsed = Number(value);

  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function AdminSessionsPage({
  searchParams,
}: AdminSessionsPageProps) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;

  const search = getSingleParam(params.q).trim().slice(0, 100);
  const rawStatus = getSingleParam(params.status);
  const status: AdminSessionStatusFilter = SESSION_STATUSES.includes(
    rawStatus as AdminSessionStatusFilter,
  )
    ? (rawStatus as AdminSessionStatusFilter)
    : "all";
  const page = getValidPage(getSingleParam(params.page));

  const result = await listAdminSessions(supabase, {
    search,
    page,
    status,
  });

  const pageCount = Math.max(1, Math.ceil(result.count / result.pageSize));

  if (page > pageCount) {
    const query = new URLSearchParams();

    if (search) query.set("q", search);
    if (status !== "all") query.set("status", status);
    query.set("page", String(pageCount));

    redirect(`/admin/sessions?${query.toString()}`);
  }

  return (
    <AdminSessionsList
      key={`${search}-${status}-${page}`}
      sessions={result.sessions}
      count={result.count}
      page={page}
      pageCount={pageCount}
      search={search}
      status={status}
    />
  );
}
