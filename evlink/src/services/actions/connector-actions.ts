
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createConnectorSchema,
  updateConnectorSchema,
} from "@/schemas/connector";

export type ConnectorActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  success?: string;
  connectorId?: string;
};

type ValidationResult<T> =
  | { data: T }
  | {
    error: string;
    fieldErrors?: Record<string, string[] | undefined>;
  };

const idSchema = z.uuid();

function validateInput<T extends z.ZodType>(
  input: unknown,
  schema: T,
): ValidationResult<z.output<T>> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return {
      error: "Revisa los campos indicados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  return { data: parsed.data };
}

function revalidateConnectorRoutes(stationId: string) {
  revalidatePath("/stations");
  revalidatePath(`/stations/${stationId}`);
  revalidatePath("/admin/stations");
  revalidatePath(`/admin/stations/${stationId}`);
  revalidatePath(`/admin/stations/${stationId}/edit`);
  revalidatePath("/admin");
}

function getWriteErrorMessage(error: { code?: string }) {
  if (error.code === "42501") {
    return "No tienes permisos para modificar conectores.";
  }

  if (error.code === "23503") {
    return "La estación seleccionada no existe.";
  }

  if (error.code === "23514" || error.code === "22P02") {
    return "Los datos del conector no son válidos.";
  }

  return "No se ha podido guardar el conector. Inténtalo de nuevo.";
}

export async function createConnector(
  stationId: string,
  input: unknown,
): Promise<ConnectorActionResult> {
  const { supabase } = await requireAdmin();

  const parsedStationId = idSchema.safeParse(
    typeof stationId === "string" ? stationId.trim() : stationId,
  );

  if (!parsedStationId.success) {
    return {
      error: "El identificador de la estación no es válido.",
    };
  }

  const validation = validateInput(input, createConnectorSchema);

  if (!("data" in validation)) {
    return validation;
  }

  try {
    const { data, error } = await supabase
      .from("connectors")
      .insert({
        ...validation.data,
        status: "available",
        station_id: parsedStationId.data,
      })
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Error creating connector:", error);

      return {
        error: getWriteErrorMessage(error),
      };
    }

    if (!data) {
      return {
        error: "No se ha podido confirmar la creación del conector.",
      };
    }

    revalidateConnectorRoutes(parsedStationId.data);

    return {
      success: "Conector creado correctamente.",
      connectorId: data.id,
    };
  } catch (error) {
    console.error("Unexpected error creating connector:", error);

    return {
      error: "Ha ocurrido un error inesperado al crear el conector.",
    };
  }
}

export async function updateConnector(
  connectorId: string,
  input: unknown,
): Promise<ConnectorActionResult> {
  const { supabase } = await requireAdmin();

  const parsedConnectorId = idSchema.safeParse(
    typeof connectorId === "string" ? connectorId.trim() : connectorId,
  );

  if (!parsedConnectorId.success) {
    return {
      error: "El identificador del conector no es válido.",
    };
  }

  const validation = validateInput(input, updateConnectorSchema);

  if (!("data" in validation)) {
    return validation;
  }

  try {
    const { data: connector, error: lookupError } = await supabase
      .from("connectors")
      .select("id, station_id")
      .eq("id", parsedConnectorId.data)
      .maybeSingle();

    if (lookupError) {
      console.error("Error finding connector:", lookupError);

      return {
        error: "No se ha podido comprobar el conector.",
      };
    }

    if (!connector) {
      return {
        error: "No se ha encontrado el conector.",
      };
    }

    const { data, error } = await supabase.rpc(
      "update_connector_config",
      {
        p_connector_id: parsedConnectorId.data,
        p_connector_type: validation.data.connector_type,
        p_power_kw: validation.data.power_kw,
        p_price_per_kwh: validation.data.price_per_kwh,
        p_status: validation.data.status,
      },
    );

    if (error) {
      console.error("Error updating connector:", error);

      if (error.code === "42501") {
        return {
          error: "No tienes permisos para modificar este conector.",
        };
      }

      if (error.code === "23514") {
        return {
          error:
            "No se puede modificar el conector mientras tenga una sesión pendiente o en curso, ni asignar el estado ocupado manualmente.",
        };
      }

      return {
        error: getWriteErrorMessage(error),
      };
    }

    if (!data) {
      return {
        error: "No se ha podido confirmar la actualización del conector.",
      };
    }

    revalidateConnectorRoutes(connector.station_id);

    return {
      success: "Conector actualizado correctamente.",
      connectorId: connector.id,
    };
  } catch (error) {
    console.error("Unexpected error updating connector:", error);

    return {
      error: "Ha ocurrido un error inesperado al actualizar el conector.",
    };
  }
}


export async function deleteConnector(
  connectorId: string,
): Promise<ConnectorActionResult> {
  const { supabase } = await requireAdmin();

  const parsedConnectorId = idSchema.safeParse(
    typeof connectorId === "string" ? connectorId.trim() : connectorId,
  );

  if (!parsedConnectorId.success) {
    return {
      error: "El identificador del conector no es válido.",
    };
  }

  try {
    // Obtener la estación para revalidar sus rutas después del borrado.
    const { data: connector, error: lookupError } = await supabase
      .from("connectors")
      .select("id, station_id")
      .eq("id", parsedConnectorId.data)
      .maybeSingle();

    if (lookupError) {
      console.error("Error finding connector for deletion:", lookupError);

      return {
        error: "No se ha podido comprobar el conector.",
      };
    }

    if (!connector) {
      return {
        error: "No se ha encontrado el conector.",
      };
    }

    const { data, error } = await supabase
      .from("connectors")
      .delete()
      .eq("id", connector.id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Error deleting connector:", error);

      if (error.code === "23503") {
        return {
          error:
            "No se puede eliminar este conector porque tiene sesiones de recarga asociadas. Conserva el conector para mantener su historial.",
        };
      }

      if (error.code === "42501") {
        return {
          error: "No tienes permisos para eliminar este conector.",
        };
      }

      return {
        error: "No se ha podido eliminar el conector. Inténtalo de nuevo.",
      };
    }

    if (!data) {
      return {
        error: "No se ha podido confirmar la eliminación del conector.",
      };
    }

    revalidateConnectorRoutes(connector.station_id);

    return {
      success: "Conector eliminado correctamente.",
      connectorId: connector.id,
    };
  } catch (error) {
    console.error("Unexpected error deleting connector:", error);

    return {
      error: "Ha ocurrido un error inesperado al eliminar el conector.",
    };
  }
}
