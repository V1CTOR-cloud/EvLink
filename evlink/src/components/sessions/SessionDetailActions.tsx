"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { StopChargingDialog } from "./StopChargingDialog";
import { useCreatePayment } from "@/hooks/useCreatePayment";
import { useProcessPayment } from "@/hooks/useProcessPayment";
import type { ChargingSession } from "@/types";

type SessionDetailActionsProps = {
  sessionId: string;
};

export function SessionDetailActions({ sessionId }: SessionDetailActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { create, loading: creatingPayment } = useCreatePayment();

  const { process, loading: processingPayment } = useProcessPayment();

  const paymentLoading = creatingPayment || processingPayment;

  const handleSessionUpdated = async (session: ChargingSession) => {
    let paymentCreated = false;

    try {
      const payment = await create(session.id);
      paymentCreated = true;

      await process(payment.id);

      toast.success("Sesión finalizada y pago completado");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Se ha producido un error inesperado.";

      if (paymentCreated) {
        toast.error(
          `La sesión se ha finalizado y el pago está registrado, pero no se pudo completar: ${message}`,
        );
      } else {
        toast.error(
          `La sesión se ha finalizado, pero no se pudo crear el pago: ${message}`,
        );
      }
    } finally {
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        onClick={() => setOpen(true)}
        disabled={paymentLoading}
      >
        Finalizar carga
      </Button>

      <StopChargingDialog
        sessionId={sessionId}
        open={open}
        onOpenChange={setOpen}
        onSessionUpdated={handleSessionUpdated}
      />
    </>
  );
}
