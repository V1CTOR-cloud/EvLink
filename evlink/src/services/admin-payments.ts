import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminPaymentStatus =
    | "pending"
    | "completed"
    | "failed"
    | "refunded";

export type AdminPayment = {
    id: string;
    session_id: string;
    user_id: string;
    amount: number;
    currency: string;
    status: AdminPaymentStatus;
    created_at: string;
    updated_at: string;
    user: {
        id: string;
        full_name: string;
    };
    session: {
        id: string;
        status: string;
        created_at: string;
        station: {
            id: string;
            name: string;
            city: string;
        };
    };
};

export type AdminPaymentsPage = {
    payments: AdminPayment[];
    count: number;
    page: number;
    pageSize: number;
};

export const ADMIN_PAYMENTS_PAGE_SIZE = 10;

export type AdminPaymentStatusFilter = "all" | AdminPaymentStatus;

type Relation<T> = T | T[] | null;

type AdminPaymentQueryRow = {
    id: string;
    session_id: string;
    user_id: string;
    amount: number | string;
    currency: string;
    status: AdminPaymentStatus;
    created_at: string;
    updated_at: string;
    user: Relation<AdminPayment["user"]>;
    session: Relation<{
        id: string;
        status: string;
        created_at: string;
        connector: Relation<{
            station: Relation<AdminPayment["session"]["station"]>;
        }>;
    }>;
};

function firstRelation<T>(relation: Relation<T> | undefined): T | null {
    return Array.isArray(relation) ? relation[0] ?? null : relation ?? null;
}

export async function listAdminPayments(
    supabase: SupabaseClient,
    options: {
        search: string;
        page: number;
        status: AdminPaymentStatusFilter;
    },
): Promise<AdminPaymentsPage> {
    const page = Math.max(1, Math.floor(options.page));
    const pageSize = ADMIN_PAYMENTS_PAGE_SIZE;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const search = options.search.trim();

    let query = supabase
        .from("payments")
        .select(
            `
        id,
        session_id,
        user_id,
        amount,
        currency,
        status,
        created_at,
        updated_at,
        user:profiles!inner (
          id,
          full_name
        ),
        session:charging_sessions!inner (
          id,
          status,
          created_at,
          connector:connectors!inner (
            station:charging_stations!inner (
              id,
              name,
              city
            )
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

    const rows = (data ?? []) as unknown as AdminPaymentQueryRow[];

    const payments: AdminPayment[] = rows.flatMap((row) => {
        const user = firstRelation(row.user);
        const session = firstRelation(row.session);
        const connector = firstRelation(session?.connector);
        const station = firstRelation(connector?.station);

        if (!user || !session || !station) {
            return [];
        }

        return [
            {
                id: row.id,
                session_id: row.session_id,
                user_id: row.user_id,
                amount: Number(row.amount),
                currency: row.currency,
                status: row.status,
                created_at: row.created_at,
                updated_at: row.updated_at,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                },
                session: {
                    id: session.id,
                    status: session.status,
                    created_at: session.created_at,
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
        payments,
        count: count ?? 0,
        page,
        pageSize,
    };
}