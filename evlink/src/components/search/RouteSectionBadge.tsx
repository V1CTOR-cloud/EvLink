
import { Route, ShieldCheck } from "lucide-react";

type RouteSectionBadgeProps = {
  isAdmin: boolean;
};

export function RouteSectionBadge({
  isAdmin,
}: RouteSectionBadgeProps) {
  const RoleIcon = isAdmin ? ShieldCheck : Route;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isAdmin
          ? "bg-green-500/10 text-green-600"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <RoleIcon aria-hidden="true" className="size-3.5" />
      {isAdmin ? "Admin" : "General"}
    </span>
  );
}
