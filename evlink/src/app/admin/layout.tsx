import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { AppBreadCrumb } from "@/components/layout/AppBreadCrumb";

import { requireAdmin } from "@/lib/auth/require-admin";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />

      <main className="min-w-0 flex-1">
        <header className="flex h-12 items-center justify-between gap-2 border-b border-border bg-background px-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <div className="md:hidden">
              <SidebarTrigger
                aria-label="Abrir menú de administración"
                className="size-10"
              />
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              <AppBreadCrumb />
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <UserMenu />
          </div>
        </header>

        {children}
      </main>
    </SidebarProvider>
  );
}