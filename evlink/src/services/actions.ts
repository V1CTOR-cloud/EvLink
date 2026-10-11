"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { profileSchema } from "@/schemas/profile";
import { createAdminClient } from "@/lib/supabase/admin";

const USER_DELETION_ENABLED = true;

export type AdminUserActionState = {
  error?: string;
  success?: string;
};

export type AdminUserRoleActionState = {
  error?: string;
  success?: string;
};

export type AdminUserStatusActionState = {
  error?: string;
  success?: string;
};

const userIdSchema = z.uuid();

const userRoleSchema = z.enum(["driver", "admin"]);

const userStatusSchema = z.enum(["active", "inactive"]);

function getErrorMessage(error: { code?: string } | null) {
  switch (error?.code) {
    case "42501":
      return "No tienes permisos para realizar esta operación.";

    case "22023":
      return "Los datos proporcionados no son válidos.";

    case "P0002":
      return "El usuario no existe.";

    case "23514":
      return "No se puede eliminar la cuenta: primero debes desactivarla.";

    default:
      return "No se ha podido completar la operación. Inténtalo de nuevo.";
  }
}

export async function updateAdminUserProfile(
  userId: string,
  _prevState: AdminUserActionState,
  formData: FormData,
): Promise<AdminUserActionState> {
  const parsedUserId = userIdSchema.safeParse(userId.trim());

  if (!parsedUserId.success) {
    return { error: "El identificador del usuario no es válido." };
  }

  const parsedProfile = profileSchema.safeParse({
    fullName: formData.get("fullName"),
  });

  if (!parsedProfile.success) {
    return { error: "El nombre proporcionado no es válido." };
  }

  const { supabase } = await requireAdmin();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: parsedProfile.data.fullName,
      })
      .eq("id", parsedUserId.data)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Error updating admin user profile:", error);

      if (error.code === "42501") {
        return {
          error: "No tienes permisos para modificar este perfil.",
        };
      }

      return {
        error: "No se ha podido actualizar el perfil del usuario.",
      };
    }

    if (!data) {
      return { error: "El usuario no existe o no se ha podido actualizar." };
    }

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${parsedUserId.data}`);

    return { success: "Perfil actualizado correctamente." };
  } catch (error) {
    console.error("Unexpected error updating admin user profile:", error);

    return {
      error: "Ha ocurrido un error inesperado al actualizar el perfil.",
    };
  }
}

export async function updateAdminUserRole(
  userId: string,
  _prevState: AdminUserRoleActionState,
  formData: FormData,
): Promise<AdminUserRoleActionState> {
  const role = formData.get("role");
  const parsedInput = z
    .object({
      userId: userIdSchema,
      role: userRoleSchema,
    })
    .safeParse({
      userId: userId.trim(),
      role,
    });

  if (!parsedInput.success) {
    return { error: "Los datos proporcionados no son válidos." };
  }

  const { supabase } = await requireAdmin();

  try {
    const { data, error } = await supabase.rpc("admin_update_user_role", {
      p_user_id: parsedInput.data.userId,
      p_role: parsedInput.data.role,
    });

    if (error) {
      console.error("Error updating admin user role:", error);

      return { error: getErrorMessage(error) };
    }

    if (!data || data.length === 0) {
      return {
        error: "No se ha podido confirmar el cambio de rol.",
      };
    }

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${parsedInput.data.userId}`);

    return { success: "Rol actualizado correctamente." };
  } catch (error) {
    console.error("Unexpected error updating admin user role:", error);

    return {
      error: "Ha ocurrido un error inesperado al actualizar el rol.",
    };
  }
}

