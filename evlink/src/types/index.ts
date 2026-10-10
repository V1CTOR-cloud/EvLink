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
    activeSessionsCount: number;
    totalEnergy: number;
    totalSpent: number;
    activeSessions: DashboardActiveSession[];
    stations: ChargingStationWithConnectors[];
    history: DashboardSeriesPoint[];
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

export type ChargingSessionDetail = {
    id: string;
    status:
    | "pending"
    | "charging"
    | "completed"
    | "cancelled"
    | "failed";
    started_at: string;
    ended_at: string | null;
    energy_kwh: number;
    price_per_kwh: number;
    total_amount: number | null;
    created_at: string;

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

    payment: {
        id: string;
        amount: number;
        currency: "EUR";
        status:
        | "pending"
        | "completed"
        | "failed"
        | "refunded";
        created_at: string;
    } | null;
};

export type Payment = {
    id: string;
    session_id: string;
    user_id: string;
    amount: number;
    currency: "EUR";
    status: "pending" | "completed" | "failed" | "refunded";
    created_at: string;
    updated_at: string;
};

export type ChargingStationWithConnectors = ChargingStation & {
  connectors: Connector[];
};

export type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  type: "page" | "station" | "session";
  href: string;
};

export type PaymentBrand = "visa" | "mastercard" | "amex";

export interface PaymentMethod {
  id: string;
  user_id: string;
  brand: PaymentBrand;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type CreatePaymentMethodInput = Pick<
  PaymentMethod,
  "brand" | "last_four" | "expiry_month" | "expiry_year"
>;

export type UpdatePaymentMethodInput = Partial<CreatePaymentMethodInput>;

export type DashboardSeriesPoint = {
  date: string;
  energy: number;
  spent: number;
  sessions: number;
};