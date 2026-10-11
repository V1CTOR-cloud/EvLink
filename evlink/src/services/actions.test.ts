
import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateAdminUserProfile } from "@/services/actions";

const {
  eq,
  from,
  maybeSingle,
  revalidatePath,
  requireAdmin,
  select,
  update,
} = vi.hoisted(() => ({
  eq: vi.fn(),
  from: vi.fn(),
  maybeSingle: vi.fn(),
  revalidatePath: vi.fn(),
  requireAdmin: vi.fn(),
  select: vi.fn(),
  update: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/lib/auth/require-admin", () => ({ requireAdmin }));

const supabase = { from } as never;

function makeFormData(userId: string, fullName: string): FormData {
  const formData = new FormData();

  formData.set("userId", userId);
  formData.set("fullName", fullName);

  return formData;
}

describe("updateAdminUserProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    requireAdmin.mockResolvedValue({ supabase });

    from.mockReturnValue({ update, eq, select, maybeSingle });

    update.mockReturnThis();
    eq.mockReturnThis();
    select.mockReturnThis();
  });

  it("actualiza únicamente el nombre y revalida las páginas afectadas", async () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000";

    maybeSingle.mockResolvedValue({
      data: { id: userId },
      error: null,
    });

    await expect(
      updateAdminUserProfile(
        userId,
        {},
        makeFormData(userId, "Ada Lovelace"),
      ),
    ).resolves.toEqual({
      success: "Perfil actualizado correctamente.",
    });

    expect(requireAdmin).toHaveBeenCalledOnce();
    expect(from).toHaveBeenCalledWith("profiles");
    expect(update).toHaveBeenCalledWith({
      full_name: "Ada Lovelace",
    });
    expect(eq).toHaveBeenCalledWith("id", userId);
    expect(select).toHaveBeenCalledWith("id");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
    expect(revalidatePath).toHaveBeenCalledWith(
      `/admin/users/${userId}`,
    );
  });

  it("rechaza datos no válidos sin escribir en la base de datos", async () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000";

    const state = await updateAdminUserProfile(
      userId,
      {},
      makeFormData(userId, "   "),
    );

    expect(state.error).toBeTruthy();
    expect(update).not.toHaveBeenCalled();
    expect(requireAdmin).not.toHaveBeenCalled();
  });

  it("gestiona de forma segura un rechazo de permisos de la base de datos", async () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000";

    maybeSingle.mockResolvedValue({
      data: null,
      error: {
        code: "42501",
        message: "permission denied",
      },
    });

    await expect(
      updateAdminUserProfile(
        userId,
        {},
        makeFormData(userId, "Ada Lovelace"),
      ),
    ).resolves.toEqual({
      error: "No tienes permisos para modificar este perfil.",
    });

    expect(update).toHaveBeenCalledWith({
      full_name: "Ada Lovelace",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});