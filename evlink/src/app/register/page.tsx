"use client";

import { BatteryCharging, MapPin, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { RegisterForm } from "@/components/register/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import type { RegisterFormData } from "@/schemas/auth";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.email, data.password, data.fullName);

      toast.success("Cuenta creada correctamente");

      router.push("/");
    } catch {
      toast.error("No se pudo crear la cuenta");
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_2fr]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </div>
            EvLink
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <RegisterForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden border-l border-accent lg:block">
        <div className="absolute inset-0 bg-[#07110a]" />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
        linear-gradient(to right, rgba(46, 212, 82, 0.18) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(46, 212, 82, 0.18) 1px, transparent 1px)
      `,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="absolute left-1/2 top-1/2 size-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-primary/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm text-primary backdrop-blur-md">
              <span className="size-2 animate-pulse rounded-full bg-primary shadow-[0_0_12px_rgba(46,212,82,0.9)]" />
              Red de carga inteligente
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute left-1/2 top-1/2 h-72 w-px -translate-x-1/2 -translate-y-1/2 linear-gradient-to-b from-transparent via-primary/30 to-transparent" />

            <div className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />

            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-primary/20 bg-black/30 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="absolute -right-16 -top-16 size-40 rounded-full bg-primary/15 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                      <Zap className="size-5" />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-white/40">
                        EVLINK
                      </p>

                      <p className="text-sm font-medium text-white">
                        Centro de carga
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                    <span className="size-1.5 rounded-full bg-primary" />
                    Online
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-6">
                  <div className="relative flex size-28 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5">
                    <div className="absolute inset-2 rounded-full border border-primary/10" />

                    <div className="flex flex-col items-center">
                      <BatteryCharging className="size-7 text-primary" />

                      <span className="mt-1 text-xl font-semibold text-white">
                        86%
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-white/40">Sesión de carga</p>

                    <p className="mt-1 text-lg font-semibold text-white">
                      42.8 kWh
                    </p>

                    <p className="mt-1 text-xs text-white/50">
                      Cargando actualmente
                    </p>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[86%] rounded-full bg-primary shadow-[0_0_10px_rgba(46,212,82,0.5)]" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                    <p className="text-[10px] text-white/40">Potencia</p>

                    <p className="mt-1 text-sm font-medium text-white">
                      150 kW
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                    <p className="text-[10px] text-white/40">Tiempo</p>

                    <p className="mt-1 text-sm font-medium text-white">
                      24 min
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                    <p className="text-[10px] text-white/40">Coste</p>

                    <p className="mt-1 text-sm font-medium text-white">
                      12.84 €
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-4 w-52 rounded-xl border border-primary/20 bg-black/50 p-4 shadow-2xl backdrop-blur-xl xl:-right-10">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="size-4 text-primary" />
                </div>

                <div>
                  <p className="text-[11px] text-white/40">Estación cercana</p>

                  <p className="text-sm font-medium text-white">
                    Valencia Centro
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-white/40">4 conectores</span>

                <span className="font-medium text-primary">2 disponibles</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-white/30">
            <span>EvLink</span>
            <span>Electric mobility, simplified.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
