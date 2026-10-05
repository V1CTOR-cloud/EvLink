import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { UserMenu } from "@/components/layout/UserMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex-1">
        <header className="flex justify-end border-b p-4">
          <UserMenu />
        </header>

        {children}
      </main>
    </SidebarProvider>
  );
}