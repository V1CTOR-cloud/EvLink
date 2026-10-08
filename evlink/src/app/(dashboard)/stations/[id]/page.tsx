import { notFound } from "next/navigation";

import { StationConnectorsCard } from "@/components/stations/StationConnectorsCard";
import { StationDetailHeader } from "@/components/stations/StationDetailHeader";
import { StationInformationCard } from "@/components/stations/StationInformationCard";
import { createClient } from "@/lib/supabase/server";
import { getChargingStationById } from "@/services/charging-stations";

type StationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StationDetailPage({
  params,
}: StationDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const station = await getChargingStationById(supabase, id);

  if (!station) {
    notFound();
  }

  return (
    <main className="p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <StationDetailHeader station={station} />

        <StationConnectorsCard station={station} />

        <StationInformationCard station={station} />
      </div>
    </main>
  );
}