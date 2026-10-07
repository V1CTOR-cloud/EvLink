import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { AppBreadCrumb } from "@/components/layout/AppBreadCrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />

      <main className="flex-1">
        <header className="flex h-12 items-center justify-between border-b border-border bg-background px-6">
          <AppBreadCrumb />

          <UserMenu />
        </header>

        {children}
      </main>
    </SidebarProvider>
  );
}