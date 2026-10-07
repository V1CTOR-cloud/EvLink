import { ActiveSessionCard } from "@/components/dashboard/ActiveSessionCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardStations } from "@/components/dashboard/DashboardStations";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/services/dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const stats = await getDashboardStats(supabase, user.id);

  const name =
    user.user_metadata.full_name ??
    user.email ??
    "Usuario";

  return (
    <main className="p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader
          name={name}
          availableStations={stats.availableStations}
        />

        <DashboardStats stats={stats} />

        {stats.activeSession && (
          <ActiveSessionCard session={stats.activeSession} />
        )}

        <DashboardStations stations={stats.stations} />
      </div>
    </main>
  );
}