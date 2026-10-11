"use client";

import {
  Zap,
  LayoutDashboard,
  MapPin,
  Users,
  Activity,
  CreditCard,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");

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
          <div className="mb-8">
            <Link
              href={isAdminArea ? "/admin" : "/"}
              className={cn(
                "group/brand flex items-center gap-2.5 overflow-hidden transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:overflow-visible group-data-[collapsible=icon]:px-0",
                isAdminArea
                  ? "h-12 rounded-xl border border-border bg-card px-2.5 hover:border-primary/30 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent"
                  : "h-8 px-2",
              )}
            >
              <div className="relative flex size-7 shrink-0 items-center justify-center rounded-md bg-primary">
                <Zap className="size-4 text-white" fill="currentColor" />

                {isAdminArea && (
                  <span
                    aria-hidden
                    className="absolute -bottom-1 -right-1 hidden size-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-sidebar group-data-[collapsible=icon]:flex"
                  >
                    <ShieldCheck className="size-2.5" />
                  </span>
                )}
              </div>

              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p
                  className={cn(
                    "whitespace-nowrap font-semibold tracking-tight",
                    isAdminArea ? "text-base leading-none" : "text-lg",
                  )}
                >
                  EvLink
                </p>

                {isAdminArea && (
                  <p className="mt-1 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Administración
                  </p>
                )}
              </div>

              {isAdminArea && (
                <ShieldCheck className="ml-auto size-4 shrink-0 text-muted-foreground transition-colors group-hover/brand:text-primary group-data-[collapsible=icon]:hidden" />
              )}
            </Link>
          </div>

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
