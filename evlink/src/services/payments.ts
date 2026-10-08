import type { SupabaseClient } from "@supabase/supabase-js";

import type { Payment } from "@/types";

export async function createPayment(
  supabase: SupabaseClient,
  sessionId: string,
): Promise<Payment> {
  const { data, error } = await supabase.rpc(
    "create_payment",
    {
      p_session_id: sessionId,
    },
  );

  if (error) {
    throw new Error(
      "No se pudo crear el pago.",
    );
  }

  return data as Payment;
}

export async function processPayment(
  supabase: SupabaseClient,
  paymentId: string,
): Promise<Payment> {
  const { data, error } = await supabase.rpc(
    "process_payment",
    {
      p_payment_id: paymentId,
    },
  );

  if (error) {
    throw new Error(
      "No se pudo procesar el pago.",
    );
  }

  return data as Payment;
}