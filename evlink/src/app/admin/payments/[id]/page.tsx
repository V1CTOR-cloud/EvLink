import { notFound } from "next/navigation";

import { AdminPaymentDetail } from "@/components/admin/payments/AdminPaymentDetail";
import { createClient } from "@/lib/supabase/server";
import { getAdminPaymentById } from "@/services/admin-payments";
import { requireAdmin } from "@/lib/auth/require-admin";

type AdminPaymentDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPaymentDetailPage({
  params,
}: AdminPaymentDetailPageProps) {
  await requireAdmin();

  const { id } = await params;

  const supabase = await createClient();
  const payment = await getAdminPaymentById(supabase, id);

  if (!payment) {
    notFound();
  }

  return <AdminPaymentDetail payment={payment} />;
}
