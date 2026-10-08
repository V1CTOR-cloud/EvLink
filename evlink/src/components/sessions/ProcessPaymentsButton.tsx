"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useProcessPayment } from "@/hooks/useProcessPayment";

type ProcessPaymentButtonProps = {
  paymentId: string;
};

export function ProcessPaymentButton({ paymentId }: ProcessPaymentButtonProps) {
  const router = useRouter();

  const { process, loading } = useProcessPayment();

  const handleProcess = async () => {
    try {
      await process(paymentId);

      toast.success("Pago completado");

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo completar el pago",
      );
    }
  };

  return (
    <Button type="button" onClick={handleProcess} disabled={loading}>
      {loading ? "Procesando..." : "Pagar ahora"}
    </Button>
  );
}
