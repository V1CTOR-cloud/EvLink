import { StationsExplorer } from "@/components/stations/StationsExplorer";
import { createClient } from "@/lib/supabase/server";
import { getChargingStations } from "@/services/charging-stations";

export default async function StationsPage() {
  const supabase = await createClient();
  const stations = await getChargingStations(supabase);

  return (
    <section className="space-y-6 p-6">
      <StationsExplorer stations={stations} />
    </section>
  );
}
