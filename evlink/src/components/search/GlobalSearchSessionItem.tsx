
import { Plug } from "lucide-react";

import { CommandItem } from "@/components/ui/command";
import type { SearchResult } from "@/types";

type GlobalSearchSessionItemProps = {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
};

export function GlobalSearchSessionItem({
  result,
  onSelect,
}: GlobalSearchSessionItemProps) {
  return (
    <CommandItem
      value={`${result.title} ${result.subtitle ?? ""} ${result.href}`}
      onSelect={() => onSelect(result)}
      className="gap-3 py-2.5"
    >
      <Plug
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />

      <span className="min-w-0 flex-1 truncate">{result.title}</span>

      {result.subtitle && (
        <span className="shrink-0 truncate text-xs text-muted-foreground">
          {result.subtitle}
        </span>
      )}
    </CommandItem>
  );
}
