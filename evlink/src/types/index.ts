export type Profile = {
    id: string;
    full_name: string;
    role: "driver" | "admin";
};

export type ChargingStation = {
    id: string;
    name: string;
    description: string | null;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    status: "available" | "occupied" | "offline" | "maintenance";
    created_at: string;
    updated_at: string;
};

export type Connector = {
    id: string;
    station_id: string;
    connector_type: "type_2" | "ccs2" | "chademo";
    power_kw: number;
    price_per_kwh: number;
    status: "available" | "occupied" | "offline";
    created_at: string;
    updated_at: string;
};

export type ChargingSession = {
    id: string;
    user_id: string;
    connector_id: string;
    status: "pending" | "charging" | "completed" | "cancelled" | "failed";
    started_at: string | null;
    ended_at: string | null;
    energy_kwh: number;
    price_per_kwh: number;
    total_amount: number;
    created_at: string;
    updated_at: string;

    connector: {
        id: string;
        connector_type: "type_2" | "ccs2" | "chademo";
        power_kw: number;
        station: {
            id: string;
            name: string;
            address: string;
            city: string;
        };
    };
};

export type DashboardStats = {
    availableStations: number;
    activeSessions: number;
    totalEnergy: number;
    totalSpent: number;
    activeSession: DashboardActiveSession | null;
    stations: DashboardStation[];
};

export type DashboardActiveSession = {
    id: string;
    status: "pending" | "charging";
    started_at: string;
    energy_kwh: number;
    total_amount: number;
    price_per_kwh: number;
    connector: {
        connector_type: "type_2" | "ccs2" | "chademo";
        power_kw: number;
        station: {
            name: string;
            address: string;
            city: string;
        };
    };
};

export type DashboardStation = {
    id: string;
    name: string;
    address: string;
    city: string;
    status: "available";
    connectors: {
        connector_type: "type_2" | "ccs2" | "chademo";
        power_kw: number;
        status: "available" | "occupied" | "offline";
    }[];
};