"use client";

import { useState } from "react";
import {
  AlertCircle,
  LayoutDashboard,
  LoaderCircle,
  MapPin,
  Plug,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { connectorTypeLabels, sessionStatusLabels } from "@/lib/session-utils";
import { formatDate } from "@/lib/format-date";
import type { SearchResult } from "@/types";

const searchableRoutes = routes.filter((route) =>
  ["/", "/stations", "/sessions"].includes(route.path),
);

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const { stations, sessions, loading, error, retry } = useGlobalSearch(
    open,
    user?.id,
  );

  const pageResults: SearchResult[] = searchableRoutes.map((route) => ({
    id: route.path,
    title: route.label,
    type: "page",
    href: route.path,
  }));

  const stationResults: SearchResult[] = stations.map((station) => ({
    id: station.id,
    title: station.name,
    subtitle: `${station.city} · ${station.address}`,
    type: "station",
    href: `/stations/${station.id}`,
  }));

  const sessionResults: SearchResult[] = sessions.map((session) => ({
    id: session.id,
    title: session.connector.station.name,
    subtitle: [
      connectorTypeLabels[session.connector.connector_type],
      sessionStatusLabels[session.status],
      formatDate(session.started_at ?? session.created_at),
    ]
      .filter(Boolean)
      .join(" · "),
    type: "session",
    href: `/sessions/${session.id}`,
  }));

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setQuery("");
    }
  };

  const handleSelect = (result: SearchResult) => {
    handleOpenChange(false);
    router.push(result.href);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleOpenChange(true)}
        aria-label="Abrir buscador global"
        className="h-8 w-[clamp(7rem,24vw,15rem)] justify-start gap-2 px-2 text-muted-foreground sm:px-3"
      >
        <Search className="size-4 shrink-0" />
        <span className="truncate">Buscar...</span>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Buscador global"
        description="Busca páginas, estaciones y sesiones de carga."
        className="sm:max-w-xl"
      >
        <Command>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Buscar páginas, estaciones o sesiones..."
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Cargando resultados...
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="size-4" />
                  No se pudieron cargar los resultados.
                </div>
                <Button type="button" variant="outline" size="sm" onClick={retry}>
                  Reintentar
                </Button>
              </div>
            ) : !query.trim() ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                Escribe para buscar páginas, estaciones o sesiones.
              </p>
            ) : (
              <>
                <CommandEmpty>No se encontraron resultados.</CommandEmpty>

                <CommandGroup heading="Páginas">
                  {pageResults.map((result) => {
                    const Icon =
                      searchableRoutes.find(
                        (route) => route.path === result.href,
                      )?.icon ?? LayoutDashboard;

                    return (
                      <CommandItem
                        key={`page-${result.id}`}
                        value={result.title}
                        onSelect={() => handleSelect(result)}
                      >
                        <Icon className="text-muted-foreground" />
                        <span>{result.title}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>

                {stationResults.length > 0 && (
                  <CommandGroup heading="Estaciones">
                    {stationResults.map((result) => (
                      <CommandItem
                        key={`station-${result.id}`}
                        value={result.title}
                        onSelect={() => handleSelect(result)}
                      >
                        <MapPin className="text-muted-foreground" />
                        <span className="min-w-0 flex-1 truncate">
                          {result.title}
                        </span>
                        {result.subtitle && (
                          <span className="ml-auto truncate text-xs text-muted-foreground">
                            {result.subtitle}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {sessionResults.length > 0 && (
                  <CommandGroup heading="Sesiones">
                    {sessionResults.map((result) => (
                      <CommandItem
                        key={`session-${result.id}`}
                        value={`${result.title} ${result.subtitle ?? ""}`}
                        onSelect={() => handleSelect(result)}
                      >
                        <Plug className="text-muted-foreground" />
                        <span className="min-w-0 flex-1 truncate">
                          {result.title}
                        </span>
                        {result.subtitle && (
                          <span className="ml-auto truncate text-xs text-muted-foreground">
                            {result.subtitle}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
