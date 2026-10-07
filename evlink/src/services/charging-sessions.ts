import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ChargingSession,
  ChargingSessionDetail,
} from "@/types";

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

  const {
    data: session,
    error: sessionError,
  } = await supabase
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

  const {
    data: session,
    error: sessionError,
  } = await supabase
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

export async function getChargingSessionById(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
): Promise<ChargingSessionDetail> {
  const { data, error } = await supabase
    .from("charging_sessions")
    .select(`
      id,
      status,
      started_at,
      ended_at,
      energy_kwh,
      price_per_kwh,
      total_amount,
      created_at,
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
      ),
      payment:payments (
        id,
        amount,
        currency,
        status,
        created_at
      )
    `)
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw error;
  }

  const connector = Array.isArray(data.connector)
    ? data.connector[0]
    : data.connector;

  if (!connector) {
    throw new Error(
      "La sesión no tiene un conector asociado.",
    );
  }

  const station = Array.isArray(connector.station)
    ? connector.station[0]
    : connector.station;

  if (!station) {
    throw new Error(
      "El conector no tiene una estación asociada.",
    );
  }

  const payment = Array.isArray(data.payment)
    ? data.payment[0] ?? null
    : data.payment ?? null;

  return {
    id: data.id,
    status: data.status,
    started_at: data.started_at,
    ended_at: data.ended_at,
    energy_kwh: Number(data.energy_kwh),
    price_per_kwh: Number(data.price_per_kwh),
    total_amount:
      data.total_amount === null
        ? null
        : Number(data.total_amount),
    created_at: data.created_at,

    connector: {
      id: connector.id,
      connector_type: connector.connector_type,
      power_kw: Number(connector.power_kw),

      station: {
        id: station.id,
        name: station.name,
        address: station.address,
        city: station.city,
      },
    },

    payment: payment
      ? {
        id: payment.id,
        amount: Number(payment.amount),
        currency: payment.currency,
        status: payment.status,
        created_at: payment.created_at,
      }
      : null,
  };
}