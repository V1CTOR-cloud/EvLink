import { ArrowUpRight, ShieldCheck, User } from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/lib/format-date";
import { cn, getInitials } from "@/lib/utils";
import type { AdminUser } from "@/services/admin-users";
import { AdminUserDeleteAction } from "./AdminDeleteAction";

type AdminUsersTableProps = {
  users: AdminUser[];
};

const headerClasses =
  "px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground";

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-170 text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className={headerClasses}>Usuario</th>
              <th className={headerClasses}>Rol</th>
              <th className={headerClasses}>Registro</th>
              <th className={cn(headerClasses, "w-24")}>
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {users.map((user) => {
              const isAdmin = user.role === "admin";

              return (
                <tr
                  key={user.id}
                  className="group relative transition-colors hover:bg-muted/40"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                          isAdmin
                            ? "bg-primary/15 text-foreground ring-1 ring-primary/40"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-foreground",
                        )}
                      >
                        {getInitials(user.full_name)}
                      </div>

                      <div className="min-w-0">
                        {/* El after: cubre toda la fila, que pasa a ser clicable */}
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="block truncate font-medium after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset"
                        >
                          {user.full_name || "Sin nombre"}
                        </Link>

                        <p
                          title={user.id}
                          className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground"
                        >
                          {user.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
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
                  </td>

                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    {formatDate(user.created_at)}
                  </td>

                  <td className="px-3 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <AdminUserDeleteAction user={user} enabled />

                      <ArrowUpRight className="pointer-events-none size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}