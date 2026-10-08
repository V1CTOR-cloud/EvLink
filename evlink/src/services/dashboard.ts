import type { SupabaseClient } from "@supabase/supabase-js";

import type { DashboardStats } from "@/types";

type ActiveSessionStation = {
  name: string;
  address: string;
  city: string;
};

type ActiveSessionConnector = {
  connector_type: "type_2" | "ccs2" | "chademo";
  power_kw: number;
  station: ActiveSessionStation | ActiveSessionStation[];
};

type ActiveSessionRow = {
  id: string;
  status: "pending" | "charging";
  started_at: string;
  energy_kwh: number;
  total_amount: number;
  price_per_kwh: number;
  connector: ActiveSessionConnector | ActiveSessionConnector[];
};

export async function getDashboardStats(
  supabase: SupabaseClient,
  userId: string,
): Promise<DashboardStats> {
  const [
    activeSessionsResult,
    completedSessionsResult,
    activeSessionsDataResult,
    stationsResult,
  ] = await Promise.all([
    supabase
      .from("charging_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("status", ["pending", "charging"]),

    supabase
      .from("charging_sessions")
      .select("energy_kwh, total_amount")
      .eq("user_id", userId)
      .eq("status", "completed"),

    supabase
      .from("charging_sessions")
      .select(`
        id,
        status,
        started_at,
        energy_kwh,
        total_amount,
        price_per_kwh,
        connector:connectors!inner (
          connector_type,
          power_kw,
          station:charging_stations!inner (
            name,
            address,
            city
          )
        )
      `)
      .eq("user_id", userId)
      .in("status", ["pending", "charging"])
      .order("started_at", { ascending: false }),

    supabase
      .from("charging_stations")
      .select(`
        id,
        name,
        address,
        city,
        status,
        connectors (
          id,
          station_id,
          connector_type,
          power_kw,
          price_per_kwh,
          status,
          created_at,
          updated_at
        )
      `)
      .order("name"),
  ]);

  if (activeSessionsResult.error) {
    throw activeSessionsResult.error;
  }

  if (completedSessionsResult.error) {
    throw completedSessionsResult.error;
  }

  if (activeSessionsDataResult.error) {
    throw activeSessionsDataResult.error;
  }

  if (stationsResult.error) {
    throw stationsResult.error;
  }

  const availableStationsData = (
    stationsResult.data ?? []
  ).filter((station) =>
    station.connectors?.some(
      (connector) => connector.status === "available",
    ),
  );

  const availableStations = availableStationsData.length;

  const stations = availableStationsData.slice(0, 3);

  const activeSessionRows =
    (activeSessionsDataResult.data ?? []) as ActiveSessionRow[];

  const activeSessions: DashboardStats["activeSessions"] =
    activeSessionRows.flatMap((session) => {
      const rawConnector = session.connector;

      const connector = Array.isArray(rawConnector)
        ? rawConnector[0]
        : rawConnector;

      if (!connector) {
        return [];
      }

      const rawStation = connector.station;

      const station = Array.isArray(rawStation)
        ? rawStation[0]
        : rawStation;

      if (!station) {
        return [];
      }

      return [
        {
          id: session.id,
          status: session.status,
          started_at: session.started_at,
          energy_kwh: Number(session.energy_kwh),
          total_amount: Number(session.total_amount),
          price_per_kwh: Number(session.price_per_kwh),
          connector: {
            connector_type: connector.connector_type,
            power_kw: Number(connector.power_kw),
            station: {
              name: station.name,
              address: station.address,
              city: station.city,
            },
          },
        },
      ];
    });

  const totalEnergy = (
    completedSessionsResult.data ?? []
  ).reduce(
    (total, session) =>
      total + Number(session.energy_kwh ?? 0),
    0,
  );

  const totalSpent = (
    completedSessionsResult.data ?? []
  ).reduce(
    (total, session) =>
      total + Number(session.total_amount ?? 0),
    0,
  );

  return {
    availableStations,
    activeSessionsCount:
      activeSessionsResult.count ?? 0,
    totalEnergy,
    totalSpent,
    activeSessions,
    stations,
  };
}