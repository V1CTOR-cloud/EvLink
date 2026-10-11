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

export async function getChargingStationSessionCount(
  supabase: SupabaseClient,
  stationId: string,
): Promise<number> {
  const { data: connectors, error: connectorsError } = await supabase
    .from("connectors")
    .select("id")
    .eq("station_id", stationId);

  if (connectorsError) {
    throw connectorsError;
  }

  const connectorIds = connectors.map((connector) => connector.id);

  if (connectorIds.length === 0) {
    return 0;
  }

  const { count, error: sessionsError } = await supabase
    .from("charging_sessions")
    .select("id", { count: "exact", head: true })
    .in("connector_id", connectorIds);

  if (sessionsError) {
    throw sessionsError;
  }

  return count ?? 0;
}