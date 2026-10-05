import { StationsList } from "@/components/stations/StationsList";
import { createClient } from "@/lib/supabase/server";
import { getChargingStations } from "@/services/charging-stations";

export default async function StationsPage() {
  const supabase = await createClient();
  const stations = await getChargingStations(supabase);

  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Estaciones</h1>

        <p className="text-muted-foreground">
          Consulta las estaciones de carga disponibles.
        </p>
      </div>

      <StationsList stations={stations} />
    </section>
  );
}
