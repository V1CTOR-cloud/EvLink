import {
  CircleCheck,
  CircleMinus,
  TriangleAlert,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { ChargingStation, Connector } from "@/types";

type StationStatus = ChargingStation["status"] | Connector["status"];

type StationStatusBadgeProps = {
  status: StationStatus;
  label: string;
};

const statusClasses: Record<StationStatus, string> = {
  available: "bg-green-500/10 text-green-600",
  occupied: "bg-muted text-muted-foreground",
  offline: "bg-destructive/10 text-destructive",
  maintenance: "bg-muted text-muted-foreground",
};

const statusIcons = {
  available: CircleCheck,
  occupied: CircleMinus,
  offline: TriangleAlert,
  maintenance: Wrench,
} satisfies Record<StationStatus, typeof CircleCheck>;

export function StationStatusBadge({
  status,
  label,
}: StationStatusBadgeProps) {
  const Icon = statusIcons[status];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        statusClasses[status],
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {label}
    </span>
  );
}
