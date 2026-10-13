"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { chargingStationSchema } from "@/schemas/charging-station";
import { getChargingStationSessionCount } from "@/services/charging-stations";

export type ChargingStationActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  success?: string;
  stationId?: string;
};

const stationIdSchema = z.uuid();

function validateInput(input: unknown) {
  const parsed = chargingStationSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: "Revisa los campos indicados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    } satisfies ChargingStationActionResult;
  }

  return { data: parsed.data };
}

/**
 * Sin `stationId` solo revalida los listados. Es lo que debe usar el borrado:
 * revalidar `/admin/stations/{id}` mientras el usuario sigue en esa página
 * la volvería a renderizar con la estación ya inexistente (notFound) antes de
 * que el cliente navegue al listado.
 */
function revalidateStations(stationId?: string) {
  revalidatePath("/");
  revalidatePath("/stations");
  revalidatePath("/admin");
  revalidatePath("/admin/stations");

  if (stationId) {
    revalidatePath(`/stations/${stationId}`);
    revalidatePath(`/admin/stations/${stationId}`);
    revalidatePath(`/admin/stations/${stationId}/edit`);
  }
}

function getWriteErrorMessage(error: { code?: string }) {
  if (error.code === "42501") {
    return "No tienes permisos para modificar estaciones.";
  }

  return "No se ha podido guardar la estación. Inténtalo de nuevo.";
}

export async function createChargingStation(
  input: unknown,
): Promise<ChargingStationActionResult> {
  const validation = validateInput(input);

  if ("error" in validation) {
    return validation;
  }

  const { supabase } = await requireAdmin();

  try {
    const { data, error } = await supabase
      .from("charging_stations")
      .insert(validation.data)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Error creating charging station:", error);
      return { error: getWriteErrorMessage(error) };
    }

    if (!data) {
      return {
        error: "No se ha podido confirmar la creación de la estación.",
      };
    }

    revalidateStations(data.id);

    return {
      success: "Estación creada correctamente.",
      stationId: data.id,
    };
  } catch (error) {
    console.error("Unexpected error creating charging station:", error);
    return {
      error: "Ha ocurrido un error inesperado al crear la estación.",
    };
  }
}

export async function updateChargingStation(
  stationId: string,
  input: unknown,
): Promise<ChargingStationActionResult> {
  const parsedStationId = stationIdSchema.safeParse(
    typeof stationId === "string" ? stationId.trim() : stationId,
  );

  if (!parsedStationId.success) {
    return { error: "El identificador de la estación no es válido." };
  }

  const validation = validateInput(input);

  if ("error" in validation) {
    return validation;
  }

  const { supabase } = await requireAdmin();

  try {
    const { data, error } = await supabase
      .from("charging_stations")
      .update(validation.data)
      .eq("id", parsedStationId.data)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Error updating charging station:", error);
      return { error: getWriteErrorMessage(error) };
    }

    if (!data) {
      return {
        error:
          "No se ha encontrado la estación o las políticas de Supabase no permiten modificarla.",
      };
    }

    revalidateStations(parsedStationId.data);

    return { success: "Estación actualizada correctamente." };
  } catch (error) {
    console.error("Unexpected error updating charging station:", error);
    return {
      error: "Ha ocurrido un error inesperado al actualizar la estación.",
    };
  }
}

export async function deleteChargingStation(
  stationId: string,
): Promise<ChargingStationActionResult> {
  const { supabase } = await requireAdmin();

  const parsedStationId = stationIdSchema.safeParse(
    typeof stationId === "string" ? stationId.trim() : stationId,
  );

  if (!parsedStationId.success) {
    return { error: "El identificador de la estación no es válido." };
  }

  try {
    let sessionCount: number;
    try {
      sessionCount = await getChargingStationSessionCount(
        supabase,
        parsedStationId.data,
      );
    } catch (error) {
      console.error(
        "Error checking station dependencies before deletion:",
        error,
      );
      return {
        error:
          "No se pudieron comprobar las sesiones históricas; no se ha eliminado la estación.",
      };
    }

    if (sessionCount > 0) {
      return {
        error:
          "No se puede eliminar esta estación porque tiene sesiones de recarga asociadas. Conserva la estación para mantener su historial.",
      };
    }

    const { data, error } = await supabase
      .from("charging_stations")
      .delete()
      .eq("id", parsedStationId.data)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Error deleting charging station:", error);

      if (error.code === "23503") {
        return {
          error:
            "No se puede eliminar esta estación porque existen sesiones asociadas a sus conectores.",
        };
      }

      if (error.code === "42501") {
        return { error: "No tienes permisos para eliminar esta estación." };
      }

      return {
        error: "No se ha podido eliminar la estación. Inténtalo de nuevo.",
      };
    }

    if (!data) {
      return {
        error:
          "No se ha encontrado la estación o las políticas de Supabase no permiten eliminarla.",
      };
    }

    // Sin id: no se revalidan las rutas de la propia estación (ver nota arriba).
    revalidateStations();

    return { success: "Estación eliminada correctamente." };
  } catch (error) {
    console.error("Unexpected error deleting charging station:", error);
    return {
      error: "Ha ocurrido un error inesperado al eliminar la estación.",
    };
  }
}