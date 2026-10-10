import { z } from "zod";

import type { PaymentBrand } from "@/types";

const paymentMethodMinimumYear = 2026;

export const paymentMethodSchema = z
  .object({
    brand: z.enum(["visa", "mastercard", "amex"]),
    last_four: z
      .string()
      .regex(/^\d{4}$/, "Introduce exactamente los últimos cuatro dígitos"),
    expiry_month: z
      .number()
      .int("Selecciona un mes válido")
      .min(1, "Selecciona un mes válido")
      .max(12, "Selecciona un mes válido"),
    expiry_year: z
      .number()
      .int("Introduce un año válido")
      .min(
        paymentMethodMinimumYear,
        `El año debe ser ${paymentMethodMinimumYear} o posterior`,
      )
      .max(9999, "Introduce un año válido"),
  })
  .superRefine((values, context) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (
      values.expiry_year < currentYear ||
      (values.expiry_year === currentYear &&
        values.expiry_month < currentMonth)
    ) {
      context.addIssue({
        code: "custom",
        path: ["expiry_month"],
        message: "La tarjeta ya está caducada",
      });
    }
  });

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
export const paymentBrands: PaymentBrand[] = [
  "visa",
  "mastercard",
  "amex",
];
