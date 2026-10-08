"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { StopChargingDialog } from "./StopChargingDialog";

type SessionDetailActionsProps = {
  sessionId: string;
};

export function SessionDetailActions({
  sessionId,
}: SessionDetailActionsProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleSessionUpdated = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        onClick={() => setOpen(true)}
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