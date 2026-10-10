"use client";

import { Car, ChevronDown, LogOut, User, UserStar } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";

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
  const name = profile?.full_name || email;

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            <Avatar className="size-7.5">
              <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
                {initials || <User className="size-4" />}
              </AvatarFallback>
            </Avatar>

            <span className="hidden max-w-32 truncate font-medium sm:block">
              {loading ? "Cargando..." : name}
            </span>

            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
        }
      />

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-lg p-1"
      >
        <div className="px-3 py-2">
          <div className="flex items-center gap-1">
            {profile?.role == "admin" ? <UserStar size={16} /> : <Car size={16} />}
            <p className="truncate text-sm font-medium">
              {loading ? "Cargando..." : name}
            </p>
          </div>

          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>

        <div className="my-1 h-px bg-border" />

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="size-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
