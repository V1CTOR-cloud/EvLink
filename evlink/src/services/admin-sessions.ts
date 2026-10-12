
import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminSessionStatus =
    | "pending"
    | "charging"
    | "completed"
    | "cancelled"
    | "failed";

export type AdminSession = {
    id: string;
    user_id: string;
    status: AdminSessionStatus;
    started_at: string;
    ended_at: string | null;
    energy_kwh: number;
    price_per_kwh: number;
    total_amount: number;
    created_at: string;
    user: {
        id: string;
        full_name: string;
    };
    connector: {
        id: string;
        connector_type: "type_2" | "ccs2" | "chademo";
        power_kw: number;
        station: {
            id: string;
            name: string;
            city: string;
        };
    };
};

export type AdminSessionsPage = {
    sessions: AdminSession[];
    count: number;
    page: number;
    pageSize: number;
};

export const ADMIN_SESSIONS_PAGE_SIZE = 10;

export type AdminSessionStatusFilter = "all" | AdminSessionStatus;

type AdminSessionQueryRow = Omit<
    AdminSession,
    "user" | "connector"
> & {
    user:
    | AdminSession["user"]
    | AdminSession["user"][]
    | null;
    connector:
    | (Omit<AdminSession["connector"], "station"> & {
        station:
        | AdminSession["connector"]["station"]
        | AdminSession["connector"]["station"][]
        | null;
    })
    | (
        | Omit<AdminSession["connector"], "station"> & {
            station:
            | AdminSession["connector"]["station"]
            | AdminSession["connector"]["station"][]
            | null;
        }
    )[]
    | null;
};

function firstRelation<T>(
    relation: T | T[] | null | undefined,
): T | null {
    if (Array.isArray(relation)) {
        return relation[0] ?? null;
    }

    return relation ?? null;
}

export async function listAdminSessions(
    supabase: SupabaseClient,
    options: {
        search: string;
        page: number;
        status: AdminSessionStatusFilter;
    },
): Promise<AdminSessionsPage> {
    const page = Math.max(1, Math.floor(options.page));
    const pageSize = ADMIN_SESSIONS_PAGE_SIZE;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const search = options.search.trim();

    let query = supabase
        .from("charging_sessions")
        .select(
            `
        id,
        user_id,
        status,
        started_at,
        ended_at,
        energy_kwh,
        price_per_kwh,
        total_amount,
        created_at,
        user:profiles!inner (
          id,
          full_name
        ),
        connector:connectors!inner (
          id,
          connector_type,
          power_kw,
          station:charging_stations!inner (
            id,
            name,
            city
          )
        )
      `,
            { count: "exact" },
        );

    if (options.status !== "all") {
        query = query.eq("status", options.status);
    }

    if (search) {
        query = query.ilike("user.full_name", `%${search}%`);
    }

    const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        throw error;
    }

    const rows = (data ?? []) as unknown as AdminSessionQueryRow[];

    const sessions: AdminSession[] = rows.flatMap((row) => {
        const user = firstRelation(row.user);
        const connector = firstRelation(row.connector);
        const station = firstRelation(connector?.station);

        // Evitamos mostrar registros incompletos si falla alguna relación.
        if (!user || !connector || !station) {
            return [];
        }

        return [
            {
                id: row.id,
                user_id: row.user_id,
                status: row.status,
                started_at: row.started_at,
                ended_at: row.ended_at,
                energy_kwh: Number(row.energy_kwh),
                price_per_kwh: Number(row.price_per_kwh),
                total_amount: Number(row.total_amount),
                created_at: row.created_at,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                },
                connector: {
                    id: connector.id,
                    connector_type: connector.connector_type,
                    power_kw: Number(connector.power_kw),
                    station: {
                        id: station.id,
                        name: station.name,
                        city: station.city,
                    },
                },
            },
        ];
    });

    return {
        sessions,
        count: count ?? 0,
        page,
        pageSize,
    };
}

export type AdminSessionDetail = Omit<
    AdminSession,
    "user" | "connector"
> & {
    user: {
        id: string;
        full_name: string;
    };
    connector: {
        id: string;
        connector_type: AdminSession["connector"]["connector_type"];
        power_kw: number;
        station: {
            id: string;
            name: string;
            address: string;
            city: string;
        };
    };
    payment: {
        id: string;
        amount: number;
        currency: string;
        status: "pending" | "completed" | "failed" | "refunded";
        created_at: string;
    } | null;
};

type AdminSessionDetailQueryRow = Omit<
    AdminSessionDetail,
    "user" | "connector" | "payment"
> & {
    user:
    | AdminSessionDetail["user"]
    | AdminSessionDetail["user"][]
    | null;
    connector:
    | {
        id: string;
        connector_type: AdminSessionDetail["connector"]["connector_type"];
        power_kw: number;
        station:
        | AdminSessionDetail["connector"]["station"]
        | AdminSessionDetail["connector"]["station"][]
        | null;
    }
    | {
        id: string;
        connector_type: AdminSessionDetail["connector"]["connector_type"];
        power_kw: number;
        station:
        | AdminSessionDetail["connector"]["station"]
        | AdminSessionDetail["connector"]["station"][]
        | null;
    }[]
    | null;
    payment:
    | AdminSessionDetail["payment"]
    | NonNullable<AdminSessionDetail["payment"]>[]
    | null;
};

export async function getAdminSessionById(
    supabase: SupabaseClient,
    sessionId: string,
): Promise<AdminSessionDetail | null> {
    const { data, error } = await supabase
        .from("charging_sessions")
        .select(`
      id,
      user_id,
      status,
      started_at,
      ended_at,
      energy_kwh,
      price_per_kwh,
      total_amount,
      created_at,
      user:profiles!inner (
        id,
        full_name
      ),
      connector:connectors!inner (
        id,
        connector_type,
        power_kw,
        station:charging_stations!inner (
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
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        return null;
    }

    const row = data as unknown as AdminSessionDetailQueryRow;
    const user = firstRelation(row.user);
    const connector = firstRelation(row.connector);
    const station = firstRelation(connector?.station);
    const payment = firstRelation(row.payment);

    if (!user || !connector || !station) {
        throw new Error(
            "La sesión no tiene todas las relaciones necesarias.",
        );
    }

    return {
        id: row.id,
        user_id: row.user_id,
        status: row.status,
        started_at: row.started_at,
        ended_at: row.ended_at,
        energy_kwh: Number(row.energy_kwh),
        price_per_kwh: Number(row.price_per_kwh),
        total_amount: Number(row.total_amount),
        created_at: row.created_at,
        user: {
            id: user.id,
            full_name: user.full_name,
        },
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
