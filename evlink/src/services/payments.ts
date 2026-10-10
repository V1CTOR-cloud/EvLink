
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Payment } from "@/types";

type PaymentRpcError = {
  code?: string;
  message?: string;
};

function toPaymentError(
  cause: PaymentRpcError,
  fallbackMessage: string,
): Error {
  const message = cause.message ?? "";

  if (
    message.includes("tarjeta") &&
    (
      message.includes("predeterminada") ||
      message.includes("asociada válida")
    )
  ) {
    return new Error(
      "Necesitas una tarjeta predeterminada para realizar el pago.",
      { cause },
    );
  }

  switch (cause.code) {
    case "42501":
      return new Error(
        "No tienes permisos para realizar esta operación.",
        { cause },
      );

    case "PGRST202":
      return new Error(
        "La función de pagos no está disponible. Comprueba las migraciones de Supabase.",
        { cause },
      );

    default:
      return new Error(fallbackMessage, { cause });
  }
}

export async function createPayment(
  supabase: SupabaseClient,
  sessionId: string,
): Promise<Payment> {
  const { data, error } = await supabase.rpc("create_payment", {
    p_session_id: sessionId,
  });

  if (error) {
    throw toPaymentError(
      error,
      "No se pudo crear el pago. Inténtalo de nuevo.",
    );
  }

  if (!data) {
    throw new Error("Supabase no devolvió el pago creado.");
  }

  return data as Payment;
}

export async function processPayment(
  supabase: SupabaseClient,
  paymentId: string,
): Promise<Payment> {
  const { data, error } = await supabase.rpc("process_payment", {
    p_payment_id: paymentId,
  });

  if (error) {
    throw toPaymentError(
      error,
      "No se pudo procesar el pago. Inténtalo de nuevo.",
    );
  }

  if (!data) {
    throw new Error("Supabase no devolvió el pago procesado.");
  }

  return data as Payment;
}
