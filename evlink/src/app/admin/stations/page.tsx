import { AdminStationsList } from "@/components/admin/AdminStationsList";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getChargingStations } from "@/services/charging-stations";

export default async function AdminStationsPage() {
  const { supabase } = await requireAdmin();
  const stations = await getChargingStations(supabase);

  return <AdminStationsList stations={stations} />;
}
