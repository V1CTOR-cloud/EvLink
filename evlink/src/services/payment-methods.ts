import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CreatePaymentMethodInput,
  PaymentMethod,
  UpdatePaymentMethodInput,
} from "@/types";

type SupabaseFailure = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

function isSupabaseFailure(value: unknown): value is SupabaseFailure {
  return (
    typeof value === "object" &&
    value !== null &&
    ("code" in value || "message" in value)
  );
}

function toPaymentMethodError(
  cause: unknown,
  operation: string,
): Error {
  if (!isSupabaseFailure(cause)) {
    return cause instanceof Error
      ? cause
      : new Error(`${operation} No se pudo completar.`);
  }

  let explanation: string;

  switch (cause.code) {
    case "42501":
      explanation = "No tienes permisos para realizar esta operación.";
      break;
    case "P0002":
    case "PGRST116":
      explanation = "La tarjeta no existe o no tienes acceso a ella.";
      break;
    case "23505":
      explanation =
        "La operación entra en conflicto con otra tarjeta predeterminada.";
      break;
    case "PGRST202":
      explanation =
        "La función RPC necesaria no está instalada o no está disponible en Supabase. Comprueba las migraciones y el esquema de la API.";
      break;
    default:
      explanation = operation;
  }

  const databaseMessage = cause.message
    ? ` Detalle de Supabase: ${cause.message}`
    : "";

  return new Error(`${explanation}${databaseMessage}`, { cause });
}

export async function getPaymentMethods(
  supabase: SupabaseClient,
): Promise<PaymentMethod[]> {
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw toPaymentMethodError(error, "No se pudieron cargar las tarjetas.");
  }

  return data as PaymentMethod[];
}

export async function createPaymentMethod(
  supabase: SupabaseClient,
  input: CreatePaymentMethodInput,
): Promise<PaymentMethod> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw toPaymentMethodError(userError, "No se pudo verificar la sesión.");
  }

  if (!user) {
    throw new Error("Debes iniciar sesión para guardar una tarjeta.");
  }

  const { data, error } = await supabase
    .rpc("create_payment_method", {
      p_brand: input.brand,
      p_last_four: input.last_four,
      p_expiry_month: input.expiry_month,
      p_expiry_year: input.expiry_year,
    })
    .single();

  if (error) {
    throw toPaymentMethodError(error, "No se pudo guardar la tarjeta.");
  }

  if (!data) {
    throw new Error("Supabase no devolvió la tarjeta creada.");
  }

  return data as PaymentMethod;
}

export async function updatePaymentMethod(
  supabase: SupabaseClient,
  paymentMethodId: string,
  input: UpdatePaymentMethodInput,
): Promise<PaymentMethod> {
  const { data, error } = await supabase
    .from("payment_methods")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentMethodId)
    .select("*")
    .single();

  if (error) {
    throw toPaymentMethodError(error, "No se pudo actualizar la tarjeta.");
  }

  return data as PaymentMethod;
}

export async function deletePaymentMethod(
  supabase: SupabaseClient,
  paymentMethodId: string,
): Promise<void> {
  const { error } = await supabase.rpc("delete_payment_method", {
    p_payment_method_id: paymentMethodId,
  });

  if (error) {
    throw toPaymentMethodError(error, "No se pudo eliminar la tarjeta.");
  }
}

export async function setDefaultPaymentMethod(
  supabase: SupabaseClient,
  paymentMethodId: string,
): Promise<PaymentMethod> {
  const { data, error } = await supabase
    .rpc("set_default_payment_method", {
      p_payment_method_id: paymentMethodId,
    })
    .single();

  if (error) {
    throw toPaymentMethodError(
      error,
      "No se pudo cambiar la tarjeta predeterminada.",
    );
  }

  if (!data) {
    throw new Error(
      "Supabase no devolvió la tarjeta predeterminada actualizada.",
    );
  }

  return data as PaymentMethod;
}