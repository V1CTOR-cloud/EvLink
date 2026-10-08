"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { StopChargingDialog } from "./StopChargingDialog";
import { useCreatePayment } from "@/hooks/useCreatePayment";
import type { ChargingSession } from "@/types";

type SessionDetailActionsProps = {
  sessionId: string;
};

export function SessionDetailActions({
  sessionId,
}: SessionDetailActionsProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const {
    create,
    loading: paymentLoading,
  } = useCreatePayment();

  const handleSessionUpdated = async (
    session: ChargingSession,
  ) => {
    try {
      await create(session.id);

      setOpen(false);

      toast.success(
        "Sesión finalizada y pago creado",
      );

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "La sesión se finalizó, pero no se pudo crear el pago",
      );

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