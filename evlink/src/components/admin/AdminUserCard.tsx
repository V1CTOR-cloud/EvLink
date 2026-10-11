import { ArrowUpRight, CalendarDays, ShieldCheck, User } from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/lib/format-date";
import { cn, getInitials } from "@/lib/utils";
import type { AdminUser } from "@/services/admin-users";
import { AdminUserDeleteAction } from "./AdminDeleteAction";

interface AdminUserCardProps {
  user: AdminUser;
}

export default function AdminUserCard({ user }: AdminUserCardProps) {
  const isAdmin = user.role === "admin";

  return (
    // Un botón dentro de un <a> es HTML inválido: la tarjeta es un div y el
    // enlace del nombre se expande con after:inset-0 para cubrirla entera.
    <div className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
            isAdmin
              ? "bg-primary/15 text-foreground ring-1 ring-primary/40"
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-foreground",
          )}
        >
          {getInitials(user.full_name)}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">
            <Link
              href={`/admin/users/${user.id}`}
              className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {user.full_name || "Sin nombre"}
            </Link>
          </h2>

          <p
            title={user.id}
            className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground"
          >
            {user.id.slice(0, 8)}
          </p>
        </div>

        <ArrowUpRight className="pointer-events-none size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
            isAdmin
              ? "bg-green-500/10 text-green-600"
              : "bg-muted text-muted-foreground",
          )}
        >
          {isAdmin ? (
            <ShieldCheck className="size-3.5" />
          ) : (
            <User className="size-3.5" />
          )}
          {isAdmin ? "Administrador" : "Conductor"}
        </span>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {formatDate(user.created_at)}
          </span>

          <AdminUserDeleteAction user={user} enabled />
        </div>
      </div>
    </div>
  );
}