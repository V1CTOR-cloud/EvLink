"use client";

import { Zap } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routes } from "@/config/routes";
import Link from "next/link";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup className="px-3 py-4">
          <Link href={"/"} className="mb-8 flex items-center gap-2 px-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary">
              <Zap className="size-4 text-white" />
            </div>

            <span className="text-lg font-semibold tracking-tight">EvLink</span>
          </Link>

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
