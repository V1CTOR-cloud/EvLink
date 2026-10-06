"use client";

import Image from "next/image";
import { BatteryCharging, MapPin, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LoginForm } from "@/components/login/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import type { LoginFormData } from "@/schemas/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      toast.success("Sesión iniciada");

      router.push("/");
    } catch {
      toast.error("Email o contraseña incorrectos");
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
            <LoginForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden border-l border-accent lg:block">
        <Image
          src="/login_bckg.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-primary/30 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-md">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(46,212,82,0.9)] animate-pulse" />
              Red de carga inteligente
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-16 top-1/2 size-32 -translate-y-1/2 rounded-full border border-primary/20 bg-primary/10 blur-sm" />

            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-primary/20 blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <div className="mb-3 flex gap-3 items-center">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Zap className="size-5" />
                      </div>

                      <p className="text-lg font-medium text-white">
                        EVLINK
                      </p>
                    </div>

                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                      Tu energía,
                      <br />
                      bajo control.
                    </h2>
                  </div>

                  <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                    En tiempo real
                  </div>
                </div>

                <p className="max-w-md text-sm leading-6 text-white/65">
                  Gestiona tus sesiones de carga, encuentra estaciones
                  disponibles y mantén el control de tu vehículo eléctrico.
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm text-white/80">
                  <MapPin className="size-4 text-primary" />
                  <span>Estaciones disponibles cerca de ti</span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-6 w-56 rounded-2xl border border-white/20 bg-black/30 p-4 shadow-2xl backdrop-blur-xl xl:-right-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50">Sesión activa</p>

                  <p className="mt-1 text-xl font-semibold text-white">
                    42.8 kWh
                  </p>
                </div>

                <div className="flex size-9 items-center justify-center rounded-full bg-primary/15">
                  <BatteryCharging className="size-4 text-primary" />
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[86%] rounded-full bg-primary" />
              </div>

              <div className="mt-2 flex justify-between text-[11px] text-white/40">
                <span>Cargando</span>
                <span>86%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-white/40">
            <span>EvLink</span>
            <span>Electric mobility, simplified.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
