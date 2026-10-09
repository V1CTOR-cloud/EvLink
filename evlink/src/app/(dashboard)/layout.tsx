import { SidebarProvider } from "@/components/ui/sidebar";
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

      <main className="flex-1">
        <header className="flex h-12 items-center justify-between gap-3 border-b border-border bg-background px-3 sm:px-6">
          <AppBreadCrumb />

          <div className="ml-auto flex items-center gap-2">
            <GlobalSearch />
            <UserMenu />
          </div>
        </header>

        {children}
      </main>
    </SidebarProvider>
  );
}