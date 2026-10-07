import type { SupabaseClient } from "@supabase/supabase-js";

import type { DashboardStats } from "@/types";

export async function getDashboardStats(
    supabase: SupabaseClient,
    userId: string,
): Promise<DashboardStats> {
    const [
        availableStationsResult,
        activeSessionsResult,
        completedSessionsResult,
        activeSessionResult,
        stationsResult,
    ] = await Promise.all([
        supabase
            .from("charging_stations")
            .select("id", { count: "exact", head: true })
            .eq("status", "available"),

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
            connector:connectors (
                connector_type,
                power_kw,
                station:charging_stations (
                    name,
                    address,
                    city
                )
            )
        `)
            .eq("user_id", userId)
            .in("status", ["pending", "charging"])
            .limit(1)
            .maybeSingle(),

        supabase
            .from("charging_stations")
            .select(`
            id,
            name,
            address,
            city,
            status,
            connectors (
                connector_type,
                power_kw,
                status
            )
        `)
            .eq("status", "available")
            .order("name")
            .limit(3),
    ]);

    if (availableStationsResult.error) {
        throw availableStationsResult.error;
    }

    if (activeSessionsResult.error) {
        throw activeSessionsResult.error;
    }

    if (completedSessionsResult.error) {
        throw completedSessionsResult.error;
    }

    if (activeSessionResult.error) {
        throw activeSessionResult.error;
    }

    let activeSession: DashboardStats["activeSession"] = null;

    if (activeSessionResult.data) {
        const connector = activeSessionResult.data.connector[0];

        if (connector) {
            const station = connector.station[0];

            if (station) {
                activeSession = {
                    id: activeSessionResult.data.id,
                    status: activeSessionResult.data.status,
                    started_at: activeSessionResult.data.started_at,
                    energy_kwh: Number(activeSessionResult.data.energy_kwh),
                    total_amount: Number(activeSessionResult.data.total_amount),
                    price_per_kwh: Number(activeSessionResult.data.price_per_kwh),
                    connector: {
                        connector_type: connector.connector_type,
                        power_kw: Number(connector.power_kw),
                        station: {
                            name: station.name,
                            address: station.address,
                            city: station.city,
                        },
                    },
                };
            }
        }
    }

    if (stationsResult.error) {
        throw stationsResult.error;
    }

    const totalEnergy = (completedSessionsResult.data ?? []).reduce(
        (total, session) => total + Number(session.energy_kwh ?? 0),
        0,
    );

    const totalSpent = (completedSessionsResult.data ?? []).reduce(
        (total, session) => total + Number(session.total_amount ?? 0),
        0,
    );

    return {
        availableStations: availableStationsResult.count ?? 0,
        activeSessions: activeSessionsResult.count ?? 0,
        totalEnergy,
        totalSpent,
        activeSession,
        stations: stationsResult.data ?? [],
    };
}