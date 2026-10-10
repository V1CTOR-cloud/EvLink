
"use client";

import { Zap, LayoutDashboard, MapPin, Users, Activity, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const adminRoutes = [
  { path: "/admin", label: "Resumen", icon: LayoutDashboard },
  { path: "/admin/stations", label: "Estaciones", icon: MapPin },
  { path: "/admin/users", label: "Usuarios", icon: Users },
  { path: "/admin/sessions", label: "Sesiones", icon: Activity },
  { path: "/admin/payments", label: "Pagos", icon: CreditCard },
];

export function AppSidebar() {
  const { setOpen, isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();

  const { user } = useAuth();
  const { profile } = useProfile(user?.id);

  const isAdmin = profile?.role === "admin";
  const isAdminArea =
    pathname === "/admin" || pathname.startsWith("/admin/");

  const navigationRoutes = isAdminArea
    ? adminRoutes
    : [
        ...routes,
        ...(isAdmin
          ? [{ path: "/admin", label: "Administración", icon: LayoutDashboard }]
          : []),
      ];

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="border-r border-sidebar-border"
    >
      <SidebarContent className="bg-sidebar">
        <SidebarGroup className="px-3 py-2">
          <Link
            href={isAdminArea ? "/admin" : "/"}
            className="mb-8 flex h-8 items-center gap-2 overflow-hidden px-2 transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary">
              <Zap className="size-4 text-white" />
            </div>

            <span className="whitespace-nowrap text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
              EvLink
            </span>
          </Link>

          <SidebarGroupLabel>
            {isAdminArea ? "Administración" : "Principal"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navigationRoutes.map((route) => {
                const isActive =
                  pathname === route.path ||
                  (route.path !== "/admin" &&
                    pathname.startsWith(`${route.path}/`));

                return (
                  <SidebarMenuItem key={route.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={route.path} />}
                      className="h-10 text-sm"
                      tooltip={route.label}
                      onClick={handleNavigation}
                    >
                      <route.icon className="size-4" />
                      <span>{route.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {isAdminArea && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/" />}
                    className="h-10 text-sm"
                    tooltip="Volver a la aplicación"
                    onClick={handleNavigation}
                  >
                    <ArrowLeft className="size-4" />
                    <span>Volver a la aplicación</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
