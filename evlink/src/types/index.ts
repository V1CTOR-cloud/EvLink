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