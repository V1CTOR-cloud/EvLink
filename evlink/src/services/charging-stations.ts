import type { SupabaseClient } from "@supabase/supabase-js";

import type { ChargingStation } from "@/types";

export async function getChargingStations(
  supabase: SupabaseClient,
): Promise<ChargingStation[]> {
  const { data, error } = await supabase
    .from("charging_stations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}