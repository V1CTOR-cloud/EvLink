
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

type GlobalSearchTriggerProps = {
  onClick: () => void;
};

export function GlobalSearchTrigger({
  onClick,
}: GlobalSearchTriggerProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      aria-label="Abrir buscador global"
      className="h-10 w-[clamp(7rem,24vw,15rem)] justify-start gap-2 px-2 text-muted-foreground sm:px-3"
    >
      <Search className="size-4 shrink-0" />
      <span className="truncate">Buscar...</span>
    </Button>
  );
}
