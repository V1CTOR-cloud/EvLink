
import type { Route } from "@/config/routes";
import {
    LayoutDashboard,
    MapPin,
    Users,
    Activity,
    CreditCard,
} from "lucide-react";

export const adminRoutes: Route[] = [
    {
        path: "/admin",
        label: "Administración",
        icon: LayoutDashboard,
    },
    {
        path: "/admin/stations",
        label: "Estaciones",
        icon: MapPin,
    },
    {
        path: "/admin/users",
        label: "Usuarios",
        icon: Users,
    },
    {
        path: "/admin/sessions",
        label: "Sesiones",
        icon: Activity,
    },
    {
        path: "/admin/payments",
        label: "Pagos",
        icon: CreditCard,
    },
];
