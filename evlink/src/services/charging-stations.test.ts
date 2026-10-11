import { describe, expect, it, vi } from "vitest";

import { getChargingStationSessionCount } from "@/services/charging-stations";

describe("getChargingStationSessionCount", () => {
  it("cuenta sesiones a través de los conectores de la estación", async () => {
    const connectorIds = ["connector-1", "connector-2"];
    const connectorEq = vi.fn().mockResolvedValue({
      data: connectorIds.map((id) => ({ id })),
      error: null,
    });
    const sessionIds = vi.fn().mockResolvedValue({ count: 3, error: null });
    const supabase = {
      from: vi.fn((table: string) =>
        table === "connectors"
          ? { select: vi.fn(() => ({ eq: connectorEq })) }
          : { select: vi.fn(() => ({ in: sessionIds })) },
      ),
    };

    await expect(
      getChargingStationSessionCount(supabase as never, "station-id"),
    ).resolves.toBe(3);

    expect(connectorEq).toHaveBeenCalledWith("station_id", "station-id");
    expect(sessionIds).toHaveBeenCalledWith("connector_id", connectorIds);
  });

  it("no consulta sesiones si la estación no tiene conectores", async () => {
    const connectorEq = vi.fn().mockResolvedValue({ data: [], error: null });
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({ eq: connectorEq })),
      })),
    };

    await expect(
      getChargingStationSessionCount(supabase as never, "station-id"),
    ).resolves.toBe(0);

    expect(supabase.from).toHaveBeenCalledOnce();
  });
});
