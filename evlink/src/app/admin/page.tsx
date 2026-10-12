
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminDashboardMetrics } from "@/services/admin-dashboard";
import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const metrics = await getAdminDashboardMetrics(supabase);

  return <AdminDashboard metrics={metrics} />;
}
