
import { MapPin } from "lucide-react";

import { CommandItem } from "@/components/ui/command";
import type { SearchResult } from "@/types";

import { RouteSectionBadge } from "./RouteSectionBadge";

type GlobalSearchStationItemProps = {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
};

export function GlobalSearchStationItem({
  result,
  onSelect,
}: GlobalSearchStationItemProps) {
  const isAdminRoute = result.href.startsWith("/admin/");

  return (
    <CommandItem
      value={`${result.title} ${result.href}`}
      onSelect={() => onSelect(result)}
      className="gap-3 py-2.5"
    >
      <MapPin
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />

      <span className="min-w-0 flex-1 truncate">{result.title}</span>

      <RouteSectionBadge isAdmin={isAdminRoute} />
    </CommandItem>
  );
}
