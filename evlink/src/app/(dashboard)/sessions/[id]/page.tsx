import { notFound } from "next/navigation";

import { SessionDetailHeader } from "@/components/sessions/SessionDetailHeader";
import { SessionLocationCard } from "@/components/sessions/SessionLocationCard";
import { SessionMetricsCard } from "@/components/sessions/SessionMetricsCard";
import { SessionPaymentCard } from "@/components/sessions/SessionPaymentCard";
import { createClient } from "@/lib/supabase/server";
import { getChargingSessionById } from "@/services/charging-sessions";

type SessionDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SessionDetailPage({
  params,
}: SessionDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  try {
    const session = await getChargingSessionById(supabase, user.id, id);

    return (
      <main className="p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <SessionDetailHeader session={session} />

          <SessionLocationCard session={session} />

          <SessionMetricsCard session={session} />

          <SessionPaymentCard payment={session.payment} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading session:", error);

    throw error;
  }
}
