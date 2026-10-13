import type { SupabaseClient } from "@supabase/supabase-js";

import type { Profile } from "@/types";

export type AdminUser = Pick<
  Profile,
  "id" | "full_name" | "role" | "status"
> & {
  created_at: string;
  updated_at: string | null;
};

export type AdminUsersPage = {
  users: AdminUser[];
  count: number;
  roleCounts: Record<"all" | "driver" | "admin", number>;
};

export const ADMIN_USERS_PAGE_SIZE = 10;

export type AdminUsersSortOrder =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc";

export type AdminUsersRoleFilter = "all" | Profile["role"];

export async function listAdminUsers(
  supabase: SupabaseClient,
  options: {
    search: string;
    page: number;
    role: AdminUsersRoleFilter;
    createdAfter?: string;
    createdBefore?: string;
    sortOrder: AdminUsersSortOrder;
  },
): Promise<AdminUsersPage> {
  const from = (options.page - 1) * ADMIN_USERS_PAGE_SIZE;
  const to = from + ADMIN_USERS_PAGE_SIZE - 1;

  const ascending =
    options.sortOrder === "oldest" || options.sortOrder === "name-asc";
  const sortColumn =
    options.sortOrder === "name-asc" || options.sortOrder === "name-desc"
      ? "full_name"
      : "created_at";

  let usersQuery = supabase
    .from("profiles")
    .select("id, full_name, role, created_at, updated_at", {
      count: "exact",
    });

  if (options.search) {
    usersQuery = usersQuery.ilike("full_name", `%${options.search}%`);
  }
  if (options.createdAfter) {
    usersQuery = usersQuery.gte("created_at", options.createdAfter);
  }
  if (options.createdBefore) {
    usersQuery = usersQuery.lt("created_at", options.createdBefore);
  }
  if (options.role !== "all") {
    usersQuery = usersQuery.eq("role", options.role);
  }

  const usersPromise = usersQuery
    .order(sortColumn, { ascending })
    .range(from, to);

  const roleCountPromises = (["all", "driver", "admin"] as const).map(
    async (role) => {
      let countQuery = supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });
      if (options.search) {
        countQuery = countQuery.ilike("full_name", `%${options.search}%`);
      }
      if (options.createdAfter) {
        countQuery = countQuery.gte("created_at", options.createdAfter);
      }
      if (options.createdBefore) {
        countQuery = countQuery.lt("created_at", options.createdBefore);
      }
      if (role !== "all") {
        countQuery = countQuery.eq("role", role);
      }

      const { count, error } = await countQuery;
      if (error) {
        throw error;
      }

      return [role, count ?? 0] as const;
    },
  );

  const [{ data, error, count }, roleCountEntries] = await Promise.all([
    usersPromise,
    Promise.all(roleCountPromises),
  ]);

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Supabase no devolvió el listado de usuarios.");
  }

  const userIds = data.map((user) => user.id);
  const statusById: Partial<Record<string, Profile["status"]>> = {};

  if (userIds.length > 0) {
    for (const userId of userIds) {
      const statusResult = await supabase
        .from("profiles")
        .select("id, status")
        .eq("id", userId)
        .maybeSingle();

      if (!statusResult) {
        continue;
      }

      const { data: statusRow, error: statusError } = statusResult;

      if (statusError) {
        throw statusError;
      }

      if (statusRow) {
        statusById[userId] = statusRow.status;
      }
    }
  }

  return {
    users: data.map((user) => {
      const status = statusById[user.id];
      return status === undefined ? user : { ...user, status };
    }) as AdminUser[],
    count: count ?? 0,
    roleCounts: Object.fromEntries(roleCountEntries) as AdminUsersPage["roleCounts"],
  };
}

export async function getAdminUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, status, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
