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
    section: "admin",
  },
  {
    path: "/admin/stations",
    label: "Estaciones",
    icon: MapPin,
    section: "admin",
  },
  {
    path: "/admin/users",
    label: "Usuarios",
    icon: Users,
    section: "admin",
  },
  {
    path: "/admin/sessions",
    label: "Sesiones",
    icon: Activity,
    section: "admin",
  },
  {
    path: "/admin/payments",
    label: "Pagos",
    icon: CreditCard,
    section: "admin",
  },
];