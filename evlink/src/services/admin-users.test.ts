import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAdminUser, listAdminUsers } from "@/services/admin-users";

const { from, select, order, range, ilike, eq, maybeSingle } = vi.hoisted(() => ({
  from: vi.fn(),
  select: vi.fn(),
  order: vi.fn(),
  range: vi.fn(),
  ilike: vi.fn(),
  eq: vi.fn(),
  maybeSingle: vi.fn(),
}));

const supabase = { from } as never;

describe("admin users service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    from.mockReturnValue({ select, order, range, ilike, eq, maybeSingle });
    select.mockReturnThis();
    order.mockReturnThis();
    range.mockReturnThis();
    ilike.mockReturnThis();
    eq.mockReturnThis();
  });

  it("lista perfiles paginados y añade búsqueda por nombre", async () => {
    const users = [
      {
        id: "user-1",
        full_name: "Ada Lovelace",
        role: "driver",
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: null,
      },
    ];
    range.mockResolvedValue({ data: users, error: null, count: 1 });

    await expect(
      listAdminUsers(supabase, {
        search: "Ada",
        page: 2,
        role: "all",
        sortOrder: "newest",
      }),
    ).resolves.toEqual({
      users,
      count: 1,
      roleCounts: { all: 0, driver: 0, admin: 0 },
    });

    expect(from).toHaveBeenCalledWith("profiles");
    expect(select).toHaveBeenCalledWith(
      "id, full_name, role, created_at, updated_at",
      { count: "exact" },
    );
    expect(order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(range).toHaveBeenCalledWith(10, 19);
    expect(ilike).toHaveBeenCalledWith("full_name", "%Ada%");
  });

  it("propaga errores de listado", async () => {
    const error = new Error("RLS denied");
    range.mockResolvedValue({ data: null, error, count: null });

    await expect(
      listAdminUsers(supabase, {
        search: "",
        page: 1,
        role: "all",
        sortOrder: "newest",
      }),
    ).rejects.toBe(error);
  });

  it("devuelve null si no existe el perfil solicitado", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });

    await expect(getAdminUser(supabase, "missing-id")).resolves.toBeNull();
    expect(eq).toHaveBeenCalledWith("id", "missing-id");
  });
});
