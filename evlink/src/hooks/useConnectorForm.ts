"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import {
    createConnector,
    updateConnector,
} from "@/services/actions/connector-actions";
import {
    createConnectorSchema,
    updateConnectorSchema,
} from "@/schemas/connector";

type UseConnectorFormOptions = {
    stationId: string;
    connectorId?: string;
    onSuccess?: () => void;
};

export function useConnectorForm({
    stationId,
    connectorId,
    onSuccess,
}: UseConnectorFormOptions) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const [fieldErrors, setFieldErrors] = useState<
        Record<string, string[] | undefined>
    >({});

    const [formError, setFormError] = useState<string | null>(null);

    async function submit(input: unknown) {
        setFieldErrors({});
        setFormError(null);

        const schema = connectorId
            ? updateConnectorSchema
            : createConnectorSchema;

        const parsed = schema.safeParse(input);

        if (!parsed.success) {
            setFieldErrors(z.flattenError(parsed.error).fieldErrors);
            setFormError("Revisa los campos indicados.");
            return;
        }

        startTransition(async () => {
            try {
                const result = connectorId
                    ? await updateConnector(connectorId, parsed.data)
                    : await createConnector(stationId, parsed.data);

                if (result.error) {
                    setFieldErrors(result.fieldErrors ?? {});
                    setFormError(result.error);
                    toast.error(result.error);
                    return;
                }

                toast.success(
                    result.success ?? "Conector guardado correctamente.",
                );

                onSuccess?.();
                router.refresh();
            } catch (error) {
                console.error("Error saving connector:", error);

                const message = "Ha ocurrido un error inesperado.";
                setFormError(message);
                toast.error(message);
            }
        });
    }

    return {
        pending,
        fieldErrors,
        formError,
        submit,
    };
}