import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { AppBreadCrumb } from "@/components/layout/AppBreadCrumb";
import { GlobalSearch } from "@/components/search/GlobalSearch";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />

      <main className="min-w-0 flex-1">
        <header className="flex h-12 items-center justify-between gap-2 border-b border-border bg-background px-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <div className="md:hidden">
              <SidebarTrigger
                aria-label="Abrir menú de navegación"
                className="size-10"
              />
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              <AppBreadCrumb />
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <GlobalSearch />
            <UserMenu />
          </div>
        </header>

        {children}
      </main>
    </SidebarProvider>
  );
}
