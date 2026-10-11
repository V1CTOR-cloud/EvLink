import { describe, expect, it } from "vitest";

import { chargingStationSchema } from "@/schemas/charging-station";

function stationInput() {
  return {
    name: "  Estación Central ",
    description: "  Carga urbana ",
    address: " Calle Mayor 1 ",
    city: " Madrid ",
    latitude: "40.4168",
    longitude: "-3.7038",
    status: "available",
  };
}

describe("chargingStationSchema", () => {
  it("normaliza texto y convierte las coordenadas a números", () => {
    expect(chargingStationSchema.parse(stationInput())).toEqual({
      name: "Estación Central",
      description: "Carga urbana",
      address: "Calle Mayor 1",
      city: "Madrid",
      latitude: 40.4168,
      longitude: -3.7038,
      status: "available",
    });
  });

  it("rechaza coordenadas vacías o fuera de rango", () => {
    const emptyLatitude = chargingStationSchema.safeParse({
      ...stationInput(),
      latitude: "",
    });
    const invalidLongitude = chargingStationSchema.safeParse({
      ...stationInput(),
      longitude: "180.01",
    });

    expect(emptyLatitude.success).toBe(false);
    expect(invalidLongitude.success).toBe(false);
  });

  it("acepta los límites geográficos y normaliza una descripción vacía", () => {
    const result = chargingStationSchema.safeParse({
      ...stationInput(),
      description: "",
      latitude: "-90",
      longitude: "180",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBeNull();
      expect(result.data.latitude).toBe(-90);
      expect(result.data.longitude).toBe(180);
    }
  });
});
