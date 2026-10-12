import { notFound } from "next/navigation";

import { AdminPaymentDetail } from "@/components/admin/payments/AdminPaymentDetail";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { getAdminPaymentById } from "@/services/admin-payments";

type AdminPaymentDetailPageProps = {
  params: Promise<{ id: string }>;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function AdminPaymentDetailPage({
  params,
}: AdminPaymentDetailPageProps) {
  await requireAdmin();

  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    notFound();
  }

  const supabase = await createClient();
  const payment = await getAdminPaymentById(supabase, id);

  if (!payment) {
    notFound();
  }

  return <AdminPaymentDetail payment={payment} />;
}
