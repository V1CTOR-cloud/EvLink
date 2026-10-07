"use client";

import { Zap } from "lucide-react";
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

export function AppSidebar() {
  const { setOpen } = useSidebar();
  const pathname = usePathname();

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
            href="/"
            className="mb-8 flex h-8 items-center gap-2 overflow-hidden px-2 transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary">
              <Zap className="size-4 text-white" />
            </div>

            <span className="whitespace-nowrap text-lg font-semibold tracking-tight transition-opacity duration-200 group-data-[collapsible=icon]:hidden">
              EvLink
            </span>
          </Link>

          <SidebarGroupLabel>Principal</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {routes.map((route) => {
                const isActive = pathname === route.path;

                return (
                  <SidebarMenuItem key={route.label}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={route.path} />}
                      className="h-9 text-sm"
                    >
                      <route.icon className="size-4" />
                      <span>{route.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
