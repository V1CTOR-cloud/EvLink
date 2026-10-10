import { Zap } from "lucide-react";

import type { PaymentBrand } from "@/types";

const brandLabels: Record<PaymentBrand, string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "AMEX",
};

type PaymentCardVisualProps = {
  brand: PaymentBrand;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  preview?: boolean;
};

export function PaymentCardVisual({
  brand,
  last_four,
  expiry_month,
  expiry_year,
  is_default,
  preview = false,
}: PaymentCardVisualProps) {
  return (
    <div
      className={`evlink-payment-card relative isolate flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-emerald-300/20 bg-[#0b1710] p-5 text-white shadow-xl shadow-emerald-950/15 ${
        preview ? "min-h-60 p-6 sm:min-h-64 sm:p-7" : "min-h-52"
      }`}
    >
      {/* Fondo base */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br from-[#203d2b] via-[#102419] to-[#080f0b]" />

      {/* Luces ambientales */}
      <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-72 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 left-1/4 -z-10 size-72 rounded-full bg-green-500/10 blur-3xl" />

      {/* Ondas de energía */}
      <svg
        aria-hidden="true"
        viewBox="0 0 440 260"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 -z-10 size-full"
      >
        <defs>
          <linearGradient id="evlink-energy-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0" />
            <stop offset="55%" stopColor="#4ade80" stopOpacity=".5" />
            <stop offset="100%" stopColor="#bbf7d0" stopOpacity=".05" />
          </linearGradient>
        </defs>

        <path
          d="M230 -20 C260 35 350 15 320 85 S370 135 460 80"
          fill="none"
          stroke="url(#evlink-energy-line)"
          strokeWidth="1.2"
        />
        <path
          d="M250 -20 C280 45 370 30 340 100 S390 155 460 105"
          fill="none"
          stroke="url(#evlink-energy-line)"
          strokeWidth="1"
          opacity=".65"
        />
        <path
          d="M-20 220 C70 155 120 235 210 185 S340 220 460 105"
          fill="none"
          stroke="#4ade80"
          strokeOpacity=".13"
          strokeWidth="1"
        />
        <circle cx="330" cy="82" r="2" fill="#86efac" opacity=".8" />
        <circle cx="350" cy="101" r="1.5" fill="#86efac" opacity=".55" />
      </svg>

      {/* Cabecera */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200 shadow-inner shadow-emerald-200/5">
            <Zap className="size-5 fill-current" />
          </div>

          <div>
            <p className="text-base font-semibold tracking-wide">EvLink</p>
            <p className="mt-0.5 text-[9px] font-medium tracking-[0.2em] text-emerald-100/55 uppercase">
              Electric mobility
            </p>
          </div>
        </div>

        <span className="rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-white/90 backdrop-blur-md">
          {brandLabels[brand]}
        </span>
      </div>

      {/* Datos */}
      <div className="relative mt-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          {/* Chip */}
          <div className="relative h-8 w-10 overflow-hidden rounded-md border border-amber-100/50 bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 shadow-md shadow-black/10">
            <div className="absolute inset-x-0 top-1/3 h-px bg-amber-950/30" />
            <div className="absolute inset-x-0 top-2/3 h-px bg-amber-950/30" />
            <div className="absolute inset-y-0 left-1/3 w-px bg-amber-950/30" />
            <div className="absolute inset-y-0 right-1/3 w-px bg-amber-950/30" />
            <div className="absolute inset-1 rounded-sm border border-amber-950/25" />
          </div>

          <span className="text-[9px] font-medium tracking-[0.22em] text-emerald-100/45 uppercase">
            Datos de prueba
          </span>
        </div>

        <p className="font-mono text-base tracking-[0.12em] text-white sm:text-lg">
          •••• •••• •••• {last_four || "••••"}
        </p>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-[9px] font-medium tracking-[0.18em] text-emerald-100/55 uppercase">
              Válida hasta
            </p>
            <p className="mt-1 font-mono text-sm tracking-wider text-white/90">
              {String(expiry_month).padStart(2, "0")}/
              {String(expiry_year).slice(-2)}
            </p>
          </div>

          {is_default && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1.5 text-[10px] font-medium text-emerald-100 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)]" />
              Predeterminada
            </span>
          )}
        </div>
      </div>

      {/* Borde luminoso inferior */}
      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />
    </div>
  );
}