export async function updateAdminUserStatus(
  userId: string,
  _prevState: AdminUserStatusActionState,
  formData: FormData,
): Promise<AdminUserStatusActionState> {
  const status = formData.get("status");
  const parsedInput = z
    .object({
      userId: userIdSchema,
      status: userStatusSchema,
    })
    .safeParse({
      userId: userId.trim(),
      status,
    });

  if (!parsedInput.success) {
    return { error: "Los datos proporcionados no son válidos." };
  }

  const { supabase } = await requireAdmin();

  try {
    const { data, error } = await supabase.rpc("admin_set_user_status", {
      p_user_id: parsedInput.data.userId,
      p_status: parsedInput.data.status,
    });

    if (error) {
      console.error("Error updating admin user status:", error);

      return { error: getErrorMessage(error) };
    }

    const updatedProfile = data?.[0];

    if (
      !updatedProfile ||
      updatedProfile.id !== parsedInput.data.userId ||
      updatedProfile.status !== parsedInput.data.status
    ) {
      return {
        error: "No se ha podido confirmar el cambio de estado.",
      };
    }

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${parsedInput.data.userId}`);

    return { success: "Estado actualizado correctamente." };
  } catch (error) {
    console.error("Unexpected error updating admin user status:", error);

    return {
      error: "Ha ocurrido un error inesperado al actualizar el estado.",
    };
  }
}

export async function deleteAdminUser(
  userId: string,
): Promise<AdminUserActionState> {
  const parsedUserId = userIdSchema.safeParse(userId.trim());
  if (!parsedUserId.success) {
    return { error: "El identificador del usuario no es válido." };
  }

  const targetUserId = parsedUserId.data;

  // Mantener fuera del try: redirect() de Next.js es control de flujo.
  const { supabase, user: actor } = await requireAdmin();

  if (actor.id === targetUserId) {
    return {
      error:
        "No puedes eliminar tu propia cuenta desde el panel de administración.",
    };
  }

  if (!USER_DELETION_ENABLED) {
    return {
      error: "La eliminación de cuentas está temporalmente deshabilitada.",
    };
  }

  let admin: ReturnType<typeof createAdminClient>;

  try {
    admin = createAdminClient();
  } catch (error) {
    console.error("Error creating Supabase admin client:", error);

    return {
      error: "La configuración administrativa no está disponible.",
    };
  }

  // La cancelación debe fallar de forma segura si no podemos confirmar
  // que la RPC se ha ejecutado correctamente.

  // Cancela el bloqueo y verifica que realmente haya desaparecido.
  // Si no podemos confirmar el resultado, falla de forma segura.
  const cancelDeletionLock = async (): Promise<boolean> => {
    try {
      const { error: cancelError } = await supabase.rpc(
        "admin_cancel_user_deletion",
        { p_user_id: targetUserId },
      );

      if (cancelError) {
        console.error(
          "Error cancelling user deletion lock:",
          cancelError,
        );
        return false;
      }

      // Usamos el cliente administrativo para evitar que RLS
      // oculte una fila que todavía existe.
      const { data: remainingLock, error: lockCheckError } =
        await admin
          .from("account_deletion_locks")
          .select("user_id")
          .eq("user_id", targetUserId)
          .maybeSingle();

      if (lockCheckError) {
        console.error(
          "Error verifying user deletion lock removal:",
          lockCheckError,
        );
        return false;
      }

      if (remainingLock) {
        console.error(
          "User deletion lock still exists after cancellation:",
          targetUserId,
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "Unexpected error cancelling or verifying user deletion lock:",
        error,
      );
      return false;
    }
  };


  // Preparar la eliminación y adquirir el bloqueo en PostgreSQL.
  try {
    const { error: prepareError } = await supabase.rpc(
      "admin_prepare_user_deletion",
      { p_user_id: targetUserId },
    );

    if (prepareError) {
      console.error("Error preparing user deletion:", prepareError);

      return { error: getErrorMessage(prepareError) };
    }
  } catch (error) {
    console.error("Unexpected error preparing user deletion:", error);

    // El resultado de la RPC es incierto. No cancelamos a ciegas:
    // podría existir un bloqueo previo de este mismo administrador.
    return {
      error:
        "No se ha podido confirmar la preparación de la eliminación. " +
        "No se ha intentado borrar la cuenta; es necesaria una revisión " +
        "administrativa para comprobar el estado del bloqueo.",
    };
  }

  // Intentar eliminar la cuenta de Supabase Auth.
  let deletionConfirmed = false;
  let deleteFailed = false;

  try {
    const { error: deleteError } =
      await admin.auth.admin.deleteUser(targetUserId);

    if (deleteError) {
      deleteFailed = true;
      console.error("Error deleting Supabase Auth user:", deleteError);
    } else {
      deletionConfirmed = true;
    }
  } catch (error) {
    deleteFailed = true;
    console.error(
      "Unexpected exception deleting Supabase Auth user:",
      error,
    );
  }

  // Si la eliminación devolvió un error o lanzó una excepción,
  // averiguar si la cuenta sigue existiendo antes de liberar el bloqueo.
  if (deleteFailed) {
    let existingUser: { id: string } | null = null;
    let lookupError:
      | { status?: number; code?: string; message?: string }
      | null = null;

    try {
      const result =
        await admin.auth.admin.getUserById(targetUserId);

      existingUser = result.data.user
        ? { id: result.data.user.id }
        : null;

      lookupError = result.error;
    } catch (error) {
      console.error(
        "Unexpected exception checking Auth user:",
        error,
      );

      return {
        error:
          "No se ha podido confirmar el resultado de la eliminación. " +
          "El bloqueo se mantiene por seguridad y requiere revisión " +
          "administrativa.",
      };
    }

    // Si Auth confirma que la cuenta todavía existe, no se ha completado
    // la eliminación. Podemos intentar liberar el bloqueo de esta solicitud.
    if (!lookupError && existingUser) {
      const lockCancelled = await cancelDeletionLock();

      if (!lockCancelled) {
        return {
          error:
            "La cuenta sigue existiendo, pero no se ha podido liberar " +
            "el bloqueo. Es necesaria una revisión administrativa.",
        };
      }

      return {
        error: "Supabase no ha podido eliminar la cuenta.",
      };
    }

    // Un resultado satisfactorio sin usuario, o un error explícito de
    // usuario inexistente, confirma que ya no está en Auth.
    const userNotFound =
      lookupError?.status === 404 ||
      lookupError?.code === "user_not_found";

    if ((!lookupError && !existingUser) || userNotFound) {
      deletionConfirmed = true;
    } else {
      console.error(
        "Could not determine whether the Auth user still exists:",
        lookupError,
      );

      // No liberar el bloqueo cuando el estado real es incierto.
      return {
        error:
          "No se ha podido confirmar el resultado de la eliminación. " +
          "El bloqueo se mantiene por seguridad y requiere revisión " +
          "administrativa.",
      };
    }
  }

  if (!deletionConfirmed) {
    return {
      error: "No se ha podido confirmar la eliminación de la cuenta.",
    };
  }

  // Verificar que el perfil haya desaparecido mediante ON DELETE CASCADE.
  try {
    const { data: remainingProfile, error: profileCheckError } =
      await admin
        .from("profiles")
        .select("id")
        .eq("id", targetUserId)
        .maybeSingle();

    if (profileCheckError) {
      console.error(
        "Error verifying deleted user profile:",
        profileCheckError,
      );

      return {
        error:
          "La cuenta de autenticación se ha eliminado, pero no se ha " +
          "podido verificar el perfil. Es necesaria una revisión administrativa.",
      };
    }

    if (remainingProfile) {
      console.error(
        "Auth user was deleted but profile remains:",
        targetUserId,
      );

      return {
        error:
          "La cuenta de autenticación se ha eliminado, pero el perfil " +
          "sigue existiendo. Es necesaria una revisión administrativa.",
      };
    }
  } catch (error) {
    console.error(
      "Unexpected error verifying deleted user profile:",
      error,
    );

    return {
      error:
        "La cuenta de autenticación se ha eliminado, pero no se ha " +
        "podido verificar el perfil. Es necesaria una revisión administrativa.",
    };
  }

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${targetUserId}`);

  return { success: "Cuenta eliminada correctamente." };
}
