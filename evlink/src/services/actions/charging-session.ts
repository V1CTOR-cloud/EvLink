
"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { ChargingSessionError, createChargingSession } from "@/services/charging-sessions";

function revalidateStationRoutes() {
  revalidatePath("/stations");
  revalidatePath("/stations/[id]", "page");
}


export async function startChargingAction(connectorId: string) {
  if (!connectorId?.trim()) {
    return {
      success: false as const,
      error: "Selecciona un conector válido.",
    };
  }

  try {
    const supabase = await createClient();
    const session = await createChargingSession(
      supabase,
      connectorId,
    );

    revalidateStationRoutes();

    return {
      success: true as const,
      session,
    };
  } catch (error) {
    console.error("[startChargingAction]", error);

    if (
      error instanceof ChargingSessionError &&
      error.code === "CONNECTOR_UNAVAILABLE"
    ) {
      revalidateStationRoutes();

      return {
        success: false as const,
        error: "Este conector ya no está disponible.",
      };
    }

    return {
      success: false as const,
      error: "No se pudo iniciar la sesión de carga.",
    };
  }
}



