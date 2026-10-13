import type { SupabaseClient } from "@supabase/supabase-js";

import type { ChargingStation, Connector } from "@/types";

type MetricResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export type AdminDashboardIncident = {
  id: string;
  kind: "station" | "connector";
  stationId: string;
  stationName: string;
  city: string;
  status: "offline" | "maintenance";
  detail: string;
  updatedAt: string;
};

export type AdminDashboardMetrics = {
  stations: MetricResult<{
    total: number;
    operational: number;
    outOfService: number;
    available: number;
    occupied: number;
    offline: number;
    maintenance: number;
  }>;
  connectors: MetricResult<{
    total: number;
    available: number;
    occupied: number;
    outOfService: number;
    offline: number;
    maintenance: number;
  }>;
  sessions: MetricResult<{
    total: number;
    active: number;
    pending: number;
    charging: number;
    completed: number;
    failedOrCancelled: number;
    failed: number;
    cancelled: number;
  }>;
  users: MetricResult<{
    total: number;
    drivers: number;
    admins: number;
  }>;
  payments: MetricResult<{
    completed: number;
    pending: number;
    failed: number;
    refunded: number;
  }>;
  incidents: MetricResult<{
    items: AdminDashboardIncident[];
    total: number;
  }>;
};

type DashboardTable =
  | "charging_stations"
  | "connectors"
  | "charging_sessions"
  | "profiles"
  | "payments";

type StatusMetric =
  | "available"
  | "occupied"
  | "offline"
  | "maintenance"
  | "pending"
  | "charging"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

type StationIncidentRow = Pick<
  ChargingStation,
  "id" | "name" | "city" | "status" | "updated_at"
>;

type ConnectorIncidentRow = Pick<
  Connector,
  "id" | "station_id" | "connector_type" | "status" | "updated_at"
> & {
  station:
    | Pick<ChargingStation, "id" | "name" | "city">
    | Pick<ChargingStation, "id" | "name" | "city">[]
    | null;
};

