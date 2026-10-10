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
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            render={
              <Link
                href="/"
                className="flex items-center justify-center cursor-pointer"
                aria-label="Ir al dashboard"
              >
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md bg-primary">
                    <Zap className="size-4 text-white" />
                  </div>
                  <span>App</span>
                </div>
              </Link>
            }
          ></BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink className="flex items-center gap-1 cursor-pointer">
            {CurrentIcon && <CurrentIcon className="size-4" />}
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
