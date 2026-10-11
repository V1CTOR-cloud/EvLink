import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createChargingStation,
  deleteChargingStation,
  updateChargingStation,
} from "@/services/charging-station-actions";

const { getChargingStationSessionCount, revalidatePath, requireAdmin } =
  vi.hoisted(() => ({
    getChargingStationSessionCount: vi.fn(),
    revalidatePath: vi.fn(),
    requireAdmin: vi.fn(),
  }));

vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/lib/auth/require-admin", () => ({ requireAdmin }));
vi.mock("@/services/charging-stations", () => ({
  getChargingStationSessionCount,
}));

const stationId = "550e8400-e29b-41d4-a716-446655440000";

function validInput() {
  return {
    name: "Estación Central",
    description: null,
    address: "Calle Mayor 1",
    city: "Madrid",
    latitude: 40.4168,
    longitude: -3.7038,
    status: "available",
  };
}

describe("charging station server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getChargingStationSessionCount.mockResolvedValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("autoriza la creación y descarta propiedades de control del cliente", async () => {
    const insert = vi.fn();
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { id: stationId },
      error: null,
    });
    const select = vi.fn(() => ({ maybeSingle }));
    insert.mockReturnValue({ select });
    const supabase = {
      from: vi.fn(() => ({ insert })),
    };
    requireAdmin.mockResolvedValue({ supabase });
    const input = {
      ...validInput(),
      id: "caller-controlled-id",
      created_at: "caller-controlled-date",
    };

    await expect(createChargingStation(input)).resolves.toEqual({
      success: "Estación creada correctamente.",
      stationId,
    });

    expect(requireAdmin).toHaveBeenCalledOnce();
    expect(insert).toHaveBeenCalledWith(validInput());
    expect(revalidatePath).toHaveBeenCalledWith("/admin/stations");
    expect(revalidatePath).toHaveBeenCalledWith(
      `/admin/stations/${stationId}`,
    );
  });

  it("actualiza los campos permitidos y revalida las rutas afectadas", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { id: stationId },
      error: null,
    });
    const select = vi.fn(() => ({ maybeSingle }));
    const eq = vi.fn(() => ({ select }));
    const update = vi.fn(() => ({ eq }));
    const supabase = {
      from: vi.fn(() => ({ update })),
    };
    requireAdmin.mockResolvedValue({ supabase });

    await expect(
      updateChargingStation(stationId, {
        ...validInput(),
        id: "caller-controlled-id",
        updated_at: "caller-controlled-date",
      }),
    ).resolves.toEqual({
      success: "Estación actualizada correctamente.",
    });

    expect(update).toHaveBeenCalledWith(validInput());
    expect(eq).toHaveBeenCalledWith("id", stationId);
    expect(revalidatePath).toHaveBeenCalledWith(
      `/admin/stations/${stationId}/edit`,
    );
  });

  it("no permite eliminar estaciones con sesiones históricas", async () => {
    const supabase = { from: vi.fn() };
    requireAdmin.mockResolvedValue({ supabase });
    getChargingStationSessionCount.mockResolvedValue(1);

    await expect(deleteChargingStation(stationId)).resolves.toEqual({
      error:
        "No se puede eliminar esta estación porque tiene sesiones de recarga asociadas. Conserva la estación para mantener su historial.",
    });

    expect(requireAdmin).toHaveBeenCalledOnce();
    expect(getChargingStationSessionCount).toHaveBeenCalledWith(
      supabase,
      stationId,
    );
    expect(supabase.from).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("elimina la estación cuando no quedan sesiones y confirma el resultado", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { id: stationId },
      error: null,
    });
    const select = vi.fn(() => ({ maybeSingle }));
    const eq = vi.fn(() => ({ select }));
    const deleteStation = vi.fn(() => ({ eq }));
    const supabase = {
      from: vi.fn(() => ({ delete: deleteStation })),
    };
    requireAdmin.mockResolvedValue({ supabase });

    await expect(deleteChargingStation(stationId)).resolves.toEqual({
      success: "Estación eliminada correctamente.",
    });

    expect(getChargingStationSessionCount).toHaveBeenCalledWith(
      supabase,
      stationId,
    );
    expect(deleteStation).toHaveBeenCalledOnce();
    expect(revalidatePath).toHaveBeenCalledWith("/admin/stations");
  });

  it("no intenta escribir cuando falla la comprobación de dependencias", async () => {
    const supabase = { from: vi.fn() };
    requireAdmin.mockResolvedValue({ supabase });
    getChargingStationSessionCount.mockRejectedValue(
      new Error("RLS denied the dependency query"),
    );
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(deleteChargingStation(stationId)).resolves.toEqual({
      error:
        "No se pudieron comprobar las sesiones históricas; no se ha eliminado la estación.",
    });

    expect(supabase.from).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
  });

  it("rechaza entradas inválidas antes de intentar una mutación", async () => {
    const result = await createChargingStation({
      ...validInput(),
      longitude: 181,
    });

    expect(result.error).toBe("Revisa los campos indicados.");
    expect(requireAdmin).not.toHaveBeenCalled();
  });
});