async function countRows(
  supabase: SupabaseClient,
  table: DashboardTable,
  statuses?: readonly StatusMetric[],
  role?: "driver" | "admin",
): Promise<number> {
  let query = supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  if (statuses && statuses.length === 1) {
    query = query.eq("status", statuses[0]);
  } else if (statuses) {
    query = query.in("status", [...statuses]);
  }

  if (role) {
    query = query.eq("role", role);
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function getOutOfServiceIncidents(
  supabase: SupabaseClient,
): Promise<{ items: AdminDashboardIncident[]; total: number }> {
  const [stationsResult, connectorsResult] = await Promise.all([
    supabase
      .from("charging_stations")
      .select("id, name, city, status, updated_at", { count: "exact" })
      .in("status", ["offline", "maintenance"])
      .order("updated_at", { ascending: false })
      .limit(10),
    supabase
      .from("connectors")
      .select(
        `
          id,
          station_id,
          connector_type,
          status,
          updated_at,
          station:charging_stations!inner (
            id,
            name,
            city
          )
        `,
        { count: "exact" },
      )
      .in("status", ["offline", "maintenance"])
      .order("updated_at", { ascending: false })
      .limit(10),
  ]);

  if (stationsResult.error) {
    throw stationsResult.error;
  }

  if (connectorsResult.error) {
    throw connectorsResult.error;
  }

  const stationRows = (stationsResult.data ?? []) as StationIncidentRow[];
  const connectorRows = (connectorsResult.data ?? []) as ConnectorIncidentRow[];
  const stationIncidents: AdminDashboardIncident[] = stationRows.map(
    (station) => {
      if (
        station.status !== "offline" &&
        station.status !== "maintenance"
      ) {
        throw new Error(
          `Estado inesperado para la estación ${station.id}: ${station.status}.`,
        );
      }

      return {
        id: station.id,
        kind: "station",
        stationId: station.id,
        stationName: station.name,
        city: station.city,
        status: station.status,
        detail: "Estación",
        updatedAt: station.updated_at,
      };
    },
  );
  const connectorIncidents: AdminDashboardIncident[] = connectorRows.map(
    (connector) => {
      const station = Array.isArray(connector.station)
        ? connector.station[0]
        : connector.station;

      if (!station) {
        throw new Error(
          `No se pudo resolver la estación del conector ${connector.id}.`,
        );
      }

      if (
        connector.status !== "offline" &&
        connector.status !== "maintenance"
      ) {
        throw new Error(
          `Estado inesperado para el conector ${connector.id}: ${connector.status}.`,
        );
      }

      return {
        id: connector.id,
        kind: "connector",
        stationId: station.id,
        stationName: station.name,
        city: station.city,
        status: connector.status,
        detail: `Conector ${connector.connector_type.toUpperCase()}`,
        updatedAt: connector.updated_at,
      };
    },
  );

  return {
    items: [...stationIncidents, ...connectorIncidents].sort(
      (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
    ),
    total: (stationsResult.count ?? 0) + (connectorsResult.count ?? 0),
  };
}

async function loadMetricGroup<T>(
  label: string,
  load: () => Promise<T>,
): Promise<MetricResult<T>> {
  try {
    return { data: await load(), error: null };
  } catch (error) {
    console.error(
      `[getAdminDashboardMetrics] No se pudieron cargar ${label}:`,
      error,
    );
    return {
      data: null,
      error: `No se pudieron cargar las métricas de ${label}.`,
    };
  }
}

export async function getAdminDashboardMetrics(
  supabase: SupabaseClient,
): Promise<AdminDashboardMetrics> {
  const [stations, connectors, sessions, users, payments, incidents] =
    await Promise.all([
    loadMetricGroup("estaciones", async () => {
      const [total, available, occupied, offline, maintenance] =
        await Promise.all([
        countRows(supabase, "charging_stations"),
        countRows(supabase, "charging_stations", ["available"]),
        countRows(supabase, "charging_stations", ["occupied"]),
        countRows(supabase, "charging_stations", ["offline"]),
        countRows(supabase, "charging_stations", ["maintenance"]),
      ]);

      return {
        total,
        available,
        occupied,
        offline,
        maintenance,
        operational: available + occupied,
        outOfService: offline + maintenance,
      };
    }),
    loadMetricGroup("conectores", async () => {
      const [total, available, occupied, offline, maintenance] =
        await Promise.all([
        countRows(supabase, "connectors"),
        countRows(supabase, "connectors", ["available"]),
        countRows(supabase, "connectors", ["occupied"]),
        countRows(supabase, "connectors", ["offline"]),
        countRows(supabase, "connectors", ["maintenance"]),
        ]);

      return {
        total,
        available,
        occupied,
        offline,
        maintenance,
        outOfService: offline + maintenance,
      };
    }),
    loadMetricGroup("sesiones", async () => {
      const [total, pending, charging, completed, failed, cancelled] =
        await Promise.all([
          countRows(supabase, "charging_sessions"),
          countRows(supabase, "charging_sessions", ["pending"]),
          countRows(supabase, "charging_sessions", ["charging"]),
          countRows(supabase, "charging_sessions", ["completed"]),
          countRows(supabase, "charging_sessions", ["failed"]),
          countRows(supabase, "charging_sessions", ["cancelled"]),
        ]);

      return {
        total,
        pending,
        charging,
        active: pending + charging,
        completed,
        failed,
        cancelled,
        failedOrCancelled: failed + cancelled,
      };
    }),
    loadMetricGroup("usuarios", async () => {
      const [total, drivers, admins] = await Promise.all([
        countRows(supabase, "profiles"),
        countRows(supabase, "profiles", undefined, "driver"),
        countRows(supabase, "profiles", undefined, "admin"),
      ]);

      return { total, drivers, admins };
    }),
    loadMetricGroup("pagos", async () => {
      const [completed, pending, failed, refunded] = await Promise.all([
        countRows(supabase, "payments", ["completed"]),
        countRows(supabase, "payments", ["pending"]),
        countRows(supabase, "payments", ["failed"]),
        countRows(supabase, "payments", ["refunded"]),
      ]);

      return { completed, pending, failed, refunded };
    }),
      loadMetricGroup("incidencias", () =>
        getOutOfServiceIncidents(supabase),
      ),
    ]);

  return {
    stations,
    connectors,
    sessions,
    users,
    payments,
    incidents,
  };
}
