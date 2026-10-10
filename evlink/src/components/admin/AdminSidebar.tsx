"use client";

import Link from "next/link";
import {
  Activity,
  CreditCard,
  LayoutDashboard,
  MapPin,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Resumen",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Estaciones",
    url: "/admin/stations",
    icon: MapPin,
  },
  {
    title: "Usuarios",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Sesiones",
    url: "/admin/sessions",
    icon: Activity,
  },
  {
    title: "Pagos",
    url: "/admin/payments",
    icon: CreditCard,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <Link href="/admin" className="font-semibold tracking-tight">
          EvLink <span className="text-muted-foreground">Admin</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    render={
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    }
                  ></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
