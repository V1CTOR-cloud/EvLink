"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { routes } from "@/config/routes";

export function AppBreadCrumb() {
  const pathname = usePathname();

  const currentRoute = routes.find((route) => route.path === pathname);
  const currentPage = currentRoute?.label ?? "Dashboard";
  const CurrentIcon = currentRoute?.icon;

  return (
    <Breadcrumb className="min-w-0 overflow-hidden">
      <BreadcrumbList className="flex-nowrap gap-1 sm:gap-2">
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink
            render={
              <Link
                href="/"
                aria-label="Ir al dashboard"
                className="flex cursor-pointer items-center gap-2"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary">
                  <Zap className="size-4 text-white" />
                </span>
                <span className="hidden sm:inline">App</span>
              </Link>
            }
          />
        </BreadcrumbItem>

        <BreadcrumbSeparator className="shrink-0" />

        <BreadcrumbItem className="min-w-0 flex-1">
          <BreadcrumbPage className="flex min-w-0 items-center gap-1">
            {CurrentIcon && <CurrentIcon className="size-4 shrink-0" />}
            <span className="truncate">{currentPage}</span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
