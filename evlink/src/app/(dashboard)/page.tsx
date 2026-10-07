import { ActiveSessionCard } from "@/components/dashboard/ActiveSessionCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardStations } from "@/components/dashboard/DashboardStations";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/services/dashboard";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [stats, profileResult] = await Promise.all([
    getDashboardStats(supabase, user.id),

    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const name = profileResult.data?.full_name || user.email || "Usuario";

  return (
    <main className="p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader
          name={name}
          availableStations={stats.availableStations}
        />

        <DashboardStats stats={stats} />

        {stats.activeSessions.length > 0 && (
          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">
                  Sesiones activas
                </h2>

                <p className="text-xs text-muted-foreground">
                  Tus sesiones de carga actuales
                </p>
              </div>

              <Link
                href="/sessions"
                className="group inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Ver todas
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {stats.activeSessions.map((session) => (
                <ActiveSessionCard key={session.id} session={session} />
              ))}
            </div>
          </section>
        )}

        <DashboardStations stations={stats.stations} />
      </div>
    </main>
  );
}
