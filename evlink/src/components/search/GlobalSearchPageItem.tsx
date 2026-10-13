
import type { Route } from "@/config/routes";
import type { SearchResult } from "@/types";

import { CommandItem } from "@/components/ui/command";
import { RouteSectionBadge } from "./RouteSectionBadge";

type SearchableRoute = Route & {
  section: "general" | "admin";
};

type GlobalSearchPageItemProps = {
  result: SearchResult;
  route: SearchableRoute;
  onSelect: (result: SearchResult) => void;
};

export function GlobalSearchPageItem({
  result,
  route,
  onSelect,
}: GlobalSearchPageItemProps) {
  const Icon = route.icon;

  return (
    <CommandItem
      value={`${result.title} ${result.href}`}
      onSelect={() => onSelect(result)}
      className="gap-3 py-2.5"
    >
      <Icon
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />

      <span className="min-w-0 flex-1 truncate">{result.title}</span>

      <RouteSectionBadge isAdmin={route.section === "admin"} />
    </CommandItem>
  );
}
