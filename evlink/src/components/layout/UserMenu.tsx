"use client";

import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

export function UserMenu() {
  const { user, logout } = useAuth();
  const { profile, loading } = useProfile(user?.id);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada");
      router.push("/login");
    } catch {
      toast.error("No se pudo cerrar la sesión");
    }
  };

  const email = user?.email ?? "Usuario";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button type="button">
            <Avatar>
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </button>
        }
      />

      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>
          {loading ? "Cargando..." : profile?.full_name || email}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Rol: {profile?.role ?? "driver"}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
