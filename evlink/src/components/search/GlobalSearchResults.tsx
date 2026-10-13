
import {
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";

import type { Route } from "@/config/routes";
import type { SearchResult } from "@/types";

import { GlobalSearchPageItem } from "./GlobalSearchPageItem";
import { GlobalSearchSessionItem } from "./GlobalSearchSessionItem";
import { GlobalSearchStationItem } from "./GlobalSearchStationItem";

type SearchableRoute = Route & {
  section: "general" | "admin";
};

type GlobalSearchResultsProps = {
  query: string;
  loading: boolean;
  error: Error | null;
  retry: () => void;
  routes: SearchableRoute[];
  pages: SearchResult[];
  stations: SearchResult[];
  sessions: SearchResult[];
  onSelect: (result: SearchResult) => void;
};

export function GlobalSearchResults({
  query,
  loading,
  error,
  retry,
  routes,
  pages,
  stations,
  sessions,
  onSelect,
}: GlobalSearchResultsProps) {
  if (loading) {
    return (
      <CommandList>
        <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" />
          Cargando resultados...
        </div>
      </CommandList>
    );
  }

  if (error) {
    return (
      <CommandList>
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" />
            No se pudieron cargar los resultados.
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={retry}
          >
            Reintentar
          </Button>
        </div>
      </CommandList>
    );
  }

  if (!query.trim()) {
    return (
      <CommandList>
        <p className="p-6 text-center text-sm text-muted-foreground">
          Escribe para buscar páginas, estaciones o sesiones.
        </p>
      </CommandList>
    );
  }

  return (
    <CommandList>
      <CommandEmpty>No se encontraron resultados.</CommandEmpty>

      {pages.length > 0 && (
        <CommandGroup heading="Páginas">
          {pages.map((result) => {
            const route = routes.find(
              (item) => item.path === result.href,
            );

            if (!route) {
              return null;
            }

            return (
              <GlobalSearchPageItem
                key={`page-${result.id}`}
                result={result}
                route={route}
                onSelect={onSelect}
              />
            );
          })}
        </CommandGroup>
      )}

      {stations.length > 0 && (
        <CommandGroup heading="Estaciones">
          {stations.map((result) => (
            <GlobalSearchStationItem
              key={`station-${result.id}`}
              result={result}
              onSelect={onSelect}
            />
          ))}
        </CommandGroup>
      )}

      {sessions.length > 0 && (
        <CommandGroup heading="Sesiones">
          {sessions.map((result) => (
            <GlobalSearchSessionItem
              key={`session-${result.id}`}
              result={result}
              onSelect={onSelect}
            />
          ))}
        </CommandGroup>
      )}
    </CommandList>
  );
}
