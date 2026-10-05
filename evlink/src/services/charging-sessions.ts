import type { SupabaseClient } from "@supabase/supabase-js";

import type { ChargingSession } from "@/types";

export async function getChargingSessions(
  supabase: SupabaseClient,
  userId: string,
): Promise<ChargingSession[]> {
  const { data, error } = await supabase
    .from("charging_sessions")
    .select(`
          *,
          connector:connectors (
            id,
            connector_type,
            power_kw,
            station:charging_stations (
              id,
              name,
              address,
              city
            )
          )
        `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function createChargingSession(
  supabase: SupabaseClient,
  userId: string,
  connectorId: string,
  pricePerKwh: number,
): Promise<ChargingSession> {
  const { data, error } = await supabase.rpc("start_charging", {
    p_user_id: userId,
    p_connector_id: connectorId,
    p_price_per_kwh: pricePerKwh,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "Este conector ya tiene una sesión de carga activa.",
      );
    }

    throw new Error(
      "No se pudo iniciar la sesión de carga.",
    );
  }

  const sessionId = data.id;

  const { data: session, error: sessionError } = await supabase
    .from("charging_sessions")
    .select(`
      *,
      connector:connectors (
        id,
        connector_type,
        power_kw,
        station:charging_stations (
          id,
          name,
          address,
          city
        )
      )
    `)
    .eq("id", sessionId)
    .single();

  if (sessionError) {
    throw sessionError;
  }

  return session;
}

export async function stopCharging(
  supabase: SupabaseClient,
  sessionId: string,
  energyKwh: number,
): Promise<ChargingSession> {
  const { data, error } = await supabase.rpc("stop_charging", {
    p_session_id: sessionId,
    p_energy_kwh: energyKwh,
  });

  if (error) {
    throw new Error(
      "No se pudo finalizar la sesión de carga.",
    );
  }

  const { data: session, error: sessionError } = await supabase
    .from("charging_sessions")
    .select(`
      *,
      connector:connectors (
        id,
        connector_type,
        power_kw,
        station:charging_stations (
          id,
          name,
          address,
          city
        )
      )
    `)
    .eq("id", data.id)
    .single();

  if (sessionError) {
    throw sessionError;
  }

  return session;
}