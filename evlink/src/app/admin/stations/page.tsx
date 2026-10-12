import Link from "next/link";

import { StationsExplorer } from "@/components/stations/StationsExplorer";
import { buttonVariants } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getChargingStations } from "@/services/charging-stations";
import { Plus } from "lucide-react";

export default async function AdminStationsPage() {
  const { supabase } = await requireAdmin();
  const stations = await getChargingStations(supabase);

  return (
    <section className="space-y-4 p-4 sm:p-6">
      <StationsExplorer stations={stations} mode="admin" />
    </section>
  );
}
