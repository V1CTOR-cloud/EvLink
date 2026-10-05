import type { SupabaseClient } from "@supabase/supabase-js";

import type { ChargingStation } from "@/types";
import type { Connector } from "@/types";

export type ChargingStationWithConnectors = ChargingStation & {
  connectors: Connector[];
};

export async function getChargingStations(
  supabase: SupabaseClient,
): Promise<ChargingStationWithConnectors[]> {
  const { data, error } = await supabase
    .from("charging_stations")
    .select(`
      *,
      connectors (*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}