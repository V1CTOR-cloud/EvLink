
"use client";

import { Ellipsis, Pencil, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PaymentMethod } from "@/types";

import { PaymentCardVisual } from "./PaymentMethodCardVisual";

type PaymentMethodCardProps = {
  method: PaymentMethod;
  mutating: boolean;
  onEdit: (method: PaymentMethod) => void;
  onSetDefault: (method: PaymentMethod) => void;
  onDelete: (method: PaymentMethod) => void;
};

export function PaymentMethodCard({
  method,
  mutating,
  onEdit,
  onSetDefault,
  onDelete,
}: PaymentMethodCardProps) {
  return (
    <li className="group relative min-w-full md:min-w-2/3">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => onEdit(method)}
          disabled={mutating}
          aria-label={`Editar tarjeta ${method.brand} terminada en ${method.last_four}`}
          className="min-w-0 flex-1 rounded-xl text-left outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PaymentCardVisual
            brand={method.brand}
            last_four={method.last_four}
            expiry_month={method.expiry_month}
            expiry_year={method.expiry_year}
            is_default={method.is_default}
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium capitalize">
              {method.brand}
            </span>

            <span className="text-sm text-muted-foreground">
              ···· {method.last_four}
            </span>

            {method.is_default && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Predeterminada
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Caduca{" "}
            {String(method.expiry_month).padStart(2, "0")}/
            {method.expiry_year}
          </p>
        </button>

        <div
          className={[
            "shrink-0 transition-opacity duration-150",
            "[@media(hover:hover)]:opacity-0",
            "[@media(hover:hover)]:group-hover:opacity-100",
            "[@media(hover:hover)]:group-focus-within:opacity-100",
          ].join(" ")}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={mutating}
                  aria-label={`Opciones de la tarjeta terminada en ${method.last_four}`}
                  className="size-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                />
              }
            >
              <Ellipsis className="size-5" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                disabled={mutating}
                onClick={() => onEdit(method)}
              >
                <Pencil className="mr-2 size-4" />
                Editar tarjeta
              </DropdownMenuItem>

              {!method.is_default && (
                <DropdownMenuItem
                  disabled={mutating}
                  onClick={() => onSetDefault(method)}
                >
                  <Star className="mr-2 size-4" />
                  Establecer como predeterminada
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={mutating}
                onClick={() => onDelete(method)}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Eliminar tarjeta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </li>
  );
}
