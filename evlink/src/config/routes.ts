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
    section: "general" | "admin";
}

export const routes: Route[] = [
    {
        path: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
        section: "general",
    },
    {
        path: "/stations",
        label: "Estaciones",
        icon: MapPin,
        section: "general",
    },
    {
        path: "/sessions",
        label: "Sesiones",
        icon: Plug,
        section: "general",
    },
    {
        path: "/profile",
        label: "Perfil",
        icon: User,
        section: "general",
    },
];
