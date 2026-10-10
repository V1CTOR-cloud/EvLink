import type { SupabaseClient } from "@supabase/supabase-js";

import type { ChargingStationWithConnectors } from "@/types";

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

export async function getChargingStationById(
  supabase: SupabaseClient,
  stationId: string,
): Promise<ChargingStationWithConnectors | null> {
  const { data, error } = await supabase
    .from("charging_stations")
    .select(`
      *,
      connectors (*)
    `)
    .eq("id", stationId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}