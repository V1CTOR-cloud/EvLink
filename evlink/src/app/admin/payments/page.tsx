import { redirect } from "next/navigation";

import { AdminPaymentsList } from "@/components/admin/AdminPaymentsList";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  listAdminPayments,
  type AdminPaymentStatusFilter,
} from "@/services/admin-payments";

type AdminPaymentsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PAYMENT_STATUSES: AdminPaymentStatusFilter[] = [
  "all",
  "pending",
  "completed",
  "failed",
  "refunded",
];

function getSingleParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function getValidPage(value: string): number {
  const parsed = Number(value);

  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function AdminPaymentsPage({
  searchParams,
}: AdminPaymentsPageProps) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;

  const search = getSingleParam(params.q).trim().slice(0, 100);
  const rawStatus = getSingleParam(params.status);

  const status: AdminPaymentStatusFilter = PAYMENT_STATUSES.includes(
    rawStatus as AdminPaymentStatusFilter,
  )
    ? (rawStatus as AdminPaymentStatusFilter)
    : "all";

  const page = getValidPage(getSingleParam(params.page));

  const result = await listAdminPayments(supabase, {
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

    redirect(`/admin/payments?${query.toString()}`);
  }

  return (
    <AdminPaymentsList
      payments={result.payments}
      count={result.count}
      page={page}
      pageCount={pageCount}
      search={search}
      status={status}
    />
  );
}
