"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethods,
  setDefaultPaymentMethod,
  updatePaymentMethod,
} from "@/services/payment-methods";
import type {
  CreatePaymentMethodInput,
  PaymentMethod,
  UpdatePaymentMethodInput,
} from "@/types";

type PaymentMethodsState = {
  userId: string;
  paymentMethods: PaymentMethod[];
  error: Error | null;
};

function sortPaymentMethods(paymentMethods: PaymentMethod[]) {
  return [...paymentMethods].sort((left, right) => {
    if (left.is_default !== right.is_default) {
      return left.is_default ? -1 : 1;
    }

    return right.created_at.localeCompare(left.created_at);
  });
}

export function usePaymentMethods(userId?: string) {
  const [state, setState] = useState<PaymentMethodsState | null>(null);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [mutating, setMutating] = useState(false);
  const [supabase] = useState(() => createClient());
  const mountedRef = useRef(false);
  const mutationInFlightRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    let cancelled = false;

    void (async () => {
      try {
        const paymentMethods = await getPaymentMethods(supabase);
        if (!cancelled) {
          setState({
            userId,
            paymentMethods: sortPaymentMethods(paymentMethods),
            error: null,
          });
        }
      } catch (cause: unknown) {
        if (!cancelled) {
          setState({
            userId,
            paymentMethods: [],
            error:
              cause instanceof Error
                ? cause
                : new Error("No se pudieron cargar las tarjetas."),
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingUserId((current) => (current === userId ? null : current));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, supabase, userId]);

  const updateLocalState = useCallback(
    (update: (paymentMethods: PaymentMethod[]) => PaymentMethod[]) => {
      if (!userId || !mountedRef.current) {
        return;
      }

      setState((current) => {
        if (!current || current.userId !== userId) {
          return current;
        }

        return {
          ...current,
          paymentMethods: sortPaymentMethods(update(current.paymentMethods)),
          error: null,
        };
      });
    },
    [userId],
  );

  const runMutation = useCallback(
    async <T,>(operation: () => Promise<T>): Promise<T> => {
      if (!userId) {
        throw new Error("Debes iniciar sesión para gestionar tus tarjetas.");
      }

      if (state?.userId !== userId || state.error) {
        throw new Error(
          "Espera a que se carguen tus tarjetas antes de modificarlas.",
        );
      }

      if (loadingUserId === userId) {
        throw new Error("Espera a que termine la carga de tus tarjetas.");
      }

      if (mutationInFlightRef.current) {
        throw new Error("Ya hay otra operación de tarjetas en curso.");
      }

      mutationInFlightRef.current = true;
      setMutating(true);

      try {
        return await operation();
      } catch (cause) {
        const error =
          cause instanceof Error
            ? cause
            : new Error("No se pudo actualizar el método de pago.");

        throw error;
      } finally {
        mutationInFlightRef.current = false;
        if (mountedRef.current) {
          setMutating(false);
        }
      }
    },
    [loadingUserId, state, userId],
  );

  const retry = useCallback(() => {
    if (userId) {
      setLoadingUserId(userId);
    }
    setReloadKey((current) => current + 1);
  }, [userId]);

  const create = useCallback(
    (input: CreatePaymentMethodInput) =>
      runMutation(async () => {
        const paymentMethod = await createPaymentMethod(supabase, input);
        updateLocalState((current) => [...current, paymentMethod]);
        return paymentMethod;
      }),
    [runMutation, supabase, updateLocalState],
  );

  const update = useCallback(
    (paymentMethodId: string, input: UpdatePaymentMethodInput) =>
      runMutation(async () => {
        const paymentMethod = await updatePaymentMethod(
          supabase,
          paymentMethodId,
          input,
        );
        updateLocalState((current) =>
          current.map((item) =>
            item.id === paymentMethod.id ? paymentMethod : item,
          ),
        );
        return paymentMethod;
      }),
    [runMutation, supabase, updateLocalState],
  );


  const remove = useCallback(
    (paymentMethodId: string) =>
      runMutation(async () => {
        await deletePaymentMethod(supabase, paymentMethodId);

        updateLocalState((current) => {
          const remaining = current.filter(
            (item) => item.id !== paymentMethodId,
          );

          // Si ya existe una tarjeta predeterminada, la conservamos.
          if (remaining.some((item) => item.is_default)) {
            return remaining;
          }

          // Coincide con la selección de delete_payment_method:
          // elegir la tarjeta restante más antigua.
          const nextDefault = [...remaining].sort(
            (left, right) =>
              left.created_at.localeCompare(right.created_at) ||
              left.id.localeCompare(right.id),
          )[0];

          return remaining.map((item) => ({
            ...item,
            is_default: item.id === nextDefault?.id,
          }));
        });
      }),
    [runMutation, supabase, updateLocalState],
  );


  const setDefault = useCallback(
    (paymentMethodId: string) =>
      runMutation(async () => {
        const paymentMethod = await setDefaultPaymentMethod(
          supabase,
          paymentMethodId,
        );
        updateLocalState((current) =>
          current.map((item) => ({
            ...item,
            is_default: item.id === paymentMethod.id,
          })),
        );
        return paymentMethod;
      }),
    [runMutation, supabase, updateLocalState],
  );



  const currentState = state?.userId === userId ? state : null;

  return {
    paymentMethods: currentState?.paymentMethods ?? [],
    loading:
      Boolean(userId) &&
      (currentState === null || loadingUserId === userId),
    error: currentState?.error ?? null,
    mutating,
    retry,
    create,
    update,
    remove,
    setDefault,
  };
}
