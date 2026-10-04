import type { SupabaseClient } from "@supabase/supabase-js";

import type { Connector } from "@/types";

export async function getConnectorsByStation(
    supabase: SupabaseClient,
    stationId: string,
): Promise<Connector[]> {
    const { data, error } = await supabase
        .from("connectors")
        .select("*")
        .eq("station_id", stationId);

    if (error) {
        throw error;
    }

    return data;
}