import type { LucideIcon } from "lucide-react";
import {
    LayoutDashboard,
    MapPin,
    Plug,
    User,
} from "lucide-react";

export interface Route {
    path: string;
    label: string;
    icon: LucideIcon;
}

export const routes: Route[] = [
    {
        path: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        path: "/stations",
        label: "Estaciones",
        icon: MapPin,
    },
    {
        path: "/sessions",
        label: "Sesiones",
        icon: Plug,
    },
    {
        path: "/profile",
        label: "Perfil",
        icon: User,
    },
];
