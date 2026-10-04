import { MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { ChargingStation } from "@/types";

type StationCardProps = {
  station: ChargingStation;
};

export function StationCard({ station }: StationCardProps) {
  const statusLabels = {
    available: "Disponible",
    occupied: "Ocupada",
    offline: "Fuera de servicio",
    maintenance: "Mantenimiento",
  } as const;

  const statusVariants = {
    available: "default",
    occupied: "secondary",
    offline: "destructive",
    maintenance: "outline",
  } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{station.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="size-4" />
          <span>
            {station.address}, {station.city}
          </span>
        </div>

        <Badge variant={statusVariants[station.status]}>
          {statusLabels[station.status]}
        </Badge>
      </CardContent>
    </Card>
  );
}
