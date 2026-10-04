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
    lat: number;
    lng: number;
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

