
import { describe, expect, it, vi, beforeEach } from "vitest";


import { createPayment, processPayment } from "@/services/payments";
import type { Payment } from "@/types";

const { rpc } = vi.hoisted(() => ({
    rpc: vi.fn(),
}));

const paymentFixture = {
    id: "payment-test-id",
    session_id: "session-test-id",
    user_id: "user-test-id",
    amount: 0.0261,
    currency: "EUR",
    status: "pending",
    payment_method_id: "method-test-id",
    created_at: "2026-01-01T10:00:00.000Z",
    updated_at: "2026-01-01T10:00:00.000Z",
} as Payment;

const supabase = {
    rpc,
} as never;

describe("createPayment", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("devuelve el pago cuando Supabase responde correctamente", async () => {
        rpc.mockResolvedValue({
            data: paymentFixture,
            error: null,
        });

        const result = await createPayment(
            supabase,
            "session-test-id",
        );

        expect(rpc).toHaveBeenCalledWith("create_payment", {
            p_session_id: "session-test-id",
        });
        expect(result).toEqual(paymentFixture);
    });

    it("lanza un error cuando falla la RPC", async () => {
        rpc.mockResolvedValue({
            data: null,
            error: {
                code: "42501",
                message: "No autorizado",
            },
        });

        await expect(
            createPayment(supabase, "session-test-id"),
        ).rejects.toThrow(
            "No tienes permisos para realizar esta operación.",
        );
    });


    it("muestra un mensaje específico si falta una tarjeta predeterminada", async () => {
        rpc.mockResolvedValue({
            data: null,
            error: {
                code: "P0001",
                message:
                    "Necesitas añadir una tarjeta y establecerla como predeterminada antes de pagar",
            },
        });

        await expect(
            createPayment(supabase, "session-test-id"),
        ).rejects.toThrow(
            "Necesitas una tarjeta predeterminada para realizar el pago.",
        );
    });

    it("muestra un mensaje específico si la tarjeta no es válida", async () => {
        rpc.mockResolvedValue({
            data: null,
            error: {
                code: "P0001",
                message: "No existe una tarjeta asociada válida",
            },
        });

        await expect(
            createPayment(supabase, "session-test-id"),
        ).rejects.toThrow(
            "Necesitas una tarjeta predeterminada para realizar el pago.",
        );
    });

    it("lanza un error si Supabase no devuelve datos ni error", async () => {
        rpc.mockResolvedValue({
            data: null,
            error: null,
        });

        await expect(
            createPayment(supabase, "session-test-id"),
        ).rejects.toThrow(
            "Supabase no devolvió el pago creado.",
        );
    });
    
});


describe("processPayment", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("procesa el pago y devuelve el resultado de Supabase", async () => {
        const completedPayment = {
            ...paymentFixture,
            status: "completed",
        };

        rpc.mockResolvedValue({
            data: completedPayment,
            error: null,
        });

        const result = await processPayment(
            supabase,
            "payment-test-id",
        );

        expect(rpc).toHaveBeenCalledWith("process_payment", {
            p_payment_id: "payment-test-id",
        });

        expect(result).toEqual(completedPayment);
    });

    it("lanza un error si Supabase rechaza el procesamiento", async () => {
        rpc.mockResolvedValue({
            data: null,
            error: {
                code: "42501",
                message: "No autorizado",
            },
        });

        await expect(
            processPayment(supabase, "payment-test-id"),
        ).rejects.toThrow(
            "No tienes permisos para realizar esta operación.",
        );
    });

    it("lanza un error si Supabase no devuelve ningún pago", async () => {
        rpc.mockResolvedValue({
            data: null,
            error: null,
        });

        await expect(
            processPayment(supabase, "payment-test-id"),
        ).rejects.toThrow(
            "Supabase no devolvió el pago procesado.",
        );
    });
});

