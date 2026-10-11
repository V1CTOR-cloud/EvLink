
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Command,
  CommandDialog,
  CommandInput,
} from "@/components/ui/command";
import { routes } from "@/config/routes";
import { adminRoutes } from "@/config/admin-routes";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { connectorTypeLabels, sessionStatusLabels } from "@/lib/session-utils";
import { formatDate } from "@/lib/format-date";
import type { SearchResult } from "@/types";

import { GlobalSearchTrigger } from "./GlobalSearchTrigger";
import { GlobalSearchResults } from "./GlobalSearchResults";

const publicSearchablePaths = ["/", "/stations", "/sessions"];

type SearchableRoute = (typeof routes)[number] & {
  section: "general" | "admin";
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const router = useRouter();

  const { stations, sessions, loading, error, retry } = useGlobalSearch(
    open,
    user?.id,
  );

  const isAdmin = profile?.role === "admin";

  const searchableRoutes: SearchableRoute[] = [
    ...routes
      .filter((route) => publicSearchablePaths.includes(route.path))
      .map((route) => ({
        ...route,
        section: "general" as const,
      })),
    ...(isAdmin
      ? adminRoutes.map((route) => ({
          ...route,
          section: "admin" as const,
        }))
      : []),
  ];

  const pageResults: SearchResult[] = searchableRoutes.map((route) => ({
    id: route.path,
    title: route.label,
    type: "page",
    href: route.path,
  }));

  const stationResults: SearchResult[] = stations.flatMap((station) => {
    const results: SearchResult[] = [
      {
        id: `general-${station.id}`,
        title: station.name,
        type: "station",
        href: `/stations/${station.id}`,
      },
    ];

    if (isAdmin) {
      results.push({
        id: `admin-${station.id}`,
        title: station.name,
        type: "station",
        href: `/admin/stations/${station.id}`,
      });
    }

    return results;
  });

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setOpen((currentOpen) => !currentOpen);
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <GlobalSearchTrigger onClick={() => handleOpenChange(true)} />

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

          <GlobalSearchResults
            query={query}
            loading={loading}
            error={error}
            retry={retry}
            routes={searchableRoutes}
            pages={pageResults}
            stations={stationResults}
            sessions={sessionResults}
            onSelect={handleSelect}
          />
        </Command>
      </CommandDialog>
    </>
  );
}
